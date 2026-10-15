// Local press feedback + click-origin page transition
declare global {
  interface Window {
    __interactionFeedbackReady?: boolean
  }
}

if (!window.__interactionFeedbackReady) {
  window.__interactionFeedbackReady = true

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const pressableSelector =
    'a[href], button:not([disabled]), [role="button"]:not([aria-disabled="true"]), summary'

  const getPressable = (target: EventTarget | null) =>
    target instanceof Element ? target.closest(pressableSelector) : null

  const armPostMorph = (control: Element | null) => {
    document.querySelectorAll('[data-post-transition-title]').forEach((title) => {
      ;(title as HTMLElement).style.removeProperty('view-transition-name')
    })

    const title =
      control instanceof HTMLElement && control.matches('[data-post-transition]')
        ? control.querySelector('[data-post-transition-title]')
        : null
    ;(title as HTMLElement | null)?.style.setProperty('view-transition-name', 'post-title')
  }

  const suspendAmbientMotion = () => {
    document.documentElement.classList.add('is-navigating')
    const backgroundVideo = document.getElementById('global-bg-video')
    if (backgroundVideo instanceof HTMLVideoElement) backgroundVideo.pause()
  }

  const createRipple = (control: Element | null, clientX?: number, clientY?: number) => {
    if (reduceMotion.matches || !(control instanceof HTMLElement)) return
    const rect = control.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const x = clientX ?? rect.left + rect.width / 2
    const y = clientY ?? rect.top + rect.height / 2
    const farthestX = Math.max(x - rect.left, rect.right - x)
    const farthestY = Math.max(y - rect.top, rect.bottom - y)
    const size = Math.ceil(Math.hypot(farthestX, farthestY) * 2)
    const ripple = document.createElement('span')
    ripple.className = 'interaction-ripple'
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.left = `${x - rect.left}px`
    ripple.style.top = `${y - rect.top}px`

    control.querySelectorAll(':scope > .interaction-ripple').forEach((node) => node.remove())
    control.classList.add('interaction-pressable', 'is-pressing')
    control.appendChild(ripple)
    ripple.addEventListener(
      'animationend',
      () => {
        ripple.remove()
        if (!control.querySelector('.interaction-ripple')) {
          control.classList.remove('interaction-pressable')
        }
      },
      { once: true },
    )
  }

  const isInternalNavigation = (event: MouseEvent, link: Element | null) => {
    if (!(link instanceof HTMLAnchorElement)) return false
    if (event.defaultPrevented || event.button !== 0) return false
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
    if (link.hasAttribute('download') || link.target === '_blank') return false

    let destination: URL
    try {
      destination = new URL(link.href, location.href)
    } catch (_) {
      return false
    }
    if (
      !['http:', 'https:'].includes(destination.protocol) ||
      destination.origin !== location.origin
    )
      return false

    const current = new URL(location.href)
    const sameDocument =
      destination.pathname === current.pathname && destination.search === current.search
    if (sameDocument) return false
    return true
  }

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0) return
      const control = getPressable(event.target)
      if (!control) return
      armPostMorph(control)
      createRipple(control, event.clientX, event.clientY)
    },
    { passive: true },
  )

  const releasePressedControls = () => {
    document
      .querySelectorAll('.interaction-pressable.is-pressing')
      .forEach((control) => control.classList.remove('is-pressing'))
  }
  document.addEventListener('pointerup', releasePressedControls, { passive: true })
  document.addEventListener('pointercancel', releasePressedControls, { passive: true })

  document.addEventListener('click', (event) => {
    const control = getPressable(event.target)
    if (!control) return

    if (event.detail === 0) {
      armPostMorph(control)
      const rect = control.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      createRipple(control, x, y)
    }

    if (isInternalNavigation(event, control.closest('a[href]'))) {
      suspendAmbientMotion()
      control.classList.add('is-navigation-intent')
    }
  })
  document.addEventListener('astro:before-preparation', suspendAmbientMotion)

  document.addEventListener('astro:page-load', () => {
    document.documentElement.classList.remove('is-navigating')
    const backgroundVideo = document.getElementById('global-bg-video')
    if (backgroundVideo instanceof HTMLVideoElement && backgroundVideo.currentSrc) {
      backgroundVideo.play().catch(() => {})
    }
    document
      .querySelectorAll('.is-navigation-intent')
      .forEach((node) => node.classList.remove('is-navigation-intent'))
  })
}

export {}
