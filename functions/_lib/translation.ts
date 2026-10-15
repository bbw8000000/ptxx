import type { Env } from './types'

// 外文项目摘要 → 中文。成本直接取决于调用次数，所以这一层的核心是**先查缓存**。
//
// 为什么需要它：项目页正文是各项目自己的 README，实测 675 个有正文的快照里 616 个
// （91%）以英文为主。本站原有的「设备端翻译」依赖 Chrome 内置 Translator API，
// QQ/360/UC/Firefox/Safari 都没有 —— 目标读者（不会翻墙、也不会用浏览器翻译的人）
// 在英文正文前没有出路。
//
// 缓存键是**源文本的 sha256 + 目标语言 + 模型**，不是仓库名。同一段文字可能出现在多个
// 页面（项目页、日报卡片、历史日报），按文本做键才能保证只付费翻译一次。

/** 不足这个长度就不值得调用模型（多半是标题或占位符）。 */
export const MIN_SOURCE_CHARS = 40

/** 送给模型的最大字符数。README 动辄上万字，而读者要的是"这个项目做什么"。 */
export const MAX_SOURCE_CHARS = 2000

/** 译文长度上限，同时用来估算 max_tokens。 */
export const MAX_SUMMARY_CHARS = 400

export const DEFAULT_MODEL = 'deepseek-chat'
export const DEFAULT_BASE_URL = 'https://api.deepseek.com'

/**
 * 判断这段文本是不是"非中文"（应当提供中文摘要）。
 *
 * 用与 src/lib/textLanguage.ts 相同的口径：汉字占可见字符低于三分之一、且拉丁字母
 * 多于汉字。MUST 保持一致 —— 前端决定要不要显示摘要按钮时用的是那份。
 */
export function looksNonChinese(text: string): boolean {
  const body = text.trim()
  if (body.length < 1) return false
  let han = 0
  let latin = 0
  let visible = 0
  for (const character of body) {
    if (/\S/.test(character)) visible += 1
    const code = character.codePointAt(0) ?? 0
    if (code >= 0x4e00 && code <= 0x9fff) han += 1
    else if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) latin += 1
  }
  if (visible === 0) return false
  return han / visible < 0.34 && latin > han
}

/** sha256 十六进制。用 WebCrypto，Pages Functions 运行时自带。 */
export async function hashSource(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

/** 取出用于翻译的那一段：太长的正文只取开头，并明确告诉模型这是节选。 */
export function sourceExcerpt(text: string): string {
  // 去掉 markdown 结构性符号会让模型更容易读，但会误伤代码和链接文字，
  // 所以只做最小清理：折叠多余空行。
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  if (normalized.length <= MAX_SOURCE_CHARS) return normalized
  return `${normalized.slice(0, MAX_SOURCE_CHARS)}…`
}

export interface TranslationRecord {
  summary: string
  createdAt: number
}

/** 读缓存。命中就完全不需要调用模型。 */
export async function readCachedTranslation(
  env: Env,
  contentHash: string,
  targetLang: string,
  model: string,
): Promise<TranslationRecord | null> {
  const row = await env.DB.prepare(
    `SELECT summary, created_at FROM translations
     WHERE content_hash = ?1 AND target_lang = ?2 AND model = ?3`,
  )
    .bind(contentHash, targetLang, model)
    .first<{ summary: string; created_at: number }>()
  if (!row) return null
  return { summary: row.summary, createdAt: row.created_at }
}

export async function writeCachedTranslation(
  env: Env,
  params: {
    contentHash: string
    targetLang: string
    model: string
    summary: string
    inputChars: number
    outputChars: number
  },
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO translations
       (content_hash, target_lang, model, summary, input_chars, output_chars, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     -- 并发下两个请求可能同时未命中同一个键，用 OR IGNORE 让先到者胜出，
     -- 后到者沿用已有译文（两边的译文都有效，没必要报错）
     ON CONFLICT (content_hash, target_lang, model) DO NOTHING`,
  )
    .bind(
      params.contentHash,
      params.targetLang,
      params.model,
      params.summary,
      params.inputChars,
      params.outputChars,
      Date.now(),
    )
    .run()
}

const SYSTEM_PROMPT = [
  '你是技术摘要助手，服务对象是看不懂英文的中文读者。',
  '任务：把给定的英文 GitHub 项目说明翻译并压缩成简体中文摘要。',
  '要求：',
  '1. 只输出中文摘要本身，不要任何前言、解释或 Markdown 标题。',
  '2. 3 到 5 句话，说清这个项目是什么、解决什么问题、给谁用。',
  '3. 忠实于原文，不要添加原文没有的功能或评价，也不要省略关键信息。',
  '4. 专有名词、项目名、框架名保留英文原文。',
].join('\n')

export interface TranslationOutcome {
  summary: string
  model: string
}

export class TranslationUnavailable extends Error {}

/**
 * 调用 OpenAI 兼容的对话接口生成中文摘要。
 *
 * 走 chat/completions（DeepSeek 文档推荐用 /chat/completions；我们额外做的是
 * 「翻译 + 压缩」而不只是续写，所以 system 里明确要求输出摘要）。
 */
export async function generateTranslation(
  env: Env,
  text: string,
  targetLang: string,
): Promise<TranslationOutcome> {
  const key = (env.DEEPSEEK_API_KEY || '').trim()
  if (!key) throw new TranslationUnavailable('服务端未配置翻译密钥')

  const model = (env.DEEPSEEK_MODEL || DEFAULT_MODEL).trim() || DEFAULT_MODEL
  const baseUrl = (env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '')
  const excerpt = sourceExcerpt(text)

  const languageName = targetLang.startsWith('zh') ? '简体中文' : targetLang
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `请把下面内容译成${languageName}摘要：\n\n${excerpt}` },
      ],
      // 低温度：这是翻译/摘要，不是创作，稳定比"有文采"重要
      temperature: 0.2,
      // 中文一个字约 1.5 token，留 1.35 倍余量
      max_tokens: Math.ceil(MAX_SUMMARY_CHARS * 1.35),
      stream: false,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new TranslationUnavailable(
      `翻译服务返回 ${response.status}${detail ? `：${detail.slice(0, 200)}` : ''}`,
    )
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const summary = (payload.choices?.[0]?.message?.content || '').trim()
  if (!summary) throw new TranslationUnavailable('翻译服务返回了空内容')
  if (summary.length > MAX_SUMMARY_CHARS) {
    // 超长只截断到上限，不做二次调用
    return { summary: summary.slice(0, MAX_SUMMARY_CHARS), model }
  }
  return { summary, model }
}
