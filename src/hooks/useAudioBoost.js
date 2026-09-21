import { useEffect } from 'react'

/* HTML media elements cap `.volume` at 1.0 (100%), so a clip or track mastered
   quiet can never get as loud as it would in a desktop player turned up. The
   only way past that ceiling in a browser is to route the element through the
   Web Audio API and multiply its signal with a GainNode.

   A gentle limiter sits before the gain so pushing past 100% raises the quiet
   parts toward desktop loudness without the loud parts clipping into a rasp. */

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

function graphFor(el) {
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

/* Boosts a <video>/<audio> element past the 100% volume ceiling. `boost` is a
   plain multiplier: 1 = untouched, 1.8 ≈ +5 dB. The element's own `.volume`
   (and the native volume slider) still work as a pre-boost trim.

   `mounted` must flip when the element appears: a ref changing never re-runs an
   effect, so a player that mounts after the component (the video cards only
   render <video> once pressed) would otherwise be missed for good. */
export function useAudioBoost(ref, boost = 1, mounted = true) {
  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el || !(boost > 1)) return

    const graph = graphFor(el)
    if (!graph) return
    graph.gain.gain.value = boost

    // AudioContext starts suspended until a gesture; playback is always
    // gesture-driven here, so resume as the media starts.
    const resume = () => audioContext()?.resume?.().catch(() => {})
    el.addEventListener('play', resume)
    // Once wired in, the element is silent unless the context runs — so if it
    // started playing before this effect caught up, resume now, not next play.
    if (!el.paused) resume()
    return () => el.removeEventListener('play', resume)
  }, [ref, boost, mounted])
}
