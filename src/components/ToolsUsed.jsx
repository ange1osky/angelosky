import { TOOLS_LABEL } from '../data/content.js'

/* Row of tool logos under the tabs. Tools without a logo file fall back to a
   lettered tile so the row still reads correctly. */
export default function ToolsUsed({ tools }) {
  if (!tools?.length) return null

  return (
    <div className="tools">
      <span className="tools__label">{TOOLS_LABEL}</span>

      <ul className="tools__list">
        {tools.map((tool) => (
          <li key={tool.id} className="tools__item" title={tool.name}>
            {tool.icon ? (
              <img src={tool.icon} alt={tool.name} loading="lazy" />
            ) : (
              <span className="tools__fallback" aria-label={tool.name} role="img">
                {tool.name.charAt(0)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
