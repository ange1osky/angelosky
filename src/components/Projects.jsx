import { useEffect, useRef, useState } from 'react'
import VideoCard from './VideoCard.jsx'
import ProgramCard from './ProgramCard.jsx'
import ToolsUsed from './ToolsUsed.jsx'
import { PROGRAMS, PROJECT_BACKDROPS, TABS, TOOLS, VIDEOS } from '../data/content.js'

export default function Projects() {
  const [tab, setTab] = useState('videos')
  const [overflowing, setOverflowing] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const scrollRef = useRef(null)

  /* The bottom fade only makes sense when there is more to scroll to —
     without this check a single card would get its bottom edge faded out. */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 4)
    check()

    const observer = new ResizeObserver(check)
    observer.observe(el)
    return () => observer.disconnect()
  }, [tab])

  const backdrop = PROJECT_BACKDROPS[tab]

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="projects">
        {/* Keys on the tab so the backdrop, tools row and grid each fade back
            in when you switch between Videos and Programs. */}
        {backdrop ? (
          <img
            key={tab}
            className="projects__media"
            src={backdrop}
            alt=""
            decoding="async"
          />
        ) : (
          <div className="ph projects__media" aria-hidden="true">
            Background image placeholder
          </div>
        )}
        <div className="projects__scrim" aria-hidden="true" />

        <div className="shell">
          <div className="projects__head">
            <div className="tabs" role="tablist" aria-label="Project type">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  data-tone={t.id}
                  className={`tab${tab === t.id ? ' tab--active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="projects__titlewrap">
              <h2 className="display projects__title">PROJECTS</h2>
              <span className="page-chip projects__chip">PAGE 02</span>
            </div>
          </div>

          <ToolsUsed key={tab} tools={TOOLS[tab]} />

          <div className="projects__scroll" ref={scrollRef} data-overflow={overflowing}>
            <div
              key={tab}
              className="grid"
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
            >
              {tab === 'videos'
                ? VIDEOS.map((item) => (
                    <VideoCard
                      key={item.id}
                      item={item}
                      activeId={activeVideo}
                      onActivate={setActiveVideo}
                    />
                  ))
                : PROGRAMS.map((item) => <ProgramCard key={item.id} item={item} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
