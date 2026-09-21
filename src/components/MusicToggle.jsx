import { useEffect, useRef, useState } from 'react'
import { MUSIC } from '../data/content.js'
import { HeadphonesIcon } from './Icons.jsx'
import { useAudioTaken } from '../hooks/useAudioFocus.js'
import { useMusicEnabled, setMusicEnabled } from '../hooks/useMusicPref.js'
import { ON_PHONE, audioGraph, resumeAudio } from '../hooks/useAudioBoost.js'
import usePageVisible from '../hooks/usePageVisible.js'

/* Remembered across reloads, but see the play effect — a stored 'on' is a
   request to play, not a guarantee the browser will allow it. */
const FADE_MS = 420

// The settings are hand-edited in content.js; keep a stray value in range.
const clamp01 = (n) => Math.min(1, Math.max(0, n))

/* How loud the bed ends up, as a single gain. On a computer it's `volume`
   times `boost`, so it can pass the 100% an <audio> element tops out at. On a
   phone it's `phoneVolume` on its own, far lower: the speaker is small and
   close, and iOS ignores an element's own volume altogether, so the level a
   laptop needs came out blaring even with the phone turned down. */
const LEVEL = ON_PHONE
  ? clamp01(Number(MUSIC.phoneVolume) || 0.35)
  : clamp01(Number(MUSIC.volume) || 0.35) * Math.max(1, Number(MUSIC.boost) || 1)

/* Ramps the level rather than cutting it. A music bed that snaps to full level
   is jarring next to the eased motion everywhere else, and the fade doubles as
   the hand-off when a video takes over. Returns a canceller so a fast second
   toggle doesn't fight the ramp already in flight.

   The ramp runs on the Web Audio gain wherever the track is wired through one —
   that is the only volume iOS respects — and falls back to stepping the
   element's own volume (capped at 1) where Web Audio isn't available. */
function fadeTo(el, graph, target, onDone) {
  if (graph) {
    const param = graph.gain.gain
    const now = graph.gain.context.currentTime
    param.cancelScheduledValues(now)
    param.setValueAtTime(param.value, now)
    param.linearRampToValueAtTime(target, now + FADE_MS / 1000)
    const timer = window.setTimeout(() => onDone?.(), FADE_MS)
    return () => window.clearTimeout(timer)
  }

  const from = el.volume
  const to = clamp01(target)
  const start = performance.now()
  let raf = 0

  const step = (now) => {
    const t = Math.min(1, (now - start) / FADE_MS)
    el.volume = clamp01(from + (to - from) * t)
    if (t < 1) raf = requestAnimationFrame(step)
    else onDone?.()
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

// Starts a ramp from true silence, wherever the level lives.
function silence(el, graph) {
  if (graph) {
    const param = graph.gain.gain
    param.cancelScheduledValues(graph.gain.context.currentTime)
    param.value = 0
    el.volume = 1
  } else {
    el.volume = 0
  }
}

/* Sits left of the brand in the nav. Deliberately starts silent: browsers block
   unprompted audio, and a portfolio that makes noise before you ask is worse
   than one that stays quiet. */
export default function MusicToggle() {
  /* `enabled` is what the visitor asked for; whether sound is actually coming
     out is derived below. Keeping the two apart is what lets a video borrow the
     speakers and hand them back without the button lying about its state. It
     lives in a shared store so the enter gate can switch it on too. */
  const enabled = useMusicEnabled()
  const [broken, setBroken] = useState(false)
  const audioRef = useRef(null)
  const cancelFade = useRef(null)

  const videoTaken = useAudioTaken()
  /* Out of sight, out of earshot: the bed stops when the visitor switches tab,
     minimises, or leaves for another app, and picks up where it left off when
     they come back. `enabled` is untouched, so the switch keeps reading ON. */
  const visible = usePageVisible()
  const shouldPlay = enabled && !videoTaken && !broken && visible

  /* The single place playback is driven. Everything else just moves `enabled`,
     claims audio focus or changes visibility, and this effect reconciles the
     element to match. */
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    cancelFade.current?.()
    // A play() that resolves after this run is superseded must not start a
    // fade of its own.
    let current = true

    if (shouldPlay) {
      const graph = audioGraph(el)
      silence(el, graph)
      resumeAudio()
      el.play().then(
        () => {
          if (current) cancelFade.current = fadeTo(el, graph, LEVEL)
        },
        (err) => {
          // Autoplay policy refused us — there has been no gesture yet. Drop
          // `enabled` so the button shows off rather than claiming to play
          // something silent; one press then starts it for real. Don't persist
          // it — the visitor never asked for off, the browser just stalled.
          // Only NotAllowedError means that: an AbortError is our own pause()
          // (say, leaving the tab mid-start) cutting the request short.
          if (err?.name === 'NotAllowedError') setMusicEnabled(false, { persist: false })
        }
      )
    } else if (!el.paused) {
      if (!visible) {
        // Stop at once. A hidden page gets no animation frames and slowed
        // timers, so a fade-out would stall and leave it playing unseen.
        el.pause()
      } else {
        cancelFade.current = fadeTo(el, audioGraph(el), 0, () => el.pause())
      }
    }

    return () => {
      current = false
      cancelFade.current?.()
    }
  }, [shouldPlay, visible])

  if (!MUSIC.src || broken) return null

  const toggle = () => {
    // Persisted on the gesture, so the choice survives a video interrupting it.
    setMusicEnabled(!enabled)
  }

  const name = [MUSIC.artist, MUSIC.track].filter(Boolean).join(' — ') || 'Music'
  const label = `${name}: turn ${enabled ? 'off' : 'on'}`

  return (
    <>
      <button
        type="button"
        className="music"
        onClick={toggle}
        data-playing={enabled}
        /* Still on, but a video has the speakers. Worth its own state: the
           switch has to keep reading as ON — that is still what the visitor
           chose — while showing it isn't currently making sound. */
        data-yielded={enabled && videoTaken}
        aria-pressed={enabled}
        aria-label={label}
        title={enabled && videoTaken ? `${name}: paused for video` : label}
      >
        {/* The knob carries the headphones rather than the track, so the icon
            stays legible in both positions instead of being slid over. */}
        <span className="music__switch" aria-hidden="true">
          <span className="music__knob">
            <HeadphonesIcon />
          </span>
        </span>

        {/* Hidden below the phone breakpoint — the nav has no room for it, and
            the switch alone still reads as a control. */}
        {(MUSIC.artist || MUSIC.track) && (
          <span className="music__label" aria-hidden="true">
            {MUSIC.artist && <b className="music__artist">{MUSIC.artist}:</b>}
            {MUSIC.track && <span className="music__track"> {MUSIC.track}</span>}
          </span>
        )}
      </button>

      {/* `preload="none"` keeps the track off the critical path — most visitors
          never toggle it, and it must not compete with the page's own assets. */}
      <audio
        ref={audioRef}
        src={MUSIC.src}
        loop
        preload="none"
        onError={() => setBroken(true)}
      />
    </>
  )
}
