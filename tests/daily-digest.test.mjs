import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

import {
  dailyDateFromId,
  parseDailyDigest,
  parsePickStats,
  resolvePickLink,
} from '../src/lib/dailyDigest.ts'

const BASE = '/blog/'

// 真实日报里出现过的两种链接形态：早期直连 GitHub，后来走站内快照。
const SNAPSHOT_LINK = '../../projects/amitshekhariitbhu/ai-system-design/'
const GITHUB_LINK = 'https://github.com/Polymarket-DevRel/polymarket-devrel'

test('站内快照链接同时给出站内地址和 GitHub 源地址', () => {
  assert.deepEqual(resolvePickLink(SNAPSHOT_LINK, BASE), {
    name: 'amitshekhariitbhu/ai-system-design',
    href: '/blog/projects/amitshekhariitbhu/ai-system-design/',
    sourceUrl: 'https://github.com/amitshekhariitbhu/ai-system-design',
  })
})

test('直连 GitHub 链接没有站内地址，但源地址正常', () => {
  assert.deepEqual(resolvePickLink(GITHUB_LINK, BASE), {
    name: 'Polymarket-DevRel/polymarket-devrel',
    href: null,
    sourceUrl: 'https://github.com/Polymarket-DevRel/polymarket-devrel',
  })
})

test('base 末尾有没有斜杠都不会拼出双斜杠', () => {
  assert.equal(
    resolvePickLink(SNAPSHOT_LINK, '/blog')?.href,
    '/blog/projects/amitshekhariitbhu/ai-system-design/',
  )
  assert.equal(
    resolvePickLink(SNAPSHOT_LINK, '/blog/')?.href,
    '/blog/projects/amitshekhariitbhu/ai-system-design/',
  )
  assert.equal(
    resolvePickLink(SNAPSHOT_LINK, '/')?.href,
    '/projects/amitshekhariitbhu/ai-system-design/',
  )
})

test('认不出的链接返回 null，而不是编造一个地址', () => {
  assert.equal(resolvePickLink('../../projects/only-owner/', BASE), null)
  assert.equal(resolvePickLink('https://example.com/foo/bar', BASE), null)
  assert.equal(resolvePickLink('', BASE), null)
})

test('统计行：stars + 语言 + topics', () => {
  assert.deepEqual(parsePickStats('⭐ **435** stars · 语言: **Markdown** `ai` `ai-agents`'), {
    stars: 435,
    language: 'Markdown',
    topics: ['ai', 'ai-agents'],
  })
})

test('统计行：没有星数不带逗号的千分位也要能解析', () => {
  assert.equal(parsePickStats('⭐ **1,234** stars · 语言: **Go**').stars, 1234)
})

// 真实日报里有 25 条用了 "**1.4k** stars" 这种缩写，漏掉就会让热门项目显示成「星数未知」。
test('统计行：k / M 缩写的星数要换算成整数', () => {
  assert.equal(parsePickStats('⭐ **1.4k** stars · 语言: **Rust** ').stars, 1400)
  assert.equal(parsePickStats('⭐ **12K** stars').stars, 12000)
  assert.equal(parsePickStats('⭐ **2.5M** stars').stars, 2500000)
  assert.equal(parsePickStats('⭐ **1.4k** stars').language, null)
})

test('统计行：语言缺失时不报错，topics 为空数组', () => {
  assert.deepEqual(parsePickStats('⭐ **951** stars · 语言: **TypeScript** '), {
    stars: 951,
    language: 'TypeScript',
    topics: [],
  })
  assert.deepEqual(parsePickStats('⭐ **12** stars'), {
    stars: 12,
    language: null,
    topics: [],
  })
  assert.deepEqual(parsePickStats(''), { stars: null, language: null, topics: [] })
})

test('解析整篇日报：条目、简介、统计各自归位', () => {
  const body = [
    '每天从 GitHub 挖出最值得关注的新开源项目。',
    '<!--more-->',
    '',
    '### 1. [owner/one](../../projects/owner/one/)',
    '',
    '> 第一条的简介。',
    '',
    '⭐ **435** stars · 语言: **Markdown** `ai`',
    '',
    '### 2. [owner/two](https://github.com/owner/two)',
    '',
    '> 第二条的简介。',
    '',
    '⭐ **12** stars',
    '',
    '### 3. [owner/three](../../projects/owner/three/)',
    '',
    '> 第三条的简介。',
    '',
    '⭐ **7** stars · 语言: **Rust** `cli`',
  ].join('\n')

  const { picks } = parseDailyDigest(body, { base: BASE })
  assert.equal(picks.length, 3, '三个条目都要被识别')

  assert.deepEqual(picks[0], {
    index: 1,
    name: 'owner/one',
    href: '/blog/projects/owner/one/',
    sourceUrl: 'https://github.com/owner/one',
    description: '第一条的简介。',
    stars: 435,
    language: 'Markdown',
    topics: ['ai'],
  })

  // 第二种链接形态：没有站内地址
  assert.equal(picks[1].href, null)
  assert.equal(picks[1].sourceUrl, 'https://github.com/owner/two')
  assert.equal(picks[1].stars, 12)
  assert.equal(picks[1].language, null)

  assert.equal(picks[2].description, '第三条的简介。')
  assert.equal(picks[2].stars, 7)
})

test('正文里没有条目时返回空数组（而不是抛错）', () => {
  assert.deepEqual(parseDailyDigest('今天没有值得推荐的项目。', { base: BASE }).picks, [])
  assert.deepEqual(parseDailyDigest('', { base: BASE }).picks, [])
})

test('### 标题不是条目的不会被误收（例如没有链接）', () => {
  const body = ['### 1. 没有链接的标题', '', '> 简介', '', '⭐ **1** stars'].join('\n')
  assert.deepEqual(parseDailyDigest(body, { base: BASE }).picks, [])
})

test('从 id 推出日期', () => {
  assert.equal(dailyDateFromId('daily-2026-09-27'), '2026-09-27')
  assert.equal(dailyDateFromId('risk-daily-2026-07-09'), '2026-07-09')
  assert.equal(dailyDateFromId('astro-blog-01'), '')
})

// 这条测试锁住的是真实内容：仓库里现存的所有日报都必须至少解析出 1 个条目。
// 日报形态一变（比如生成脚本改了标题格式），这里会先失败，而不是首页悄悄空掉。
test('仓库里每一篇真实日报都能解析出条目', () => {
  const dir = new URL('../src/content/posts/', import.meta.url)
  const files = readdirSync(dir).filter((name) => /^daily-\d{4}-\d{2}-\d{2}\.md$/.test(name))
  assert.ok(files.length > 0, '应当存在日报文件')

  const empty = []
  for (const file of files) {
    const raw = readFileSync(new URL(file, dir), 'utf8')
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    const { picks } = parseDailyDigest(body, { base: BASE })
    if (picks.length === 0) empty.push(file)
  }
  assert.deepEqual(empty, [], '这些日报解析不出任何条目，首页会空掉')
})

// 每个有条目的日报里，stars 和语言都应当解析出来：这两个字段是首页卡片的门面。
// 当初 "**1.4k** stars" 这种缩写就是被这条测试逼出来的。
test('真实日报里的 stars 和语言都不该整篇丢失', () => {
  const dir = new URL('../src/content/posts/', import.meta.url)
  const files = readdirSync(dir).filter((name) => /^daily-\d{4}-\d{2}-\d{2}\.md$/.test(name))

  const noStars = []
  const noLanguage = []
  for (const file of files) {
    const raw = readFileSync(new URL(file, dir), 'utf8')
    const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    const { picks } = parseDailyDigest(body, { base: BASE })
    if (picks.length && picks.every((pick) => pick.stars === null)) noStars.push(file)
    if (picks.length && picks.every((pick) => pick.language === null)) noLanguage.push(file)
  }
  assert.deepEqual(noStars, [], '这些日报一个星数都没解析出来')
  assert.deepEqual(noLanguage, [], '这些日报一个语言都没解析出来')
})
