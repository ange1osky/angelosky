/* ---------------------------------------------------------------------------
 * All editable content lives here. Swap the placeholder strings / links / file
 * paths below and the whole site updates — no component edits needed.
 * ------------------------------------------------------------------------- */

export const BRAND = 'angelosky'
export const COPYRIGHT = '© 2026 | ange1osky'

export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'contacts', label: 'Contacts' },
]

/* --- Home ---------------------------------------------------------------- */

export const HERO = {
  kicker: 'Hi! Welcome to my',
  title: 'PORTFOLIO',
  page: 'PAGE 01',
  tagline: [
    { text: 'vision', tone: 'coral' },
    { text: 'to', tone: 'plain' },
    { text: 'creation.', tone: 'mint' },
  ],
  year: '2026',
  edition: 'edition',
}

/* Content for the Education / Experience pop-ups. Each panel has one heading
 * and a list of groups; a group's `title` is an optional bold sub-label above
 * its entries (leave it '' to run the entries straight under the heading). */
export const PANELS = {
  education: {
    heading: 'Education',
    groups: [
      {
        title: '',
        items: [
          {
            title: 'BS Computer Science: Cebu Institute of Technology - University',
            meta: 'Upcoming Freshman',
          },
          {
            title: 'TVL ICT: Tagbilaran City Science High School',
            meta: '2020-2026',
          },
        ],
      },
    ],
  },
  experience: {
    heading: 'Experience',
    groups: [
      {
        title: 'TECHNOLOGY',
        items: [{ title: 'TESDA National Certificate II in CSS', meta: 'Awardee' }],
      },
      {
        title: 'CREATIVE',
        items: [
          { title: 'Oculus Multimedia Club 2025-2026', meta: 'Editor / Videographer' },
          { title: 'TCSHS Supreme Student Government 2024-2026', meta: 'Layout Artist' },
        ],
      },
    ],
  },
}

/* --- Projects ------------------------------------------------------------ */

/* 19 video slots — one line each so they're quick to edit.
 * `src`    — the .mp4 in `public/videos/`.
 * `poster` — the thumbnail in `public/images/thumbs/`, shown before playback
 *            and again as the <video> poster while the first frame decodes. */
export const VIDEOS = [
  { id: 'v1', title: 'DON MACCHIATOS: Creator Challenge 2026', award: '2nd Runner Up', roles: 'Director // Videographer // Editor', src: '/videos/1.mp4', poster: '/images/thumbs/1.png' },
  { id: 'v2', title: 'TCSHS Tambuli DLC Edit', award: '', roles: 'Videographer // Editor', src: '/videos/2.mp4', poster: '/images/thumbs/2.png' },
  { id: 'v3', title: 'RSTF 2025: Siyensikula', award: '2nd Place', roles: 'Editor', src: '/videos/3.mp4', poster: '/images/thumbs/3.png' },
  { id: 'v4', title: 'RSTF 2025: Hype Video', award: '', roles: 'Videographer // Editor', src: '/videos/4.mp4', poster: '/images/thumbs/4.png' },
  { id: 'v5', title: 'RSPC 2026: Advocacy Video', award: '', roles: 'Editor', src: '/videos/5.mp4', poster: '/images/thumbs/5.png' },
  { id: 'v6', title: 'TCSHS Tambuli DLC: Hype Video', award: '', roles: 'Videographer // Editor', src: '/videos/6.mp4', poster: '/images/thumbs/6.png' },
  { id: 'v7', title: 'TCSHS Balik Scihi', award: '', roles: 'Videographer // Editor', src: '/videos/7.mp4', poster: '/images/thumbs/7.png' },
  { id: 'v8', title: 'January Highlights', award: '', roles: 'Personal Project', src: '/videos/8.mp4', poster: '/images/thumbs/8.png' },
  { id: 'v9', title: 'Mclaren 765LT', award: '', roles: 'Personal Project', src: '/videos/9.mp4', poster: '/images/thumbs/9.png' },
  { id: 'v10', title: 'TCSHS Intramurals 2025', award: '', roles: 'Videographer // Editor', src: '/videos/10.mp4', poster: '/images/thumbs/10.png' },
  { id: 'v11', title: 'TCSHS MathSci Month 2025', award: '', roles: 'Videographer // Editor', src: '/videos/11.mp4', poster: '/images/thumbs/11.png' },
  { id: 'v12', title: 'TCSHS United Nations 2025', award: '', roles: 'Videographer // Editor', src: '/videos/12.mp4', poster: '/images/thumbs/12.png' },
  { id: 'v13', title: 'Back and Port', award: '', roles: 'Personal Project', src: '/videos/13.mp4', poster: '/images/thumbs/13.png' },
  { id: 'v14', title: 'Art of Cinematography', award: '', roles: 'Personal Project', src: '/videos/14.mp4', poster: '/images/thumbs/14.png' },
  { id: 'v15', title: 'BFP Short Film Contest: Ang Huling Babala', award: '1st Place', roles: 'Editor', src: '/videos/15.mp4', poster: '/images/thumbs/15.png' },
  { id: 'v16', title: 'TCSHS Acquaintance Party 2025', award: '', roles: 'Personal Project', src: '/videos/16.mp4', poster: '/images/thumbs/16.png' },
  { id: 'v17', title: 'Trend Edit', award: '', roles: 'Personal Project', src: '/videos/17.mp4', poster: '/images/thumbs/17.png' },
  { id: 'v18', title: 'Motion', award: '', roles: 'Personal Project', src: '/videos/18.mp4', poster: '/images/thumbs/18.png' },
  { id: 'v19', title: 'Graduation Music Video: Before We Go', award: '', roles: 'Director // Videographer // Editor', src: '/videos/19.mp4', poster: '/images/thumbs/19.png' },
]

/* Each card is a link — swap `href` for the real destination. */
export const PROGRAMS = [
  {
    id: 'p1',
    title: 'GMTK Game Jam 2026: Goblin Alarm',
    award: 'Top 38% out of 10,000+ entries - Top 19% in Art Category',
    roles: 'Artist',
    href: 'https://boys-at-the-back.itch.io/goblin-alarm',
    image: '/images/titlebg.png',
  },
]

export const TABS = [
  { id: 'videos', label: 'Videos' },
  { id: 'programs', label: 'Programs' },
]

/* Background image behind each tab of the projects page. Leave '' to show the
 * placeholder box; point at a file in `public/images/` to use a real one.
 * Set both to the same path if you want one background across both tabs. */
export const PROJECT_BACKDROPS = {
  videos: '/images/videosbg.jpg',
  programs: '/images/programbg.jpg',
}

/* Shown under the tabs, keyed by tab id — each tab lists its own tools.
 * Drop logo files in `public/tools/` and point `icon` at them. A tool with no
 * icon falls back to a lettered tile. */
export const TOOLS_LABEL = 'TOOLS USED:'

export const TOOLS = {
  videos: [
    { id: 'davinci', name: 'DaVinci Resolve Studio', icon: '/tools/davinci-resolve.png' },
    { id: 'ibispaint', name: 'ibisPaint X', icon: '/tools/ibispaint.jpg' },
  ],
  programs: [
    { id: 'canva', name: 'Canva', icon: '/tools/canva.jpg' },
    { id: 'ibispaint', name: 'ibisPaint X', icon: '/tools/ibispaint.jpg' },
  ],
}

/* --- Contacts ------------------------------------------------------------ */

export const CONTACT = {
  title: "LET'S TALK",
  page: 'PAGE 03',
  inquiriesLabel: 'For inquires, catch me through:',
  followLabel: 'My other socials',
}

/* Rows under "For inquires". `id` picks the icon from ICONS in Icons.jsx —
 * available: facebook, messenger, mail, instagram, tiktok, github.
 * To put the email back, add:
 *   { id: 'mail', label: 'balaneangelo02@gmail.com', href: 'mailto:balaneangelo02@gmail.com' } */
export const INQUIRIES = [
  { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/angelo.balane.909158' },
]

export const SOCIALS = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/ange1osky/' },
  { id: 'tiktok', label: 'Tiktok', href: 'https://www.tiktok.com/@ange1osky' },
  { id: 'github', label: 'Github', href: 'https://github.com/ange1osky?tab=overview' },
]
