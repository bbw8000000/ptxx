import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

export { isRestrictedGithubProject } from './projectSafety'

// 已从 GitHub 消失的仓库（被删除或转为私有），由回填脚本记录在
// config/projects-without-readme.json。这些页面的「原始仓库」链接会 404，
// 页面上要如实说明，而不是继续显示「README 稍后补充」。
export function loadRetiredProjects(): Set<string> {
  try {
    const policyPath = resolve(process.cwd(), 'config', 'projects-without-readme.json')
    const payload = JSON.parse(readFileSync(policyPath, 'utf8')) as {
      projects?: { fullName?: string }[]
    }
    return new Set(
      (payload.projects ?? [])
        .map((item) => String(item.fullName ?? '').toLowerCase())
        .filter((name) => name.length > 0),
    )
  } catch {
    // 清单缺失或损坏时按「没有下架项目」处理，不影响构建
    return new Set()
  }
}
export interface GithubProjectArchiveItem {
  owner: string
  name: string
  fullName: string
  description: string
  sourceUrl: string
  stars: number
  language: string
  topics: string[]
  firstSeen: string
  lastSeen: string
  appearances: number
}

const postsDirectory = resolve(process.cwd(), 'src', 'content', 'posts')
const projectLinkPattern =
  /\[([^\]\r\n]+)\]\((https:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?)\)/g
const dailyHeadingPattern =
  /^###\s+\d+\.\s+\[([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\]\((https:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?)\)\s*$/gm
function parseStars(value: string | undefined): number {
  if (!value) return 0
  const normalized = value.toLowerCase()
  const amount = Number.parseFloat(normalized.replace('k', ''))
  if (!Number.isFinite(amount)) return 0
  return Math.round(normalized.includes('k') ? amount * 1000 : amount)
}

function dateFromFilename(filename: string): string {
  return filename.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? ''
}

function addProject(
  projects: Map<string, GithubProjectArchiveItem>,
  project: Omit<GithubProjectArchiveItem, 'firstSeen' | 'lastSeen' | 'appearances'>,
  seenDate: string,
) {
  const key = project.fullName.toLowerCase()
  const existing = projects.get(key)
  if (!existing) {
    projects.set(key, {
      ...project,
      firstSeen: seenDate,
      lastSeen: seenDate,
      appearances: 1,
    })
    return
  }

  existing.firstSeen = [existing.firstSeen, seenDate].filter(Boolean).sort()[0] ?? ''
  existing.lastSeen = [existing.lastSeen, seenDate].filter(Boolean).sort().at(-1) ?? ''
  existing.appearances += 1
  if (project.description && project.description.length > existing.description.length) {
    existing.description = project.description
  }
  if (project.stars > existing.stars) existing.stars = project.stars
  if (project.language !== '未知') existing.language = project.language
  existing.topics = [...new Set([...existing.topics, ...project.topics])].slice(0, 8)
}

export function loadGithubProjectArchive(): GithubProjectArchiveItem[] {
  const projects = new Map<string, GithubProjectArchiveItem>()
  const filenames = readdirSync(postsDirectory).filter(
    (filename) => filename.endsWith('.md') && !filename.startsWith('risk-daily-'),
  )

  for (const filename of filenames) {
    const content = readFileSync(`${postsDirectory}/${filename}`, 'utf8')
    const seenDate = dateFromFilename(filename)

    for (const match of content.matchAll(dailyHeadingPattern)) {
      const [fullMatch, owner, name, sourceUrl] = match
      const sectionStart = (match.index ?? 0) + fullMatch.length
      const nextHeading = content.indexOf('\n### ', sectionStart)
      const section = content.slice(sectionStart, nextHeading === -1 ? undefined : nextHeading)
      const description =
        section.match(/^>\s+(.+)$/m)?.[1]?.trim() || `开源项目 ${owner}/${name} 的站内资料。`
      const stats = section.match(
        /\*\*([\d.]+k?)\*\*\s+stars\s+·\s+语言:\s+\*\*([^*]+)\*\*\s*(.*)/i,
      )
      const topics = [...(stats?.[3] ?? '').matchAll(/`([^`]+)`/g)].map((topic) => topic[1])

      addProject(
        projects,
        {
          owner,
          name,
          fullName: `${owner}/${name}`,
          description,
          sourceUrl: sourceUrl.replace(/\/$/, ''),
          stars: parseStars(stats?.[1]),
          language: stats?.[2]?.trim() || '未知',
          topics,
        },
        seenDate,
      )
    }

    for (const match of content.matchAll(projectLinkPattern)) {
      const [, label, sourceUrl, owner, name] = match
      const key = `${owner}/${name}`.toLowerCase()
      if (projects.has(key)) continue
      addProject(
        projects,
        {
          owner,
          name,
          fullName: `${owner}/${name}`,
          description:
            label === `${owner}/${name}` ? `开源项目 ${owner}/${name} 的站内资料。` : label,
          sourceUrl: sourceUrl.replace(/\/$/, ''),
          stars: 0,
          language: '未知',
          topics: [],
        },
        seenDate,
      )
    }
  }

  return [...projects.values()].sort(
    (a, b) => b.lastSeen.localeCompare(a.lastSeen) || b.stars - a.stars,
  )
}
