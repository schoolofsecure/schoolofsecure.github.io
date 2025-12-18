import React from 'react'
import { useScoring } from '../../contexts/ScoringContext'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Pontszám és rang megjelenítő komponens
 * A jobb felső sarokban jelenik meg
 */
const ScoreDisplay = () => {
  const { totalPoints, currentRank } = useScoring()
  const { isAuthenticated } = useAuth()
  
  // Csak bejelentkezés után jelenjen meg
  // Ha nincs currentRank, akkor is mutassuk a pontszámot (legalább 0 ponttal)
  if (!isAuthenticated) {
    return null
  }
  
  // Ha nincs currentRank, de van pontszám, akkor is mutassuk
  if (!currentRank && totalPoints === 0) {
    return null
  }
  
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '6px',
        marginBottom: '12px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--muted)'
        }}
      >
        <strong style={{ fontFamily: 'Rajdhani, Inter, sans-serif', letterSpacing: '0.4px' }}>
          {currentRank.name}
        </strong>
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#00e5ff',
          fontFamily: 'Rajdhani, Inter, sans-serif'
        }}
      >
        {totalPoints} pont
      </div>
    </div>
  )
}

export default ScoreDisplay

