#!/usr/bin/env bash
#
# End-to-end checks for the auth + comments API. The point of this script is the
# authorization assertions: every case below corresponds to a constraint that
# firestore.rules used to enforce, and a regression here is a real security bug.
#
#   npm run api:dev                       # in one terminal
#   bash scripts/verify-api.sh            # in another
#
# Against a deployment:
#   bash scripts/verify-api.sh https://blog-api.pages.dev
#
# Optional: export ADMIN_TOKEN=<token of a promoted admin> to also run the
# moderation assertions (creating an admin needs a one-off wrangler command, see
# the plan / README).
#
# Note: registration is rate limited to 10/hour per IP, so running this script
# more than a few times in an hour against the same instance will trip the
# limiter. Locally you can reset it with:
#   npx wrangler d1 execute blog-comments --local \
#     --command "DELETE FROM rate_limits"

set -uo pipefail

BASE="${1:-http://127.0.0.1:8788}"
ORIGIN="${ORIGIN:-https://ekegukeku64-blip.github.io}"
# Seconds alone collide when the script runs twice in a row (or CI retries), and a
# duplicate registration would then fail the whole run. $$ adds the process id.
STAMP="$(date +%s)-$$"

PASS=0
FAIL=0

pass() { PASS=$((PASS + 1)); printf '  PASS  %s\n' "$1"; }
fail() { FAIL=$((FAIL + 1)); printf '  FAIL  %s\n         expected: %s\n         actual:   %s\n' "$1" "$2" "$3"; }
check() { if [ "$2" = "$3" ]; then pass "$1"; else fail "$1" "$2" "$3"; fi; }

# status of a request; extra curl args come after
status() { curl -s -o /dev/null -w '%{http_code}' "$@"; }

# pull a value out of a JSON response body read from stdin: json <dotted.path>
json() {
  node -e "
let raw='';
process.stdin.on('data',(d)=>raw+=d).on('end',()=>{
  try { let v=JSON.parse(raw); for (const k of process.argv[1].split('.')) v = v?.[k];
        console.log(v === undefined || v === null ? '' : String(v)) } catch { console.log('') }
});" "$1"
}

echo "verify-api: $BASE"
echo

echo "CORS"
# grep -i + sed instead of awk IGNORECASE: BSD awk (macOS) has no IGNORECASE.
ACAO="$(curl -s -D - -o /dev/null -X OPTIONS "$BASE/api/comments" \
  -H "Origin: $ORIGIN" -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: Authorization, Content-Type' \
  | tr -d '\r' | grep -i '^access-control-allow-origin:' | head -n 1 \
  | sed 's/^[^:]*:[[:space:]]*//')"
check "preflight from the site origin echoes that exact origin" "$ORIGIN" "$ACAO"

check "preflight returns 204" "204" "$(status -X OPTIONS "$BASE/api/comments" -H "Origin: $ORIGIN")"

EVIL_ACAO="$(curl -s -D - -o /dev/null -X OPTIONS "$BASE/api/comments" \
  -H 'Origin: https://evil.example' -H 'Access-Control-Request-Method: POST' \
  | tr -d '\r' | grep -i '^access-control-allow-origin:' | head -n 1)"
check "preflight from an unknown origin gets no allow-origin header" "" "$EVIL_ACAO"

echo
echo "Unauthenticated reads"

check "comments without pageId is rejected" "400" "$(status "$BASE/api/comments")"

PAGE="/blog/verify-$STAMP/"
BEFORE="$(curl -s "$BASE/api/comments?pageId=$PAGE" | json comments.length)"
check "a fresh page has no comments" "0" "$BEFORE"

check "me without a token is 401" "401" "$(status "$BASE/api/auth/me")"
check "posting a comment without a token is 401" "401" \
  "$(status -X POST "$BASE/api/comments" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"pageId\":\"$PAGE\",\"content\":\"nope\"}")"

echo
echo "Registration and login"

EMAIL_A="verify-a-$STAMP@example.com"
EMAIL_B="verify-b-$STAMP@example.com"
PW="verify-password-$STAMP"

REG_A="$(curl -s -X POST "$BASE/api/auth/register" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL_A\",\"password\":\"$PW\",\"displayName\":\"Verifier A\"}")"
TOKEN_A="$(printf '%s' "$REG_A" | json token)"
check "register returns a token" "yes" "$([ -n "$TOKEN_A" ] && echo yes || echo no)"
check "new account is not an admin" "false" "$(printf '%s' "$REG_A" | json user.isAdmin)"

TOKEN_B="$(curl -s -X POST "$BASE/api/auth/register" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL_B\",\"password\":\"$PW\",\"displayName\":\"Verifier B\"}" | json token)"

check "duplicate email is rejected" "409" \
  "$(status -X POST "$BASE/api/auth/register" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"email\":\"$EMAIL_A\",\"password\":\"$PW\",\"displayName\":\"Copycat\"}")"

check "short password is rejected" "400" \
  "$(status -X POST "$BASE/api/auth/register" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"email\":\"short-$STAMP@example.com\",\"password\":\"12345\",\"displayName\":\"X\"}")"

check "unknown field is rejected" "400" \
  "$(status -X POST "$BASE/api/auth/register" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"email\":\"x-$STAMP@example.com\",\"password\":\"$PW\",\"displayName\":\"X\",\"isAdmin\":true}")"

check "me with a valid token returns the account" "$EMAIL_A" \
  "$(curl -s "$BASE/api/auth/me" -H "Authorization: Bearer $TOKEN_A" | json user.email)"

check "wrong password is 401" "401" \
  "$(status -X POST "$BASE/api/auth/login" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"email\":\"$EMAIL_A\",\"password\":\"definitely-wrong\"}")"

check "unknown account is also 401 (no enumeration)" "401" \
  "$(status -X POST "$BASE/api/auth/login" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
     -d "{\"email\":\"nobody-$STAMP@example.com\",\"password\":\"$PW\"}")"

TOKEN_A="$(curl -s -X POST "$BASE/api/auth/login" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL_A\",\"password\":\"$PW\"}" | json token)"
check "login with the right password returns a token" "yes" "$([ -n "$TOKEN_A" ] && echo yes || echo no)"

echo
echo "Comment write path"

check "empty content is rejected" "400" \
  "$(status -X POST "$BASE/api/comments" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
     -H 'Content-Type: application/json' -d "{\"pageId\":\"$PAGE\",\"content\":\"\"}")"

OVERSIZE="$(node -e 'process.stdout.write("a".repeat(2001))')"
check "content over 2000 bytes is rejected" "400" \
  "$(status -X POST "$BASE/api/comments" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
     -H 'Content-Type: application/json' -d "{\"pageId\":\"$PAGE\",\"content\":\"$OVERSIZE\"}")"

check "status cannot be forged on create" "400" \
  "$(status -X POST "$BASE/api/comments" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
     -H 'Content-Type: application/json' \
     -d "{\"pageId\":\"$PAGE\",\"content\":\"hi\",\"status\":\"approved\"}")"

CREATED="$(curl -s -X POST "$BASE/api/comments" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' -d "{\"pageId\":\"$PAGE\",\"content\":\"verification comment\"}")"
COMMENT_ID="$(printf '%s' "$CREATED" | json comment.id)"
check "a new comment is pending" "pending" "$(printf '%s' "$CREATED" | json comment.status)"

check "pending comments are NOT publicly readable" "0" \
  "$(curl -s "$BASE/api/comments?pageId=$PAGE" | json comments.length)"

echo
echo "Authorization boundaries"

check "author cannot approve their own comment" "403" \
  "$(status -X PATCH "$BASE/api/comments/$COMMENT_ID" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
     -H 'Content-Type: application/json' -d '{"status":"approved"}')"

check "author cannot rewrite the comment body via PATCH" "403" \
  "$(status -X PATCH "$BASE/api/comments/$COMMENT_ID" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_A" \
     -H 'Content-Type: application/json' -d '{"content":"rewritten"}')"

check "a different user cannot delete the comment" "403" \
  "$(status -X DELETE "$BASE/api/comments/$COMMENT_ID" -H "Origin: $ORIGIN" -H "Authorization: Bearer $TOKEN_B")"

check "the moderation list is admin-only" "403" \
  "$(status "$BASE/api/admin/comments" -H "Authorization: Bearer $TOKEN_A")"

echo
echo "Rate limiting"
CODES=""
# A while loop rather than `seq`: macOS does not ship seq(1).
attempt=1
while [ "$attempt" -le 12 ]; do
  CODES="$CODES$(status -X POST "$BASE/api/auth/login" -H "Origin: $ORIGIN" -H 'Content-Type: application/json' \
    -d "{\"email\":\"$EMAIL_A\",\"password\":\"wrong-on-purpose\"}") "
  attempt=$((attempt + 1))
done
case "$CODES" in
  *429*) pass "repeated failed logins eventually return 429 ($CODES)" ;;
  *) fail "repeated failed logins eventually return 429" "a 429 somewhere in 12 attempts" "$CODES" ;;
esac

if [ -n "${ADMIN_TOKEN:-}" ]; then
  echo
  echo "Admin path (ADMIN_TOKEN supplied)"
  check "admin sees the pending comment" "$COMMENT_ID" \
    "$(curl -s "$BASE/api/admin/comments" -H "Authorization: Bearer $ADMIN_TOKEN" \
       | node -e "
let raw='';process.stdin.on('data',d=>raw+=d).on('end',()=>{
  try { const list=JSON.parse(raw).comments||[]; const hit=list.find((c)=>c.id===process.argv[1]); console.log(hit?hit.id:'') } catch { console.log('') }
});" "$COMMENT_ID")"

  check "admin can approve" "200" \
    "$(status -X PATCH "$BASE/api/comments/$COMMENT_ID" -H "Origin: $ORIGIN" -H "Authorization: Bearer $ADMIN_TOKEN" \
       -H 'Content-Type: application/json' -d '{"status":"approved"}')"

  check "approved comment is now publicly visible" "1" \
    "$(curl -s "$BASE/api/comments?pageId=$PAGE" | json comments.length)"
else
  echo
  echo "Admin path skipped (export ADMIN_TOKEN=<token> to include it)"
fi

echo
printf 'verify-api: %s passed, %s failed\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
