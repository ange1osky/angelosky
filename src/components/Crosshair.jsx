import { useEffect, useRef } from 'react'
import { PlusIcon } from './Icons.jsx'

/* Viewfinder lines that follow the pointer across the parent while it is
   hovered: one horizontal and one vertical hairline, with a + where they
   cross. The parent must be positioned.

   The pointer position is written onto the parent itself — --cx/--cy in px
   from its top-left, --px/--py from -0.5 to 0.5 about its centre — so other
   children can move with it too (the about portrait drifts on --px/--py).
   Mouse and pen only: a touchscreen has no hover to track. */
export default function Crosshair() {
  const ref = useRef(null)

  useEffect(() => {
    const host = ref.current?.parentElement
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
    // Settle anything riding --px/--py back to centre. The lines keep their
    // last spot, so they fade out where the pointer left rather than jumping.
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
  }, [])

  return (
    <span ref={ref} className="crosshair" aria-hidden="true">
      <span className="crosshair__h" />
      <span className="crosshair__v" />
      <PlusIcon className="crosshair__plus" />
    </span>
  )
}
