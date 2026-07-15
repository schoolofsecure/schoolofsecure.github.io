import React, { useState } from 'react'
import SiteNav from '../components/SiteNav'
import '../index.css'

const Privacy = () => {
  const [revealedEmails, setRevealedEmails] = useState(false)
  const emails = ['secure@schoolofsecure.com']

  return (
    <div className="container">
      <SiteNav />
      <div className="card">
        <h1 id="adatkezeles">Privacy Policy</h1>
        <p className="muted">Last updated: December 2, 2025</p>
        <span className="pill">GDPR compliant</span>

        <div className="grid" style={{marginTop:'14px'}}>
          <section className="section">
            <h2>1. Data controller</h2>
            <p>The data controller for this interactive cybercrime mystery game is <strong>Papp‑Kovács Erika</strong>. Contact: 
              {revealedEmails ? (
                <span>
                  {emails.map((email, i) => (
                    <span key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                      {i < emails.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              ) : (
                <span 
                  className="obf-emails" 
                  onClick={() => setRevealedEmails(true)}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  [show email address]
                </span>
              )}
            </p>
          </section>

          <section className="section">
            <h2>2. Data we collect</h2>
            <ul>
              <li>Email address.</li>
            </ul>
          </section>

          <section className="section">
            <h2>3. Purpose and legal basis</h2>
            <ul>
              <li>Sign-in and account management for the game (consent – GDPR Article 6(1)(a)).</li>
              <li>System security and troubleshooting (legitimate interest – GDPR Article 6(1)(f)).</li>
            </ul>
          </section>

          <section className="section">
            <h2>4. Retention period</h2>
            <ul>
              <li>Account data: until withdrawal, up to 24 months maximum.</li>
              <li>Technical logs: up to 90 days.</li>
            </ul>
          </section>

          <section className="section">
            <h2>5. Processors and data transfers</h2>
            <ul>
              <li>Google Firebase (Authentication) – for sign-in and data storage.</li>
            </ul>
            <p>Where data is transferred outside the EU, appropriate safeguards or adequacy decisions are in place.</p>
          </section>

          <section className="section" id="cookies">
            <h2>6. Cookies</h2>
            <p>This site uses only cookies that are strictly necessary for operation (settings, form protection, basic functionality). We do not use profiling or marketing cookies.</p>
          </section>

          <section className="section">
            <h2>7. Your rights</h2>
            <ul>
              <li>Request access to and information about your personal data.</li>
              <li>Request correction, deletion ("right to be forgotten"), or restriction of processing.</li>
              <li>Withdraw consent at any time without giving a reason.</li>
              <li>Data portability (for automatically processed data).</li>
              <li>Lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH).</li>
            </ul>
          </section>

          <section className="section">
            <h2>8. Data security</h2>
            <p>We protect personal data with appropriate technical and organizational measures against unauthorized access, alteration, or disclosure.</p>
          </section>

          <section className="section">
            <h2>9. Contact</h2>
            <p>For privacy-related inquiries: 
              {revealedEmails ? (
                <span>
                  {emails.map((email, i) => (
                    <span key={email}>
                      <a href={`mailto:${email}`}>{email}</a>
                      {i < emails.length - 1 && ', '}
                    </span>
                  ))}
                </span>
              ) : (
                <span 
                  className="obf-emails" 
                  onClick={() => setRevealedEmails(true)}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  [show email address]
                </span>
              )}
            </p>
          </section>

          <section className="section">
            <h2>10. Scope</h2>
            <p>This policy applies to the Iterali interactive cybercrime mystery game and its web application. If it changes, the updated version takes effect upon publication.</p>
          </section>
        </div>
        <p className="footer">© 2025 Iterali – Privacy Policy</p>
      </div>
    </div>
  )
}

export default Privacy
