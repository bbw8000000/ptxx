import { corsHeaders } from '../../_lib/cors'
import { fail, json, readJsonBody, rejectUnknownKeys } from '../../_lib/http'
import { cleanCredential, cleanPassword, PASSWORD_MAX, PASSWORD_MIN } from '../../_lib/validate'
import {
  fromBase64,
  hashPassword,
  iterationsFromEnv,
  newSalt,
  pepperFromEnv,
  timingSafeEqual,
  toBase64,
} from '../../_lib/password'
import { currentTokenHash, deleteSessionsForUser, requireUser, toPublicUser } from '../../_lib/auth'
import { checkLimits, clientIp, passwordChangeRules } from '../../_lib/ratelimit'
import type { Ctx } from '../../_lib/types'

interface CredentialRow {
  id: string
  email: string
  display_name: string
  photo_url: string
  password_hash: string
  password_salt: string
  kdf_iterations: number
  admin_count: number
}

// Changing your own password. There is deliberately no "forgot password" flow:
// that needs an email provider, and this project does not have one. What this
// does provide is the primitive such a flow would need — revoking every other
// session — so a password change signs out any device that was already in.
export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const pepper = pepperFromEnv(ctx.env)
  if (!pepper) return fail(500, '服务端未配置 PBKDF2_PEPPER', cors)

  const guard = await requireUser(ctx, cors)
  if (!guard.ok) return guard.response
  const user = guard.user

  const verdict = await checkLimits(ctx.env, passwordChangeRules(clientIp(ctx.request)))
  if (!verdict.ok) {
    return fail(429, '操作过于频繁，请稍后再试', {
      ...cors,
      'Retry-After': String(verdict.retryAfterSeconds),
    })
  }

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['currentPassword', 'newPassword'])
  if (unknown) return fail(400, unknown, cors)

  const currentPassword = cleanCredential(parsed.body.currentPassword)
  const newPassword = cleanPassword(parsed.body.newPassword)

  if (!currentPassword) return fail(401, '当前密码不正确', cors)
  if (!newPassword) {
    return fail(400, `新密码长度需在 ${PASSWORD_MIN}-${PASSWORD_MAX} 字节之间`, cors)
  }
  if (newPassword === currentPassword) return fail(400, '新密码不能与当前密码相同', cors)

  const row = await ctx.env.DB.prepare(
    `SELECT id, email, display_name, photo_url, password_hash, password_salt, kdf_iterations,
            (SELECT COUNT(*) FROM admins a WHERE a.user_id = users.id) AS admin_count
     FROM users
     WHERE id = ?1`,
  )
    .bind(user.id)
    .first<CredentialRow>()

  // The session is valid but the account is gone (deleted mid-session).
  if (!row) return fail(401, '请先登录', cors)

  const candidate = await hashPassword(
    currentPassword,
    pepper,
    fromBase64(row.password_salt),
    row.kdf_iterations,
  )
  if (!timingSafeEqual(candidate, row.password_hash)) {
    return fail(401, '当前密码不正确', cors)
  }

  const salt = newSalt()
  const iterations = iterationsFromEnv(ctx.env)
  const passwordHash = await hashPassword(newPassword, pepper, salt, iterations)

  await ctx.env.DB.prepare(
    'UPDATE users SET password_hash = ?1, password_salt = ?2, kdf_iterations = ?3 WHERE id = ?4',
  )
    .bind(passwordHash, toBase64(salt), iterations, row.id)
    .run()

  // Keep the caller signed in, drop everyone else: that is the point of changing
  // a password you believe may have leaked.
  const keep = await currentTokenHash(ctx.request)
  const revoked = await deleteSessionsForUser(ctx.env, row.id, keep ?? undefined)

  return json(
    {
      revoked,
      user: toPublicUser({
        id: row.id,
        email: row.email,
        displayName: row.display_name,
        photoURL: row.photo_url,
        isAdmin: row.admin_count > 0,
      }),
    },
    200,
    cors,
  )
}
