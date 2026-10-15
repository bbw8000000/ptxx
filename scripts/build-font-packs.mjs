// Assign every CJK character used on the site to a frequency-ranked font pack.
//
// Why this exists: the site sets Noto Serif SC for all Chinese text, which is a
// 1.4 MB font. @fontsource splits it into ~100 unicode-range chunks, and because
// those chunks are cut by codepoint rather than by usefulness, a single article
// page ends up pulling ~22 of them (~800 KB) to render the ~250 distinct
// characters it actually contains.
//
// Instead we rank characters by how many pages use them and cut that ranking
// into a handful of packs. Each page then only needs the packs that contain the
// characters it really renders, which is ~1-2 packs of ~50 KB for a typical page.
//
// Usage:
//   node scripts/build-font-packs.mjs [--dist dist] [--config config/font-packs.json]
//                                     [--generated public/fonts] [--report]
//
// Writes config/font-packs.json (stable across runs unless the character set
// changes) and prints a summary. Exits non-zero only on real errors; a missing
// dist/ simply leaves the config untouched.

import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const PACK_CHARS = 700
const CONFIG_VERSION = 1

/** Font files are named from the pack fingerprint, so a changed character set
 *  yields a new URL (cache-safe) and an unchanged one is byte-identical. */
function fontFileName(packId, weight, fingerprint) {
  return `${packId}-${weight}-${fingerprint}.woff2`
}

function parseArgs(argv) {
  const options = {
    dist: 'dist',
    config: 'config/font-packs.json',
    generated: 'public/fonts',
    report: false,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--dist') options.dist = argv[++i]
    else if (arg === '--config') options.config = argv[++i]
    else if (arg === '--generated') options.generated = argv[++i]
    else if (arg === '--report') options.report = true
    else if (arg === '--help') {
      console.log(
        readFileSync(new URL(import.meta.url))
          .toString()
          .split('*/')[0],
      )
      process.exit(0)
    } else throw new Error(`unknown argument: ${arg}`)
  }
  return options
}

/** Characters that should be drawn by the CJK webfont rather than the Latin one. */
function isCjk(codePoint) {
  return (
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) || // radicals, kana, CJK symbols, Yi
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) || // Hangul
    (codePoint >= 0xf900 && codePoint <= 0xfaff) || // compatibility ideographs
    (codePoint >= 0xfe30 && codePoint <= 0xfe4f) || // CJK compatibility forms
    (codePoint >= 0xff00 && codePoint <= 0xffef) || // halfwidth/fullwidth forms
    (codePoint >= 0x20000 && codePoint <= 0x3ffff) // extension planes
  )
}

// Text that only exists in attributes still has to render, so pick it up too.
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

/** Rank characters by document frequency (how many pages use them), then by codepoint. */
function rankCharacters(pageCharacters) {
  const documentFrequency = new Map()
  for (const characters of pageCharacters) {
    for (const character of characters) {
      documentFrequency.set(character, (documentFrequency.get(character) || 0) + 1)
    }
  }
  return [...documentFrequency.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].codePointAt(0) - b[0].codePointAt(0))
    .map(([character]) => character)
}

/** Compact "U+4E00-4E05,U+4E07" form for a set of codepoints. */
function toUnicodeRange(codePoints) {
  const sorted = [...new Set(codePoints)].sort((a, b) => a - b)
  const parts = []
  let start = sorted[0]
  let previous = sorted[0]
  const flush = () => {
    if (start === undefined) return
    parts.push(
      start === previous
        ? `U+${start.toString(16).toUpperCase()}`
        : `U+${start.toString(16).toUpperCase()}-${previous.toString(16).toUpperCase()}`,
    )
  }
  for (const codePoint of sorted.slice(1)) {
    if (codePoint === previous + 1) {
      previous = codePoint
      continue
    }
    flush()
    start = codePoint
    previous = codePoint
  }
  flush()
  return parts.join(',')
}

function fingerprintOf(characters) {
  return createHash('sha256')
    .update([...characters].sort().join(''))
    .digest('hex')
    .slice(0, 16)
}

function loadConfig(path) {
  if (!existsSync(path)) return { version: CONFIG_VERSION, packSize: PACK_CHARS, packs: [] }
  const parsed = JSON.parse(readFileSync(path, 'utf8'))
  if (parsed.version !== CONFIG_VERSION)
    return { version: CONFIG_VERSION, packSize: PACK_CHARS, packs: [] }
  return parsed
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  const distRoot = resolve(options.dist)
  const configPath = resolve(options.config)
  const generatedRoot = resolve(options.generated)

  if (!existsSync(distRoot)) {
    console.error(`build-font-packs: ${options.dist} does not exist — run the Astro build first`)
    process.exit(1)
  }

  const pages = collectPages(distRoot)
  if (!pages.length) {
    console.error(`build-font-packs: no HTML pages found under ${options.dist}`)
    process.exit(1)
  }

  const pageCharacters = new Map()
  for (const page of pages) {
    pageCharacters.set(
      relative(distRoot, page).replace(/\\/g, '/'),
      charactersInPage(readFileSync(page, 'utf8')),
    )
  }

  const ranked = rankCharacters(pageCharacters.values())
  const previous = loadConfig(configPath)

  // Keep existing pack boundaries when the character set has not changed so the
  // generated font files stay byte-identical and browsers keep their cache.
  //
  // Characters inside a pack are stored sorted by codepoint: the frequency ranking
  // decides *which* pack a character lands in, but keeping rank order in the file
  // made the config churn on every build whenever a document-frequency tie shifted
  // by one page (same set and same fingerprint, but a rewritten 4 KB line).
  const boundaryCharacters = []
  for (let start = 0; start < ranked.length; start += PACK_CHARS) {
    const slice = ranked.slice(start, start + PACK_CHARS)
    boundaryCharacters.push([...slice].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)))
  }

  const knownByFingerprint = new Map(previous.packs.map((pack) => [pack.fingerprint, pack]))
  const packs = boundaryCharacters.map((characters, index) => {
    const fingerprint = fingerprintOf(characters)
    const known = knownByFingerprint.get(fingerprint)
    const id = known ? known.id : `p${String(index + 1).padStart(2, '0')}`
    return {
      id,
      index,
      fingerprint,
      characterCount: characters.length,
      characters: characters.join(''),
      unicodeRange: toUnicodeRange([...characters].map((c) => c.codePointAt(0))),
      files: known ? known.files : {},
    }
  })

  // Pack ids must stay unique even if a re-shuffle reuses a fingerprint.
  const seen = new Set()
  for (const pack of packs) {
    while (seen.has(pack.id)) pack.id = `${pack.id}b`
    seen.add(pack.id)
  }

  const perPage = new Map()
  for (const [page, characters] of pageCharacters) {
    const needed = []
    const uncovered = []
    for (const character of characters) {
      const pack = packs.find((candidate) => candidate.characters.includes(character))
      if (!pack) {
        uncovered.push(character)
        continue
      }
      if (!needed.includes(pack.id)) needed.push(pack.id)
    }
    perPage.set(page, { needed, uncovered })
  }

  const uncoveredTotal = new Set()
  for (const { uncovered } of perPage.values()) for (const c of uncovered) uncoveredTotal.add(c)

  const unusedPacks = packs.filter(
    (pack) => ![...perPage.values()].some((v) => v.needed.includes(pack.id)),
  )
  const keptPacks = packs.filter((pack) => !unusedPacks.some((unused) => unused.id === pack.id))

  const config = {
    version: CONFIG_VERSION,
    packSize: PACK_CHARS,
    pageCount: pageCharacters.size,
    characterCount: ranked.length,
    family: 'Noto Serif SC',
    weights: [400, 600, 700],
    // Absolute URLs in the injected @font-face block need the site base, which
    // is also what Astro uses for every other asset.
    basePath: `/${(process.env.BASE_PATH || '/blog').replace(/^\/+|\/+$/g, '')}/`,
    source:
      'node_modules/@fontsource/noto-serif-sc/files/noto-serif-sc-chinese-simplified-{weight}-normal.woff',
    generatedDirectory: relative(process.cwd(), generatedRoot).replace(/\\/g, '/'),
    packs: keptPacks.map((pack) => ({
      id: pack.id,
      index: pack.index,
      fingerprint: pack.fingerprint,
      characterCount: pack.characterCount,
      characters: pack.characters,
      unicodeRange: pack.unicodeRange,
      files: pack.files,
    })),
  }

  mkdirSync(dirname(configPath), { recursive: true })
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)

  const missing = []
  for (const pack of config.packs) {
    for (const weight of config.weights) {
      const file = fontFileName(pack.id, weight, pack.fingerprint)
      if (!existsSync(join(generatedRoot, file))) missing.push({ pack: pack.id, weight })
    }
  }
  if (missing.length) {
    const jobPath = resolve('config/font-pack-jobs.json')
    writeFileSync(
      jobPath,
      `${JSON.stringify(
        {
          generatedDirectory: config.generatedDirectory,
          family: config.family,
          source: config.source,
          weights: config.weights,
          jobs: missing.map(({ pack, weight }) => {
            const definition = config.packs.find((candidate) => candidate.id === pack)
            return {
              pack,
              weight,
              fingerprint: definition.fingerprint,
              characters: definition.characters,
              unicodeRange: definition.unicodeRange,
            }
          }),
        },
        null,
        2,
      )}\n`,
    )
  } else if (existsSync(resolve('config/font-pack-jobs.json'))) {
    rmSync(resolve('config/font-pack-jobs.json'))
  }

  // Delete fonts from earlier generations now that every current pack is present.
  // Skipped while jobs are outstanding so a half-finished pass cannot remove a
  // file that is still referenced.
  let removed = 0
  if (!missing.length && existsSync(generatedRoot)) {
    const expected = new Set(
      config.packs.flatMap((pack) =>
        config.weights.map((weight) => fontFileName(pack.id, weight, pack.fingerprint)),
      ),
    )
    for (const entry of readdirSync(generatedRoot)) {
      if (!entry.endsWith('.woff2')) continue
      if (expected.has(entry)) continue
      rmSync(join(generatedRoot, entry))
      removed += 1
    }
    // A pack that no page needs any more has no files left to keep.
    if (removed) mkdirSync(generatedRoot, { recursive: true })
  }

  if (options.report) {
    console.log(`pages scanned:        ${config.pageCount}`)
    console.log(`distinct CJK chars:   ${config.characterCount}`)
    console.log(
      `packs:                ${config.packs.length} (${config.packs.map((p) => p.id).join(', ')})`,
    )
    const histogram = new Map()
    for (const { needed } of perPage.values()) {
      const key = needed.length
      histogram.set(key, (histogram.get(key) || 0) + 1)
    }
    const summary = [...histogram.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([count, pages_]) => `${count} pack(s): ${pages_} page(s)`)
      .join(', ')
    console.log(`packs per page:       ${summary}`)
    if (uncoveredTotal.size) console.log(`NOT COVERED:          ${[...uncoveredTotal].join('')}`)
    if (missing.length) console.log(`fonts to generate:    ${missing.length}`)
    if (removed) console.log(`stale fonts removed:  ${removed}`)
  }

  if (uncoveredTotal.size) {
    console.error(
      `build-font-packs: ${uncoveredTotal.size} character(s) are not in any pack: ${[...uncoveredTotal].join('')}`,
    )
    process.exit(1)
  }

  return { config, perPage, missing }
}

main()
