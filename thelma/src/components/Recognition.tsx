import { useRef } from 'react'
import { recognition } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

export function Recognition() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.rec-card', { y: 50, opacity: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.rec', start: 'top 80%' } })
        gsap.utils.toArray<HTMLElement>('.rec-mark').forEach((m) => {
          gsap.fromTo(m, { x: 30 }, { x: -30, ease: 'none', scrollTrigger: { trigger: m.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section className="section" id="recognition" ref={ref} aria-labelledby="rec-h">
      <div className="wrap">
        <SectionHead n="05" label="Recognition" heading={recognition.heading} id="rec-h" />
        <div className="rec">
          {recognition.cards.map((c) => (
            <article className={`rec-card ${c.size}`} key={c.title}>
              <span className="rec-mark" aria-hidden="true">
                {c.mark}
              </span>
              <small>{c.kicker}</small>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {c.pills && (
                <div className="rec-pills">
                  {c.pills.map((p) => (
                    <div key={p.k}>
                      <small>{p.k}</small>
                      <strong>{p.v}</strong>
                      <span>{p.s}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
