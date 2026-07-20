import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../styles/site.css'

export default function Pricing() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '24px 0' }}>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: 0 }}>Pricing</h1>
        </header>

        <p className="price-upgrade-hint">
          Start with Free. Upgrade when you want regular practice and tracked progress.
        </p>

        <div className="pricing-grid">
          <div className="price-card">
            <h2 style={{ margin: 0, fontFamily: 'Rajdhani, Inter, sans-serif' }}>Free</h2>
            <p className="price-amount">€0</p>
            <p className="price-desc">
              Try the decision-practice game and daily challenges with no commitment.
            </p>
            <p className="price-for-you">
              For you if… you want to experience real cybersecurity decisions safely before committing to a learning plan.
            </p>
            <ul className="feature-list">
              <li>Full access to the free cybersecurity game</li>
              <li>Short challenges with immediate answer explanations</li>
              <li>Basic score tracking</li>
              <li>Daily challenge</li>
            </ul>
            <Link to="/play" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 'auto' }}>
              Play Free
            </Link>
          </div>

          <div className="price-card highlight">
            <h2 style={{ margin: 0, fontFamily: 'Rajdhani, Inter, sans-serif' }}>Iterali Learning</h2>
            <p className="price-amount">€5.99</p>
            <p className="price-note">per month</p>
            <p className="price-note">or <strong>€49.99 per year</strong> · <span style={{ color: 'var(--accent)' }}>Best Value</span></p>
            <p className="price-desc">
              Build consistent decision skills with structured lessons and workplace modules.
            </p>
            <p className="price-for-you">
              For you if… you want regular practice, clear learning paths, and progress you can see over time.
            </p>
            <ul className="feature-list">
              <li>Full access to all learning paths</li>
              <li>Beginner lessons and practical exercises</li>
              <li>Workplace security modules</li>
              <li>Progress tracking and personalized recommendations</li>
              <li>Career introduction modules</li>
              <li>New monthly content</li>
              <li>No ads inside the learning platform</li>
            </ul>
            <Link to="/learn" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 'auto' }}>
              Start Learning
            </Link>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.6 }}>
          No certificates, accredited qualifications, official certifications, job guarantees, or lifetime access claims.
        </p>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
