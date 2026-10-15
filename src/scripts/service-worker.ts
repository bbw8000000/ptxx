// Service Worker 注册（仅 HTTPS 且浏览器支持时）
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {})
  })
}
