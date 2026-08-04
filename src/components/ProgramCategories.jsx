/* Row of category filters under the tabs on the Programs tab, sitting in the
   same slot the tool logos occupy on Videos. The list is derived from the
   programs themselves, so adding a category is a content edit, not a code one. */
export default function ProgramCategories({ categories, active, onSelect }) {
  if (!categories?.length) return null

  return (
    <div className="tools">
      <span className="tools__label">
        {categories.length > 1 ? 'CATEGORIES:' : 'CATEGORY:'}
      </span>

      <ul className="cats__list">
        {categories.map((name) => (
          <li key={name}>
            <button
              type="button"
              className={`cats__item${name === active ? ' cats__item--active' : ''}`}
              aria-pressed={name === active}
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
