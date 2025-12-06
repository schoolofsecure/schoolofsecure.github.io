import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '72px', margin: '0', color: 'var(--accent)' }}>404</h1>
        <h2 style={{ marginTop: '16px', marginBottom: '16px' }}>Az oldal nem található</h2>
        <p className="muted" style={{ marginBottom: '24px' }}>
          A keresett oldal nem létezik vagy el lett távolítva.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn">
            Vissza a főoldalra
          </Link>
          <Link to="/aurora" className="btn-ghost">
            Ügyek megtekintése
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound

