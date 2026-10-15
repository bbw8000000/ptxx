import assert from 'node:assert/strict'
import test from 'node:test'

import {
  clientIp,
  commentRules,
  HOUR,
  loginRules,
  MINUTE,
  passwordChangeRules,
  registerRules,
} from '../functions/_lib/ratelimit.ts'

// 限流的桶设计是安全边界，不是实现细节：漏掉一个维度就等于没有限流。

test('login 同时按 IP 与邮箱限流', () => {
  const rules = loginRules('1.2.3.4', 'a@b.c')
  const buckets = rules.map((rule) => rule.bucket)
  assert.ok(buckets.includes('login:ip:1.2.3.4'))
  assert.ok(buckets.includes('login:email:a@b.c'))
  // 两个窗口都要有：分钟级挡撞库，小时级挡慢速喷洒
  assert.deepEqual(
    rules.map((rule) => rule.windowMs).sort((a, b) => a - b),
    [MINUTE, MINUTE, HOUR, HOUR],
  )
})

test('register 按 IP 限流（没有账号维度可用）', () => {
  const rules = registerRules('1.2.3.4')
  assert.deepEqual(
    rules.map((rule) => rule.bucket),
    ['register:ip:1.2.3.4', 'register:ip:1.2.3.4'],
  )
  assert.deepEqual(
    rules.map((rule) => rule.windowMs),
    [HOUR, 24 * HOUR],
  )
})

test('评论创建必须同时有账号与 IP 维度', () => {
  const rules = commentRules('1.2.3.4', 'user-1')
  const buckets = rules.map((rule) => rule.bucket)
  // 只有账号维度时，注册一个新账号就能绕开限流——这条断言就是防这个回归。
  assert.ok(buckets.includes('comment:user:user-1'), '缺少账号维度')
  assert.ok(buckets.includes('comment:ip:1.2.3.4'), '缺少 IP 维度')
  assert.ok(
    rules.some((rule) => rule.bucket === 'comment:ip:1.2.3.4' && rule.windowMs === 24 * HOUR),
    '缺少 IP 的日窗口',
  )
})

test('评论的 IP 额度足够容纳共享出口，且日额度大于小时额度', () => {
  const rules = commentRules('1.2.3.4', 'u')
  const account = rules.find((rule) => rule.bucket === 'comment:user:u')
  const ipHour = rules.find(
    (rule) => rule.bucket === 'comment:ip:1.2.3.4' && rule.windowMs === HOUR,
  )
  const ipDay = rules.find(
    (rule) => rule.bucket === 'comment:ip:1.2.3.4' && rule.windowMs === 24 * HOUR,
  )
  assert.ok(account && ipHour && ipDay)
  // 一个共享出口（宿舍/CGNAT）至少不该比单个账号的额度更小，
  // 否则同网段的人会互相挤压。
  assert.ok(ipHour.max >= account.max, `IP 小时额度 ${ipHour.max} 小于账号额度 ${account.max}`)
  assert.ok(ipDay.max > ipHour.max, '日额度必须大于小时额度，否则日窗口没有意义')
})

test('改密只按 IP 限流，不按账号', () => {
  const rules = passwordChangeRules('1.2.3.4')
  // 按账号限流会让任何人都能把别人锁在改密之外。
  assert.deepEqual(
    rules.map((rule) => rule.bucket),
    ['password:ip:1.2.3.4', 'password:ip:1.2.3.4'],
  )
})

test('clientIp 取 Cloudflare 注入的请求头，缺失时退化', () => {
  assert.equal(
    clientIp(new Request('https://x.test/', { headers: { 'CF-Connecting-IP': '9.9.9.9' } })),
    '9.9.9.9',
  )
  assert.equal(clientIp(new Request('https://x.test/')), 'unknown')
})
