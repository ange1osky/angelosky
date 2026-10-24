import { useLayoutEffect, useRef } from 'react'
import {
  createScope,
  createTimeline,
  cubicBezier,
  onScroll,
  stagger,
  text,
  utils,
} from 'animejs'
import { whenRevealed } from './reveal.js'

/* Entrance choreography, played with anime.js. Every curve here is one the
   site already uses in CSS, so the JS motion reads as the same hand:
   --ease for the general settle, and the intro's title-card curve for type. */
export const EASE = cubicBezier(0.22, 0.61, 0.36, 1)
export const TITLE_EASE = cubicBezier(0.16, 1, 0.3, 1)

/* Pages fade up at 0.3s, once the colour curtain covers the screen (see
   .section in global.css) — entrances start just after, so they play in view. */
export const PAGE_DELAY = 320

export { stagger }

// anime.js properties that all land in the one CSS `transform`.
const TRANSFORMS = new Set([
  'x', 'y', 'z', 'translateX', 'translateY', 'translateZ',
  'rotate', 'rotateX', 'rotateY', 'rotateZ',
  'scale', 'scaleX', 'scaleY', 'skew', 'skewX', 'skewY',
])
const toKebab = (k) => k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* One entrance: a paused timeline plus everything it borrowed from the DOM.
   When it finishes, every inline style it wrote is wiped and every split is
   undone, so the page is left exactly as the stylesheet draws it — hover
   states, kerning and justified text included. While it runs, the root
   carries data-motion="run", which turns CSS transitions off underneath so
   they don't fight the tweens. */
export function entrance(root, { delay = PAGE_DELAY, scroll = false } = {}) {
  const splits = []
  const touched = [] // [elements, css properties] each add() wrote inline
  let observer = null

  /* Cleared by hand rather than with anime's cleanInlineStyles, which puts
     back whatever inline value it first saw — and that would be the starting
     pose set in add(), not the stylesheet's own. */
  const finish = () => {
    touched.splice(0).forEach(([els, props]) =>
      els.forEach((el) => props.forEach((p) => el.style.removeProperty(p)))
    )
    splits.splice(0).forEach((s) => s.revert())
    delete root.dataset.motion
  }

  root.dataset.motion = 'run'

  const tl = createTimeline({
    autoplay: false,
    delay,
    defaults: { ease: EASE, duration: 700 },
    onComplete: finish,
  })

  return {
    tl,
    /* tl.add, plus the starting pose applied straight away. A paused timeline
       only paints a tween once its start time is reached, so without this the
       page would show its finished state first and then jump back to animate. */
    add(targets, params, position) {
      const els = utils.$(targets)
      if (!els.length) return this
      const from = {}
      for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) from[key] = value[0]
        else if (value && typeof value === 'object' && 'from' in value) from[key] = value.from
      }
      if (Object.keys(from).length) {
        utils.set(els, from)
        const props = new Set(
          Object.keys(from).map((k) => (TRANSFORMS.has(k) ? 'transform' : toKebab(k)))
        )
        touched.push([els, [...props]])
      }
      tl.add(els, params, position)
      return this
    },
    split(el, params) {
      const s = text.splitText(el, params)
      splits.push(s)
      return s
    },
    // Plays now, or — for a band further down the page — once it scrolls in.
    start() {
      if (!scroll) {
        tl.play()
        return
      }
      observer = onScroll({
        target: root,
        enter: '88% start',
        repeat: false,
        onEnter: () => tl.play(),
      })
    },
    stop() {
      observer?.revert()
      tl.revert()
      finish()
    },
  }
}

/* Builds an entrance against the element the returned ref lands on. `build`
   receives that element and returns entrance(...). Nothing plays until the
   site has been revealed, and visitors who ask for reduced motion get the
   page as-is. */
export function useEntrance(build, deps = []) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return undefined

    let run = null
    const scope = createScope({ root }).add(() => {
      run = build(root)
    })
    const cancel = whenRevealed(() => run?.start())

    // Scope first: reverting its timeline restores the starting pose, which
    // stop() then clears.
    return () => {
      cancel()
      scope.revert()
      run?.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/* --- Shared moves -------------------------------------------------------- */

/* Display titles: letters rise out of their own line, from the middle out,
   the way the intro's lettering draws together. */
export function riseChars(run, el, position, { from = 'center', each = 40 } = {}) {
  if (!el) return
  const { chars } = run.split(el, { chars: { wrap: 'clip' } })
  run.add(
    chars,
    {
      y: ['110%', '0%'],
      duration: 1100,
      ease: TITLE_EASE,
      delay: stagger(each, { from }),
    },
    position
  )
}

/* Body copy: each line slides up from behind its own edge. */
export function riseLines(run, els, position) {
  const lines = [...els].flatMap((el) => run.split(el, { lines: { wrap: 'clip' } }).lines)
  if (!lines.length) return
  run.add(
    lines,
    { y: ['100%', '0%'], duration: 900, ease: TITLE_EASE, delay: stagger(70) },
    position
  )
}

/* Small labels ("PAGE 01", list headings) step in from the left, the
   direction the page wipe travels. */
export function slideIn(run, el, position, distance = 12) {
  if (!el) return
  run.add(el, { x: [-distance, 0], opacity: [0, 1], duration: 600 }, position)
}

/* Registration marks turn a quarter into place — the same quarter-turn they
   make on hover — and grow out of their centre. */
export function marksIn(run, marks, position, delay = stagger(60)) {
  if (!marks?.length) return
  run.add(
    marks,
    {
      rotate: [-90, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: 650,
      delay,
    },
    position
  )
}
