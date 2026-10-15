import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADMIN_PAGE_DEFAULT,
  ADMIN_PAGE_MAX,
  buildAdminWhere,
  clampLimit,
  clampOffset,
  escapeLikePattern,
} from '../functions/_lib/comments.ts'

// The admin list used to be `... LIMIT 500` with in-memory filtering, so totals
// and search were both wrong past 500 rows. These cover the query builder that
// replaced it.

const ESCAPE = "ESCAPE '\\'"

test('escapeLikePattern neutralises LIKE wildcards', () => {
  assert.equal(escapeLikePattern('plain'), 'plain')
  // Without escaping, "%" would match everything and "_" any single character.
  assert.equal(escapeLikePattern('50%'), '50\\%')
  assert.equal(escapeLikePattern('a_b'), 'a\\_b')
  // The escape character itself has to survive, or "100\" would break the query.
  assert.equal(escapeLikePattern('back\\slash'), 'back\\\\slash')
})

test('buildAdminWhere returns no clause when nothing is filtered', () => {
  assert.deepEqual(buildAdminWhere({ status: null, q: '' }), { clause: '', binds: [] })
  // Whitespace-only search is not a search.
  assert.deepEqual(buildAdminWhere({ status: null, q: '   ' }), { clause: '', binds: [] })
})

test('buildAdminWhere numbers its binds in order', () => {
  const statusOnly = buildAdminWhere({ status: 'pending', q: '' })
  assert.equal(statusOnly.clause, 'WHERE status = ?1')
  assert.deepEqual(statusOnly.binds, ['pending'])

  const searchOnly = buildAdminWhere({ status: null, q: 'hello' })
  assert.deepEqual(searchOnly.binds, ['%hello%'])
  // One bind reused by all three columns, so the placeholder must be ?1 each time.
  assert.ok(searchOnly.clause.includes(`display_name LIKE ?1 ${ESCAPE}`), searchOnly.clause)
  assert.ok(searchOnly.clause.includes(`page_id LIKE ?1 ${ESCAPE}`), searchOnly.clause)
  assert.ok(searchOnly.clause.includes(`content LIKE ?1 ${ESCAPE}`), searchOnly.clause)

  const both = buildAdminWhere({ status: 'approved', q: 'hi' })
  assert.equal(
    both.clause,
    `WHERE status = ?1 AND (display_name LIKE ?2 ${ESCAPE} OR page_id LIKE ?2 ${ESCAPE} OR content LIKE ?2 ${ESCAPE})`,
  )
  assert.deepEqual(both.binds, ['approved', '%hi%'])
})

test('buildAdminWhere escapes the search term inside the pattern', () => {
  const { binds } = buildAdminWhere({ status: null, q: '50%' })
  assert.deepEqual(binds, ['%50\\%%'])
})

test('clampLimit bounds the page size', () => {
  assert.equal(clampLimit(null), ADMIN_PAGE_DEFAULT)
  assert.equal(clampLimit('not-a-number'), ADMIN_PAGE_DEFAULT)
  assert.equal(clampLimit('0'), 1)
  assert.equal(clampLimit('-10'), 1)
  assert.equal(clampLimit('25'), 25)
  assert.equal(clampLimit(String(ADMIN_PAGE_MAX + 500)), ADMIN_PAGE_MAX)
})

test('clampOffset never goes negative', () => {
  assert.equal(clampOffset(null), 0)
  assert.equal(clampOffset('-5'), 0)
  assert.equal(clampOffset('nope'), 0)
  assert.equal(clampOffset('120'), 120)
})
