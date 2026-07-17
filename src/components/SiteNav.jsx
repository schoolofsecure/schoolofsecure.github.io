import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import BrandLogo from './BrandLogo'
import { useAuth } from '../contexts/AuthContext'
import '../index.css'

const navLinks = [
  { to: '/play', label: 'Play' },
  { to: '/learn', label: 'Learn' },
  { to: '/teams', label: 'For Teams' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
]

function isNavActive(pathname, to) {
  if (to === '/') return pathname === '/'
  if (to === '/play') {
    return pathname === '/play' || pathname === '/aurora' || /^\/ugy\d+/.test(pathname)
  }
  if (to === '/learn') return pathname.startsWith('/learn')
  if (to === '/blog') return pathname === '/blog' || pathname.startsWith('/blog/')
  return pathname === to || pathname.startsWith(`${to}/`)
}

const baseAuthBtnStyle = {
  minWidth: '130px',
  height: '42px',
  borderRadius: '999px',
  fontFamily: 'Rajdhani, Inter, sans-serif',
  fontSize: '14px',
  letterSpacing: '0.4px',
  fontWeight: 600,
  padding: '0 18px',
}

export default function SiteNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, registerWithEmail, loginWithEmail, loginWithGoogle, logout } = useAuth()
  const [authPanelOpen, setAuthPanelOpen] = useState(false)
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
    }
  }, [searchParams])

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
            <span className="site-header-status">{authStatusText}</span>
          )}
          {!user && (
            <>
              <button
                type="button"
                className="btn-ghost site-header-auth-btn"
                style={{
                  ...baseAuthBtnStyle,
                  border: '1px solid rgba(207,230,255,0.35)',
                  color: 'var(--ink)',
                  background: 'rgba(255,255,255,0.06)',
                }}
                onClick={() => { setAuthMode('login'); setAuthPanelOpen(true) }}
              >
                Sign In
              </button>
              <Link
                to="/play"
                className="btn btn-primary site-header-auth-btn"
                style={{ ...baseAuthBtnStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Play Free
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                to="/learn/dashboard"
                className="btn-ghost site-header-auth-btn"
                style={{ ...baseAuthBtnStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                My learning
              </Link>
              <Link
                to="/profile"
                className="btn-secondary site-header-auth-btn"
                style={{ ...baseAuthBtnStyle, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Profile
              </Link>
            </>
          )}
        </div>
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
                <input className="input" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {authMode === 'register' && (
                  <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={gdprAgreedInForm} onChange={(e) => setGdprAgreedInForm(e.target.checked)} style={{ marginTop: '2px' }} />
                    <span>I agree to data processing for the game. <Link to="/privacy">Privacy policy</Link></span>
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
