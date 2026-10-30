import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Signal } from './sections/Signal'
import { Profile } from './sections/Profile'
import { Work } from './sections/Work'
import { Record } from './sections/Record'
import { Toolkit } from './sections/Toolkit'
import { Collaborate } from './sections/Collaborate'
import { Footer } from './components/Footer'
import { isLowPower } from './lib/motion'

export default function App() {
  useEffect(() => {
    document.documentElement.dataset.lowPower = String(isLowPower())
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Signal />
        <Profile />
        <Work />
        <Record />
        <Toolkit />
        <Collaborate />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </MotionConfig>
  )
}
