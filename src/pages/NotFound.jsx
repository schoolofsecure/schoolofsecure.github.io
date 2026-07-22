import React from 'react'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'

const NotFound = () => {
  return (
    <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <SiteNav />
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '72px', margin: '0', color: 'var(--accent)' }}>404</h1>
        <h2 style={{ marginTop: '16px', marginBottom: '16px' }}>Page not found</h2>
        <p className="muted" style={{ marginBottom: '24px' }}>
          The page you are looking for does not exist or has been removed.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn">
            Back to home
          </Link>
          <Link to="/aurora" className="btn-ghost">
            View cases
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
