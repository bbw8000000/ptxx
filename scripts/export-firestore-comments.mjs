// Export the Firestore `comments` collection to JSON for the D1 migration.
//
//   node scripts/export-firestore-comments.mjs            # normal run
//   node scripts/export-firestore-comments.mjs --check-key # validate the key only
//   # or: npm run export:comments
//
// Writes scripts/data/firestore-export.json, which
// scripts/migrate-firestore-comments.mjs already knows how to read.
//
// ## One-time credential setup
//
// This needs a service account key, because there is no other way to read
// Firestore documents without billing: the CLI (firebase-tools 15.x) has no
// `firestore:export`, and managed export requires a Cloud Storage bucket.
//
//   1. https://console.firebase.google.com/project/<your-project>/settings/serviceaccounts/adminsdk
//   2. "Generate new private key" -> download the JSON
//   3. Save it as scripts/data/firebase-service-account.json
//   4. Delete it once the migration is done - it is a live credential for the
//      whole project. scripts/data/ is gitignored, so it will not be committed.
//
// ## Network
//
// Google is unreachable from mainland China without a proxy. If the token
// exchange times out, set HTTPS_PROXY first (e.g. a Clash sharing its port):
//   HTTPS_PROXY=http://127.0.0.1:7890 node scripts/export-firestore-comments.mjs
//
// No dependencies: the JWT is signed with node:crypto, so nothing is added to
// package.json for a one-time migration.

import { createSign } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const KEY_PATH = resolve(process.cwd(), 'scripts/data/firebase-service-account.json')
const OUT_PATH = resolve(process.cwd(), 'scripts/data/firestore-export.json')
const COLLECTION = 'comments'
const PAGE_SIZE = 300

// Overridable so this can run against the Firestore emulator, and so the test
// suite can point it at a local server instead of Google.
const TOKEN_URL = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token'
const API_BASE = process.env.FIRESTORE_API_BASE || 'https://firestore.googleapis.com'
const SCOPE = 'https://www.googleapis.com/auth/datastore'

const checkKeyOnly = process.argv.includes('--check-key')

function fail(message, hint) {
  console.error(`export-firestore-comments: ${message}`)
  if (hint) console.error(`  ${hint}`)
  process.exit(1)
}

if (!existsSync(KEY_PATH)) {
  fail(
    `service account key not found at ${KEY_PATH}`,
    'download one from Firebase console -> Project settings -> Service accounts -> Generate new private key',
  )
}

let key
try {
  key = JSON.parse(readFileSync(KEY_PATH, 'utf8'))
} catch (error) {
  fail(`could not parse the key file: ${error.message}`)
}

for (const field of ['project_id', 'client_email', 'private_key']) {
  if (typeof key[field] !== 'string' || key[field].length === 0) {
    fail(`the key file is missing "${field}" - is it really a service account key?`)
  }
}

console.log(`service account: ${key.client_email}`)
console.log(`project:         ${key.project_id}`)

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// The same RS256 flow google-auth-library implements, minus the dependency.
function signJwt({ clientEmail, privateKey }) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  )
  const signingInput = `${header}.${claims}`

  const signer = createSign('RSA-SHA256')
  signer.update(signingInput)
  const signature = signer.sign(privateKey)

  return `${signingInput}.${base64url(signature)}`
}

const assertion = signJwt({ clientEmail: key.client_email, privateKey: key.private_key })

if (checkKeyOnly) {
  // Proves the private key is usable without contacting Google at all.
  const [, claimsPart] = assertion.split('.')
  const claims = JSON.parse(Buffer.from(claimsPart, 'base64url').toString('utf8'))
  console.log('\nkey check: JWT signed successfully (no network call made)')
  console.log(`  scope: ${claims.scope}`)
  console.log(`  expires: ${new Date(claims.exp * 1000).toISOString()}`)
  process.exit(0)
}

async function getAccessToken() {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    fail(
      `token exchange failed (HTTP ${response.status})`,
      detail.slice(0, 300) ||
        'check that the service account still exists and the system clock is correct',
    )
  }

  const payload = await response.json()
  if (!payload.access_token) fail('token exchange returned no access_token')
  return payload.access_token
}

async function fetchPage(accessToken, pageToken) {
  const url = new URL(
    `${API_BASE}/v1/projects/${key.project_id}/databases/(default)/documents/${COLLECTION}`,
  )
  url.searchParams.set('pageSize', String(PAGE_SIZE))
  if (pageToken) url.searchParams.set('pageToken', pageToken)

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    fail(
      `Firestore read failed (HTTP ${response.status})`,
      `${detail.slice(0, 300)}\n  if this is a timeout or DNS error, Google is unreachable from here - set HTTPS_PROXY`,
    )
  }

  return response.json()
}

console.log('\nrequesting an access token...')
const accessToken = await getAccessToken()

const documents = []
let pageToken = undefined
let page = 0

do {
  page += 1
  const body = await fetchPage(accessToken, pageToken)
  const batch = body.documents || []
  documents.push(...batch)
  pageToken = body.nextPageToken
  console.log(`  page ${page}: ${batch.length} document(s), ${documents.length} total`)
} while (pageToken)

mkdirSync(dirname(OUT_PATH), { recursive: true })
writeFileSync(OUT_PATH, `${JSON.stringify({ documents }, null, 2)}\n`)

const statuses = {}
for (const doc of documents) {
  const status = doc?.fields?.status?.stringValue || '(missing)'
  statuses[status] = (statuses[status] || 0) + 1
}

console.log(`\nwrote ${documents.length} document(s) to ${OUT_PATH}`)
console.log(
  `statuses: ${Object.entries(statuses)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')}`,
)
console.log('\nnext: npm run migrate:comments')
console.log('then delete scripts/data/firebase-service-account.json - it is a live credential.')
