import { useEffect, useState } from 'react'
import { BRAND, SECTIONS } from '../data/content.js'

/* Fixed across all three pages. Links change the hash route; the browser's
   back/forward buttons work for free. */
export default function Navbar({ route }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <nav className="shell nav__inner" aria-label="Primary">
        <a className="nav__brand" href="#/home">
          {BRAND}
        </a>

        <ul className="nav__links">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                className={`nav__link${route === section.id ? ' nav__link--active' : ''}`}
                href={`#/${section.id}`}
                aria-current={route === section.id ? 'page' : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
