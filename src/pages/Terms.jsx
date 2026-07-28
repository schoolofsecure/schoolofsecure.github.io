import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'

export default function Terms() {
  return (
    <div className="container">
      <SiteNav />
      <div className="card">
        <h1>Terms of Use</h1>
        <p className="muted">Last updated: July 27, 2026</p>

        <section className="section">
          <h2>1. Service</h2>
          <p>
            Iterali provides the Iterali Academy programme, information about team offerings, a newsletter, and optional
            practice and learning tools on this website. By using the site you agree to these terms.
          </p>
        </section>

        <section className="section">
          <h2>2. Academy and applications</h2>
          <p>
            Submitting an Academy application does not guarantee a place. We review applications and decide together whether
            the programme is a good fit. Places are limited per cohort.
          </p>
        </section>

        <section className="section">
          <h2>3. Accounts</h2>
          <p>
            If you create an account, you are responsible for keeping your login details secure and for activity under your account.
            We may suspend access if these terms are breached.
          </p>
        </section>

        <section className="section">
          <h2>4. Acceptable use</h2>
          <p>
            Do not attempt to disrupt the service, access other users&apos; data or misuse forms or the platform.
            Content is for learning and programme purposes and must not be copied for commercial redistribution without permission.
          </p>
        </section>

        <section className="section">
          <h2>5. Liability</h2>
          <p>
            Iterali is provided as is. We do not guarantee uninterrupted availability.
            Programme and learning content support calm, confident habits online but do not replace professional security or legal advice.
          </p>
        </section>

        <section className="section">
          <h2>6. Contact</h2>
          <p>
            Questions about these terms: use the <Link to="/contact">contact form</Link>, apply via{' '}
            <Link to="/academy">Academy</Link>, or see our <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </div>
      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
