import { useState } from 'react'

// Sound played on enter. Drop your clip at public/audio/intro.mp3 (restart the
// dev server after adding it — Vite ignores public/). If it's missing, the
// intro is silent; nothing breaks.
const SFX_SRC = '/audio/intro.wav'
const SFX_VOLUME = 0.6


export default function Intro({ onDone }) {
  const [entered, setEntered] = useState(false)

  const enter = () => {
    if (entered) return
    setEntered(true)
    const sfx = new Audio(SFX_SRC)
    sfx.volume = SFX_VOLUME
    sfx.play?.().catch(() => {})
  }

  // Only the mint layer's exit sweep (the last one) tears the overlay down.
  const handleEnd = (e) => {
    if (e.animationName === 'intro-exit') onDone()
  }

  return (
    <div
      className={`intro${entered ? ' intro--entered' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Enter site"
      /* Skip the global hover/click SFX here — the gate has its own intro sound
         and shouldn't also fire the UI click/hover effects. */
      data-sfx="off"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') enter()
      }}
    >
      {/* Painted bottom-to-top: mint, then coral, then the ink panel on top.
          They exit in reverse, so the site is uncovered last. */}
      <span className="intro__layer intro__layer--mint" onAnimationEnd={handleEnd} />
      <span className="intro__layer intro__layer--coral" />
      <div className="intro__layer intro__panel">
        <span className="intro__word">ange1osky</span>
        {!entered && <span className="intro__hint">click to enter</span>}
      </div>
    </div>
  )
}
