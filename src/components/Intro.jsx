import { useEffect, useRef } from 'react'

// Sound played on enter. Drop your clip at public/audio/intro.wav (restart the
// dev server after adding it — Vite ignores public/). If it's missing, the
// intro is silent; nothing breaks.
const SFX_SRC = '/audio/intro.wav'
const SFX_VOLUME = 0.6

/* When the bars fully cover the screen — the point the black panel clears
   and the site starts arriving behind them. Matches .intro__bar in CSS. */
const COVER_MS = 360

export default function Intro({ onDone, onEnter }) {
  const rootRef = useRef(null)
  const sfxRef = useRef(null)
  const entered = useRef(false)
  const coverTimer = useRef(0)

  useEffect(() => {
    const sfx = new Audio(SFX_SRC)
    sfx.preload = 'auto'
    sfx.volume = SFX_VOLUME
    sfxRef.current = sfx
    return () => window.clearTimeout(coverTimer.current)
  }, [])

  const enter = () => {
    if (entered.current) return
    entered.current = true

    sfxRef.current?.play?.().catch(() => {})

    rootRef.current.dataset.state = 'exit'
    coverTimer.current = window.setTimeout(() => onEnter?.(), COVER_MS)
  }

  return (
    <div
      ref={rootRef}
      className="intro"
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      /* Skip the global hover/click SFX here — the gate has its own intro sound
         and shouldn't also fire the UI click/hover effects. */
      data-sfx="off"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          enter()
        }
      }}
    >
      <span className="intro__enter" aria-hidden="true">Enter</span>

      {/* The same colour wipe the pages use, sweeping the gate away. */}
      <span className="intro__bar intro__bar--mint" aria-hidden="true" />
      <span
        className="intro__bar intro__bar--coral"
        aria-hidden="true"
        onAnimationEnd={onDone}
      />
    </div>
  )
}
