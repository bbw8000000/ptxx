import type { Env } from './types'

// The static site lives on github.io while this API lives on pages.dev, so every
// call is cross-site. Credentials are carried by an Authorization header rather
// than a cookie, so no Access-Control-Allow-Credentials is needed - which also
// means there is no CSRF surface at all.
const DEFAULT_ORIGINS = [
  'https://ekegukeku64-blip.github.io',
  // Astro's dev server, so `npm run dev` can talk to a local API.
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]

export function allowedOrigins(env: Env): string[] {
  const raw = (env.ALLOWED_ORIGINS || '').trim()
  if (!raw) return DEFAULT_ORIGINS
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

// Returns CORS headers only for an origin we explicitly allow. Never echo an
// arbitrary Origin and never use '*' - a wildcard would let any site drive this
// API with a stolen token.
export function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  if (!origin || !allowedOrigins(env).includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export function withVary(headers: Record<string, string>): Record<string, string> {
  return { Vary: 'Origin', ...headers }
}
