import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import useHashRoute from './hooks/useHashRoute.js'
import { SECTIONS } from './data/content.js'

const PAGES = { home: Home, projects: Projects, contacts: Contact }
const ROUTES = SECTIONS.map((s) => s.id)

export default function App() {
  const route = useHashRoute(ROUTES)
  const Page = PAGES[route] ?? Home

  return (
    <>
      <Navbar route={route} />
      {/* Keyed on the route so the page remounts and replays its wipe-in. */}
      <main key={route}>
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
