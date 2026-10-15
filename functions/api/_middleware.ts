import { corsHeaders, withVary } from '../_lib/cors'
import { empty } from '../_lib/http'
import type { Ctx } from '../_lib/types'

// Covers everything under /api/*. Adds the CORS headers to every response and
// answers preflights, so individual handlers never have to think about it.
export async function onRequest(ctx: Ctx): Promise<Response> {
  const cors = withVary(corsHeaders(ctx.request, ctx.env))

  if (ctx.request.method === 'OPTIONS') {
    return empty(204, cors)
  }

  const response = await ctx.next()
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(cors)) headers.set(key, value)

  return new Response(response.body, { status: response.status, headers })
}
