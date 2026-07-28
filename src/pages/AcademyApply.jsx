import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { submitToFormSubmit } from '../utils/formSubmit'
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

const SOURCES = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'friend', label: 'Friend or recommendation' },
  { id: 'search', label: 'Search' },
  { id: 'blog', label: 'Blog' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'other', label: 'Other' },
]

const STEPS = [
  'serious',
  'location',
  'situation',
  'background',
  'source',
  'whyNow',
  'contact',
]

const DRAFT_KEY = 'academyInterestDraft'
const DRAFT_VERSION = 2

const emptyForm = {
  serious: '',
  location: '',
  situation: '',
  situationOther: '',
  background: '',
  source: '',
  sourceOther: '',
  whyNow: '',
  fullName: '',
  email: '',
}

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data.stepIndex !== 'number' || !data.form) return null
    let stepIndex = data.stepIndex
    // v1 drafts included an intro step at index 0
    if (!data.v || data.v < DRAFT_VERSION) {
      stepIndex = Math.max(0, stepIndex - 1)
    }
    if (stepIndex < 0 || stepIndex >= STEPS.length) return null
    return { ...data, stepIndex }
  } catch {
    return null
  }
}

function writeDraft(stepIndex, form) {
  try {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ v: DRAFT_VERSION, stepIndex, form, savedAt: Date.now() }),
    )
  } catch {
    /* private mode / blocked storage */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

export default function AcademyApply() {
  const [stepIndex, setStepIndex] = useState(0)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [declined, setDeclined] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [draftReady, setDraftReady] = useState(false)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    setHasDraft(!!readDraft())
    setDraftReady(true)
  }, [])

  useEffect(() => {
    if (!draftReady || submitted || declined || hasDraft) return
    writeDraft(stepIndex, form)
  }, [form, stepIndex, submitted, declined, draftReady, hasDraft])

  const step = STEPS[stepIndex]
  const questionNumber = stepIndex + 1
  const questionTotal = STEPS.length
  const progress = Math.round((questionNumber / questionTotal) * 100)

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setSubmitError('')
  }

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0))

  const resumeDraft = () => {
    const draft = readDraft()
    if (!draft) {
      setHasDraft(false)
      return
    }
    setForm({ ...emptyForm, ...draft.form })
    setStepIndex(draft.stepIndex)
    setHasDraft(false)
    setSubmitError('')
  }

  const startFresh = () => {
    clearDraft()
    setHasDraft(false)
    setForm(emptyForm)
    setStepIndex(0)
    setSubmitError('')
  }

  const handleSerious = (value) => {
    const nextForm = { ...form, serious: value }
    setForm(nextForm)
    setSubmitError('')
    if (value === 'no') {
      clearDraft()
      setDeclined(true)
      return
    }
    setDeclined(false)
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1)
    setStepIndex(nextIndex)
    writeDraft(nextIndex, nextForm)
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
        return form.source && (form.source !== 'other' || form.sourceOther.trim().length > 1)
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

      const sourceLabel =
        form.source === 'other'
          ? `Other: ${form.sourceOther}`
          : SOURCES.find((s) => s.id === form.source)?.label || form.source

      await submitToFormSubmit({
        fullName: form.fullName,
        email: form.email,
        serious: form.serious,
        location: form.location,
        situation: situationLabel,
        background: form.background,
        source: sourceLabel,
        whyNow: form.whyNow,
        request: 'Academy interest',
        _subject: `Iterali Academy interest: ${form.fullName}`,
        _replyto: form.email,
      })
      clearDraft()
      setSubmitted(true)
    } catch (_) {
      setSubmitError('Could not send your form. Please try again in a moment.')
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
    <div className="container teams-page teams-page--apply">
      <SiteNav />

      <section className="academy-apply" aria-labelledby="academy-apply-title">
        {!submitted && !declined && !hasDraft && (
          <div className="academy-apply-progress-wrap">
            <p className="academy-apply-progress-label" id="academy-apply-progress-label">
              Question {questionNumber} of {questionTotal}
            </p>
            <div
              className="academy-apply-progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={questionTotal}
              aria-valuenow={questionNumber}
              aria-labelledby="academy-apply-progress-label"
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {submitted ? (
          <div className="academy-apply-card academy-apply-panel">
            <p className="landing-path-label">Interest received</p>
            <h1 id="academy-apply-title" className="academy-apply-title">Thank you, {form.fullName.split(' ')[0]}.</h1>
            <p className="academy-apply-lead">
              We read every response. If a conversation would help, you will get a link to book a short call with our team. There is no purchase or enrolment on this site.
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
              This early practice group is for people who want to practise calm, confident habits online with real commitment. You are welcome to explore the site, join the newsletter, or come back when the timing feels right.
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
        ) : hasDraft ? (
          <div className="academy-apply-card academy-apply-panel">
            <p className="landing-path-label">Academy interest</p>
            <h1 id="academy-apply-title" className="academy-apply-title">Continue where you left off?</h1>
            <p className="academy-apply-lead">
              You have answers saved on this device. You can pick up from there, or start again.
            </p>
            <div className="academy-apply-actions academy-apply-actions--stack">
              <button type="button" className="academy-start-btn" onClick={resumeDraft}>
                Continue where you left off
              </button>
              <button type="button" className="btn btn-secondary teams-btn academy-apply-secondary-btn" onClick={startFresh}>
                Start fresh
              </button>
            </div>
          </div>
        ) : (
          <form className="academy-apply-card academy-apply-panel" onSubmit={handleContinue} onKeyDown={onKeyDown}>
            {step === 'serious' && (
              <>
                <p className="landing-path-label">Academy interest</p>
                <h2 className="academy-apply-step-title" id="academy-apply-title">
                  Are you serious about building calm, confident habits online, and ready to practise?
                </h2>
                <div className="academy-apply-choices" role="group" aria-label="Commitment">
                  <button type="button" className="academy-apply-choice" onClick={() => handleSerious('yes')}>
                    <span className="academy-apply-choice-key">A</span>
                    <span>Yes. I am ready and committed to building habits I can use in real life.</span>
                  </button>
                  <button type="button" className="academy-apply-choice" onClick={() => handleSerious('no')}>
                    <span className="academy-apply-choice-key">B</span>
                    <span>No. I have come to the wrong place.</span>
                  </button>
                </div>
              </>
            )}

            {step === 'location' && (
              <>
                <h2 className="academy-apply-step-title">Which country are you in?</h2>
                <p className="academy-apply-step-lead">
                  This helps us coordinate live session times across time zones.
                </p>
                <label className="academy-apply-field">
                  <span className="visually-hidden">Country</span>
                  <input
                    className="input"
                    type="text"
                    name="location"
                    required
                    placeholder="e.g. Germany"
                    value={form.location}
                    onChange={(e) => setField('location', e.target.value)}
                    autoComplete="country-name"
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
                  Tell us about the roles and experience you have had so far, and what you do now. This helps us understand your real context if we talk.
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
                <p className="academy-apply-step-lead">One tap is enough. Pick the closest option.</p>
                <div className="academy-apply-choices" role="radiogroup" aria-label="How you heard about us">
                  {SOURCES.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`academy-apply-choice${form.source === item.id ? ' is-selected' : ''}`}
                      onClick={() => setField('source', item.id)}
                    >
                      <span className="academy-apply-choice-key">{String.fromCharCode(65 + i)}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                {form.source === 'other' && (
                  <label className="academy-apply-field">
                    <span className="visually-hidden">Please describe</span>
                    <input
                      className="input"
                      type="text"
                      placeholder="Please describe"
                      value={form.sourceOther}
                      onChange={(e) => setField('sourceOther', e.target.value)}
                      autoFocus
                    />
                  </label>
                )}
              </>
            )}

            {step === 'whyNow' && (
              <>
                <h2 className="academy-apply-step-title">
                  Why are you applying now? What has changed, or what is at stake, that makes this the moment to act?
                </h2>
                <p className="academy-apply-step-lead">
                  Be as detailed and specific as you can. We want to understand why this is the right moment for you. The more context you give, the better we can see if a conversation would help.
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
                  If a conversation would help, we will use this to send a calendar link for a short call.
                </p>
                <p className="teams-why-ask">
                  Why we ask: name and email so we can reply. We do not sell your details or use this form for phishing tests. There is no payment on this page; the next step is a short conversation if it seems useful. See our{' '}
                  <Link to="/privacy">Privacy Policy</Link>.
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
                  {sending ? 'Sending…' : step === 'contact' ? 'Share interest' : 'OK'}
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
