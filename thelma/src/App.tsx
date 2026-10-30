import { useCallback, useRef, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Curtain } from './components/Curtain'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Path } from './components/Path'
import { Recognition } from './components/Recognition'
import { Stats } from './components/Stats'
import { Timeline } from './components/Timeline'
import { Toolkit } from './components/Toolkit'
import { Work } from './components/Work'
import { gsap, MQ, useGSAP } from './lib/motion'

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])
  const root = useRef<HTMLDivElement>(null)

  // Section headings rise out of a soft wipe as they enter.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal-head]').forEach((h) => {
          const tl = gsap
            .timeline({ scrollTrigger: { trigger: h, start: 'top 85%' } })
            .from(h.querySelector('.eyebrow'), { opacity: 0, x: -14, duration: 0.6 })
            .from(h.querySelector('.h2'), { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.1, ease: 'power4.out' }, 0.05)
          const sub = h.querySelector('.sub')
          if (sub) tl.from(sub, { opacity: 0, y: 16, duration: 0.8 }, 0.35)
        })
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, { y: 30, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Curtain onDone={onDone} />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main id="main">
        <Hero ready={ready} />
        <Stats />
        <About />
        <Work />
        <Toolkit />
        <Timeline />
        <Recognition />
        <Path />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
