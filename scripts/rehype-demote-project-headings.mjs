// 项目快照页的 README 里通常自带一级标题（`# 项目名`），而页面自己已经有一个
// <h1>（项目全名）。两者撞在一起，一个页面出现两个 <h1>，语义和无障碍都不对 ——
// 实测 395 个项目快照页都是这样。
//
// 这里把「项目集合」里的 README 标题整体降一级，页面就只剩一个 h1 了。
// 作用范围按文件路径限定，和 remark-internal-project-links.mjs 用的是同一个做法：
// 只处理 src/content/projects/ 下的文件，文章正文的标题层级不受影响。
const DEMOTED_LEVELS = {
  h1: 'h2',
  h2: 'h3',
  h3: 'h4',
  h4: 'h5',
  h5: 'h6',
  // h6 已经是最深一级，保持不动
}

function visit(node, callback) {
  callback(node)
  if (!Array.isArray(node.children)) return
  for (const child of node.children) visit(child, callback)
}

export default function rehypeDemoteProjectHeadings() {
  return (tree, file) => {
    const sourcePath = String(file?.path || file?.history?.[0] || '').replaceAll('\\', '/')
    if (!sourcePath.includes('content/projects/')) return

    visit(tree, (node) => {
      if (node.type !== 'element' || typeof node.tagName !== 'string') return
      const demoted = DEMOTED_LEVELS[node.tagName]
      if (demoted) node.tagName = demoted
    })
  }
}
