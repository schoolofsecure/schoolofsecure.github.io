import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../styles/site.css'

const challengeTypes = [
  'Phish or Legit',
  'Scam detection',
  'Safe or Unsafe',
  'Spot the Warning Signs',
  'What Should You Do?',
  'Password safety',
  'Privacy risks',
  'Suspicious links',
  'Fake login pages',
  'Social engineering scenarios',
]

export default function Play() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '32px 0 24px' }}>
          <span className="badge-free">Free</span>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 12px' }}>
            Test Your Cybersecurity Instincts
          </h1>
          <p className="section-lead">
            Play short, realistic cybersecurity challenges and learn how to recognize scams, phishing attempts, unsafe behavior, and common online threats.
          </p>
        </header>

        <ul className="feature-list">
          <li>Free access, permanently</li>
          <li>No technical knowledge required</li>
          <li>Short game sessions</li>
          <li>Immediate explanations</li>
          <li>Real-world scenarios</li>
        </ul>

        <section className="section-block alt" style={{ marginTop: 24 }}>
          <h2 className="section-title" style={{ fontSize: 22 }}>Challenge types</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {challengeTypes.map((c) => (
              <span
                key={c}
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.2)',
                  fontSize: 14,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
          <Link to="/aurora" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Start Free Game
          </Link>
          <Link to="/learn" className="btn-secondary btn" style={{ textDecoration: 'none' }}>
            Explore Learning
          </Link>
        </div>

        <p className="muted" style={{ marginTop: 20, fontSize: 14 }}>
          No account required to start playing. Sign in to save progress and scores.
        </p>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
