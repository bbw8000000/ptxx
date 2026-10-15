import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

// scripts/guard-content-images.mjs 是构建前守卫：2026-09-28 日报自动化就是在
// astro build 上因为一条 ImageNotFound 挂掉的（整站构建失败、当天内容上不去）。
// 这里用真实文件跑一遍，锁住「该抓的抓、不该动的别动」。

const GUARD = new URL('../scripts/guard-content-images.mjs', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1',
)

function makeWorkspace(files) {
  const root = mkdtempSync(join(tmpdir(), 'guard-images-'))
  const content = join(root, 'content')
  const publicDir = join(root, 'public')
  mkdirSync(content, { recursive: true })
  mkdirSync(publicDir, { recursive: true })
  for (const [name, body] of Object.entries(files)) {
    const path = join(content, name)
    mkdirSync(join(path, '..'), { recursive: true })
    writeFileSync(path, body)
  }
  return { root, content, publicDir }
}

function runGuard(content, publicDir, extra = []) {
  try {
    const stdout = execFileSync(
      'node',
      [GUARD, '--content', content, '--public', publicDir, ...extra],
      { encoding: 'utf8' },
    )
    return { code: 0, stdout }
  } catch (error) {
    return { code: error.status ?? 1, stdout: String(error.stdout ?? '') }
  }
}

test('相对路径的 Markdown 图片会被判为问题（这正是让构建挂掉的那种）', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': '# 标题\n\n![架构图](assets/ai-rd-benchmarks.png)\n',
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 1)
  assert.match(result.stdout, /assets\/ai-rd-benchmarks\.png/)
  assert.match(result.stdout, /相对路径/)
})

test('HTML <img> 的相对路径同样会被抓到', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': '<img src="image.jpg" alt="x" />\n',
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 1)
  assert.match(result.stdout, /image\.jpg/)
})

test('代码围栏里的示例语法不算问题（文档本来就要写占位引用）', () => {
  const { content, publicDir } = makeWorkspace({
    'guide.md': ['```markdown', '![图片描述](image.jpg)', '```', '', '正文结束'].join('\n'),
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 0)
  assert.match(result.stdout, /OK/)
})

test('外链与 data URI 不动', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': [
      '![远程](https://example.com/a.png)',
      '![内联](data:image/png;base64,iVBORw0KGgo=)',
      '<img src="https://cdn.example.com/b.jpg" />',
    ].join('\n'),
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 0)
})

test('站内绝对路径：文件存在就放行', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': '![封面](/hero/growth-001.svg)\n',
  })
  mkdirSync(join(publicDir, 'hero'), { recursive: true })
  writeFileSync(join(publicDir, 'hero', 'growth-001.svg'), '<svg/>')
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 0)
})

test('站内绝对路径：文件不存在也算问题（线上会是 404）', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': '![封面](/hero/does-not-exist.svg)\n',
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 1)
  assert.match(result.stdout, /站内路径不存在文件/)
})

test('heroImage frontmatter 为空是允许的，指向缺失文件要报', () => {
  const { content, publicDir } = makeWorkspace({
    'ok.md': '---\ntitle: x\nheroImage:\n---\n\n正文\n',
    'bad.md': '---\ntitle: y\nheroImage: "assets/cover.png"\n---\n\n正文\n',
  })
  const result = runGuard(content, publicDir)
  assert.equal(result.code, 1)
  assert.match(result.stdout, /assets\/cover\.png/)
  assert.doesNotMatch(result.stdout, /ok\.md/)
})

test('--fix 就地改写：相对路径变成纯文本说明，代码围栏保持原样', () => {
  const { content, publicDir } = makeWorkspace({
    'post.md': [
      '---',
      'title: t',
      'heroImage: "assets/cover.png"',
      '---',
      '',
      '![架构图](assets/diagram.png)',
      '',
      '```markdown',
      '![示例](image.jpg)',
      '```',
    ].join('\n'),
  })
  const result = runGuard(content, publicDir, ['--fix'])
  assert.equal(result.code, 0)

  const after = readFileSync(join(content, 'post.md'), 'utf8')
  assert.ok(!after.includes('assets/diagram.png)'), '相对图片引用应被清掉')
  assert.match(after, /架构图/, 'alt 文字应当保留下来')
  assert.ok(!/^heroImage:\s*"assets/m.test(after), 'heroImage 指向缺失文件时应清空')
  assert.match(after, /!\[示例\]\(image\.jpg\)/, '代码围栏里的示例必须原样保留')

  // 再跑一次应当干净
  const second = runGuard(content, publicDir)
  assert.equal(second.code, 0)
})
