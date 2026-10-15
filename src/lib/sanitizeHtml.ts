// 把第三方 Markdown（例如任意 GitHub 仓库的 README）转成可以安全塞进 innerHTML 的 HTML。
//
// 注意：这不是通用 HTML 消毒器，而是一个「够用就好」的白名单实现，只服务于
// README / Markdown 预览这类场景。如果将来要渲染更自由的内容，请换 DOMPurify。
//
// 它取代了 tools/github.astro 与 tools/markdown.astro 里两份几乎相同的拷贝——
// 两份实现意味着加固一处会漏掉另一处。

// <base> 会改写页面里所有相对 URL；<meta> 能做 http-equiv 跳转；
// 表单元素在 README 里没有正当用途，却能拿来钓鱼。
const DROP_ELEMENTS = [
  'script',
  'iframe',
  'object',
  'embed',
  'style',
  'link',
  'base',
  'meta',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
].join(',')

// 这些属性都可能携带 URL。原实现只校验 href / src / xlink:href，
// 于是 srcset、formaction、action、poster 都成了绕过点。
const URL_ATTRIBUTES = new Set(['href', 'src', 'xlink:href', 'formaction', 'action', 'poster'])

// srcset 的语法是「URL + 描述符」的逗号列表，逐段解析的收益不大，
// 直接整条去掉最省事也最安全。
const ALWAYS_DROP_ATTRIBUTES = new Set(['style', 'srcset'])

const EMBED_PROTOCOLS = ['http:', 'https:']
const LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

// 纯函数，方便单测：不碰 DOM，只判断一个属性值该不该保留。
export function isSafeUrlAttribute(value: string, attributeName: string, baseUrl: string): boolean {
  try {
    // 相对路径会以 baseUrl 解析，协议随之变成页面的协议，因此相对链接是放行的。
    const url = new URL(value.trim(), baseUrl)
    const protocols =
      attributeName === 'href' || attributeName === 'action' ? LINK_PROTOCOLS : EMBED_PROTOCOLS
    return protocols.includes(url.protocol)
  } catch {
    return false
  }
}

export function sanitizeHtml(html: string, baseUrl = window.location.href): string {
  const template = document.createElement('template')
  template.innerHTML = html

  template.content.querySelectorAll(DROP_ELEMENTS).forEach((node) => node.remove())

  template.content.querySelectorAll('*').forEach((element) => {
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase()

      if (name.startsWith('on') || ALWAYS_DROP_ATTRIBUTES.has(name)) {
        element.removeAttribute(attribute.name)
        continue
      }
      if (!URL_ATTRIBUTES.has(name)) continue
      if (!isSafeUrlAttribute(attribute.value, name, baseUrl)) {
        element.removeAttribute(attribute.name)
      }
    }
  })

  return template.innerHTML
}
