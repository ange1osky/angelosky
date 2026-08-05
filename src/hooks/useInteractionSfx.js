import { useEffect } from 'react'

/* Hover + click sound effects, wired once for the whole app via event
   delegation — every matching element gets sound without touching its
   component. Add `data-sfx` to any element to opt it in, or `data-sfx="off"`
   to silence one.

   Drop your clips in public/audio/ with these names (short files, ideally
   < 100 ms so clicks feel instant). Restart the dev server after adding them —
   Vite's watcher ignores public/. If a file is missing, that sound just stays
   silent; nothing breaks. */
const HOVER_SRC = '/audio/hover.mp3'
const CLICK_SRC = '/audio/click.mp3'

// Elements that make a sound. `a[href]` (not bare `a`) skips anchors used only
// as scroll targets; extend this list freely.
const INTERACTIVE = 'a[href], button, [role="button"], summary, .pill, [data-sfx]'

const VOLUME = 0.35

export default function useInteractionSfx() {
  useEffect(() => {
    // Only wire hover sound on devices that truly hover — on touch, a tap
    // synthesises mouseover and would double up with the click sound.
    const canHover = window.matchMedia?.('(hover: hover)').matches

    const make = (src) => {
      const a = new Audio(src)
      a.preload = 'auto'
      a.volume = VOLUME
      return a
    }
    const hover = make(HOVER_SRC)
    const click = make(CLICK_SRC)

    // Rewind and play. Before the first real gesture the browser refuses audio,
    // so play() rejects — swallow it; sound kicks in after the first click.
    const play = (el) => {
      try {
        el.currentTime = 0
        el.play()?.catch(() => {})
      } catch {}
    }

    // True when the target is opted out via data-sfx="off" anywhere up the tree.
    const muted = (el) => el.closest('[data-sfx="off"]')

    // Track the element under the pointer so moving within it (over its child
    // nodes) doesn't re-trigger; a new element or empty space resets it.
    let current = null
    const onOver = (e) => {
      const t = e.target.closest?.(INTERACTIVE) || null
      if (t === current) return
      current = t
      if (t && !muted(t)) play(hover)
    }

    const onClick = (e) => {
      const t = e.target.closest?.(INTERACTIVE)
      if (t && !muted(t)) play(click)
    }

    if (canHover) document.addEventListener('pointerover', onOver)
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('click', onClick)
    }
  }, [])
}
