import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'

const Privacy = () => {
  return (
    <div className="container">
      <SiteNav />
      <div className="card">
        <h1 id="adatkezeles">Privacy Policy</h1>
        <p className="muted">Last updated: July 27, 2026</p>
        <span className="pill">GDPR compliant</span>

        <div className="grid" style={{ marginTop: '14px' }}>
          <section className="section">
            <h2>1. Data controller</h2>
            <p>
              The data controller for Iterali (the Academy programme, website and related learning tools) is{' '}
              <strong>Papp-Kovacs Erika</strong>. Contact:{' '}
              <Link to="/contact">use the contact form</Link>.
            </p>
          </section>

          <section className="section">
            <h2>2. Data we collect</h2>
            <ul>
              <li>
                <strong>Academy applications:</strong> name, email, location/timezone, situation, professional background,
                how you heard about us, and why you are applying.
              </li>
              <li>
                <strong>Newsletter:</strong> email address.
              </li>
              <li>
                <strong>Personal contact form:</strong> name, email and message.
              </li>
              <li>
                <strong>Signed-in accounts</strong> (when you create one): email and learning/practice progress linked to your account
                (for example completed items, scores and preferences).
              </li>
            </ul>
          </section>

          <section className="section">
            <h2>3. Purpose and legal basis</h2>
            <ul>
              <li>
                Handling Academy applications and deciding on places together (pre-contractual steps / consent — GDPR Article 6(1)(a)/(b)).
              </li>
              <li>
                Sending the newsletter if you subscribe (consent — GDPR Article 6(1)(a)).
              </li>
              <li>
                Responding to contact requests (pre-contractual steps / legitimate interest — GDPR Article 6(1)(b)/(f)).
              </li>
              <li>
                Account sign-in and saving progress when you use signed-in features (consent / contract performance — GDPR Article 6(1)(a)/(b)).
              </li>
              <li>
                System security and troubleshooting (legitimate interest — GDPR Article 6(1)(f)).
              </li>
            </ul>
          </section>

          <section className="section">
            <h2>4. Retention period</h2>
            <ul>
              <li>
                Application and contact form messages: as long as needed to handle your request, then typically up to 24 months unless a longer period is required by law.
              </li>
              <li>
                Newsletter email: until you unsubscribe or ask us to delete it.
              </li>
              <li>
                Account and progress data: until you delete your account or withdraw consent, up to 24 months of inactivity maximum unless a longer period is required by law.
              </li>
              <li>Technical logs: up to 90 days.</li>
            </ul>
          </section>

          <section className="section">
            <h2>5. Processors and data transfers</h2>
            <ul>
              <li>
                <strong>FormSubmit</strong> — to deliver Academy interest forms, newsletter sign-ups and personal contact requests to us.
              </li>
              <li>
                <strong>Google Firebase</strong> (Authentication and data storage) — for sign-in and saving progress when you use an account.
              </li>
            </ul>
            <p>Where data is transferred outside the EU, appropriate safeguards or adequacy decisions are in place.</p>
          </section>

          <section className="section" id="cookies">
            <h2>6. Cookies</h2>
            <p>
              This site uses only cookies that are strictly necessary for operation (settings, form protection, basic functionality,
              signed-in session). We do not use profiling or marketing cookies.
            </p>
          </section>

          <section className="section">
            <h2>7. Your rights</h2>
            <ul>
              <li>Request access to and information about your personal data.</li>
              <li>Request correction, deletion (&quot;right to be forgotten&quot;) or restriction of processing.</li>
              <li>Withdraw consent at any time without giving a reason.</li>
              <li>Data portability (for automatically processed data).</li>
              <li>
                Lodge a complaint with the Hungarian National Authority for Data Protection and Freedom of Information (NAIH).
              </li>
            </ul>
          </section>

          <section className="section">
            <h2>8. Data security</h2>
            <p>
              We protect personal data with appropriate technical and organisational measures against unauthorised access, alteration or disclosure.
            </p>
          </section>

          <section className="section">
            <h2>9. Contact</h2>
            <p>
              For privacy-related inquiries:{' '}
              <Link to="/contact">use the contact form</Link>.
            </p>
          </section>

          <section className="section">
            <h2>10. Scope</h2>
            <p>
              This policy applies to Iterali as offered today: the website, Iterali Academy applications, newsletter,
              optional signed-in practice/learning features and related services. If the policy changes, the updated version takes effect upon publication.
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
