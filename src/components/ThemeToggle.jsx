import { useState } from 'react'
import { MoonIcon, SunIcon } from './Icons.jsx'

/* Remembered across visits. index.html reads the same key before the first
   paint, so a light-mode visitor never sees a flash of the dark page. */
const STORAGE_KEY = 'angelosky:theme'

const current = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

/* Sits left of the brand in the nav. The site is designed dark, so dark is the
   default; the switch flips the whole palette via data-theme on <html>. */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(current)
  const light = theme === 'light'

  const toggle = () => {
    const next = light ? 'dark' : 'light'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    setTheme(next)
  }

  return (
    <button
      type="button"
      className="theme"
      onClick={toggle}
      data-light={light}
      aria-pressed={light}
      aria-label="Light mode"
      title={light ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="theme__switch" aria-hidden="true">
        <span className="theme__knob">{light ? <MoonIcon /> : <SunIcon />}</span>
      </span>
    </button>
  )
}
