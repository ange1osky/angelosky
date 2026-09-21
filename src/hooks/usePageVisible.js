import { useSyncExternalStore } from 'react'

/* Whether the visitor can currently see the page. False while the tab is in
 * the background, the browser is minimised, or on a phone once they switch
 * apps or lock the screen — anything the browser reports as `hidden`. */
function subscribe(fn) {
  document.addEventListener('visibilitychange', fn)
  return () => document.removeEventListener('visibilitychange', fn)
}

const isPageVisible = () => document.visibilityState !== 'hidden'

export default function usePageVisible() {
  return useSyncExternalStore(subscribe, isPageVisible, () => true)
}
