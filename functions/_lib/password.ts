import type { Env } from './types'

// Password hashing inside a Pages Function is bounded by the Workers CPU budget:
// 10 ms per request on the free plan (50 ms on paid). PBKDF2-SHA256 at 600k
// iterations - the OWASP recommendation - costs roughly 40-60 ms and trips
// Error 1102, so the default here is 50000 (~6-8 ms) with the iteration count
// stored per row: raising PBKDF2_ITERATIONS later is a secret change, and
// existing passwords are transparently re-hashed on their next successful login.
//
// A server-side pepper is applied first, outside the database, so a leaked D1
// dump alone is not enough to mount an offline crack.

const encoder = new TextEncoder()

export const DEFAULT_ITERATIONS = 50_000
export const MIN_ITERATIONS = 10_000
export const MAX_ITERATIONS = 1_000_000

export function iterationsFromEnv(env: Env): number {
  const parsed = Number.parseInt((env.PBKDF2_ITERATIONS || '').trim(), 10)
  if (!Number.isFinite(parsed)) return DEFAULT_ITERATIONS
  if (parsed < MIN_ITERATIONS) return MIN_ITERATIONS
  if (parsed > MAX_ITERATIONS) return MAX_ITERATIONS
  return parsed
}

export function pepperFromEnv(env: Env): string | null {
  const pepper = (env.PBKDF2_PEPPER || '').trim()
  return pepper.length >= 16 ? pepper : null
}

// The explicit Uint8Array<ArrayBuffer> return types matter: since TS 5.7 a bare
// Uint8Array is Uint8Array<ArrayBufferLike>, which is not assignable to the
// BufferSource that WebCrypto expects.
export function randomBytes(length: number): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bytes
}

export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

export function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function toBase64Url(bytes: Uint8Array): string {
  return toBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Length-independent comparison, so a wrong token cannot be discovered byte by
// byte from response timing.
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function hmacSha256(
  keyBytes: Uint8Array<ArrayBuffer>,
  message: Uint8Array<ArrayBuffer>,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, message)
  return new Uint8Array(signature)
}

export async function hashPassword(
  password: string,
  pepper: string,
  salt: Uint8Array<ArrayBuffer>,
  iterations: number,
): Promise<string> {
  // encoder.encode returns Uint8Array<ArrayBuffer> in TS 6, so this satisfies
  // hmacSha256's parameter type directly.
  const peppered = await hmacSha256(encoder.encode(pepper), encoder.encode(password))
  const key = await crypto.subtle.importKey('raw', peppered, 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  )
  return toBase64(new Uint8Array(bits))
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Session tokens are opaque random strings; only their hash is stored, so the
// database never holds anything that can be replayed as a credential.
export function newSessionToken(): string {
  return toBase64Url(randomBytes(32))
}

export function newSalt(): Uint8Array<ArrayBuffer> {
  return randomBytes(16)
}
