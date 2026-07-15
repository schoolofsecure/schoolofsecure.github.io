import React, { useEffect, useState } from 'react'

/**
 * Pálya befejezési összegző animáció komponens
 * A képernyő közepén jelenik meg animálva, amikor egy pályát befejeznek
 */
const LevelCompletionSummary = ({ levelName, rank, totalPoints, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Rövid késleltetés az animáció indításához
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // 4 másodperc után fade-out kezdődik
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true)
      }, 4000)
      
      // 5 másodperc után teljesen eltűnik
      const completeTimer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 5000)
      
      return () => {
        clearTimeout(fadeOutTimer)
        clearTimeout(completeTimer)
      }
    }
  }, [isVisible, onComplete])

  if (!levelName || !rank) return null

  // Motiváló üzenet generálása ranggal megszólítva
  const getMotivationalMessage = () => {
    const messages = [
      `${rank.name}, excellent work!`,
      `${rank.name}, you're closing in on the truth!`,
      `${rank.name}, one step closer to the solution!`,
      `${rank.name}, great performance!`,
      `${rank.name}, keep it up!`
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div
      className={`level-completion-summary ${isVisible ? 'visible' : ''} ${isFadingOut ? 'fading-out' : ''}`}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10002,
        pointerEvents: 'none',
      }}
    >
      <div className="summary-content">
        <div className="summary-header">
          <div className="completion-badge">Case completed</div>
          <h2 className="level-name">{levelName}</h2>
        </div>
        
        <div className="summary-body">
          <div className="summary-item">
            <span className="summary-label">Rank:</span>
            <span className="summary-value">{rank.name}</span>
          </div>
          
          <div className="summary-item">
            <span className="summary-label">Total score:</span>
            <span className="summary-value points">{totalPoints} pts</span>
          </div>
        </div>
        
        <div className="summary-footer">
          <p className="motivational-message">{getMotivationalMessage()}</p>
        </div>
      </div>
      
      <style>{`
        .level-completion-summary {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .level-completion-summary.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        
        .level-completion-summary.fading-out {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        
        .summary-content {
          background: linear-gradient(135deg, rgba(5, 10, 18, 0.98) 0%, rgba(11, 18, 28, 0.98) 100%);
          border: 2px solid rgba(0, 229, 255, 0.4);
          border-radius: 20px;
          padding: 36px 48px;
          min-width: 420px;
          max-width: 620px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 4px rgba(0, 229, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .summary-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 229, 255, 0.2);
        }
        
        .completion-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 180, 255, 0.15) 100%);
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 8px;
          padding: 6px 16px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          color: #00e5ff;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }
        
        .level-name {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          color: #ffffff;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          line-height: 1.3;
        }
        
        .summary-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(0, 229, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(0, 229, 255, 0.15);
        }
        
        .summary-label {
          font-size: 16px;
          color: var(--muted, #94a3b8);
          font-weight: 500;
        }
        
        .summary-value {
          font-size: 18px;
          font-weight: 700;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          color: #ffffff;
        }
        
        .summary-value.points {
          color: #00e5ff;
        }
        
        .summary-footer {
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid rgba(0, 229, 255, 0.2);
        }
        
        .motivational-message {
          margin: 0;
          font-size: 17px;
          font-weight: 500;
          font-family: 'Rajdhani', 'Inter', sans-serif;
          color: #cfe6ff;
          font-style: italic;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}

export default LevelCompletionSummary

