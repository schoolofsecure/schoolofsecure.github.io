import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { submitToFormSubmit } from '../utils/formSubmit'
import '../styles/site.css'

const QUESTIONS = [
  {
    id: 'speed',
    text: 'Where do you react too fast?',
    options: [
      { id: 'email', label: 'Urgent email' },
      { id: 'chat', label: 'Chat or messaging apps' },
      { id: 'login', label: 'Login or password prompts' },
      { id: 'trusted', label: 'Requests from people I usually trust' },
    ],
  },
  {
    id: 'yes',
    text: 'Who do you say yes to online, even when unsure?',
    options: [
      { id: 'boss', label: 'A manager or senior person' },
      { id: 'colleague', label: 'A colleague' },
      { id: 'friend', label: 'A friend or family member' },
      { id: 'support', label: 'A support or IT-looking account' },
      { id: 'stranger', label: 'Someone I do not really know' },
    ],
  },
  {
    id: 'stress',
    text: 'What stresses you most?',
    options: [
      { id: 'notifications', label: 'Too many notifications' },
      { id: 'work', label: 'Work urgency' },
      { id: 'unknown', label: 'Unknown messages' },
      { id: 'ai', label: 'AI-generated or polished content' },
    ],
  },
  {
    id: 'pause',
    text: 'Where do you want to pause next time?',
    options: [
      { id: 'money', label: 'Money, access or approval requests' },
      { id: 'links', label: 'Login links and reset emails' },
      { id: 'chat_ok', label: 'Approvals asked only in chat' },
      { id: 'rush', label: 'Anything labelled urgent' },
    ],
  },
]

function buildBoundary(answers) {
  const line1ByPause = {
    money: 'I do not approve money, access or account changes on a single rushed message.',
    links: 'I do not follow login or password-reset links from a hurried message alone.',
    chat_ok: 'I do not approve urgent requests through chat alone.',
    rush: 'I do not treat “urgent” as a reason to skip a second look.',
  }

  const line2BySpeed = {
    email: 'When an email asks me to move fast, I verify it on a second channel.',
    chat: 'When a chat request feels rushed, I verify it on a second channel.',
    login: 'When a login prompt feels off, I open the site myself instead of clicking through.',
    trusted: 'When someone I trust asks for a fast yes, I still pause and check the channel.',
  }

  const stressNote = {
    notifications: 'Fewer notifications help me keep this rule.',
    work: 'Work pressure is not a reason to skip the pause.',
    unknown: 'Unknown senders get a pause by default.',
    ai: 'A polished message still needs a second check.',
  }

  const yesNote = {
    boss: 'Senior titles do not replace verification.',
    colleague: 'Familiar names still need a calm check.',
    friend: 'Even close contacts can be impersonated.',
    support: 'Support accounts are verified, not trusted on sight.',
    stranger: 'Unknown people do not get a fast yes.',
  }

  return {
    line1: line1ByPause[answers.pause] || line1ByPause.rush,
    line2: line2BySpeed[answers.speed] || line2BySpeed.email,
    note: `${yesNote[answers.yes] || ''} ${stressNote[answers.stress] || ''}`.trim(),
  }
}

export default function Boundaries() {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const [email, setEmail] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [hp, setHp] = useState('')
  const [sendStatus, setSendStatus] = useState('idle')
  const [sendError, setSendError] = useState('')

  const boundary = useMemo(() => {
    if (Object.keys(answers).length < QUESTIONS.length) return null
    return buildBoundary(answers)
  }, [answers])

  const current = step >= 0 && step < QUESTIONS.length ? QUESTIONS[step] : null

  const selectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
    setStep((s) => s + 1)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!boundary) return
    setSendStatus('sending')
    setSendError('')
    try {
      await submitToFormSubmit({
        email,
        request: 'Digital Boundaries Card',
        boundary_line_1: boundary.line1,
        boundary_line_2: boundary.line2,
        boundary_note: boundary.note,
        answers: JSON.stringify(answers),
        _subject: 'Iterali Digital Boundaries Card',
        _replyto: email,
      }, { honeypot: hp })
      setSendStatus('success')
    } catch (_) {
      setSendStatus('idle')
      setSendError('Could not send the card right now. Please try again.')
    }
  }

  const restart = () => {
    setStep(-1)
    setAnswers({})
    setEmail('')
    setPrivacy(false)
    setSendStatus('idle')
    setSendError('')
  }

  return (
    <div className="container teams-page">
      <SiteNav />

      <section className="boundaries-page" aria-labelledby="boundaries-title">
        {step < 0 && (
          <div className="boundaries-intro">
            <p className="landing-path-label">Digital Boundaries Card</p>
            <h1 id="boundaries-title" className="about-title">Make one rule you can actually use</h1>
            <p className="boundaries-lead">
              Take a two-minute check-in and get a personal digital boundary for the moments that make you rush, doubt or overthink.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => setStep(0)}>
              Create my boundary
            </button>
          </div>
        )}

        {current && (
          <div className="boundaries-quiz">
            <p className="landing-path-label">Question {step + 1} of {QUESTIONS.length}</p>
            <div className="boundaries-progress" aria-hidden="true">
              <span style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
            </div>
            <h1 id="boundaries-title" className="about-title">{current.text}</h1>
            <ul className="boundaries-options">
              {current.options.map((opt) => (
                <li key={opt.id}>
                  <button type="button" className="boundaries-option" onClick={() => selectOption(current.id, opt.id)}>
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
            {step > 0 && (
              <button type="button" className="btn-ghost" onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}
          </div>
        )}

        {step >= QUESTIONS.length && boundary && (
          <div className="boundaries-result">
            <p className="landing-path-label">Your card</p>
            <h1 id="boundaries-title" className="about-title">Your digital boundary</h1>
            <article className="boundaries-card" aria-label="Personal digital boundary card">
              <p className="boundaries-card-line">{boundary.line1}</p>
              <p className="boundaries-card-line">{boundary.line2}</p>
              {boundary.note && <p className="boundaries-card-note">{boundary.note}</p>}
            </article>
            <p className="boundaries-result-lead">
              Keep it close for the moments when an online request feels urgent, unclear or hard to refuse.
            </p>

            {sendStatus === 'success' ? (
              <>
                <p className="boundaries-success">
                  Your personal boundary is ready. Keep it close for the moments when an online request feels urgent, unclear or hard to refuse.
                </p>
                <div className="boundaries-next">
                  <Link to="/aurora" className="btn btn-secondary">Play a short round</Link>
                  <button type="button" className="btn-ghost" onClick={restart}>Make another card</button>
                </div>
              </>
            ) : (
              <form className="boundaries-send" onSubmit={handleSend}>
                <h2 className="boundaries-send-title">Send my Digital Boundaries Card</h2>
                <p className="boundaries-send-lead">Keep it for the next time an online request feels urgent.</p>
                <p className="teams-why-ask">Why we ask: your email so we can send you this card.</p>
                <input type="text" name="_honey" value={hp} onChange={(e) => setHp(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="Email address"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={sendStatus === 'sending'}
                  aria-label="Email address"
                />
                <label className="form-privacy-check">
                  <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} required />
                  <span>I accept the <Link to="/privacy">Privacy Policy</Link>.</span>
                </label>
                <button type="submit" className="btn btn-primary" disabled={sendStatus === 'sending' || !privacy}>
                  {sendStatus === 'sending' ? 'Sending…' : 'Send my card'}
                </button>
                {sendError && <p className="landing-newsletter-error">{sendError}</p>}
              </form>
            )}
          </div>
        )}

        {step >= 0 && step < QUESTIONS.length && (
          <p className="boundaries-progress-text" aria-live="polite">
            {Math.round((step / QUESTIONS.length) * 100)}% through
          </p>
        )}
      </section>

      <SiteFooter />
      <CookieBanner />
    </div>
  )
}
