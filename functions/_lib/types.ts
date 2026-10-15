// Minimal structural types for the Pages Functions runtime.
//
// Deliberately not depending on @cloudflare/workers-types: functions/ is
// excluded from `astro check`, and these signatures are enough to catch typos
// at the call sites without adding a dependency to the blog's package.json.

export interface D1Result<T> {
  results?: T[]
  success: boolean
  // D1 reports affected-row counts here; used to tell the caller how many
  // sessions a password change actually revoked.
  meta?: { changes?: number }
}

export interface D1Statement {
  bind(...values: unknown[]): D1Statement
  first<T = unknown>(): Promise<T | null>
  all<T = unknown>(): Promise<D1Result<T>>
  run(): Promise<D1Result<unknown>>
}

export interface D1Like {
  prepare(query: string): D1Statement
  batch(statements: D1Statement[]): Promise<D1Result<unknown>[]>
}

export interface Env {
  DB: D1Like
  PBKDF2_PEPPER?: string
  PBKDF2_ITERATIONS?: string
  ALLOWED_ORIGINS?: string
  // 译文生成用的模型服务（OpenAI 兼容接口）。密钥只放在 Cloudflare 的 secret 里，
  // 绝不进仓库、也绝不下发到前端 —— 前端只能调 /api/translate 这个中间层。
  DEEPSEEK_API_KEY?: string
  DEEPSEEK_BASE_URL?: string
  DEEPSEEK_MODEL?: string
}

export interface Ctx {
  request: Request
  env: Env
  params: Record<string, string>
  next: () => Promise<Response>
  data: Record<string, unknown>
}
