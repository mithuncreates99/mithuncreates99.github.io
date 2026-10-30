import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { contact, hire, person } from '../content'
import { gsap, reducedMotion } from '../lib/motion'
import { ArrowUpRight, Copy, LinkedIn, Mail, Phone, Pin } from './Icons'

type Props = {
  /** The element that opened the dialog; the panel grows out of it and focus returns to it. */
  opener: HTMLElement | null
  open: boolean
  onClose: () => void
}

const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(hire.subject)}`

/**
 * Contact dialog built on the native <dialog>: showModal() makes the rest of
 * the page inert, traps Tab inside and closes on Escape. The panel grows out of
 * whatever opened it (a FLIP from the button's box) and shrinks back on close.
 */
export function HireDialog({ opener, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const [copied, setCopied] = useState(false)

  const fromOpener = useCallback(() => {
    const panel = panelRef.current
    if (!panel || !opener) return null
    const a = opener.getBoundingClientRect()
    const b = panel.getBoundingClientRect()
    if (!a.width || !b.width) return null
    return {
      x: a.left + a.width / 2 - (b.left + b.width / 2),
      y: a.top + a.height / 2 - (b.top + b.height / 2),
      scaleX: a.width / b.width,
      scaleY: a.height / b.height,
    }
  }, [opener])

  // Open: show the modal, then grow the panel out of the button.
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (!open || !dialog || !panel || dialog.open) return
    closing.current = false
    dialog.showModal()
    closeRef.current?.focus()
    const html = document.documentElement
    html.dataset.modal = 'open'

    if (reducedMotion()) {
      gsap.fromTo(dialog, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      return
    }
    const from = fromOpener()
    const tl = gsap.timeline()
    tl.fromTo(dialog, { '--veil': 0 }, { '--veil': 1, duration: 0.45, ease: 'power2.out' }, 0)
    if (from) {
      tl.fromTo(
        panel,
        { ...from, borderRadius: 999 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 28, duration: 0.7, ease: 'expo.out', clearProps: 'transform,borderRadius' },
        0,
      )
    } else {
      tl.fromTo(panel, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0)
    }
    tl.fromTo(panel.querySelectorAll('[data-stagger]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 }, 0.25)
  }, [open, fromOpener])

  const finish = useCallback(() => {
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
    delete document.documentElement.dataset.modal
    closing.current = false
    onClose()
    opener?.focus({ preventScroll: true })
  }, [onClose, opener])

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    if (!dialog || !panel || closing.current) return
    closing.current = true
    if (reducedMotion()) {
      gsap.to(dialog, { opacity: 0, duration: 0.15, onComplete: finish, clearProps: 'opacity' })
      return
    }
    const to = fromOpener()
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(panel.querySelectorAll('[data-stagger]'), { opacity: 0, duration: 0.15 }, 0)
    if (to) tl.to(panel, { ...to, borderRadius: 999, duration: 0.45, ease: 'power3.in', clearProps: 'all' }, 0.05)
    else tl.to(panel, { y: 20, opacity: 0, duration: 0.3, clearProps: 'all' }, 0)
    tl.to(dialog, { '--veil': 0, duration: 0.35 }, 0.1)
    tl.set(panel.querySelectorAll('[data-stagger]'), { clearProps: 'opacity' })
  }, [finish, fromOpener])

  // Escape fires "cancel": run the animated close instead of the instant one.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onCancel = (e: Event) => {
      e.preventDefault()
      requestClose()
    }
    // A click on the dialog itself (not the panel) is a click on the backdrop.
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) requestClose()
    }
    // Keep Tab cycling inside the panel instead of escaping to the browser UI.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    dialog.addEventListener('cancel', onCancel)
    dialog.addEventListener('click', onClick)
    dialog.addEventListener('keydown', onKey)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      dialog.removeEventListener('click', onClick)
      dialog.removeEventListener('keydown', onKey)
    }
  }, [requestClose])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.getElementById('hire-email')
      if (el) {
        const r = document.createRange()
        r.selectNodeContents(el)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(r)
      }
    }
  }

  return (
    <dialog ref={dialogRef} className="hire-dialog" aria-labelledby="hire-title" aria-describedby="hire-desc">
      <div className="hire-panel" ref={panelRef}>
        <span className="hire-panel-gloss" aria-hidden="true" />
        <div className="hire-top" data-stagger>
          <p className="eyebrow">
            <i className="dot" aria-hidden="true" />
            {hire.eyebrow}
          </p>
          <button ref={closeRef} type="button" className="hire-close" onClick={requestClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 18 18M18 6 6 18" />
            </svg>
          </button>
        </div>
        <h2 id="hire-title" className="hire-title" data-stagger>
          {hire.title[0]} <span className="em">{hire.title[1]}</span>
        </h2>
        <p id="hire-desc" className="hire-desc" data-stagger>
          {hire.text}
        </p>

        <div className="hire-email" data-stagger>
          <Mail />
          <a id="hire-email" href={mailto}>
            {contact.email}
          </a>
          <button type="button" className="hire-copy" onClick={copy}>
            <Copy /> {copied ? 'Copied' : 'Copy'}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? 'Email address copied' : ''}
          </span>
        </div>

        <ul className="hire-rows" data-stagger>
          {contact.linkedin && (
            <li>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedIn />
                <span>
                  <strong>LinkedIn</strong>
                  <small>{contact.linkedinLabel}</small>
                </span>
                <ArrowUpRight className="arrow" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          )}
          {contact.phone && (
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                <Phone />
                <span>
                  <strong>Phone</strong>
                  <small>{contact.phone}</small>
                </span>
              </a>
            </li>
          )}
          <li>
            <div>
              <Pin />
              <span>
                <strong>{person.location}</strong>
                <small>{person.reach}</small>
              </span>
            </div>
          </li>
        </ul>

        <a className="btn btn-primary hire-cta" href={mailto} data-stagger>
          <Mail /> {hire.cta}
        </a>
      </div>
    </dialog>
  )
}
