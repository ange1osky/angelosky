import { useRef, useState } from 'react'
import VideoCard from './VideoCard.jsx'
import ProgramCard from './ProgramCard.jsx'
import ToolsUsed from './ToolsUsed.jsx'
import ProgramCategories from './ProgramCategories.jsx'
import {
  PROGRAMS,
  PROGRAM_CATEGORIES,
  PROJECTS_HEAD,
  TABS,
  TOOLS,
  VIDEOS,
} from '../data/content.js'
import {
  PAGE_DELAY,
  slideIn,
  entrance,
  marksIn,
  riseChars,
  stagger,
  useEntrance,
} from '../motion/motion.js'

/* The rail plays once per visit to the page: chip steps in, title rises, and
   the switch steps in under it. (The tools group and blurb keep their own
   CSS wipe, which also runs on every tab switch.) */
function railEntrance(root) {
  const run = entrance(root)
  const q = (s) => root.querySelector(s)

  slideIn(run, q('.page-chip'), 0)
  riseChars(run, q('.work__title'), 80, { from: 'first', each: 45 })
  run.add(
    root.querySelectorAll('.work__tab'),
    { x: [-14, 0], opacity: [0, 1], delay: stagger(90) },
    450
  )
  return run
}

// "(07)" rather than "(7)", so the counts line up down the rail.
const count = (n) => `[${String(n).padStart(2, '0')}]`

const TOTALS = { videos: VIDEOS.length, programs: PROGRAMS.length }

/* Pinned rail on the left — badge, title, the Videos/Programs switch and its
   filters — with a three-up card grid scrolling past it on the right. */
export default function Projects() {
  const [tab, setTab] = useState('videos')
  const [category, setCategory] = useState(PROGRAM_CATEGORIES[0])
  const [activeVideo, setActiveVideo] = useState(null)

  const shownPrograms = PROGRAMS.filter((p) => p.category === category)

  const railRef = useEntrance(railEntrance)

  /* Cards deal in left to right, row by row, and their corner marks turn
     into place behind them. Replays on every tab or filter switch — straight
     away then, rather than waiting out the page curtain. */
  const gridKey = `${tab}-${category}`
  const firstGrid = useRef(gridKey)
  const gridRef = useEntrance(
    (root) => {
      // Keyed rather than flagged, so StrictMode's second run still counts as
      // the first deal; any switch after that clears it for good.
      const first = gridKey === firstGrid.current
      if (!first) firstGrid.current = null
      const run = entrance(root, { delay: first ? PAGE_DELAY + 200 : 0 })

      // Capped, so the last of 19 cards isn't left waiting a second and a half.
      const slot = (i) => Math.min(i, 8) * 60
      run.add(
        root.querySelectorAll('.card'),
        { y: [26, 0], opacity: [0, 1], duration: 650, delay: (_, i) => slot(i) },
        0
      )
      // Four marks per card, turning in just behind it, corner after corner.
      marksIn(run, root.querySelectorAll('.card__box > .mark'), 200, (_, i) =>
        slot(Math.floor(i / 4)) + (i % 4) * 40
      )
      return run
    },
    [tab, category]
  )

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="work">
        <aside className="work__rail" ref={railRef}>
          <div className="work__head">
            <span className="page-chip">{PROJECTS_HEAD.badge}</span>
            <h2 className="display work__title">{PROJECTS_HEAD.title}</h2>
          </div>

          <div className="work__filters">
            <div
              className="work__tabs"
              role="tablist"
              aria-label="Project type"
              aria-orientation="vertical"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  data-tone={t.id}
                  className="work__tab"
                  onClick={() => setTab(t.id)}
                >
                  {t.label} {count(TOTALS[t.id] ?? 0)}
                </button>
              ))}
            </div>

            {/* Keyed on the tab so the group wipes back in on every switch. */}
            {tab === 'programs' ? (
              <ProgramCategories
                key={tab}
                categories={PROGRAM_CATEGORIES}
                programs={PROGRAMS}
                active={category}
                onSelect={setCategory}
                format={count}
              />
            ) : (
              <ToolsUsed key={tab} tools={TOOLS[tab]} />
            )}
          </div>

          {/* Keyed on the tab so the new line wipes in with the grid. */}
          {PROJECTS_HEAD.blurb?.[tab] && (
            <p key={tab} className="work__blurb">
              {PROJECTS_HEAD.blurb[tab]}
            </p>
          )}
        </aside>

        {/* Category is part of the key so switching filters replays the same
            wipe the tabs use. It is stable on the Videos tab, where the
            categories are not rendered at all. */}
        <div
          key={`${tab}-${category}`}
          ref={gridRef}
          className="work__grid"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {tab === 'videos' ? (
            VIDEOS.map((item) => (
              <VideoCard
                key={item.id}
                item={item}
                activeId={activeVideo}
                onActivate={setActiveVideo}
              />
            ))
          ) : shownPrograms.length ? (
            shownPrograms.map((item) => <ProgramCard key={item.id} item={item} />)
          ) : (
            <p className="work__empty">No projects available</p>
          )}
        </div>
      </div>
    </section>
  )
}
