import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { freeLoginPath, getFirstFreeCaseId } from '../data/freeCases'
import '../styles/site.css'
import '../styles/freeCase.css'

export default function Play() {
  const firstCaseId = getFirstFreeCaseId()

  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '32px 0 24px' }}>
          <span className="badge-free">Free</span>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 12px' }}>
            Practise one realistic case
          </h1>
          <p className="section-lead">
            Decide under pressure, review without blame and get one clear next step. Start with a short workplace login decision. No account needed.
          </p>
        </header>

        <div className="free-case-card" style={{ marginBottom: 28 }}>
          <p className="muted" style={{ margin: '0 0 4px', fontSize: 13 }}>
            Path: {freeLoginPath.title} · step 1 of {freeLoginPath.totalSteps}
          </p>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontFamily: 'Rajdhani, Inter, sans-serif' }}>
            Session expired
          </h2>
          <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.55 }}>
            A familiar login popup, a two-minute countdown and a manager waiting on chat. What do you do?
          </p>
          <Link
            to={`/play/case/${firstCaseId}`}
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Start first case
          </Link>
        </div>

        <ul className="feature-list">
          <li>Safe-to-fail practice, not a test score on you</li>
          <li>Everyday decisions: emails, logins and shortcuts</li>
          <li>Clear feedback on the cue you used</li>
          <li>One recommended next step after each case</li>
        </ul>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link to={`/play/case/${firstCaseId}`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Start first case
          </Link>
          <Link to="/aurora" className="btn-secondary btn" style={{ textDecoration: 'none' }}>
            Enter Aurora
          </Link>
          <Link to="/learn" className="btn-ghost btn" style={{ textDecoration: 'none' }}>
            Structured learning paths
          </Link>
        </div>

        <div className="free-case-card" style={{ marginTop: 28 }}>
          <p className="muted" style={{ margin: '0 0 4px', fontSize: 13 }}>Aurora inside Iterali</p>
          <h2 style={{ margin: '0 0 8px', fontSize: 20, fontFamily: 'Rajdhani, Inter, sans-serif' }}>
            An Iterali story world, where workplace decisions shape what survives
          </h2>
          <p className="muted" style={{ margin: '0 0 14px', lineHeight: 1.55 }}>
            Aurora is not a separate product. It is the story layer that makes decision practice more engaging. Same safe-to-fail habits. For teams, skill patterns and gaps, not individual mistake replays.
          </p>
          <Link to="/aurora" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Enter Aurora
          </Link>
        </div>

        <p className="muted" style={{ marginTop: 20, fontSize: 14 }}>
          Why we ask later: sign in only if you want saved progress. Practice cases are not used to monitor you at work.
        </p>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
