import { useState } from 'react'
import FooterBar from './FooterBar.jsx'
import Modal from './Modal.jsx'
import CornerMarks, { LineMarks } from './CornerMarks.jsx'
import Crosshair from './Crosshair.jsx'
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

        {/* Three levels: a small intro line, the title as big as the width
            allows, and the tagline tucked under the title's right end. */}
        <div className="shell hero__inner">
          <div className="hero__intro">
            <span className="page-chip">{HERO.page}</span>
            <p className="hero__kicker">{HERO.kicker}</p>
          </div>

          <div className="hero__head">
            <h1 className="display hero__title">{HERO.title}</h1>

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
        </div>

        <div className="hero__badge">
          <span className="hero__badge-panel" aria-hidden="true" />
          <span className="hero__year">{HERO.year}</span>
          <span className="hero__edition">{HERO.edition}</span>
        </div>
      </div>

      <div className="about">
        <LineMarks edge="top" split />

        <div className="about__copy">
          <h2 className="display about__title">ABOUT ME</h2>

          <p className="about__body">
            I am <strong>Angelo C. Balane</strong>, an 18 year old student from the
            Philippines currently pursuing a degree in Bachelor of Science in Computer
            Science. This website showcases my <span className="hl-teal">development</span>{' '}
            capabilities as I hone my skills in programming.
          </p>

          <p className="about__body">
            I also do <span className="hl-coral">filmmaking and editing</span>, showcasing my
            art through cinematic visuals and storytelling.
          </p>

          <div className="about__actions">
            <button className="pill" data-tone="mint" onClick={() => setOpenPanel('education')}>
              <CornerMarks />
              Education
            </button>
            <button className="pill" data-tone="coral" onClick={() => setOpenPanel('experience')}>
              <CornerMarks />
              Experience
            </button>
          </div>
        </div>

        <div className="about__portrait">
          <Crosshair />
          <span className="about__frame" aria-hidden="true">
            <CornerMarks />
          </span>
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
