import assert from 'node:assert/strict'
import test from 'node:test'

import {
  CONTENT_MAX_BYTES,
  DISPLAY_NAME_MAX_BYTES,
  PAGE_ID_MAX_BYTES,
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_BYTES,
  utf8Length,
} from '../src/utils/textLimits.ts'
import {
  CONTENT_MAX,
  DISPLAY_NAME_MAX,
  PAGE_ID_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  utf8Length as serverUtf8Length,
} from '../functions/_lib/validate.ts'

// The client and the API each keep their own copy of these limits: functions/ is
// bundled separately by Cloudflare Pages and cannot import from src/. That makes
// drift the real risk — the frontend used to count characters while the backend
// counted bytes, so 2000 Chinese characters passed the form and then failed with
// a 400. These assertions turn any future drift into a failing test.

test('前端与后端的限制值逐一相同', () => {
  assert.equal(PASSWORD_MIN_BYTES, PASSWORD_MIN, 'PASSWORD_MIN')
  assert.equal(PASSWORD_MAX_BYTES, PASSWORD_MAX, 'PASSWORD_MAX')
  assert.equal(DISPLAY_NAME_MAX_BYTES, DISPLAY_NAME_MAX, 'DISPLAY_NAME_MAX')
  assert.equal(CONTENT_MAX_BYTES, CONTENT_MAX, 'CONTENT_MAX')
  assert.equal(PAGE_ID_MAX_BYTES, PAGE_ID_MAX, 'PAGE_ID_MAX')
})

test('前端 utf8Length 与后端实现一致', () => {
  for (const sample of ['', 'abc', '中', '中文', 'emoji 🍁', 'a\n\tb', '　全角空格']) {
    assert.equal(utf8Length(sample), serverUtf8Length(sample), JSON.stringify(sample))
  }
})

test('字节语义：CJK 内容按 3 字节计', () => {
  assert.equal(utf8Length('中'), 3)
  // 一个 2000 字符的中文评论远超 2000 字节的上限——这正是前后端口径不一致时
  // 被放过、然后被后端拒绝的输入。
  assert.ok(utf8Length('中'.repeat(2000)) > CONTENT_MAX_BYTES)
  assert.ok(utf8Length('a'.repeat(2000)) <= CONTENT_MAX_BYTES)
})
