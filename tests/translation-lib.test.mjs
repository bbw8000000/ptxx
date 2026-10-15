import assert from 'node:assert/strict'
import test from 'node:test'

import { MAX_SOURCE_CHARS, looksNonChinese, sourceExcerpt } from '../functions/_lib/translation.ts'

// 这一层决定「要不要给这段正文提供中文摘要」。判断错了两头都糟：漏判让读者继续
// 对着英文 README 发愁，误判则在中文页面上多出一个没用的翻译按钮。
//
// 口径必须与前端 src/lib/textLanguage.ts 的 isMostlyNonChinese 一致，
// tests/text-language.test.mjs 锁的是那份，这里锁后端这份。
test('英文 README 判为需要翻译', () => {
  const english = [
    '# Getting started',
    'This project turns a screenshot into working code. Install it with npm and run',
    'the CLI against any image. TypeScript support is built in, and it works on',
    'Windows, macOS and Linux without extra configuration.',
  ].join('\n')
  assert.equal(looksNonChinese(english), true)
})

test('中文正文判为不需要翻译', () => {
  const chinese = [
    '这是一个记录生活和想法的角落，主要写技术、工具和普通人的成长记录。',
    '每天会更新一些从 GitHub 上挑出来的新项目，也会写自己踩过的坑。',
  ].join('\n')
  assert.equal(looksNonChinese(chinese), false)
})

test('中英混排但以中文为主时不误判', () => {
  const mixed =
    '这篇讲 Astro 的构建流程。Astro 会在构建期处理内容集合，页面是纯静态的，' +
    '部署到 GitHub Pages 没有服务端依赖。想了解 Details 可以看官方文档。'
  assert.equal(looksNonChinese(mixed), false)
})

test('空文本不判为外文', () => {
  assert.equal(looksNonChinese(''), false)
  assert.equal(looksNonChinese('   \n  '), false)
})

test('过长的正文只取前一段，并标注是节选', () => {
  const long = 'A'.repeat(MAX_SOURCE_CHARS + 500)
  const excerpt = sourceExcerpt(long)
  assert.equal(excerpt.length, MAX_SOURCE_CHARS + 1, '应当截断到上限加一个省略号')
  assert.ok(excerpt.endsWith('…'))

  const short = 'Short English description of a project.'
  assert.equal(sourceExcerpt(short), short, '短文本应当原样返回')
})

test('节选会折叠多余空行、统一换行符', () => {
  const messy = 'line one\r\n\r\n\r\n\r\nline two'
  assert.equal(sourceExcerpt(messy), 'line one\n\nline two')
})
