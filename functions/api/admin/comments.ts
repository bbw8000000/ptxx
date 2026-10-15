import { corsHeaders } from '../../_lib/cors'
import { fail, json } from '../../_lib/http'
import { isCommentStatus, type CommentStatus } from '../../_lib/validate'
import { requireAdmin } from '../../_lib/auth'
import {
  ADMIN_COUNTS_SQL,
  ADMIN_SEARCH_MAX,
  buildAdminListSql,
  clampLimit,
  clampOffset,
  summariseStatusCounts,
  toPublicComment,
  type CommentRow,
} from '../../_lib/comments'
import type { Ctx } from '../../_lib/types'

// Admin moderation list: every status, newest first, paginated.
//
// This used to run `... LIMIT 500` with no offset and no total. Past 500 rows the
// queue was silently truncated *and* the four stat cards were computed from that
// truncated array, so they were wrong too. Now the caller pages explicitly, gets
// a real total for the current filter, and gets per-status counts over the whole
// table so the cards no longer depend on which page is loaded.
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const guard = await requireAdmin(ctx, cors)
  if (!guard.ok) return guard.response

  const params = new URL(ctx.request.url).searchParams

  const rawStatus = (params.get('status') || '').trim()
  let status: CommentStatus | null = null
  if (rawStatus.length > 0) {
    if (!isCommentStatus(rawStatus)) return fail(400, 'status 不合法', cors)
    status = rawStatus
  }

  // Searching is done in SQL now. Previously the page filtered the 500 rows it
  // happened to have in memory, so a match on row 501 was invisible.
  const q = (params.get('q') || '').slice(0, ADMIN_SEARCH_MAX)
  const limit = clampLimit(params.get('limit'))
  const offset = clampOffset(params.get('offset'))

  const { countSql, pageSql, binds } = buildAdminListSql({ status, q })

  const totalRow = await ctx.env.DB.prepare(countSql)
    .bind(...binds)
    .first<{ n: number }>()

  const rows = await ctx.env.DB.prepare(pageSql)
    .bind(...binds, limit, offset)
    .all<CommentRow>()

  const countRows = await ctx.env.DB.prepare(ADMIN_COUNTS_SQL).all<{ status: string; n: number }>()

  const counts = summariseStatusCounts(countRows.results ?? [])

  return json(
    {
      comments: (rows.results ?? []).map(toPublicComment),
      total: totalRow?.n ?? 0,
      limit,
      offset,
      counts,
    },
    200,
    cors,
  )
}
