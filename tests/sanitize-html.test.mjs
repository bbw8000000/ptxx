import assert from 'node:assert/strict'
import test from 'node:test'

import { isSafeUrlAttribute } from '../src/lib/sanitizeHtml.ts'

// 只测不依赖 DOM 的那部分策略。sanitizeHtml 本身需要 document，
// 由 astro check + 构建覆盖；这里锁住的是「哪些 URL 放行」这条安全边界。

const BASE = 'https://example.com/blog/post/'

test('http(s) 资源放行', () => {
  assert.equal(isSafeUrlAttribute('https://cdn.example.com/a.png', 'src', BASE), true)
  assert.equal(isSafeUrlAttribute('http://cdn.example.com/a.png', 'src', BASE), true)
  assert.equal(isSafeUrlAttribute('//cdn.example.com/a.png', 'src', BASE), true)
})

test('非 http(s) 的 src 一律拒绝', () => {
  assert.equal(isSafeUrlAttribute('data:image/svg+xml,<svg/>', 'src', BASE), false)
  assert.equal(isSafeUrlAttribute('javascript:alert(1)', 'src', BASE), false)
  assert.equal(isSafeUrlAttribute('vbscript:msgbox(1)', 'src', BASE), false)
  assert.equal(isSafeUrlAttribute('file:///etc/passwd', 'src', BASE), false)
})

test('链接放行 http(s) / mailto / tel 与相对地址', () => {
  assert.equal(isSafeUrlAttribute('https://example.com/', 'href', BASE), true)
  assert.equal(isSafeUrlAttribute('mailto:me@example.com', 'href', BASE), true)
  assert.equal(isSafeUrlAttribute('tel:+8613800000000', 'href', BASE), true)
  // 相对链接与锚点会以页面地址解析，协议仍是 http(s)
  assert.equal(isSafeUrlAttribute('#section', 'href', BASE), true)
  assert.equal(isSafeUrlAttribute('/blog/other/', 'href', BASE), true)
  assert.equal(isSafeUrlAttribute('./sibling', 'href', BASE), true)
})

test('链接里的危险协议被拒绝', () => {
  assert.equal(isSafeUrlAttribute('javascript:alert(1)', 'href', BASE), false)
  assert.equal(isSafeUrlAttribute('  JavaScript:alert(1)  ', 'href', BASE), false)
  assert.equal(isSafeUrlAttribute('data:text/html,<script>x</script>', 'href', BASE), false)
  assert.equal(isSafeUrlAttribute('blob:https://example.com/uuid', 'href', BASE), false)
})

test('formaction / action / poster 也被校验', () => {
  // 原实现只校验 href/src/xlink:href，这几个就是绕过点。
  assert.equal(isSafeUrlAttribute('javascript:alert(1)', 'formaction', BASE), false)
  assert.equal(isSafeUrlAttribute('https://example.com/x', 'formaction', BASE), true)
  // action 走链接策略（允许相对地址），但危险协议同样被拒
  assert.equal(isSafeUrlAttribute('javascript:alert(1)', 'action', BASE), false)
  assert.equal(isSafeUrlAttribute('/blog/api/submit', 'action', BASE), true)
  assert.equal(isSafeUrlAttribute('data:image/png;base64,AAAA', 'poster', BASE), false)
})

test('无法解析的值一律拒绝', () => {
  assert.equal(isSafeUrlAttribute('http://[', 'src', BASE), false)
})
