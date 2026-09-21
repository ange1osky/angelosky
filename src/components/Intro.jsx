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

// Half the final box round the count, in px.
const BOX = 72

// Exit: the panel breaks into cells that clear outward from the centre.
const CELL = 36
const DISSOLVE_MS = 1300

/* The frame runs as Web Animations so the compositor plays it — smooth even
   while the site mounts underneath and the main thread is busy. That means
   CSS easing strings; these are the quadratic ease-out / ease-in-out. */
const EASE_OUT = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const EASE_IN_OUT = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
const easeOut = (t) => 1 - (1 - t) * (1 - t)

/* Each climb as { start, end, from, to, ease } in seconds from the start.
   A stop's hold is the gap before the next climb starts. */
const SCHEDULE = (() => {
  const points = [START, ...STOPS.map((s) => s.at), 100]
  const out = []
  let t = LEAD
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i]
    const to = points[i + 1]
    const dur = Math.max(((to - from) / (100 - START)) * CLIMB, 0.35)
    out.push({ start: t, end: t + dur, from, to, ease: i === 0 ? EASE_OUT : EASE_IN_OUT })
    t += dur + (STOPS[i]?.hold ?? 0)
  }
  return out
})()

const TOTAL = SCHEDULE[SCHEDULE.length - 1].end

// How far the frame has closed in, 0 at the edges to 1 boxed round the count.
const closure = (value) => Math.max(0, (value - START) / (100 - START))

/* The frame's path as keyframe stops: { t, enter, z, ease }. `enter` slides
   the lines in from just off-screen, `z` closes them on the centre; a hold
   repeats the stop it pauses on. `ease` shapes the run to the next stop. */
const FRAME_STOPS = (() => {
  const out = [{ t: 0, enter: 0, z: 0, ease: EASE_OUT }]
  let at = { t: LEAD, enter: 1, z: 0 }
  for (const seg of SCHEDULE) {
    if (seg.start > at.t) {
      out.push({ ...at, ease: 'linear' })
      at = { ...at, t: seg.start }
    }
    out.push({ ...at, ease: seg.ease })
    at = { t: seg.end, enter: 1, z: closure(seg.to) }
  }
  out.push({ ...at, ease: 'linear' })
  return out
})()

/* Each piece of the frame, keyed by its data-place. `x` is how far the left
   line has travelled and `y` the top line; the far lines mirror them, and a
   corner mark rides both lines that meet at it. */
const PLACES = {
  left: (x) => `translate3d(${x}px, 0, 0)`,
  right: (x) => `translate3d(${-x}px, 0, 0)`,
  top: (x, y) => `translate3d(0, ${y}px, 0)`,
  bottom: (x, y) => `translate3d(0, ${-y}px, 0)`,
  tl: (x, y) => `translate3d(${x}px, ${y}px, 0)`,
  tr: (x, y) => `translate3d(${-x}px, ${y}px, 0)`,
  bl: (x, y) => `translate3d(${x}px, ${-y}px, 0)`,
  br: (x, y) => `translate3d(${-x}px, ${-y}px, 0)`,
}

// Overlay size and the CSS inset the lines start from (it tightens on phones).
function measure(root) {
  const { width: w, height: h } = root.getBoundingClientRect()
  const line = root.querySelector('[data-place="left"]')
  const inset = parseFloat(getComputedStyle(line).left) || 32
  const box = Math.min(BOX, w / 2 - inset - 12, h / 2 - inset - 12)
  return { w, h, inset, box }
}

function keyframes(place, g) {
  const at = PLACES[place]
  return FRAME_STOPS.map((s) => {
    const slide = (g.inset + 2) * (s.enter - 1)
    const x = slide + (g.w / 2 - g.box - g.inset) * s.z
    const y = slide + (g.h / 2 - g.box - g.inset) * s.z
    return { offset: s.t / TOTAL, easing: s.ease, transform: at(x, y) }
  })
}

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
  const percentRef = useRef(null)
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

  /* The frame plays on the compositor; the only per-frame main-thread work
     left is the counter, and it touches the DOM only when the number changes. */
  useEffect(() => {
    const root = rootRef.current
    const percent = percentRef.current
    if (!root || !percent) return

    const pieces = [...root.querySelectorAll('[data-place]')]
    const g = measure(root)
    const anims = pieces.map((el) =>
      el.animate(keyframes(el.dataset.place, g), { duration: TOTAL * 1000, fill: 'both' })
    )

    // A resize mid-run re-aims the frame without restarting it.
    const onResize = () => {
      const next = measure(root)
      anims.forEach((a, i) => a.effect.setKeyframes(keyframes(pieces[i].dataset.place, next)))
    }
    window.addEventListener('resize', onResize)

    if (reducedMotion()) {
      anims.forEach((a) => a.finish())
      percent.textContent = '100%'
      setReady(true)
      return () => {
        window.removeEventListener('resize', onResize)
        anims.forEach((a) => a.cancel())
      }
    }

    let loaded = document.readyState === 'complete'
    const markLoaded = () => {
      loaded = true
    }
    window.addEventListener('load', markLoaded)
    const cap = window.setTimeout(markLoaded, LOAD_TIMEOUT)

    let shown = -1
    let raf = 0
    const frame = () => {
      // Read the clock off the frame's own animation so the two never drift.
      const t = (anims[0]?.currentTime ?? 0) / 1000

      let value = START * Math.min(1, t / LEAD)
      if (t >= LEAD) {
        let seg = SCHEDULE[0]
        for (const s of SCHEDULE) if (s.start <= t) seg = s
        const p = Math.min(1, (t - seg.start) / (seg.end - seg.start))
        value = seg.from + (seg.to - seg.from) * p
      }

      const n = Math.min(Math.round(value), loaded ? 100 : 99)
      if (n !== shown) {
        shown = n
        percent.textContent = `${n}%`
      }

      if (t >= TOTAL && loaded) {
        setReady(true)
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', markLoaded)
      window.clearTimeout(cap)
      anims.forEach((a) => a.cancel())
    }
  }, [])

  /* Once the count lands, cut the exit grid in the idle moment before the
     click — and again if the window changes size while Enter waits. */
  useEffect(() => {
    if (!ready || reducedMotion()) return
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return

    const prepare = () => {
      const color = getComputedStyle(root).getPropertyValue('--intro-bg').trim() || '#6fe7d2'
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
        <span className="intro__line intro__line--left" data-place="left" />
        <span className="intro__line intro__line--right" data-place="right" />
        <span className="intro__line intro__line--top" data-place="top" />
        <span className="intro__line intro__line--bottom" data-place="bottom" />

        {['tl', 'tr', 'bl', 'br'].map((corner) => (
          <PlusIcon
            key={corner}
            className={`intro__plus intro__plus--${corner}`}
            data-place={corner}
          />
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
