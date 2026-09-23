import { useEffect, useRef } from 'react'
import FooterBar from './FooterBar.jsx'
import CornerMarks from './CornerMarks.jsx'
import { ICONS, PlusIcon } from './Icons.jsx'
import usePointerVars from '../hooks/usePointerVars.js'
import usePageVisible from '../hooks/usePageVisible.js'
import { CONTACT, INQUIRIES, SOCIALS } from '../data/content.js'

/* The looping backdrop. Nothing downloads until the section is close to the
   viewport, and it only decodes while it's on screen and the tab is showing —
   so it never competes with the rest of the page. Visitors who ask for reduced
   motion get the first frame, still. */
function BackgroundVideo({ src }) {
  const videoRef = useRef(null)
  const pageVisible = usePageVisible()
  const inView = useRef(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const sync = () => {
      if (inView.current && pageVisible && !still) el.play().catch(() => {})
      else el.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (inView.current && el.preload === 'none') el.preload = 'auto'
        sync()
      },
      // Starts a screen-edge early so it's already moving as it scrolls in.
      { rootMargin: '300px 0px' }
    )

    observer.observe(el)
    sync()
    return () => observer.disconnect()
  }, [pageVisible])

  return (
    <video
      ref={videoRef}
      className="talk__media"
      src={src}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}

/* mailto:/tel: links must stay in the same tab; everything else opens out. */
function LinkRow({ item }) {
  const Icon = ICONS[item.id]
  const external = /^https?:/i.test(item.href)

  return (
    <a
      className="talk__item"
      href={item.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
    >
      {Icon && <Icon />}
      {item.label}
    </a>
  )
}

/* A label over a hairline-framed list of links, marked at the corners like
   the project cards. */
function LinkBlock({ label, items, wide = false }) {
  return (
    <div className="talk__block">
      <p className="talk__label">{label}</p>
      <div className={`talk__list frame${wide ? ' talk__list--socials' : ''}`}>
        <CornerMarks />
        {items.map((item) => (
          <LinkRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

/* The block composition. Purely decorative: each block sits at its own depth
   and drifts against the pointer, and hovering the stack pulls the offset
   outlines into line. */
function ShapeStack() {
  return (
    <div className="talk__shapes" aria-hidden="true">
      <span className="shape shape--sky" />
      <span className="shape shape--frame" />
      <span className="shape shape--cream">
        <PlusIcon className="mark mark--tl" />
        <PlusIcon className="mark mark--tr" />
      </span>
      <span className="shape shape--step" />
    </div>
  )
}

export default function Contact() {
  // The whole page is the stage: the blocks answer the pointer from anywhere
  // on it, not just when it's over them.
  const talkRef = useRef(null)
  usePointerVars(talkRef)

  return (
    <section className="section" id="contacts" aria-label="Contacts">
      <div className="talk" ref={talkRef}>
        <BackgroundVideo src="/videos/web%20video.mp4" />
        <div className="talk__scrim" aria-hidden="true" />

        <div className="shell talk__inner">
          <span className="page-chip talk__chip">{CONTACT.page}</span>
          <h2 className="display talk__title">
            {CONTACT.title}{' '}
            <span className="talk__title-accent">{CONTACT.titleAccent}</span>
          </h2>

          <LinkBlock label={CONTACT.inquiriesLabel} items={INQUIRIES} />
          <LinkBlock label={CONTACT.followLabel} items={SOCIALS} wide />
        </div>

        <ShapeStack />
      </div>

      <FooterBar tone="light" />
    </section>
  )
}
