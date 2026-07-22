import React, { useState } from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../index.css'

const Privacy = () => {
  const contactEmail = 'erikapappkovacs@gmail.com'
  const [revealedEmails, setRevealedEmails] = useState(false)

  const emailOrReveal = (
    revealedEmails ? (
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
    ) : (
      <span
        className="obf-emails"
        onClick={() => setRevealedEmails(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setRevealedEmails(true)
          }
        }}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
      >
        [show email address]
      </span>
    )
  )

  return (
    <div className="container">
      <SiteNav />
      <div className="card">
        <h1 id="adatkezeles">Privacy Policy</h1>
        <p className="muted">Last updated: July 17, 2026</p>
        <span className="pill">GDPR compliant</span>

        <div className="grid" style={{marginTop:'14px'}}>
          <section className="section">
            <h2>1. Data controller</h2>
            <p>
              The data controller for the Iterali cybersecurity learning platform (including the free practice game, learning paths and related web services) is <strong>Papp‑Kovács Erika</strong>. Contact:{' '}
              {emailOrReveal}
            </p>
          </section>

          <section className="section">
            <h2>2. Data we collect</h2>
            <ul>
              <li>Email address (account sign-in).</li>
              <li>Learning and game progress linked to your account (for example completed levels, scores and preferences), when you are signed in.</li>
            </ul>
          </section>

          <section className="section">
            <h2>3. Purpose and legal basis</h2>
            <ul>
              <li>Sign-in and account management for Iterali (consent – GDPR Article 6(1)(a)).</li>
              <li>Providing the game, learning content and progress tracking (consent / contract performance – GDPR Article 6(1)(a)/(b)).</li>
              <li>System security and troubleshooting (legitimate interest – GDPR Article 6(1)(f)).</li>
            </ul>
          </section>

          <section className="section">
            <h2>4. Retention period</h2>
            <ul>
              <li>Account and progress data: until you delete your account or withdraw consent, up to 24 months of inactivity maximum unless a longer period is required by law.</li>
              <li>Technical logs: up to 90 days.</li>
            </ul>
          </section>

          <section className="section">
            <h2>5. Processors and data transfers</h2>
            <ul>
              <li>Google Firebase (Authentication and data storage) – for sign-in and saving progress.</li>
            </ul>
            <p>Where data is transferred outside the EU, appropriate safeguards or adequacy decisions are in place.</p>
          </section>

          <section className="section" id="cookies">
            <h2>6. Cookies</h2>
            <p>This site uses only cookies that are strictly necessary for operation (settings, form protection, basic functionality, signed-in session). We do not use profiling or marketing cookies.</p>
          </section>

          <section className="section">
            <h2>7. Your rights</h2>
            <ul>
              <li>Request access to and information about your personal data.</li>
              <li>Request correction, deletion ("right to be forgotten") or restriction of processing.</li>
              <li>Withdraw consent at any time without giving a reason.</li>
              <li>Data portability (for automatically processed data).</li>
              <li>Lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH).</li>
            </ul>
          </section>

          <section className="section">
            <h2>8. Data security</h2>
            <p>We protect personal data with appropriate technical and organisational measures against unauthorised access, alteration or disclosure.</p>
          </section>

          <section className="section">
            <h2>9. Contact</h2>
            <p>
              For privacy-related inquiries:{' '}
              {emailOrReveal}
            </p>
          </section>

          <section className="section">
            <h2>10. Scope</h2>
            <p>
              This policy applies to Iterali as a cybersecurity learning platform: the website, free practice game, structured learning paths, team-oriented offerings and related features. If the policy changes, the updated version takes effect upon publication.
            </p>
          </section>
        </div>
      </div>
      <SiteFooter />
      <CookieBanner />
    </div>
  )
}

export default Privacy
