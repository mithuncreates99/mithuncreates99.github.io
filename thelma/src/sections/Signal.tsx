import { useId, useRef, type CSSProperties } from 'react'
import { Flashlight } from '../components/Flashlight'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { signals } from '../content/profile'
import './Signal.css'

/**
 * A field of exactly 500 dots — one per IT asset she tracked at Stellantis.
 * The dark layer is the raw field; the torch lights the signals inside it.
 */
const COLS = 25
const ROWS = 20

// A cluster of "issues" (dots that needed attention), drawn in red when lit.
const ISSUES: [number, number][] = [
  [9, 7], [10, 7], [10, 8], [11, 8], [9, 8],
  [15, 11], [16, 11], [16, 12], [14, 10],
  [19, 2], [4, 18], [9, 17], [23, 12],
]

// Rings mark the clusters that were tracked to resolution.
const RINGS: [number, number, number][] = [
  [10, 7.5, 36],
  [15.2, 11, 32],
]

// Each headline figure is pinned to a dot in the field (grid column, row).
const PINS: { i: number; j: number; side: 'left' | 'right' }[] = [
  { i: 2, j: 2, side: 'right' },
  { i: 22, j: 6, side: 'left' },
  { i: 3, j: 13, side: 'right' },
  { i: 23, j: 16, side: 'left' },
]

const cx = (i: number) => 10 + i * 20
const cy = (j: number) => 10 + j * 20

function Field({ lit }: { lit: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className="sg__field-frame">
      <svg className="sg__field" viewBox={`0 0 ${COLS * 20} ${ROWS * 20}`} aria-hidden="true">
        <defs>
          <pattern id={`dots-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.7" className="sg__dot" />
          </pattern>
        </defs>
        <rect width={COLS * 20} height={ROWS * 20} fill={`url(#dots-${id})`} />
        {ISSUES.map(([i, j]) => (
          <circle key={`${i}-${j}`} cx={cx(i)} cy={cy(j)} r="3.4" className="sg__issue" />
        ))}
        {RINGS.map(([i, j, r]) => (
          <circle key={`r-${i}`} cx={cx(i)} cy={cy(j)} r={r} className="sg__ring" />
        ))}
      </svg>

      {PINS.map((p, k) => {
        const s = signals[k]
        return (
          <div
            key={s.figure}
            className={`sg__pin sg__pin--${p.side} sg__pin--${s.tone}`}
            style={{ '--px': cx(p.i) / (COLS * 20), '--py': cy(p.j) / (ROWS * 20) } as CSSProperties}
          >
            <span className="sg__pin-dot" aria-hidden="true" />
            <span className="sg__pin-lead" aria-hidden="true" />
            <span className="sg__pin-card">
              <span className="sg__pin-fig display">{s.figure}</span>
              <span className="sg__pin-label">{s.label}</span>
              <span className="cap sg__pin-where">{s.where}</span>
            </span>
          </div>
        )
      })}
      {lit ? (
        <p className="cap sg__legend">
          <span className="sg__legend-dot" aria-hidden="true" /> 500 dots, one per IT asset ·{' '}
          <span className="sg__legend-dot sg__legend-dot--red" aria-hidden="true" /> issues tracked to resolution
        </p>
      ) : (
        <p className="cap sg__legend" aria-hidden="true">
          Raw data · 500 points
        </p>
      )}
    </div>
  )
}

function SignalScene({ lit }: { lit: boolean }) {
  return (
    <div className={`sg ${lit ? 'sg--lit' : 'sg--dark'}`}>
      <div className="sg__text">
        <div className="chapter sg__chapter">
          <span className="cap chapter__n">01</span>
          <span className="chapter__line js-sg-line" />
          <span className="cap">The signal</span>
        </div>

        {lit ? (
          <h2 id="signal-title" className="sg__title serif">
            Three years of data, <em>read for what it means.</em>
          </h2>
        ) : (
          <p className="sg__title serif">
            Three years of data, <em>read for what it means.</em>
          </p>
        )}
        <p className="sg__intro">
          Market research at Stellantis, process automation at KLA, operations at Bible Tours. The common thread is
          gathering qualitative and quantitative data, then turning it into recommendations leadership can act on.
        </p>

        <div className="sg__frags">
          <p className="sg__frag display">Data in.</p>
          <p className="sg__frag sg__frag--b display">
            <span className={lit ? 'mark-ink' : undefined}>Decisions</span> out.
          </p>
        </div>
      </div>

      <figure className="sg__figure">
        <Field lit={lit} />
        <ul className="sg__list" aria-hidden={lit ? undefined : true}>
          {signals.map((s) => (
            <li key={s.figure} className={`sg__item sg__item--${s.tone}`}>
              <span className="sg__item-fig display">{s.figure}</span>
              <span className="sg__item-label">{s.label}</span>
              <span className="cap sg__item-where">{s.where}</span>
            </li>
          ))}
        </ul>
      </figure>
    </div>
  )
}

export function Signal() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.js-sg-line', {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
        gsap.from('.sg__frag', {
          yPercent: 30,
          opacity: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.sg__frags', start: 'top 85%' },
        })
        gsap.from('.sg__field', {
          scale: 0.94,
          opacity: 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.sg__figure', start: 'top 80%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="signal" className="signal" ref={root} aria-labelledby="signal-title">
      <Flashlight
        label="The signal: a field of 500 data points with her headline results, revealed by a torch"
        base={<SignalScene lit={false} />}
        reveal={<SignalScene lit />}
        radius={250}
        rest={{ x: 70, y: 46 }}
        hint={{ pointer: 'Move across the data to find the signal', touch: 'Tap or drag across the data' }}
      />
    </section>
  )
}
