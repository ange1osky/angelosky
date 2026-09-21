import { COPYRIGHT, VERSION } from '../data/content.js'
import { LineMarks } from './CornerMarks.jsx'

/* Each page closes with its own bar — dark on the home page, cream on the
   contact page — pinned to the bottom of the screen as you scroll, the way
   the nav is pinned to the top. */
export default function FooterBar({ tone = 'dark' }) {
  return (
    <div className={`footer-bar footer-bar--${tone}`}>
      <LineMarks edge="top" />
      <div className="shell footer-bar__inner">
        <span>{COPYRIGHT}</span>
        <span className="footer-bar__version">{VERSION}</span>
      </div>
    </div>
  )
}
