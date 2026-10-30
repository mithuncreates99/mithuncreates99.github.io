import { person } from '../content'

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <span className="footer-sig">{person.first}</span>
        <small>
          © {YEAR} {person.name}
        </small>
        <a className="btn top-btn" href="#top">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
