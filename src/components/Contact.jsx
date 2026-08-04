import FooterBar from './FooterBar.jsx'
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

export default function Contact() {
  return (
    <section className="section" id="contacts" aria-label="Contacts">
      <div className="talk">
        <img className="talk__media" src="/images/contactsbg.jpg" alt="" decoding="async" />
        <div className="talk__scrim" aria-hidden="true" />

        <div className="shell talk__inner">
          <h2 className="display talk__title">
            {CONTACT.title}{' '}
            <span className="talk__title-accent">{CONTACT.titleAccent}</span>
          </h2>
          <span className="page-chip talk__chip">{CONTACT.page}</span>

          <div className="talk__block">
            <p className="talk__label">{CONTACT.inquiriesLabel}</p>
            <div className="talk__list">
              {INQUIRIES.map((item) => (
                <LinkRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="talk__block">
            <p className="talk__label">{CONTACT.followLabel}</p>
            <div className="talk__list talk__list--socials">
              {SOCIALS.map((social) => (
                <LinkRow key={social.id} item={social} />
              ))}
            </div>
          </div>
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
