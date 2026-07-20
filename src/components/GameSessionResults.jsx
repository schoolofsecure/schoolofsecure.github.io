import React from 'react'
import { Link } from 'react-router-dom'

export default function GameSessionResults({
  score,
  totalTasks,
  errors,
  onClose,
  levelName,
}) {
  const correct = Math.max(0, totalTasks - errors)
  const accuracy = totalTasks ? Math.round((correct / totalTasks) * 100) : 0

  let personalBest = score
  try {
    const stored = parseInt(localStorage.getItem('iterali_game_session_best') || '0', 10)
    if (score > stored) localStorage.setItem('iterali_game_session_best', String(score))
    personalBest = Math.max(score, stored)
  } catch (_) {}

  const explanations = []
  if (errors > 0) {
    explanations.push('Review messages that create urgency. Scammers use pressure to stop you thinking clearly.')
    explanations.push('Check sender addresses and web links carefully before you click or reply.')
  } else {
    explanations.push('You answered every challenge correctly this session. Keep that habit of pausing before you click.')
  }
  if (accuracy < 80) {
    explanations.push('Phishing and fake login pages are worth extra practice in the Learn section.')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10003,
        background: 'rgba(5, 10, 18, 0.85)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
      role="dialog"
      aria-labelledby="session-results-title"
    >
      <div
        className="card"
        style={{
          maxWidth: 520,
          width: '100%',
          padding: 28,
          background: '#0d141d',
          border: '1px solid rgba(207,230,255,0.15)',
          borderRadius: 16,
        }}
      >
        <h2 id="session-results-title" style={{ margin: '0 0 6px', fontFamily: 'Rajdhani, Inter, sans-serif' }}>
          Session complete
        </h2>
        {levelName && <p className="muted" style={{ margin: '0 0 20px' }}>{levelName}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="feat" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 4px' }}>Score</h4>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{score} pts</p>
          </div>
          <div className="feat" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 4px' }}>Accuracy</h4>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{accuracy}%</p>
          </div>
          <div className="feat" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 4px' }}>Correct</h4>
            <p style={{ margin: 0 }}>{correct} of {totalTasks}</p>
          </div>
          <div className="feat" style={{ margin: 0 }}>
            <h4 style={{ margin: '0 0 4px' }}>Personal best</h4>
            <p style={{ margin: 0 }}>{personalBest} pts</p>
          </div>
        </div>

        {errors > 0 && (
          <p className="muted" style={{ margin: '0 0 12px', fontSize: 14 }}>
            Incorrect answers: {errors}
          </p>
        )}

        <div style={{ marginBottom: 20 }}>
          <strong style={{ fontSize: 14 }}>Quick takeaways</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 18, color: 'var(--muted)', lineHeight: 1.6, fontSize: 14 }}>
            {explanations.slice(0, 3).map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ul>
        </div>

        <div
          style={{
            background: 'rgba(0,229,255,0.06)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 17, fontFamily: 'Rajdhani, Inter, sans-serif' }}>
            Your next step
          </h3>
          <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>
            Decide under pressure here, then build the habit with one short lesson. We show what to practise next.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/learn/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }} onClick={onClose}>
            See my next step
          </Link>
          <Link to="/aurora" className="btn-secondary btn" style={{ textDecoration: 'none', flex: 1, justifyContent: 'center' }} onClick={onClose}>
            Play again
          </Link>
        </div>
        <button type="button" className="btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
