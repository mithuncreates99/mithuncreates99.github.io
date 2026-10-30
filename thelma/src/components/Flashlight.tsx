import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { gsap, reducedMotion, ScrollTrigger } from '../lib/motion'

export type FlashlightProps = {
  /** Dark layer shown everywhere. Rendered aria-hidden, so it may duplicate `children`. */
  base: ReactNode
  /** Lit layer revealed by the beam. This is the accessible content. */
  children: ReactNode
  /** Decorations drawn above both layers (frame marks, captions). aria-hidden. */
  chrome?: ReactNode
  /** Accessible name of the interactive area. */
  label: string
  /** Beam radius in px at full width; scales down with the box. */
  radius?: number
  /** Share of the radius that is fully lit (0–1). */
  core?: number
  /** Where the beam rests, in % of the box. */
  rest?: { x: number; y: number }
  /** Path the beam sweeps once when it first scrolls into view, in % of the box. */
  intro?: { x: number; y: number }[]
  className?: string
}

const KEY_STEP = 0.07

/**
 * A torch that lights up a second layer under a dark one.
 *
 * The beam is a CSS mask on the lit layer, driven by --x / --y / --r. Input only
 * stores a target; a requestAnimationFrame loop eases toward it and stops once
 * it has settled, so nothing runs while the beam is still and React never
 * re-renders on movement.
 *
 * Mouse: follows the pointer. Touch: tap or drag sideways; vertical swipes
 * still scroll the page. Keyboard: arrow keys move it, the button lights the
 * whole picture. Reduced motion: the picture starts fully lit.
 */
export function Flashlight({
  base,
  children,
  chrome,
  label,
  radius = 210,
  core = 0.32,
  rest = { x: 50, y: 42 },
  intro,
  className = '',
}: FlashlightProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hintId = useId()
  const [lit, setLit] = useState(() => reducedMotion())
  const [coarse, setCoarse] = useState(false)
  const litRef = useRef(lit)
  const api = useRef<{ aimPct: (x: number, y: number) => void; nudge: (dx: number, dy: number) => void; setLit: (on: boolean) => void } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = reducedMotion()
    setCoarse(window.matchMedia('(pointer: coarse)').matches)
    const s = { tx: 0, ty: 0, cx: 0, cy: 0, raf: 0, r: radius, k: reduced ? 1 : 0.18, active: false }

    const px = (name: string, v: number) => el.style.setProperty(name, `${v.toFixed(1)}px`)
    const full = () => Math.hypot(el.clientWidth, el.clientHeight) * 1.1

    const tick = () => {
      s.cx += (s.tx - s.cx) * s.k
      s.cy += (s.ty - s.cy) * s.k
      px('--x', s.cx)
      px('--y', s.cy)
      s.raf = Math.abs(s.tx - s.cx) > 0.4 || Math.abs(s.ty - s.cy) > 0.4 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick)
    }
    const aim = (x: number, y: number) => {
      s.tx = Math.max(0, Math.min(el.clientWidth, x))
      s.ty = Math.max(0, Math.min(el.clientHeight, y))
      kick()
    }
    const aimPct = (x: number, y: number) => aim((el.clientWidth * x) / 100, (el.clientHeight * y) / 100)

    const restR = () => s.r * 0.72
    const setR = (to: number, dur = 0.6) => {
      if (reduced) px('--r', to)
      else gsap.to(el, { '--r': `${to}px`, duration: dur, ease: 'power3.out', overwrite: 'auto' })
    }

    const size = () => {
      s.r = Math.round(Math.max(110, Math.min(radius, el.clientWidth * 0.36)))
      px('--r', litRef.current ? full() : s.active ? s.r : restR())
    }

    const place = () => {
      s.tx = s.cx = (el.clientWidth * rest.x) / 100
      s.ty = s.cy = (el.clientHeight * rest.y) / 100
      px('--x', s.cx)
      px('--y', s.cy)
    }

    const activate = () => {
      if (s.active) return
      s.active = true
      if (!litRef.current) setR(s.r)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && e.buttons === 0) return
      activate()
      const b = el.getBoundingClientRect()
      aim(e.clientX - b.left, e.clientY - b.top)
    }
    const onDown = (e: PointerEvent) => {
      activate()
      const b = el.getBoundingClientRect()
      aim(e.clientX - b.left, e.clientY - b.top)
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return // keep the light where the finger left it
      s.active = false
      aimPct(rest.x, rest.y)
      if (!litRef.current) setR(restR(), 0.9)
    }

    place()
    size()

    const ro = new ResizeObserver(() => {
      size()
      if (!s.active) place()
    })
    ro.observe(el)
    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerdown', onDown, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })

    // One slow sweep the first time it scrolls into view, then it rests.
    let st: ScrollTrigger | undefined
    if (!reduced && intro?.length) {
      st = ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        once: true,
        onEnter: () => {
          if (s.active || litRef.current) return
          const p = { x: rest.x, y: rest.y }
          const tl = gsap.timeline({ onUpdate: () => !s.active && aimPct(p.x, p.y) })
          intro.forEach((pt) => tl.to(p, { x: pt.x, y: pt.y, duration: 1.1, ease: 'sine.inOut' }))
          tl.to(p, { x: rest.x, y: rest.y, duration: 1, ease: 'sine.inOut' })
        },
      })
    }

    api.current = {
      aimPct,
      nudge: (dx, dy) => {
        activate()
        aim(s.tx + dx * el.clientWidth, s.ty + dy * el.clientHeight)
      },
      setLit: (on) => {
        litRef.current = on
        setR(on ? full() : s.active ? s.r : restR(), on ? 1.1 : 0.7)
      },
    }

    return () => {
      ro.disconnect()
      st?.kill()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(s.raf)
      gsap.killTweensOf(el)
      api.current = null
    }
  }, [radius, rest.x, rest.y, intro])

  const toggle = () => {
    const next = !litRef.current
    setLit(next)
    api.current?.setLit(next)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    }
    const v = d[e.key]
    if (!v) return
    e.preventDefault()
    api.current?.nudge(v[0], v[1])
  }

  return (
    <div className={`flash ${className}`} data-lit={lit}>
      <div
        ref={ref}
        className="flash-stage"
        style={{ '--core': core } as CSSProperties}
        tabIndex={0}
        role="group"
        aria-label={label}
        aria-describedby={hintId}
        onKeyDown={onKey}
      >
        <div className="flash-layer flash-base" aria-hidden="true">
          {base}
        </div>
        <div className="flash-layer flash-reveal">{children}</div>
        <div className="flash-glow" aria-hidden="true" />
        {chrome && (
          <div className="flash-chrome" aria-hidden="true">
            {chrome}
          </div>
        )}
      </div>
      <div className="flash-controls">
        <p className="flash-hint" id={hintId}>
          <i aria-hidden="true" />
          {coarse ? 'Tap or drag sideways to move the light' : 'Move the pointer, or focus and use the arrow keys'}
        </p>
        <button type="button" className="flash-toggle" aria-pressed={lit} onClick={toggle}>
          <span className="flash-bulb" aria-hidden="true" />
          {lit ? 'Lights off' : 'Lights on'}
        </button>
      </div>
    </div>
  )
}
