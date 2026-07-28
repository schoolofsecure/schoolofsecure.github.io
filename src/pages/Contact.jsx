import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { submitToFormSubmit, FORMSUBMIT_EMAIL } from '../utils/formSubmit'
import '../styles/site.css'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setSubmitError('')
    try {
      await submitToFormSubmit({
        name: form.name,
        email: form.email,
        message: form.message,
        request: 'Personal contact',
        _subject: `Iterali contact: ${form.name}`,
        _replyto: form.email,
      })
      setSubmitted(true)
    } catch (_) {
      setSubmitError('Could not send your message. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="teams-section teams-contact" aria-labelledby="contact-title">
        <div className="landing-path teams-contact-card">
          <p className="landing-path-label">Contact</p>
          <h1 id="contact-title">Get in touch</h1>
          <p className="teams-contact-lead">
            Questions about the Academy, the site, or anything else? Send a short message. A real person will reply, usually within a day.
          </p>
          <p className="teams-why-ask">
            Why we ask: name and email so we can reply. You can also write to{' '}
            <a href={`mailto:${FORMSUBMIT_EMAIL}`}>{FORMSUBMIT_EMAIL}</a>.
            {' '}Looking for team access? Use the{' '}
            <Link to="/teams#contact">teams form</Link>.
          </p>

          {submitted ? (
            <p className="teams-contact-success">Thanks. We have received your message and will be in touch soon.</p>
          ) : (
            <form className="teams-contact-form contact-personal-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  className="input"
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  disabled={sending}
                  autoComplete="name"
                />
              </label>
              <label>
                Email
                <input
                  className="input"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={sending}
                  autoComplete="email"
                />
              </label>
              <label className="teams-contact-full">
                Message
                <textarea
                  className="input teams-contact-textarea"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  disabled={sending}
                />
              </label>
              {submitError && <p className="error teams-contact-full">{submitError}</p>}
              <div className="teams-contact-full teams-form-actions">
                <button type="submit" className="btn btn-primary teams-btn" disabled={sending}>
                  {sending ? 'Sending…' : 'Send message'}
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
