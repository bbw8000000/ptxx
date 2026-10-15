// 页面点击水波
declare global {
  interface Window {
    __pageClickWaveLayer?: HTMLElement | null
    __pageClickWaveReady?: boolean
    __pageClickWavePageLoadReady?: boolean
  }
}

function initPageClickWave() {
  window.__pageClickWaveLayer = document.getElementById('page-click-wave')
  if (window.__pageClickWaveReady) return
  window.__pageClickWaveReady = true

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (reduceMotion.matches) return
      if (
        event.target instanceof Element &&
        event.target.closest('a[href], button, [role="button"], summary, input, select, textarea')
      )
        return
      const layer = window.__pageClickWaveLayer
      if (!layer) return
      layer.style.setProperty('--page-wave-x', `${event.clientX}px`)
      layer.style.setProperty('--page-wave-y', `${event.clientY}px`)
      layer.classList.remove('is-waving')
      void layer.offsetWidth
      layer.classList.add('is-waving')
    },
    { passive: true },
  )

  document.addEventListener('animationend', (event) => {
    const layer = window.__pageClickWaveLayer
    if (layer && event.target === layer && event.animationName === 'waterDropRing') {
      layer.classList.remove('is-waving')
    }
  })
}

initPageClickWave()
if (!window.__pageClickWavePageLoadReady) {
  window.__pageClickWavePageLoadReady = true
  document.addEventListener('astro:page-load', initPageClickWave)
}

export {}
