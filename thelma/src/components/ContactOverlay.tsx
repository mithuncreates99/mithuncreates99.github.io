import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { contact, displayUrl, mailto } from '../content/contact'
import { person } from '../content/profile'
import './ContactOverlay.css'

type Props = { onClose: () => void; layoutId: string }

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ContactOverlay({ onClose, layoutId }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [copied, setCopied] = useState(false)

  // Focus, Escape, focus trap and scroll lock.
  useEffect(() => {
    const t = window.setTimeout(() => closeRef.current?.focus(), 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
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
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      html.style.overflow = prevOverflow
    }
  }, [onClose])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = mailto()
    }
  }

  const rows = [
    contact.linkedin && { k: 'LinkedIn', v: displayUrl(contact.linkedin), href: contact.linkedin, ext: true },
    contact.github && { k: 'GitHub', v: displayUrl(contact.github), href: contact.github, ext: true },
    contact.phone && { k: 'Phone', v: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}`, ext: false },
    contact.cvUrl && { k: 'CV', v: 'Download the CV', href: contact.cvUrl, ext: true },
  ].filter(Boolean) as { k: string; v: string; href: string; ext: boolean }[]

  const fade = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
  }

  return (
    <div className="ov" role="presentation">
      <motion.div
        className="ov__backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.1 } }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        ref={panelRef}
        layoutId={layoutId}
        className="ov__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ov-title"
        aria-describedby="ov-desc"
        style={{ borderRadius: 32 }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
      >
        <span className="ov__gloss" aria-hidden="true" />
        <motion.div className="ov__inner" {...fade} transition={{ delay: 0.22, duration: 0.45 }}>
          <div className="ov__top">
            <p className="cap ov__eyebrow">
              <span className="dot" aria-hidden="true" />
              {person.availability}
            </p>
            <motion.button
              ref={closeRef}
              type="button"
              className="ov__close"
              onClick={onClose}
              aria-label="Close contact details"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6 L18 18 M18 6 L6 18" />
              </svg>
            </motion.button>
          </div>

          <h2 id="ov-title" className="ov__title display">
            Let’s
            <br />
            collaborate
          </h2>
          <p id="ov-desc" className="ov__desc">
            For analyst and consulting roles, a project, or simply a conversation.
          </p>

          <div className="ov__email">
            <span className="cap ov__k">Email</span>
            <a className="ov__email-link" href={mailto()}>
              {contact.email}
            </a>
            <motion.button
              type="button"
              className="ov__copy cap"
              onClick={copyEmail}
              whileTap={{ scale: 0.94 }}
              aria-live="polite"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </motion.button>
          </div>

          <ul className="ov__rows">
            {rows.map((r) => (
              <li key={r.k}>
                <motion.a
                  href={r.href}
                  className="ov__row"
                  target={r.ext ? '_blank' : undefined}
                  rel={r.ext ? 'noreferrer' : undefined}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  <span className="cap ov__k">{r.k}</span>
                  <span className="ov__v">{r.v}</span>
                  <span className="ov__arrow" aria-hidden="true">
                    ↗
                  </span>
                  {r.ext && <span className="sr-only">(opens in a new tab)</span>}
                </motion.a>
              </li>
            ))}
          </ul>

          <motion.a
            href={mailto('Starting a project together')}
            className="ov__cta"
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            Start a Project
            <span aria-hidden="true">→</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  )
}
