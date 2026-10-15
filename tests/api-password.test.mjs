import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_ITERATIONS,
  MAX_ITERATIONS,
  MIN_ITERATIONS,
  fromBase64,
  hashPassword,
  iterationsFromEnv,
  newSalt,
  newSessionToken,
  pepperFromEnv,
  sha256Hex,
  timingSafeEqual,
  toBase64,
} from '../functions/_lib/password.ts'

// Iteration counts are deliberately low here; the production default is 50000.
// These tests are about correctness of the scheme, not its cost.
const FAST = 1000
const PEPPER = 'test-pepper-long-enough'

test('the same password, salt, pepper and iteration count derive the same hash', async () => {
  const salt = new Uint8Array(16).fill(7)
  const first = await hashPassword('correct horse battery', PEPPER, salt, FAST)
  const second = await hashPassword('correct horse battery', PEPPER, salt, FAST)
  assert.equal(first, second)
})

test('a different salt produces a different hash', async () => {
  const a = await hashPassword('correct horse battery', PEPPER, new Uint8Array(16).fill(1), FAST)
  const b = await hashPassword('correct horse battery', PEPPER, new Uint8Array(16).fill(2), FAST)
  assert.notEqual(a, b)
})

test('a different pepper produces a different hash', async () => {
  const salt = new Uint8Array(16).fill(3)
  const a = await hashPassword('correct horse battery', PEPPER, salt, FAST)
  const b = await hashPassword('correct horse battery', 'a-different-pepper-value', salt, FAST)
  assert.notEqual(a, b)
})

test('a different iteration count produces a different hash', async () => {
  const salt = new Uint8Array(16).fill(4)
  const a = await hashPassword('correct horse battery', PEPPER, salt, 1000)
  const b = await hashPassword('correct horse battery', PEPPER, salt, 2000)
  assert.notEqual(a, b)
})

test('the wrong password does not verify', async () => {
  const salt = newSalt()
  const stored = await hashPassword('the-right-password', PEPPER, salt, FAST)
  const attempt = await hashPassword('the-wrong-password', PEPPER, salt, FAST)
  assert.notEqual(attempt, stored)
})

test('peppering happens before PBKDF2, so the raw password never reaches the KDF', async () => {
  // Two different passwords that HMAC to different values must not collide.
  const salt = new Uint8Array(16).fill(9)
  const a = await hashPassword('password-one-aaaaaaaa', PEPPER, salt, FAST)
  const b = await hashPassword('password-two-bbbbbbbb', PEPPER, salt, FAST)
  assert.notEqual(a, b)
})

test('salt round-trips through base64', async () => {
  const salt = newSalt()
  assert.deepEqual([...fromBase64(toBase64(salt))], [...salt])
})

test('newSalt returns 16 distinct bytes each time', () => {
  const a = newSalt()
  const b = newSalt()
  assert.equal(a.length, 16)
  assert.notDeepEqual([...a], [...b])
})

test('session tokens are unique, URL safe and long enough', () => {
  const tokens = new Set()
  for (let i = 0; i < 50; i += 1) {
    const token = newSessionToken()
    assert.match(token, /^[A-Za-z0-9_-]{43}$/, `unexpected token shape: ${token}`)
    tokens.add(token)
  }
  assert.equal(tokens.size, 50)
})

test('sha256Hex is deterministic and hex shaped', async () => {
  assert.equal(await sha256Hex('abc'), await sha256Hex('abc'))
  assert.notEqual(await sha256Hex('abc'), await sha256Hex('abd'))
  assert.match(await sha256Hex('abc'), /^[0-9a-f]{64}$/)
})

test('timingSafeEqual compares by value and rejects length mismatches', () => {
  assert.equal(timingSafeEqual('abc', 'abc'), true)
  assert.equal(timingSafeEqual('abc', 'abd'), false)
  assert.equal(timingSafeEqual('abc', 'abcd'), false)
  assert.equal(timingSafeEqual('', ''), true)
})

test('pepperFromEnv rejects anything that is too short to be useful', () => {
  assert.equal(pepperFromEnv({ DB: null }), null)
  assert.equal(pepperFromEnv({ DB: null, PBKDF2_PEPPER: '' }), null)
  assert.equal(pepperFromEnv({ DB: null, PBKDF2_PEPPER: 'short' }), null)
  assert.equal(pepperFromEnv({ DB: null, PBKDF2_PEPPER: 'x'.repeat(16) }), 'x'.repeat(16))
})

test('iterationsFromEnv defaults, clamps and parses', () => {
  assert.equal(iterationsFromEnv({ DB: null }), DEFAULT_ITERATIONS)
  assert.equal(
    iterationsFromEnv({ DB: null, PBKDF2_ITERATIONS: 'not-a-number' }),
    DEFAULT_ITERATIONS,
  )
  assert.equal(iterationsFromEnv({ DB: null, PBKDF2_ITERATIONS: '250000' }), 250000)
  assert.equal(iterationsFromEnv({ DB: null, PBKDF2_ITERATIONS: '1' }), MIN_ITERATIONS)
  assert.equal(iterationsFromEnv({ DB: null, PBKDF2_ITERATIONS: '99999999' }), MAX_ITERATIONS)
})
