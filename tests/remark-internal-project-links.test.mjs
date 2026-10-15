import assert from 'node:assert/strict'
import test from 'node:test'
import remarkInternalProjectLinks from '../scripts/remark-internal-project-links.mjs'

function linkTree(url) {
  return {
    type: 'root',
    children: [{ type: 'paragraph', children: [{ type: 'link', url, children: [] }] }],
  }
}

test('rewrites exact GitHub repository links in post content', () => {
  const tree = linkTree('https://github.com/example/project/')
  remarkInternalProjectLinks({ base: '/blog' })(tree, { path: 'src/content/posts/daily.md' })
  assert.equal(tree.children[0].children[0].url, '/blog/projects/example/project/')
})

test('leaves non-post files and repository subpaths unchanged', () => {
  const nonPost = linkTree('https://github.com/example/project')
  remarkInternalProjectLinks({ base: '/blog' })(nonPost, {
    path: 'src/content/projects/example.md',
  })
  assert.equal(nonPost.children[0].children[0].url, 'https://github.com/example/project')

  const subpath = linkTree('https://github.com/example/project/releases')
  remarkInternalProjectLinks({ base: '/blog' })(subpath, { path: 'src/content/posts/daily.md' })
  assert.equal(subpath.children[0].children[0].url, 'https://github.com/example/project/releases')
})
