// 找出「产物里 0 引用、源码里也 0 引用」的 public 资源，并生成删除清单。
//
//   node scripts/find-unused-assets.mjs            # 只报告
//   node scripts/find-unused-assets.mjs --delete   # 删除（会打印完整清单）
//
// 为什么要两道检查：产物里没引用，可能是被构建期读取（比如脚本当素材用），
// 也可能是 og:image 之类只在 meta 里出现。两边都确认过才敢删。
//
// 特例说明：
//   - `@fontsource/noto-serif-sc` 在源码里「0 引用」，但字体分档脚本要从它的 files/
//     目录读源字体，绝不能删依赖。脚本同理会对这类名字做白名单。
//   - IndexNow 的密钥 txt 只被搜索引擎按网址访问，站点里当然没有引用。
//   - **public/fonts/ 绝不能碰**：那些 woff2 是站点的活字体，文件名带内容指纹，
//     页面里的 @font-face 是构建时注入的，用「产物文本里有没有这个文件名」判定会
//     把它们全部误判为未引用。maple.jpg 同理 —— 它是 <picture> 的 JPEG 回退源。
const KEEP_DIRS = ['fonts/']
const ALWAYS_KEEP = new Set([
  '.nojekyll',
  'robots.txt',
  'sw.js',
  'manifest.webmanifest',
  'BingSiteAuth.xml',
  'offline.html',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.svg',
  'rss.xml',
  'rss-style.xsl',
  'sitemap-index.xml',
  'sitemap-0.xml',
  '31d49cf6fd0c3b7df2bf0376e03a1ebf.txt', // IndexNow 密钥文件
  'maple.jpg', // WebP 海报的 JPEG 回退
])

import { existsSync, readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join, relative } from 'node:path'

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'dist2',
  'dist-new',
  '.astro',
  '.venv-jcm',
  '.wrangler',
  '.git.bak',
  '.wolf',
])

const deleteMode = process.argv.includes('--delete')

if (!existsSync('dist')) {
  console.error('请先 npm run build')
  process.exit(1)
}

// 1. 产物里所有被引用到的文件名字符串
const distText = []
const walkDist = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walkDist(path)
    else if (/\.(html|css|js|mjs|svg|xml|txt|json|webmanifest|xsl)$/.test(entry.name)) {
      distText.push(readFileSync(path, 'utf8'))
    }
  }
}
walkDist('dist')
const distCorpus = distText.join('\n')

// 2. 源码里所有被引用到的文件名字符串（构建期素材、og:image 的值等）
const srcText = []
const walkSrc = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walkSrc(path)
    else if (
      /\.(astro|ts|mjs|js|json|css|md|yml|yaml|sh|py)$/.test(entry.name) &&
      !entry.name.startsWith('find-unused')
    ) {
      srcText.push(readFileSync(path, 'utf8'))
    }
  }
}
walkSrc('.')
const srcCorpus = srcText.join('\n')

// 3. 逐个 public 文件判定
const unused = []
let unusedBytes = 0
const walkPublic = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkPublic(path)
      continue
    }
    const name = relative('public', path).split('\\').join('/')
    if (ALWAYS_KEEP.has(name)) continue
    if (KEEP_DIRS.some((dir) => name.startsWith(dir))) continue
    const base = name.split('/').pop()
    const referenced =
      distCorpus.includes(name) ||
      distCorpus.includes(encodeURI(name)) ||
      srcCorpus.includes(name) ||
      srcCorpus.includes(encodeURI(name)) ||
      // 有的地方只写文件名不写目录
      (base.length > 6 && (distCorpus.includes(base) || srcCorpus.includes(base)))
    if (referenced) continue
    const size = statSync(path).size
    unusedBytes += size
    unused.push({ name, path, size })
  }
}
walkPublic('public')
unused.sort((a, b) => b.size - a.size)

console.log(
  `未被引用的 public 资源: ${unused.length} 个，合计 ${Math.round(unusedBytes / 1024)}KB\n`,
)
for (const item of unused) {
  console.log(`  ${String(Math.round(item.size / 1024)).padStart(5)}KB  ${item.name}`)
}

if (!deleteMode) {
  console.log('\n（未删除。加 --delete 才会真的删，删除前请自行 review 上面的清单。）')
  process.exit(0)
}

for (const item of unused) unlinkSync(item.path)
console.log(`\n已删除 ${unused.length} 个文件，释放 ${Math.round(unusedBytes / 1024)}KB`)
