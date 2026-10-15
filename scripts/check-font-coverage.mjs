// Verify that every CJK character the built site renders is covered by a font pack
// that the page can actually load.
//
// build-font-packs.mjs covers the site by construction, so this is a coherence
// check: it catches a stale dist/, a half-generated pack set, or an injector that
// silently stopped writing blocks. A page with an uncovered character renders it
// from the system serif instead, which is a visible (if subtle) regression.
//
// Usage: node scripts/check-font-coverage.mjs [--dist dist] [--config config/font-packs.json]

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

function parseArgs(argv) {
  const options = { dist: 'dist', config: 'config/font-packs.json' }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dist') options.dist = argv[++i]
    else if (arg === '--config') options.config = argv[++i]
    else throw new Error(`unknown argument: ${arg}`)
  }
  return options
}

function isCjk(codePoint) {
  return (
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
    (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
    (codePoint >= 0xfe30 && codePoint <= 0xfe4f) ||
    (codePoint >= 0xff00 && codePoint <= 0xffef) ||
    (codePoint >= 0x20000 && codePoint <= 0x3ffff)
  )
}

const TEXT_ATTRIBUTES = /(?:alt|title|aria-label|placeholder|value)="([^"]*)"/gi

function charactersInPage(html) {
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
  const withAttributes = withoutCode.replace(/<[^>]+>/g, (tag) => {
    const values = [...tag.matchAll(TEXT_ATTRIBUTES)].map((match) => match[1])
    return values.length ? ` ${values.join(' ')} ` : ' '
  })
  const found = new Set()
  for (const character of withAttributes.replace(/&[a-z#0-9]+;/gi, ' ')) {
    if (isCjk(character.codePointAt(0))) found.add(character)
  }
  return found
}

function collectPages(root) {
  const pages = []
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        walk(path)
        continue
      }
      if (!entry.name.endsWith('.html')) continue
      if (statSync(path).size > 2_000_000) continue
      pages.push(path)
    }
  }
  walk(root)
  return pages
}

function coverageRanges(config) {
  const ranges = []
  for (const pack of config.packs || []) {
    for (const token of String(pack.unicodeRange || '').split(',')) {
      const bounds = /^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i.exec(token.trim())
      if (!bounds) continue
      const lo = parseInt(bounds[1], 16)
      const hi = bounds[2] ? parseInt(bounds[2], 16) : lo
      ranges.push([lo, hi])
    }
  }
  return ranges
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const distRoot = resolve(options.dist)
  const configPath = resolve(options.config)

  if (!existsSync(distRoot)) {
    console.error(`check-font-coverage: ${options.dist} does not exist`)
    process.exit(1)
  }
  if (!existsSync(configPath)) {
    console.error(`check-font-coverage: no pack config at ${options.config}`)
    process.exit(1)
  }

  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const ranges = coverageRanges(config)
  if (!ranges.length) {
    console.error('check-font-coverage: pack config declares no unicode ranges')
    process.exit(1)
  }

  const generatedRoot = resolve(config.generatedDirectory || 'public/fonts')
  const missingFiles = []
  for (const pack of config.packs) {
    for (const weight of config.weights) {
      const file = pack.files?.[String(weight)] || `${pack.id}-${weight}-${pack.fingerprint}.woff2`
      if (!existsSync(join(generatedRoot, file))) missingFiles.push(file)
    }
  }

  const pages = collectPages(distRoot)
  const uncovered = new Map()
  let pagesWithoutBlock = 0

  for (const page of pages) {
    const html = readFileSync(page, 'utf8')
    if (!html.includes('font-packs:start')) pagesWithoutBlock += 1
    for (const character of charactersInPage(html)) {
      const codePoint = character.codePointAt(0)
      if (ranges.some(([lo, hi]) => codePoint >= lo && codePoint <= hi)) continue
      const key = relative(distRoot, page).replace(/\\/g, '/')
      if (!uncovered.has(character)) uncovered.set(character, [])
      uncovered.get(character).push(key)
    }
  }

  console.log(
    `check-font-coverage: ${pages.length} pages, ${ranges.length} ranges, ` +
      `${(config.packs || []).length} packs, ${uncovered.size} uncovered character(s)`,
  )

  const problems = []
  if (missingFiles.length) {
    problems.push(
      `${missingFiles.length} font file(s) missing: ${missingFiles.slice(0, 6).join(', ')}`,
    )
  }
  if (uncovered.size) {
    const sample = [...uncovered.entries()].slice(0, 8)
    problems.push(
      `${uncovered.size} character(s) have no font coverage, e.g. ` +
        sample.map(([character, pages_]) => `"${character}" on ${pages_[0]}`).join('; '),
    )
  }
  if (pagesWithoutBlock) {
    problems.push(`${pagesWithoutBlock} page(s) have no injected font-pack block`)
  }

  if (problems.length) {
    for (const problem of problems) console.error(`  - ${problem}`)
    console.error('  hint: run `npm run build` so the packs match the current content')
    process.exit(1)
  }

  console.log('check-font-coverage: OK')
}

main()
