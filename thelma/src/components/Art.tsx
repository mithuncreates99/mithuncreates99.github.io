import { useRef, type RefObject } from 'react'
import type { Art as ArtKind } from '../content'
import { gsap, MQ, ScrollTrigger, useGSAP } from '../lib/motion'

const C = {
  bg: '#190b12',
  panel: '#27101c',
  wine: '#701a3d',
  berry: '#a12556',
  rose: '#c77b9b',
  pink: '#e5b5c7',
  white: '#f8f0f3',
  muted: '#b6a3ac',
}
const mono = { fontFamily: 'var(--mono)', letterSpacing: '0.14em' }

/** Plays its looping timeline only while the panel is on screen. */
function useLoop(scope: RefObject<SVGSVGElement | null>, build: (tl: gsap.core.Timeline) => void) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, paused: true })
        build(tl)
        gsap.from(scope.current, { opacity: 0, scale: 0.96, duration: 1, scrollTrigger: { trigger: scope.current, start: 'top 85%' } })
        ScrollTrigger.create({
          trigger: scope.current,
          start: 'top 90%',
          end: 'bottom 10%',
          onToggle: (s) => (s.isActive ? tl.play() : tl.pause()),
        })
      })
      return () => mm.revert()
    },
    { scope },
  )
}

function Pill({ x, y, label, w = 104 }: { x: number; y: number; label: string; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 15} width={w} height={30} rx={15} fill={C.bg} stroke={C.pink} strokeOpacity={0.35} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10.5} fill={C.white} style={mono}>
        {label}
      </text>
    </g>
  )
}

function Assets() {
  const ref = useRef<SVGSVGElement>(null)
  const hs = [150, 128, 134, 104, 92, 64]
  useLoop(ref, (tl) => {
    tl.fromTo('.bar', { scaleY: 0 }, { scaleY: 1, duration: 0.9, stagger: 0.09, ease: 'power3.out' })
      .fromTo('.trend', { strokeDashoffset: 420 }, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' }, 0.3)
      .fromTo('.tag', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 1.2)
      .fromTo('.pulse', { x: 0, opacity: 0 }, { x: 300, opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 0)
      .to('.pulse', { opacity: 0, duration: 0.3 })
      .to({}, { duration: 1.6 })
      .to('.bar, .trend, .tag', { opacity: 0, duration: 0.4 })
      .set('.bar, .trend, .tag', { opacity: 1 })
  })
  return (
    <svg ref={ref} viewBox="0 0 520 400" role="img" aria-label="Downtime falling across monitored IT assets">
      <text x={24} y={34} fontSize={10.5} fill={C.muted} style={mono}>
        IT ASSETS · STELLANTIS
      </text>
      <Pill x={110} y={86} label="MONITOR" />
      <Pill x={260} y={86} label="RESOLVE" />
      <Pill x={410} y={86} label="REPORT" />
      <path d="M166 86h38m-6-4 6 4-6 4M316 86h38m-6-4 6 4-6 4" stroke={C.pink} strokeOpacity={0.4} fill="none" />
      <circle className="pulse" cx={110} cy={86} r={5} fill={C.white} />
      {hs.map((h, i) => (
        <rect
          key={i}
          className="bar art-bar"
          x={88 + i * 62}
          y={330 - h}
          width={34}
          height={h}
          rx={4}
          fill={i === hs.length - 1 ? C.pink : C.rose}
          fillOpacity={i === hs.length - 1 ? 1 : 0.3}
        />
      ))}
      <polyline
        className="trend"
        points={hs.map((h, i) => `${105 + i * 62},${330 - h - 18}`).join(' ')}
        fill="none"
        stroke={C.pink}
        strokeWidth={1.8}
        strokeDasharray="420"
        strokeLinecap="round"
      />
      <line x1={60} y1={330.5} x2={470} y2={330.5} stroke={C.pink} strokeOpacity={0.25} />
      <g className="tag">
        <rect x={350} y={354} width={120} height={26} rx={13} fill={C.wine} fillOpacity={0.5} stroke={C.rose} />
        <text x={410} y={371} textAnchor="middle" fontSize={10.5} fill={C.pink} style={mono}>
          DOWNTIME −15%
        </text>
      </g>
    </svg>
  )
}

function Automation() {
  const ref = useRef<SVGSVGElement>(null)
  const xs = [70, 196, 322, 448]
  const labels = ['REQUEST', 'DESIGN', 'AUTOMATE', 'RESOLVED']
  useLoop(ref, (tl) => {
    tl.fromTo('.prog', { strokeDashoffset: 378 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
    xs.forEach((_, i) => {
      tl.fromTo(`.node${i}`, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'back.out(2.4)', transformOrigin: '50% 50%' }, i * 0.62)
    })
    tl.fromTo('.packet', { x: 0, opacity: 0 }, { x: 378, opacity: 1, duration: 2, ease: 'power2.inOut', stagger: 0.35 }, 0.2)
      .fromTo('.ok', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 2)
      .fromTo('.less', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 2.2)
      .to('.packet', { opacity: 0, duration: 0.3 }, 2.3)
      .to({}, { duration: 1.4 })
      .to('.node, .ok, .less', { opacity: 0, duration: 0.4 })
      .set('.node, .ok, .less', { opacity: 1 })
  })
  return (
    <svg ref={ref} viewBox="0 0 520 400" role="img" aria-label="A request flowing through an automated workflow to resolution">
      <text x={24} y={34} fontSize={10.5} fill={C.muted} style={mono}>
        SERVICENOW · RESOLVE
      </text>
      <line x1={xs[0]} y1={200} x2={xs[3]} y2={200} stroke={C.pink} strokeOpacity={0.2} strokeWidth={2} />
      <line className="prog" x1={xs[0]} y1={200} x2={xs[3]} y2={200} stroke={C.pink} strokeWidth={2} strokeDasharray="378" />
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={200} r={15} fill={C.bg} stroke={C.pink} strokeOpacity={0.55} />
          <circle className={`node node${i}`} cx={x} cy={200} r={8} fill={C.pink} />
          <text x={x} y={242} textAnchor="middle" fontSize={10} fill={C.muted} style={mono}>
            {labels[i]}
          </text>
        </g>
      ))}
      {[0, 1, 2].map((k) => (
        <circle key={k} className="packet" cx={xs[0]} cy={200} r={4} fill={C.white} />
      ))}
      <g className="ok">
        <rect x={384} y={132} width={110} height={28} rx={14} fill={C.rose} fillOpacity={0.16} stroke={C.rose} />
        <text x={439} y={150} textAnchor="middle" fontSize={10.5} fill={C.pink} style={mono}>
          AUTOMATED
        </text>
      </g>
      <g className="less">
        <rect x={46} y={278} width={170} height={28} rx={14} fill={C.panel} stroke={C.pink} strokeOpacity={0.3} />
        <text x={131} y={296} textAnchor="middle" fontSize={10.5} fill={C.muted} style={mono}>
          LESS MANUAL EFFORT
        </text>
      </g>
    </svg>
  )
}

function Cases() {
  const ref = useRef<SVGSVGElement>(null)
  const cx = 330
  const cy = 210
  const r = 102
  const nodes = [
    { a: -90, l: 'LOG' },
    { a: 30, l: 'ANALYZE' },
    { a: 150, l: 'RESOLVE' },
  ]
  useLoop(ref, (tl) => {
    tl.fromTo('.chan', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.15 })
      .fromTo('.feed', { strokeDashoffset: 80 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.15 }, 0.3)
      .fromTo('.orb', { rotation: 0 }, { rotation: 360, duration: 3.2, ease: 'none', svgOrigin: `${cx} ${cy}` }, 0.6)
      .fromTo('.sla', { scale: 0.85, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6, transformOrigin: '50% 50%', repeat: 3, yoyo: true }, 0.8)
      .to({}, { duration: 0.6 })
      .to('.chan, .feed', { opacity: 0, duration: 0.4 })
      .set('.chan, .feed', { opacity: 1 })
  })
  return (
    <svg ref={ref} viewBox="0 0 520 400" role="img" aria-label="Cases arriving by email, phone and chat, moving through log, analyse and resolve">
      <text x={24} y={34} fontSize={10.5} fill={C.muted} style={mono}>
        CLIENT CASES · SLA
      </text>
      {['EMAIL', 'PHONE', 'CHAT'].map((c, i) => (
        <g key={c}>
          <g className="chan">
            <rect x={28} y={150 + i * 42} width={86} height={28} rx={14} fill={C.panel} stroke={C.pink} strokeOpacity={0.3} />
            <text x={71} y={168 + i * 42} textAnchor="middle" fontSize={10} fill={C.white} style={mono}>
              {c}
            </text>
          </g>
          <path className="feed" d={`M116 ${164 + i * 42} C 170 ${164 + i * 42}, 180 ${cy}, ${cx - r - 6} ${cy}`} fill="none" stroke={C.pink} strokeOpacity={0.35} strokeDasharray="80" />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={r + 30} fill={C.wine} fillOpacity={0.14} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.pink} strokeOpacity={0.3} strokeDasharray="2 7" />
      <text className="sla" x={cx} y={cy + 10} textAnchor="middle" fontSize={30} fill={C.pink} style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>
        SLA
      </text>
      {nodes.map((n) => {
        const x = cx + r * Math.cos((n.a * Math.PI) / 180)
        const y = cy + r * Math.sin((n.a * Math.PI) / 180)
        return (
          <g key={n.l}>
            <rect x={x - 9} y={y - 9} width={18} height={18} rx={5} fill={C.bg} stroke={C.pink} strokeOpacity={0.7} />
            <text x={x} y={n.a < 0 ? y - 20 : y + 30} textAnchor="middle" fontSize={10.5} fill={C.muted} style={mono}>
              {n.l}
            </text>
          </g>
        )
      })}
      <g className="orb">
        <circle cx={cx} cy={cy - r} r={13} fill={C.pink} opacity={0.2} />
        <circle cx={cx} cy={cy - r} r={5} fill={C.white} />
      </g>
    </svg>
  )
}

function Dashboards() {
  const ref = useRef<SVGSVGElement>(null)
  const line = [210, 196, 204, 176, 168, 150, 132]
  const circ = 2 * Math.PI * 46
  useLoop(ref, (tl) => {
    tl.fromTo('.panel', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 })
      .fromTo('.loan', { strokeDashoffset: 330 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.3)
      .fromTo('.donut', { strokeDashoffset: circ }, { strokeDashoffset: circ * 0.28, duration: 1.4, ease: 'power2.inOut' }, 0.5)
      .fromTo('.kpi', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 1.2)
      .to({}, { duration: 1.6 })
      .to('.panel, .kpi', { opacity: 0, duration: 0.4 })
  })
  return (
    <svg ref={ref} viewBox="0 0 520 400" role="img" aria-label="A Power BI loan trend chart and a Tableau HR chart">
      <text x={24} y={34} fontSize={10.5} fill={C.muted} style={mono}>
        POWER BI · TABLEAU
      </text>
      <g className="panel">
        <rect x={28} y={64} width={290} height={190} rx={12} fill={C.bg} stroke={C.pink} strokeOpacity={0.22} />
        <text x={46} y={90} fontSize={10} fill={C.muted} style={mono}>
          LOAN TRENDS
        </text>
        {[130, 170, 210].map((y) => (
          <line key={y} x1={46} y1={y} x2={300} y2={y} stroke={C.pink} strokeOpacity={0.07} />
        ))}
        <polyline className="loan" points={line.map((y, i) => `${52 + i * 40},${y}`).join(' ')} fill="none" stroke={C.pink} strokeWidth={2} strokeDasharray="330" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g className="panel">
        <rect x={334} y={64} width={160} height={190} rx={12} fill={C.bg} stroke={C.pink} strokeOpacity={0.22} />
        <text x={352} y={90} fontSize={10} fill={C.muted} style={mono}>
          HR · PERFORMANCE
        </text>
        <circle cx={414} cy={170} r={46} fill="none" stroke={C.wine} strokeWidth={14} />
        <circle className="donut" cx={414} cy={170} r={46} fill="none" stroke={C.rose} strokeWidth={14} strokeDasharray={circ} transform="rotate(-90 414 170)" />
      </g>
      <g className="kpi">
        <rect x={28} y={276} width={225} height={86} rx={12} fill={C.panel} fillOpacity={0.7} stroke={C.pink} strokeOpacity={0.22} />
        <text x={46} y={302} fontSize={10} fill={C.muted} style={mono}>
          LOAN METRICS
        </text>
        <text x={46} y={342} fontSize={34} fill={C.white} style={{ fontFamily: 'var(--serif)' }}>
          10+
        </text>
      </g>
      <g className="kpi">
        <rect x={269} y={276} width={225} height={86} rx={12} fill={C.panel} fillOpacity={0.7} stroke={C.pink} strokeOpacity={0.22} />
        <text x={287} y={302} fontSize={10} fill={C.muted} style={mono}>
          FASTER DECISIONS
        </text>
        <text x={287} y={342} fontSize={34} fill={C.pink} style={{ fontFamily: 'var(--serif)' }}>
          30%
        </text>
      </g>
    </svg>
  )
}

export function Art({ kind }: { kind: ArtKind }) {
  if (kind === 'assets') return <Assets />
  if (kind === 'automation') return <Automation />
  if (kind === 'cases') return <Cases />
  return <Dashboards />
}
