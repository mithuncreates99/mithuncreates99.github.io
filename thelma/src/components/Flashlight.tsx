import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { gsap, isLowPower, prefersReducedMotion } from '../lib/motion'
import './Flashlight.css'

export type FlashlightProps = {
  /** The dark, always-visible layer. Rendered aria-hidden: put duplicates here. */
  base: ReactNode
  /** The lit layer. Its content is the accessible one. */
  reveal: ReactNode
  /** Content that stays readable above both layers (headings, hints). */
  overlay?: ReactNode
  /** Beam radius in px at desktop widths. Scales down with the container. */
  radius?: number
  /** Share of the radius that stays fully lit (0–1). */
  core?: number
  /** Warm glow on top of the beam. Dropped on low-power devices. */
  glow?: boolean
  /** Pointer smoothing, 0–1. 1 = no lag. */
  smoothing?: number
  /** Where the beam rests when nobody is pointing, in % of the box. */
  rest?: { x: number; y: number }
  /** Accessible name for the region. */
  label: string
  /** Text of the "lights on" toggle. */
  lightsOnLabel?: string
  lightsOffLabel?: string
  hint?: { pointer: string; touch: string }
  className?: string
}

/**
 * A torch beam that reveals a second layer underneath a dark one.
 *
 * The beam is a CSS mask on the lit layer, driven by --x / --y / --r custom
 * properties. Pointer events only store a target; a requestAnimationFrame loop
 * eases towards it and stops itself once settled, so nothing re-renders and
 * nothing runs while the pointer is still.
 */
export function Flashlight({
  base,
  reveal,
  overlay,
  radius = 230,
  core = 0.3,
  glow = true,
  smoothing = 0.16,
  rest = { x: 62, y: 46 },
  label,
  lightsOnLabel = 'Lights on',
  lightsOffLabel = 'Lights off',
  hint = { pointer: 'Move to light it up', touch: 'Tap or drag to light it up' },
  className = '',
}: FlashlightProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(false)
  const [coarse, setCoarse] = useState(false)
  const [cheap, setCheap] = useState(false)
  const litRef = useRef(false)
  const regionId = useId()

  // Geometry kept outside React state on purpose.
  const state = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, raf: 0, r: radius, k: smoothing, inside: false })

  const restRadius = useCallback(() => state.current.r * 0.62, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const s = state.current
    const reduced = prefersReducedMotion()
    const low = isLowPower()
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    setCoarse(isCoarse)
    setCheap(reduced || low)
    s.k = reduced || low ? 1 : smoothing

    const setVar = (name: string, v: number) => el.style.setProperty(name, `${v.toFixed(1)}px`)

    const placeAtRest = () => {
      s.tx = s.cx = (el.clientWidth * rest.x) / 100
      s.ty = s.cy = (el.clientHeight * rest.y) / 100
      setVar('--x', s.cx)
      setVar('--y', s.cy)
    }

    const sizeBeam = () => {
      // Beam scales with the box, within sensible limits.
      s.r = Math.round(Math.max(120, Math.min(radius, el.clientWidth * 0.3)))
      if (!litRef.current) setVar('--r', s.inside ? s.r : restRadius())
      el.style.setProperty('--r-full', `${Math.hypot(el.clientWidth, el.clientHeight).toFixed(0)}px`)
    }

    const tick = () => {
      s.cx += (s.tx - s.cx) * s.k
      s.cy += (s.ty - s.cy) * s.k
      setVar('--x', s.cx)
      setVar('--y', s.cy)
      if (Math.abs(s.tx - s.cx) > 0.4 || Math.abs(s.ty - s.cy) > 0.4) {
        s.raf = requestAnimationFrame(tick)
      } else {
        s.raf = 0
      }
    }

    const aim = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      s.tx = clientX - rect.left
      s.ty = clientY - rect.top
      if (!s.raf) s.raf = requestAnimationFrame(tick)
    }

    const grow = (to: number) => {
      if (litRef.current) return
      if (reduced) {
        setVar('--r', to)
        return
      }
      gsap.to(el, { '--r': `${to}px`, duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
    }

    const onMove = (e: PointerEvent) => {
      if (!s.inside) {
        s.inside = true
        grow(s.r)
      }
      aim(e.clientX, e.clientY)
    }

    const onDown = (e: PointerEvent) => {
      // Touch: a tap moves the beam there; horizontal drags keep following.
      s.inside = true
      grow(s.r)
      aim(e.clientX, e.clientY)
    }

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return // keep the beam where the finger left it
      s.inside = false
      s.tx = (el.clientWidth * rest.x) / 100
      s.ty = (el.clientHeight * rest.y) / 100
      if (!s.raf) s.raf = requestAnimationFrame(tick)
      grow(restRadius())
    }

    placeAtRest()
    sizeBeam()

    const ro = new ResizeObserver(() => {
      sizeBeam()
      if (!s.inside) placeAtRest()
    })
    ro.observe(el)

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })

    return () => {
      ro.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(s.raf)
      s.raf = 0
      gsap.killTweensOf(el)
    }
  }, [radius, smoothing, rest.x, rest.y, restRadius])

  const toggle = () => {
    const el = rootRef.current
    if (!el) return
    const next = !litRef.current
    litRef.current = next
    setLit(next)
    const s = state.current
    const to = next ? el.style.getPropertyValue('--r-full') || '3000px' : `${s.inside ? s.r : restRadius()}px`
    if (prefersReducedMotion()) {
      el.style.setProperty('--r', to)
    } else {
      gsap.to(el, { '--r': to, duration: next ? 1.1 : 0.7, ease: next ? 'power2.inOut' : 'power3.out', overwrite: 'auto' })
    }
  }

  const style = { '--r': `${radius * 0.62}px`, '--core': core } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={`torch ${className}`}
      data-lit={lit}
      data-cheap={cheap}
      style={style}
      role="region"
      aria-label={label}
      aria-describedby={`${regionId}-hint`}
    >
      <div className="torch__layer torch__base" aria-hidden="true">
        {base}
      </div>
      <div className="torch__layer torch__reveal">{reveal}</div>
      {glow && !cheap && <div className="torch__glow" aria-hidden="true" />}
      {overlay && <div className="torch__overlay">{overlay}</div>}
      <div className="torch__controls">
        <p className="cap torch__hint" id={`${regionId}-hint`}>
          <span className="torch__hint-dot" aria-hidden="true" />
          {coarse ? hint.touch : hint.pointer}
        </p>
        <motion.button
          type="button"
          className="torch__toggle cap"
          aria-pressed={lit}
          onClick={toggle}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        >
          <span className="torch__bulb" data-on={lit} aria-hidden="true" />
          {lit ? lightsOffLabel : lightsOnLabel}
        </motion.button>
      </div>
    </div>
  )
}
