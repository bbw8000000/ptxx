import assert from 'node:assert/strict'
import test from 'node:test'
import { extractOfficialPackageLinks } from '../src/lib/officialPackageLinks.ts'

test('extracts, normalizes, and deduplicates official package pages', () => {
  const links = extractOfficialPackageLinks(`
    [npm](https://www.npmjs.com/package/@scope/tool?utm_source=readme#install)
    https://www.npmjs.com/package/@scope/tool
    [PyPI](https://pypi.org/project/example-tool/2.0.0/)
  `)

  assert.deepEqual(links, [
    {
      label: 'npm',
      href: 'https://www.npmjs.com/package/@scope/tool',
      display: 'www.npmjs.com/package/@scope/tool',
    },
    {
      label: 'PyPI',
      href: 'https://pypi.org/project/example-tool/2.0.0/',
      display: 'pypi.org/project/example-tool/2.0.0/',
    },
  ])
})

test('rejects lookalike domains and non-package registry pages', () => {
  const links = extractOfficialPackageLinks(`
    https://npmjs.com.evil.example/package/tool
    https://www.npmjs.com/search?q=tool
    https://pypi.org/
    https://github.com/example/tool
  `)

  assert.deepEqual(links, [])
})

test('limits the rendered source list to four entries', () => {
  const links = extractOfficialPackageLinks(`
    https://www.npmjs.com/package/one
    https://pypi.org/project/two/
    https://crates.io/crates/three
    https://pub.dev/packages/four
    https://www.nuget.org/packages/five
  `)

  assert.equal(links.length, 4)
  assert.deepEqual(
    links.map((link) => link.label),
    ['npm', 'PyPI', 'crates.io', 'pub.dev'],
  )
})
