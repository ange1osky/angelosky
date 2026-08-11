import { useState } from 'react'
import FooterBar from './FooterBar.jsx'
import Modal from './Modal.jsx'
import { HERO, PANELS } from '../data/content.js'

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null)

  return (
    <section className="section" id="home" aria-label="Portfolio">
      <div className="hero">
        <img
          className="hero__media"
          src="/images/bg.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero__scrim" aria-hidden="true" />

        <div className="shell hero__inner">
          <div>
            <p className="hero__kicker">{HERO.kicker}</p>
            <h1 className="display hero__title">{HERO.title}</h1>
            <span className="page-chip hero__chip">{HERO.page}</span>
          </div>

          <p className="hero__tagline">
            {HERO.tagline.map((part) => (
              <span
                key={part.text}
                className={part.tone === 'plain' ? undefined : `tone-${part.tone}`}
              >
                {part.text}
              </span>
            ))}
          </p>
        </div>

        <div className="hero__badge">
          <span className="hero__badge-panel" aria-hidden="true" />
          <span className="hero__year">{HERO.year}</span>
          <span className="hero__edition">{HERO.edition}</span>
        </div>
      </div>

      <div className="about">
        <div className="about__copy">
          <h2 className="about__title">ABOUT ME</h2>

          <p className="about__body">
            I am <strong>Angelo C. Balane</strong>, an 18 year old student from the
            Philippines currently pursuing a degree in Bachelor of Science in Computer
            Science. This website showcases my <span className="hl-teal">development</span>{' '}
            capabilities as I hone my skills as a programmer.
          </p>

          <p className="about__body">
            I also do <span className="hl-coral">filmmaking and editing</span>, showcasing my
            art through cinematic visuals and storytelling.
          </p>

          <div className="about__actions">
            <button className="pill" onClick={() => setOpenPanel('education')}>
              Education
            </button>
            <button className="pill" onClick={() => setOpenPanel('experience')}>
              Experience
            </button>
          </div>
        </div>

        <div className="about__portrait">
          <img
            className="about__photo"
            src="/images/aboutpic.png"
            alt="Angelo C. Balane"
          />
        </div>
      </div>

      <FooterBar tone="dark" />

      {openPanel && <Modal panel={PANELS[openPanel]} onClose={() => setOpenPanel(null)} />}
    </section>
  )
}
