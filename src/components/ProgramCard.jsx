/* Teal box holding a placeholder image slot. The whole card is a link that
   opens the project in a new tab. */
export default function ProgramCard({ item }) {
  return (
    <figure className="card card--program">
      <a
        className="card__frame"
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${item.title} — opens in a new tab`}
      >
        {item.image ? (
          <img className="card__video" src={item.image} alt="" />
        ) : (
          <span className="ph" aria-hidden="true">
            Image placeholder
          </span>
        )}

        <span className="card__overlay">{item.title}</span>
      </a>

      <figcaption className="card__meta">
        {item.award && <span className="card__award">{item.award}</span>}
        <span className="card__roles">{item.roles}</span>
      </figcaption>
    </figure>
  )
}
