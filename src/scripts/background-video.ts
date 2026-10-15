// === Background video: lazy load on interaction ===
// 移动端 / 低电量模式 / reduced-motion / 慢网络一律不加载背景视频

// 非标准 Network Information API 声明（浏览器支持时不报错）
declare global {
  interface NetworkInformation {
    saveData?: boolean
    effectiveType?: string
  }
  interface Navigator {
    connection?: NetworkInformation
  }
}
export {}
const bgVideoSrc = `${import.meta.env.BASE_URL}maple.mp4`

const isEntrancePage = document.body && document.body.classList.contains('page-entrance')
const gv = document.getElementById('global-bg-video') as HTMLVideoElement | null
const poster = document.getElementById('global-bg-poster')

if (!isEntrancePage && gv && poster) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isSlowNetwork = ['2g', 'slow-2g'].includes(navigator.connection?.effectiveType || '')

  if (!isMobile && !reduceMotion && !navigator.connection?.saveData && !isSlowNetwork) {
    let loaded = false
    const loadVideo = () => {
      if (loaded) return
      loaded = true
      if (!gv.src) {
        gv.src = bgVideoSrc
        gv.load()
      }
      gv.play()
        .then(() => {
          poster.style.display = 'none'
          gv.style.display = ''
        })
        .catch(() => {})
    }
    window.addEventListener('load', () => {
      const trigger = () => {
        setTimeout(loadVideo, 2000)
      }
      window.addEventListener('scroll', trigger, { once: true, passive: true })
      document.addEventListener('click', trigger, { once: true })
      setTimeout(() => loadVideo(), 20000)
    })
  }
}
