import { useEffect, useState } from 'react'
import { person } from '../content'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'recognition', label: 'Recognition' },
  { id: 'path', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((s): s is HTMLElement => !!s)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <nav className={`nav${scrolled || open ? ' scrolled' : ''}${open ? ' open' : ''}`} aria-label="Main">
      <div className="wrap nav-in">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="mono-mark" aria-hidden="true">
            {person.initials}
          </span>
          {person.name}
        </a>
        <ul className="nav-links" id="nav-links">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn nav-cta" href="#contact">
          Let’s talk
        </a>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
