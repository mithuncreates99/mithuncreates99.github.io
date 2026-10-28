import { useRef, type JSX } from 'react'
import { motion } from 'framer-motion'
import { Chapter } from '../components/Chapter'
import { Flashlight } from '../components/Flashlight'
import { JourneyDiagram, LoopDiagram, PatientDiagram } from '../components/Diagrams'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/motion'
import { caseFiles, tellMe, type CaseFile } from '../content/profile'
import today from '../assets/img/tellme-today.webp'
import checkin from '../assets/img/tellme-checkin.webp'
import report from '../assets/img/tellme-report.webp'
import './Work.css'

const SCREEN_SRC: Record<string, string> = { today, checkin, report }

function Screens({ lit }: { lit: boolean }) {
  return (
    <div className={`tm-screens ${lit ? 'tm-screens--lit' : 'tm-screens--dark'}`}>
      {tellMe.screens.map((s, i) => (
        <figure className={`tm-col tm-col--${i + 1} js-tm-col-${i + 1}`} key={s.key}>
          <div className="tm-phone">
            <img
              src={SCREEN_SRC[s.key]}
              width={600}
              height={1298}
              alt={lit ? `Tell Me — ${s.label} screen` : ''}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="tm-note">
            <span className="cap tm-note__n">0{i + 1}</span>
            <span className="tm-note__label">{s.label}</span>
            <span className="tm-note__text">{s.note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

const DIAGRAMS: Record<CaseFile['diagram'], () => JSX.Element> = {
  loop: LoopDiagram,
  journey: JourneyDiagram,
  patient: PatientDiagram,
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
          {f.title}
        </h3>
        <p className="cap file__context">{f.context}</p>
        <p className="file__summary">{f.summary}</p>
        <dl className="file__facts">
          <div>
            <dt className="cap">Role</dt>
            <dd>{f.role}</dd>
          </div>
          <div>
            <dt className="cap">Tools</dt>
            <dd>{f.tools.join(' / ')}</dd>
          </div>
        </dl>
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

        // Title: letters rise out of a mask.
        gsap.from('.tm__title .word__inner', {
          yPercent: 105,
          duration: 1.3,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.tm__title', start: 'top 85%' },
        })
        gsap.from('.tm__block', {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.tm__copy', start: 'top 80%' },
        })

        // Screens: masked entrance, then three different parallax speeds.
        gsap.fromTo(
          '.tm-phone',
          { clipPath: 'inset(100% 0% 0% 0% round 26px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 26px)',
            duration: 1.4,
            ease: 'expo.inOut',
            stagger: 0.12,
            scrollTrigger: { trigger: '.tm__visual', start: 'top 75%' },
          },
        )
        ;[1, 2, 3].forEach((i) => {
          gsap.fromTo(
            `.js-tm-col-${i}`,
            { yPercent: 4 * i },
            {
              yPercent: -4 * i,
              ease: 'none',
              scrollTrigger: { trigger: '.tm__visual', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          )
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
            .from(file.querySelectorAll('.dg-node'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.6, ease: 'back.out(2)' }, 0.2)
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

      // Images inside may change layout after load.
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
            Selected work, <em>told as case files.</em>
          </h2>
          <p className="cap work__count">
            0{caseFiles.length + 1} files · product, UX & journey design
          </p>
        </div>

        {/* ---------- Case file 01: Tell Me ---------- */}
        <article className="tm" aria-labelledby="tm-title">
          <header className="tm__head">
            <p className="cap tm__meta">
              <span className="tm__meta-n">Case file 01 / 0{caseFiles.length + 1}</span>
              <span>{tellMe.kicker}</span>
              <span>{tellMe.dates}</span>
            </p>
            <h3 id="tm-title" className="tm__title display">
              <span className="word">
                <span className="word__inner">Tell</span>
              </span>{' '}
              <span className="word">
                <span className="word__inner outline">Me</span>
              </span>
            </h3>
            <p className="tm__tagline serif">
              <em>{tellMe.tagline}</em>
            </p>
          </header>

          <div className="tm__grid">
            <div className="tm__copy">
              <div className="tm__block">
                <h4 className="cap tm__label">
                  <span className="tm__swatch tm__swatch--red" aria-hidden="true" />
                  Problem
                </h4>
                <p>{tellMe.problem}</p>
              </div>
              <div className="tm__block">
                <h4 className="cap tm__label">
                  <span className="tm__swatch tm__swatch--yellow" aria-hidden="true" />
                  Solution
                </h4>
                <p>{tellMe.solution}</p>
              </div>
              <div className="tm__block">
                <h4 className="cap tm__label">
                  <span className="tm__swatch tm__swatch--blue" aria-hidden="true" />
                  My contribution
                </h4>
                <p>{tellMe.contribution}</p>
              </div>
              <div className="tm__block">
                <h4 className="cap tm__label">Built with</h4>
                <ul className="tm__stack">
                  {tellMe.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="tm__block tm__links">
                {tellMe.links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn ${i === 0 ? 'btn--solid' : 'btn--ghost'}`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    {l.label}
                    <span className="btn__arrow" aria-hidden="true">
                      ↗
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="tm__visual">
              <Flashlight
                className="tm__torch"
                label="Tell Me screens: today, the Yes or No question, and the weekly report"
                base={<Screens lit={false} />}
                reveal={<Screens lit />}
                radius={200}
                rest={{ x: 50, y: 34 }}
                hint={{ pointer: 'Shine the torch over the screens', touch: 'Tap a screen to light it' }}
              />
            </div>
          </div>
        </article>
      </div>

      {/* ---------- Case files 02–04 ---------- */}
      <div className="files">
        <div className="files__track">
          <div className="files__lead">
            <p className="cap">Continued</p>
            <p className="files__lead-title display">
              More
              <br />
              <span className="outline">files</span>
            </p>
            <p className="files__lead-note">Interface and journey design — in a team, and on the Pega platform.</p>
            <span className="files__arrow cap" aria-hidden="true">
              Scroll →
            </span>
          </div>
          {caseFiles.map((f) => (
            <FilePanel key={f.id} f={f} total={caseFiles.length + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
