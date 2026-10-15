import { corsHeaders } from '../../_lib/cors'
import { fail, json, readJsonBody, rejectUnknownKeys } from '../../_lib/http'
import { cleanContent, cleanDisplayName, cleanPageId, cleanPhotoUrl } from '../../_lib/validate'
import { requireUser } from '../../_lib/auth'
import { checkLimits, clientIp, commentRules } from '../../_lib/ratelimit'
import {
  COMMENT_COLUMNS,
  COMMENT_PAGE_LIMIT,
  toPublicComment,
  type CommentRow,
} from '../../_lib/comments'
import type { Ctx } from '../../_lib/types'

// 授权模型原本写在 firestore.rules（`allow read: if status == 'approved'`），
// 那份文件已随 Firebase 一起删除 —— 现在这个判断就在下面这条 SQL 的 WHERE 里。
// 未登录可读，且只返回已通过的评论。
export async function onRequestGet(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const pageId = cleanPageId(new URL(ctx.request.url).searchParams.get('pageId') ?? '')
  if (!pageId) return fail(400, 'pageId 不合法', cors)

  const rows = await ctx.env.DB.prepare(
    `SELECT ${COMMENT_COLUMNS}
     FROM comments
     WHERE page_id = ?1 AND status = 'approved'
     ORDER BY created_at DESC
     LIMIT ?2`,
  )
    .bind(pageId, COMMENT_PAGE_LIMIT)
    .all<CommentRow>()

  return json({ comments: (rows.results ?? []).map(toPublicComment) }, 200, cors)
}

// 原 firestore.rules 对 create 的要求是：必须登录、uid == auth.uid、字段白名单、
// 每个字段的长度/格式限制、status == 'pending'、createdAt == request.time。
// 那份规则文件已删除，等价约束现在由这里执行：服务端自己决定 uid、status、createdAt，
// 并且拒绝任何未声明的字段，所以这些都无法被伪造。
export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const guard = await requireUser(ctx, cors)
  if (!guard.ok) return guard.response
  const user = guard.user

  // 这条限流在原 Firestore 里没有（Firestore 只有规则、没有频率概念）。
  // 注册一旦公开，没有上限的评论接口就是垃圾评论的大门。按账号 + 按 IP 双重计数：
  // 只按账号的话，再注册一个账号就绕过去了。
  const verdict = await checkLimits(ctx.env, commentRules(clientIp(ctx.request), user.id))
  if (!verdict.ok) {
    return fail(429, '评论过于频繁，请稍后再试', {
      ...cors,
      'Retry-After': String(verdict.retryAfterSeconds),
    })
  }

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['pageId', 'content', 'displayName', 'photoURL'])
  if (unknown) return fail(400, unknown, cors)

  const pageId = cleanPageId(parsed.body.pageId)
  if (!pageId) return fail(400, 'pageId 不合法', cors)

  const content = cleanContent(parsed.body.content)
  if (!content) return fail(400, '内容不能为空，且不超过 2000 字节', cors)

  // Display name and avatar default to the account's; the client may override
  // per comment, which is what the old form did.
  const displayName =
    parsed.body.displayName === undefined
      ? user.displayName
      : cleanDisplayName(parsed.body.displayName)
  if (displayName === null) return fail(400, '昵称不合法', cors)

  const photoURL =
    parsed.body.photoURL === undefined ? user.photoURL : cleanPhotoUrl(parsed.body.photoURL)
  if (photoURL === null) return fail(400, '头像地址不合法', cors)

  const id = crypto.randomUUID()
  const now = Date.now()

  await ctx.env.DB.prepare(
    `INSERT INTO comments
       (id, page_id, user_id, legacy_uid, display_name, photo_url, content, status, created_at)
     VALUES (?1, ?2, ?3, NULL, ?4, ?5, ?6, 'pending', ?7)`,
  )
    .bind(id, pageId, user.id, displayName, photoURL, content, now)
    .run()

  return json(
    {
      comment: toPublicComment({
        id,
        page_id: pageId,
        user_id: user.id,
        legacy_uid: null,
        display_name: displayName,
        photo_url: photoURL,
        content,
        status: 'pending',
        created_at: now,
      }),
    },
    201,
    cors,
  )
}
