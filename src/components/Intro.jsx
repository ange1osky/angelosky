import { useEffect, useRef, useState } from 'react'
import { animate, createScope, createTimeline } from 'animejs'
import { setMusicEnabled } from '../hooks/useMusicPref.js'

// Sound played on enter. Drop your clip at public/audio/intro.wav (restart the
// dev server after adding it — Vite ignores public/). If it's missing, the
// intro is silent; nothing breaks.
const SFX_SRC = '/audio/intro.wav'
const SFX_VOLUME = 0.6

/* Counter pacing. A quick run to 25%, then climbs with short holds at 78 and
   95 so it reads as work being done rather than a timer. The count parks at
   99 until the window has actually loaded, so 100% always means the page
   behind it is ready. */
const LOAD_TIMEOUT = 6000

// Exit: the panel breaks into cells that clear outward from the centre.
const CELL = 36
const DISSOLVE_MS = 1300

const easeOut = (t) => 1 - (1 - t) * (1 - t)

function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/* Lays out the exit ahead of the click: sizes the canvas and cuts the grid of
   panel-coloured cells. Returns a function that plays it. Cells drop from the
   centre outward on a noisy front, so the edge breaks up rather than wiping
   as a clean circle.

   One canvas pixel per CSS pixel — `image-rendering: pixelated` keeps the
   cell edges hard on hi-DPI screens for a quarter of the fill — and cell
   edges snapped to whole pixels, so clearing one never nicks its neighbour. */
function prepareDissolve(canvas, root, color) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const { width, height } = root.getBoundingClientRect()
  const w = Math.round(width)
  const h = Math.round(height)
  canvas.width = w
  canvas.height = h

  const cols = Math.max(1, Math.round(w / CELL))
  const rows = Math.max(1, Math.round(h / CELL))
  const xs = Array.from({ length: cols + 1 }, (_, i) => Math.round((i * w) / cols))
  const ys = Array.from({ length: rows + 1 }, (_, i) => Math.round((i * h) / rows))
  const reach = Math.hypot(w / 2, h / 2)

  const cells = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = xs[c]
      const y = ys[r]
      const cw = xs[c + 1] - x
      const ch = ys[r + 1] - y
      const dist = Math.hypot(x + cw / 2 - w / 2, y + ch / 2 - h / 2)
      cells.push({ x, y, cw, ch, dist, cut: Math.random() })
    }
  }

  return (onDone) => {
    // One fill, painted before the panel behind it goes clear, so the hand-off
    // from DOM to canvas never shows a frame of the site.
    ctx.fillStyle = color
    ctx.fillRect(0, 0, w, h)

    // Each frame only clears the cells that drop on it, rather than
    // repainting every cell still standing.
    let standing = cells
    let raf = 0
    const t0 = performance.now()

    const step = (now) => {
      const p = Math.min(1, (now - t0) / DISSOLVE_MS)
      const front = reach * easeOut(p)
      const next = []
      for (const cell of standing) {
        const ahead = cell.dist - front
        const chance = ahead <= 0 ? 1 : ahead >= 200 ? 0 : 1 - (ahead / 200) * 0.95
        if (chance > cell.cut) ctx.clearRect(cell.x, cell.y, cell.cw, cell.ch)
        else next.push(cell)
      }
      standing = next
      if (p < 1 && standing.length) raf = requestAnimationFrame(step)
      else onDone()
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }
}

export default function Intro({ onDone, onEnter }) {
  const [ready, setReady] = useState(false)
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const sfxRef = useRef(null)
  const playDissolve = useRef(null)
  const stopDissolve = useRef(null)
  const entered = useRef(false)

  // Fetched and decoded during the count, so Enter only has to press play.
  useEffect(() => {
    const sfx = new Audio(SFX_SRC)
    sfx.preload = 'auto'
    sfx.volume = SFX_VOLUME
    sfxRef.current = sfx
  }, [])

  /* A coral square on black, turning a quarter at a time while the count
     inside it climbs. At 100% it folds away and Enter takes its place. */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const square = root.querySelector('.intro__square')
    const percent = root.querySelector('.intro__percent')

    let loaded = document.readyState === 'complete'
    const waiters = []
    const markLoaded = () => {
      loaded = true
      waiters.splice(0).forEach((fn) => fn())
    }
    window.addEventListener('load', markLoaded)
    const cap = window.setTimeout(markLoaded, LOAD_TIMEOUT)

    const scope = createScope({ root }).add(() => {
      // Touches the DOM only when the whole number changes.
      let shown = -1
      const render = (v) => {
        const n = Math.floor(v)
        if (n === shown) return
        shown = n
        percent.textContent = `${n}%`
      }

      if (reducedMotion()) {
        render(100)
        setReady(true)
        return
      }

      // Grows out of the centre, then turns a quarter at a time — only the
      // square turns, so the number inside stays level and readable.
      animate(square, { scale: [0, 1], duration: 700, ease: 'out(4)', delay: 150 })
      // Dark ink, so it waits for the square behind it rather than ghosting
      // on the black.
      animate(percent, { opacity: [0, 1], duration: 300, delay: 450 })
      const turn = animate(square, {
        rotate: [0, 90],
        duration: 1300,
        ease: 'inOutExpo',
        loop: true,
        loopDelay: 260,
        delay: 400,
      })

      const count = { v: 0 }
      createTimeline({
        defaults: { ease: 'inOut(2)' },
        onUpdate: () => render(count.v),
        onComplete: () => {
          const finish = () =>
            animate(count, {
              v: 100,
              duration: 260,
              ease: 'out(2)',
              onUpdate: () => render(count.v),
              onComplete: () => {
                turn.pause()
                // In JS, not CSS: the fade-in above left an inline opacity
                // the stylesheet can't override.
                animate(percent, { opacity: 0, duration: 200, ease: 'linear' })
                animate(square, {
                  rotate: '+=45',
                  scale: 0,
                  duration: 520,
                  ease: 'inBack(1.6)',
                })
                setReady(true)
              },
            })
          if (loaded) finish()
          else waiters.push(finish)
        },
      })
        .add(count, { v: 25, duration: 400, ease: 'out(2)' })
        .add(count, { v: 78, duration: 850 })
        .add(count, { v: 95, duration: 350 }, '+=500')
        .add(count, { v: 99, duration: 350 }, '+=500')
    })

    return () => {
      scope.revert()
      window.removeEventListener('load', markLoaded)
      window.clearTimeout(cap)
    }
  }, [])

  /* Once the count lands, cut the exit grid in the idle moment before the
     click — and again if the window changes size while Enter waits. */
  useEffect(() => {
    if (!ready || reducedMotion()) return undefined
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return undefined

    const prepare = () => {
      const color = getComputedStyle(root).getPropertyValue('--intro-bg').trim() || '#1c1c1c'
      playDissolve.current = prepareDissolve(canvas, root, color)
    }
    prepare()
    window.addEventListener('resize', prepare)
    return () => window.removeEventListener('resize', prepare)
  }, [ready])

  useEffect(() => () => stopDissolve.current?.(), [])

  const enter = () => {
    if (!ready || entered.current) return
    entered.current = true

    sfxRef.current?.play?.().catch(() => {})

    // This click is the gesture the browser needs before it will let audio
    // start, so switch the music on here. MusicToggle owns the actual playback
    // and reflects the new state — the nav switch still lets them turn it off.
    setMusicEnabled(true)

    // Fired now, not at onDone, so the page pulls into focus behind the cells
    // as they clear — the reveal and the dissolve overlap into one move.
    onEnter?.()

    const root = rootRef.current
    const play = playDissolve.current
    if (!root || !play) {
      onDone()
      return
    }

    stopDissolve.current = play(onDone)
    // Same task as the canvas fill, so the swap lands in one frame.
    root.dataset.state = 'exit'
  }

  return (
    <div
      ref={rootRef}
      className="intro"
      data-ready={ready}
      role="button"
      tabIndex={0}
      aria-label={ready ? 'Enter site' : 'Loading'}
      aria-busy={!ready}
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
      <div className="intro__chrome" aria-hidden="true">
        <span className="intro__square" />
        <span className="intro__percent">0%</span>
        <span className="intro__enter">Enter</span>
      </div>

      <canvas ref={canvasRef} className="intro__canvas" />
    </div>
  )
}
