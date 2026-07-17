import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { valuesPillars, LINKEDIN_URL } from '../data/brand'
import '../styles/site.css'

export default function Values() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '24px 0' }}>
          <p className="landing-path-label" style={{ marginBottom: 8 }}>Our values</p>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>What Iterali stands for</h1>
          <p className="section-lead" style={{ margin: 0, maxWidth: 640 }}>
            Realistic practice, human-centered security, and privacy-first product choices — so people and teams can grow skills without fear of failing in public.
          </p>
        </header>

        <div className="values-page-grid">
          {valuesPillars.map((pillar) => (
            <article key={pillar.id} className="values-page-item">
              <h2>{pillar.title}</h2>
              <p>{pillar.long}</p>
            </article>
          ))}
        </div>

        <p className="muted" style={{ marginTop: 32, fontSize: 14 }}>
          Follow Iterali on{' '}
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
        </p>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/play" className="btn btn-primary" style={{ textDecoration: 'none' }}>Play Free</Link>
          <Link to="/teams" className="btn btn-secondary" style={{ textDecoration: 'none' }}>For Teams</Link>
        </div>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
