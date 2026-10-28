import { motion } from 'framer-motion'
import { contact, displayUrl } from '../content/contact'
import { person, siteYear } from '../content/profile'
import './Footer.css'

export function Footer() {
  const links = [
    contact.linkedin && { label: 'LinkedIn', href: contact.linkedin },
    contact.github && { label: 'GitHub', href: contact.github },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <p className="cap">
          © {siteYear} {person.name}
        </p>
        <ul className="footer__links">
          {links.map((l) => (
            <li key={l.href}>
              <a className="cap text-link" href={l.href} target="_blank" rel="noreferrer" title={displayUrl(l.href)}>
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <motion.a
          href="#top"
          className="cap footer__top"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          Back to top ↑
        </motion.a>
      </div>
    </footer>
  )
}
