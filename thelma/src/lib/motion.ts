import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'power3.out', duration: 0.9 })

export const MQ = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 901px)',
  fine: '(hover: hover) and (pointer: fine)',
} as const

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, useGSAP }
