// Input validation. These mirror the per-field limits that firestore.rules
// enforced, using UTF-8 byte lengths because that is what Firestore's size()
// measured.

const encoder = new TextEncoder()

export const EMAIL_MAX = 254
export const PASSWORD_MIN = 12
export const PASSWORD_MAX = 200
export const DISPLAY_NAME_MAX = 200
export const PAGE_ID_MAX = 512
export const CONTENT_MAX = 2000
export const PHOTO_URL_MAX = 2048
export const COMMENT_ID_MAX = 128

const EMAIL_SHAPE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const COMMENT_ID_SHAPE = /^[A-Za-z0-9_-]+$/
const HTTPS_URL_SHAPE = /^https:[^\s]+$/

export function utf8Length(value: string): number {
  return encoder.encode(value).length
}

export function isPlainString(value: unknown): value is string {
  return typeof value === 'string'
}

// Rejects C0 controls and DEL so nothing can smuggle a NUL into SQLite TEXT or a
// terminal escape sequence into the admin UI. Tab (9), LF (10) and CR (13) are
// allowed: comments pasted from Windows carry CRLF, and code snippets are
// indented with tabs.
//
// Written as a charCode loop rather than a character-class regex so the source
// contains no escape sequences that a tool could silently rewrite.
function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i)
    if (code === 9 || code === 10 || code === 13) continue
    if (code < 32 || code === 127) return true
  }
  return false
}

interface CleanOptions {
  minBytes?: number
  // Content keeps its surrounding whitespace: comments may contain indented
  // code, and trimming would quietly rewrite the first line of a snippet.
  trim?: boolean
}

export function cleanString(
  value: unknown,
  maxBytes: number,
  options: CleanOptions = {},
): string | null {
  const { minBytes = 1, trim = true } = options
  if (!isPlainString(value)) return null

  const result = trim ? value.trim() : value
  const length = utf8Length(result)
  if (length < minBytes || length > maxBytes) return null
  if (hasControlChars(result)) return null
  return result
}

export function cleanEmail(value: unknown): string | null {
  if (!isPlainString(value)) return null
  const email = value.trim().toLowerCase()
  if (email.length === 0 || email.length > EMAIL_MAX) return null
  if (!EMAIL_SHAPE.test(email)) return null
  return email
}

export function cleanPassword(value: unknown): string | null {
  // Passwords are intentionally not trimmed: leading/trailing spaces are real
  // characters and trimming them would silently change the credential.
  if (!isPlainString(value)) return null
  const length = utf8Length(value)
  if (length < PASSWORD_MIN || length > PASSWORD_MAX) return null
  if (hasControlChars(value)) return null
  return value
}

// For a credential we are about to *verify* rather than store. It deliberately
// skips the minimum: enforcing it here would report a too-short old password as
// "长度不符" (a 400) instead of the uniform "当前密码不正确" (401), which leaks
// policy and confuses anyone whose password predates a rule change.
export function cleanCredential(value: unknown): string | null {
  if (!isPlainString(value)) return null
  if (value.length === 0) return null
  if (utf8Length(value) > PASSWORD_MAX) return null
  if (hasControlChars(value)) return null
  return value
}

export function cleanDisplayName(value: unknown): string | null {
  return cleanString(value, DISPLAY_NAME_MAX)
}

export function cleanPageId(value: unknown): string | null {
  return cleanString(value, PAGE_ID_MAX)
}

export function cleanContent(value: unknown): string | null {
  return cleanString(value, CONTENT_MAX, { trim: false })
}

export function cleanCommentId(value: unknown): string | null {
  const id = cleanString(value, COMMENT_ID_MAX)
  if (id === null || !COMMENT_ID_SHAPE.test(id)) return null
  return id
}

// '' is allowed (no avatar); anything else must be an absolute https URL with no
// whitespace, matching the old `^https://[^\s]+$` rule.
export function cleanPhotoUrl(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return ''
  if (!isPlainString(value)) return null
  const url = value.trim()
  if (utf8Length(url) > PHOTO_URL_MAX) return null
  if (!HTTPS_URL_SHAPE.test(url)) return null
  try {
    if (new URL(url).protocol !== 'https:') return null
  } catch {
    return null
  }
  return url
}

export const COMMENT_STATUSES = ['approved', 'pending', 'rejected'] as const
export type CommentStatus = (typeof COMMENT_STATUSES)[number]

export function isCommentStatus(value: unknown): value is CommentStatus {
  return typeof value === 'string' && (COMMENT_STATUSES as readonly string[]).includes(value)
}
