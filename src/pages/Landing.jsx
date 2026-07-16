import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../index.css'

const individualPoints = [
  <>Practice with realistic emails, logins and decisions.</>,
  <>Free game first, then <strong className="landing-term">structured learning paths</strong> when you want more.</>,
  <>Track progress and focus on what you need next.</>,
]

const teamPoints = [
  <>Realistic practice for phishing, social engineering and unsafe behaviour.</>,
  <>Workplace focused modules and <strong className="landing-term">structured learning paths</strong> for everyday decisions.</>,
  <>Track team progress and spot knowledge gaps at scale.</>,
]

const Landing = () => {
  return (
    <div className="container landing-page">
      <SiteNav />

      <section className="landing-hero" aria-label="Introduction">
        <div className="landing-hero-copy">
          <h1>Learn cybersecurity through realistic challenges</h1>
          <p className="landing-hero-lead">
            Build practical skills from your first case to real confidence. Iterali helps individuals and teams learn through realistic scenarios and <strong className="landing-term">structured learning paths</strong>.
          </p>
          <div className="landing-hero-ctas">
            <Link to="/play" className="btn btn-primary landing-hero-btn">Play Free</Link>
            <Link to="/teams" className="btn btn-secondary landing-hero-btn">For Teams</Link>
          </div>
        </div>
        <div className="landing-hero-media">
          <div className="terminal-card" role="img" aria-label="Atmosphere visual, neon terminal">
            <div className="terminal-bar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            </div>
            <div className="terminal-body">
              <div><span className="prompt">investigator@cm</span>:~$ trace --source breach.log</div>
              <div>› scanning network… <span style={{ color: 'var(--ok)' }}>OK</span></div>
              <div>› anomaly detected: <span style={{ color: 'var(--danger)' }}>UNAUTHORIZED ACCESS</span></div>
              <div>› decrypting payload… ████░░░░░ 42%</div>
              <div>› clue unlocked: <em>&quot;The password is hidden in the story.&quot;</em></div>
              <div>_ <span className="cursor"></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-paths" aria-label="Choose your path">
        <article className="landing-path">
          <p className="landing-path-label">For individuals</p>
          <h2>Build practical skills at your own pace</h2>
          <ul className="landing-path-list">
            {individualPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <div className="landing-path-actions">
            <Link to="/play" className="btn btn-primary">Play Free</Link>
            <Link to="/learn" className="btn btn-secondary">View learning paths</Link>
          </div>
        </article>

        <article className="landing-path">
          <p className="landing-path-label">For teams</p>
          <h2>Build security awareness your team will actually use</h2>
          <ul className="landing-path-list">
            {teamPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <div className="landing-path-actions">
            <Link to="/teams" className="btn btn-secondary">For Teams</Link>
            <Link to="/teams#contact" className="btn btn-ghost landing-path-link">Request team access</Link>
          </div>
        </article>
      </section>

      <SiteFooter />

      <CookieBanner />
    </div>
  )
}

export default Landing
