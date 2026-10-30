type Props = { n: string; label: string; heading: string[]; sub?: string; id?: string }

/** Eyebrow + serif heading with an italic gradient middle part. heading = [before, italic, after?] */
export function SectionHead({ n, label, heading, sub, id }: Props) {
  const [before, em, after] = heading
  return (
    <header className="sec-head" data-reveal-head>
      <p className="eyebrow">
        <b>{n}</b> {label}
      </p>
      <h2 className="h2" id={id}>
        {before}
        <em>{em}</em>
        {after}
      </h2>
      {sub && <p className="sub">{sub}</p>}
    </header>
  )
}
