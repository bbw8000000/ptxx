// 背景视差 — 滚动时微移背景（before-swap 清理，after-swap 重建）
let parallaxOnScroll: (() => void) | null = null

function setupParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const bgLayer = document.querySelector('.global-bg-layer') as HTMLElement | null
  if (!bgLayer) return
  if (parallaxOnScroll) return

  let ticking = false
  parallaxOnScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY
        const translate = Math.min(y * 0.04, 60)
        bgLayer.style.transform = `translateY(${translate.toFixed(1)}px)`
        ticking = false
      })
      ticking = true
    }
  }
  window.addEventListener('scroll', parallaxOnScroll, { passive: true })
}

function teardownParallax() {
  if (parallaxOnScroll) {
    window.removeEventListener('scroll', parallaxOnScroll)
    parallaxOnScroll = null
  }
}

document.addEventListener('astro:before-swap', teardownParallax)
document.addEventListener('astro:after-swap', setupParallax)
setupParallax()
