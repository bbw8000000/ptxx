import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// 仓库改名/转手后的「旧名 → 现行名」映射，由 scripts/github_project_snapshot.py
// 在抓快照时自动记录（GitHub 用旧名字请求会 301 到新名字，脚本把差异写下来）。
//
// 为什么需要：日报正文里留下的是**收录当时**的名字，而快照文件是按现行名建的。
// 没有这张表，卡片的名字和快照的 fullName 对不上，明明站内已经有能读的 README 页面，
// 卡片却还是会把人送去 GitHub。实测做回填时那批候选 9 个全都是改过名的。
//
// 表缺失或损坏时返回空映射，不影响构建（退化成「按原名字匹配」）。
export function loadProjectAliases(): Map<string, string> {
  try {
    const path = resolve(process.cwd(), 'config', 'project-aliases.json')
    const payload = JSON.parse(readFileSync(path, 'utf8')) as {
      aliases?: Record<string, string>
    }
    const aliases = new Map<string, string>()
    for (const [oldName, newName] of Object.entries(payload.aliases ?? {})) {
      if (oldName && newName) aliases.set(oldName.toLowerCase(), newName)
    }
    return aliases
  } catch {
    return new Map()
  }
}
