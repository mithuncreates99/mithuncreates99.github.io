import { useRef, useState } from 'react'
import { gsap, reducedMotion, useGSAP } from '../lib/motion'
import { person } from '../content'

/** Short opening sequence: a line draws, her name appears on it, then the curtain lifts. */
export function Curtain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(() => reducedMotion())

  useGSAP(
    () => {
      if (gone) {
        onDone()
        return
      }
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true)
        },
      })
      tl.to('.curtain-line', { scaleX: 1, duration: 0.7, ease: 'power2.inOut' })
        .to('.curtain-name', { opacity: 1, y: -22, duration: 0.6 }, '-=0.25')
        .to('.curtain-name', { opacity: 0, y: -40, duration: 0.4, ease: 'power2.in' }, '+=0.15')
        .to('.curtain-line', { scaleX: 3, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
        .add(onDone, '-=0.15')
        .to(ref.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power3.inOut' }, '-=0.2')
    },
    { scope: ref },
  )

  if (gone) return null
  return (
    <div className="curtain" ref={ref} aria-hidden="true" style={{ clipPath: 'inset(0 0 0% 0)' }}>
      <div className="curtain-line" />
      <div className="curtain-name">{person.first}</div>
    </div>
  )
}
