import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { submitToFormSubmit } from '../utils/formSubmit'
import AcademyCohortNote from '../components/AcademyCohortNote'
import '../styles/site.css'

const SITUATIONS = [
  { id: 'employed', label: "I'm employed full-time and want calmer, clearer habits online alongside work" },
  { id: 'team', label: "I lead or support others and want better online decisions for myself and my team" },
  { id: 'freelance', label: "I'm self-employed or freelance and want steadier digital habits day to day" },
  { id: 'student', label: "I'm a student and want to feel more confident online while I study" },
  { id: 'between', label: "I'm between roles and resetting how I show up online" },
  { id: 'home', label: "I manage a lot of family or household life online and want less stress around it" },
  { id: 'other', label: 'Other' },
]

const STEPS = [
  'intro',
  'serious',
  'location',
  'situation',
  'background',
  'source',
  'whyNow',
  'contact',
]

export default function AcademyApply() {
  const [stepIndex, setStepIndex] = useState(0)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [form, setForm] = useState({
    serious: '',
    location: '',
    situation: '',
    situationOther: '',
    background: '',
    source: '',
    whyNow: '',
    fullName: '',
    email: '',
  })

  const step = STEPS[stepIndex]
  const questionSteps = STEPS.length - 1
  const progress = step === 'intro' ? 0 : Math.round((stepIndex / questionSteps) * 100)

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError('')
  }

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const handleSerious = (value) => {
    setField('serious', value)
    if (value === 'no') {
      setDeclined(true)
      return
    }
    setDeclined(false)
    goNext()
  }

  const canContinue = () => {
    switch (step) {
      case 'location':
        return form.location.trim().length > 1
      case 'situation':
        return form.situation && (form.situation !== 'other' || form.situationOther.trim().length > 1)
      case 'background':
        return form.background.trim().length > 20
      case 'source':
        return form.source.trim().length > 2
      case 'whyNow':
        return form.whyNow.trim().length > 40
      case 'contact':
        return form.fullName.trim().length > 1 && /.+@.+\..+/.test(form.email)
      default:
        return true
    }
  }

  const handleContinue = async (e) => {
    e?.preventDefault?.()
    if (step === 'intro') {
      goNext()
      return
    }
    if (!canContinue()) {
      setSubmitError('Please give a fuller answer before continuing.')
      return
    }
    if (step !== 'contact') {
      goNext()
      return
    }

    setSending(true)
    setSubmitError('')
    try {
      const situationLabel =
        form.situation === 'other'
          ? `Other: ${form.situationOther}`
          : SITUATIONS.find((s) => s.id === form.situation)?.label || form.situation

      await submitToFormSubmit({
        fullName: form.fullName,
        email: form.email,
        serious: form.serious,
        location: form.location,
        situation: situationLabel,
        background: form.background,
        source: form.source,
        whyNow: form.whyNow,
        request: 'Academy application',
        _subject: `Iterali Academy application — ${form.fullName}`,
        _replyto: form.email,
      })
      setSubmitted(true)
    } catch (_) {
      setSubmitError('Could not send your application. Please try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault()
      if (canContinue() && !sending) handleContinue()
    }
  }

  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="academy-apply" aria-labelledby="academy-apply-title">
        {step !== 'intro' && !submitted && !declined && (
          <div className="academy-apply-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        )}

        {submitted ? (
          <div className="academy-apply-card academy-apply-panel">
            <p className="landing-path-label">Application received</p>
            <h1 id="academy-apply-title" className="academy-apply-title">Thank you, {form.fullName.split(' ')[0]}.</h1>
            <p className="academy-apply-lead">
              We read every application. If it looks like a good fit, you will get a link to book a short call with our team.
            </p>
            <Link to="/academy" className="academy-apply-back">
              Back to Academy
            </Link>
          </div>
        ) : declined ? (
          <div className="academy-apply-card academy-apply-panel">
            <p className="landing-path-label">Not the right fit right now</p>
            <h1 id="academy-apply-title" className="academy-apply-title">No problem.</h1>
            <p className="academy-apply-lead">
              The Academy is for people who want to practise calm, confident habits online with real commitment. You are welcome to explore the site, join the newsletter, or come back when the timing feels right.
            </p>
            <div className="academy-apply-actions academy-apply-actions--split">
              <Link to="/" className="btn btn-secondary teams-btn">
                Back to home
              </Link>
              <Link to="/#newsletter" className="academy-start-btn">
                Join the newsletter
              </Link>
            </div>
          </div>
        ) : step === 'intro' ? (
          <div className="academy-apply-card academy-apply-panel">
            <p className="landing-path-label">Academy application</p>
            <h1 id="academy-apply-title" className="academy-apply-title">Apply to the Iterali Academy</h1>
            <p className="academy-apply-lead">
              Treat this like a university or job application. We read every answer, and we only accept people who are serious about building calm, confident habits online. Vague or one-line answers will not be accepted.
            </p>
            <AcademyCohortNote className="academy-cohort-note--apply" />
            <div className="academy-apply-actions">
              <button type="button" className="academy-start-btn" onClick={handleContinue}>
                Start
              </button>
              <p className="academy-apply-meta">Takes about 5–7 minutes</p>
            </div>
          </div>
        ) : (
          <form className="academy-apply-card academy-apply-panel" onSubmit={handleContinue} onKeyDown={onKeyDown}>
            {step === 'serious' && (
              <>
                <h2 className="academy-apply-step-title">
                  Are you serious about building calm, confident habits online — and ready to practise?
                </h2>
                <div className="academy-apply-choices" role="group" aria-label="Commitment">
                  <button type="button" className="academy-apply-choice" onClick={() => handleSerious('yes')}>
                    <span className="academy-apply-choice-key">A</span>
                    <span>Yes — I am ready and committed to building habits I can use in real life.</span>
                  </button>
                  <button type="button" className="academy-apply-choice" onClick={() => handleSerious('no')}>
                    <span className="academy-apply-choice-key">B</span>
                    <span>No — I have come to the wrong place.</span>
                  </button>
                </div>
              </>
            )}

            {step === 'location' && (
              <>
                <h2 className="academy-apply-step-title">Where are you based?</h2>
                <p className="academy-apply-step-lead">
                  This helps us coordinate live session times across time zones. City and country is ideal.
                </p>
                <label className="academy-apply-field">
                  <span className="visually-hidden">Location</span>
                  <input
                    className="input"
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Budapest, Hungary"
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    autoComplete="address-level2"
                    autoFocus
                  />
                </label>
              </>
            )}

            {step === 'situation' && (
              <>
                <h2 className="academy-apply-step-title">Which best describes your current situation?</h2>
                <div className="academy-apply-choices" role="radiogroup" aria-label="Current situation">
                  {SITUATIONS.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`academy-apply-choice${form.situation === item.id ? ' is-selected' : ''}`}
                      onClick={() => setField('situation', item.id)}
                    >
                      <span className="academy-apply-choice-key">{String.fromCharCode(65 + i)}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                {form.situation === 'other' && (
                  <label className="academy-apply-field">
                    <span className="visually-hidden">Please describe</span>
                    <input
                      className="input"
                      type="text"
                      placeholder="Please describe your situation"
                      value={form.situationOther}
                      onChange={(e) => setField('situationOther', e.target.value)}
                      autoFocus
                    />
                  </label>
                )}
              </>
            )}

            {step === 'background' && (
              <>
                <h2 className="academy-apply-step-title">What is your professional background and current occupation?</h2>
                <p className="academy-apply-step-lead">
                  Tell us about the roles and experience you have had so far, and what you do now. This helps us tailor coaching and practice to your real context.
                </p>
                <label className="academy-apply-field">
                  <span className="visually-hidden">Background</span>
                  <textarea
                    className="input academy-apply-textarea"
                    name="background"
                    required
                    rows={6}
                    placeholder="Type your answer here..."
                    value={form.background}
                    onChange={(e) => setField('background', e.target.value)}
                    autoFocus
                  />
                </label>
                <p className="academy-apply-hint">Shift + Enter for a new line. Please write more than a single line.</p>
              </>
            )}

            {step === 'source' && (
              <>
                <h2 className="academy-apply-step-title">How did you first hear about the Iterali Academy?</h2>
                <p className="academy-apply-step-lead">
                  e.g. friend recommendation, LinkedIn, blog article, search, newsletter, Instagram, other.
                </p>
                <label className="academy-apply-field">
                  <span className="visually-hidden">How you heard about us</span>
                  <input
                    className="input"
                    type="text"
                    name="source"
                    required
                    placeholder="Type your answer here..."
                    value={form.source}
                    onChange={(e) => setField('source', e.target.value)}
                    autoFocus
                  />
                </label>
              </>
            )}

            {step === 'whyNow' && (
              <>
                <h2 className="academy-apply-step-title">
                  Why are you applying now? What has changed, or what is at stake, that makes this the moment to act?
                </h2>
                <p className="academy-apply-step-lead">
                  Be as detailed and specific as you can. We want to understand why this is the right moment for you to join — the more context you give, the better we can see if the Academy is a good fit.
                </p>
                <label className="academy-apply-field">
                  <span className="visually-hidden">Why now</span>
                  <textarea
                    className="input academy-apply-textarea"
                    name="whyNow"
                    required
                    rows={8}
                    placeholder="Type your answer here..."
                    value={form.whyNow}
                    onChange={(e) => setField('whyNow', e.target.value)}
                    autoFocus
                  />
                </label>
                <p className="academy-apply-hint">
                  This is one of your last questions. Take a moment to make sure your earlier answers are complete.
                </p>
              </>
            )}

            {step === 'contact' && (
              <>
                <h2 className="academy-apply-step-title">How can we reach you?</h2>
                <p className="academy-apply-step-lead">
                  If your application is a good fit, we will use this to send a calendar link for a short interview call.
                </p>
                <label className="academy-apply-field">
                  Full name
                  <input
                    className="input"
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    autoComplete="name"
                    autoFocus
                  />
                </label>
                <label className="academy-apply-field">
                  Email
                  <input
                    className="input"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    autoComplete="email"
                  />
                </label>
              </>
            )}

            {submitError && <p className="error">{submitError}</p>}

            {step !== 'serious' && (
              <div className="academy-apply-actions academy-apply-actions--split">
                <button type="button" className="btn btn-secondary teams-btn" onClick={goBack} disabled={sending}>
                  Back
                </button>
                <button type="submit" className="academy-start-btn" disabled={sending || !canContinue()}>
                  {sending ? 'Sending…' : step === 'contact' ? 'Submit application' : 'OK'}
                </button>
              </div>
            )}
          </form>
        )}
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
