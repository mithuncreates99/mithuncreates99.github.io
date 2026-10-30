import { useRef } from 'react'
import { lens } from '../content'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { Flashlight } from './Flashlight'
import { SectionHead } from './SectionHead'
import lens720 from '../assets/img/lens-720.webp'
import lens1200 from '../assets/img/lens-1200.webp'

// Kept outside the component so the flashlight effect doesn't re-run on render.
const REST = { x: 52, y: 52 }
const INTRO = [
  { x: 30, y: 22 },
  { x: 74, y: 30 },
  { x: 48, y: 58 },
]

function Photo({ alt }: { alt: string }) {
  return (
    <img
      src={lens720}
      srcSet={`${lens720} 720w, ${lens1200} 1200w`}
      sizes="(max-width: 900px) 92vw, 520px"
      width={1200}
      height={1600}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  )
}

export function Lens() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.lens-notes > div', { y: 18, opacity: 0, stagger: 0.09, duration: 0.7, scrollTrigger: { trigger: '.lens-notes', start: 'top 85%' } })
        gsap.from('.lens .flash', { y: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: '.lens .flash', start: 'top 85%' } })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section className="section lens" id="lens" ref={ref} aria-labelledby="lens-h">
      <div className="wrap lens-grid">
        <div className="lens-copy">
          <SectionHead n="02" label={lens.label} heading={lens.heading} id="lens-h" />
          {lens.body.map((p) => (
            <p className="lens-text" key={p.slice(0, 16)}>
              {p}
            </p>
          ))}
          <dl className="lens-notes">
            {lens.notes.map((n) => (
              <div key={n.k}>
                <dt>{n.k}</dt>
                <dd>{n.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Flashlight
          className="lens-flash"
          label={lens.flashLabel}
          rest={REST}
          intro={INTRO}
          base={<Photo alt="" />}
          chrome={
            <>
              <span className="mark tl" />
              <span className="mark tr" />
              <span className="mark bl" />
              <span className="mark br" />
              <span className="thirds" />
              <span className="focus" />
              <span className="fig-cap">
                <span>Fig. 02</span>
                <span>{lens.caption}</span>
              </span>
            </>
          }
        >
          <Photo alt={lens.alt} />
        </Flashlight>
      </div>
    </section>
  )
}
