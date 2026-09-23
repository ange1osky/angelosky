import { useEffect, useRef } from 'react'

/* Pop-up used by the Education / Experience buttons: one or more headed groups
   of entries. Closes on the ×, Escape, or a click on the backdrop. */
export default function Modal({ panel, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal__panel">
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className="modal__title" id="modal-title">
          {panel.heading}
        </h2>

        {panel.groups.map((group) => (
          <section className="modal__group" key={group.title || 'root'}>
            {group.title && <h3 className="modal__group-title">{group.title}</h3>}

            <ul className="modal__entries">
              {group.items.map((item) => (
                <li className="modal__entry" key={item.title}>
                  <p className="modal__entry-title">{item.title}</p>
                  {item.details?.length ? (
                    <details className="modal__entry-more">
                      <summary className="modal__entry-meta">{item.meta || 'More'}</summary>
                      <ul className="modal__entry-details">
                        {item.details.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    item.meta && <p className="modal__entry-meta">{item.meta}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
