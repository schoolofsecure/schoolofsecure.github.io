import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import '../styles/site.css'

export default function Pricing() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '24px 0' }}>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>Pricing</h1>
          <p className="section-lead" style={{ margin: 0 }}>
            Start free with the game. Upgrade when you want structured lessons and progress tracking.
          </p>
        </header>

        <div className="pricing-grid">
          <div className="price-card">
            <span className="badge-free">Free</span>
            <h2 style={{ margin: 0, fontFamily: 'Rajdhani, Inter, sans-serif' }}>Free</h2>
            <p className="price-amount">€0</p>
            <ul className="feature-list">
              <li>Full access to the free cybersecurity game</li>
              <li>Short cybersecurity challenges</li>
              <li>Immediate answer explanations</li>
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
            <ul className="feature-list">
              <li>Full access to all learning paths</li>
              <li>Beginner cybersecurity lessons</li>
              <li>Practical exercises</li>
              <li>Progress tracking</li>
              <li>Personalized recommendations</li>
              <li>Workplace security modules</li>
              <li>Career introduction modules</li>
              <li>New monthly content</li>
              <li>No advertisements inside the learning platform</li>
            </ul>
            <Link to="/learn" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 'auto' }}>
              Start Learning
            </Link>
          </div>
        </div>

        <p className="muted" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.6 }}>
          No certificates, accredited qualifications, official certifications, job guarantees, or lifetime access claims.
        </p>
      </div>
    </div>
  )
}
