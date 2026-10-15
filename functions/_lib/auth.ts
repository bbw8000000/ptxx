import type { Ctx, Env } from './types'
import { fail } from './http'
import { newSessionToken, sha256Hex } from './password'

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export interface SessionUser {
  id: string
  email: string
  displayName: string
  photoURL: string
  isAdmin: boolean
}

export interface PublicUser {
  uid: string
  email: string
  displayName: string
  photoURL: string
  isAdmin: boolean
}

export function toPublicUser(user: SessionUser): PublicUser {
  return {
    uid: user.id,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAdmin: user.isAdmin,
  }
}

interface SessionRow {
  id: string
  email: string
  display_name: string
  photo_url: string
  expires_at: number
  admin_count: number
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization') || ''
  const match = /^Bearer\s+(\S+)$/i.exec(header)
  return match ? match[1] : null
}

// Only the SHA-256 of a token is ever stored, so a database dump cannot be
// replayed as a login.
export async function createSession(
  env: Env,
  userId: string,
): Promise<{ token: string; expiresAt: number }> {
  const token = newSessionToken()
  const tokenHash = await sha256Hex(token)
  const now = Date.now()
  const expiresAt = now + SESSION_TTL_MS

  await env.DB.prepare('DELETE FROM sessions WHERE expires_at < ?1').bind(now).run()
  await env.DB.prepare(
    `INSERT INTO sessions (token_hash, user_id, created_at, expires_at, last_seen_at)
     VALUES (?1, ?2, ?3, ?4, ?3)`,
  )
    .bind(tokenHash, userId, now, expiresAt)
    .run()

  return { token, expiresAt }
}

export async function deleteSessionByToken(request: Request, env: Env): Promise<void> {
  const token = bearerToken(request)
  if (!token) return
  const tokenHash = await sha256Hex(token)
  await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(tokenHash).run()
}

// Revokes every session of a user. `keepTokenHash` keeps one alive, which is what
// a password change wants: other devices are signed out, the device that made the
// change stays logged in.
export async function deleteSessionsForUser(
  env: Env,
  userId: string,
  keepTokenHash?: string,
): Promise<number> {
  const result = keepTokenHash
    ? await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?1 AND token_hash != ?2')
        .bind(userId, keepTokenHash)
        .run()
    : await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?1').bind(userId).run()

  return result.meta?.changes ?? 0
}

// The hash of the token on the current request, so a route can keep "this"
// session while revoking the rest.
export async function currentTokenHash(request: Request): Promise<string | null> {
  const token = bearerToken(request)
  if (!token) return null
  return sha256Hex(token)
}

export async function userFromRequest(request: Request, env: Env): Promise<SessionUser | null> {
  const token = bearerToken(request)
  if (!token) return null

  const tokenHash = await sha256Hex(token)
  const row = await env.DB.prepare(
    `SELECT u.id AS id,
            u.email AS email,
            u.display_name AS display_name,
            u.photo_url AS photo_url,
            s.expires_at AS expires_at,
            (SELECT COUNT(*) FROM admins a WHERE a.user_id = u.id) AS admin_count
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ?1`,
  )
    .bind(tokenHash)
    .first<SessionRow>()

  if (!row) return null

  if (row.expires_at <= Date.now()) {
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?1').bind(tokenHash).run()
    return null
  }

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    photoURL: row.photo_url,
    isAdmin: row.admin_count > 0,
  }
}

type Guard = { ok: true; user: SessionUser } | { ok: false; response: Response }

// Every route that touches user data goes through this. The client-side admin
// check in admin.astro was only ever cosmetic; this is the real gate.
export async function requireUser(ctx: Ctx, cors: Record<string, string>): Promise<Guard> {
  const user = await userFromRequest(ctx.request, ctx.env)
  if (!user) return { ok: false, response: fail(401, '请先登录', cors) }
  return { ok: true, user }
}

export async function requireAdmin(ctx: Ctx, cors: Record<string, string>): Promise<Guard> {
  const guard = await requireUser(ctx, cors)
  if (!guard.ok) return guard
  if (!guard.user.isAdmin) return { ok: false, response: fail(403, '需要管理员权限', cors) }
  return guard
}
