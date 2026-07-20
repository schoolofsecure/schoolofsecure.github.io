import React, { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import CookieBanner from '../components/CookieBanner'
import { freeLoginPath, getFreeCase, getFirstFreeCaseId } from '../data/freeCases'
import '../styles/site.css'
import '../styles/freeCase.css'

export default function FreeCase() {
  const { caseId } = useParams()
  const resolvedId = caseId || getFirstFreeCaseId()
  const caseData = getFreeCase(resolvedId)
  const [selectedId, setSelectedId] = useState(null)
  const [phase, setPhase] = useState('decide') // decide | review

  useEffect(() => {
    setSelectedId(null)
    setPhase('decide')
  }, [resolvedId])

  if (!caseData) return <Navigate to={`/play/case/${getFirstFreeCaseId()}`} replace />

  const selected = caseData.options.find((o) => o.id === selectedId) || null

  const handleContinue = () => {
    if (!selectedId) return
    setPhase('review')
  }

  const handleTryAgain = () => {
    setSelectedId(null)
    setPhase('decide')
  }

  const next = caseData.next

  return (
    <div className="site-page free-case-page">
      <div className="container">
        <SiteNav />

        <p className="free-case-path">
          Path: {freeLoginPath.title} · step {caseData.step} of {freeLoginPath.totalSteps}
        </p>

        <header className="free-case-header">
          <h1>{caseData.title}</h1>
          <p className="muted">
            Practise the decision you would make at work. Review without blame. Then take one clear next step.
          </p>
        </header>

        <section className="free-case-card" aria-label="Scenario">
          <h2 className="free-case-section-label">At work</h2>
          {caseData.scenario.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </section>

        {phase === 'decide' && (
          <section className="free-case-card" aria-label="Decision">
            <h2 className="free-case-section-label">{caseData.prompt}</h2>
            <div className="free-case-options" role="radiogroup" aria-label={caseData.prompt}>
              {caseData.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedId === opt.id}
                  className={`free-case-option ${selectedId === opt.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: 16 }}
              disabled={!selectedId}
              onClick={handleContinue}
            >
              Review this decision
            </button>
          </section>
        )}

        {phase === 'review' && selected && (
          <section className="free-case-card free-case-review" aria-label="Review">
            <h2 className="free-case-section-label">Review without blame</h2>
            <p className={`free-case-outcome ${selected.outcome}`}>
              {selected.outcome === 'safer' ? 'Safer step' : 'Risky under pressure'}
            </p>
            <p>{selected.feedback.lead}</p>
            <dl className="free-case-feedback-list">
              <div>
                <dt>Cue</dt>
                <dd>{selected.feedback.cue}</dd>
              </div>
              <div>
                <dt>Why it mattered</dt>
                <dd>{selected.feedback.riskOrSafe}</dd>
              </div>
              <div>
                <dt>What many people miss</dt>
                <dd>{selected.feedback.miss}</dd>
              </div>
            </dl>
            <p className="free-case-privacy">
              This practice is safe-to-fail. We use it to build habits, not to judge you. No workplace identity is needed for this case.
            </p>
            <div className="free-case-actions">
              <button type="button" className="btn btn-secondary" onClick={handleTryAgain}>
                Try again
              </button>
              {next.caseId && (
                <Link
                  to={`/play/case/${next.caseId}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  {next.label}
                </Link>
              )}
              {next.lessonId && (
                <Link
                  to={`/learn/lessons/${next.lessonId}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  {next.label}
                </Link>
              )}
            </div>
          </section>
        )}

        <p className="muted" style={{ marginTop: 24, fontSize: 14 }}>
          Want the longer investigation game?{' '}
          <Link to="/aurora">Enter Aurora</Link>
          {' · '}
          <Link to="/play">Back to Play</Link>
        </p>

        <SiteFooter />
      </div>
      <CookieBanner />
    </div>
  )
}
