import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { person } from '../content/profile'
import cut720 from '../assets/img/portrait-cutout-720.webp'
import cut1280 from '../assets/img/portrait-cutout-1280.webp'
import './Hero.css'

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span className="hero__char" key={i}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </>
  )
}

function NameLines() {
  return (
    <>
      <span className="hero__line hero__line--1">
        <Chars text={person.firstName} />
      </span>
      <span className="hero__line hero__line--2">
        <Chars text={person.lastName} />
      </span>
    </>
  )
}

const fontsReady = () =>
  Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 1400)),
  ])

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motionOK, () => {
        gsap.set('.hero__char', { yPercent: 118 })
        gsap.set('.js-portrait', { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set('.js-portrait-img', { scale: 1.14 })
        gsap.set('.hero__name--outline', { opacity: 0 })
        gsap.set('.js-cap, .js-fade', { opacity: 0, y: 16 })
        gsap.set('.js-rule', { scaleX: 0 })
        gsap.set('.js-note', { opacity: 0, x: -10 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        tl.to('.js-rule', { scaleX: 1, duration: 1.3, ease: 'power3.inOut', stagger: 0.1 })
          .to('.js-cap', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.9')
          .to('.hero__line--1 .hero__char', { yPercent: 0, duration: 1.25, stagger: 0.05 }, '-=0.55')
          .to('.hero__line--2 .hero__char', { yPercent: 0, duration: 1.25, stagger: 0.05 }, '<0.14')
          .to('.js-portrait', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, '<-0.3')
          .to('.js-portrait-img', { scale: 1, duration: 2.2 }, '<0.2')
          .to('.hero__name--outline', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1.4')
          .to('.js-fade', { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, '-=1.5')
          .to('.js-note', { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 }, '-=0.9')

        let alive = true
        fontsReady().then(() => {
          if (alive) tl.play()
        })

        // Scroll: the cover comes apart as you leave it.
        const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to('.js-portrait-inner', { yPercent: 12, ease: 'none', scrollTrigger: scrub })
        gsap.to('.hero__line--1', { xPercent: -7, ease: 'none', scrollTrigger: scrub })
        gsap.to('.hero__line--2', { xPercent: 7, ease: 'none', scrollTrigger: scrub })
        gsap.to('.js-hero-bottom', { opacity: 0, y: -50, ease: 'none', scrollTrigger: { ...scrub, end: '45% top' } })

        return () => {
          alive = false
          tl.kill()
        }
      })
    },
    { scope: root },
  )

  return (
    <section id="top" className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hero__backlight" aria-hidden="true" />

      <div className="hero__top wrap">
        <p className="cap js-cap">Portfolio — Edition 2026</p>
        <p className="cap js-cap hero__top-mid">N° 01 · {person.location}</p>
        <p className="cap js-cap hero__top-end">
          <span className="dot" aria-hidden="true" />
          {person.availability}
        </p>
      </div>
      <div className="wrap">
        <div className="rule js-rule" />
      </div>

      <h1 id="hero-title" className="hero__title">
        <span className="sr-only">
          {person.name} — {person.role}, {person.focus}
        </span>
        <span className="hero__name hero__name--solid display" aria-hidden="true">
          <NameLines />
        </span>
      </h1>

      <figure className="hero__portrait js-portrait">
        <div className="hero__portrait-inner js-portrait-inner">
          <img
            className="js-portrait-img"
            src={cut1280}
            srcSet={`${cut720} 720w, ${cut1280} 1280w`}
            sizes="(max-width: 899px) 90vw, 46vw"
            width={1280}
            height={1891}
            alt={`Portrait of ${person.name} on the NEOMA Business School campus in Rouen`}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </figure>

      <div className="hero__name hero__name--outline display outline" aria-hidden="true">
        <NameLines />
      </div>

      <div className="hero__notes" aria-hidden="true">
        <p className="cap hero__note hero__note--a js-note">
          <span className="hero__note-line" />
          Fig. 00 — NEOMA, Rouen campus
        </p>
        <p className="cap hero__note hero__note--b js-note">
          B.Tech IT → MiM
          <span className="hero__note-line" />
        </p>
      </div>

      <div className="hero__bottom wrap js-hero-bottom">
        <div className="hero__lead">
          <p className="hero__lead-text js-fade">{person.lead}</p>
          <div className="hero__ctas js-fade">
            <motion.a
              href="#work"
              className="btn btn--solid"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              See the work
              <span aria-hidden="true">↓</span>
            </motion.a>
            <motion.a
              href="#contact"
              className="btn btn--ghost"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              Let’s collaborate
            </motion.a>
          </div>
        </div>

        <dl className="hero__facts js-fade">
          <div>
            <dt className="cap">Studying</dt>
            <dd>{person.role}</dd>
          </div>
          <div>
            <dt className="cap">Focus</dt>
            <dd>{person.focus}</dd>
          </div>
          <div>
            <dt className="cap">School</dt>
            <dd>{person.school}</dd>
          </div>
        </dl>
      </div>

      <div className="hero__scroll cap js-fade" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
