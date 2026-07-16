import React from 'react'
import { Link } from 'react-router-dom'

export default function SiteFooter({ className = 'site-footer' }) {
  return (
    <footer className={className}>
      <p className="site-footer-copy">© 2025–2026 Iterali. All rights reserved.</p>
      <nav className="site-footer-nav" aria-label="Legal">
        <Link to="/privacy">Privacy</Link>
        <span aria-hidden="true">·</span>
        <Link to="/terms">Terms</Link>
        <span aria-hidden="true">·</span>
        <Link to="/teams#contact">Contact</Link>
      </nav>
      <p className="site-footer-trust">Security &amp; privacy first</p>
    </footer>
  )
}
