import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from './Icons.jsx'

/* Thumbnail until it is pressed; then the <video> mounts and plays. The title
   overlay stays pinned bottom-left throughout, lifting clear of the native
   controls during playback. */
export default function VideoCard({ item, activeId, onActivate }) {
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const videoRef = useRef(null)

  const start = () => {
    setPlaying(true)
    // Wait for the element to mount before asking it to play.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => setFailed(true))
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

  /* One video at a time — whenever another card takes over, this one stops. */
  useEffect(() => {
    if (activeId !== item.id) videoRef.current?.pause()
  }, [activeId, item.id])

  return (
    <figure className="card card--video">
      <div className="card__frame" data-playing={playing}>
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
            /* Fires for the native control too, not just our play button. */
            onPlay={() => onActivate?.(item.id)}
            onError={() => setFailed(true)}
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

        {failed && (
          <span className="card__fallback">
            <strong>No video file yet</strong>
            <span>
              Drop the file at <code>public{item.src}</code> — or point <code>src</code> in{' '}
              <code>src/data/content.js</code> somewhere else.
            </span>
          </span>
        )}

        <span className="card__overlay">{item.title}</span>
      </div>

      <figcaption className="card__meta">
        {item.award && <span className="card__award">{item.award}</span>}
        <span className="card__roles">{item.roles}</span>
      </figcaption>
    </figure>
  )
}
