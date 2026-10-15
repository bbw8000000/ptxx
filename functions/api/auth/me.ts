import { corsHeaders } from '../../_lib/cors'
import { json } from '../../_lib/http'
import { requireUser, toPublicUser } from '../../_lib/auth'
import type { Ctx } from '../../_lib/types'

// The single source of truth for "am I logged in, and am I an admin?". The
// client calls this on load and after every login/logout.
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)
  const guard = await requireUser(ctx, cors)
  if (!guard.ok) return guard.response
  return json({ user: toPublicUser(guard.user) }, 200, cors)
}
