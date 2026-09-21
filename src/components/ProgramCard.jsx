import CornerMarks from './CornerMarks.jsx'
import Crosshair from './Crosshair.jsx'
import { ArrowUpRightIcon } from './Icons.jsx'

/* The frame and the Visit label both open the project in a new tab. */
export default function ProgramCard({ item }) {
  const link = { href: item.href, target: '_blank', rel: 'noreferrer noopener' }

  return (
    <figure className="card card--program">
      <div className="card__box frame">
        <CornerMarks />

        <a className="card__frame" {...link} aria-label={`${item.title} — opens in a new tab`}>
          <Crosshair />
          {item.image ? (
            <img className="card__thumb" src={item.image} alt="" loading="lazy" />
          ) : (
            <span className="ph" aria-hidden="true">
              Image placeholder
            </span>
          )}

          {item.category && (
            <span className="card__tag" data-tone="category">
              {item.category}
            </span>
          )}
        </a>
      </div>

      <figcaption className="card__meta">
        <span className="card__label">
          <span className="card__title">{item.title}</span>
          {/* Duplicate of the frame link, so kept out of the tab order. */}
          <a className="card__action" {...link} tabIndex={-1} aria-hidden="true">
            Visit
            <ArrowUpRightIcon />
          </a>
        </span>
        {item.award && <span className="card__award">{item.award}</span>}
        <span className="card__roles">{item.roles}</span>
      </figcaption>
    </figure>
  )
}
