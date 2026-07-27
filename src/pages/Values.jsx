import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { valuesPillars, howWeWork, founderBackground, LINKEDIN_URL } from '../data/brand'
import '../styles/site.css'

export default function Values() {
  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">Our values</p>
          <h1>Decide. Review. Next.</h1>
          <p className="teams-hero-lead">
            Iterali is built so people and teams can practise real decisions without fear of failing in public. Realistic cases, clear next steps and privacy you can see in the product.
          </p>
          <div className="teams-hero-ctas">
            <Link to="/teams" className="btn btn-secondary teams-btn">Teams</Link>
          </div>
        </div>
        <aside className="teams-hero-aside" aria-hidden="true">
          <div className="teams-aside-card">
            <p className="teams-aside-label">How we work</p>
            <p className="teams-aside-stat">Remote-friendly</p>
            <p className="teams-aside-note teams-aside-note--flush">
              Not stuck to one city. Trust and clear work — wherever we are.
            </p>
          </div>
        </aside>
      </header>

      <section className="teams-section" aria-labelledby="values-pillars-title">
        <h2 id="values-pillars-title" className="teams-section-title">What we stand for</h2>
        <div className="values-page-grid">
          {valuesPillars.map((pillar) => (
            <article key={pillar.id} className="values-page-item">
              <h3>{pillar.title}</h3>
              <p>{pillar.long}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teams-section" aria-labelledby="how-we-work-title" id="how-we-work">
        <div className="landing-path teams-contact-card values-how-we-work">
          <p className="landing-path-label">How we work</p>
          <h2 id="how-we-work-title">{howWeWork.title}</h2>
          {howWeWork.paragraphs.map((para) => (
            <p key={para.slice(0, 48)} className="values-how-we-work-p">{para}</p>
          ))}
          <p className="values-how-we-work-closing">{howWeWork.closing}</p>
        </div>
      </section>

      <section className="teams-section" aria-labelledby="founder-background-title">
        <p className="landing-path-label">Background</p>
        <h2 id="founder-background-title" className="teams-section-title values-founder-title">
          {founderBackground.title}
        </h2>
        <p className="values-founder-text">{founderBackground.text}</p>
      </section>

      <p className="muted" style={{ marginBottom: 32, fontSize: 14 }}>
        Follow Iterali on{' '}
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>.
      </p>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
