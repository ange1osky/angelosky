import { useEffect } from 'react'

/* Writes the pointer's position over an element onto that element as custom
 * properties, for CSS to move things with:
 *   --cx / --cy   px from its top-left corner
 *   --px / --py   -0.5 to 0.5 about its centre, settling back to 0 on leave
 * Children inherit them, so anything inside can follow the pointer without
 * its own listener. Mouse and pen only: a touchscreen has no hover to track.
 * `parent: true` tracks the ref's parent instead of the element itself. */
export default function usePointerVars(ref, { parent = false } = {}) {
  useEffect(() => {
    const host = parent ? ref.current?.parentElement : ref.current
    if (!host) return
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return

    const move = (e) => {
      const r = host.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      host.style.setProperty('--cx', `${x.toFixed(1)}px`)
      host.style.setProperty('--cy', `${y.toFixed(1)}px`)
      host.style.setProperty('--px', (x / r.width - 0.5).toFixed(3))
      host.style.setProperty('--py', (y / r.height - 0.5).toFixed(3))
    }
    // Only --px/--py settle: whatever rides --cx/--cy fades out where the
    // pointer left rather than jumping back to the corner.
    const leave = () => {
      host.style.setProperty('--px', '0')
      host.style.setProperty('--py', '0')
    }

    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerleave', leave)
    return () => {
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [ref, parent])
}
