// 统一 scroll reveal：.reveal-target / .blur-reveal / .prose 内容
declare global {
  interface Window {
    __initReveal?: () => void
    __revealObserver?: IntersectionObserver | null
    __revealTimers?: ReturnType<typeof setTimeout>[]
    __revealPageLoadReady?: boolean
  }
}

window.__initReveal = function () {
  if (window.__revealObserver) window.__revealObserver.disconnect()
  ;(window.__revealTimers || []).forEach(clearTimeout)
  window.__revealTimers = []

  // Unified scroll reveal for both .reveal-target and .blur-reveal
  let staggerIdx = 0
  let staggerTimer: ReturnType<typeof setTimeout> | undefined
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Math.min(staggerIdx, 5) * 55
          const revealTimer = setTimeout(() => {
            entry.target.classList.add('is-revealed')
            if (entry.target.classList.contains('blur-reveal')) {
              entry.target.classList.add('is-focused')
            }
          }, delay)
          window.__revealTimers?.push(revealTimer)
          staggerIdx++
          clearTimeout(staggerTimer)
          staggerTimer = setTimeout(() => {
            staggerIdx = 0
          }, 400)
          window.__revealTimers?.push(staggerTimer)
          observer.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -30px 0px', threshold: 0.08 },
  )
  window.__revealObserver = observer

  document.querySelectorAll('.reveal-target, .blur-reveal').forEach((el) => {
    el.classList.remove('is-revealed', 'is-focused')
    observer.observe(el)
  })

  // Prose content auto-reveal
  document
    .querySelectorAll(
      '.prose p, .prose h2, .prose h3, .prose pre, .prose blockquote, .prose ul, .prose ol',
    )
    .forEach((el) => {
      el.classList.add('reveal-target')
      el.classList.remove('is-revealed')
      observer.observe(el)
    })
}

if (!window.__revealPageLoadReady) {
  window.__revealPageLoadReady = true
  document.addEventListener('astro:page-load', () => window.__initReveal?.())
}

export {}
