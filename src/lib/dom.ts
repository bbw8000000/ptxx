// 浏览器端 DOM 安全工具函数 — 用于转义用户输入，防止 XSS

/**
 * 将任意值转为安全 HTML 文本（通过 DOM API 自动转义 & < >）
 * 在所有需要将用户输入插入 innerHTML 的场景使用
 */
export function escapeHtml(value: unknown): string {
  const div = document.createElement('div')
  div.textContent = String(value ?? '')
  return div.innerHTML
}

/**
 * 校验 URL 是否为安全的 http/https 协议（阻止 javascript: data: 等）
 * 用于 <img src> / <a href> 等属性赋值前的安全过滤
 */
export function safeImageUrl(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}
