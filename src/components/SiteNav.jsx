import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { to: '/', label: 'Individual' },
  { to: '/teams', label: 'Teams' },
  { to: '/blog', label: 'Blog' },
]

function isNavActive(pathname, to) {
  if (to === '/') {
    return pathname === '/' || pathname === '/aurora' || /^\/ugy\d+/.test(pathname)
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

const ACADEMY_APPLY_LABEL = 'Apply to the Academy'
const ACADEMY_APPLY_PATH = '/academy'

const baseAuthBtnStyle = {
  minWidth: '190px',
  height: '48px',
  borderRadius: '999px',
  fontFamily: 'Rajdhani, Inter, sans-serif',
  fontSize: '15px',
  letterSpacing: '0.4px',
  fontWeight: 600,
  padding: '0 20px',
}

export default function SiteNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, registerWithEmail, loginWithEmail, loginWithGoogle, logout } = useAuth()
  const [authPanelOpen, setAuthPanelOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [gdprAgreedInForm, setGdprAgreedInForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const authStatusText = user
    ? user.emailVerified
      ? 'Signed in'
      : 'Verification required'
    : ''

  useEffect(() => {
    if (searchParams.get('signin') === '1') {
      setAuthPanelOpen(true)
      setAuthMode('login')
      setMenuOpen(false)
    }
  }, [searchParams])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const openSignIn = () => {
    setMenuOpen(false)
    setAuthMode('login')
    setAuthPanelOpen(true)
  }

  const handleRegister = async () => {
    if (!gdprAgreedInForm) {
      alert('Please accept the privacy terms to register.')
      return
    }
    const result = await registerWithEmail(email, password)
    alert(result.message)
    if (result.success) {
      setAuthPanelOpen(false)
      setGdprAgreedInForm(false)
    }
  }

  const handleLogin = async () => {
    const result = await loginWithEmail(email, password)
    alert(result.message)
    if (result.success) {
      setAuthPanelOpen(false)
      navigate('/aurora')
    }
  }

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle()
    if (!result.success) {
      alert(result.message)
      return
    }
    setAuthPanelOpen(false)
    navigate('/aurora')
  }

  const handleLogout = async () => {
    const result = await logout()
    alert(result.message)
    if (result.success) setAuthPanelOpen(false)
  }

  return (
    <header className="site-header">
      <BrandLogo />
      <nav className="site-header-nav" aria-label="Main">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={isNavActive(location.pathname, to) ? 'active' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="site-header-actions">
        <div className="site-header-actions-row">
          {authStatusText && (
            <span className="site-header-status site-header-status-desktop">{authStatusText}</span>
          )}
          {!user && (
            <Link
              to={ACADEMY_APPLY_PATH}
              className="btn btn-primary site-header-auth-btn site-header-apply-desktop"
              style={{ ...baseAuthBtnStyle, minWidth: '190px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {ACADEMY_APPLY_LABEL}
            </Link>
          )}
          {user && (
            <Link
              to="/profile"
              className="btn-secondary site-header-auth-btn site-header-play-free"
              style={{ ...baseAuthBtnStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Profile
            </Link>
          )}
          <button
            type="button"
            className="site-header-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="siteMobileMenu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="site-header-menu-icon" aria-hidden="true">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="site-mobile-menu" id="siteMobileMenu">
            <nav className="site-mobile-nav" aria-label="Mobile">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={isNavActive(location.pathname, to) ? 'active' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {!user ? (
              <Link
                to={ACADEMY_APPLY_PATH}
                className="btn btn-primary site-mobile-apply"
                onClick={() => setMenuOpen(false)}
              >
                {ACADEMY_APPLY_LABEL}
              </Link>
            ) : (
              <div className="site-mobile-user-links">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                {authStatusText && <span className="site-header-status">{authStatusText}</span>}
              </div>
            )}
          </div>
        )}

        {authPanelOpen && (
          <div
            id="authPanel"
            className="card site-header-auth-panel"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <strong style={{ fontSize: '15px' }}>{user ? 'Account' : authMode === 'login' ? 'Sign In' : 'Sign up'}</strong>
              <button type="button" className="btn-ghost" style={{ padding: '4px 10px' }} onClick={() => setAuthPanelOpen(false)} aria-label="Close">✕</button>
            </div>
            {user ? (
              <button className="btn-secondary" type="button" onClick={handleLogout} style={{ width: '100%' }}>Log out</button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  authMode === 'login' ? handleLogin() : handleRegister()
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>
                  Why we ask: we use your email to save progress so you can continue later. Practice cases are not used to score or monitor you at work.
                </p>
                <input className="input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
                <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" />
                {authMode === 'register' && (
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={gdprAgreedInForm} onChange={(e) => setGdprAgreedInForm(e.target.checked)} style={{ marginTop: '2px' }} />
                    <span>I agree to minimal data processing so progress can be saved. <Link to="/privacy">Privacy policy</Link></span>
                  </label>
                )}
                <button type="submit" className={authMode === 'login' ? 'btn-submit' : 'btn-secondary'}>
                  {authMode === 'login' ? 'Sign In' : 'Sign up'}
                </button>
                <button type="button" className="btn-ghost" onClick={handleGoogleLogin} style={{ width: '100%' }}>
                  Continue with Google
                </button>
                <button type="button" className="btn-ghost" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign In'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
