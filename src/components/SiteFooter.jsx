import React from 'react'
import { Link } from 'react-router-dom'
import { LINKEDIN_URL } from '../data/brand'

export default function SiteFooter({ className = 'site-footer' }) {
  return (
    <footer className={className}>
      <p className="site-footer-copy">© 2025–2026 Iterali. All rights reserved.</p>
      <nav className="site-footer-nav" aria-label="Site">
        <Link to="/privacy">Privacy</Link>
        <span aria-hidden="true">·</span>
        <Link to="/terms">Terms</Link>
        <span aria-hidden="true">·</span>
        <a href="mailto:erikapappkovacs@gmail.com">Contact</a>
        <span aria-hidden="true">·</span>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer-linkedin"
          aria-label="Iterali on LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
          </svg>
        </a>
      </nav>
      <p className="site-footer-trust">Security &amp; privacy first</p>
    </footer>
  )
}
