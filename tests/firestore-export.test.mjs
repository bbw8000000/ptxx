import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'

const run = promisify(execFile)
const SCRIPT = resolve('scripts/export-firestore-comments.mjs')

// A throwaway RSA key stands in for the service account key, and a local HTTP
// server stands in for Google. This exercises the whole exporter - JWT signing,
// token exchange, pagination, output shape - without a credential or a network.
function makeKeyPair() {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  })
  return { privateKey, publicKey }
}

function doc(id, { content = 'hello', status = 'approved' } = {}) {
  return {
    name: `projects/demo/databases/(default)/documents/comments/${id}`,
    fields: {
      pageId: { stringValue: '/blog/x/' },
      uid: { stringValue: 'FIREBASE_UID' },
      displayName: { stringValue: 'Tester' },
      photoURL: { stringValue: '' },
      content: { stringValue: content },
      status: { stringValue: status },
      createdAt: { timestampValue: '2026-03-04T05:06:07Z' },
    },
  }
}

async function withFakeGoogle(handler, fn) {
  const server = createServer(handler)
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const { port } = server.address()
  try {
    return await fn(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((done) => server.close(done))
  }
}

test('signs a verifiable RS256 JWT and pages through Firestore', async () => {
  const { privateKey, publicKey } = makeKeyPair()
  const workdir = mkdtempSync(join(tmpdir(), 'export-test-'))
  mkdirSync(join(workdir, 'scripts', 'data'), { recursive: true })
  writeFileSync(
    join(workdir, 'scripts', 'data', 'firebase-service-account.json'),
    JSON.stringify({
      project_id: 'demo',
      client_email: 'svc@demo.iam.gserviceaccount.com',
      private_key: privateKey,
    }),
  )

  let assertionsSeen = 0
  let pagesServed = 0

  await withFakeGoogle(
    (req, res) => {
      if (req.url === '/token' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          const params = new URLSearchParams(body)
          const assertion = params.get('assertion')
          assert.equal(params.get('grant_type'), 'urn:ietf:params:oauth:grant-type:jwt-bearer')

          // Independently verify the signature with the matching public key: this is
          // the part that would silently break the real export.
          const [headerPart, claimsPart, signaturePart] = assertion.split('.')
          const ok = verify(
            'RSA-SHA256',
            Buffer.from(`${headerPart}.${claimsPart}`),
            createPublicKey(publicKey),
            Buffer.from(signaturePart, 'base64url'),
          )
          assert.equal(ok, true, 'JWT signature must verify against the public key')

          const header = JSON.parse(Buffer.from(headerPart, 'base64url').toString('utf8'))
          assert.equal(header.alg, 'RS256')
          const claims = JSON.parse(Buffer.from(claimsPart, 'base64url').toString('utf8'))
          assert.equal(claims.iss, 'svc@demo.iam.gserviceaccount.com')
          assert.equal(claims.scope, 'https://www.googleapis.com/auth/datastore')
          assert.ok(claims.exp > claims.iat)

          assertionsSeen += 1
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ access_token: 'fake-token', expires_in: 3600 }))
        })
        return
      }

      assert.match(req.url, /\/v1\/projects\/demo\/databases\/\(default\)\/documents\/comments/)
      assert.equal(req.headers.authorization, 'Bearer fake-token')

      // Two pages, to prove pageToken handling rather than a single happy fetch.
      pagesServed += 1
      if (pagesServed === 1) {
        assert.ok(!req.url.includes('pageToken'))
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            documents: [doc('a'), doc('b', { status: 'pending' })],
            nextPageToken: 'PAGE2',
          }),
        )
      } else {
        assert.ok(req.url.includes('pageToken=PAGE2'))
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ documents: [doc('c')] }))
      }
    },
    async (base) => {
      const { stdout } = await run(process.execPath, [SCRIPT], {
        cwd: workdir,
        env: { ...process.env, GOOGLE_TOKEN_URL: `${base}/token`, FIRESTORE_API_BASE: base },
      })
      assert.match(stdout, /wrote 3 document\(s\)/)
      assert.match(stdout, /approved=2, pending=1/)
    },
  )

  assert.equal(assertionsSeen, 1)
  assert.equal(pagesServed, 2)

  const written = JSON.parse(
    readFileSync(join(workdir, 'scripts', 'data', 'firestore-export.json'), 'utf8'),
  )
  assert.equal(written.documents.length, 3)
  // The migrate script reads this REST shape directly, so the field envelope
  // has to survive untouched.
  assert.equal(written.documents[0].fields.content.stringValue, 'hello')
  assert.equal(written.documents[1].fields.status.stringValue, 'pending')

  rmSync(workdir, { recursive: true, force: true })
})

test('--check-key validates the key without any network call', async () => {
  const { privateKey } = makeKeyPair()
  const workdir = mkdtempSync(join(tmpdir(), 'export-test-key-'))
  mkdirSync(join(workdir, 'scripts', 'data'), { recursive: true })
  writeFileSync(
    join(workdir, 'scripts', 'data', 'firebase-service-account.json'),
    JSON.stringify({
      project_id: 'demo',
      client_email: 'svc@demo.iam.gserviceaccount.com',
      private_key: privateKey,
    }),
  )

  const { stdout } = await run(process.execPath, [SCRIPT, '--check-key'], { cwd: workdir })
  assert.match(stdout, /JWT signed successfully/)
  assert.match(stdout, /auth\/datastore/)

  rmSync(workdir, { recursive: true, force: true })
})

test('a missing key file fails with an actionable message', async () => {
  const workdir = mkdtempSync(join(tmpdir(), 'export-test-missing-'))
  await assert.rejects(run(process.execPath, [SCRIPT], { cwd: workdir }), (error) => {
    assert.match(error.stderr, /service account key not found/)
    assert.match(error.stderr, /Project settings/)
    return true
  })
  rmSync(workdir, { recursive: true, force: true })
})

test('an incomplete key file is rejected before contacting Google', async () => {
  const workdir = mkdtempSync(join(tmpdir(), 'export-test-bad-'))
  mkdirSync(join(workdir, 'scripts', 'data'), { recursive: true })
  writeFileSync(
    join(workdir, 'scripts', 'data', 'firebase-service-account.json'),
    JSON.stringify({ project_id: 'demo' }),
  )

  await assert.rejects(
    run(process.execPath, [SCRIPT, '--check-key'], { cwd: workdir }),
    (error) => {
      assert.match(error.stderr, /missing "client_email"/)
      return true
    },
  )
  rmSync(workdir, { recursive: true, force: true })
})
