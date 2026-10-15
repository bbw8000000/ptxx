// 中英文混排：在正文（.prose）里给中文与英文/数字之间插入细空格
// 例如 "研究AI工具" -> "研究\u2009AI\u2009工具"、"<code>Astro</code>复制" -> "<code>Astro</code>\u2009复制"
// 只影响客户端显示，不影响 SSR/SEO 原文
const CJK = '\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff\u3040-\u30ff\uac00-\ud7af'
const LATIN = 'A-Za-z0-9'
const CJK_LATIN = new RegExp(`([${CJK}])([${LATIN}])`, 'g')
const LATIN_CJK = new RegExp(`([${LATIN}])([${CJK}])`, 'g')
const CJK_CHAR = new RegExp(`[${CJK}]`)
const LATIN_CHAR = new RegExp(`[${LATIN}]`)
const THIN_SPACE = '\u2009'

function isSkipped(el: Element | null) {
  if (!el) return false
  return (
    el.tagName === 'PRE' ||
    el.tagName === 'CODE' ||
    el.tagName === 'SCRIPT' ||
    el.tagName === 'STYLE'
  )
}

function applyCjkSpacing() {
  document.querySelectorAll('.prose').forEach((root) => {
    const el = root as HTMLElement
    if (el.dataset.cjkSpaced) return
    el.dataset.cjkSpaced = 'true'

    // 收集所有文本节点（按文档顺序），code 内的文本用于边界判断但不改写
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = (node as Text).parentElement
        if (
          parent &&
          (parent.tagName === 'PRE' || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')
        )
          return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })
    const nodes: Text[] = []
    let n: Node | null
    while ((n = walker.nextNode())) nodes.push(n as Text)

    // 阶段 1：同一文本节点内的紧贴
    for (const tn of nodes) {
      if (isSkipped(tn.parentElement)) continue
      const t = tn.textContent || ''
      if (!CJK_CHAR.test(t)) continue
      tn.textContent = t
        .replace(CJK_LATIN, `$1${THIN_SPACE}$2`)
        .replace(LATIN_CJK, `$1${THIN_SPACE}$2`)
    }

    // 阶段 2：跨文本节点边界（如 <code>Astro</code>复制）
    for (let i = 0; i < nodes.length - 1; i++) {
      const a = nodes[i]
      const b = nodes[i + 1]
      if (!a.parentNode || !b.parentNode) continue
      const aText = a.textContent || ''
      const bText = b.textContent || ''
      const aLast = aText.replace(/\s+$/, '').slice(-1)
      const bFirst = bText.replace(/^\s+/, '').charAt(0)
      if (!aLast || !bFirst) continue
      const need =
        (CJK_CHAR.test(aLast) && LATIN_CHAR.test(bFirst)) ||
        (LATIN_CHAR.test(aLast) && CJK_CHAR.test(bFirst))
      if (!need) continue

      const space = document.createTextNode(THIN_SPACE)
      // 找 a 侧与 b 侧在共同祖先下的顶层兄弟，把空格插到两者之间
      let aTop: Node = a
      while (aTop.parentNode && aTop.parentNode !== b.parentNode) aTop = aTop.parentNode
      if (aTop.parentNode === b.parentNode && aTop.nextSibling) {
        aTop.parentNode.insertBefore(space, aTop.nextSibling)
        continue
      }
      let bTop: Node = b
      while (bTop.parentNode && bTop.parentNode !== a.parentNode) bTop = bTop.parentNode
      if (bTop.parentNode === a.parentNode) {
        a.parentNode.insertBefore(space, bTop)
        continue
      }
      // 兜底：插在 b 前
      b.parentNode.insertBefore(space, b)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyCjkSpacing, { once: true })
} else {
  applyCjkSpacing()
}
document.addEventListener('astro:page-load', applyCjkSpacing)

export {}
