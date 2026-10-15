import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { loadGoneProjects } from '../src/lib/goneProjects.ts'

// config/projects-gone.json 由 scripts/check_gone_projects.py 实测 GitHub API 生成，
// 决定「哪些仓库已经没了、不能再做成可点击的链接」。它一旦损坏或漏项，
// 读者点到的就是 404 —— 所以形状和内容都要锁住。

const CONFIG_PATH = new URL('../config/projects-gone.json', import.meta.url)

test('清单存在且形状正确', () => {
  const payload = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
  assert.equal(typeof payload.checkedAt, 'string')
  assert.match(payload.checkedAt, /^\d{4}-\d{2}-\d{2}T/, 'checkedAt 应当是 ISO 时间戳')
  assert.ok(Array.isArray(payload.projects), 'projects 应当是数组')
  assert.ok(payload.projects.length > 0, '清单不该是空的')
  for (const item of payload.projects) {
    assert.match(item.fullName, /^[^/\s]+\/[^/\s]+$/, `fullName 形状不对: ${item.fullName}`)
  }
})

test('清单里没有重复项，且全部小写可匹配', () => {
  const names = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')).projects.map((item) =>
    item.fullName.toLowerCase(),
  )
  assert.equal(new Set(names).size, names.length, '存在重复的 fullName')
})

test('loadGoneProjects 返回小写集合，能和 pick 的 name 直接比对', () => {
  const set = loadGoneProjects()
  assert.ok(set.size > 0)
  for (const name of set) assert.equal(name, name.toLowerCase())
  // 日报里的 name 是 "Owner/Repo" 这种形态，两边都小写后才能命中
  const sample = [...set][0]
  assert.ok(set.has(sample.toUpperCase().toLowerCase()))
})

test('清单缺失时返回空集合而不是抛错（构建不能因此挂掉）', () => {
  // 用一个不存在的工作目录调用即可：loadGoneProjects 按 process.cwd() 解析路径
  const original = process.cwd
  try {
    // @ts-expect-error 测试里临时替换
    process.cwd = () => '/nonexistent-directory-for-test'
    assert.equal(loadGoneProjects().size, 0)
  } finally {
    process.cwd = original
  }
})
