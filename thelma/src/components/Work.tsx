import { useRef, useState } from 'react'
import { work, type Project } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { Art } from './Art'
import { SectionHead } from './SectionHead'

function ProjectRow({ p }: { p: Project }) {
  const [open, setOpen] = useState(false)
  const id = `details-${p.id}`
  return (
    <article className="project" data-project>
      <div className="art-panel">
        <Art kind={p.art} />
      </div>
      <div className="p-copy">
        <p className="p-kicker">{p.kicker}</p>
        <h3 className="p-title">{p.title}</h3>
        <p className="p-lead">{p.lead}</p>
        <div className="p-stats">
          {p.stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="chips">
          {p.chips.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div className="details">
          <button className="details-btn" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
            <i aria-hidden="true" /> {open ? 'Hide details' : 'Case details'}
          </button>
          <div className={`details-body${open ? ' open' : ''}`} id={id} inert={!open}>
            <div>
              <ul>
                {p.details.map((d) => (
                  <li key={d.slice(0, 24)}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function Work() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('[data-project]').forEach((row) => {
          const panel = row.querySelector('.art-panel')
          const copy = row.querySelectorAll('.p-kicker, .p-title, .p-lead, .p-stats > div, .chips, .details')
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 78%' } })
            .from(panel, { clipPath: 'inset(12% 12% 12% 12% round 18px)', opacity: 0, duration: 1.2, ease: 'expo.out' })
            .from(copy, { y: 26, opacity: 0, stagger: 0.07, duration: 0.8 }, 0.15)
        })
      })
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        gsap.utils.toArray<HTMLElement>('.art-panel').forEach((panel) => {
          gsap.fromTo(panel, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section className="section" id="work" ref={ref} aria-labelledby="work-h">
      <div className="wrap">
        <SectionHead n="03" label="Selected work" heading={work.heading} sub={work.sub} id="work-h" />
        <div className="projects">
          {work.projects.map((p) => (
            <ProjectRow p={p} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
