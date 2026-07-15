import React from 'react'
import SiteNav from '../components/SiteNav'
import '../styles/site.css'

export default function ForTeams() {
  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header style={{ padding: '24px 0' }}>
          <h1 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>For Teams</h1>
          <p className="section-lead" style={{ margin: 0 }}>
            Help employees, students, or trainees build practical security awareness. Built for small businesses, companies, schools, universities, and training organisations.
          </p>
        </header>

        <section className="section-block alt">
          <h2 className="section-title">Team features</h2>
          <ul className="feature-list">
            <li>Invite learners to your organisation</li>
            <li>Assign learning paths by role or group</li>
            <li>View team progress at a glance</li>
            <li>Track lesson completion</li>
            <li>Identify knowledge gaps across topics</li>
            <li>Create custom scenarios (coming soon)</li>
            <li>Manage teams or classes</li>
            <li>Export progress reports</li>
          </ul>
        </section>

        <section className="section-block">
          <h2 className="section-title">Pricing</h2>
          <p className="section-lead">
            Custom pricing based on team size and requirements.
          </p>
          <a href="mailto:hello@iterali.com" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Contact Iterali
          </a>
        </section>
      </div>
    </div>
  )
}
