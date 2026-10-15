import { corsHeaders } from '../../_lib/cors'
import { fail, json, readJsonBody, rejectUnknownKeys } from '../../_lib/http'
import { cleanEmail, cleanPassword } from '../../_lib/validate'
import {
  fromBase64,
  hashPassword,
  iterationsFromEnv,
  newSalt,
  pepperFromEnv,
  timingSafeEqual,
  toBase64,
} from '../../_lib/password'
import { createSession, toPublicUser } from '../../_lib/auth'
import { checkLimits, clientIp, loginRules } from '../../_lib/ratelimit'
import type { Ctx } from '../../_lib/types'

interface LoginRow {
  id: string
  email: string
  display_name: string
  photo_url: string
  password_hash: string
  password_salt: string
  kdf_iterations: number
  admin_count: number
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const pepper = pepperFromEnv(ctx.env)
  if (!pepper) return fail(500, '服务端未配置 PBKDF2_PEPPER', cors)

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['email', 'password'])
  if (unknown) return fail(400, unknown, cors)

  const email = cleanEmail(parsed.body.email)
  const password = cleanPassword(parsed.body.password)

  // One identical response for every failure mode. Saying "no such account"
  // would let an attacker enumerate registered addresses.
  const invalid = () => fail(401, '邮箱或密码不正确', cors)
  if (!email || !password) return invalid()

  const verdict = await checkLimits(ctx.env, loginRules(clientIp(ctx.request), email))
  if (!verdict.ok) {
    return fail(429, '尝试过于频繁，请稍后再试', {
      ...cors,
      'Retry-After': String(verdict.retryAfterSeconds),
    })
  }

  const row = await ctx.env.DB.prepare(
    `SELECT id, email, display_name, photo_url, password_hash, password_salt, kdf_iterations,
            (SELECT COUNT(*) FROM admins a WHERE a.user_id = users.id) AS admin_count
     FROM users
     WHERE email_lower = ?1`,
  )
    .bind(email)
    .first<LoginRow>()

  const iterations = iterationsFromEnv(ctx.env)

  if (!row) {
    // Burn equivalent CPU for an unknown account so response timing cannot be
    // used to tell "no such user" from "wrong password".
    await hashPassword(password, pepper, newSalt(), iterations)
    return invalid()
  }

  const candidate = await hashPassword(
    password,
    pepper,
    fromBase64(row.password_salt),
    row.kdf_iterations,
  )
  if (!timingSafeEqual(candidate, row.password_hash)) return invalid()

  // Transparent upgrade: if PBKDF2_ITERATIONS was raised (e.g. after moving to
  // the paid plan), re-hash now that we hold the plaintext.
  if (row.kdf_iterations !== iterations) {
    const salt = newSalt()
    const rehashed = await hashPassword(password, pepper, salt, iterations)
    await ctx.env.DB.prepare(
      'UPDATE users SET password_hash = ?1, password_salt = ?2, kdf_iterations = ?3 WHERE id = ?4',
    )
      .bind(rehashed, toBase64(salt), iterations, row.id)
      .run()
  }

  const { token, expiresAt } = await createSession(ctx.env, row.id)

  return json(
    {
      token,
      expiresAt,
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
