import { useRef } from 'react'
import { about } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

export function About() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.principles li', { y: 24, opacity: 0, stagger: 0.12, duration: 0.9, scrollTrigger: { trigger: '.principles', start: 'top 80%' } })
        gsap.from('.facts > div', { y: 20, opacity: 0, stagger: 0.08, duration: 0.7, scrollTrigger: { trigger: '.facts', start: 'top 85%' } })
        gsap.fromTo('.ms-list', { '--draw': 0 }, { '--draw': 1, ease: 'none', scrollTrigger: { trigger: '.ms-list', start: 'top 80%', end: 'bottom 60%', scrub: 0.5 } })
        gsap.from('.ms-list li', { y: 12, opacity: 0, stagger: 0.09, duration: 0.6, scrollTrigger: { trigger: '.ms-list', start: 'top 80%' } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section className="section about" id="about" ref={ref} aria-labelledby="about-h">
      <div className="glow-bg" aria-hidden="true" />
      <div className="wrap">
        <SectionHead n="01" label="About" heading={about.heading} id="about-h" />
        <div className="about-grid">
          <div className="about-body" data-reveal>
            <p className="about-lead">
              {about.leadBefore}
              <span className="em">{about.leadEm}</span>
              {about.leadAfter}
            </p>
            {about.body.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>
          <ul className="principles">
            {about.principles.map((p) => (
              <li key={p.n}>
                <span className="n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-lower">
          <dl className="facts">
            {about.facts.map((f) => (
              <div key={f.k}>
                <dt>{f.k}</dt>
                <dd className={f.big ? 'big' : undefined}>{f.v}</dd>
              </div>
            ))}
          </dl>
          <div className="milestones">
            <h3 className="eyebrow">Milestones</h3>
            <ol className="ms-list">
              {about.milestones.map((m) => (
                <li key={m.when}>
                  <time>{m.when}</time>
                  <p>{m.what}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
