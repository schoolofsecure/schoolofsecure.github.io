import React, { useEffect, useState } from 'react'

/**
 * Duolingo-stílusú pontanimáció komponens
 * A képernyő közepén jelenik meg animálva, amikor egy feladatot helyesen teljesítenek
 */
const PointAnimation = ({ points, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Rövid késleltetés az animáció indításához
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Animáció befejezése után eltávolítjuk
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onComplete?.(), 300) // Várunk az opacity transition-re
      }, 1200) // 1.2 másodperc animáció
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!points || points <= 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: 10000,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? 'translate(-50%, -50%) scale(1) translateY(-50px)' 
          : 'translate(-50%, -50%) scale(0.5) translateY(0px)',
        transition: 'opacity 0.2s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.98) 0%, rgba(0, 180, 255, 0.98) 100%)',
          color: '#ffffff',
          padding: '24px 48px',
          borderRadius: '20px',
          fontSize: '56px',
          fontWeight: 700,
          fontFamily: 'Rajdhani, Inter, sans-serif',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0, 229, 255, 0.5), 0 0 0 4px rgba(0, 229, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          letterSpacing: '3px',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        +{points} pont
      </div>
    </div>
  )
}

export default PointAnimation

