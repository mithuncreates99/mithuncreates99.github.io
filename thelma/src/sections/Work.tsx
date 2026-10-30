import { useRef, type JSX } from 'react'
import { Chapter } from '../components/Chapter'
import { AssetsDiagram, AutomationDiagram, DisputesDiagram } from '../components/Diagrams'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/motion'
import { caseFiles, type CaseFile } from '../content/profile'
import './Work.css'

const DIAGRAMS: Record<CaseFile['diagram'], () => JSX.Element> = {
  assets: AssetsDiagram,
  automation: AutomationDiagram,
  disputes: DisputesDiagram,
}

function FilePanel({ f, total }: { f: CaseFile; total: number }) {
  const Diagram = DIAGRAMS[f.diagram]
  return (
    <article className="file js-file" aria-labelledby={`file-${f.id}`}>
      <div className="file__copy">
        <p className="cap file__meta">
          <span className="file__n">
            Case file {f.n} / 0{total}
          </span>
          <span>{f.dates}</span>
        </p>
        <span className="file__num display outline" aria-hidden="true">
          {f.n}
        </span>
        <h3 id={`file-${f.id}`} className="file__title display">
          {f.org}
        </h3>
        <p className="cap file__context">
          {f.title} · {f.place}
        </p>
        <p className="file__summary">{f.summary}</p>
        <ul className="file__points">
          {f.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="file__tools">
          <span className="cap">Tools</span> {f.tools.join(' / ')}
        </p>
      </div>
      <div className="file__visual">
        <Diagram />
      </div>
    </article>
  )
}

export function Work() {
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
        gsap.from('.work__heading .word__inner', {
          yPercent: 105,
          duration: 1.2,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.work__heading', start: 'top 85%' },
        })
      })

      // Horizontal case files on wide screens with motion allowed.
      mm.add(`${MQ.motionOK} and ${MQ.desktop}`, () => {
        const track = root.current?.querySelector<HTMLElement>('.files__track')
        const pin = root.current?.querySelector<HTMLElement>('.files')
        if (!track || !pin) return
        const distance = () => track.scrollWidth - window.innerWidth
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        gsap.utils.toArray<HTMLElement>('.js-file').forEach((file) => {
          const paths = file.querySelectorAll('.draw')
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
          const tl = gsap.timeline({
            scrollTrigger: { trigger: file, containerAnimation: tween, start: 'left 70%' },
          })
          tl.to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: 'power2.inOut' })
            .from(
              file.querySelectorAll('.dg-node'),
              { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.6, ease: 'back.out(2)' },
              0.2,
            )
            .from(file.querySelector('.file__num'), { xPercent: -30, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0)
        })
        return () => tween.scrollTrigger?.kill()
      })

      // Stacked version (narrow screens): draw diagrams as they scroll in.
      mm.add(`${MQ.motionOK} and (max-width: 899px)`, () => {
        gsap.utils.toArray<HTMLElement>('.js-file').forEach((file) => {
          const paths = file.querySelectorAll('.draw')
          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: file.querySelector('.file__visual'), start: 'top 85%' },
          })
        })
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      return () => window.removeEventListener('load', refresh)
    },
    { scope: root },
  )

  return (
    <section id="work" className="work" ref={root} aria-labelledby="work-title">
      <div className="wrap section work__intro">
        <Chapter n="03" label="Case files" />
        <div className="work__head">
          <h2 id="work-title" className="work__heading serif">
            <span className="word">
              <span className="word__inner">Three</span>
            </span>{' '}
            <span className="word">
              <span className="word__inner">roles,</span>
            </span>{' '}
            <em>
              <span className="word">
                <span className="word__inner">told</span>
              </span>{' '}
              <span className="word">
                <span className="word__inner">as</span>
              </span>{' '}
              <span className="word">
                <span className="word__inner">case</span>
              </span>{' '}
              <span className="word">
                <span className="word__inner">files.</span>
              </span>
            </em>
          </h2>
          <p className="cap work__count">Market research · Process automation · Operations</p>
        </div>
      </div>

      <div className="files">
        <div className="files__track">
          <div className="files__lead">
            <p className="cap">2023 → today</p>
            <p className="files__lead-title display">
              On
              <br />
              <span className="outline">file</span>
            </p>
            <p className="files__lead-note">
              Each role, what she owned in it, and how the work flowed.
            </p>
            <span className="files__arrow cap" aria-hidden="true">
              Scroll →
            </span>
          </div>
          {caseFiles.map((f) => (
            <FilePanel key={f.id} f={f} total={caseFiles.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
