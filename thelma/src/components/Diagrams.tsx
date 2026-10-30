/**
 * Information graphics for the case files. Every label comes from the CV
 * description of the role; the only figures shown are the ones the CV states.
 * Paths use pathLength="1" so GSAP can draw them with stroke-dashoffset 1 → 0.
 */

const arrowHead = (id: string, color: string) => (
  <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M1 1 L9 5 L1 9" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </marker>
)

function Label({ x, y, lines, anchor = 'middle' }: { x: number; y: number; lines: string[]; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y - (lines.length - 1) * 20} textAnchor={anchor} className="dg-label">
      {lines.map((l, j) => (
        <tspan key={l} x={x} dy={j ? 20 : 0}>
          {l}
        </tspan>
      ))}
    </text>
  )
}

/** Stellantis: assets → tracking → resolution → −15% downtime; data → dashboards → leadership. */
export function AssetsDiagram() {
  const top = [
    { x: 60, lines: ['500+', 'IT assets'] },
    { x: 190, lines: ['Issue', 'tracking'] },
    { x: 370, lines: ['Resolved with', 'cross-functional teams'] },
  ]
  const bottom = [
    { x: 60, lines: ['100+', 'data points'] },
    { x: 250, lines: ['Power BI &', 'Excel dashboards'] },
    { x: 450, lines: ['Recommendations', 'for leadership'] },
  ]
  return (
    <svg className="diagram" viewBox="0 0 600 362" role="img" aria-labelledby="assets-t">
      <title id="assets-t">
        500+ IT assets, issue tracking, then resolution with cross-functional teams: downtime down 15%. Separately,
        100+ data points feed Power BI and Excel dashboards that give leadership recommendations.
      </title>
      <defs>
        {arrowHead('ah-a', 'var(--ivory)')}
        {arrowHead('ah-ay', 'var(--yellow)')}
      </defs>
      <path className="draw dg-line" pathLength={1} d="M84 120 H164" markerEnd="url(#ah-a)" />
      <path className="draw dg-line" pathLength={1} d="M214 120 H344" markerEnd="url(#ah-a)" />
      <path className="draw dg-accent" pathLength={1} d="M394 120 H466" markerEnd="url(#ah-ay)" />
      {top.map((n, i) => (
        <g className="dg-node" key={n.lines[0]}>
          <circle cx={n.x} cy="120" r="22" className="dg-dot" />
          <text x={n.x} y="126" textAnchor="middle" className="dg-num">
            {i + 1}
          </text>
          <Label x={n.x} y={84} lines={n.lines} />
        </g>
      ))}
      <g className="dg-node">
        <text x="532" y="138" textAnchor="middle" className="dg-big dg-big--y">
          −15%
        </text>
        <text x="532" y="164" textAnchor="middle" className="dg-sub dg-sub--y">
          downtime
        </text>
      </g>

      <path className="draw dg-faint-line" pathLength={1} d="M20 200 H580" />

      <path className="draw dg-line" pathLength={1} d="M86 280 H222" markerEnd="url(#ah-a)" />
      <path className="draw dg-accent-red" pathLength={1} d="M278 280 H420" />
      {bottom.map((n, i) => (
        <g className="dg-node" key={n.lines[0]}>
          <rect x={n.x - 24} y="256" width="48" height="48" rx="2" className="dg-dot" />
          <text x={n.x} y="286" textAnchor="middle" className="dg-num">
            {String(i + 1).padStart(2, '0')}
          </text>
          <Label x={n.x} y={346} lines={n.lines} />
        </g>
      ))}
    </svg>
  )
}

/** KLA: interface errors → requirements → ServiceNow & Resolve → reliable process; dashboards rail. */
export function AutomationDiagram() {
  const steps = [
    { x: 60, lines: ['Interface', 'errors'] },
    { x: 220, lines: ['Business', 'requirements'] },
    { x: 380, lines: ['ServiceNow &', 'Resolve workflow'] },
    { x: 540, lines: ['Reliable,', 'scalable process'] },
  ]
  return (
    <svg className="diagram" viewBox="0 0 600 330" role="img" aria-labelledby="automation-t">
      <title id="automation-t">
        System interface errors, business requirements, ServiceNow and Resolve automation workflows, then a reliable,
        scalable process. Below, SQL and Python dashboards track performance and trends to improve service efficiency
        and issue turnaround.
      </title>
      <defs>{arrowHead('ah-k', 'var(--ivory)')}</defs>
      <path className="draw dg-line" pathLength={1} d="M20 130 H584" markerEnd="url(#ah-k)" />
      {steps.map((s, i) => (
        <g className="dg-node" key={s.lines[0]}>
          {i === 2 ? (
            <rect x={s.x - 26} y="104" width="52" height="52" rx="2" className="dg-dot dg-dot--y" transform={`rotate(45 ${s.x} 130)`} />
          ) : (
            <circle cx={s.x} cy="130" r="22" className="dg-dot" />
          )}
          <text x={s.x} y="136" textAnchor="middle" className="dg-num">
            {i + 1}
          </text>
          <Label x={s.x} y={86} lines={s.lines} />
        </g>
      ))}
      <path className="draw dg-accent" pathLength={1} d="M60 220 H540" />
      <path className="draw dg-accent" pathLength={1} d="M60 212 V228 M540 212 V228" />
      <text x="300" y="252" textAnchor="middle" className="dg-sub dg-sub--y">
        SQL & Python dashboards · performance and trends
      </text>
      <path className="draw dg-accent-red" pathLength={1} d="M60 286 H540" />
      <path className="draw dg-accent-red" pathLength={1} d="M60 278 V294 M540 278 V294" />
      <text x="300" y="318" textAnchor="middle" className="dg-sub dg-sub--r">
        better service efficiency and issue turnaround
      </text>
    </svg>
  )
}

/** Bible Tours: the dispute loop, end to end, around 15+ partners. */
export function DisputesDiagram() {
  const C = { x: 320, y: 240 }
  const R = 150
  const nodes = [
    { t: 'Log', s: 'every case, accurately' },
    { t: 'Root cause', s: 'what went wrong' },
    { t: 'Vendor liaison', s: 'hotels, transport, partners' },
    { t: 'Escalate', s: 'when needed' },
    { t: 'Close the loop', s: 'back to the customer' },
  ]
  const rad = (deg: number) => (deg * Math.PI) / 180
  const angle = (k: number) => -90 + k * 72
  const pt = (deg: number, r = R) => ({ x: C.x + r * Math.cos(rad(deg)), y: C.y + r * Math.sin(rad(deg)) })
  return (
    <svg className="diagram" viewBox="-70 -10 780 500" role="img" aria-labelledby="disputes-t">
      <title id="disputes-t">
        The dispute and complaint loop, owned end to end: log the case, find the root cause, liaise with vendors,
        escalate when needed, and close the loop with the customer. In the middle: 15+ vendor, hotel and transport
        partners.
      </title>
      <defs>{arrowHead('ah-d', 'var(--yellow)')}</defs>
      <circle className="dg-faint" cx={C.x} cy={C.y} r={R} fill="none" />
      {nodes.map((_, k) => {
        const a = pt(angle(k) + 17)
        const b = pt(angle(k + 1) - 17)
        return (
          <path
            key={`arc-${k}`}
            className="draw dg-accent"
            pathLength={1}
            d={`M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${R} ${R} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
            markerEnd="url(#ah-d)"
          />
        )
      })}
      {nodes.map((n, k) => {
        const p = pt(angle(k))
        const cos = Math.cos(rad(angle(k)))
        const sin = Math.sin(rad(angle(k)))
        const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
        const l = pt(angle(k), R + 50)
        const ly = sin < -0.6 ? l.y - 26 : sin > 0.6 ? l.y + 8 : l.y - 4
        return (
          <g className="dg-node" key={n.t}>
            <circle cx={p.x} cy={p.y} r="30" className="dg-dot" />
            <text x={p.x} y={p.y + 5} textAnchor="middle" className="dg-num">
              {String(k + 1).padStart(2, '0')}
            </text>
            <text x={l.x} y={ly} textAnchor={anchor} className="dg-label">
              {n.t}
            </text>
            <text x={l.x} y={ly + 20} textAnchor={anchor} className="dg-sub">
              {n.s}
            </text>
          </g>
        )
      })}
      <text x={C.x} y={C.y + 4} textAnchor="middle" className="dg-big">
        15+
      </text>
      <text x={C.x} y={C.y + 30} textAnchor="middle" className="dg-sub">
        partners
      </text>
    </svg>
  )
}
