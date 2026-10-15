#!/usr/bin/env node
// 站点体检：只读扫描 dist，报告「不足」。不修改任何文件。
//
//   npm run check:site            报告问题；只有死链会让退出码非 0
//   npm run check:site -- --strict  警告也算失败（适合当 CI 门禁）
//
// 检查项：
//   1. 站内死链            —— 链接目标在产物里不存在（真 bug）
//   2. 孤儿页面            —— 构建出来了但没有任何内链指向，访客无法到达
//   3. 未被引用的静态资源  —— public/ 里没有任何产物引用到的文件
//   4. 已删除仓库的链接    —— 站外 GitHub 链接指向已经消失的仓库（读者会撞 404）
//   5. 规模概览            —— 页面数、内链数、体积
//
// 需要先 `npm run build`（脚本读的是 dist 产物，不是源码）。

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
const strict = process.argv.includes('--strict')

// 故意不被任何页面链接的文件：它们必须能通过固定 URL 直接访问。
const INTENTIONAL_UNLINKED = new Set([
  '.nojekyll', // GitHub Pages 需要它，否则 _astro 目录被忽略
  'robots.txt',
  'sw.js',
  'manifest.webmanifest',
])

// 有意不入站内导航的页面
// offline.html 只由 public/sw.js 在断网时提供，本来就不该有内链指向它
const INTENTIONAL_ORPHANS = new Set(['admin/index.html', 'offline.html'])

if (!existsSync(DIST)) {
  console.error('找不到 dist/，请先运行 `npm run build`。')
  process.exit(1)
}

const pages = []
;(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.html')) pages.push(full)
  }
})(DIST)

// ---------- 1 & 2：内链图 ----------
const inbound = new Map()
const broken = new Map()
let linkCount = 0

for (const page of pages) {
  const html = readFileSync(page, 'utf8')
  const from = relative(DIST, page).split(sep).join('/')
  const seen = new Set()

  for (const match of html.matchAll(/(?:href|src)="(\/blog\/[^"#?]*)"/g)) {
    let rel
    try {
      rel = decodeURIComponent(match[1].replace(/^\/blog\//, '')).replace(/\/$/, '')
    } catch {
      continue
    }
    linkCount++

    // 用文件系统实际存在性判断目标是页面还是静态文件。
    // 不要用「有没有扩展名」猜：仓库名里带点（sonar.cool / kimodo.cpp / Zapret-4.0）
    // 会被误判成文件，从而漏报孤儿页面。
    if (rel === '') {
      if (!seen.has('index.html')) {
        seen.add('index.html')
        inbound.set('index.html', (inbound.get('index.html') ?? 0) + 1)
      }
      continue
    }
    const asPage = `${rel}/index.html`
    if (existsSync(join(DIST, asPage))) {
      if (seen.has(asPage)) continue
      seen.add(asPage)
      inbound.set(asPage, (inbound.get(asPage) ?? 0) + 1)
      continue
    }
    if (existsSync(join(DIST, rel))) continue
    if (!broken.has(match[1])) broken.set(match[1], new Set())
    broken.get(match[1]).add(from)
  }
}

const orphans = pages
  .map((page) => relative(DIST, page).split(sep).join('/'))
  .filter((rel) => rel !== '404.html' && !INTENTIONAL_ORPHANS.has(rel))
  .filter((rel) => (inbound.get(rel) ?? 0) === 0)

// ---------- 3：未被引用的 public 资源 ----------
const haystack = []
;(function walkText(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkText(full)
    else if (/\.(html|css|js|mjs|svg|xml|txt|json|webmanifest)$/.test(entry.name)) {
      haystack.push(readFileSync(full, 'utf8'))
    }
  }
})(DIST)
const corpus = haystack.join('\n')

const unreferenced = []
let unreferencedBytes = 0
if (existsSync('public')) {
  ;(function walkPublic(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        walkPublic(full)
        continue
      }
      const name = relative('public', full).split(sep).join('/')
      if (INTENTIONAL_UNLINKED.has(name)) continue
      if (corpus.includes(name) || corpus.includes(encodeURI(name))) continue
      const size = statSync(full).size
      unreferencedBytes += size
      unreferenced.push({ name, size })
    }
  })('public')
}
unreferenced.sort((a, b) => b.size - a.size)

// ---------- 4：对外链接指向已删除的仓库 ----------
// config/projects-gone.json 是 scripts/check_gone_projects.py 逐仓库实测 GitHub API
// 得到的「仓库已经没了」清单（站内无快照的项目里约 46% 已被删除或封号）。
// 页面上再把它做成可点击链接，读者点过去只会撞 404。
//
// 站内死链由第 1 项覆盖，但这一项查的是**站外**目标，所以需要单独检查。
const goneListPath = 'config/projects-gone.json'
const goneNames = existsSync(goneListPath)
  ? (JSON.parse(readFileSync(goneListPath, 'utf8')).projects ?? [])
      .map((item) => String(item.fullName ?? '').toLowerCase())
      .filter(Boolean)
  : []
const goneSet = new Set(goneNames)
const deadRepoLinks = new Map()

if (goneSet.size) {
  for (const page of pages) {
    const html = readFileSync(page, 'utf8')
    const from = relative(DIST, page).split(sep).join('/')
    for (const match of html.matchAll(/href="(https:\/\/github\.com\/([^/"]+)\/([^/"]+))"/g)) {
      const key = `${match[2]}/${match[3]}`.toLowerCase()
      if (!goneSet.has(key)) continue
      if (!deadRepoLinks.has(match[1])) deadRepoLinks.set(match[1], new Set())
      deadRepoLinks.get(match[1]).add(from)
    }
  }
}

// ---------- 5：规模 ----------
let distBytes = 0
;(function walkSize(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkSize(full)
    else distBytes += statSync(full).size
  }
})(DIST)

// ---------- 报告 ----------
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`
console.log('站点体检报告（只读）')
console.log('─'.repeat(52))
console.log(
  `页面数 ${pages.length}   站内链接 ${linkCount}   dist 体积 ${(distBytes / 1024 / 1024).toFixed(1)} MB`,
)

console.log(`\n[1] 站内死链: ${broken.size}`)
for (const [target, sources] of [...broken.entries()].slice(0, 20)) {
  console.log(`    ${target}  <- ${[...sources].slice(0, 3).join(', ')}`)
}

console.log(`\n[2] 孤儿页面（构建出来但无内链可达）: ${orphans.length}`)
orphans.slice(0, 20).forEach((rel) => console.log(`    ${rel}`))

console.log(
  `\n[3] 未被引用的 public 资源: ${unreferenced.length} 个, 合计 ${kb(unreferencedBytes)}`,
)
unreferenced
  .slice(0, 15)
  .forEach((item) => console.log(`    ${kb(item.size).padStart(8)}  ${item.name}`))
if (unreferenced.length > 15) console.log(`    … 其余 ${unreferenced.length - 15} 个`)

console.log(
  `\n[4] 指向已删除仓库的链接: ${deadRepoLinks.size}` +
    (goneSet.size ? `（清单 ${goneSet.size} 个项目）` : '（清单缺失，未检查）'),
)
for (const [target, sources] of [...deadRepoLinks.entries()].slice(0, 15)) {
  console.log(`    ${target}  <- ${[...sources].slice(0, 3).join(', ')}`)
}

// 死链是真 bug；孤儿页、未引用资源、失效仓库链接只提示，除非 --strict。
const failed =
  broken.size > 0 ||
  (strict && (orphans.length > 0 || unreferenced.length > 0 || deadRepoLinks.size > 0))
console.log('\n' + '─'.repeat(52))
console.log(failed ? '结果: 有需要处理的问题' : '结果: 通过（警告项未计入失败）')
process.exit(failed ? 1 : 0)
