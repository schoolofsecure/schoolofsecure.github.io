import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import '../styles/site.css'
import { submitToFormSubmit } from '../utils/formSubmit'

const teamPoints = [
  {
    title: 'Real workplace decisions',
    text: 'Practise phishing, social engineering and everyday shortcuts as they show up in real work.',
  },
  {
    title: 'Clear paths forward',
    text: 'Structured learning with one clear next step for each person. Everyone knows what to do next.',
  },
  {
    title: 'Insight leaders can use',
    text: 'See skill patterns and gaps across the team — so you know where to support growth.',
  },
]

function scrollToContact() {
  const el = document.getElementById('contact')
  if (!el) return
  window.setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 50)
}

export default function ForTeams() {
  const location = useLocation()
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
      await submitToFormSubmit({
        name: form.name,
        email: form.email,
        company: form.company,
        teamSize: form.teamSize,
        message: form.message || '(no message)',
        request: 'Team access request',
        _subject: `Iterali team access request — ${form.company}`,
        _replyto: form.email,
      })
      setSubmitted(true)
    } catch (_) {
      setSubmitError('Could not send the request. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (location.hash === '#contact') {
      scrollToContact()
    }
  }, [location.hash, location.pathname])

  return (
    <div className="container teams-page">
      <SiteNav />

      <header className="teams-hero">
        <div className="teams-hero-copy">
          <p className="landing-path-label">Teams</p>
          <h1>Help your team build calm, confident habits online</h1>
          <p className="teams-hero-lead">
            Practical scenarios and structured paths for everyday decisions. Safe to practise, easy to follow, designed for how people actually work.
          </p>
          <div className="teams-hero-ctas">
            <a
              href="#contact"
              className="btn btn-primary teams-btn"
              onClick={(e) => {
                e.preventDefault()
                scrollToContact()
              }}
            >
              Request team access
            </a>
          </div>
        </div>
        <aside className="teams-hero-aside" aria-hidden="true">
          <div className="teams-aside-card">
            <p className="teams-aside-label">Leaders see</p>
            <p className="teams-aside-stat">Skill patterns</p>
            <p className="teams-aside-note">Gaps by topic · not who clicked what</p>
            <div className="teams-aside-bars">
              <span style={{ width: '78%' }} />
              <span style={{ width: '54%' }} />
              <span style={{ width: '36%' }} />
            </div>
          </div>
        </aside>
      </header>

      <section className="teams-section" aria-labelledby="teams-benefits-title">
        <h2 id="teams-benefits-title" className="teams-section-title">What teams get</h2>
        <div className="teams-benefit-grid">
          {teamPoints.map((point) => (
            <article key={point.title} className="teams-benefit">
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="teams-section" aria-labelledby="teams-how-title">
        <h2 id="teams-how-title" className="teams-section-title">How it works</h2>
        <div className="teams-how-grid">
          <article className="landing-path teams-how-card">
            <p className="landing-path-label">Employees</p>
            <h3>Decide, review, next</h3>
            <p>Practise under pressure, review without blame, then take one clear next step.</p>
          </article>
          <article className="landing-path teams-how-card">
            <p className="landing-path-label">Leaders</p>
            <h3>Patterns that guide action</h3>
            <p>See where the team is strong and where to focus next. Clear explanations, minimal data, useful for planning.</p>
          </article>
        </div>
      </section>

      <section id="contact" className="teams-section teams-contact" aria-labelledby="teams-contact-title">
        <div className="landing-path teams-contact-card">
          <p className="landing-path-label">Get started</p>
          <h2 id="teams-contact-title">Request team access</h2>
          <p className="teams-contact-lead">
            Tell us about your team. We will show you how Iterali fits your size and goals.
          </p>
          <p className="teams-why-ask">
            Why we ask: name, work email and company so we can reply. We do not use this form to run phishing tests on your staff.
          </p>

          {submitted ? (
            <p className="teams-contact-success">Thanks. We have received your request and will be in touch soon.</p>
          ) : (
            <form className="teams-contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input className="input" type="text" name="name" required value={form.name} onChange={handleChange} disabled={sending} autoComplete="name" />
              </label>
              <label>
                Work email
                <input className="input" type="email" name="email" required value={form.email} onChange={handleChange} disabled={sending} autoComplete="email" />
              </label>
              <label>
                Company
                <input className="input" type="text" name="company" required value={form.company} onChange={handleChange} disabled={sending} autoComplete="organization" />
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
              <div className="teams-contact-full teams-form-actions">
                <button type="submit" className="btn btn-primary teams-btn" disabled={sending}>
                  {sending ? 'Sending…' : 'Send request'}
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
