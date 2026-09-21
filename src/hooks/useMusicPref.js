import { useSyncExternalStore } from 'react'

/* Shared "is the music meant to be on?" flag.
 *
 * The nav toggle and the enter gate both need to drive this — the toggle owns
 * it during normal use, and the intro flips it on the moment the visitor
 * clicks to enter (that click is the gesture the browser needs before it will
 * let anything play). They live far apart in the tree, so a small module store
 * keeps them in sync without threading props, the same shape as useAudioFocus.
 *
 * `enabled` is only the *intent*. Whether sound is actually coming out is still
 * decided in MusicToggle, which also has to yield to videos. */
const STORAGE_KEY = 'angelosky:music'

function readStored() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

let enabled = readStored()
const listeners = new Set()

function emit() {
  for (const fn of listeners) fn()
}

/* `persist` writes the choice to localStorage so it survives a reload. Explicit
   visitor actions (the toggle, clicking enter) persist; the autoplay-refusal
   fallback does not — a browser refusing to start silently is not the visitor
   changing their mind, so their stored preference is left intact. */
export function setMusicEnabled(next, { persist = true } = {}) {
  next = !!next
  enabled = next
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    } catch {}
  }
  emit()
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const isMusicEnabled = () => enabled

export function useMusicEnabled() {
  return useSyncExternalStore(subscribe, isMusicEnabled, () => false)
}
