import { useRef } from 'react'
import { contact, hero, person } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { Arrow, ArrowUpRight, LinkedIn, Mail } from './Icons'
import portrait900 from '../assets/img/thelma-cutout-900.webp'
import portrait560 from '../assets/img/thelma-cutout-560.webp'

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null)

  // Entrance: plays once the opening curtain hands over.
  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
        tl.from('.hero-glow', { opacity: 0, scale: 0.7, duration: 2, ease: 'power2.out' }, 0)
          .from('.arch-frame', { clipPath: 'inset(48% 0 48% 0 round 999px 999px 26px 26px)', duration: 1.4, ease: 'expo.inOut' }, 0)
          .from('.arch img', { scale: 1.25, filter: 'blur(12px) saturate(0.6)', duration: 1.3, clearProps: 'filter' }, 0.15)
          .fromTo('.arch-sheen', { xPercent: -120 }, { xPercent: 260, duration: 1.6, ease: 'power2.inOut' }, 0.9)
          .from('.orbit', { opacity: 0, scale: 0.85, duration: 1.6 }, 0.3)
          .from('.hero-chip', { y: 18, opacity: 0, duration: 0.9 }, 0.35)
          .from('.hero-kicker', { y: 14, opacity: 0, duration: 0.8 }, 0.45)
          .from('.hero-name .line > span', { yPercent: 110, duration: 1.2, stagger: 0.11 }, 0.5)
          .from('.hero-intro', { y: 22, opacity: 0, duration: 1 }, 0.95)
          .from('.hero-ctas > *, .hero-social', { y: 16, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.1)
          .from('.float-card', { y: 26, opacity: 0, scale: 0.92, duration: 1, stagger: 0.18, ease: 'back.out(1.6)' }, 1.1)
          .from('.bracket, .fig, .scroll-cue', { opacity: 0, duration: 1, stagger: 0.08 }, 1.3)
      })
      return () => mm.revert()
    },
    { scope: ref, dependencies: [ready] },
  )

  // Scroll: the copy lifts away while the portrait drifts and grows, like a camera push.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
        gsap.to('.hero-copy', { y: -120, opacity: 0.15, ease: 'none', scrollTrigger: st })
        gsap.to('.arch-frame', { y: 60, scale: 1.06, ease: 'none', scrollTrigger: st })
        gsap.to('.arch img', { yPercent: -6, ease: 'none', scrollTrigger: st })
        gsap.to('.float-card.a', { y: -110, ease: 'none', scrollTrigger: st })
        gsap.to('.float-card.b', { y: -40, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-glow', { y: 180, scale: 1.2, ease: 'none', scrollTrigger: st })
        gsap.to('.hero-grid', { yPercent: 12, ease: 'none', scrollTrigger: st })
      })
      // Pointer: the frame tilts toward the cursor.
      mm.add(`${MQ.motionOK} and ${MQ.fine}`, () => {
        const frame = ref.current?.querySelector<HTMLElement>('.hero-visual')
        if (!frame) return
        gsap.set(frame, { transformPerspective: 1000 })
        const rx = gsap.quickTo(frame, 'rotationX', { duration: 0.8, ease: 'power3' })
        const ry = gsap.quickTo(frame, 'rotationY', { duration: 0.8, ease: 'power3' })
        const ca = gsap.quickTo('.float-card.a', 'x', { duration: 1, ease: 'power3' })
        const cb = gsap.quickTo('.float-card.b', 'x', { duration: 1, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          const px = e.clientX / window.innerWidth - 0.5
          const py = e.clientY / window.innerHeight - 0.5
          ry(px * 7)
          rx(-py * 5)
          ca(px * -18)
          cb(px * 22)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-name">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="hero-chip">
            <i aria-hidden="true" />
            {person.roles}
          </p>
          <p className="eyebrow hero-kicker">{person.kicker}</p>
          <h1 className="hero-name" id="hero-name">
            {person.nameLines.map((l) => (
              <span className="line" key={l}>
                <span>{l}</span>
              </span>
            ))}
            <span className="line last">
              <span>{person.nameLast}</span>
            </span>
          </h1>
          <p className="hero-intro">
            {hero.introBefore}
            <em>{hero.introEm}</em>
            {hero.introAfter}
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#work">
              Explore my work <Arrow />
            </a>
            <a className="btn" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              View LinkedIn <ArrowUpRight />
            </a>
          </div>
          <div className="hero-social">
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedIn /> LinkedIn
            </a>
            <a href={`mailto:${contact.email}`}>
              <Mail /> {contact.email}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit" aria-hidden="true">
            <div className="orbit-spin">
              <span className="orbit-dot" />
            </div>
          </div>
          <div className="arch-frame">
            <div className="arch">
              <img
                src={portrait900}
                srcSet={`${portrait560} 560w, ${portrait900} 900w`}
                sizes="(max-width: 900px) 80vw, 470px"
                width={900}
                height={1039}
                alt={`Portrait of ${person.name}`}
                fetchPriority="high"
              />
              <div className="arch-sheen" aria-hidden="true" />
            </div>
            <span className="bracket tl" aria-hidden="true" />
            <span className="bracket br" aria-hidden="true" />
          </div>
          {hero.badges.map((b, i) => (
            <div className={`float-card ${i === 0 ? 'a' : 'b'}`} key={b.k}>
              <small>{b.k}</small>
              <strong>{b.v}</strong>
            </div>
          ))}
          <div className="fig" aria-hidden="true">
            <span>Fig. 01</span>
            <span>{hero.figCaption}</span>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#about" aria-label="Scroll to About">
        SCROLL
        <i />
      </a>
    </section>
  )
}
