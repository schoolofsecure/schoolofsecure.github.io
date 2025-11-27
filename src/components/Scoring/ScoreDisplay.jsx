import React from 'react'
import { useScoring } from '../../contexts/ScoringContext'

/**
 * Pontszám és rang megjelenítő komponens
 * A jobb felső sarokban jelenik meg
 */
const ScoreDisplay = () => {
  const { totalPoints, currentRank } = useScoring()
  
  if (!currentRank) {
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
        <span style={{ fontSize: '16px' }}>{currentRank.icon}</span>
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

