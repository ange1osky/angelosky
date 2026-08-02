import { useEffect, useState } from 'react'

/* Tiny hash router — no dependency, and it works on any static host without
   server rewrites. URLs look like #/home, #/projects, #/contacts. */
export default function useHashRoute(routes, fallback = routes[0]) {
  const read = () => {
    const raw = window.location.hash.replace(/^#\/?/, '')
    return routes.includes(raw) ? raw : fallback
  }

  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onHashChange = () => setRoute(read())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Keep the URL naming the page even on first load or a bad hash.
    if (window.location.hash !== `#/${route}`) {
      window.history.replaceState(null, '', `#/${route}`)
    }
    window.scrollTo(0, 0)
  }, [route])

  return route
}
