import { useRef } from 'react'
import { stats } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'

const fmt = (v: number, d = 0) => v.toFixed(d)

export function Stats() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('.stat strong [data-count]').forEach((el) => {
          const target = Number(el.dataset.count)
          const d = Number(el.dataset.decimals ?? 0)
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onUpdate: () => {
              el.textContent = fmt(obj.v, d)
            },
          })
        })
        gsap.from('.stat', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <section className="stats" ref={ref} aria-label="Key figures">
      <div className="wrap stats-in">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <strong>
              <span data-count={s.value} data-decimals={s.decimals ?? 0}>
                {fmt(s.value, s.decimals ?? 0)}
              </span>
              {s.suffix ?? ''}
            </strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
