// Turn a Firestore `comments` export into SQL for the new D1 database.
//
//   node --experimental-strip-types scripts/migrate-firestore-comments.mjs [input.json]
//   # or: npm run migrate:comments
//   npx wrangler d1 execute blog-comments --remote --file=scripts/data/migrate-comments.sql
//
// Accepted input shapes (all JSON unless noted):
//   - [ { id, pageId, uid, displayName, photoURL, content, status, createdAt } , ... ]
//   - { documents: [ { name, fields: { pageId: { stringValue }, ... } } ] }   (Firestore REST)
//   - one JSON object per line (the shape `gcloud firestore export` writes)
//
// Timestamps may be { _seconds, _nanoseconds } (Admin SDK), { seconds, nanoseconds },
// an ISO string, or epoch milliseconds.
//
// Every row is re-validated against the same rules the API enforces: anything that
// does not fit is written to migrate-comments.rejects.json instead of the SQL, so
// nothing silently lands in the database in a shape the API would have refused.
//
// Migrated rows have user_id NULL - a Firebase UID is not an account in the new
// system - so only an admin can moderate or delete them afterwards.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

import {
  cleanCommentId,
  cleanContent,
  cleanDisplayName,
  cleanPageId,
  cleanPhotoUrl,
  isCommentStatus,
} from '../functions/_lib/validate.ts'

const DEFAULT_INPUT = 'scripts/data/firestore-export.json'

const inputPath = resolve(process.cwd(), process.argv[2] || DEFAULT_INPUT)
if (!existsSync(inputPath)) {
  console.error(`input not found: ${inputPath}`)
  console.error('see the header of this script for the accepted shapes')
  process.exit(1)
}

const outputDir = dirname(inputPath)
mkdirSync(outputDir, { recursive: true })

function parseInput(text) {
  const trimmed = text.trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
    if (Array.isArray(parsed.documents)) return parsed.documents
    // A single object that is not a documents wrapper: treat as one document.
    return [parsed]
  }
  // NDJSON: one object per line.
  return trimmed
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{'))
    .map((line) => JSON.parse(line))
}

// Firestore REST wraps every value in a type tag.
function unwrapREST(fields) {
  const out = {}
  for (const [key, value] of Object.entries(fields || {})) {
    if (value && typeof value === 'object') {
      const [type] = Object.keys(value)
      out[key] = value[type]
    } else {
      out[key] = value
    }
  }
  return out
}

function toMillis(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  if (typeof value === 'object') {
    const seconds = value._seconds ?? value.seconds
    const nanos = value._nanoseconds ?? value.nanoseconds ?? 0
    if (typeof seconds === 'number') return seconds * 1000 + Math.floor(nanos / 1e6)
  }
  return null
}

function normaliseRole(raw) {
  if (!raw) return null
  // REST shape: { name: 'projects/.../documents/comments/<id>' }
  if (typeof raw === 'object' && typeof raw.name === 'string') {
    return unwrapREST(raw.fields || {})
  }
  return raw
}

function stableIdFrom(originalId) {
  return createHash('sha256').update(String(originalId)).digest('hex').slice(0, 32)
}

const rows = parseInput(readFileSync(inputPath, 'utf8'))
const accepted = []
const rejected = []
let regeneratedIds = 0
let missingTimestamps = 0

for (const rawEntry of rows) {
  // The REST shape carries the document id in `name`, on the envelope rather
  // than in the field map, so read it before unwrapping the fields.
  const idFromEnvelope = typeof rawEntry?.name === 'string' ? rawEntry.name.split('/').pop() : ''

  const source = normaliseRole(rawEntry)

  const originalId = typeof source.id === 'string' && source.id !== '' ? source.id : idFromEnvelope

  const problems = []

  // Keep the original id when it already satisfies the schema; otherwise derive a
  // stable replacement so re-running the migration stays idempotent.
  let id = cleanCommentId(originalId)
  if (!id) {
    id = stableIdFrom(originalId || JSON.stringify(source).slice(0, 200))
    regeneratedIds += 1
  }

  const pageId = cleanPageId(source.pageId)
  if (!pageId) problems.push('pageId')

  const displayName = cleanDisplayName(source.displayName)
  if (!displayName) problems.push('displayName')

  const content = cleanContent(source.content)
  if (!content) problems.push('content')

  const photoURL = cleanPhotoUrl(source.photoURL === undefined ? '' : source.photoURL)
  if (photoURL === null) problems.push('photoURL')

  const status = isCommentStatus(source.status) ? source.status : null
  if (!status) problems.push('status')

  let createdAt = toMillis(source.createdAt)
  if (createdAt === null) {
    createdAt = Date.now()
    missingTimestamps += 1
  }

  if (problems.length > 0) {
    rejected.push({ id: originalId || null, problems, source })
    continue
  }

  // A Firebase UID is not an account here, so it is recorded for provenance only
  // and never treated as an owner.
  const legacyUid = typeof source.uid === 'string' && source.uid.length <= 128 ? source.uid : ''

  accepted.push({ id, pageId, displayName, photoURL, content, status, createdAt, legacyUid })
}

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`
}

const statements = accepted.map(
  (row) =>
    'INSERT OR IGNORE INTO comments (id, page_id, user_id, legacy_uid, display_name, photo_url, content, status, created_at) ' +
    `VALUES (${sqlString(row.id)}, ${sqlString(row.pageId)}, NULL, ` +
    `${row.legacyUid ? sqlString(row.legacyUid) : 'NULL'}, ${sqlString(row.displayName)}, ` +
    `${sqlString(row.photoURL)}, ${sqlString(row.content)}, ${sqlString(row.status)}, ${row.createdAt});`,
)

const sqlPath = resolve(outputDir, 'migrate-comments.sql')
writeFileSync(sqlPath, `${statements.join('\n')}\n`)

if (rejected.length > 0) {
  writeFileSync(
    resolve(outputDir, 'migrate-comments.rejects.json'),
    `${JSON.stringify(rejected, null, 2)}\n`,
  )
}

console.log(`read     ${rows.length} documents from ${inputPath}`)
console.log(`accepted ${accepted.length} -> ${sqlPath}`)
if (regeneratedIds > 0)
  console.log(
    `         ${regeneratedIds} id(s) regenerated (original did not match the id charset)`,
  )
if (missingTimestamps > 0)
  console.log(
    `         ${missingTimestamps} row(s) had no usable timestamp and got one assigned now`,
  )
if (rejected.length > 0) {
  console.log(
    `rejected ${rejected.length} -> ${resolve(outputDir, 'migrate-comments.rejects.json')}`,
  )
  console.log('         inspect the rejects file; those comments will not be migrated')
}
