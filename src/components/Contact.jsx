import FooterBar from './FooterBar.jsx'
import CornerMarks from './CornerMarks.jsx'
import { ICONS } from './Icons.jsx'
import { CONTACT, INQUIRIES, SOCIALS } from '../data/content.js'

/* mailto:/tel: links must stay in the same tab; everything else opens out. */
function LinkRow({ item }) {
  const Icon = ICONS[item.id]
  const external = /^https?:/i.test(item.href)

  return (
    <a
      className="talk__item"
      href={item.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
    >
      {Icon && <Icon />}
      {item.label}
    </a>
  )
}

/* A label over a hairline-framed list of links, marked at the corners like
   the project cards. */
function LinkBlock({ label, items, wide = false }) {
  return (
    <div className="talk__block">
      <p className="talk__label">{label}</p>
      <div className={`talk__list frame${wide ? ' talk__list--socials' : ''}`}>
        <CornerMarks />
        {items.map((item) => (
          <LinkRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section className="section" id="contacts" aria-label="Contacts">
      <div className="talk">
        <img className="talk__media" src="/images/contactsbg.jpg" alt="" decoding="async" />
        <div className="talk__scrim" aria-hidden="true" />

        <div className="shell talk__inner">
          <span className="page-chip talk__chip">{CONTACT.page}</span>
          <h2 className="display talk__title">
            {CONTACT.title}{' '}
            <span className="talk__title-accent">{CONTACT.titleAccent}</span>
          </h2>

          <LinkBlock label={CONTACT.inquiriesLabel} items={INQUIRIES} />
          <LinkBlock label={CONTACT.followLabel} items={SOCIALS} wide />
        </div>

        <div className="talk__shapes" aria-hidden="true">
          <span className="shape shape--mint-top" />
          <span className="shape shape--coral" />
          <span className="shape shape--cream" />
          <span className="shape shape--mint-small" />
        </div>
      </div>

      <FooterBar tone="light" />
    </section>
  )
}
