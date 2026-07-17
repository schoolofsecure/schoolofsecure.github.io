import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../index.css'
import '../styles/site.css'

const CONTACT_EMAIL = 'erikapappkovacs@gmail.com'

const teamPoints = [
  <>Realistic practice for phishing, social engineering and unsafe behaviour.</>,
  <>Workplace focused modules and <strong className="landing-term">structured learning paths</strong> for everyday decisions.</>,
  <>Track team progress and spot knowledge gaps at scale.</>,
]

export default function ForTeams() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Iterali team access request — ${form.company}`)
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Work email: ${form.email}`,
        `Company: ${form.company}`,
        `Team size: ${form.teamSize}`,
        '',
        'Message:',
        form.message || '(no message)',
      ].join('\n')
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  useEffect(() => {
    if (window.location.hash === '#contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="site-page">
      <div className="container">
        <SiteNav />
        <header className="teams-hero">
          <p className="landing-path-label">For teams</p>
          <h1>Build security awareness your team will actually use</h1>
          <p className="section-lead">
            Iterali helps employees recognise real risks through practical scenarios, structured learning and workplace focused modules. Less checkbox training. More confidence in everyday decisions.
          </p>
        </header>

        <section className="section-block alt">
          <ul className="landing-path-list teams-list">
            {teamPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>

        <section id="contact" className="section-block teams-contact">
          <h2 className="teams-contact-title">Request team access</h2>
          <p className="section-lead">Tell us about your team and we will get back to you.</p>

          {submitted ? (
            <p className="teams-contact-success">
              Your email app should open with the request ready. Please send it to complete.
              If nothing opened, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          ) : (
            <form className="teams-contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input className="input" type="text" name="name" required value={form.name} onChange={handleChange} />
              </label>
              <label>
                Work email
                <input className="input" type="email" name="email" required value={form.email} onChange={handleChange} />
              </label>
              <label>
                Company
                <input className="input" type="text" name="company" required value={form.company} onChange={handleChange} />
              </label>
              <label>
                Team size
                <select className="input" name="teamSize" required value={form.teamSize} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="1-25">1–25</option>
                  <option value="26-100">26–100</option>
                  <option value="101-500">101–500</option>
                  <option value="500+">500+</option>
                </select>
              </label>
              <label className="teams-contact-full">
                Message <span className="teams-contact-optional">(optional)</span>
                <textarea className="input teams-contact-textarea" name="message" rows={4} value={form.message} onChange={handleChange} />
              </label>
              <button type="submit" className="btn btn-primary">Send request</button>
            </form>
          )}

          <Link to="/play" className="btn btn-ghost teams-cta-secondary">Or try the free game first</Link>
        </section>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
