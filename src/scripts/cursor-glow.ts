// 全局光标光晕（before-swap 清理，after-swap 重建，保证导航后仍生效）
let glow: HTMLDivElement | null = null
let onMove: ((e: MouseEvent) => void) | null = null
let onLeave: (() => void) | null = null

function setupCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (document.getElementById('global-cursor-glow')) return
  glow = document.createElement('div')
  glow.id = 'global-cursor-glow'
  glow.style.cssText =
    'position:fixed;width:500px;height:500px;border-radius:50%;pointer-events:none;z-index:9991;transform:translate(-50%,-50%);opacity:0;transition:opacity 0.5s cubic-bezier(0.16,1,0.3,1);background:radial-gradient(circle,rgba(180,155,115,0.045) 0%,rgba(160,140,100,0.015) 35%,transparent 70%);will-change:left,top;'
  document.body.appendChild(glow)

  let pending = false
  onMove = (e) => {
    if (!pending) {
      pending = true
      requestAnimationFrame(() => {
        if (!glow) return
        glow.style.left = e.clientX + 'px'
        glow.style.top = e.clientY + 'px'
        glow.style.opacity = '1'
        pending = false
      })
    }
  }
  onLeave = () => {
    if (glow) glow.style.opacity = '0'
  }
  document.addEventListener('mousemove', onMove, { passive: true })
  document.addEventListener('mouseleave', onLeave)
}

function teardownCursorGlow() {
  if (onMove) document.removeEventListener('mousemove', onMove)
  if (onLeave) document.removeEventListener('mouseleave', onLeave)
  onMove = null
  onLeave = null
  glow?.remove()
  glow = null
}

document.addEventListener('astro:before-swap', teardownCursorGlow)
document.addEventListener('astro:after-swap', setupCursorGlow)
setupCursorGlow()
