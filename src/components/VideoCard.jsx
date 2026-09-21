import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from './Icons.jsx'
import CornerMarks from './CornerMarks.jsx'
import Crosshair from './Crosshair.jsx'
import { claimAudio, releaseAudio } from '../hooks/useAudioFocus.js'
import { ON_PHONE, useAudioBoost } from '../hooks/useAudioBoost.js'
import { VIDEO_BOOST, VIDEO_PHONE_VOLUME } from '../data/content.js'

/* Thumbnail until it is pressed; then the <video> mounts and plays in place.
   The title and roles sit under the frame, so nothing covers the footage. */
export default function VideoCard({ item, activeId, onActivate }) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const videoRef = useRef(null)
  const live = playing && !paused

  // Push clip audio past the element's 100% ceiling toward desktop loudness —
  // or, on a phone, well below it.
  useAudioBoost(videoRef, ON_PHONE ? VIDEO_PHONE_VOLUME : VIDEO_BOOST, playing)

  const start = () => {
    // Claim the single-play slot in the same batch as `playing`, so the effect
    // below never sees a stale `activeId` and pause this card as it starts.
    onActivate?.(item.id)
    setPlaying(true)
    // Wait for the element to mount before asking it to play.
    requestAnimationFrame(() => {
      // A rejection here means playback was interrupted or blocked by policy,
      // not that the file is missing — only <video onError> tells us that.
      videoRef.current?.play().catch(() => {})
    })
  }

  /* Pause once the card scrolls mostly out of view — decoding video you can't
     see is what makes the grid stutter. Doesn't auto-resume; scrolling back
     leaves it paused on the same frame, ready for the play control. */
  useEffect(() => {
    if (!playing) return
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause()
      },
      { threshold: 0.35 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [playing])

  /* One video at a time — whenever another card takes over, this one stops.
     The truthy guard matters: with no card active there is nothing to yield
     to, and pausing here would abort a play() that is still resolving. */
  useEffect(() => {
    if (activeId && activeId !== item.id) videoRef.current?.pause()
  }, [activeId, item.id])

  /* Switching tabs or leaving the page tears the player down without ever
     firing a pause, so the claim has to be dropped here too — otherwise the
     music stays muted for the rest of the session. */
  useEffect(() => () => releaseAudio(item.id), [item.id])

  return (
    <figure className="card card--video">
      <div className="card__box frame">
        <CornerMarks />

        {/* `playing` = the player is mounted; `live` = it is actually rolling.
            The award tag and crosshair step aside for both, clearing the
            footage and the native controls. */}
        <div className="card__frame" data-playing={playing} data-live={live}>
          <Crosshair />
          {playing ? (
            <video
              ref={videoRef}
              className="card__video"
              src={item.src}
              poster={item.poster || undefined}
              controls
              playsInline
              preload="metadata"
              /* Drops Download and Picture-in-Picture from the player's ⋮ menu,
                 and blocks right-click → Save video as. Casual saving only —
                 the file URL is still reachable from devtools. */
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              /* Fires for the native control too, not just our play button.
                 Claiming here rather than in `start` covers every route into
                 playback — our button, the native controls, and the scroll-away
                 observer that pauses it again. */
              onPlay={() => {
                setPaused(false)
                onActivate?.(item.id)
                claimAudio(item.id)
              }}
              onPause={() => {
                setPaused(true)
                releaseAudio(item.id)
              }}
              onEnded={() => releaseAudio(item.id)}
              onError={() => {
                setFailed(true)
                releaseAudio(item.id)
              }}
            />
          ) : (
            <>
              {item.poster ? (
                <img className="card__thumb" src={item.poster} alt="" loading="lazy" />
              ) : (
                <span className="ph" aria-hidden="true">
                  Video placeholder
                </span>
              )}
              <button
                type="button"
                className="card__play"
                onClick={start}
                aria-label={`Play ${item.title}`}
              >
                <PlayIcon />
              </button>
            </>
          )}

          {item.award && (
            <span className="card__tag" data-tone="award">
              {item.award}
            </span>
          )}

          {failed && (
            <span className="card__fallback">
              <strong>No video file yet</strong>
              <span>
                Drop the file at <code>public{item.src}</code> — or point <code>src</code> in{' '}
                <code>src/data/content.js</code> somewhere else.
              </span>
            </span>
          )}
        </div>
      </div>

      <figcaption className="card__meta">
        <span className="card__title">{item.title}</span>
        <span className="card__roles">{item.roles}</span>
      </figcaption>
    </figure>
  )
}
