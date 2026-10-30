import { useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { education, person } from '../content/profile'
import p760 from '../assets/img/portrait-760.webp'
import p1300 from '../assets/img/portrait-1300.webp'
import './Hero.css'

function Chars({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span className="hero__char" key={i}>
          {c}
        </span>
      ))}
    </>
  )
}

function NameLines() {
  return (
    <>
      {person.nameLines.map((line, i) => (
        <span className={`hero__line hero__line--${i + 1}`} key={line}>
          <Chars text={line} />
        </span>
      ))}
    </>
  )
}

const fontsReady = () =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1400))])

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motionOK, () => {
        gsap.set('.hero__char', { yPercent: 118 })
        gsap.set('.js-arch', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 0 0)' })
        gsap.set('.js-arch-img', { scale: 1.16 })
        gsap.set('.hero__name--outline', { opacity: 0 })
        gsap.set('.js-cap, .js-fade', { opacity: 0, y: 16 })
        gsap.set('.js-rule', { scaleX: 0 })
        gsap.set('.js-note', { opacity: 0, x: -10 })
        gsap.set('.js-ring', { scale: 0.6, opacity: 0 })

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
        tl.to('.js-rule', { scaleX: 1, duration: 1.3, ease: 'power3.inOut' })
          .to('.js-cap', { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, '-=0.9')
          .to('.js-arch', { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', duration: 1.7, ease: 'expo.inOut' }, '-=0.6')
          .to('.js-arch-img', { scale: 1, duration: 2.2 }, '<0.2')
          .to('.js-ring', { scale: 1, opacity: 1, duration: 1.6, stagger: 0.12 }, '<0.3')
          .to('.hero__line--1 .hero__char', { yPercent: 0, duration: 1.2, stagger: 0.045 }, '<-0.6')
          .to('.hero__line--2 .hero__char', { yPercent: 0, duration: 1.2, stagger: 0.045 }, '<0.12')
          .to('.hero__line--3 .hero__char', { yPercent: 0, duration: 1.2, stagger: 0.045 }, '<0.12')
          .to('.hero__name--outline', { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.9')
          .to('.js-fade', { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, '-=1.1')
          .to('.js-note', { opacity: 1, x: 0, duration: 0.8, stagger: 0.12 }, '-=0.8')

        let alive = true
        fontsReady().then(() => {
          if (alive) tl.play()
        })

        const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to('.js-arch-inner', { yPercent: 10, ease: 'none', scrollTrigger: scrub })
        gsap.to('.js-ring', { scale: 1.12, ease: 'none', scrollTrigger: scrub })
        gsap.to('.hero__line--1', { xPercent: -5, ease: 'none', scrollTrigger: scrub })
        gsap.to('.hero__line--3', { xPercent: 5, ease: 'none', scrollTrigger: scrub })
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

      <div className="hero__stage wrap">
        <h1 id="hero-title" className="hero__title">
          <span className="sr-only">
            {person.name} — {person.role}. {person.focus}.
          </span>
          <span className="hero__name hero__name--solid display" aria-hidden="true">
            <NameLines />
          </span>
        </h1>

        <figure className="hero__arch-wrap">
          <span className="hero__ring hero__ring--1 js-ring" aria-hidden="true" />
          <span className="hero__ring hero__ring--2 js-ring" aria-hidden="true" />
          <div className="hero__arch js-arch">
            <div className="hero__arch-inner js-arch-inner">
              <img
                className="js-arch-img"
                src={p1300}
                srcSet={`${p760} 760w, ${p1300} 1300w`}
                sizes="(max-width: 899px) 86vw, 36vw"
                width={1300}
                height={1733}
                alt={`Portrait of ${person.name}, smiling, framed by round arches`}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
          <figcaption className="cap hero__figcap js-note">
            <span className="hero__note-line" aria-hidden="true" />
            Fig. 00 — {person.initials.split('').join('.')}.
          </figcaption>
        </figure>

        <div className="hero__name hero__name--outline display outline" aria-hidden="true">
          <NameLines />
        </div>

        <p className="cap hero__note hero__note--b js-note" aria-hidden="true">
          Research → Automation → Operations
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
            <dt className="cap">Role</dt>
            <dd>{person.role}</dd>
          </div>
          <div>
            <dt className="cap">Focus</dt>
            <dd>{person.focus}</dd>
          </div>
          <div>
            <dt className="cap">Degree</dt>
            <dd>
              B.Tech CSBS · GPA {education.gpa.replace(' / ', '/')}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
