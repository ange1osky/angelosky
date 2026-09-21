/* ---------------------------------------------------------------------------
 * All editable content lives here. Swap the placeholder strings / links / file
 * paths below and the whole site updates — no component edits needed.
 * ------------------------------------------------------------------------- */

export const BRAND = 'angelosky'
export const COPYRIGHT = '© 2026 | angelosky'
export const VERSION = 'version 3.0' // right end of the footer bar

export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'contacts', label: 'Contacts' },
]

export const MUSIC = {
  src: '/audio/music.mp3',
  volume: 0.85,   // base level, 0–1, before the boost below
  boost: 1.5,     // Web Audio gain (>1) so the bed can exceed the 100% cap
}

/* Clips are authored at wildly different levels, and the browser caps a plain
   <video> at 100%. This Web Audio gain (>1) lifts the quiet ones toward the
   loudness they'd have in a desktop player; a limiter in useAudioBoost tames
   the peaks so it stays clean. */
export const VIDEO_BOOST = 1.8

/* --- Home ---------------------------------------------------------------- */

export const HERO = {
  kicker: 'Hi! Welcome to my',
  title: 'PORTFOLIO',
  page: 'PAGE 01',
  tagline: [
    { text: 'vision',  tone: 'coral' },
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
            title: 'BSCS: Cebu Institute of Technology - University',
            meta: '2026-Present',
          },
          {
            title: 'TVL ICT: Tagbilaran City Science High School',
            meta: '2020-2026',
          },
        ],
      },
      {
        title: 'CERTIFICATIONS',
        items: [
          {
            title: 'TESDA National Certificate II in Computer Systems Servicing',
            meta: 'NC II Holder',
          },
        ],
      },
    ],
  },
  experience: {
    heading: 'Experience',
    groups: [
      {
        title: 'CREATIVE ROLES',
        items: [
          { title: "CIT-U Computer Students' Society 26-Present", meta: 'Videographer | Editor' },
          { title: 'TCSHS Oculus Multimedia Club 25-26', meta: 'Videographer | Editor' },
          { title: 'TCSHS Supreme Student Learning Government: 24-26', meta: 'Layout Artist' },
        ],
      },
    ],
  },
}

/* --- Projects ------------------------------------------------------------ */

/* The pinned column on the left of the projects page. `badge` is the tag above
 * the title; `blurb` sits at the foot of the column — set it to '' to drop it. */
export const PROJECTS_HEAD = {
  badge: 'PAGE 02',
  title: 'PROJECTS',
  blurb: "Everything I've shot, cut and colaborated on, all in one page.",
}

/* 19 video slots — one line each so they're quick to edit.
 * `src`    — the .mp4 in `public/videos/`.
 * `poster` — the thumbnail in `public/images/thumbs/`, shown before playback
 *            and again as the <video> poster while the first frame decodes. */
export const VIDEOS = [
  { id: 'v21', title: 'CIT-U: CCS Acquaintance Party 2026', award: '', roles: 'Videographer | Editor', src: '/videos/21.mp4', poster: '/images/thumbs/21.png' },
  { id: 'v20', title: 'Cebu Oceanpark', award: '', roles: 'Personal Project', src: '/videos/20.mp4', poster: '/images/thumbs/20.png' },
  { id: 'v19', title: 'CIT-U: Brand New Day', award: '', roles: 'Personal Project', src: '/videos/19.mp4', poster: '/images/thumbs/19.png' },
  { id: 'v18', title: 'DON MACCHIATOS: Creator Challenge 2026', award: '2nd Runner Up', roles: 'Director | Videographer | Editor', src: '/videos/18.mp4', poster: '/images/thumbs/18.png' },
  { id: 'v17', title: 'TCSHS Tambuli DLC Edit', award: '', roles: 'Videographer | Editor', src: '/videos/17.mp4', poster: '/images/thumbs/17.png' },
  { id: 'v16', title: 'RSTF 2025: Siyensikula', award: '2nd Place', roles: 'Editor', src: '/videos/16.mp4', poster: '/images/thumbs/16.png' },
  { id: 'v15', title: 'RSTF 2025: Hype Video', award: '', roles: 'Videographer | Editor', src: '/videos/15.mp4', poster: '/images/thumbs/15.png' },
  { id: 'v14', title: 'RSPC 2026: Advocacy Video', award: '', roles: 'Editor', src: '/videos/14.mp4', poster: '/images/thumbs/14.png' },
  { id: 'v13', title: 'TCSHS: Tambuli DLC Hype Video', award: '', roles: 'Videographer | Editor', src: '/videos/13.mp4', poster: '/images/thumbs/13.png' },
  { id: 'v12', title: 'TCSHS: Balik Scihi', award: '', roles: 'Videographer | Editor', src: '/videos/12.mp4', poster: '/images/thumbs/12.png' },
  { id: 'v11', title: 'January Highlights', award: '', roles: 'Personal Project', src: '/videos/11.mp4', poster: '/images/thumbs/11.png' },
  { id: 'v10', title: 'Mclaren 765LT', award: '', roles: 'Personal Project', src: '/videos/10.mp4', poster: '/images/thumbs/10.png' },
  { id: 'v9', title: 'TCSHS: Intramurals 2025', award: '', roles: 'Videographer | Editor', src: '/videos/9.mp4', poster: '/images/thumbs/9.png' },
  { id: 'v8', title: 'TCSHS: MathSci Month 2025', award: '', roles: 'Videographer | Editor', src: '/videos/8.mp4', poster: '/images/thumbs/8.png' },
  { id: 'v7', title: 'TCSHS: United Nations 2025', award: '', roles: 'Videographer | Editor', src: '/videos/7.mp4', poster: '/images/thumbs/7.png' },
  { id: 'v6', title: 'Back and Port', award: '', roles: 'Personal Project', src: '/videos/6.mp4', poster: '/images/thumbs/6.png' },
  { id: 'v5', title: 'Art of Cinematography', award: '', roles: 'Personal Project', src: '/videos/5.mp4', poster: '/images/thumbs/5.png' },
  { id: 'v4', title: 'BFP: Ang Huling Babala', award: '1st Place', roles: 'Editor', src: '/videos/4.mp4', poster: '/images/thumbs/4.png' },
  { id: 'v3', title: 'TCSHS: Acquaintance Party 2025', award: '', roles: 'Personal Project', src: '/videos/3.mp4', poster: '/images/thumbs/3.png' },
  { id: 'v1', title: 'Motion', award: '', roles: 'Personal Project', src: '/videos/1.mp4', poster: '/images/thumbs/1.png' },
  { id: 'v0', title: 'Graduation MV: Before We Go', award: '', roles: 'Director | Videographer | Editor', src: '/videos/0.mp4', poster: '/images/thumbs/0.png' },
]

/* Each card is a link — swap `href` for the real destination.
 * `category` — what kind of project it is, listed in the row under the tabs.
 *              Reuse an existing string to file a project under that category;
 *              write a new one and the category appears on its own. */
export const PROGRAMS = [
  {
    id: 'p1',
    title: 'GMTK Game Jam 2026: Goblin Alarm',
    category: 'Game Dev',
    award: 'Top 38% out of 10,000+ entries - Top 19% in Art Category',
    roles: 'Artist',
    href: 'https://boys-at-the-back.itch.io/goblin-alarm',
    image: '/images/titlebg.webp',
  },
]

/* Categories listed here show up in display order, and may be listed before
 * any project uses them — that's how a category appears while its first
 * project is still in progress. Anything used by a program but missing here is
 * appended automatically, so a new `category` can never go unlisted. */
const DECLARED_CATEGORIES = ['Game Dev']

export const PROGRAM_CATEGORIES = [
  ...new Set([
    ...DECLARED_CATEGORIES,
    ...PROGRAMS.map((p) => p.category).filter(Boolean),
  ]),
]

export const TABS = [
  { id: 'videos', label: 'Videos' },
  { id: 'programs', label: 'Programs' },
]

/* Shown under the tabs, keyed by tab id. Only the Videos tab lists tools —
 * Programs shows its categories there instead, see PROGRAM_CATEGORIES above.
 * Drop logo files in `public/tools/` and point `icon` at them. A tool with no
 * icon falls back to a lettered tile. */
export const TOOLS_LABEL = 'TOOL USED:'

export const TOOLS = {
  videos: [
    { id: 'davinci', name: 'DaVinci Resolve', icon: '/tools/davinci-resolve.webp' },
  ],
}

/* --- Contacts ------------------------------------------------------------ */

export const CONTACT = {
  title: 'THE NEXT STEP',
  titleAccent: 'AWAITS',
  page: 'PAGE 03',
  inquiriesLabel: 'For inquires, catch me through:',
  followLabel: 'My other socials:',
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
