import { useRef } from 'react'
import { Chapter, Words } from '../components/Chapter'
import { gsap, MQ, useGSAP } from '../lib/motion'
import { certifications, interests, languages, person } from '../content/profile'
import detail from '../assets/img/portrait-detail-690.webp'
import './Profile.css'

export function Profile() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionOK, () => {
        gsap.from('.js-chapter-line', {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
        gsap.from('.profile__quote .word__inner', {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.035,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.profile__quote', start: 'top 80%' },
        })
        gsap.fromTo(
          '.js-detail',
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.5,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: '.profile__figure', start: 'top 80%' },
          },
        )
        gsap.fromTo(
          '.js-detail-img',
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: '.profile__figure', start: 'top bottom', end: 'bottom top', scrub: 0.5 },
          },
        )
        gsap.from('.profile__col, .profile__lang, .profile__seek', {
          y: 36,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.profile__cols', start: 'top 85%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="profile" className="section profile" ref={root} aria-labelledby="profile-title">
      <div className="wrap">
        <Chapter n="02" label="Profile" />

        <div className="profile__grid">
          <figure className="profile__figure">
            <div className="profile__frame js-detail">
              <img
                className="js-detail-img"
                src={detail}
                width={690}
                height={922}
                alt={`${person.name}, close-up`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="cap profile__figcap">
              <span>Fig. 2</span>
              <span>Close-up, Rouen, 2026</span>
            </figcaption>
          </figure>

          <div className="profile__body">
            <h2 id="profile-title" className="sr-only">
              Profile
            </h2>
            <p className="profile__quote serif">
              <span className="profile__qmark" aria-hidden="true">
                “
              </span>
              <Words text="I turn user insights and data into clear dashboards and digital experiences." />
            </p>

            <div className="profile__cols">
              <div className="profile__col">
                <h3 className="cap">Background</h3>
                <p>
                  A B.Tech in Information Technology, now a Master in Management at NEOMA — combining consumer-focused
                  product design, brand partnerships and data analysis. Certified Pega System Architect.
                </p>
              </div>
              <div className="profile__col">
                <h3 className="cap">Approach</h3>
                <p>
                  Start with the people using it — research and test early. Shape the journey they go through. Then
                  measure it, with KPIs and clear dashboards.
                </p>
              </div>
              <div className="profile__col">
                <h3 className="cap">Off the clock</h3>
                <p>Woodworking, at national competition level — plus fitness and reading.</p>
                <p className="profile__certs cap">
                  {certifications.length} certifications · {interests.length} interests · {languages.length} languages
                </p>
              </div>
            </div>

            <div className="profile__langs">
              {languages.map((l) => (
                <div className="profile__lang" key={l.name}>
                  <span className="display profile__lang-name">{l.name}</span>
                  <span className="cap">{l.level}</span>
                </div>
              ))}
            </div>

            <p className="profile__seek">
              <span className="dot" aria-hidden="true" />
              <span className="cap profile__seek-label">Looking for</span>
              <span>{person.seeking}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
