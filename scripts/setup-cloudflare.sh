#!/usr/bin/env bash
#
# One-time Cloudflare setup for the blog API: D1 database, Pages project, the
# PBKDF2 pepper, remote migrations and the first deploy.
#
#   bash scripts/setup-cloudflare.sh --dry-run     # print the plan, change nothing
#   bash scripts/setup-cloudflare.sh               # do it
#
# Safe to re-run: every step checks for existing state first.
#
# Two things this cannot do for you (both need your browser):
#   1. Create the Cloudflare account and authorise wrangler:
#        npx wrangler login
#   2. Download the Firebase service account key, for the comment export.
#
# Overridable:
#   PROJECT_NAME=blog-api  D1_NAME=blog-comments  D1_LOCATION=apac
#   ADMIN_EMAIL=you@example.com   (promotes that account once it has registered)

set -uo pipefail

PROJECT_NAME="${PROJECT_NAME:-blog-api}"
D1_NAME="${D1_NAME:-blog-comments}"
# apac is the closest D1 region to mainland China.
D1_LOCATION="${D1_LOCATION:-apac}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"
ORIGIN="${ORIGIN:-https://ekegukeku64-blip.github.io}"

DRY_RUN="false"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="true" ;;
    -h|--help) sed -n '3,20p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) printf 'unknown option: %s\n' "$arg" >&2; exit 2 ;;
  esac
done

say() { printf '%s\n' "$*"; }
step() { printf '\n==> %s\n' "$*"; }
warn() { printf 'warning: %s\n' "$*" >&2; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

[ -f wrangler.toml ] || die "run this from the blog repo root (wrangler.toml not found)"

# Prefer the pinned devDependency over a global/npx copy.
if [ -f node_modules/wrangler/bin/wrangler.js ]; then
  W=(node node_modules/wrangler/bin/wrangler.js)
elif command -v wrangler >/dev/null 2>&1; then
  W=(wrangler)
else
  die "wrangler not found - run: npm install"
fi

if [ "$DRY_RUN" = "true" ]; then
  say "dry run - nothing will be created or changed. Plan:"
  say ""
  say "  1. ${W[*]} whoami                       # require a logged-in account"
  say "  2. ${W[*]} d1 list --json              # find ${D1_NAME}, or create it with:"
  say "       ${W[*]} d1 create ${D1_NAME} --location ${D1_LOCATION}"
  say "  3. write that database_id into wrangler.toml"
  say "  4. ${W[*]} pages project list --json   # find ${PROJECT_NAME}, or create it with:"
  say "       ${W[*]} pages project create ${PROJECT_NAME} --production-branch main"
  say "  5. set PBKDF2_PEPPER (generated, never printed unless wrangler needs it typed)"
  say "  6. ${W[*]} d1 migrations apply ${D1_NAME} --remote"
  say "  7. npm run build:api && ${W[*]} pages deploy .pages-dist --project-name ${PROJECT_NAME} --branch main"
  say ""
  say "Still manual afterwards: the PUBLIC_API_BASE repo variable, CLOUDFLARE_API_TOKEN"
  say "and CLOUDFLARE_ACCOUNT_ID repo secrets, and registering the admin account."
  exit 0
fi

step "checking the Cloudflare session"
# `wrangler whoami` exits 0 even when it is not authenticated - it just prints
# "You are not authenticated" - so the exit status alone cannot gate this.
WHOAMI="$("${W[@]}" whoami 2>&1)" || true
if printf '%s' "$WHOAMI" | grep -qiE 'not authenticated|not logged in'; then
  die "not logged in - run: npx wrangler login"
fi
if ! printf '%s' "$WHOAMI" | grep -qi 'account'; then
  printf '%s\n' "$WHOAMI" | sed 's/^/  /'
  die "could not confirm a logged-in account from the output above"
fi
printf '%s\n' "$WHOAMI" | sed 's/^/  /'

# Shared extractors. Both print __PARSE_ERROR__ rather than an empty string on a
# malformed response, so a swallowed failure is never mistaken for "not found".
D1_LIST_EXTRACTOR='
let raw = "";
process.stdin.on("data", (d) => (raw += d)).on("end", () => {
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.result || parsed.databases || [];
    const hit = list.find((db) => db && db.name === process.argv[1]);
    process.stdout.write(hit && hit.uuid ? hit.uuid : "");
  } catch {
    process.stdout.write("__PARSE_ERROR__");
  }
});'

list_d1_uuid() {
  printf '%s' "$1" | node -e "$D1_LIST_EXTRACTOR" "$D1_NAME"
}

step "D1 database: ${D1_NAME}"
DB_LIST="$("${W[@]}" d1 list --json 2>&1)" || true
DB_ID="$(list_d1_uuid "$DB_LIST")"
[ "$DB_ID" != "__PARSE_ERROR__" ] || die "could not parse the D1 list response:
$DB_LIST"

if [ -z "$DB_ID" ]; then
  say "  not found, creating it (location: ${D1_LOCATION})"
  "${W[@]}" d1 create "$D1_NAME" --location "$D1_LOCATION" || die "d1 create failed"
  DB_LIST="$("${W[@]}" d1 list --json 2>&1)" || true
  DB_ID="$(list_d1_uuid "$DB_LIST")"
  if [ -z "$DB_ID" ] || [ "$DB_ID" = "__PARSE_ERROR__" ]; then
    die "created the database but could not read its UUID back - set database_id in wrangler.toml by hand"
  fi
fi
say "  uuid: ${DB_ID}"

step "writing the database_id into wrangler.toml"
node -e '
const fs = require("fs");
const path = "wrangler.toml";
const id = process.argv[1];
const text = fs.readFileSync(path, "utf8");
if (text.includes(id)) { console.log("  already up to date"); process.exit(0); }
const next = text.replace(/^(\s*database_id\s*=\s*).*$/m, `$1"${id}"`);
if (next === text) { console.error("  could not find a database_id line to replace"); process.exit(1); }
fs.writeFileSync(path, next);
console.log("  patched");
' "$DB_ID" || die "failed to patch wrangler.toml"

step "Pages project: ${PROJECT_NAME}"
PROJECTS="$("${W[@]}" pages project list --json 2>&1)" || true
PROJECT_PRESENCE="$(printf '%s' "$PROJECTS" | node -e '
let raw = "";
process.stdin.on("data", (d) => (raw += d)).on("end", () => {
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.result || [];
    // `pages project list --json` emits display-formatted keys ("Project Name"),
    // unlike `d1 list --json` which emits name/uuid. Accept both.
    const nameOf = (p) => (p && (p.name || p["Project Name"])) || "";
    process.stdout.write(list.some((p) => nameOf(p) === process.argv[1]) ? "yes" : "no");
  } catch {
    process.stdout.write("__PARSE_ERROR__");
  }
});' "$PROJECT_NAME")"
[ "$PROJECT_PRESENCE" != "__PARSE_ERROR__" ] || die "could not parse the Pages project list response:
$PROJECTS"

if [ "$PROJECT_PRESENCE" = "yes" ]; then
  say "  exists"
else
  say "  not found, creating it"
  # "already exists" is success: the list can lag a just-created project, and a
  # previous run may have created it.
  CREATE_OUT="$("${W[@]}" pages project create "$PROJECT_NAME" --production-branch main 2>&1)" || {
    case "$CREATE_OUT" in
      *"already exists"*) say "  already exists" ;;
      *) say "$CREATE_OUT"; die "pages project create failed" ;;
    esac
  }
  case "$CREATE_OUT" in
    *"already exists"*) ;;
    *) say "  created" ;;
  esac
fi

step "PBKDF2_PEPPER secret"
if "${W[@]}" pages secret list --project-name "$PROJECT_NAME" 2>/dev/null | grep -q 'PBKDF2_PEPPER'; then
  say "  already set"
else
  PEPPER="$(node -e 'process.stdout.write(require("crypto").randomBytes(32).toString("base64"))')"
  say "  setting a freshly generated 32-byte pepper"
  if printf '%s' "$PEPPER" | "${W[@]}" pages secret put PBKDF2_PEPPER --project-name "$PROJECT_NAME" >/dev/null 2>&1; then
    say "  set"
  else
    warn "wrangler would not take the value from stdin. Run this yourself and paste it:"
    say ""
    say "    printf '%s' '$PEPPER' | ${W[*]} pages secret put PBKDF2_PEPPER --project-name $PROJECT_NAME"
    say ""
    say "  (that pepper is shown once - store it somewhere safe before you close this window)"
    die "stopping so the secret is not half-configured"
  fi
fi

step "applying D1 migrations (remote)"
"${W[@]}" d1 migrations apply "$D1_NAME" --remote || die "migrations failed"

step "building and deploying the API"
npm run build:api || die "build:api failed"
DEPLOY_OUT="$("${W[@]}" pages deploy .pages-dist --project-name "$PROJECT_NAME" --branch main 2>&1)" \
  || { say "$DEPLOY_OUT"; die "pages deploy failed"; }
say "$DEPLOY_OUT" | grep -Ei 'https://[a-z0-9.-]+\.pages\.dev' | tail -n 3 | sed 's/^/  /'

# The URL wrangler prints is the per-deployment alias (<hash>.<project>.pages.dev)
# and changes on every deploy, so it must NOT go into PUBLIC_API_BASE. The stable
# one is the project's production domain - which can carry a suffix when the
# plain <project>.pages.dev name is already taken globally.
API_URL="$( "${W[@]}" pages project list --json 2>/dev/null | node -e '
let raw = "";
process.stdin.on("data", (d) => (raw += d)).on("end", () => {
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.result || [];
    const nameOf = (p) => (p && (p.name || p["Project Name"])) || "";
    const hit = list.find((p) => nameOf(p) === process.argv[1]);
    const domains = (hit && (hit.domains || hit["Project Domains"])) || "";
    process.stdout.write(domains ? `https://${String(domains).split(",")[0].trim()}` : "");
  } catch {
    process.stdout.write("");
  }
});' "$PROJECT_NAME" )" || true
if [ -z "$API_URL" ]; then
  API_URL="$(printf '%s' "$DEPLOY_OUT" | grep -Eio 'https://[a-z0-9.-]+\.pages\.dev' | tail -n 1)"
  [ -n "$API_URL" ] && warn "falling back to the deployment URL, which changes on every deploy"
fi
[ -n "$API_URL" ] || API_URL="https://${PROJECT_NAME}.pages.dev"

say ""
say "================================================================"
say "API deployed: ${API_URL}"
say "================================================================"
say ""
say "Remaining steps (only these need your hands):"
say ""
say "  1. GitHub repo variable  PUBLIC_API_BASE = ${API_URL}"
say "     Settings -> Secrets and variables -> Actions -> Variables"
say ""
say "  2. GitHub repo secrets   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID"
say "     so .github/workflows/deploy-api.yml can deploy on push"
say ""
say "  3. .env: set PUBLIC_API_BASE=${API_URL} (used by local builds)"
say ""
say "  4. Verify production:"
say "       bash scripts/verify-api.sh ${API_URL}"
say ""
if [ -n "$ADMIN_EMAIL" ]; then
  say "  5. Promote the admin (after that address has registered once):"
  say "       ${W[*]} d1 execute ${D1_NAME} --remote --command \\"
  say "         \"INSERT OR IGNORE INTO admins (user_id, created_at, note) SELECT id, 0, 'owner' FROM users WHERE email_lower='${ADMIN_EMAIL}'\""
else
  say "  5. Promote the admin once your address has registered once"
  say "     (re-run with ADMIN_EMAIL=you@example.com to print the exact command)"
fi
say ""
say "  6. Export the old comments (needs the Firebase service account key):"
say "       npm run export:comments && npm run migrate:comments"
say "       ${W[*]} d1 execute ${D1_NAME} --remote --file=scripts/data/migrate-comments.sql"
say ""
say "CORS allowlist currently covers ${ORIGIN} and localhost:4321."
say "Add more origins with: ${W[*]} pages secret put ALLOWED_ORIGINS --project-name ${PROJECT_NAME}"
