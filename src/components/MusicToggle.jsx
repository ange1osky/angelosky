import { useEffect, useRef, useState } from 'react'
import { MUSIC } from '../data/content.js'
import { HeadphonesIcon } from './Icons.jsx'
import { useAudioTaken } from '../hooks/useAudioFocus.js'

/* Remembered across reloads, but see the resume effect — a stored 'on' is a
   request to play, not a guarantee the browser will allow it. */
const STORAGE_KEY = 'angelosky:music'
const FADE_MS = 420

/* `volume` is hand-edited in content.js and 0–1 reads like a percentage to
   anyone who hasn't met the media API, so clamp it once here. Out of range is
   worse than it looks: assigning >1 to el.volume throws, and ramping *toward*
   100 clears 1.0 inside the first frame, which silently costs you the fade. */
const TARGET_VOLUME = Math.min(1, Math.max(0, Number(MUSIC.volume) || 0.35))

/* Ramps volume rather than cutting it. A music bed that snaps to full level is
   jarring next to the eased motion everywhere else, and the fade doubles as the
   hand-off when a video takes over. Returns a canceller so a fast second toggle
   doesn't fight the ramp already in flight. */
function fadeTo(el, target, onDone) {
  const from = el.volume
  const start = performance.now()
  let raf = 0

  const step = (now) => {
    const t = Math.min(1, (now - start) / FADE_MS)
    el.volume = Math.max(0, Math.min(1, from + (target - from) * t))
    if (t < 1) raf = requestAnimationFrame(step)
    else onDone?.()
  }

  raf = requestAnimationFrame(step)
  return () => cancelAnimationFrame(raf)
}

/* Sits left of the brand in the nav. Deliberately starts silent: browsers block
   unprompted audio, and a portfolio that makes noise before you ask is worse
   than one that stays quiet. */
export default function MusicToggle() {
  /* `enabled` is what the visitor asked for; whether sound is actually coming
     out is derived below. Keeping the two apart is what lets a video borrow the
     speakers and hand them back without the button lying about its state. */
  const [enabled, setEnabled] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'on'
  )
  const [broken, setBroken] = useState(false)
  const audioRef = useRef(null)
  const cancelFade = useRef(null)

  const videoTaken = useAudioTaken()
  const shouldPlay = enabled && !videoTaken && !broken

  /* The single place playback is driven. Everything else just moves `enabled`
     or claims audio focus, and this effect reconciles the element to match. */
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    cancelFade.current?.()

    if (shouldPlay) {
      el.volume = 0
      el.play().then(
        () => {
          cancelFade.current = fadeTo(el, TARGET_VOLUME)
        },
        () => {
          // Autoplay policy refused us — there has been no gesture yet. Drop
          // `enabled` so the button shows off rather than claiming to play
          // something silent; one press then starts it for real.
          setEnabled(false)
        }
      )
    } else if (!el.paused) {
      cancelFade.current = fadeTo(el, 0, () => el.pause())
    }

    return () => cancelFade.current?.()
  }, [shouldPlay])

  if (!MUSIC.src || broken) return null

  const toggle = () => {
    const next = !enabled
    // Written on the gesture, so the choice survives a video interrupting it.
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    setEnabled(next)
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
