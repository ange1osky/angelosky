import { useRef } from 'react'
import { PlusIcon } from './Icons.jsx'
import usePointerVars from '../hooks/usePointerVars.js'

/* Viewfinder lines that follow the pointer across the parent while it is
   hovered: one horizontal and one vertical hairline, with a + where they
   cross. The parent must be positioned.

   The pointer position lands on the parent itself (see usePointerVars), so
   other children can move with it too — the about portrait drifts on
   --px/--py. */
export default function Crosshair() {
  const ref = useRef(null)
  usePointerVars(ref, { parent: true })

  return (
    <span ref={ref} className="crosshair" aria-hidden="true">
      <span className="crosshair__h" />
      <span className="crosshair__v" />
      <PlusIcon className="crosshair__plus" />
    </span>
  )
}
