import { useState } from 'react'
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

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="work">
        <aside className="work__rail">
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

          {PROJECTS_HEAD.blurb && <p className="work__blurb">{PROJECTS_HEAD.blurb}</p>}
        </aside>

        {/* Category is part of the key so switching filters replays the same
            wipe the tabs use. It is stable on the Videos tab, where the
            categories are not rendered at all. */}
        <div
          key={`${tab}-${category}`}
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
