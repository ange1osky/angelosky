import { useEffect, useRef, useState } from 'react'
import { setMusicEnabled } from '../hooks/useMusicPref.js'
import { PlusIcon } from './Icons.jsx'

// Sound played on enter. Drop your clip at public/audio/intro.wav (restart the
// dev server after adding it — Vite ignores public/). If it's missing, the
// intro is silent; nothing breaks.
const SFX_SRC = '/audio/intro.wav'
const SFX_VOLUME = 0.6

/* Counter pacing. A quick run to 25% while the frame slides in from the edges,
   then climbs with short holds at 78 and 95 so it reads as work being done
   rather than a timer. The count parks at 99 until the window has actually
   loaded, so 100% always means the page behind it is ready. */
const LEAD = 0.4
const START = 25
const CLIMB = 1.2
const STOPS = [
  { at: 78, hold: 0.5 },
  { at: 95, hold: 0.5 },
]
const LOAD_TIMEOUT = 6000

// Exit: the panel breaks into cells that clear outward from the centre.
const CELL = 36
const DISSOLVE_MS = 1300

const easeOut = (t) => 1 - (1 - t) * (1 - t)
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/* Each climb as { start, end, from, to, ease } in seconds from the first frame.
   A stop's hold is the gap before the next climb starts. */
const SCHEDULE = (() => {
  const points = [START, ...STOPS.map((s) => s.at), 100]
  const out = []
  let t = LEAD
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i]
    const to = points[i + 1]
    const dur = Math.max(((to - from) / (100 - START)) * CLIMB, 0.35)
    out.push({ start: t, end: t + dur, from, to, ease: i === 0 ? easeOut : easeInOut })
    t += dur + (STOPS[i]?.hold ?? 0)
  }
  return out
})()

// How far the frame has closed in, 0 at the edges to 1 boxed round the count.
const closure = (value) => Math.max(0, (value - START) / (100 - START))

function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/* Grid of panel-coloured cells, dropped from the centre outward on a noisy
   front so the edge breaks up rather than wiping as a clean circle. */
function dissolve(canvas, color, onDone) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return onDone()

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const cols = Math.max(1, Math.round(w / CELL))
  const rows = Math.max(1, Math.round(h / CELL))
  const cw = w / cols
  const ch = h / rows
  const reach = Math.hypot(w / 2, h / 2)

  const cells = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = c * cw
      const y = r * ch
      const dist = Math.hypot(x + cw / 2 - w / 2, y + ch / 2 - h / 2)
      cells.push({ x, y, dist, cut: Math.random(), on: true })
    }
  }

  const draw = () => {
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = color
    // +1px overdraw so neighbouring cells never show a hairline seam.
    for (const cell of cells) if (cell.on) ctx.fillRect(cell.x - 0.5, cell.y - 0.5, cw + 1, ch + 1)
  }

  // Painted synchronously, before the panel behind it goes transparent, so the
  // hand-off from DOM to canvas never shows a frame of the site.
  draw()

  let raf = 0
  const t0 = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - t0) / DISSOLVE_MS)
    const front = reach * easeOut(p)
    for (const cell of cells) {
      if (!cell.on) continue
      const ahead = cell.dist - front
      const chance = ahead <= 0 ? 1 : ahead >= 200 ? 0 : 1 - (ahead / 200) * 0.95
      if (chance > cell.cut) cell.on = false
    }
    draw()
    if (p < 1) raf = requestAnimationFrame(step)
    else onDone()
  }
  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

export default function Intro({ onDone, onEnter }) {
  const [ready, setReady] = useState(false)
  const rootRef = useRef(null)
  const percentRef = useRef(null)
  const canvasRef = useRef(null)
  const entered = useRef(false)
  const stopDissolve = useRef(null)

  /* Drives the count and the frame. Writes straight to the DOM — two custom
     properties and a text node per frame — so React never re-renders mid-run;
     the CSS turns --enter and --z into the line and mark positions. */
  useEffect(() => {
    const root = rootRef.current
    const percent = percentRef.current
    if (!root || !percent) return

    if (reducedMotion()) {
      root.style.setProperty('--enter', '1')
      root.style.setProperty('--z', '1')
      percent.textContent = '100%'
      setReady(true)
      return
    }

    let loaded = document.readyState === 'complete'
    const markLoaded = () => {
      loaded = true
    }
    window.addEventListener('load', markLoaded)
    const cap = window.setTimeout(markLoaded, LOAD_TIMEOUT)

    const last = SCHEDULE[SCHEDULE.length - 1]
    let raf = 0
    let t0 = 0

    const frame = (now) => {
      if (!t0) t0 = now
      const t = (now - t0) / 1000

      let value
      let z
      let enter = 1
      if (t < LEAD) {
        const p = t / LEAD
        value = START * p
        z = 0
        enter = easeOut(p)
      } else {
        let seg = SCHEDULE[0]
        for (const s of SCHEDULE) if (s.start <= t) seg = s
        const p = Math.min(1, (t - seg.start) / (seg.end - seg.start))
        value = seg.from + (seg.to - seg.from) * p
        z = closure(seg.from) + (closure(seg.to) - closure(seg.from)) * seg.ease(p)
      }

      root.style.setProperty('--enter', enter.toFixed(4))
      root.style.setProperty('--z', z.toFixed(4))
      percent.textContent = `${Math.min(Math.round(value), loaded ? 100 : 99)}%`

      if (t >= last.end && loaded) {
        setReady(true)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', markLoaded)
      window.clearTimeout(cap)
    }
  }, [])

  useEffect(() => () => stopDissolve.current?.(), [])

  const enter = () => {
    if (!ready || entered.current) return
    entered.current = true

    const sfx = new Audio(SFX_SRC)
    sfx.volume = SFX_VOLUME
    sfx.play?.().catch(() => {})

    // This click is the gesture the browser needs before it will let audio
    // start, so switch the music on here. MusicToggle owns the actual playback
    // and reflects the new state — the nav switch still lets them turn it off.
    setMusicEnabled(true)

    // Fired now, not at onDone, so the page pulls into focus behind the cells
    // as they clear — the reveal and the dissolve overlap into one move.
    onEnter?.()

    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas || reducedMotion()) {
      onDone()
      return
    }

    const color = getComputedStyle(root).getPropertyValue('--intro-bg').trim() || '#6fe7d2'
    stopDissolve.current = dissolve(canvas, color, onDone)
    // Same task as the first canvas paint, so the swap lands in one frame.
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
        <span className="intro__line intro__line--left" />
        <span className="intro__line intro__line--right" />
        <span className="intro__line intro__line--top" />
        <span className="intro__line intro__line--bottom" />

        {['top', 'right', 'bottom', 'left'].map((edge) => (
          <svg key={edge} className={`intro__tab intro__tab--${edge}`} viewBox="0 0 141 21">
            <path d="M0.5 0.5 23.5 19.5h94L140.5 0.5" />
          </svg>
        ))}

        {['tl', 'tr', 'bl', 'br'].map((corner) => (
          <PlusIcon key={corner} className={`intro__plus intro__plus--${corner}`} />
        ))}

        <span ref={percentRef} className="intro__percent">
          0%
        </span>
        <span className="intro__enter">Enter</span>
      </div>

      <canvas ref={canvasRef} className="intro__canvas" />
    </div>
  )
}
