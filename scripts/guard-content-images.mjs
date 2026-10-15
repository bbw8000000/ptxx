// 构建前守卫：处理会让 `astro build` 直接失败、或上线后必然 404 的图片引用。
//
// 背景：2026-09-28 日报自动化在 `npm run build` 的**第一步 astro build** 就挂了：
//
//     [ImageNotFound] Could not find requested image `assets/ai-rd-benchmarks.png`
//
// Astro 的内容集合会校验 Markdown 里的图片引用；只要有一条指向不存在的本地文件，
// 整站构建就失败 —— 当天日报提不上去、站点也部署不了。这类引用来自自动生成的内容
// （项目快照镜像的 README、日报正文），内容本身来自外部仓库，无法保证干净。
//
// 两条规则：
//   1. 相对路径（image.jpg / assets/x.png）—— astro build 直接失败，必须清掉
//   2. 站内绝对路径（/hero/missing.svg）—— 构建能过，但线上是 404，也清掉
// 外链、data URI、以及真实存在的站内文件一律不动。
//
// 代码围栏里的示例会被跳过：文档里本来就会写 ![图片描述](image.jpg) 这种占位语法。
//
// 用法：
//   node scripts/guard-content-images.mjs          # 只检查，发现问题就非 0 退出
//   node scripts/guard-content-images.mjs --fix    # 就地清掉这些问题引用
//   --content <dir> / --public <dir>               # 覆盖扫描根目录（测试用）

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const argv = process.argv.slice(2)
function optionValue(name, fallback) {
  const index = argv.indexOf(name)
  return index === -1 ? fallback : argv[index + 1]
}

const CONTENT_ROOT = optionValue('--content', 'src/content')
const PUBLIC_ROOT = optionValue('--public', 'public')
const fix = argv.includes('--fix')

/** Markdown 图片：[alt](target "title")，target 里可能带括号或空格。 */
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
/** 原始 HTML 图片：快照清洗会先删标签，但日报正文可能带进来。 */
const HTML_IMAGE = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi
/** frontmatter 的 heroImage，只认真有值的写法 */
const HERO_IMAGE = /^heroImage:[ \t]*(?:"([^"\n]+)"|'([^'\n]+)'|([^\s"'\n][^\n]*))$/gm

/**
 * 把代码围栏（``` 或 ~~~）之间的内容替换成等长空行，行号保持不变。
 * 不做这一步的话，文档里演示语法的占位图片会被误判成真引用。
 */
function maskCodeFences(text) {
  const lines = text.split('\n')
  let fence = null
  return lines
    .map((line) => {
      const match = /^\s*(`{3,}|~{3,})/.exec(line)
      if (!fence && match) {
        fence = match[1][0].repeat(3)
        return ''
      }
      if (fence) {
        const closing = new RegExp(`^\\s*${fence[0]}{3,}\\s*$`)
        if (closing.test(line)) fence = null
        return ''
      }
      return line
    })
    .join('\n')
}

/** 站内绝对路径是否真的存在对应文件（Astro 的 public/ 与 src/ 都算）。 */
function absoluteTargetExists(target) {
  const clean = target.split(/[?#]/)[0]
  const withoutBase = clean.replace(/^\/blog\//, '/')
  return (
    existsSync(join(PUBLIC_ROOT, withoutBase.replace(/^\//, ''))) ||
    existsSync(join('src', withoutBase.replace(/^\//, '')))
  )
}

/** 判断一条引用是否需要处理；返回原因或 null。 */
function problemWith(target) {
  const value = String(target ?? '')
    .trim()
    .replace(/^<|>$/g, '')
  if (!value) return null
  if (/^(https?:|data:|mailto:|#)/i.test(value)) return null
  if (!/\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?)(\?|#|$)/i.test(value)) return null
  if (value.startsWith('/')) {
    return absoluteTargetExists(value) ? null : '站内路径不存在文件'
  }
  return '相对路径会让 astro build 失败'
}

function collectContentFiles(root) {
  const files = []
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (/\.(md|mdx)$/.test(entry.name)) files.push(path)
    }
  }
  walk(root)
  return files
}

function findOffenders(masked) {
  const offenders = []
  for (const match of masked.matchAll(MARKDOWN_IMAGE)) {
    const reason = problemWith(match[2])
    if (reason) offenders.push({ kind: 'markdown', target: match[2], reason })
  }
  for (const match of masked.matchAll(HTML_IMAGE)) {
    const reason = problemWith(match[1])
    if (reason) offenders.push({ kind: 'html', target: match[1], reason })
  }
  for (const match of masked.matchAll(HERO_IMAGE)) {
    const target = match[1] ?? match[2] ?? match[3] ?? ''
    const reason = problemWith(target)
    if (reason) offenders.push({ kind: 'heroImage', target, reason })
  }
  return offenders
}

/** 只改「真引用」那部分文本；代码围栏里的示例保持原样。 */
function sanitiseLine(line) {
  let output = line
  output = output.replace(MARKDOWN_IMAGE, (whole, alt, target) => {
    if (!problemWith(target)) return whole
    const label = String(alt || '').trim()
    return label ? `*图片：${label}（原图 ${target} 不在仓库内）*` : ''
  })
  output = output.replace(HTML_IMAGE, (whole, target) => {
    if (!problemWith(target)) return whole
    return `*图片：${target} 不在仓库内*`
  })
  if (HERO_IMAGE.test(output)) {
    HERO_IMAGE.lastIndex = 0
    output = output.replace(HERO_IMAGE, (whole, first, second, third) => {
      const target = first ?? second ?? third ?? ''
      return problemWith(target) ? '' : whole
    })
  }
  return output
}

/**
 * 逐行清理，并跳过代码围栏。
 * 注意不能用 maskCodeFences 的结果当输出 —— 那里把围栏内容替换成了空行，
 * 写回文件会把文档里的示例整段删掉（测试抓过这个 bug）。
 */
function sanitise(text) {
  const lines = text.split('\n')
  let fence = null
  return lines
    .map((line) => {
      const match = /^\s*(`{3,}|~{3,})/.exec(line)
      if (!fence && match) {
        fence = match[1][0].repeat(3)
        return line
      }
      if (fence) {
        if (new RegExp(`^\\s*${fence[0]}{3,}\\s*$`).test(line)) fence = null
        return line
      }
      return sanitiseLine(line)
    })
    .join('\n')
}

if (!statSync(CONTENT_ROOT).isDirectory()) {
  console.error(`guard-content-images: 找不到 ${CONTENT_ROOT}`)
  process.exit(1)
}

const files = collectContentFiles(CONTENT_ROOT)
const reports = []

for (const file of files) {
  const text = readFileSync(file, 'utf8')
  const offenders = findOffenders(maskCodeFences(text))
  if (!offenders.length) continue

  reports.push({ file, shown: relative('.', file).split(sep).join('/'), offenders })

  if (fix) {
    const cleaned = sanitise(text)
    if (cleaned !== text) writeFileSync(file, cleaned)
  }
}

const total = reports.reduce((sum, item) => sum + item.offenders.length, 0)
console.log(
  `guard-content-images: 扫描 ${files.length} 个内容文件，发现 ${total} 处问题引用（${reports.length} 个文件）`,
)

for (const report of reports) {
  console.log(`\n  ${report.shown}`)
  for (const offender of report.offenders.slice(0, 5)) {
    console.log(`    [${offender.kind}] ${offender.target} — ${offender.reason}`)
  }
  if (report.offenders.length > 5) console.log(`    … 其余 ${report.offenders.length - 5} 处`)
}

if (!reports.length) {
  console.log('guard-content-images: OK')
  process.exit(0)
}

if (fix) {
  console.log('\nguard-content-images: 已清掉上述引用（改写为纯文本说明）')
  process.exit(0)
}

console.error(
  '\nguard-content-images: 相对路径会让 astro build 直接失败，站内绝对路径会线上 404。' +
    '\n  运行 `node scripts/guard-content-images.mjs --fix` 清理，或修正图片路径。',
)
process.exit(1)
