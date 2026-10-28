/**
 * Information graphics for the case files. Every label is taken from the CV
 * description of the project; nothing is quantified that the CV doesn't state.
 * Paths use pathLength="1" so GSAP can draw them with stroke-dashoffset 1 → 0.
 */

const arrowHead = (id: string, color: string) => (
  <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M1 1 L9 5 L1 9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </marker>
)

export function LoopDiagram() {
  // Centre 320,235, radius 150. Labels sit outside the ring, away from the arcs.
  const nodes = [
    { x: 320, y: 85, t: 'Design', s: 'interfaces & dashboards · Figma', lx: 320, ly: 22, anchor: 'middle' as const },
    { x: 470, y: 235, t: 'Test', s: 'user testing', lx: 520, ly: 230, anchor: 'start' as const },
    { x: 320, y: 385, t: 'Listen', s: 'feedback sessions', lx: 320, ly: 452, anchor: 'middle' as const },
    { x: 170, y: 235, t: 'Refine', s: 'usability & navigation', lx: 120, ly: 230, anchor: 'end' as const },
  ]
  return (
    <svg className="diagram" viewBox="-60 0 760 480" role="img" aria-labelledby="loop-t">
      <title id="loop-t">Design loop: design in Figma, test with users, listen in feedback sessions, refine usability and navigation, repeat.</title>
      <defs>{arrowHead('ah-y', 'var(--yellow)')}</defs>
      <circle className="dg-faint" cx="320" cy="235" r="150" fill="none" />
      <path className="draw dg-accent" pathLength={1} d="M358 91 A150 150 0 0 1 464 197" markerEnd="url(#ah-y)" />
      <path className="draw dg-accent" pathLength={1} d="M464 273 A150 150 0 0 1 358 379" markerEnd="url(#ah-y)" />
      <path className="draw dg-accent" pathLength={1} d="M282 379 A150 150 0 0 1 176 273" markerEnd="url(#ah-y)" />
      <path className="draw dg-accent" pathLength={1} d="M176 197 A150 150 0 0 1 282 91" markerEnd="url(#ah-y)" />
      {nodes.map((n, i) => (
        <g className="dg-node" key={n.t}>
          <circle cx={n.x} cy={n.y} r="32" className="dg-dot" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="dg-num">
            {String(i + 1).padStart(2, '0')}
          </text>
          <text x={n.lx} y={n.ly} textAnchor={n.anchor} className="dg-label">
            {n.t}
          </text>
          <text x={n.lx} y={n.ly + 20} textAnchor={n.anchor} className="dg-sub">
            {n.s}
          </text>
        </g>
      ))}
      <text x="320" y="243" textAnchor="middle" className="dg-center">
        team of 4
      </text>
    </svg>
  )
}

export function JourneyDiagram() {
  const steps = [['Verification'], ['Document', 'upload'], ['Account', 'setup'], ['Card', 'preferences']]
  const xs = [70, 225, 380, 535]
  return (
    <svg className="diagram" viewBox="0 0 600 330" role="img" aria-labelledby="journey-t">
      <title id="journey-t">
        Onboarding journey in four steps: verification, document upload, account setup, card preferences — with
        automated pricing logic and approval timelines.
      </title>
      <defs>{arrowHead('ah-i', 'var(--ivory)')}</defs>
      <path className="draw dg-line" pathLength={1} d="M20 130 H584" markerEnd="url(#ah-i)" />
      {steps.map((lines, i) => (
        <g className="dg-node" key={lines[0]}>
          <circle cx={xs[i]} cy="130" r="22" className="dg-dot" />
          <text x={xs[i]} y="136" textAnchor="middle" className="dg-num">
            {i + 1}
          </text>
          <text x={xs[i]} y={88 - (lines.length - 1) * 21} textAnchor="middle" className="dg-label">
            {lines.map((l, j) => (
              <tspan key={l} x={xs[i]} dy={j ? 21 : 0}>
                {l}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      <path className="draw dg-accent" pathLength={1} d="M70 210 H535" />
      <path className="draw dg-accent" pathLength={1} d="M70 202 V218 M535 202 V218" />
      <text x="302" y="242" textAnchor="middle" className="dg-sub dg-sub--y">
        automated pricing logic
      </text>
      <path className="draw dg-accent-red" pathLength={1} d="M70 276 H535" />
      <path className="draw dg-accent-red" pathLength={1} d="M70 268 V284 M535 268 V284" />
      <text x="302" y="308" textAnchor="middle" className="dg-sub dg-sub--r">
        approval timelines
      </text>
    </svg>
  )
}

export function PatientDiagram() {
  const steps = [
    { x: 70, lines: ['Appointment', 'booking'] },
    { x: 260, lines: ['Consultation'] },
    { x: 450, lines: ['KPI reports'] },
  ]
  // Schematic bars only — no values, the CV gives none.
  const bars = [38, 56, 44, 70, 62, 84]
  return (
    <svg className="diagram" viewBox="0 0 600 340" role="img" aria-labelledby="patient-t">
      <title id="patient-t">
        Patient journey: appointment booking, then consultation, then KPI reports tracking appointment statistics and
        trends. The bars are schematic.
      </title>
      <defs>{arrowHead('ah-p', 'var(--ivory)')}</defs>
      <path className="draw dg-line" pathLength={1} d="M100 150 H226" markerEnd="url(#ah-p)" />
      <path className="draw dg-line" pathLength={1} d="M294 150 H416" markerEnd="url(#ah-p)" />
      {steps.map((s, i) => (
        <g className="dg-node" key={s.lines[0]}>
          <rect x={s.x - 30} y="120" width="60" height="60" rx="2" className="dg-dot" />
          <text x={s.x} y="157" textAnchor="middle" className="dg-num">
            {String(i + 1).padStart(2, '0')}
          </text>
          <text x={s.x} y={96 - (s.lines.length - 1) * 20} textAnchor="middle" className="dg-label">
            {s.lines.map((l, j) => (
              <tspan key={l} x={s.x} dy={j ? 20 : 0}>
                {l}
              </tspan>
            ))}
          </text>
        </g>
      ))}
      <g className="dg-chart" transform="translate(405 220)">
        <path className="draw dg-faint-line" pathLength={1} d="M0 80 H120" />
        {bars.map((h, i) => (
          <rect key={i} className="dg-bar" x={6 + i * 19} y={80 - h * 0.8} width="11" height={h * 0.8} />
        ))}
        <path
          className="draw dg-accent"
          pathLength={1}
          d={bars.map((h, i) => `${i ? 'L' : 'M'}${11.5 + i * 19} ${80 - h * 0.8 - 8}`).join(' ')}
          fill="none"
        />
      </g>
      <text x="465" y="326" textAnchor="middle" className="dg-sub">
        appointment statistics & trends · schematic
      </text>
    </svg>
  )
}
