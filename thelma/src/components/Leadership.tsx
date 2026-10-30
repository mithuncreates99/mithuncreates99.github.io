import { useRef, type CSSProperties } from 'react'
import { leadership } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

/** Path the climber dot takes along the top edge of each step, in % of the ladder box. */
const climbPoints = (hs: number[]) => {
  const pts: { x: number; y: number }[] = []
  const w = 100 / hs.length
  hs.forEach((h, i) => {
    pts.push({ x: i * w, y: 100 - h })
    pts.push({ x: (i + 1) * w, y: 100 - h })
  })
  return pts
}

export function Leadership() {
  const ref = useRef<HTMLElement>(null)
  const { ladder } = leadership

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        // Steps rise one after another, then the climber walks up them with the scroll.
        gsap
          .timeline({ scrollTrigger: { trigger: '.ladder', start: 'top 80%' } })
          .from('.step', { scaleY: 0, duration: 1, stagger: 0.18, ease: 'power3.out' })
          .from('.step-text', { opacity: 0, y: 12, duration: 0.6, stagger: 0.18 }, 0.4)
          .from('.ladder-axis span', { opacity: 0, duration: 0.5, stagger: 0.1 }, 0.3)

        const pts = climbPoints(ladder.steps.map((s) => s.h))
        const dot = ref.current?.querySelector<HTMLElement>('.climber')
        if (dot) {
          gsap.set(dot, { left: `${pts[0].x}%`, top: `${pts[0].y}%` })
          const walk = gsap.timeline({
            scrollTrigger: { trigger: '.ladder-wrap', start: 'top 65%', end: 'bottom 35%', scrub: 0.8 },
          })
          pts.slice(1).forEach((p) => walk.to(dot, { left: `${p.x}%`, top: `${p.y}%`, ease: 'none', duration: 1 }))
        }
        gsap.from('.lead-role', { y: 24, opacity: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.lead-roles', start: 'top 82%' } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section className="section leadership" id="leadership" ref={ref} aria-labelledby="lead-h">
      <div className="wrap">
        <SectionHead n="06" label={leadership.label} heading={leadership.heading} sub={leadership.sub} id="lead-h" />
        <div className="lead-grid">
          <figure className="ladder-card">
            <figcaption className="ladder-head">
              <span className="ladder-org">{ladder.org}</span>
              <span className="ladder-note">{ladder.note}</span>
            </figcaption>
            <div className="ladder-wrap">
              <ol className="ladder" aria-label={`${ladder.org}: three roles in three years`}>
                {ladder.steps.map((s, i) => (
                  <li className="step-col" key={s.role}>
                    <div className="step" style={{ '--h': s.h } as CSSProperties} data-top={i === ladder.steps.length - 1 || undefined}>
                      <div className="step-text">
                        <span className="step-n">0{i + 1}</span>
                        <strong>{s.role}</strong>
                        <time>{s.when}</time>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <span className="climber" aria-hidden="true" />
            </div>
            <div className="ladder-axis" aria-hidden="true">
              {ladder.steps.map((s) => (
                <span key={s.when}>{s.when.replace(' – 20', '–')}</span>
              ))}
            </div>
          </figure>

          <div className="lead-roles">
            <p className="eyebrow">Also</p>
            <ul>
              {leadership.roles.map((r) => (
                <li className="lead-role" key={r.org}>
                  <time>{r.when}</time>
                  <strong>{r.role}</strong>
                  <span className="org">{r.org}</span>
                  {r.note && <span className="note">{r.note}</span>}
                </li>
              ))}
            </ul>
            <p className="lead-also">{leadership.also}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
