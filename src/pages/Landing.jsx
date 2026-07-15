import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import '../index.css'

const Landing = () => {
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem('cookieConsent')) setCookieBannerVisible(true)
    } catch (e) {}
  }, [])

  return (
    <div className="container">
      <SiteNav />

      <section className="hero" aria-label="Main section">
        <div className="hero-copy">
          <h1>Learn cybersecurity through realistic challenges</h1>
          <p className="lead">
            Build practical skills from your first case to career-ready confidence. Start with a free investigative game, then go deeper with structured lessons, exercises, and workplace-focused modules.
          </p>
          <div className="features">
            <div className="feat"><h4>Real scenarios</h4><p>Situations that mirror actual emails, logins, and decisions.</p></div>
            <div className="feat"><h4>Build skills</h4><p>Structured lessons and exercises when you want to go deeper.</p></div>
            <div className="feat"><h4>Free to start</h4><p>Short investigative challenges as your entry point.</p></div>
            <div className="feat"><h4>Track progress</h4><p>See what you know and what to study next.</p></div>
          </div>
          <div className="cta-row">
            <div className="cta-block">
              <Link to="/play" className="btn btn-primary" style={{ textDecoration: 'none' }}>Play Free</Link>
              <p className="cta-micro">Your entry point — realistic scenarios, no setup required.</p>
            </div>
            <div className="cta-block">
              <Link to="/learn" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Explore Learning Paths</Link>
              <p className="cta-micro">Short lessons, progress tracking, and topics for learners who want to go further.</p>
            </div>
          </div>
        </div>
        <div className="hero-media">
          <div className="terminal-card" role="img" aria-label="Atmosphere visual, neon terminal">
            <div className="terminal-bar">
              <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            </div>
            <div className="terminal-body">
              <div><span className="prompt">investigator@cm</span>:~$ trace --source breach.log</div>
              <div>› scanning network… <span style={{ color: 'var(--ok)' }}>OK</span></div>
              <div>› anomaly detected: <span style={{ color: 'var(--danger)' }}>UNAUTHORIZED ACCESS</span></div>
              <div>› decrypting payload… ████░░░░░ 42%</div>
              <div>› clue unlocked: <em>"The password is hidden in the story."</em></div>
              <div>_ <span className="cursor"></span></div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ margin: '26px 0 10px' }}>
        <div className="features" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="feat">
            <span style={{ display: 'inline-block', marginBottom: '8px', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: 'var(--ok)', border: '1px solid rgba(51,255,153,0.35)', background: 'rgba(51,255,153,0.1)' }}>Free</span>
            <h4>Test Your Cybersecurity Instincts</h4>
            <p>Practice with realistic cases. Spot phishing, social engineering, and suspicious behavior. Always free.</p>
            <Link to="/aurora" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: '12px', padding: '10px 18px', fontSize: '14px' }}>Start Free Game</Link>
          </div>
          <div className="feat">
            <h4>Go Beyond the Game</h4>
            <p>Structured lessons, exercises, progress tracking, and workplace-focused modules for serious learners.</p>
            <Link to="/learn" className="btn btn-secondary" style={{ textDecoration: 'none', marginTop: '12px', padding: '10px 18px', fontSize: '14px' }}>View Learning Paths</Link>
          </div>
        </div>
      </section>

      <section style={{ margin: '10px 0 26px' }}>
        <h3 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 14px' }}>How it works</h3>
        <div className="features">
          <div className="feat"><h4>1. Play the game</h4><p>Realistic scenarios test how you handle pressure.</p></div>
          <div className="feat"><h4>2. Find weak spots</h4><p>See which topics need more practice.</p></div>
          <div className="feat"><h4>3. Keep learning</h4><p>Structured lessons build practical skills.</p></div>
          <div className="feat"><h4>4. Stay sharp</h4><p>New scenarios and content over time.</p></div>
        </div>
      </section>

      <section id="brief" className="sidebar-layout" style={{ margin: '28px 0 6px' }}>
        <div className="brief-left">
          <h3 style={{ fontFamily: 'Rajdhani, Inter, sans-serif', margin: '0 0 8px' }}>Why it works</h3>
          <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--muted)', lineHeight: 1.8 }}>
            <li>Real situations, not abstract tips — scenarios that mirror actual emails, logins, and decisions.</li>
            <li>You learn by doing — the free game gives quick practice; the platform adds exercises, feedback, and depth.</li>
            <li>Open to everyone, built for growth — plain language when you&apos;re starting out, and a clear path to workplace and career topics.</li>
            <li>A path that scales with you — basic awareness in the game, then structured learning for stronger habits and professional readiness.</li>
          </ul>
          <div className="tips" aria-label="Secure's cybersecurity tips">
            <h4>A few things Secure keeps mentioning</h4>
            <ul>
              <li>Curious if your email leaked? Check haveibeenpwned.com.</li>
              <li>Encrypt your home wifi. Still worth it, even at home.</li>
              <li>Turn on two factor auth. Passwords alone are not enough.</li>
              <li>Security questions? Make up the answers.</li>
              <li>Back up what matters offline. Cloud sync is not a backup.</li>
            </ul>
          </div>
        </div>
        <aside className="secure-figure" aria-label="Secure, cybersecurity expert">
          <img src="/images/secure.png" alt="Secure, cybersecurity expert portrait" loading="lazy" decoding="async" />
          <p className="secure-caption">
            I'm Secure. I pop up while you work through a case and point at things you might've skimmed past. Less lecture, more "hey, look at this line again."
          </p>
        </aside>
      </section>

      <section aria-label="Quote" style={{ margin: '10px 0 30px' }}>
        <blockquote style={{ margin: 0, padding: '14px 16px', background: '#0f1621', border: '1px solid rgba(207,230,255,0.08)', borderRadius: '12px', color: 'var(--ink)' }}>
          Real challenges. Practical skills. Part detective story, part puzzle box — with more terminal windows than you&apos;d expect from a game in your browser.
        </blockquote>
      </section>

      <footer style={{ padding: '40px 0', color: 'var(--muted)', fontSize: '13px', textAlign: 'center' }}>
        © 2025 Iterali. All rights reserved.
      </footer>

      {cookieBannerVisible && (
        <div id="cookieBanner" className="cookie-banner" role="region" aria-label="Cookie notice">
          <div className="cookie-card">
            <div className="cookie-text">We use a few cookies so login and saved progress work.</div>
            <div className="cookie-actions">
              <button type="button" className="btn-accept" onClick={() => { localStorage.setItem('cookieConsent', 'accepted'); setCookieBannerVisible(false) }}>Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing
