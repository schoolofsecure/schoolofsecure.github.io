import React, { useEffect, useState } from 'react'

/**
 * Rangjelvény animáció komponens
 * A képernyő közepén jelenik meg animálva, amikor egy játékos új rangot ér el
 */
const RankBadgeAnimation = ({ rank, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [showGlow, setShowGlow] = useState(false)

  useEffect(() => {
    // Rövid késleltetés az animáció indításához
    const timer = setTimeout(() => {
      setIsVisible(true)
      setTimeout(() => setShowGlow(true), 200) // Glow effekt késleltetve
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // Animáció befejezése után eltávolítjuk
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onComplete?.(), 500) // Várunk az opacity transition-re
      }, 2500) // 2.5 másodperc animáció
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!rank) return null

  // Hang lejátszása (opcionális - ha van hangfájl)
  useEffect(() => {
    if (isVisible) {
      // Hang lejátszása (ha van)
      try {
        const audio = new Audio('/sounds/rank-up.mp3')
        audio.volume = 0.5
        audio.play().catch(() => {
          // Ha nincs hangfájl, nem baj - csendes működés
        })
      } catch (e) {
        // Hang nélkül is működik
      }
    }
  }, [isVisible])

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: 10001,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? 'translate(-50%, -50%) scale(1) rotate(0deg)' 
          : 'translate(-50%, -50%) scale(0.3) rotate(-180deg)',
        transition: 'opacity 0.4s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Glow effekt */}
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.4) 0%, rgba(0, 229, 255, 0) 70%)',
            animation: 'pulse-glow 1.5s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Badge kép */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <img
          src="/images/badge.png"
          alt="Rangjelvény"
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            filter: showGlow ? 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.8))' : 'none',
            transition: 'filter 0.3s ease-out',
          }}
          onError={(e) => {
            // Ha nincs badge.png, placeholder-t jelenítünk meg
            e.target.style.display = 'none'
            if (!e.target.parentElement.querySelector('.badge-placeholder')) {
              const placeholder = document.createElement('div')
              placeholder.className = 'badge-placeholder'
              placeholder.style.cssText = `
                width: 200px;
                height: 200px;
                background: linear-gradient(135deg, rgba(0, 229, 255, 0.3), rgba(0, 180, 255, 0.3));
                border-radius: 50%;
                border: 4px solid rgba(0, 229, 255, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 48px;
                color: #00e5ff;
              `
              placeholder.textContent = '🏆'
              e.target.parentElement.appendChild(placeholder)
            }
          }}
        />
        
        {/* Rang név */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.95) 0%, rgba(0, 180, 255, 0.95) 100%)',
            color: '#ffffff',
            padding: '12px 32px',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 700,
            fontFamily: 'Rajdhani, Inter, sans-serif',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0, 229, 255, 0.4)',
            letterSpacing: '1px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            whiteSpace: 'nowrap',
            opacity: showGlow ? 1 : 0,
            transform: showGlow ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
          }}
        >
          {rank.name}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse-glow {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RankBadgeAnimation

