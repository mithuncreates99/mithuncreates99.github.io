import { useRef, type PointerEvent } from 'react'
import { toolkit } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

export function Toolkit() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.tool', { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, scrollTrigger: { trigger: '.bento', start: 'top 80%' } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <section className="section" id="skills" ref={ref} aria-labelledby="skills-h">
      <div className="wrap">
        <SectionHead n="04" label="Toolkit" heading={toolkit.heading} sub={toolkit.sub} id="skills-h" />
        <div className="bento">
          {toolkit.groups.map((g) => (
            <article className={`tool${g.wide ? ' wide' : ''}`} key={g.n} onPointerMove={onMove}>
              <h3 className="tool-h">
                <span>{g.n}</span>
                {g.name}
              </h3>
              <p className="tool-big">
                {g.big.map((b) => (
                  <b key={b}>{b}</b>
                ))}
              </p>
              <p className="tool-mid">
                {g.mid.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </p>
              <p className="tool-note">{g.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
