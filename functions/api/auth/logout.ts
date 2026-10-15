import { corsHeaders } from '../../_lib/cors'
import { empty } from '../../_lib/http'
import { deleteSessionByToken } from '../../_lib/auth'
import type { Ctx } from '../../_lib/types'

// Revokes the session server-side, so logging out actually invalidates the
// token rather than just dropping it in the browser.
export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)
  await deleteSessionByToken(ctx.request, ctx.env)
  return empty(204, cors)
}
