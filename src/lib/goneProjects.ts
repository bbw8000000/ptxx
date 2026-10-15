import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// 已经从 GitHub 消失的仓库清单（删除或转为私有），由
// scripts/check_gone_projects.py 实测 GitHub API 生成。
//
// 为什么需要它：日报是从搜索结果里挑「最近 24 小时涨星快」的仓库，其中相当一部分是
// 刷榜的垃圾项目，事后会被 GitHub 删除或封号。给这些项目留一个可点击的仓库链接，
// 读者点过去只会撞 404 —— 实测站内没有快照的 429 个项目里有 198 个（46%）已经没了。
//
// 名字层面的特征（crack / cheat / aimbot …）只能覆盖一部分：实测「名字像垃圾项目」
// 的样本 90% 已删，而「名字看着正常」的样本也有 45% 已删。所以这里用实测结果，
// 不做启发式猜测。
//
// 清单缺失或损坏时按「没有项目消失」处理，不影响构建。
export function loadGoneProjects(): Set<string> {
  try {
    const path = resolve(process.cwd(), 'config', 'projects-gone.json')
    const payload = JSON.parse(readFileSync(path, 'utf8')) as {
      projects?: { fullName?: string }[]
    }
    return new Set(
      (payload.projects ?? [])
        .map((item) => String(item.fullName ?? '').toLowerCase())
        .filter((name) => name.length > 0),
    )
  } catch {
    return new Set()
  }
}
