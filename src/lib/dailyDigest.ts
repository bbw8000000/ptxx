// 把「每日精选」日报正文解析成结构化条目。
//
// 日报由 scripts/generate_daily_digest.py 生成，条目形态固定：
//
//     ### 1. [owner/repo](../../projects/owner/repo/)
//
//     > 一句话简介
//
//     ⭐ **435** stars · 语言: **TypeScript** `ai` `cli`
//
// 这里做两件容易出错的事：
//
//   1. 链接有两种历史形态 —— 早期日报直接指向 https://github.com/owner/repo，
//      后来的日报走站内快照 ../../projects/owner/repo/。两种都要认。
//   2. 语言和 topics 都可能缺失（早期条目只写了 stars），不能假设一定存在。
//
// 项目名、stars、语言都以**日报正文**为准，而不是去读 projects 快照集合：
// 日报写的是「推荐当天」的数字，快照是另一时刻抓取的，两者本来就可能不同。

export interface DailyPick {
  /** 日报里的序号，缺失时为 0 */
  index: number
  /** owner/repo */
  name: string
  /** 站内项目页；没有对应快照时为 null */
  href: string | null
  /** GitHub 上的仓库地址 */
  sourceUrl: string | null
  description: string
  stars: number | null
  language: string | null
  topics: string[]
}

export interface DailyDigest {
  picks: DailyPick[]
}

const HEADING_RE = /^###\s+(\d+)\.\s+\[([^\]]+)\]\(([^)]+)\)\s*$/
const GITHUB_URL_RE = /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s#?]+)\/?$/
const SNAPSHOT_PATH_RE = /(?:^|\/)projects\/([^/\s]+)\/([^/\s]+)\/?$/
// 星数写在 "**435** stars" 里：加粗标记夹在数字和单位之间，所以模式要跨过 `**`。
// 大项目会用 "**1.4k** stars" 这种缩写，所以小数和 k/M 后缀都要认。
// 真实数据里 1123 条统计行中有 25 条是 k 形态，漏掉就会让热门项目显示成「星数未知」。
const STATS_RE = /([\d.,]+)\s*([kKmM]?)\s*\*{0,2}\s*stars?\b/i
const LANGUAGE_RE = /语言:\s*\*\*([^*]+)\*\*/
const TOPIC_RE = /`([^`]+)`/g
// 历史上给「已从 GitHub 下架」的条目加过一行警示 blockquote，它排在真正简介前面。
// 首页只该显示项目本身的简介，不该显示这句标注。
const NOTICE_RE = /(已从 GitHub 下架|已下架|不可访问|⚠️)/

/** 把两种链接形态都归一到 { name, href, sourceUrl }。 */
export function resolvePickLink(
  rawLink: string,
  base: string,
): Pick<DailyPick, 'name' | 'href' | 'sourceUrl'> | null {
  const link = rawLink.trim()

  const snapshot = SNAPSHOT_PATH_RE.exec(link)
  if (snapshot) {
    const [, owner, repo] = snapshot
    const normalizedBase = base.endsWith('/') ? base : `${base}/`
    return {
      name: `${owner}/${repo}`,
      href: `${normalizedBase}projects/${owner}/${repo}/`,
      sourceUrl: `https://github.com/${owner}/${repo}`,
    }
  }

  const github = GITHUB_URL_RE.exec(link)
  if (github) {
    const [, owner, repo] = github
    return {
      name: `${owner}/${repo}`,
      href: null,
      sourceUrl: `https://github.com/${owner}/${repo}`,
    }
  }

  return null
}

/** 解析单个条目的统计行；缺 stars 或语言都不算错。 */
export function parsePickStats(line: string): Pick<DailyPick, 'stars' | 'language' | 'topics'> {
  const starsMatch = STATS_RE.exec(line)
  let stars: number | null = null
  if (starsMatch) {
    const numeric = Number(starsMatch[1].replace(/,/g, ''))
    const suffix = starsMatch[2].toLowerCase()
    const multiplier = suffix === 'k' ? 1000 : suffix === 'm' ? 1_000_000 : 1
    if (Number.isFinite(numeric)) stars = Math.round(numeric * multiplier)
  }
  const languageMatch = LANGUAGE_RE.exec(line)
  const language = languageMatch ? languageMatch[1].trim() : null
  const topics = [...line.matchAll(TOPIC_RE)].map((match) => match[1]).filter(Boolean)
  return { stars, language, topics }
}

/** 解析一篇日报正文。解析不出条目时返回空 picks，由调用方决定要不要显示。 */
export function parseDailyDigest(body: string, options: { base?: string } = {}): DailyDigest {
  const base = options.base ?? '/'
  const lines = body.split(/\r?\n/)
  const picks: DailyPick[] = []

  let index = 0
  while (index < lines.length) {
    const line = lines[index]

    // 段落里的「一句话简介」以 > 开头，紧跟在标题后面
    if (line.startsWith('### ')) {
      const heading = HEADING_RE.exec(line.trim())
      if (heading) {
        const [, rawIndex, , rawLink] = heading
        const link = resolvePickLink(rawLink, base)
        if (link) {
          let description = ''
          let statsLine = ''
          let lookahead = index + 1
          while (lookahead < lines.length && !lines[lookahead].startsWith('### ')) {
            const candidate = lines[lookahead].trim()
            if (candidate.startsWith('>') && !description) {
              const quoted = candidate.replace(/^>\s?/, '').trim()
              // 跳过「已下架」警示，继续找真正的简介
              if (!NOTICE_RE.test(quoted)) description = quoted
            } else if (candidate && !statsLine && /stars?/i.test(candidate)) {
              statsLine = candidate
            }
            lookahead += 1
          }
          picks.push({
            index: Number(rawIndex),
            ...link,
            description,
            ...parsePickStats(statsLine),
          })
          index = lookahead
          continue
        }
      }
    }

    index += 1
  }

  return { picks }
}

/** 从 frontmatter 之外的正文里取日期（正文里没有就回退到文件名/调用方给的值）。 */
export function dailyDateFromId(id: string): string {
  const match = /(?:daily|risk-daily)-(\d{4}-\d{2}-\d{2})/.exec(id)
  return match ? match[1] : ''
}
