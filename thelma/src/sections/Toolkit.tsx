import { useRef } from 'react'
import { Chapter } from '../components/Chapter'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { skillGroups } from '../content/profile'
import './Toolkit.css'

export function Toolkit() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.js-chapter-line', {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        gsap.utils.toArray<HTMLElement>('.js-group').forEach((g) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 85%' } })
          tl.from(g.querySelector('.js-group-rule'), { scaleX: 0, duration: 1, ease: 'power3.inOut' })
            .from(g.querySelector('.tool__verb-inner'), { yPercent: 105, duration: 1.1, ease: 'expo.out' }, 0.1)
            .from(g.querySelectorAll('.tool__item'), { x: 24, opacity: 0, duration: 0.7, stagger: 0.05, ease: 'expo.out' }, 0.25)
            .from(g.querySelector('.tool__note'), { opacity: 0, duration: 0.8 }, 0.35)
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="toolkit" className="section toolkit" ref={root} aria-labelledby="toolkit-title">
      <div className="wrap">
        <Chapter n="05" label="Toolkit" />
        <div className="toolkit__head">
          <h2 id="toolkit-title" className="toolkit__heading serif">
            Skills, grouped by <em>what they’re for.</em>
          </h2>
          <p className="cap toolkit__legend">{skillGroups.map((g) => g.verb).join(' → ')}</p>
        </div>

        <ol className="tools">
          {skillGroups.map((g, i) => (
            <li className="tool js-group" key={g.verb}>
              <span className="rule js-group-rule tool__rule" />
              <span className="cap tool__n">0{i + 1}</span>
              <h3 className="tool__verb display">
                <span className="tool__verb-inner">{g.verb}</span>
              </h3>
              <p className="tool__note serif">
                <em>{g.note}</em>
              </p>
              <ul className="tool__items">
                {g.items.map((it) => (
                  <li className="tool__item" key={it.name}>
                    <span>{it.name}</span>
                    {it.detail && <span className="tool__detail cap">{it.detail}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
