import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { freeLoginPath, getFirstFreeCaseId } from '../data/freeCases'
import '../index.css'
import '../styles/site.css'

const playBenefits = [
  {
    title: 'Safe to fail',
    text: 'Safe-to-fail practice, not a test score on you.',
  },
  {
    title: 'Everyday decisions',
    text: 'Everyday decisions: emails, logins and shortcuts.',
  },
  {
    title: 'Clear feedback',
    text: 'Clear feedback on the cue you used.',
  },
  {
    title: 'One next step',
    text: 'One recommended next step after each case.',
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
            <p className="teams-aside-note" style={{ marginBottom: 0 }}>
              Decide under pressure, review without blame, and get one clear next step.
            </p>
          </div>
        </aside>
      </header>

      <section className="teams-section" aria-labelledby="play-benefits-title">
        <h2 id="play-benefits-title" className="teams-section-title">
          What you get
        </h2>
        <div className="play-benefit-grid">
          {playBenefits.map((point) => (
            <article key={point.title} className="teams-benefit">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teams-section" aria-labelledby="play-more-title">
        <h2 id="play-more-title" className="teams-section-title">
          Go further when you want
        </h2>
        <div className="teams-how-grid">
          <article className="landing-path teams-how-card">
            <p className="landing-path-label">Aurora inside Iterali</p>
            <h3>An Iterali story world</h3>
            <p>
              Workplace decisions shape what survives. Same safe-to-fail habits — a story layer that makes practice more engaging.
            </p>
            <Link to="/aurora" className="btn btn-secondary teams-btn" style={{ marginTop: 16 }}>
              Explore the Aurora story world
            </Link>
          </article>
          <article className="landing-path teams-how-card">
            <p className="landing-path-label">Later</p>
            <h3>Structured learning paths</h3>
            <p>
              Want more structure later? Build consistent skills with lessons, workplace modules and tracked progress.
            </p>
            <Link to="/learn" className="btn btn-secondary teams-btn" style={{ marginTop: 16 }}>
              See structured learning paths
            </Link>
          </article>
        </div>
      </section>

      <section className="teams-section" aria-labelledby="play-signin-title">
        <div className="landing-path teams-contact-card">
          <p className="landing-path-label">Progress</p>
          <h2 id="play-signin-title">Sign in only if you want</h2>
          <p className="teams-why-ask" style={{ marginBottom: 0 }}>
            Why we ask later: sign in only if you want saved progress. Practice cases are not used to monitor you at work.
          </p>
        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
