import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Intro from './components/Intro.jsx'
import useHashRoute from './hooks/useHashRoute.js'
import useInteractionSfx from './hooks/useInteractionSfx.js'
import { SECTIONS } from './data/content.js'

const PAGES = { home: Home, projects: Projects, contacts: Contact }
const ROUTES = SECTIONS.map((s) => s.id)

export default function App() {
  const route = useHashRoute(ROUTES)
  const Page = PAGES[route] ?? Home

  // Hover + click sound effects, delegated across the whole app.
  useInteractionSfx()

  // Splash plays once per session; the site mounts underneath it either way.
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('intro-seen') === '1'
  )

  // One-shot flag: on the very first enter, the page pulls into focus behind
  // the lifting overlay so it feels like arriving inside, not a cut. Cleared
  // once it has played so route changes keep their own lighter wipe-in.
  const [arriving, setArriving] = useState(false)

  return (
    <>
      {!introDone && (
        <Intro
          onEnter={() => setArriving(true)}
          onDone={() => {
            sessionStorage.setItem('intro-seen', '1')
            setIntroDone(true)
          }}
        />
      )}

      <Navbar route={route} />
      {/* Keyed on the route so the page remounts and replays its wipe-in. */}
      <main
        key={route}
        className={arriving ? 'arrive' : undefined}
        onAnimationEnd={(e) => {
          if (e.animationName === 'site-arrive') setArriving(false)
        }}
      >
        <Page />
      </main>

      {/* Colour curtain rides over the reveal edge — without it the wipe is
          invisible when you go from one dark page to another. */}
      <div className="wipe" key={`wipe-${route}`} aria-hidden="true">
        <span className="wipe__bar wipe__bar--mint" />
        <span className="wipe__bar wipe__bar--coral" />
      </div>
    </>
  )
}
