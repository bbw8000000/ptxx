const exactGithubProjectUrl =
  /^https:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/

function visit(node, callback) {
  callback(node)
  if (!Array.isArray(node.children)) return
  node.children.forEach((child) => visit(child, callback))
}

export default function remarkInternalProjectLinks({ base = '/' } = {}) {
  const normalizedBase = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`

  return (tree, file) => {
    const sourcePath = String(file.path || file.history?.[0] || '').replaceAll('\\', '/')
    if (!sourcePath.includes('content/posts/')) return

    visit(tree, (node) => {
      if (node.type !== 'link' || typeof node.url !== 'string') return
      const match = node.url.match(exactGithubProjectUrl)
      if (!match) return
      const owner = encodeURIComponent(match[1])
      const repo = encodeURIComponent(match[2])
      node.url = `${normalizedBase}/projects/${owner}/${repo}/`
    })
  }
}
