import { useRef } from 'react'
import { path } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

export function Path() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.fromTo('.rail', { '--draw': 0 }, { '--draw': 1, ease: 'none', scrollTrigger: { trigger: '.rail', start: 'top 75%', end: 'bottom 70%', scrub: 0.5 } })
        gsap.utils.toArray<HTMLElement>('.job').forEach((j) => {
          gsap.from(j, { y: 24, opacity: 0, duration: 0.8, scrollTrigger: { trigger: j, start: 'top 85%' } })
        })
        gsap.from('.certs dl > div', { y: 16, opacity: 0, stagger: 0.07, duration: 0.6, scrollTrigger: { trigger: '.certs', start: 'top 80%' } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  const count = path.certifications.reduce((n, c) => n + c.items.length, 0)
  return (
    <section className="section" id="path" ref={ref} aria-labelledby="path-h">
      <div className="wrap">
        <SectionHead n="06" label="Experience & education" heading={path.heading} id="path-h" />
        <div className="path-grid">
          <div className="rail">
            <p className="rail-h">Experience</p>
            {path.experience.map((j) => (
              <div className="job" key={j.role}>
                <time>{j.when}</time>
                <h3>{j.role}</h3>
                <p className="org">{j.org}</p>
                <ul>
                  {j.points.map((p) => (
                    <li key={p.slice(0, 24)}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="rail-h">Education</p>
            {path.education.map((e) => (
              <div className="job" key={e.role}>
                <time>{e.when}</time>
                <h3>{e.role}</h3>
                <p className="org">{e.org}</p>
                {e.tag && <span className="chip tag">{e.tag}</span>}
              </div>
            ))}
          </div>
          <div className="certs">
            <h3>
              Certifications<sup>{count}</sup>
            </h3>
            <dl>
              {path.certifications.map((c) => (
                <div key={c.issuer}>
                  <dt>{c.issuer}</dt>
                  {c.items.map((i) => (
                    <dd key={i}>{i}</dd>
                  ))}
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
