import type { Env } from './types'

// Fixed-window counters in D1. Login and registration are the only endpoints
// that need this; both are abuse targets (credential stuffing, mass account
// creation) and neither is safe without it.

export interface LimitRule {
  bucket: string
  windowMs: number
  max: number
}

export const MINUTE = 60_000
export const HOUR = 60 * MINUTE

// 10 attempts/minute and 100/hour per IP and per email. Generous enough for a
// shared/CGNAT address, tight enough to make guessing useless.
export function loginRules(ip: string, email: string): LimitRule[] {
  return [
    { bucket: `login:ip:${ip}`, windowMs: MINUTE, max: 10 },
    { bucket: `login:ip:${ip}`, windowMs: HOUR, max: 100 },
    { bucket: `login:email:${email}`, windowMs: MINUTE, max: 10 },
    { bucket: `login:email:${email}`, windowMs: HOUR, max: 100 },
  ]
}

// 10/hour and 50/day per IP: tight enough to make mass account creation
// pointless, loose enough that a shared campus or CGNAT address still works.
export function registerRules(ip: string): LimitRule[] {
  return [
    { bucket: `register:ip:${ip}`, windowMs: HOUR, max: 10 },
    { bucket: `register:ip:${ip}`, windowMs: 24 * HOUR, max: 50 },
  ]
}

// Changing a password means presenting the old one, which makes this endpoint an
// online oracle for guessing it. Only the IP is counted: throttling per account
// would let anyone lock a user out of their own password change.
export function passwordChangeRules(ip: string): LimitRule[] {
  return [
    { bucket: `password:ip:${ip}`, windowMs: MINUTE, max: 10 },
    { bucket: `password:ip:${ip}`, windowMs: HOUR, max: 30 },
  ]
}

// Comment creation is limited per account *and* per IP. The account bucket alone
// is trivially bypassed by registering another account; the IP bucket is what
// actually slows a spammer down. Kept looser than login so a shared campus or
// CGNAT address is not locked out of commenting.
export function commentRules(ip: string, userId: string): LimitRule[] {
  return [
    { bucket: `comment:user:${userId}`, windowMs: HOUR, max: 30 },
    { bucket: `comment:ip:${ip}`, windowMs: HOUR, max: 60 },
    { bucket: `comment:ip:${ip}`, windowMs: 24 * HOUR, max: 300 },
  ]
}

// Translation spends money on every cache miss, so it needs a ceiling that
// comment posting does not. Counted per IP only: there is no account here (the
// whole point is that readers who cannot use GitHub/browser translation still
// get Chinese), and a per-account bucket would just be bypassed by not logging
// in. 20/minute is far above human reading pace; 300/day keeps a scripted caller
// from running up a bill while still covering a shared campus address.
export function translateRules(ip: string): LimitRule[] {
  return [
    { bucket: `translate:ip:${ip}`, windowMs: MINUTE, max: 20 },
    { bucket: `translate:ip:${ip}`, windowMs: 24 * HOUR, max: 300 },
  ]
}

export interface LimitVerdict {
  ok: boolean
  retryAfterSeconds: number
}

// Increments every counter before deciding, so a burst cannot slip through by
// racing several requests past a read-then-write check.
export async function checkLimits(env: Env, rules: LimitRule[]): Promise<LimitVerdict> {
  const now = Date.now()
  let worstRetry = 0

  for (const rule of rules) {
    const windowStart = Math.floor(now / rule.windowMs) * rule.windowMs
    const row = await env.DB.prepare(
      `INSERT INTO rate_limits (bucket, window_start, count)
       VALUES (?1, ?2, 1)
       ON CONFLICT (bucket, window_start) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
      .bind(rule.bucket, windowStart)
      .first<{ count: number }>()

    const count = row?.count ?? 0
    if (count > rule.max) {
      const retry = Math.max(1, Math.ceil((windowStart + rule.windowMs - now) / 1000))
      if (retry > worstRetry) worstRetry = retry
    }
  }

  if (worstRetry > 0) return { ok: false, retryAfterSeconds: worstRetry }
  return { ok: true, retryAfterSeconds: 0 }
}

// Counters are only ever written by the auth endpoints, so the table stays
// small and this cheap sweep is enough to stop unbounded growth.
export async function purgeOldCounters(env: Env): Promise<void> {
  const cutoff = Date.now() - 48 * HOUR
  await env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?1').bind(cutoff).run()
}

export function clientIp(request: Request): string {
  // Set by Cloudflare's edge; a client cannot forge it through the proxy.
  return request.headers.get('CF-Connecting-IP') || 'unknown'
}
