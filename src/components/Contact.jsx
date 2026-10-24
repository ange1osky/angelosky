import { useEffect, useRef } from 'react'
import FooterBar from './FooterBar.jsx'
import CornerMarks from './CornerMarks.jsx'
import { ICONS, ArrowUpRightIcon } from './Icons.jsx'
import usePageVisible from '../hooks/usePageVisible.js'
import { CONTACT, INQUIRIES, SOCIALS } from '../data/content.js'
import { entrance, marksIn, riseChars, slideIn, stagger, useEntrance } from '../motion/motion.js'

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
      <ArrowUpRightIcon className="talk__arrow" />
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

/* Chip steps in, the title rises, then each list traces in: its corner marks
   turn into place and the links step across one after another. */
function talkEntrance(root) {
  const run = entrance(root)
  const q = (s) => root.querySelector(s)

  slideIn(run, q('.page-chip'), 0)
  riseChars(run, q('.talk__title'), 80, { from: 'first', each: 32 })
  run.add(q('.talk__lede'), { y: [14, 0], opacity: [0, 1], duration: 800 }, 550)
  root.querySelectorAll('.talk__block').forEach((block, i) => {
    const at = 700 + i * 180
    slideIn(run, block.querySelector('.talk__label'), at)
    marksIn(run, block.querySelectorAll('.talk__list > .mark'), at + 80)
    run.add(
      block.querySelectorAll('.talk__item'),
      { x: [-14, 0], opacity: [0, 1], duration: 600, delay: stagger(55) },
      at + 120
    )
  })
  return run
}

export default function Contact() {
  const innerRef = useEntrance(talkEntrance)

  return (
    <section className="section" id="contacts" aria-label="Contacts">
      <div className="talk">
        <BackgroundVideo src="/videos/web%20video.mp4" />
        <div className="talk__scrim" aria-hidden="true" />

        <div className="shell talk__inner" ref={innerRef}>
          <span className="page-chip talk__chip">{CONTACT.page}</span>
          <h2 className="display talk__title">
            {CONTACT.title}{' '}
            <span className="talk__title-accent">{CONTACT.titleAccent}</span>
          </h2>

          <p className="talk__lede">{CONTACT.lede}</p>

          <div className="talk__groups">
            <LinkBlock label={CONTACT.inquiriesLabel} items={INQUIRIES} />
            <LinkBlock label={CONTACT.followLabel} items={SOCIALS} wide />
          </div>
        </div>

      </div>

      <FooterBar tone="dark" />
    </section>
  )
}
