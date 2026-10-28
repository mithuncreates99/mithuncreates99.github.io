import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { person } from '../content/profile'
import './Nav.css'

const LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'profile', label: 'Profile' },
  { id: 'record', label: 'Record' },
  { id: 'toolkit', label: 'Toolkit' },
] as const

const SECTION_IDS = ['top', 'frame', 'profile', 'work', 'record', 'toolkit', 'contact']

export function Nav() {
  const [active, setActive] = useState<string>('top')
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [onPaper, setOnPaper] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const { scrollY } = useScroll()

  // Hide on scroll down, show on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (menuOpen) return
    setHidden(y > 320 && y > prev + 4)
    if (y < prev - 4) setHidden(false)
  })

  // Active section + light/dark theme from what sits under the bar.
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === 'frame' ? 'top' : e.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))

    const paper = document.getElementById('contact')
    const io2 = new IntersectionObserver(([e]) => setOnPaper(e.isIntersecting), {
      rootMargin: '0px 0px -100% 0px',
    })
    if (paper) io2.observe(paper)
    return () => {
      io.disconnect()
      io2.disconnect()
    }
  }, [])

  // Mobile menu: Escape closes, focus returns to the button.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className="nav"
        data-scrolled={scrolled}
        data-theme={onPaper && !menuOpen ? 'paper' : 'ink'}
        initial={false}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="nav__inner wrap" aria-label="Primary">
          <a href="#top" className="nav__brand" aria-label={`${person.name}, back to top`}>
            <span className="nav__mono" aria-hidden="true">
              {person.initials}
            </span>
            <span className="nav__name">{person.name}</span>
          </a>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="nav__link" aria-current={active === l.id ? 'true' : undefined}>
                  {l.label}
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="nav__active"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <motion.a
            href="#contact"
            className="nav__cta"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          >
            <span className="dot" aria-hidden="true" />
            Contact
          </motion.a>

          <motion.button
            ref={menuButtonRef}
            type="button"
            className="nav__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            whileTap={{ scale: 0.92 }}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <motion.span
              className="nav__burger"
              aria-hidden="true"
              animate={menuOpen ? 'open' : 'closed'}
              initial={false}
            >
              <motion.i variants={{ closed: { rotate: 0, y: -4 }, open: { rotate: 45, y: 0 } }} />
              <motion.i variants={{ closed: { rotate: 0, y: 4 }, open: { rotate: -45, y: 0 } }} />
            </motion.span>
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mmenu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.ul
              className="mmenu__list"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } } }}
            >
              {[...LINKS, { id: 'contact', label: 'Contact' }].map((l, i) => (
                <motion.li
                  key={l.id}
                  variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={`#${l.id}`} className="mmenu__link display" onClick={() => setMenuOpen(false)}>
                    <span className="cap mmenu__n">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
            <p className="cap mmenu__foot">
              {person.location} — {person.availability}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
