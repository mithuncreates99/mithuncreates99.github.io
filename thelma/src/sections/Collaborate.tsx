import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Chapter, Words } from '../components/Chapter'
import { ContactOverlay } from '../components/ContactOverlay'
import { HandIllustration } from '../components/HandIllustration'
import { HAND_GRIP, HAND_PIVOT, HAND_VIEWBOX } from '../components/handGeometry'
import { gsap, isLowPower, MQ, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'
import { contact, mailto } from '../content/contact'
import { person, siteYear } from '../content/profile'
import './Collaborate.css'

const LAYOUT_ID = 'collab-surface'

/**
 * Each thread ties onto the pill at a point given as a fraction of its box,
 * and has its own slack, weight and sway phase so the bundle looks hand-made.
 */
const THREADS = [
  { ax: 0.05, ay: 0.5, sag: 1.0, w: 1.2, phase: 0.0, gx: 0, gy: 0 },
  { ax: 0.15, ay: 0.08, sag: 0.7, w: 0.85, phase: 1.3, gx: 1.5, gy: -2 },
  { ax: 0.12, ay: 0.94, sag: 1.25, w: 1.0, phase: 2.1, gx: -1.2, gy: 1.6 },
  { ax: 0.3, ay: 0.97, sag: 1.5, w: 0.75, phase: 3.4, gx: 0.6, gy: 1.2 },
  { ax: 0.27, ay: 0.05, sag: 0.55, w: 0.95, phase: 4.6, gx: 2, gy: -1.2 },
  { ax: 0.08, ay: 0.24, sag: 0.9, w: 0.7, phase: 5.5, gx: -0.4, gy: -0.6 },
]

type Api = { hover: (on: boolean) => void; setOpen: (open: boolean) => void }

export function Collaborate() {
  const root = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const handWrapRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const pullRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)
  const api = useRef<Api | null>(null)
  const [open, setOpen] = useState(false)

  // Framer Motion: 3D tilt that follows the pointer over the pill.
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 18 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 18 })

  const onTilt = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 16)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 18)
  }
  const resetTilt = () => {
    rx.set(0)
    ry.set(0)
  }

  const openOverlay = () => {
    resetTilt()
    api.current?.setOpen(true)
    setOpen(true)
  }

  const closeOverlay = useCallback(() => {
    setOpen(false)
    api.current?.setOpen(false)
    // Give focus back to the pill once it has re-mounted.
    window.setTimeout(() => buttonRef.current?.focus({ preventScroll: true }), 420)
  }, [])

  useGSAP(
    () => {
      const stage = stageRef.current
      const handWrap = handWrapRef.current
      const hand = handRef.current
      const anchor = anchorRef.current
      const pullEl = pullRef.current
      const svg = svgRef.current
      if (!stage || !handWrap || !hand || !anchor || !pullEl || !svg) return

      const paths = pathRefs.current.filter(Boolean) as SVGPathElement[]
      const reduced = prefersReducedMotion()
      const calm = reduced || isLowPower()

      const geo = { w: 0, h: 0, gx: 0, gy: 0, px: 0, py: 0, bx: 0, by: 0, bw: 0, bh: 0 }
      const live = { pull: 0, hover: 0, tug: 0, t: 0, mx: 0, my: 0, m: 0 }

      const setHX = gsap.quickSetter(hand, 'x', 'px') as (v: number) => void
      const setHY = gsap.quickSetter(hand, 'y', 'px') as (v: number) => void
      const setHR = gsap.quickSetter(hand, 'rotation', 'deg') as (v: number) => void
      const setBX = gsap.quickSetter(pullEl, 'x', 'px') as (v: number) => void
      const setBY = gsap.quickSetter(pullEl, 'y', 'px') as (v: number) => void

      const measure = () => {
        const s = stage.getBoundingClientRect()
        geo.w = s.width
        geo.h = s.height
        svg.setAttribute('viewBox', `0 0 ${geo.w.toFixed(1)} ${geo.h.toFixed(1)}`)
        // offset* ignores transforms, so the hand's entrance/pull motion doesn't skew this.
        const hw = handWrap.offsetWidth
        const hh = handWrap.offsetHeight
        geo.gx = handWrap.offsetLeft + (HAND_GRIP.x / HAND_VIEWBOX.w) * hw
        geo.gy = handWrap.offsetTop + (HAND_GRIP.y / HAND_VIEWBOX.h) * hh
        geo.px = handWrap.offsetLeft + (HAND_PIVOT.x / HAND_VIEWBOX.w) * hw
        geo.py = handWrap.offsetTop + (HAND_PIVOT.y / HAND_VIEWBOX.h) * hh
        const a = anchor.getBoundingClientRect()
        geo.bx = a.left - s.left
        geo.by = a.top - s.top
        geo.bw = a.width
        geo.bh = a.height
      }

      const render = () => {
        const pull = live.pull + live.hover * 0.35 + live.tug
        const tight = Math.min(Math.max(pull, 0), 1.3)

        // Hand: small pull back towards the bottom-left, pivoting at the wrist.
        const hx = -11 * pull
        const hy = 7 * pull
        const deg = -2.6 * pull
        setHX(hx)
        setHY(hy)
        setHR(deg)

        // Pill gives a little in the same direction.
        const bdx = -4.5 * pull
        const bdy = 2.6 * pull
        setBX(bdx)
        setBY(bdy)

        // Grip point after the hand's rotation + translation.
        const rad = (deg * Math.PI) / 180
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        const dx = geo.gx - geo.px
        const dy = geo.gy - geo.py
        const gx = geo.px + dx * cos - dy * sin + hx
        const gy = geo.py + dx * sin + dy * cos + hy

        for (let i = 0; i < paths.length; i++) {
          const t = THREADS[i]
          const sx = gx + t.gx
          const sy = gy + t.gy
          const ax = geo.bx + t.ax * geo.bw + bdx
          const ay = geo.by + t.ay * geo.bh + bdy
          const vx = ax - sx
          const vy = ay - sy
          const len = Math.hypot(vx, vy) || 1
          // Normal that points "down" for a thread rising to the right.
          const nx = -vy / len
          const ny = vx / len
          const sag = len * 0.075 * t.sag * (1 - 0.7 * tight)
          const sway = calm ? 0 : Math.sin(live.t * 0.85 + t.phase) * 3.4 * (1 - 0.5 * tight)

          let c1x = sx + vx * 0.32 + nx * (sag * 0.9 + sway)
          let c1y = sy + vy * 0.32 + ny * (sag * 0.9 + sway)
          let c2x = sx + vx * 0.7 + nx * (sag * 0.72 - sway * 0.6)
          let c2y = sy + vy * 0.7 + ny * (sag * 0.72 - sway * 0.6)

          if (live.m > 0.01) {
            // Threads lean gently towards the pointer, capped at ~14px.
            const k = 0.07 * live.m
            const lim = 14 * live.m
            const ox1 = Math.max(-lim, Math.min(lim, (live.mx - c1x) * k))
            const oy1 = Math.max(-lim, Math.min(lim, (live.my - c1y) * k))
            const ox2 = Math.max(-lim, Math.min(lim, (live.mx - c2x) * k * 1.2))
            const oy2 = Math.max(-lim, Math.min(lim, (live.my - c2y) * k * 1.2))
            c1x += ox1
            c1y += oy1
            c2x += ox2
            c2y += oy2
          }

          paths[i].setAttribute(
            'd',
            `M${sx.toFixed(1)} ${sy.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`,
          )
        }
      }

      measure()
      render()

      const ro = new ResizeObserver(() => {
        measure()
        render()
      })
      ro.observe(stage)

      // Continuous motion only while the section is on screen.
      let ticking = false
      const tick = (time: number) => {
        live.t = time
        render()
      }
      const startTicker = () => {
        if (ticking || reduced) return
        ticking = true
        gsap.ticker.add(tick)
      }
      const stopTicker = () => {
        if (!ticking) return
        ticking = false
        gsap.ticker.remove(tick)
      }

      // A small, natural tug every few seconds.
      const loop = gsap
        .timeline({ repeat: -1, repeatDelay: 2.2, paused: true })
        .to(live, { pull: 1, duration: 0.5, ease: 'power2.out' })
        .to(live, { pull: 0, duration: 1.7, ease: 'elastic.out(1, 0.45)' })

      const tug = () => {
        if (reduced) return
        gsap
          .timeline({ onUpdate: () => !ticking && render() })
          .to(live, { tug: 1.6, duration: 0.24, ease: 'power3.out', overwrite: 'auto' })
          .to(live, { tug: 0, duration: 1.9, ease: 'elastic.out(1, 0.32)' })
      }

      let isOpen = false
      api.current = {
        hover: (on) => {
          if (reduced || isOpen) return
          gsap.to(live, { hover: on ? 1 : 0, duration: on ? 0.5 : 0.9, ease: on ? 'power2.out' : 'elastic.out(1, 0.5)', onUpdate: () => !ticking && render() })
        },
        setOpen: (o) => {
          isOpen = o
          if (o) {
            loop.pause()
            gsap.to(live, { pull: 0, hover: 0, tug: 0, duration: 0.3, onUpdate: render })
          } else if (!reduced) {
            loop.restart(true)
          }
        },
      }

      // Pointer: threads lean towards it; touch drags work the same way.
      const qx = gsap.quickTo(live, 'mx', { duration: 0.5, ease: 'power3.out' })
      const qy = gsap.quickTo(live, 'my', { duration: 0.5, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        if (reduced) return
        const s = stage.getBoundingClientRect()
        qx(e.clientX - s.left)
        qy(e.clientY - s.top)
        if (live.m < 1) gsap.to(live, { m: 1, duration: 0.6, overwrite: 'auto' })
      }
      const onLeave = () => gsap.to(live, { m: 0, duration: 0.9, overwrite: 'auto' })
      stage.addEventListener('pointermove', onMove, { passive: true })
      stage.addEventListener('pointerleave', onLeave, { passive: true })
      handWrap.addEventListener('pointerdown', tug)

      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
        const intro = gsap.timeline({
          scrollTrigger: { trigger: stage, start: 'top 72%', once: true },
          onComplete: () => {
            if (!isOpen) loop.play()
          },
        })
        intro
          .from('.collab__title .word__inner', { yPercent: 110, duration: 1.1, stagger: 0.06, ease: 'expo.out' })
          .from(handWrap, { x: -180, y: 140, rotation: -12, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.1)
          .from(pullEl, { opacity: 0, scale: 0.82, duration: 1.1, ease: 'back.out(1.7)' }, 0.35)
          .to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.09, ease: 'power2.inOut' }, 0.7)
          .from('.js-collab-fade', { opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, 0.6)

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? startTicker() : stopTicker()),
        })
      })

      return () => {
        ro.disconnect()
        stopTicker()
        loop.kill()
        stage.removeEventListener('pointermove', onMove)
        stage.removeEventListener('pointerleave', onLeave)
        handWrap.removeEventListener('pointerdown', tug)
        gsap.killTweensOf(live)
        api.current = null
      }
    },
    { scope: root },
  )

  return (
    <section id="contact" className="collab" ref={root} aria-labelledby="collab-title">
      <div className="collab__stage" ref={stageRef}>
        <div className="collab__copy wrap">
          <Chapter n="06" label="Contact" tone="paper" />
          <h2 id="collab-title" className="collab__title serif">
            <Words text="Pull the" />
            <br />
            <em>
              <Words text="thread." />
            </em>
          </h2>
          <p className="collab__sub js-collab-fade">
            {person.availability}, {person.reach}. Conversations about projects are welcome too.
          </p>
          <p className="collab__alt collab__alt--inline js-collab-fade">
            <span className="cap">Prefer email?</span>{' '}
            <a className="text-link" href={mailto()}>
              {contact.email}
            </a>
          </p>
        </div>

        <svg className="collab__strings" ref={svgRef} aria-hidden="true" focusable="false">
          {THREADS.map((t, i) => (
            <path
              key={i}
              ref={(el) => {
                pathRefs.current[i] = el
              }}
              pathLength={1}
              strokeWidth={t.w}
            />
          ))}
        </svg>

        <div className="collab__hand" ref={handWrapRef} title="Give it a tug">
          <div className="collab__hand-inner" ref={handRef}>
            <HandIllustration />
          </div>
        </div>

        <div className="collab__anchor" ref={anchorRef}>
          <div className="collab__pull" ref={pullRef}>
            <motion.div
              className="collab__btn-group"
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => api.current?.hover(true)}
              onHoverEnd={() => api.current?.hover(false)}
            >
              <motion.span
                className="collab__ground"
                aria-hidden="true"
                variants={{
                  rest: { scaleX: 1, opacity: 0.55 },
                  hover: { scaleX: 0.84, opacity: 0.32 },
                  tap: { scaleX: 0.95, opacity: 0.5 },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              />
              {!open ? (
                <motion.button
                  ref={buttonRef}
                  type="button"
                  layoutId={LAYOUT_ID}
                  className="collab__btn"
                  aria-haspopup="dialog"
                  aria-expanded={open}
                  onClick={openOverlay}
                  onPointerMove={onTilt}
                  onPointerLeave={resetTilt}
                  style={{ rotateX, rotateY, borderRadius: 999 }}
                  variants={{
                    rest: { y: 0, scale: 1 },
                    hover: { y: -5, scale: 1.02 },
                    tap: { y: -1, scale: 0.97 },
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <span className="collab__btn-gloss" aria-hidden="true" />
                  <motion.span
                    className="collab__btn-sweep"
                    aria-hidden="true"
                    variants={{
                      rest: { x: '-140%', transition: { duration: 0 } },
                      hover: { x: '260%', transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  />
                  <span className="collab__btn-label">Let’s collaborate</span>
                </motion.button>
              ) : (
                <span className="collab__btn collab__btn--ghost" aria-hidden="true">
                  <span className="collab__btn-label">Let’s collaborate</span>
                </span>
              )}
            </motion.div>
          </div>
        </div>

        <div className="collab__foot wrap js-collab-fade">
          <p className="cap">
            {person.location} · {siteYear}
          </p>
          <p className="collab__alt collab__alt--foot">
            <span className="cap">Prefer email?</span>{' '}
            <a className="text-link" href={mailto()}>
              {contact.email}
            </a>
          </p>
        </div>
      </div>

      <AnimatePresence>{open && <ContactOverlay layoutId={LAYOUT_ID} onClose={closeOverlay} />}</AnimatePresence>
    </section>
  )
}
