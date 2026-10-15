// JSON response + request-body helpers.

export const MAX_BODY_BYTES = 8192

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Nothing here is cacheable: comments change, and /api/auth/me is per-user.
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  })
}

export function fail(
  status: number,
  message: string,
  headers: Record<string, string> = {},
): Response {
  return json({ error: message }, status, headers)
}

export function empty(status = 204, headers: Record<string, string> = {}): Response {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store', ...headers } })
}

export type BodyResult =
  { ok: true; body: Record<string, unknown> } | { ok: false; response: Response }

export async function readJsonBody(
  request: Request,
  headers: Record<string, string> = {},
): Promise<BodyResult> {
  const declared = Number(request.headers.get('Content-Length') || '0')
  if (declared > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, '请求体过大', headers) }
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, response: fail(413, '请求体过大', headers) }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, response: fail(400, '请求体必须是 JSON', headers) }
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, response: fail(400, '请求体必须是 JSON 对象', headers) }
  }

  return { ok: true, body: parsed as Record<string, unknown> }
}

// Rejects any key not in `allowed`. This is the equivalent of Firestore's
// `request.resource.data.keys().hasOnly([...])` - without it a client could
// smuggle in extra fields (e.g. `status: "approved"`) that a later read of the
// body might pick up.
export function rejectUnknownKeys(
  body: Record<string, unknown>,
  allowed: readonly string[],
): string | null {
  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) return `不接受字段：${key}`
  }
  return null
}
