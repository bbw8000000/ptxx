import assert from 'node:assert/strict'
import test from 'node:test'

import {
  cleanCommentId,
  cleanContent,
  cleanCredential,
  cleanDisplayName,
  cleanEmail,
  cleanPageId,
  cleanPassword,
  cleanPhotoUrl,
  isCommentStatus,
  utf8Length,
} from '../functions/_lib/validate.ts'

// Length limits are in UTF-8 bytes because that is what Firestore's size()
// measured, so these have to count CJK characters as three bytes.

test('utf8Length counts bytes, not characters', () => {
  assert.equal(utf8Length('abc'), 3)
  assert.equal(utf8Length('中'), 3)
  assert.equal(utf8Length('中文'), 6)
})

test('cleanEmail normalises case and whitespace', () => {
  assert.equal(cleanEmail('  Me@Example.COM '), 'me@example.com')
})

test('cleanEmail rejects malformed addresses', () => {
  assert.equal(cleanEmail('nope'), null)
  assert.equal(cleanEmail('no spaces@example.com'), null)
  assert.equal(cleanEmail('a@b'), null)
  assert.equal(cleanEmail(''), null)
  assert.equal(cleanEmail(42), null)
  assert.equal(cleanEmail(`${'a'.repeat(250)}@example.com`), null)
})

test('cleanPassword enforces the byte floor and keeps surrounding spaces', () => {
  assert.equal(cleanPassword('12345678901'), null, '11 bytes is below the floor')
  assert.equal(cleanPassword('123456789012'), '123456789012')
  // Trimming would silently change the credential, so spaces are preserved.
  assert.equal(cleanPassword('  spaced password  '), '  spaced password  ')
})

test('cleanPassword rejects control characters', () => {
  const withNul = `abc${String.fromCharCode(0)}defghijkl`
  assert.equal(cleanPassword(withNul), null)
})

// Used to verify an *existing* credential during a password change. It must not
// enforce the current minimum, or a too-short old password would be reported as
// "长度不符" instead of the uniform "当前密码不正确".
test('cleanCredential accepts below-minimum values but rejects malformed ones', () => {
  assert.equal(cleanCredential('short'), 'short')
  assert.equal(cleanCredential('a'.repeat(200)), 'a'.repeat(200))
  assert.equal(cleanCredential(''), null)
  assert.equal(cleanCredential('   '), '   ', 'spaces are a legitimate credential')
  assert.equal(cleanCredential('a'.repeat(201)), null)
  assert.equal(cleanCredential(undefined), null)
  assert.equal(cleanCredential(null), null)
  assert.equal(cleanCredential(42), null)
  assert.equal(cleanCredential(`abc${String.fromCharCode(7)}def`), null)
})

test('cleanDisplayName trims, enforces the cap, and rejects control characters', () => {
  assert.equal(cleanDisplayName('  Alice  '), 'Alice')
  assert.equal(cleanDisplayName(''), null)
  assert.equal(cleanDisplayName('  '), null)
  assert.equal(cleanDisplayName('a'.repeat(200)), 'a'.repeat(200))
  assert.equal(cleanDisplayName('a'.repeat(201)), null)
  assert.equal(cleanDisplayName(`bad${String.fromCharCode(7)}name`), null)
  // Newlines and tabs are allowed: pasted text and code snippets carry them.
  assert.equal(cleanDisplayName('line one\nline two\tindented'), 'line one\nline two\tindented')
})

test('cleanContent preserves whitespace but caps at 2000 bytes', () => {
  // Leading indentation is meaningful: comments can contain code.
  assert.equal(cleanContent('    indented code'), '    indented code')
  assert.equal(cleanContent('   ').trim(), '', 'whitespace-only content is still a value')
  assert.equal(cleanContent('a'.repeat(2000)), 'a'.repeat(2000))
  assert.equal(cleanContent('a'.repeat(2001)), null)
  // 700 CJK characters are 2100 bytes and must be rejected even though the
  // character count is well under 2000.
  assert.equal(cleanContent('中'.repeat(700)), null)
  assert.equal(cleanContent('中'.repeat(600)), '中'.repeat(600))
  assert.equal(cleanContent(''), null)
})

test('cleanPageId accepts only non-empty paths within the cap', () => {
  assert.equal(cleanPageId('/blog/some-post/'), '/blog/some-post/')
  assert.equal(cleanPageId(''), null)
  assert.equal(cleanPageId(undefined), null)
  assert.equal(cleanPageId(`/${'a'.repeat(512)}`), null)
})

test('cleanPhotoUrl allows empty or absolute https only', () => {
  assert.equal(cleanPhotoUrl(''), '')
  assert.equal(cleanPhotoUrl(undefined), '')
  assert.equal(cleanPhotoUrl('https://example.com/a.png'), 'https://example.com/a.png')
  assert.equal(cleanPhotoUrl('http://example.com/a.png'), null, 'plain http is rejected')
  assert.equal(cleanPhotoUrl('javascript:alert(1)'), null)
  assert.equal(cleanPhotoUrl('https://example.com/a b.png'), null, 'whitespace is rejected')
  assert.equal(cleanPhotoUrl('not a url'), null)
})

test('cleanCommentId matches the id charset used by the schema', () => {
  assert.equal(cleanCommentId('abc-DEF_123'), 'abc-DEF_123')
  assert.equal(cleanCommentId('has space'), null)
  assert.equal(cleanCommentId('has/slash'), null)
  assert.equal(cleanCommentId('a'.repeat(129)), null)
  assert.equal(cleanCommentId(''), null)
})

test('isCommentStatus accepts only the three moderation states', () => {
  assert.equal(isCommentStatus('approved'), true)
  assert.equal(isCommentStatus('pending'), true)
  assert.equal(isCommentStatus('rejected'), true)
  assert.equal(isCommentStatus('deleted'), false)
  assert.equal(isCommentStatus(undefined), false)
})
