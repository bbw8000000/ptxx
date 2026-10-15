// Shared row shape + serialiser for comments.
//
// The client was written against Firestore documents, so the JSON keeps the same
// field names (displayName, photoURL, createdAt) and `createdAt` is an ISO
// string that the client wraps back into a `{ toDate() }` object. That keeps
// Comment.astro's date formatting untouched.

export interface CommentRow {
  id: string
  page_id: string
  user_id: string | null
  legacy_uid: string | null
  display_name: string
  photo_url: string
  content: string
  status: string
  created_at: number
}

export interface PublicComment {
  id: string
  uid: string
  // The admin UI lists and searches by page, so this has to be in the payload.
  pageId: string
  displayName: string
  photoURL: string
  content: string
  status: string
  createdAt: string
}

export const COMMENT_COLUMNS =
  'id, page_id, user_id, legacy_uid, display_name, photo_url, content, status, created_at'

// A migrated row has no account, so it reports the old Firebase UID (which was
// already public in Firestore) and never matches a logged-in user's uid.
export function toPublicComment(row: CommentRow): PublicComment {
  return {
    id: row.id,
    uid: row.user_id ?? row.legacy_uid ?? '',
    pageId: row.page_id,
    displayName: row.display_name,
    photoURL: row.photo_url,
    content: row.content,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  }
}

// Guard against a single page growing an unbounded response. Well past any
// realistic comment count for a personal blog.
export const COMMENT_PAGE_LIMIT = 500

// The admin list is paginated, so it no longer uses COMMENT_PAGE_LIMIT: that
// constant silently truncated the moderation queue at 500 rows, which also made
// the four stat cards wrong. The public per-page list still uses it.
export const ADMIN_PAGE_DEFAULT = 50
export const ADMIN_PAGE_MAX = 200
export const ADMIN_SEARCH_MAX = 200

export interface AdminListFilter {
  status: string | null
  q: string
}

// LIKE treats % and _ as wildcards, so searching for "50%" or "a_b" would match
// far more than was typed. Escape them, and pair with ESCAPE '\' in the query.
export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`)
}

// Builds the shared WHERE clause for both the count and the page query so the
// two can never disagree about what "total" means.
export function buildAdminWhere(filter: AdminListFilter): { clause: string; binds: unknown[] } {
  const conditions: string[] = []
  const binds: unknown[] = []

  if (filter.status) {
    binds.push(filter.status)
    conditions.push(`status = ?${binds.length}`)
  }

  const needle = filter.q.trim()
  if (needle.length > 0) {
    binds.push(`%${escapeLikePattern(needle)}%`)
    const index = binds.length
    // One bind reused three times: SQLite numbered parameters may repeat.
    conditions.push(
      `(display_name LIKE ?${index} ESCAPE '\\' OR page_id LIKE ?${index} ESCAPE '\\' OR content LIKE ?${index} ESCAPE '\\')`,
    )
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    binds,
  }
}

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(raw ?? '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(Math.max(parsed, min), max)
}

export function clampLimit(raw: string | null): number {
  return clampInt(raw, 1, ADMIN_PAGE_MAX, ADMIN_PAGE_DEFAULT)
}

export function clampOffset(raw: string | null): number {
  // No upper bound: paging deep into the queue is legitimate. Negative values
  // would be a SQL error, so they collapse to 0.
  return clampInt(raw, 0, Number.MAX_SAFE_INTEGER, 0)
}

// Per-status counts over the whole table, for the stat cards. Independent of the
// current filter and page, which is the point: the cards used to be derived from
// whatever rows the browser happened to hold.
export const ADMIN_COUNTS_SQL = 'SELECT status, COUNT(*) AS n FROM comments GROUP BY status'

export interface CommentStatusCounts {
  all: number
  approved: number
  pending: number
  rejected: number
}

// Rows come from ADMIN_COUNTS_SQL. `all` sums every status present so a row with
// an unexpected status still shows up in the total instead of vanishing.
export function summariseStatusCounts(rows: { status: string; n: number }[]): CommentStatusCounts {
  const counts: CommentStatusCounts = { all: 0, approved: 0, pending: 0, rejected: 0 }
  for (const row of rows) {
    counts.all += row.n
    if (row.status === 'approved' || row.status === 'pending' || row.status === 'rejected') {
      counts[row.status] = row.n
    }
  }
  return counts
}

export interface AdminListSql {
  countSql: string
  pageSql: string
  binds: unknown[]
}

// The count and the page query are built together so they can never disagree
// about what "total" means. Kept as a pure string builder (no D1 access) so
// tests can prepare and run these exact statements against a real SQLite.
export function buildAdminListSql(filter: AdminListFilter): AdminListSql {
  const { clause, binds } = buildAdminWhere(filter)
  return {
    countSql: `SELECT COUNT(*) AS n FROM comments ${clause}`,
    pageSql:
      `SELECT ${COMMENT_COLUMNS} FROM comments ${clause}\n` +
      `     ORDER BY created_at DESC\n` +
      `     LIMIT ?${binds.length + 1} OFFSET ?${binds.length + 2}`,
    binds,
  }
}
