import React from 'react'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import '../index.css'

export default function Terms() {
  return (
    <div className="container">
      <SiteNav />
      <div className="card">
        <h1>Terms of Use</h1>
        <p className="muted">Last updated: July 16, 2026</p>

        <section className="section">
          <h2>1. Service</h2>
          <p>
            Iterali provides a free cybersecurity game and optional structured learning content.
            By using the site you agree to these terms.
          </p>
        </section>

        <section className="section">
          <h2>2. Accounts</h2>
          <p>
            You are responsible for keeping your login details secure and for activity under your account.
            We may suspend access if these terms are breached.
          </p>
        </section>

        <section className="section">
          <h2>3. Acceptable use</h2>
          <p>
            Do not attempt to disrupt the service, access other users&apos; data or misuse the platform.
            Content is for learning purposes and must not be copied for commercial redistribution without permission.
          </p>
        </section>

        <section className="section">
          <h2>4. Liability</h2>
          <p>
            Iterali is provided as is. We do not guarantee uninterrupted availability.
            Training content supports awareness and skill building but does not replace professional security advice.
          </p>
        </section>

        <section className="section">
          <h2>5. Contact</h2>
          <p>
            Questions about these terms: use the <a href="/teams#contact">contact form</a> or see our <a href="/privacy">Privacy Policy</a>.
          </p>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}
