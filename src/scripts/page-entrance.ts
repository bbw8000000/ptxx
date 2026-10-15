// 深色模式锁定 + ClientRouter 导航后修复 page-entrance class
declare global {
  interface Window {
    __pageEntranceReady?: boolean
  }
}

const baseUrl = import.meta.env.BASE_URL

function syncPageEntrance() {
  document.documentElement.classList.add('js')
  if (!document.body) return
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const onEntrance = location.pathname === normalizedBase || location.pathname === '/'
  document.body.classList.toggle('page-entrance', onEntrance)
  if (!onEntrance) {
    const gv = document.getElementById('global-bg-video') as HTMLVideoElement | null
    if (gv) gv.play().catch(() => {})
  }
}

document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.add('dark')
  document.documentElement.style.setProperty('background-color', 'transparent', 'important')
  document.documentElement.style.setProperty('color', '#F5F5F4', 'important')
  syncPageEntrance()
})

document.documentElement.classList.add('js')
document.documentElement.classList.add('dark')
if (document.body) syncPageEntrance()
// 清除旧版 ThemePicker 残留在 localStorage 的暖色
try {
  localStorage.removeItem('accent_color')
} catch (_) {}

export {}
