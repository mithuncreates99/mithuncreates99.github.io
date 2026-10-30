import { useEffect, useRef, useState } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import { person } from '../content'

/** Six aperture blades drawn as tangent strokes around a ring. */
const BLADES = Array.from({ length: 6 }, (_, i) => {
  const a = (i * Math.PI) / 3
  const b = a + Math.PI / 3 + 0.35
  const r0 = 46
  const r1 = 120
  return `M${(Math.cos(a) * r0).toFixed(1)} ${(Math.sin(a) * r0).toFixed(1)} L${(Math.cos(b) * r1).toFixed(1)} ${(Math.sin(b) * r1).toFixed(1)}`
})

/**
 * Opening sequence, framed as a photograph being taken: a viewfinder appears,
 * the focus box hunts and locks while her name types in, the shutter flashes,
 * and an aperture opens onto the hero. About two seconds; any key, click, tap
 * or scroll skips straight to the page. Skipped entirely with reduced motion.
 */
export function Curtain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [gone, setGone] = useState(() => reducedMotion())

  useGSAP(
    () => {
      if (gone) {
        onDone()
        return
      }
      let handed = false
      const handOver = () => {
        if (handed) return
        handed = true
        onDone()
      }
      const tl = gsap.timeline({ onComplete: () => setGone(true) })
      tl.set(ref.current, { '--hole': '0vmax' })
        .from('.vf-corner', { scale: 1.8, opacity: 0, duration: 0.55, stagger: 0.05, ease: 'power3.out' }, 0)
        .from('.vf-meta', { opacity: 0, y: 6, duration: 0.4, stagger: 0.06 }, 0.15)
        .fromTo('.vf-focus', { scale: 1.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }, 0.2)
        .from('.vf-name .ch', { yPercent: 115, opacity: 0, duration: 0.55, stagger: 0.05, ease: 'power3.out' }, 0.45)
        .to('.vf-focus', { scale: 0.84, duration: 0.11, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 0.7)
        .to('.vf-focus', { borderColor: 'rgba(229,181,199,1)', boxShadow: '0 0 18px rgba(229,181,199,.6)', duration: 0.12 }, 1.18)
        .to('.vf-lock', { opacity: 1, duration: 0.1 }, 1.18)
        .add(handOver, 1.4)
        .to('.vf-flash', { opacity: 0.9, duration: 0.05 }, 1.4)
        .to('.vf-flash', { opacity: 0, duration: 0.55, ease: 'power2.out' }, 1.46)
        .to('.vf-ui', { opacity: 0, duration: 0.3 }, 1.42)
        .to(ref.current, { '--hole': '150vmax', duration: 1.15, ease: 'power3.inOut' }, 1.42)
        .to('.iris', { rotation: 75, scale: 2.6, opacity: 0, duration: 1.15, ease: 'power3.inOut' }, 1.42)
      tlRef.current = tl
    },
    { scope: ref },
  )

  // Any input skips the intro so it never stands between someone and the page.
  useEffect(() => {
    if (gone) return
    const skip = () => tlRef.current?.progress(1)
    const opts = { once: true, passive: true } as const
    window.addEventListener('keydown', skip, opts)
    window.addEventListener('pointerdown', skip, opts)
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchmove', skip, opts)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
    }
  }, [gone])

  if (gone) return null
  return (
    <div className="curtain" ref={ref} aria-hidden="true">
      <svg className="iris" viewBox="-130 -130 260 260">
        <circle r="122" />
        <circle r="46" className="iris-in" />
        {BLADES.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <div className="vf-ui">
        <span className="vf-corner tl" />
        <span className="vf-corner tr" />
        <span className="vf-corner bl" />
        <span className="vf-corner br" />
        <span className="vf-meta m-tl">{person.name}</span>
        <span className="vf-meta m-tr">Fig. 01</span>
        <span className="vf-meta m-bl">{person.role}</span>
        <span className="vf-meta m-br">
          <i className="vf-lock" /> Focus
        </span>
        <span className="vf-focus" />
        <span className="vf-name">
          {Array.from(person.first).map((c, i) => (
            <span className="ch" key={i}>
              {c}
            </span>
          ))}
        </span>
      </div>
      <div className="vf-flash" />
    </div>
  )
}
