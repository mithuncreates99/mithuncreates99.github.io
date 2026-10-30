import { useRef, useState } from 'react'
import { timeline } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { SectionHead } from './SectionHead'

const TODAY = (() => {
  const d = new Date()
  return d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365
})()

const pct = (v: number) => ((v - timeline.start) / (timeline.end - timeline.start)) * 100

type Tip = { x: number; y: number; label: string; when: string } | null

export function Timeline() {
  const ref = useRef<HTMLElement>(null)
  const [tip, setTip] = useState<Tip>(null)
  const today = Math.min(TODAY, timeline.end - 0.05)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const bars = gsap.utils.toArray<HTMLElement>('.tl-bar')
      // Desktop: the section pins and the playhead is scrubbed by scroll, growing each bar as it passes.
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '.tl-card', start: 'center center', end: '+=110%', scrub: 0.6, pin: ref.current, anticipatePin: 1 },
        })
        const travel = pct(today) / 100
        tl.fromTo('.tl-play', { left: '0%', opacity: 1 }, { left: `${pct(today)}%`, duration: travel }, 0)
        bars.forEach((b) => {
          const s = Number(b.dataset.start)
          const e = Number(b.dataset.end)
          const at = (pct(s) / 100)
          const len = Math.max((pct(e) - pct(s)) / 100, 0.01)
          tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: len }, at)
          tl.fromTo(b.querySelector('span'), { opacity: 0 }, { opacity: 1, duration: 0.02 }, at + len * 0.95)
        })
        tl.to('.tl-play', { opacity: 0, duration: 0.05 })
      })
      // Phones and tablets: no pinning. The bars grow in order while the chart pans
      // across the years to today, like a camera move.
      mm.add(`${MQ.motionOK} and (max-width: 900px)`, () => {
        const scroller = ref.current?.querySelector<HTMLElement>('.tl-scroll')
        gsap.set('.tl-play', { opacity: 0 })
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.tl-card', start: 'top 70%' } })
        tl.from(bars, { scaleX: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' })
        if (scroller) {
          tl.to(scroller, { scrollLeft: () => scroller.scrollWidth - scroller.clientWidth, duration: 2.4, ease: 'power2.inOut' }, 0.2)
        }
      })
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.tl-play', { opacity: 0 })
      })
      gsap.from('.tl-stats > div', { y: 20, opacity: 0, stagger: 0.08, duration: 0.8, scrollTrigger: { trigger: '.tl-card', start: 'top 85%' } })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const years: number[] = []
  for (let y = Math.ceil(timeline.start); y < timeline.end; y++) years.push(y)

  const show = (el: HTMLElement, label: string, when: string) => {
    const chart = el.closest('.tl-plot') as HTMLElement
    const r = el.getBoundingClientRect()
    const c = chart.getBoundingClientRect()
    setTip({ x: r.left - c.left + r.width / 2, y: r.top - c.top, label, when })
  }

  return (
    <section className="section tl-section" ref={ref} aria-labelledby="tl-h">
      <div className="wrap">
        <SectionHead n="05" label="Timeline" heading={timeline.heading} id="tl-h" />
        <div className="tl-card">
          <div className="tl-stats">
            {timeline.stats.map((s) => (
              <div key={s.k}>
                <small>{s.k}</small>
                <strong>{s.v}</strong>
                <span>{s.s}</span>
              </div>
            ))}
          </div>
          <div className="tl-scroll">
            <div className="tl-chart">
              <div className="tl-plot">
              <div className="tl-years" aria-hidden="true">
                {years.map((y) => (
                  <span key={y} style={{ left: `${pct(y)}%` }}>
                    {y}
                  </span>
                ))}
              </div>
              {years.map((y) => (
                <div className="tl-grid-line" key={y} style={{ left: `${pct(y)}%` }} aria-hidden="true" />
              ))}
              {timeline.lanes.map((lane) => {
                let below = false
                return (
                  <div className="tl-lane" key={lane.name}>
                    <b>{lane.name}</b>
                    {lane.bars.map((b) => {
                      const end = b.end ?? today
                      const width = pct(end) - pct(b.start)
                      const outside = width < (lane.name === 'Work' ? 16 : 9)
                      const kind = lane.name === 'Work' ? 'work' : lane.name === 'Education' ? '' : 'lead'
                      const cls = `tl-bar ${kind}${outside ? ` outside${below ? ' below' : ''}` : ''}`
                      if (outside) below = !below
                      return (
                        <div
                          key={b.label}
                          className={cls}
                          style={{ left: `${pct(b.start)}%`, width: `${width}%` }}
                          data-start={b.start}
                          data-end={end}
                          tabIndex={0}
                          role="img"
                          aria-label={`${lane.name}: ${'full' in b ? b.full : b.label}, ${b.when}`}
                          onPointerEnter={(e) => show(e.currentTarget, 'full' in b ? b.full : b.label, b.when)}
                          onPointerLeave={() => setTip(null)}
                          onFocus={(e) => show(e.currentTarget, 'full' in b ? b.full : b.label, b.when)}
                          onBlur={() => setTip(null)}
                        >
                          <span>
                            <i className="tl-long">{b.label}</i>
                            <i className="tl-short">{b.short}</i>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
              <div className="tl-today" style={{ left: `${pct(today)}%` }} aria-hidden="true" />
              <div className="tl-play" aria-hidden="true" />
              {tip && (
                <div className="tl-tip" style={{ left: tip.x, top: tip.y }} role="status">
                  {tip.label}
                  <small>{tip.when}</small>
                </div>
              )}
              </div>
            </div>
          </div>
          <p className="tl-hint" aria-hidden="true">
            Swipe the chart to move through the years →
          </p>
          <div className="tl-foot">
            <span>From Thelma’s CV · current role runs to today</span>
            <span className="tl-legend">
              <span>
                <i style={{ background: 'var(--wine-d)' }} />
                Education
              </span>
              <span>
                <i style={{ background: 'linear-gradient(90deg, var(--berry), var(--rose))' }} />
                Work
              </span>
              <span>
                <i style={{ background: 'var(--wine)' }} />
                Leadership
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
