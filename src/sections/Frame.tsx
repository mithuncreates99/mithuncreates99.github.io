import { useRef, type CSSProperties } from 'react'
import { Flashlight } from '../components/Flashlight'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { education, person } from '../content/profile'
import campus1100 from '../assets/img/campus-1100.webp'
import campus1800 from '../assets/img/campus-1800.webp'
import './Frame.css'

type Pin = { x: number; y: number; side: 'left' | 'right'; label: string; tone: 'yellow' | 'red' | 'ivory'; mobile?: boolean }

// Positions are % of the photograph, which keeps its own 3:4 ratio.
const PINS: Pin[] = [
  { x: 50, y: 14, side: 'left', label: 'Fig. 1 — NEOMA Business School, Rouen campus', tone: 'ivory', mobile: true },
  { x: 48, y: 50, side: 'left', label: `${education[0].dates} · Master in Management`, tone: 'yellow', mobile: true },
  { x: 45, y: 72, side: 'left', label: person.name, tone: 'red', mobile: true },
]

const before = education[1]

function FrameScene({ lit }: { lit: boolean }) {
  return (
    <div className={`fs ${lit ? 'fs--lit' : 'fs--dark'}`}>
      <div className="fs__text">
        <div className="chapter fs__chapter">
          <span className="cap chapter__n">01</span>
          <span className="chapter__line js-frame-line" />
          <span className="cap">The frame</span>
        </div>

        {lit ? (
          <h2 id="frame-title" className="fs__title serif">
            Rouen, September 2026. <em>A new chapter in business.</em>
          </h2>
        ) : (
          <p className="fs__title serif">
            Rouen, September 2026. <em>A new chapter in business.</em>
          </p>
        )}
        <p className="fs__intro">
          After a B.Tech in Information Technology in Tamil Nadu, Mithun joined NEOMA Business School’s Rouen campus
          for a Master in Management.
        </p>

        <div className="fs__frags">
          <p className="fs__frag display">
            Trained in
            <br />
            technology.
          </p>
          <p className="fs__frag fs__frag--b display">
            Now studying
            <br />
            <span className={lit ? 'mark-ink' : undefined}>business.</span>
          </p>
          <p className="fs__quote serif">
            <em>“Turning user insight and data into clear digital experiences.”</em>
          </p>
        </div>
      </div>

      <figure className="fs__photo">
        <div className="fs__photo-frame">
          <div className="fs__photo-clip">
          <img
            className="fs__img js-frame-img"
            src={campus1800}
            srcSet={`${campus1100} 1100w, ${campus1800} 1800w`}
            sizes="(max-width: 899px) 100vw, 46vw"
            width={1800}
            height={2400}
            alt={lit ? `${person.name} standing in front of the château at NEOMA Business School, Rouen campus` : ''}
            loading="lazy"
            decoding="async"
          />
          <div className="fs__vignette" />
          </div>
          {PINS.map((p) => (
            <span
              key={p.label}
              className={`fs__pin fs__pin--${p.side} fs__pin--${p.tone} ${p.mobile ? '' : 'fs__pin--desk'}`}
              style={{ '--px': `${p.x}%`, '--py': `${p.y}%` } as CSSProperties}
            >
              <span className="fs__ring" />
              <span className="fs__lead" />
              <span className="fs__label cap">{p.label}</span>
            </span>
          ))}
        </div>
        <figcaption className="fs__caption cap">
          Previously — {before.degree}, {before.school}, {before.place} ({before.dates.replace(/[A-Za-z]+ /g, '')})
        </figcaption>
      </figure>
    </div>
  )
}

export function Frame() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.js-frame-line', {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
        gsap.fromTo(
          '.js-frame-img',
          { scale: 1.08, yPercent: -3 },
          {
            scale: 1,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          },
        )
        gsap.from('.fs__frag, .fs__quote', {
          yPercent: 30,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.fs__frags', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="frame" className="frame" ref={root} aria-labelledby="frame-title">
      <Flashlight
        label="The frame: a photograph from the NEOMA Rouen campus with notes, revealed by a torch"
        base={<FrameScene lit={false} />}
        reveal={<FrameScene lit />}
        radius={250}
        rest={{ x: 72, y: 58 }}
        hint={{ pointer: 'Move across the photograph to light it', touch: 'Tap or drag across the photo' }}
      />
    </section>
  )
}
