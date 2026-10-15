import { corsHeaders } from '../../_lib/cors'
import { fail, json, readJsonBody, rejectUnknownKeys } from '../../_lib/http'
import {
  cleanDisplayName,
  cleanEmail,
  cleanPassword,
  PASSWORD_MAX,
  PASSWORD_MIN,
} from '../../_lib/validate'
import {
  hashPassword,
  iterationsFromEnv,
  newSalt,
  pepperFromEnv,
  toBase64,
} from '../../_lib/password'
import { createSession, toPublicUser } from '../../_lib/auth'
import { checkLimits, clientIp, purgeOldCounters, registerRules } from '../../_lib/ratelimit'
import type { Ctx } from '../../_lib/types'

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const pepper = pepperFromEnv(ctx.env)
  if (!pepper) return fail(500, '服务端未配置 PBKDF2_PEPPER', cors)

  const verdict = await checkLimits(ctx.env, registerRules(clientIp(ctx.request)))
  if (!verdict.ok) {
    return fail(429, '注册过于频繁，请稍后再试', {
      ...cors,
      'Retry-After': String(verdict.retryAfterSeconds),
    })
  }

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['email', 'password', 'displayName'])
  if (unknown) return fail(400, unknown, cors)

  const email = cleanEmail(parsed.body.email)
  const password = cleanPassword(parsed.body.password)
  const displayName = cleanDisplayName(parsed.body.displayName)

  if (!email) return fail(400, '邮箱格式不正确', cors)
  if (!password) {
    return fail(400, `密码长度需在 ${PASSWORD_MIN}-${PASSWORD_MAX} 字节之间`, cors)
  }
  if (!displayName) return fail(400, '昵称不能为空，且不超过 200 字节', cors)

  const existing = await ctx.env.DB.prepare('SELECT id FROM users WHERE email_lower = ?1')
    .bind(email)
    .first<{ id: string }>()
  if (existing) return fail(409, '该邮箱已被注册', cors)

  const salt = newSalt()
  const iterations = iterationsFromEnv(ctx.env)
  const passwordHash = await hashPassword(password, pepper, salt, iterations)
  const id = crypto.randomUUID()
  const now = Date.now()

  try {
    await ctx.env.DB.prepare(
      `INSERT INTO users (id, email, email_lower, display_name, photo_url, password_hash, password_salt, kdf_iterations, created_at)
       VALUES (?1, ?2, ?3, ?4, '', ?5, ?6, ?7, ?8)`,
    )
      .bind(id, email, email, displayName, passwordHash, toBase64(salt), iterations, now)
      .run()
  } catch {
    // The unique index is the authority; this catches the race between the
    // check above and the insert.
    return fail(409, '该邮箱已被注册', cors)
  }

  await purgeOldCounters(ctx.env)

  const { token, expiresAt } = await createSession(ctx.env, id)

  return json(
    {
      token,
      expiresAt,
      user: toPublicUser({
        id,
        email,
        displayName,
        photoURL: '',
        isAdmin: false,
      }),
    },
    201,
    cors,
  )
}
