import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import PromoCard from '../components/PromoCard'
import { freeLoginPath, getFirstFreeCaseId } from '../data/freeCases'
import '../styles/site.css'

const playBenefits = [
  { title: 'Safe to fail', text: 'Safe-to-fail practice, not a test score on you.' },
  { title: 'Everyday decisions', text: 'Everyday decisions: emails, logins and shortcuts.' },
  { title: 'Clear feedback', text: 'Clear feedback on the cue you used.' },
  { title: 'One next step', text: 'One recommended next step after each case.' },
]

const playPromos = [
  {
    label: 'Aurora inside Iterali',
    title: 'An Iterali story world',
    text: 'Workplace decisions shape what survives. Same safe-to-fail habits — a story layer that makes practice more engaging.',
    to: '/aurora',
    linkLabel: 'Explore the Aurora story world',
  },
  {
    label: 'Later',
    title: 'Structured learning paths',
    text: 'Want more structure later? Build consistent skills with lessons, workplace modules and tracked progress.',
    to: '/learn',
    linkLabel: 'See structured learning paths',
  },
]

export default function Play() {
  const firstCaseId = getFirstFreeCaseId()

  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">
            {freeLoginPath.title} · step 1 of {freeLoginPath.totalSteps}
          </p>
          <h1>Practise one realistic case</h1>
          <p className="teams-hero-lead">
            Start with a short workplace login decision. No account needed.
          </p>
          <div className="teams-hero-ctas">
            <Link to={`/play/case/${firstCaseId}`} className="btn btn-primary teams-btn">
              Start first case
            </Link>
            <Link to="/aurora" className="btn btn-secondary teams-btn">
              Explore Aurora
            </Link>
          </div>
        </div>
        <aside className="teams-hero-aside" aria-label="First case">
          <div className="teams-aside-card">
            <p className="teams-aside-label">First case</p>
            <p className="teams-aside-stat">Session expired</p>
            <p className="teams-aside-note">
              A familiar login popup, a two-minute countdown and a manager waiting on chat. What do you do?
            </p>
            <p className="teams-aside-note teams-aside-note--flush">
              Decide under pressure, review without blame and get one clear next step.
            </p>
          </div>
        </aside>
      </header>

      <section className="teams-section" aria-labelledby="play-benefits-title">
        <h2 id="play-benefits-title" className="teams-section-title">What you get</h2>
        <div className="teams-benefit-grid teams-benefit-grid--2col">
          {playBenefits.map((point) => (
            <article key={point.title} className="teams-benefit">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teams-section" aria-labelledby="play-more-title">
        <h2 id="play-more-title" className="teams-section-title">Go further when you want</h2>
        <div className="teams-how-grid">
          {playPromos.map((card) => (
            <PromoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="teams-section" aria-labelledby="play-signin-title">
        <div className="landing-path teams-contact-card">
          <p className="landing-path-label">Progress</p>
          <h2 id="play-signin-title">Sign in only if you want</h2>
          <p className="teams-why-ask teams-why-ask--flush">
            Why we ask later: sign in only if you want saved progress. Practice cases are not used to monitor you at work.
          </p>
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
