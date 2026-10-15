// Precision control lens
declare global {
  interface Window {
    __interactionLensReady?: boolean
  }
}

if (!window.__interactionLensReady) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.__interactionLensReady = true
  } else if (!window.matchMedia('(pointer: fine)').matches) {
    window.__interactionLensReady = true
  } else {
    window.__interactionLensReady = true

    let lensFrame = 0
    let latestLensEvent: PointerEvent | null = null
    document.addEventListener(
      'pointermove',
      (event) => {
        latestLensEvent = event
        if (lensFrame) return
        lensFrame = requestAnimationFrame(() => {
          lensFrame = 0
          const currentEvent = latestLensEvent
          if (!currentEvent) return
          const target = currentEvent.target
          if (!(target instanceof Element)) return
          const control = target.closest(
            '.header-action, .share-action, .back-to-top',
          ) as HTMLElement | null
          if (!control) return
          const rect = control.getBoundingClientRect()
          const x = ((currentEvent.clientX - rect.left) / rect.width) * 100
          const y = ((currentEvent.clientY - rect.top) / rect.height) * 100
          control.style.setProperty(
            '--interaction-x',
            `${Math.max(0, Math.min(100, x)).toFixed(1)}%`,
          )
          control.style.setProperty(
            '--interaction-y',
            `${Math.max(0, Math.min(100, y)).toFixed(1)}%`,
          )
        })
      },
      { passive: true },
    )
  }
}

export {}
