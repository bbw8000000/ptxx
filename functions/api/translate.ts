import { corsHeaders } from '../_lib/cors'
import { fail, json, readJsonBody, rejectUnknownKeys } from '../_lib/http'
import { cleanString } from '../_lib/validate'
import { checkLimits, clientIp, translateRules } from '../_lib/ratelimit'
import {
  DEFAULT_MODEL,
  MAX_SOURCE_CHARS,
  MIN_SOURCE_CHARS,
  TranslationUnavailable,
  generateTranslation,
  hashSource,
  readCachedTranslation,
  writeCachedTranslation,
} from '../_lib/translation'
import type { Ctx } from '../_lib/types'

// 把外文项目摘要翻成中文，并缓存进 D1。
//
// 为什么放在服务端而不是浏览器端直接调模型：密钥一旦下发到前端就等于公开，任何访客
// 都能拿它刷别人的额度。这里前端只调本接口，密钥存在 Cloudflare 的 secret 里。
//
// 成本控制有三层：
//   1. 缓存 —— 缓存键是源文本 sha256，同一段文字全站只翻译一次（命中缓存不接受限流）
//   2. 限流 —— 每个 IP 每分钟 20 次、每天 300 次，够正常阅读，挡得住脚本
//   3. 输入长度 —— 正文只取前 MAX_SOURCE_CHARS 个字符，长 README 不会按全文计费
//
// 未登录也能用：这个功能的受众恰恰是"不会用 GitHub、也不会用浏览器翻译"的读者，
// 要求注册等于把最需要的人挡在门外。因此只按 IP 限流。

const TARGET_LANGS = ['zh', 'zh-CN', 'zh-Hans'] as const
const MAX_INPUT_BYTES = 8000

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  const cors = corsHeaders(ctx.request, ctx.env)

  const parsed = await readJsonBody(ctx.request, cors)
  if (!parsed.ok) return parsed.response

  const unknown = rejectUnknownKeys(parsed.body, ['text', 'targetLang'])
  if (unknown) return fail(400, unknown, cors)

  // 用一个偏长的上限：MIN 之上是正文片段，前端会把正文前若干字发过来
  const text = cleanString(parsed.body.text, MAX_INPUT_BYTES, { trim: false })
  if (text === null) {
    return fail(400, `text 必须是 ${MIN_SOURCE_CHARS}–${MAX_INPUT_BYTES} 字节的字符串`, cors)
  }
  if (text.trim().length < MIN_SOURCE_CHARS) {
    return fail(400, '内容太短，无需翻译', cors)
  }

  const rawTarget = parsed.body.targetLang
  const targetLang = typeof rawTarget === 'string' && rawTarget.trim() ? rawTarget.trim() : 'zh'
  if (!(TARGET_LANGS as readonly string[]).includes(targetLang)) {
    return fail(400, 'targetLang 目前只支持 zh', cors)
  }

  const model = (ctx.env.DEEPSEEK_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL
  const contentHash = await hashSource(text)

  // 缓存优先：命中就完全不调用模型，也不消耗限流额度（否则热门项目会被自己的读者限死）
  const cached = await readCachedTranslation(ctx.env, contentHash, targetLang, model)
  if (cached) {
    return json(
      { summary: cached.summary, cached: true, createdAt: cached.createdAt, model },
      200,
      { ...cors, 'Cache-Control': 'public, max-age=86400' },
    )
  }

  const verdict = await checkLimits(ctx.env, translateRules(clientIp(ctx.request)))
  if (!verdict.ok) {
    return fail(429, '翻译请求过于频繁，请稍后再试', {
      ...cors,
      'Retry-After': String(verdict.retryAfterSeconds),
    })
  }

  try {
    const { summary, model: usedModel } = await generateTranslation(ctx.env, text, targetLang)
    await writeCachedTranslation(ctx.env, {
      contentHash,
      targetLang,
      model: usedModel,
      summary,
      inputChars: Math.min(text.length, MAX_SOURCE_CHARS),
      outputChars: summary.length,
    })
    return json({ summary, cached: false, createdAt: Date.now(), model: usedModel }, 200, cors)
  } catch (error) {
    if (error instanceof TranslationUnavailable) {
      // 密钥缺失属于服务端配置问题，对读者只给一句可读的提示
      const message = /未配置/.test(error.message) ? '服务端暂未配置翻译服务' : '翻译服务暂时不可用'
      return fail(503, message, { ...cors, 'Retry-After': '60' })
    }
    return fail(500, '翻译失败，请稍后再试', cors)
  }
}
