import { useSyncExternalStore } from 'react'

/* One rule: nothing plays over the videos.
 *
 * The music toggle lives in the nav and the players live three levels down
 * inside Projects, so there is no useful parent to hang this state on without
 * threading props through components that have no interest in audio. A module
 * store keeps the two ends decoupled — players announce themselves, the toggle
 * listens, and neither imports the other.
 *
 * Holders are tracked as a Set of ids rather than a count: a player that fires
 * pause twice, or unmounts after already pausing, must not drive the tally
 * negative and leave the music muted for the rest of the session. */
const holders = new Set()
const listeners = new Set()

function emit() {
  for (const fn of listeners) fn()
}

/* Called when a player starts. Safe to call repeatedly for the same id. */
export function claimAudio(id) {
  if (holders.has(id)) return
  holders.add(id)
  emit()
}

/* Called on pause, end, and unmount — the last one matters, since switching
   tabs or routes tears players down without ever firing a pause event. */
export function releaseAudio(id) {
  if (!holders.delete(id)) return
  emit()
}

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/* Exported so the behaviour can be exercised without mounting React. */
export const isAudioTaken = () => holders.size > 0

export function useAudioTaken() {
  return useSyncExternalStore(subscribe, isAudioTaken, () => false)
}
