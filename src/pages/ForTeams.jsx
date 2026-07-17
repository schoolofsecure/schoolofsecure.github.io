import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../index.css'
import '../styles/site.css'

const teamPoints = [
  <>Realistic practice for phishing, social engineering and unsafe behaviour.</>,
  <>Workplace focused modules and <strong className="landing-term">structured learning paths</strong> for everyday decisions.</>,
  <>Track team progress and spot knowledge gaps at scale.</>,
]

export default function ForTeams() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSubmitError('')
    try {
      const res = await fetch('https://formsubmit.co/ajax/erikapappkovacs@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          teamSize: form.teamSize,
          message: form.message || '(no message)',
          _subject: `Iterali team access request — ${form.company}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === 'false' || data.success === false) {
        throw new Error(data.message || 'Could not send the request.')
      }
      setSubmitted(true)
    } catch (_) {
      setSubmitError('Could not send the request. Please email erikapappkovacs@gmail.com directly.')
    } finally {
      setSending(false)
    }
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
            <p className="teams-contact-success">Thanks. We have received your request and will be in touch soon.</p>
          ) : (
            <form className="teams-contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input className="input" type="text" name="name" required value={form.name} onChange={handleChange} disabled={sending} />
              </label>
              <label>
                Work email
                <input className="input" type="email" name="email" required value={form.email} onChange={handleChange} disabled={sending} />
              </label>
              <label>
                Company
                <input className="input" type="text" name="company" required value={form.company} onChange={handleChange} disabled={sending} />
              </label>
              <label>
                Team size
                <select className="input" name="teamSize" required value={form.teamSize} onChange={handleChange} disabled={sending}>
                  <option value="">Select</option>
                  <option value="1-25">1–25</option>
                  <option value="26-100">26–100</option>
                  <option value="101-500">101–500</option>
                  <option value="500+">500+</option>
                </select>
              </label>
              <label className="teams-contact-full">
                Message <span className="teams-contact-optional">(optional)</span>
                <textarea className="input teams-contact-textarea" name="message" rows={4} value={form.message} onChange={handleChange} disabled={sending} />
              </label>
              {submitError && <p className="error teams-contact-full">{submitError}</p>}
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending…' : 'Send request'}
              </button>
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
