import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

import { loadProjectAliases } from '../src/lib/projectAliases.ts'

// config/project-aliases.json 记录「日报里的旧名 → 仓库现行名」。没有它，改过名的
// 项目会一直被判成「站内没有快照」，卡片把人送去 GitHub —— 而站内明明有能读的
// README 页面。实测做回填时那批候选 9 个全是改过名的。

const CONFIG_PATH = new URL('../config/project-aliases.json', import.meta.url)
const PROJECTS_DIR = new URL('../src/content/projects/', import.meta.url)

function snapshotNames() {
  const names = new Set()
  for (const file of readdirSync(PROJECTS_DIR)) {
    if (!file.endsWith('.md')) continue
    const fullName = /^fullName:\s*"([^"]+)"/m.exec(
      readFileSync(new URL(file, PROJECTS_DIR), 'utf8'),
    )?.[1]
    if (fullName) names.add(fullName.toLowerCase())
  }
  return names
}

test('别名表形状正确', () => {
  const payload = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
  assert.ok(payload.aliases && typeof payload.aliases === 'object')
  const entries = Object.entries(payload.aliases)
  assert.ok(entries.length > 0, '别名表不该是空的')
  for (const [oldName, newName] of entries) {
    assert.match(oldName, /^[^/\s]+\/[^/\s]+$/, `旧名形状不对: ${oldName}`)
    assert.match(newName, /^[^/\s]+\/[^/\s]+$/, `新名形状不对: ${newName}`)
    assert.notEqual(oldName.toLowerCase(), newName.toLowerCase(), `${oldName} 映射到自己没有意义`)
  }
})

test('loadProjectAliases 返回小写键，能和日报里的 name 直接对上', () => {
  const aliases = loadProjectAliases()
  assert.ok(aliases.size > 0)
  for (const key of aliases.keys()) assert.equal(key, key.toLowerCase())
  const [firstKey] = aliases.keys()
  assert.ok(aliases.has(firstKey.toUpperCase().toLowerCase()))
})

test('表缺失时返回空映射而不是抛错（构建不能因此挂掉）', () => {
  const original = process.cwd
  try {
    // @ts-expect-error 测试里临时替换
    process.cwd = () => '/nonexistent-directory-for-test'
    assert.equal(loadProjectAliases().size, 0)
  } finally {
    process.cwd = original
  }
})

// 这条锁住的是「别名必须有落点」：如果映射到的仓库在站内根本没有快照，
// 那这张表就解决不了问题，卡片照样会指向 GitHub。
test('每个别名指向的仓库在站内都有快照', () => {
  const aliases = loadProjectAliases()
  const snapshots = snapshotNames()
  const dangling = []
  for (const [oldName, newName] of aliases) {
    if (!snapshots.has(newName.toLowerCase())) dangling.push(`${oldName} -> ${newName}`)
  }
  assert.deepEqual(dangling, [], '这些别名指向的仓库在 src/content/projects 里没有快照')
})

// 反向检查：别名里的旧名不应该本身也是快照名（否则说明表里有过期条目）
test('别名表的旧名不应与现有快照名重名', () => {
  const aliases = loadProjectAliases()
  const snapshots = snapshotNames()
  const stale = [...aliases.keys()].filter((oldName) => snapshots.has(oldName))
  assert.deepEqual(stale, [], '这些旧名同时也是快照名，映射可能已经过期')
})
