import { COPYRIGHT } from '../data/content.js'

/* Each section closes with its own bar — dark on the home page, cream on the
   projects and contact pages, as in the mockup. */
export default function FooterBar({ tone = 'dark' }) {
  return (
    <div className={`footer-bar footer-bar--${tone}`}>
      <div className="shell">{COPYRIGHT}</div>
    </div>
  )
}
