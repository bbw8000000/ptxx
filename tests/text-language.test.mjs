import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

import { buildSummaryPayload, isMostlyNonChinese } from '../src/lib/textLanguage.ts'

// 这条判断决定「项目页要不要提示用浏览器整页翻译」。本站的翻译控件依赖 Chrome 内置
// 的 Translator API（QQ/360/UC/Firefox/Safari 都没有），所以外文页面必须有静态兜底
// 提示 —— 误判成中文就等于把读者丢在英文 README 里。

test('英文 README 判为外文', () => {
  const english = [
    '# Getting started',
    '',
    'This project turns a screenshot into working code. Install it with npm,',
    'then run the CLI against any image. It supports TypeScript out of the box',
    'and works on Windows, macOS and Linux without extra configuration.',
    'See the docs for more details about configuration and plugins.',
  ].join('\n')
  assert.equal(isMostlyNonChinese(english), true)
})

test('中文正文判为中文', () => {
  const chinese = [
    '这是一个记录生活和想法的角落，主要写技术、工具和普通人的成长记录。',
    '每天会更新一些从 GitHub 上挑出来的新项目，也会写自己踩过的坑和复盘。',
    '希望这些内容对同样在摸索的人有一点用，不追求高深，先把能做的小事做出来。',
  ].join('\n')
  assert.equal(isMostlyNonChinese(chinese), false)
})

test('中英混排但以中文为主时，不提示翻译', () => {
  const mixed = [
    '这篇讲 Astro 的构建流程。Astro 会把内容集合在构建期处理好，',
    '所以页面是纯静态的，部署到 GitHub Pages 没有任何服务端依赖。',
    '如果你想了解 Details，可以看官方文档，但本文已经把关键步骤写清楚了。',
  ].join('\n')
  assert.equal(isMostlyNonChinese(mixed), false)
})

test('样本太短时不下结论（避免把一句提示当成外文正文）', () => {
  assert.equal(isMostlyNonChinese('English only note.'), false)
  assert.equal(isMostlyNonChinese(''), false)
  assert.equal(isMostlyNonChinese('   '), false)
})

test('代码块占多数的中文说明不会被误判', () => {
  const withCode = [
    '下面是配置示例，照抄即可：',
    '```js',
    'const config = { plugins: ["a", "b"], output: "dist", minify: true }',
    'export default config',
    '```',
    '这段代码的作用是把插件按顺序加载，然后把结果输出到 dist 目录，过程完全在本地完成。',
  ].join('\n')
  // 代码是英文但整体仍以中文说明为主，允许判为中文（这条锁住的是「不因为代码就报外文」）
  assert.equal(isMostlyNonChinese(withCode), false)
})

// 真实内容校验：仓库里那批项目快照大部分是英文 README，
// 这条测试保证判断在当前数据上确实会触发（而不是恒为 false）。
test('当前项目快照里存在被判为外文的正文', () => {
  const dir = new URL('../src/content/projects/', import.meta.url)
  const files = readdirSync(dir).filter((name) => name.endsWith('.md'))
  assert.ok(files.length > 0)

  let foreign = 0
  for (const file of files) {
    const raw = readFileSync(new URL(file, dir), 'utf8')
    const body = raw.replace(/^---[\s\S]*?---[^\n]*\n/, '')
    if (isMostlyNonChinese(body)) foreign += 1
  }
  assert.ok(foreign > 0, '应当有大量英文 README 被判为外文')
  console.log(`    （${foreign}/${files.length} 个项目快照被判为外文）`)
})

// ── 翻译载荷 ───────────────────────────────────────────────────────
// 载荷会直接发给翻译模型。里面混进站内脚手架句子，模型就会把「本页保存的是公开项目
// 资料快照」当成项目描述 —— 快照正文开头恰好就有这句。

test('载荷剔除了快照的站内说明句', () => {
  const body = [
    '> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。',
    '',
    'LangChain is a framework for building agents and LLM-powered applications.',
  ].join('\n')
  const payload = buildSummaryPayload(body)
  assert.ok(!payload.includes('本页保存的是'), `载荷不该含站内说明：${payload.slice(0, 60)}`)
  assert.ok(!payload.includes('阅读过程不需要连接'), '载荷不该含站内说明')
  assert.ok(payload.includes('LangChain is a framework'), '项目描述必须保留')
})

test('载荷剔除「已下架」警示句', () => {
  const body = [
    '> ⚠️ 该项目已从 GitHub 下架（原仓库已不可访问）。下方为当时抓取的公开摘要，仅作留存。',
    'A small CLI that prints the weather forecast for your city.',
  ].join('\n')
  const payload = buildSummaryPayload(body)
  assert.ok(!payload.includes('已从 GitHub 下架'))
  assert.ok(!payload.includes('仅作留存'))
  assert.ok(payload.includes('prints the weather forecast'))
})

test('载荷去掉 Markdown 结构符号但保留链接文字', () => {
  const body = [
    '# Title of the project',
    '![screenshot](https://example.com/a.png)',
    'See [the docs](https://example.com/docs) for install steps.',
    '- bullet one',
    '- bullet two',
  ].join('\n')
  const payload = buildSummaryPayload(body)
  assert.ok(!payload.includes('#'), '标题符号应去掉')
  assert.ok(!payload.includes('screenshot'), '图片应去掉')
  assert.ok(!payload.includes('https://'), 'URL 应去掉')
  assert.ok(payload.includes('the docs'), '链接文字应保留')
  assert.ok(payload.includes('bullet one'))
})

test('载荷按上限截断', () => {
  const long = 'word '.repeat(1000)
  assert.equal(buildSummaryPayload(long, 100).length, 100)
  assert.equal(buildSummaryPayload('short', 100), 'short')
})
