import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.9 })

/** Media query strings shared by GSAP matchMedia and CSS. */
export const MQ = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 900px)',
  coarse: '(pointer: coarse)',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches

type NavigatorHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

/**
 * Rough "this device should get the cheap version" check: very few cores,
 * little memory, or Data Saver turned on. Used to drop glows, smoothing and
 * continuous ambient motion.
 */
export const isLowPower = () => {
  if (typeof navigator === 'undefined') return false
  const n = navigator as NavigatorHints
  return (n.hardwareConcurrency ?? 8) <= 2 || (n.deviceMemory ?? 8) <= 2 || n.connection?.saveData === true
}

export { gsap, ScrollTrigger, useGSAP }
