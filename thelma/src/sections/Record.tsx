import { useRef } from 'react'
import { Chapter, Words } from '../components/Chapter'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { certifications, education, leadership } from '../content/profile'
import './Record.css'

export function Record() {
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
        gsap.from('.record__heading .word__inner', {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.record__heading', start: 'top 85%' },
        })
        gsap.utils.toArray<HTMLElement>('.js-row').forEach((row) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%' } })
          tl.from(row.querySelector('.js-row-rule'), { scaleX: 0, duration: 1, ease: 'power3.inOut' }).from(
            row.querySelectorAll('.js-row-in'),
            { y: 28, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' },
            0.15,
          )
        })
        gsap.utils.toArray<HTMLElement>('.js-medal').forEach((m) => {
          gsap.from(m, {
            scale: 0,
            rotate: -90,
            duration: 1.1,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: m, start: 'top 88%' },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="record" className="section record" ref={root} aria-labelledby="record-title">
      <div className="wrap">
        <Chapter n="04" label="The record" />

        <h2 id="record-title" className="record__heading serif">
          <Words text="Learning and leading," />{' '}
          <em>
            <Words text="on campus and off." />
          </em>
        </h2>

        <div className="record__block">
          <h3 className="cap record__block-title">Leadership & activities</h3>
          <ol className="awards">
            {leadership.map((a) => (
              <li className="award js-row" key={a.title}>
                <span className="rule js-row-rule award__rule" />
                <span className={`award__medal award__medal--${a.tone} js-medal`} aria-hidden="true" />
                <span className="award__mark display js-row-in">{a.mark}</span>
                <div className="award__body js-row-in">
                  <p className="award__title">{a.title}</p>
                  <p className="award__detail">{a.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="record__split">
          <div className="record__block">
            <h3 className="cap record__block-title">Education</h3>
            <article className="entry js-row">
              <span className="rule js-row-rule" />
              <p className="cap entry__date js-row-in">{education.dates}</p>
              <h4 className="entry__title js-row-in">{education.school}</h4>
              <p className="entry__role js-row-in">
                {education.degree} · GPA {education.gpa}
              </p>
              <ul className="grades js-row-in" aria-label="Relevant coursework">
                {education.coursework.map((c) => (
                  <li key={c.name}>
                    <span>{c.name}</span>
                    {c.grade && <span className="grades__mark">{c.grade}</span>}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="record__block">
            <h3 className="cap record__block-title">Certifications</h3>
            {certifications.map((c) => (
              <article className="entry entry--compact js-row" key={c.name}>
                <span className="rule js-row-rule" />
                <h4 className="entry__title entry__title--sm js-row-in">{c.name}</h4>
                <p className="cap js-row-in">{c.issuer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
