import { useEffect } from 'react'

/* HTML media elements cap `.volume` at 1.0 (100%), so a clip or track mastered
   quiet can never get as loud as it would in a desktop player turned up. The
   only way past that ceiling in a browser is to route the element through the
   Web Audio API and multiply its signal with a GainNode.

   A gentle limiter sits before the gain so pushing past 100% raises the quiet
   parts toward desktop loudness without the loud parts clipping into a rasp. */

/* Phones and tablets: a touch screen with no mouse to hover. They get their own,
   far lower levels — the speaker is small and held close, and iOS ignores an
   element's own volume, so what a laptop needs comes out blaring there. */
export const ON_PHONE =
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(hover: none) and (pointer: coarse)').matches)

let sharedCtx
function audioContext() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!sharedCtx) sharedCtx = new AC()
  return sharedCtx
}

/* A media element can be wired into Web Audio exactly once — a second
   createMediaElementSource() on the same node throws. Cache the graph on the
   element so remounts (including StrictMode's double-invoke in dev) reuse it
   instead of building a parallel, doubled-up path. */
const GRAPH = Symbol('audioBoost')

/* Wires `el` through the limiter and gain (once) and returns { gain }, the
   GainNode, or null where Web Audio isn't available. Exported for the music,
   which drives its gain directly: it's the one volume control iOS honours. */
export function audioGraph(el) {
  const ctx = audioContext()
  if (!ctx) return null
  if (el[GRAPH]) return el[GRAPH]

  let source
  try {
    source = ctx.createMediaElementSource(el)
  } catch {
    // Not eligible (e.g. a cross-origin file) — leave the element on its own
    // output rather than silencing it.
    return null
  }

  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -18
  limiter.knee.value = 24
  limiter.ratio.value = 4
  limiter.attack.value = 0.003
  limiter.release.value = 0.25

  const gain = ctx.createGain()
  source.connect(limiter).connect(gain).connect(ctx.destination)

  const graph = { gain }
  el[GRAPH] = graph
  return graph
}

// AudioContext starts suspended until a gesture, and phones suspend it again
// when the page is backgrounded; call as playback starts.
export function resumeAudio() {
  audioContext()?.resume?.().catch(() => {})
}

/* Sets a <video>/<audio> element's level through the gain stage — past the
   100% volume ceiling, or below it on phones, where the element's own volume
   may be ignored. `boost` is a plain multiplier: 1 = untouched, 1.8 ≈ +5 dB,
   0.6 ≈ -4 dB. The element's own `.volume` (and the native volume slider)
   still work as a trim ahead of it.

   `mounted` must flip when the element appears: a ref changing never re-runs an
   effect, so a player that mounts after the component (the video cards only
   render <video> once pressed) would otherwise be missed for good. */
export function useAudioBoost(ref, boost = 1, mounted = true) {
  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el || !(boost > 0) || boost === 1) return

    const graph = audioGraph(el)
    if (!graph) return
    graph.gain.gain.value = boost

    // Playback is always gesture-driven here, so resume as the media starts.
    el.addEventListener('play', resumeAudio)
    // Once wired in, the element is silent unless the context runs — so if it
    // started playing before this effect caught up, resume now, not next play.
    if (!el.paused) resumeAudio()
    return () => el.removeEventListener('play', resumeAudio)
  }, [ref, boost, mounted])
}
