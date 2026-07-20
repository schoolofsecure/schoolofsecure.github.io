import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../index.css'

const individualPoints = [
  <>Start with one realistic case: emails, logins and decisions under pressure.</>,
  <>Review without blame. See the cue you used, then the safer next step.</>,
  <>We show what to practise next. Begin with the free game, then move into <strong className="landing-term">structured learning paths</strong>.</>,
]

const teamPoints = [
  <>Practise the decisions people face at work: phishing, social engineering and unsafe shortcuts.</>,
  <>Safe-to-fail modules and <strong className="landing-term">structured learning paths</strong> with one clear next step for each person.</>,
  <>Leaders see skill patterns and gaps, not individual mistake replays.</>,
]

const Landing = () => {
  return (
    <div className="container landing-page">
      <SiteNav />

      <section className="landing-hero" aria-label="Introduction">
        <div className="landing-hero-copy">
          <h1>Practise the decision you would make at work before it happens for real</h1>
          <p className="landing-hero-lead">
            Decide under pressure, review without blame and get one clear next step. Iterali helps individuals and teams build habits through realistic scenarios and <strong className="landing-term">structured learning paths</strong>.
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
          <p className="landing-path-label">For people who learn by deciding</p>
          <h2>Start with one case. We’ll show what to practise next</h2>
          <ul className="landing-path-list">
            {individualPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <div className="landing-path-actions">
            <Link to="/play" className="btn btn-primary">Play Free</Link>
            <Link to="/learn" className="landing-path-link">View learning paths</Link>
          </div>
        </article>

        <article className="landing-path">
          <p className="landing-path-label">For teams who practise safely</p>
          <h2>Skill patterns for leaders and safe-to-fail practice for everyone</h2>
          <ul className="landing-path-list">
            {teamPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
          <div className="landing-path-actions">
            <Link to="/teams" className="btn btn-secondary">For Teams</Link>
            <Link to="/teams#contact" className="landing-path-link">Request team access</Link>
          </div>
        </article>
      </section>

      <SiteFooter />

      <CookieBanner />
    </div>
  )
}

export default Landing
