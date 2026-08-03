/* Inline SVGs so there is no icon-font dependency. All use currentColor. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="2.4" y="4.8" width="19.2" height="14.4" rx="2.6" {...stroke} />
      <path d="m3.6 7.4 7.2 5.5a2 2 0 0 0 2.4 0l7.2-5.5" {...stroke} />
    </svg>
  )
}

export function MessengerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.3 2 2 6.18 2 11.8c0 2.94 1.2 5.48 3.16 7.24.16.15.26.35.27.57l.06 1.79c.02.57.6.94 1.13.72l2-.88c.17-.08.36-.09.54-.04 1.19.33 2.45.5 3.74.5 5.7 0 10-4.18 10-9.8S17.7 2 12 2Zm6 7.46-2.94 4.66c-.47.74-1.47.92-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66c.47-.74 1.47-.92 2.17-.4l2.34 1.75a.6.6 0 0 0 .72 0l3.16-2.4c.42-.32.97.18.69.63Z" />
    </svg>
  )
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" {...stroke} />
      <circle cx="12" cy="12" r="4.2" {...stroke} />
      <circle cx="17.5" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function TiktokIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.62 5.82A4.28 4.28 0 0 1 15.56 3h-3.1v12.4a2.59 2.59 0 1 1-1.86-2.49V9.77a5.72 5.72 0 1 0 4.96 5.66V9.02a7.35 7.35 0 0 0 4.29 1.37V7.3a4.29 4.29 0 0 1-3.23-1.48Z" />
    </svg>
  )
}

export function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

export function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.35 4.79-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

/* Rides inside the toggle knob at ~13px, so it carries a heavier stroke than
   the contact icons — 1.7 disappears at that size. */
export function HeadphonesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M4.4 15.2v-3a7.6 7.6 0 0 1 15.2 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <rect x="2" y="14" width="4.8" height="7.2" rx="2.4" fill="currentColor" />
      <rect x="17.2" y="14" width="4.8" height="7.2" rx="2.4" fill="currentColor" />
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" {...props}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M26 21.5 44 32 26 42.5Z" fill="currentColor" />
    </svg>
  )
}

/* Keyed by the `id` used in content.js, so adding a contact or social row is
   just a data edit plus an entry here. */
export const ICONS = {
  mail: MailIcon,
  messenger: MessengerIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  facebook: FacebookIcon,
  github: GithubIcon,
}
