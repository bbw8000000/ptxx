import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADMIN_COUNTS_SQL,
  buildAdminListSql,
  clampLimit,
  clampOffset,
  summariseStatusCounts,
} from '../functions/_lib/comments.ts'
import { createTestDb } from './helpers/sqlite-d1.mjs'

// Runs the admin list against a real (in-memory) SQLite database that was built
// from the actual migration, using the *same* SQL builders and paging clamps the
// route uses.
//
// Why a real database: the previous implementation was `... LIMIT 500` with no
// offset and in-browser filtering, so past 500 rows the queue was truncated and
// the stat cards were computed from that truncated array. Type checks cannot see
// that. Neither can they see a broken placeholder (e.g. reusing ?1 where ?2 was
// meant), a bad `LIKE ... ESCAPE` clause, or an off-by-one in LIMIT/OFFSET.
//
// Note on scope: the route handler itself cannot be imported here, because
// functions/ uses extensionless relative imports that Cloudflare's bundler
// resolves but Node's ESM loader does not. Extracting the SQL into pure builders
// keeps this test honest about what it covers: the query text and the paging
// arithmetic, not the HTTP wiring.

const SEED_BASE_TIME = 1_700_000_000_000

async function queryAdmin(env, { status = null, q = '', limit = null, offset = null } = {}) {
  const appliedLimit = clampLimit(limit)
  const appliedOffset = clampOffset(offset)
  const { countSql, pageSql, binds } = buildAdminListSql({ status, q })

  const totalRow = await env.DB.prepare(countSql)
    .bind(...binds)
    .first()
  const rows = await env.DB.prepare(pageSql)
    .bind(...binds, appliedLimit, appliedOffset)
    .all()
  const countRows = await env.DB.prepare(ADMIN_COUNTS_SQL).all()

  return {
    comments: rows.results ?? [],
    total: totalRow?.n ?? 0,
    limit: appliedLimit,
    offset: appliedOffset,
    counts: summariseStatusCounts(countRows.results ?? []),
  }
}

function insertComments(sqlite, rows) {
  const statement = sqlite.prepare(
    `INSERT INTO comments (id, page_id, user_id, legacy_uid, display_name, photo_url, content, status, created_at)
     VALUES (?, ?, NULL, NULL, ?, '', ?, ?, ?)`,
  )
  for (const row of rows) {
    statement.run(row.id, row.pageId, row.name, row.content, row.status, row.createdAt)
  }
}

// A page_id is required by the schema, and the admin search covers it, so rows
// get a per-index path to keep the searches meaningful.
function freshDb(count) {
  const { sqlite, env } = createTestDb()
  const statuses = ['approved', 'pending', 'rejected']
  insertComments(
    sqlite,
    Array.from({ length: count }, (_unused, index) => ({
      id: `c-${String(index).padStart(4, '0')}`,
      pageId: `/blog/post-${index}/`,
      name: `用户${index}`,
      content: `第 ${index} 条评论`,
      status: statuses[index % 3],
      // Ascending, so newest-first ordering is unambiguous.
      createdAt: SEED_BASE_TIME + index * 1000,
    })),
  )
  return { sqlite, env }
}

test('SQL 能通过迁移建立的真实 schema 执行', async () => {
  const { env } = freshDb(1)
  const page = await queryAdmin(env, { limit: '20', offset: '0' })
  assert.equal(page.total, 1)
  assert.equal(page.comments.length, 1)
})

test('分页能越过旧的 500 条上限', async () => {
  const { env } = freshDb(1200)

  const first = await queryAdmin(env, { limit: '20', offset: '0' })
  assert.equal(first.comments.length, 20)
  // 旧实现这里最多只能报 500。
  assert.equal(first.total, 1200)
  // 倒序：最后插入的排在最前。
  assert.equal(first.comments[0].id, 'c-1199')

  const deep = await queryAdmin(env, { limit: '20', offset: '1180' })
  assert.equal(deep.comments.length, 20)
  assert.equal(deep.comments[0].id, 'c-0019')

  const tail = await queryAdmin(env, { limit: '20', offset: '1195' })
  assert.equal(tail.comments.length, 5)

  const past = await queryAdmin(env, { limit: '20', offset: '5000' })
  assert.equal(past.comments.length, 0)
  assert.equal(past.total, 1200)
})

test('统计数字覆盖全表，而不是当前页', async () => {
  const { env } = freshDb(900)

  const page = await queryAdmin(env, { status: 'pending', limit: '20', offset: '0' })
  // 900 条按 approved/pending/rejected 循环 => 各 300。
  assert.deepEqual(page.counts, { all: 900, approved: 300, pending: 300, rejected: 300 })
  // 分页器需要的是「符合筛选条件的总数」，统计卡需要的是全表数字。
  assert.equal(page.total, 300)
})

test('搜索在 SQL 里完成，能命中首页之外的数据', async () => {
  const { sqlite, env } = freshDb(30)
  insertComments(sqlite, [
    {
      id: 'c-needle',
      pageId: '/blog/find-me/',
      name: '搜索目标',
      content: '独一无二的关键词 zzqqxx',
      status: 'pending',
      createdAt: SEED_BASE_TIME + 100_000,
    },
  ])

  // 命中项排在第一页 5 条之外——旧的浏览器内过滤永远找不到它。
  const found = await queryAdmin(env, { q: 'zzqqxx', limit: '5', offset: '0' })
  assert.equal(found.total, 1)
  assert.equal(found.comments[0].id, 'c-needle')

  const byName = await queryAdmin(env, { q: '搜索目标' })
  assert.equal(byName.total, 1)

  const byPage = await queryAdmin(env, { q: 'find-me' })
  assert.equal(byPage.total, 1)

  // 状态与搜索可叠加
  const combined = await queryAdmin(env, { q: 'zzqqxx', status: 'approved' })
  assert.equal(combined.total, 0)
})

test('搜索里的 LIKE 通配符按字面处理', async () => {
  const { sqlite, env } = freshDb(3)
  insertComments(sqlite, [
    {
      id: 'c-percent',
      pageId: '/blog/a/',
      name: 'A',
      content: '涨幅 50% 左右',
      status: 'approved',
      createdAt: SEED_BASE_TIME + 200_000,
    },
  ])

  // 不转义的话 "%" 会匹配全表。
  const percent = await queryAdmin(env, { q: '50%' })
  assert.equal(percent.total, 1)
  assert.equal(percent.comments[0].id, 'c-percent')

  // "_" 在 LIKE 里是「任意单字符」，所以「第_条」不该匹配「第 1 条评论」。
  const underscore = await queryAdmin(env, { q: '第_条' })
  assert.equal(underscore.total, 0)
})

test('分页参数被钳制而不是报错', async () => {
  const { env } = freshDb(5)

  const clamped = await queryAdmin(env, { limit: '99999' })
  assert.equal(clamped.limit, 200)

  const negative = await queryAdmin(env, { limit: '-5', offset: '-100' })
  assert.equal(negative.limit, 1)
  assert.equal(negative.offset, 0)

  const garbage = await queryAdmin(env, { limit: 'abc', offset: 'xyz' })
  assert.equal(garbage.limit, 50)
  assert.equal(garbage.offset, 0)
})
