/* The moment the site is first actually seen. On a fresh visit that's the
   Enter click on the intro — entrance animations must not play out unseen
   underneath it. Once the intro has been seen this session, it's immediately. */

let revealed = (() => {
  try {
    return sessionStorage.getItem('intro-seen') === '1'
  } catch {
    return true
  }
})()

const waiting = new Set()

export function markRevealed() {
  if (revealed) return
  revealed = true
  waiting.forEach((fn) => fn())
  waiting.clear()
}

// Runs `fn` once the site is revealed (straight away if it already is).
// Returns a cancel function for effect cleanups.
export function whenRevealed(fn) {
  if (revealed) {
    fn()
    return () => {}
  }
  waiting.add(fn)
  return () => waiting.delete(fn)
}
