import { corsHeaders } from '../../_lib/cors'
import { empty, fail, json, readJsonBody, rejectUnknownKeys } from '../../_lib/http'
import { cleanCommentId, isCommentStatus } from '../../_lib/validate'
import { requireAdmin, requireUser } from '../../_lib/auth'
import { COMMENT_COLUMNS, toPublicComment, type CommentRow } from '../../_lib/comments'
import type { Ctx } from '../../_lib/types'

// 原 firestore.rules 的 `allow delete: if resource.data.uid == request.auth.uid`，
// 或者调用者是管理员。规则文件已随 Firebase 删除，等价判断在下面。
export async function onRequestDelete(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const guard = await requireUser(ctx, cors)
  if (!guard.ok) return guard.response

  const id = cleanCommentId(ctx.params.id)
  if (!id) return fail(400, 'id 不合法', cors)

  const row = await ctx.env.DB.prepare('SELECT user_id FROM comments WHERE id = ?1')
    .bind(id)
    .first<{ user_id: string | null }>()
  if (!row) return fail(404, '评论不存在', cors)

  // Migrated rows have user_id NULL and therefore no owner.
  const isOwner = row.user_id !== null && row.user_id === guard.user.id
  if (!isOwner && !guard.user.isAdmin) return fail(403, '无权删除该评论', cors)

  await ctx.env.DB.prepare('DELETE FROM comments WHERE id = ?1').bind(id).run()
  return empty(204, cors)
}

// 原 firestore.rules 的 `allow update: if isAdmin && affectedKeys().hasOnly(['status'])`。
// 也就是：只有管理员能做，请求体里除 status 不能有别的东西，用户想自己批准自己的
// 待审评论会在这里拿到 403。
export async function onRequestPatch(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const guard = await requireAdmin(ctx, cors)
  if (!guard.ok) return guard.response

  const id = cleanCommentId(ctx.params.id)
  if (!id) return fail(400, 'id 不合法', cors)

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['status'])
  if (unknown) return fail(400, `审核只能修改 status（${unknown}）`, cors)

  const status = parsed.body.status
  if (!isCommentStatus(status)) return fail(400, 'status 不合法', cors)

  const row = await ctx.env.DB.prepare(`SELECT ${COMMENT_COLUMNS} FROM comments WHERE id = ?1`)
    .bind(id)
    .first<CommentRow>()
  if (!row) return fail(404, '评论不存在', cors)

  await ctx.env.DB.prepare('UPDATE comments SET status = ?1 WHERE id = ?2').bind(status, id).run()

  return json({ comment: toPublicComment({ ...row, status }) }, 200, cors)
}
