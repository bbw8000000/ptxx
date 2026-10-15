// Inject per-page @font-face rules for the CJK font packs a page actually needs.
//
// `scripts/build-font-packs.mjs` cuts the site's Chinese characters into
// frequency-ranked packs. This script walks the built HTML, works out which
// packs each page touches, and writes the matching @font-face block into the
// page <head>. A typical page needs 1-2 packs (~50-100 KB) instead of the ~22
// unicode-range chunks (~800 KB) that @fontsource ships by default.
//
// unicode-range is emitted per pack, so even when a page declares two packs the
// browser only downloads the one that a rendered character falls into.
//
// The site's default font stack no longer includes a Chinese webfont, so if this
// step never runs the site degrades to the system serif rather than breaking.
//
// Usage: node scripts/inject-font-packs.mjs [--dist dist] [--config config/font-packs.json]

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const MARKER_START = '<!-- font-packs:start -->'
const MARKER_END = '<!-- font-packs:end -->'

function parseArgs(argv) {
  const options = { dist: 'dist', config: 'config/font-packs.json', report: false }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dist') options.dist = argv[++i]
    else if (arg === '--config') options.config = argv[++i]
    else if (arg === '--report') options.report = true
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
  const text = withAttributes.replace(/&[a-z#0-9]+;/gi, ' ')
  const found = new Set()
  for (const character of text) {
    const codePoint = character.codePointAt(0)
    if (isCjk(codePoint)) found.add(character)
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

/** pack id -> list of unicode-range parts, for fast "does this char hit this pack" checks. */
function buildLookup(packs) {
  const lookup = new Map()
  for (const pack of packs) {
    const parts = []
    for (const token of pack.unicodeRange.split(',')) {
      const bounds = /^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i.exec(token.trim())
      if (!bounds) continue
      const lo = parseInt(bounds[1], 16)
      const hi = bounds[2] ? parseInt(bounds[2], 16) : lo
      parts.push([lo, hi])
    }
    lookup.set(pack.id, parts)
  }
  return lookup
}

function packsFor(characters, packs, lookup) {
  const needed = []
  for (const character of characters) {
    const codePoint = character.codePointAt(0)
    for (const pack of packs) {
      const ranges = lookup.get(pack.id)
      if (!ranges?.some(([lo, hi]) => codePoint >= lo && codePoint <= hi)) continue
      if (!needed.includes(pack)) needed.push(pack)
      break
    }
  }
  return needed
}

/** Merge ranges into one "U+lo-hi" list, sorting and coalescing where possible. */
function unionRange(packs) {
  const parts = []
  for (const pack of packs) {
    for (const token of pack.unicodeRange.split(',')) {
      const bounds = /^U\+([0-9A-F]+)(?:-([0-9A-F]+))?$/i.exec(token.trim())
      if (!bounds) continue
      const lo = parseInt(bounds[1], 16)
      const hi = bounds[2] ? parseInt(bounds[2], 16) : lo
      parts.push([lo, hi])
    }
  }
  parts.sort((a, b) => a[0] - b[0])
  const merged = []
  for (const [lo, hi] of parts) {
    const last = merged[merged.length - 1]
    if (last && lo <= last[1] + 1) last[1] = Math.max(last[1], hi)
    else merged.push([lo, hi])
  }
  return merged
    .map(([lo, hi]) =>
      lo === hi
        ? `U+${lo.toString(16).toUpperCase()}`
        : `U+${lo.toString(16).toUpperCase()}-${hi.toString(16).toUpperCase()}`,
    )
    .join(',')
}

function renderBlock(packs, basePath, generatedDirectory) {
  // generatedDirectory is a repo path such as "public/fonts"; the site serves it at /fonts.
  const directory = `${basePath.replace(/\/+$/, '')}/${generatedDirectory
    .replace(/^\/+/, '')
    .replace(/^public\//, '')}`
  const fileFor = (pack, weight) =>
    pack.files?.[String(weight)] || `${pack.id}-${weight}-${pack.fingerprint}.woff2`

  // One @font-face per weight with every pack in the src list. The browser stops at
  // the first src whose unicode-range matches, so unused packs are still never
  // fetched — but the page carries one unicode-range instead of one per pack,
  // which matters because that range is ~4 KB of text per pack.
  const range = unionRange(packs)
  const rules = []
  const preloads = []
  for (const weight of [400, 600, 700]) {
    const sources = packs
      .map((pack) => `url(${directory}/${fileFor(pack, weight)}) format('woff2')`)
      .join(',')
    rules.push(
      `@font-face{font-family:'Noto Serif SC';font-style:normal;font-display:swap;` +
        `font-weight:${weight};src:${sources};unicode-range:${range}}`,
    )
  }
  if (packs[0]) {
    preloads.push(
      `<link rel="preload" as="font" type="font/woff2" href="${directory}/${fileFor(packs[0], 400)}" crossorigin>`,
    )
  }
  return `${MARKER_START}\n${preloads.join('\n')}\n<style>${rules.join('')}</style>\n${MARKER_END}`
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const distRoot = resolve(options.dist)
  const configPath = resolve(options.config)

  if (!existsSync(distRoot)) {
    console.error(`inject-font-packs: ${options.dist} does not exist — run the Astro build first`)
    process.exit(1)
  }
  if (!existsSync(configPath)) {
    console.warn('inject-font-packs: no pack config — skipping (site falls back to system serif)')
    return
  }

  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  const packs = config.packs || []
  if (!packs.length) {
    console.warn('inject-font-packs: pack config is empty — skipping')
    return
  }
  const lookup = buildLookup(packs)
  const generatedDirectory = config.generatedDirectory || 'public/fonts'

  const pages = collectPages(distRoot)
  const histogram = new Map()
  let injected = 0

  for (const page of pages) {
    const html = readFileSync(page, 'utf8')
    const characters = charactersInPage(html)
    const needed = packsFor(characters, packs, lookup)

    let updated = html
    if (updated.includes(MARKER_START)) {
      updated = updated.replace(new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, 'g'), '')
    }

    if (needed.length) {
      // Pages live at varying depths, but the site is served under a fixed base
      // path, so absolute URLs from the base are always correct.
      const block = renderBlock(needed, config.basePath || '/blog/', generatedDirectory)
      updated = updated.replace('</head>', `${block}\n</head>`)
      injected += 1
    }

    if (updated !== html) writeFileSync(page, updated)
    histogram.set(needed.length, (histogram.get(needed.length) || 0) + 1)
  }

  const summary = [...histogram.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([count, pages_]) => `${pages_} page(s) -> ${count} pack(s)`)
    .join(', ')
  if (options.report) console.log(`inject-font-packs: ${summary}`)
  console.log(`inject-font-packs: ${injected}/${pages.length} pages got font packs`)
}

main()
