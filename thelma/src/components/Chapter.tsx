type ChapterProps = { n: string; label: string; tone?: 'ink' | 'paper' }

/** "03 ——————— Case files" — the running header used by every chapter. */
export function Chapter({ n, label, tone = 'ink' }: ChapterProps) {
  return (
    <div className={`chapter chapter--${tone}`} aria-hidden="true">
      <span className="cap chapter__n">{n}</span>
      <span className="chapter__line js-chapter-line" />
      <span className="cap">{label}</span>
    </div>
  )
}

/** Splits text into word spans for staggered line reveals. */
export function Words({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className={`word ${className}`}>
            <span className="word__inner">{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
