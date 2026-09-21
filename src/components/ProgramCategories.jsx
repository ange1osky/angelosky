/* Category filters for the Programs tab, sitting in the rail slot the tool
   logos occupy on Videos. The list is derived from the programs themselves, so
   adding a category is a content edit, not a code one. */
export default function ProgramCategories({ categories, programs, active, onSelect, format }) {
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
              {name} {format(programs.filter((p) => p.category === name).length)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
