import React from 'react'
import { Link } from 'react-router-dom'

export default function SiteFooter({ className = 'site-footer' }) {
  return (
    <footer className={className}>
      <p className="site-footer-copy">© 2025–2026 Iterali. All rights reserved.</p>
      <nav className="site-footer-nav" aria-label="Site">
        <span className="site-footer-nav-group">
          <Link to="/values">Our values</Link>
          <span aria-hidden="true">·</span>
          <Link to="/privacy">Privacy</Link>
          <span aria-hidden="true">·</span>
          <Link to="/terms">Terms</Link>
        </span>
        <span className="site-footer-nav-sep" aria-hidden="true">·</span>
        <span className="site-footer-nav-group">
          <Link to="/boundaries">Boundaries</Link>
          <span aria-hidden="true">·</span>
          <Link to="/play">About the game</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
        </span>
      </nav>
      <p className="site-footer-trust">Minimal data, clear explanations and privacy first.</p>
    </footer>
  )
}
