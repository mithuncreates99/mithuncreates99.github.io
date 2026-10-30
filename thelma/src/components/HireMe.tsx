import { useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { hire } from '../content'
import { gsap, MQ, reducedMotion, ScrollTrigger, useGSAP } from '../lib/motion'
import { HandIllustration } from './HandIllustration'
import { HAND_GRIP, HAND_PIVOT, HAND_VIEWBOX } from './handGeometry'

/**
 * Each thread ties onto the button at a point given as a fraction of its box,
 * with its own slack, weight and sway phase so the bundle looks hand-made.
 */
const THREADS = [
  { ax: 0.06, ay: 0.5, sag: 1.0, w: 1.3, phase: 0.0, gx: 0, gy: 0 },
  { ax: 0.16, ay: 0.08, sag: 0.7, w: 0.9, phase: 1.3, gx: 1.5, gy: -2 },
  { ax: 0.12, ay: 0.94, sag: 1.25, w: 1.0, phase: 2.1, gx: -1.2, gy: 1.6 },
  { ax: 0.3, ay: 0.97, sag: 1.5, w: 0.8, phase: 3.4, gx: 0.6, gy: 1.2 },
  { ax: 0.28, ay: 0.05, sag: 0.55, w: 1.0, phase: 4.6, gx: 2, gy: -1.2 },
  { ax: 0.08, ay: 0.24, sag: 0.9, w: 0.75, phase: 5.5, gx: -0.4, gy: -0.6 },
]

/** Furthest the button can be pulled from its resting place, in px. */
const REACH = 130

type Props = { onOpen: (opener: HTMLElement) => void }

/**
 * A drawn hand holding a bundle of threads tied to a glossy "Hire me" button.
 *
 * The threads are recomputed every frame from the hand's grip point to the
 * button, but only while the section is on screen and motion is allowed.
 * Pulling the button (mouse or touch) stretches the threads and tugs the hand;
 * letting go springs it back. A plain click, Enter or Space opens the dialog.
 */
export function HireMe({ onOpen }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const handWrapRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const pullRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const suppressClick = useRef(false)

  useGSAP(
    () => {
      const stage = root.current
      const handWrap = handWrapRef.current
      const hand = handRef.current
      const anchor = anchorRef.current
      const pullEl = pullRef.current
      const btn = btnRef.current
      const svg = svgRef.current
      if (!stage || !handWrap || !hand || !anchor || !pullEl || !btn || !svg) return

      const paths = pathRefs.current.filter((p): p is SVGPathElement => !!p)
      const reduced = reducedMotion()

      const geo = { gx: 0, gy: 0, px: 0, py: 0, bx: 0, by: 0, bw: 0, bh: 0, rest: 1 }
      const live = { tug: 0, hover: 0, t: 0, mx: 0, my: 0, m: 0, dx: 0, dy: 0 }

      const setHX = gsap.quickSetter(hand, 'x', 'px') as (v: number) => void
      const setHY = gsap.quickSetter(hand, 'y', 'px') as (v: number) => void
      const setHR = gsap.quickSetter(hand, 'rotation', 'deg') as (v: number) => void
      const setBX = gsap.quickSetter(pullEl, 'x', 'px') as (v: number) => void
      const setBY = gsap.quickSetter(pullEl, 'y', 'px') as (v: number) => void

      const measure = () => {
        const s = stage.getBoundingClientRect()
        svg.setAttribute('viewBox', `0 0 ${s.width.toFixed(1)} ${s.height.toFixed(1)}`)
        // offset* ignores transforms, so the hand's own motion doesn't skew this.
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
        geo.rest = Math.hypot(geo.bx + geo.bw * 0.1 - geo.gx, geo.by + geo.bh * 0.5 - geo.gy) || 1
      }

      const render = () => {
        // How far the button is from its resting distance: taut when pulled away.
        const bxc = geo.bx + geo.bw * 0.1 + live.dx
        const byc = geo.by + geo.bh * 0.5 + live.dy
        const toBtnX = bxc - geo.gx
        const toBtnY = byc - geo.gy
        const dist = Math.hypot(toBtnX, toBtnY) || 1
        const stretch = Math.max(0, (dist - geo.rest) / 70)
        const tight = Math.min(1, stretch + live.hover * 0.25 + live.tug * 0.6)

        // Hand: leans toward the pull, pivoting at the wrist; a tug draws it back.
        const ux = toBtnX / dist
        const uy = toBtnY / dist
        const lean = Math.min(stretch, 1.2)
        const hx = ux * 12 * lean - 11 * live.tug
        const hy = uy * 12 * lean + 7 * live.tug
        const deg = 4 * lean * Math.sign(ux) - 2.6 * live.tug
        setHX(hx)
        setHY(hy)
        setHR(deg)
        // A tug pulls the button a little toward the hand.
        const tbx = -5 * live.tug
        const tby = 3 * live.tug
        setBX(live.dx + tbx)
        setBY(live.dy + tby)

        const rad = (deg * Math.PI) / 180
        const cos = Math.cos(rad)
        const sin = Math.sin(rad)
        const ox = geo.gx - geo.px
        const oy = geo.gy - geo.py
        const gx = geo.px + ox * cos - oy * sin + hx
        const gy = geo.py + ox * sin + oy * cos + hy

        for (let i = 0; i < paths.length; i++) {
          const t = THREADS[i]
          const sx = gx + t.gx
          const sy = gy + t.gy
          const ax = geo.bx + t.ax * geo.bw + live.dx + tbx
          const ay = geo.by + t.ay * geo.bh + live.dy + tby
          const vx = ax - sx
          const vy = ay - sy
          const len = Math.hypot(vx, vy) || 1
          const nx = -vy / len
          const ny = vx / len
          const sag = len * 0.075 * t.sag * (1 - 0.85 * tight)
          const sway = reduced ? 0 : Math.sin(live.t * 0.85 + t.phase) * 3.4 * (1 - tight)
          let c1x = sx + vx * 0.32 + nx * (sag * 0.9 + sway)
          let c1y = sy + vy * 0.32 + ny * (sag * 0.9 + sway)
          let c2x = sx + vx * 0.7 + nx * (sag * 0.72 - sway * 0.6)
          let c2y = sy + vy * 0.7 + ny * (sag * 0.72 - sway * 0.6)
          if (live.m > 0.01) {
            // Threads lean gently toward the pointer, capped at ~14px.
            const k = 0.07 * live.m
            const lim = 14 * live.m * (1 - tight)
            c1x += Math.max(-lim, Math.min(lim, (live.mx - c1x) * k))
            c1y += Math.max(-lim, Math.min(lim, (live.my - c1y) * k))
            c2x += Math.max(-lim, Math.min(lim, (live.mx - c2x) * k * 1.2))
            c2y += Math.max(-lim, Math.min(lim, (live.my - c2y) * k * 1.2))
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

      // Continuous sway only while the stage is on screen.
      let ticking = false
      const tick = (time: number) => {
        live.t = time
        render()
      }
      const start = () => {
        if (ticking || reduced) return
        ticking = true
        gsap.ticker.add(tick)
      }
      const stop = () => {
        if (!ticking) return
        ticking = false
        gsap.ticker.remove(tick)
      }
      const redraw = () => !ticking && render()

      const tug = () => {
        gsap
          .timeline({ onUpdate: redraw })
          .to(live, { tug: 1.4, duration: reduced ? 0.12 : 0.22, ease: 'power3.out', overwrite: 'auto' })
          .to(live, { tug: 0, duration: reduced ? 0.3 : 1.8, ease: reduced ? 'power1.out' : 'elastic.out(1, 0.32)' })
      }

      // ---- dragging the button ------------------------------------------
      const drag = { on: false, id: -1, x0: 0, y0: 0, moved: false }

      // An occasional tug so the scene feels alive, while visible.
      const loop = gsap
        .timeline({ repeat: -1, paused: true })
        .to({}, { duration: 3.6 })
        .add(() => {
          if (!drag.on) tug()
        })
      const onDown = (e: PointerEvent) => {
        if (e.button !== 0) return
        drag.on = true
        drag.id = e.pointerId
        drag.moved = false
        drag.x0 = e.clientX - live.dx
        drag.y0 = e.clientY - live.dy
        gsap.killTweensOf(live, 'dx,dy')
      }
      const onMoveBtn = (e: PointerEvent) => {
        if (!drag.on || e.pointerId !== drag.id) return
        const rx = e.clientX - drag.x0
        const ry = e.clientY - drag.y0
        const d = Math.hypot(rx, ry)
        if (!drag.moved && d < 6) return
        if (!drag.moved) {
          drag.moved = true
          btn.setPointerCapture(e.pointerId)
          stage.dataset.dragging = 'true'
        }
        // Rubber band: easy at first, then harder the further it goes.
        const k = d ? (REACH * (1 - Math.exp(-d / REACH))) / d : 0
        live.dx = rx * k
        live.dy = ry * k
        redraw()
      }
      const onUp = (e: PointerEvent) => {
        if (!drag.on || e.pointerId !== drag.id) return
        drag.on = false
        delete stage.dataset.dragging
        if (drag.moved) {
          suppressClick.current = true
          window.setTimeout(() => (suppressClick.current = false), 0)
          gsap.to(live, {
            dx: 0,
            dy: 0,
            duration: reduced ? 0.25 : 1.4,
            ease: reduced ? 'power2.out' : 'elastic.out(1, 0.32)',
            onUpdate: redraw,
          })
        }
      }
      btn.addEventListener('pointerdown', onDown)
      btn.addEventListener('pointermove', onMoveBtn)
      btn.addEventListener('pointerup', onUp)
      btn.addEventListener('pointercancel', onUp)

      // Hover: a small tension; threads lean toward the pointer.
      const onEnterBtn = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && !reduced) gsap.to(live, { hover: 1, duration: 0.5, onUpdate: redraw, overwrite: 'auto' })
      }
      const onLeaveBtn = () => gsap.to(live, { hover: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', onUpdate: redraw, overwrite: 'auto' })
      btn.addEventListener('pointerenter', onEnterBtn)
      btn.addEventListener('pointerleave', onLeaveBtn)

      const qx = gsap.quickTo(live, 'mx', { duration: 0.5, ease: 'power3.out' })
      const qy = gsap.quickTo(live, 'my', { duration: 0.5, ease: 'power3.out' })
      const onStageMove = (e: PointerEvent) => {
        if (reduced || e.pointerType !== 'mouse') return
        const s = stage.getBoundingClientRect()
        qx(e.clientX - s.left)
        qy(e.clientY - s.top)
        if (live.m < 1) gsap.to(live, { m: 1, duration: 0.6, overwrite: 'auto' })
      }
      const onStageLeave = () => gsap.to(live, { m: 0, duration: 0.9, overwrite: 'auto' })
      stage.addEventListener('pointermove', onStageMove, { passive: true })
      stage.addEventListener('pointerleave', onStageLeave, { passive: true })
      handWrap.addEventListener('pointerdown', tug)

      const vis = ScrollTrigger.create({
        trigger: stage,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          if (self.isActive) {
            start()
            if (!reduced) loop.play()
          } else {
            stop()
            loop.pause()
          }
        },
      })

      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap
          .timeline({ scrollTrigger: { trigger: stage, start: 'top 78%', once: true } })
          .from(handWrap, { x: -160, y: 120, rotation: -12, opacity: 0, duration: 1.3, ease: 'expo.out' })
          .from(pullEl, { opacity: 0, scale: 0.8, duration: 1, ease: 'back.out(1.7)' }, 0.25)
          .to(paths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: 'power2.inOut' }, 0.55)
          .set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' })
      })

      return () => {
        ro.disconnect()
        stop()
        loop.kill()
        vis.kill()
        mm.revert()
        btn.removeEventListener('pointerdown', onDown)
        btn.removeEventListener('pointermove', onMoveBtn)
        btn.removeEventListener('pointerup', onUp)
        btn.removeEventListener('pointercancel', onUp)
        btn.removeEventListener('pointerenter', onEnterBtn)
        btn.removeEventListener('pointerleave', onLeaveBtn)
        stage.removeEventListener('pointermove', onStageMove)
        stage.removeEventListener('pointerleave', onStageLeave)
        handWrap.removeEventListener('pointerdown', tug)
        gsap.killTweensOf(live)
      }
    },
    { scope: root },
  )

  const onClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (suppressClick.current) {
      e.preventDefault()
      return
    }
    onOpen(e.currentTarget)
  }

  return (
    <div className="hire-stage" ref={root}>
      <svg className="hire-strings" ref={svgRef} aria-hidden="true" focusable="false">
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
      <div className="hire-hand" ref={handWrapRef} aria-hidden="true">
        <div className="hire-hand-inner" ref={handRef}>
          <HandIllustration />
        </div>
      </div>
      <div className="hire-anchor" ref={anchorRef}>
        <div className="hire-pull" ref={pullRef}>
          <span className="hire-shadow" aria-hidden="true" />
          <button ref={btnRef} type="button" className="hire-btn" aria-haspopup="dialog" onClick={onClick}>
            <span className="hire-gloss" aria-hidden="true" />
            <span className="hire-sweep" aria-hidden="true" />
            <span className="hire-label">{hire.button}</span>
          </button>
        </div>
      </div>
      <p className="hire-hint">{hire.stageHint}</p>
    </div>
  )
}
