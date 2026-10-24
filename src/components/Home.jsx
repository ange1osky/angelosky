import { useState } from 'react'
import FooterBar from './FooterBar.jsx'
import Modal from './Modal.jsx'
import CornerMarks, { LineMarks } from './CornerMarks.jsx'
import Crosshair from './Crosshair.jsx'
import { HERO, PANELS } from '../data/content.js'
import {
  entrance,
  marksIn,
  riseChars,
  riseLines,
  slideIn,
  stagger,
  useEntrance,
} from '../motion/motion.js'

/* The hero opens like a title sequence: the plate settles, the greeting steps
   in, PORTFOLIO rises letter by letter, and the year fades in. */
function heroEntrance(root) {
  const run = entrance(root, { delay: 380 })
  const q = (s) => root.querySelector(s)

  run.add(q('.hero__media'), { scale: [1.08, 1], duration: 2400 }, 0)
  slideIn(run, q('.page-chip'), 0)
  slideIn(run, q('.hero__kicker'), 120)
  riseChars(run, q('.hero__title'), 120)
  run.add(
    root.querySelectorAll('.hero__tagline > span'),
    { y: ['0.7em', '0em'], opacity: [0, 1], duration: 800, delay: stagger(110) },
    700
  )
  run.add(q('.hero__year'), { opacity: [0, 1], duration: 900 }, 450)
  run.add(q('.hero__edition'), { opacity: [0, 1], duration: 900 }, 1050)

  return run
}

/* The about band plays when it scrolls into view rather than under the hero. */
function aboutEntrance(root) {
  const run = entrance(root, { delay: 0, scroll: true })
  const q = (s) => root.querySelector(s)

  riseChars(run, q('.about__title'), 0, { from: 'first', each: 35 })
  riseLines(run, root.querySelectorAll('.about__body'), 250)
  run.add(
    root.querySelectorAll('.about__actions .pill'),
    { y: [14, 0], opacity: [0, 1], delay: stagger(90) },
    650
  )
  marksIn(run, root.querySelectorAll('.about__actions .mark'), 800)

  // The viewfinder closes in on the portrait, as the intro frame does on 100%.
  run.add(q('.about__frame'), { scale: [1.12, 1], opacity: [0, 1], duration: 1000 }, 100)
  marksIn(run, root.querySelectorAll('.about__frame .mark'), 500)
  run.add(q('.about__photo'), { y: ['10%', '0%'], opacity: [0, 1], duration: 1200 }, 200)

  return run
}

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null)
  const heroRef = useEntrance(heroEntrance)
  const aboutRef = useEntrance(aboutEntrance)

  return (
    <section className="section" id="home" aria-label="Portfolio">
      <div className="hero" ref={heroRef}>
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

      <div className="about" ref={aboutRef}>
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
