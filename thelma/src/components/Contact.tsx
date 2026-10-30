import { useRef, useState } from 'react'
import { contact, contactSection, person } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { ArrowUpRight, Copy, LinkedIn, Mail, Pin } from './Icons'

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const [before, em] = contactSection.heading

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: '.contact-h', start: 'top 82%' } })
          .from('.contact .eyebrow', { opacity: 0, y: 12, duration: 0.6 })
          .from('.contact-h .line > span', { yPercent: 110, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, 0.1)
          .from('.contact-text, .contact-actions', { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.5)
          .from('.link-card', { y: 24, opacity: 0, stagger: 0.08, duration: 0.8 }, 0.7)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      const r = document.createRange()
      const el = document.getElementById('contact-email')
      if (el) {
        r.selectNodeContents(el)
        window.getSelection()?.removeAllRanges()
        window.getSelection()?.addRange(r)
      }
    }
  }

  return (
    <section className="section contact" id="contact" ref={ref} aria-labelledby="contact-h">
      <div className="wrap">
        <p className="eyebrow">
          <b>07</b> Contact
        </p>
        <h2 className="contact-h" id="contact-h">
          <span className="line">
            <span>{before}</span>
          </span>
          <span className="line">
            <span className="em">{em}</span>
          </span>
        </h2>
        <p className="contact-text">{contactSection.text}</p>
        <div className="contact-actions">
          <a className="btn btn-primary" href={`mailto:${contact.email}`}>
            <Mail /> <span id="contact-email">{contact.email}</span>
          </a>
          <button className="btn" type="button" onClick={copy}>
            <Copy /> Copy email
          </button>
          <span className="copied" role="status" aria-live="polite">
            {copied ? 'Copied' : ''}
          </span>
        </div>
        <div className="links">
          <a className="link-card" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedIn />
            <div>
              <strong>LinkedIn</strong>
              <span>{contact.linkedinLabel}</span>
            </div>
            <ArrowUpRight className="arrow" />
          </a>
          <a className="link-card" href={`mailto:${contact.email}`}>
            <Mail />
            <div>
              <strong>Email</strong>
              <span>{contact.email}</span>
            </div>
            <ArrowUpRight className="arrow" />
          </a>
          <div className="link-card">
            <Pin />
            <div>
              <strong>{person.location}</strong>
              <span>{person.reach}</span>
            </div>
          </div>
        </div>
        <p className="interests">{contactSection.interests}</p>
      </div>
    </section>
  )
}
