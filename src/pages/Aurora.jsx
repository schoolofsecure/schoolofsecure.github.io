import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { sanitizeErrorMessage } from '../utils/sanitize'
import { ugyConfigs } from './ugyConfigs.jsx'
import SiteNav from '../components/SiteNav'
import { logger } from '../utils/logger'
import '../styles/aurora.css'

const Aurora = () => {
  const { loginWithEmail, loginWithGoogle, registerWithEmail, sendPasswordReset, isAuthenticated, user, saveLevelCompletion, checkMissionCompletion, getHighestCompletedLevel, logout, getRetroPromptSeen, setRetroPromptSeen } = useAuth()
  const [data, setData] = useState(null)
  const [unlocked, setUnlocked] = useState(false)
  const [showLevels, setShowLevels] = useState(false)
  const [showMission, setShowMission] = useState(false)
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gateError, setGateError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [passwordResetMessage, setPasswordResetMessage] = useState('')
  const [entryCode, setEntryCode] = useState('')
  const [entryStatus, setEntryStatus] = useState('')
  const [entryStatusType, setEntryStatusType] = useState('')
  const [retroPromptDismissed, setRetroPromptDismissed] = useState(true)
  const [retroSaving, setRetroSaving] = useState(false)
  const [retroError, setRetroError] = useState('')
  const [isLevel3Unlocked, setIsLevel3Unlocked] = useState(false)
  const [isLevel4Unlocked, setIsLevel4Unlocked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/data/aurora.json')
      .then(res => res.json())
      .then(setData)
      .catch((e) => logger.error('Aurora data fetch error:', e))
  }, [])

  useEffect(() => {
    if (data?.mission) {
      setEntryStatus(data.mission.statusReady || '[status] READY — awaiting input…')
      setEntryStatusType('')
    }
  }, [data])

  useEffect(() => {
    if (missionCompleted) {
      setRetroPromptDismissed(true)
      setRetroError('')
    }
  }, [missionCompleted])

  useEffect(() => {
    document.body.classList.add('aurora-page')
    return () => {
      document.body.classList.remove('aurora-page')
    }
  }, [])

  // Firebase auth állapot figyelése és unlock logika
  useEffect(() => {
    const checkMission = async () => {
      if (isAuthenticated && user) {
        setUnlocked(true)
        
        // Ellenőrizzük, hogy ez az első bejelentkezés-e (Firebase-ből)
        const hasSeenPrompt = await getRetroPromptSeen()
        
        // Ellenőrizzük a mission teljesítését Firebase-ből
        const completed = await checkMissionCompletion()
        setMissionCompleted(completed)
        
        // Ha a mission már teljesítve van Firebase-ben, akkor rögtön a levels panelt mutatjuk
        if (completed) {
          setShowLevels(true)
          setShowMission(false)
          setRetroPromptDismissed(true)
        } else {
          setShowLevels(false)
          setShowMission(true)
          // Csak az első bejelentkezéskor jelenjen meg a prompt
          if (!hasSeenPrompt) {
            setRetroPromptDismissed(false)
          } else {
            setRetroPromptDismissed(true)
          }
        }
      } else {
        // Ha nincs bejelentkezve, akkor zárolva marad
        setUnlocked(false)
        setShowLevels(false)
        setShowMission(false)
        setMissionCompleted(false)
        setRetroPromptDismissed(true)
        setRetroError('')
      }
    }
    
    checkMission()
  }, [isAuthenticated, checkMissionCompletion, getRetroPromptSeen, user])

  const handleGateSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setGateError('Enter your email and password.')
      return
    }
    
    const result = await loginWithEmail(email, password)
    if (result.success) {
      setUnlocked(true)
      setGateError('')
      // A useEffect automatikusan ellenőrzi a mission teljesítését és beállítja a panelt
    } else {
      setGateError(result.message || 'Sign-in failed.')
    }
  }

  const handleGoogleLogin = async () => {
    setGateError('')
    setRegistrationSuccess(false)
    const result = await loginWithGoogle()
    if (result.success) {
      setUnlocked(true)
      setGateError('')
    } else {
      setGateError(result.message || 'Google sign-in failed.')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setGateError('Enter your email and password.')
      setRegistrationSuccess(false)
      return
    }
    
    setGateError('')
    setRegistrationSuccess(false)
    
    try {
      const result = await registerWithEmail(email, password)
      if (result.success) {
        // Sikeres regisztráció után töröljük a jelszó mezőt biztonsági okokból
        setPassword('')
        // Pozitív visszajelzés
        setGateError('')
        setRegistrationSuccess(true)
      } else {
        setGateError(result.message || 'Registration failed.')
        setRegistrationSuccess(false)
      }
    } catch (error) {
      setGateError(sanitizeErrorMessage(error) || 'Registration failed.')
      setRegistrationSuccess(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setPasswordResetMessage('Enter your email address to reset your password.')
      return
    }
    
    setPasswordResetMessage('')
    setGateError('')
    
    try {
      await sendPasswordReset(email)
      // Biztonsági okokból mindig ugyanazt az üzenetet mutatjuk
      setPasswordResetMessage('If that email is registered with us, we sent a password reset link. Check your inbox.')
    } catch (error) {
      // Biztonsági okokból mindig ugyanazt az üzenetet mutatjuk
      setPasswordResetMessage('If that email is registered with us, we sent a password reset link. Check your inbox.')
    }
  }

  const handleRetroCompletionClaim = async () => {
    if (!isAuthenticated || !user) return
    setRetroSaving(true)
    setRetroError('')
    try {
      const missionResult = await saveLevelCompletion('mission')
      if (!missionResult?.success) {
        throw new Error(missionResult?.message || 'Could not record entry protocol completion.')
      }
      const ugy1Result = await saveLevelCompletion('ugy1')
      if (!ugy1Result?.success) {
        throw new Error(ugy1Result?.message || 'Could not record the first case.')
      }
      // Jelöljük meg, hogy látta a promptot (Firebase-ben)
      await setRetroPromptSeen()
      setMissionCompleted(true)
      setRetroPromptDismissed(true)
      setShowMission(false)
      setShowLevels(true)
      if (typeof window.updateLevelAccess === 'function') {
        window.updateLevelAccess()
      }
    } catch (error) {
      setRetroError(sanitizeErrorMessage(error) || 'Could not save your progress. Please try again.')
    } finally {
      setRetroSaving(false)
    }
  }

  const handleRetroDismiss = async () => {
    if (!user) return
    // Jelöljük meg, hogy látta a promptot, még akkor is, ha "Nem"-et válaszolt (Firebase-ben)
    await setRetroPromptSeen()
    setRetroPromptDismissed(true)
  }

  const handleEntrySubmit = async () => {
    if (!data?.mission) return
    const allowed = /^[A-Za-z0-9-]+$/
    const v = entryCode.trim()
    
    if (!v) {
      setEntryStatus(data.mission.statusErrEmpty || '[status] ERROR — empty input.')
      setEntryStatusType('err')
      return
    }
    if (!allowed.test(v)) {
      setEntryStatus(data.mission.statusErrChars || '[status] ERROR — letters, numbers and hyphens only.')
      setEntryStatusType('err')
      return
    }
    if (v.toUpperCase() === (data.mission.expected || '').toUpperCase()) {
      setEntryStatus(data.mission.statusOk || '[status] ACCESS GRANTED — entry protocol complete.')
      setEntryStatusType('ok')
      
      // Firebase mentés, ha be van jelentkezve
      if (isAuthenticated) {
        try {
          await saveLevelCompletion('mission')
          setMissionCompleted(true)
          setTimeout(() => {
            setShowMission(false)
            setShowLevels(true)
          }, 1000)
        } catch (error) {
          logger.warn('Could not save mission completion to Firebase:', error)
          setEntryStatus('Something went wrong while saving. Please try again.')
          setEntryStatusType('err')
        }
      } else {
        // Ha nincs bejelentkezve, akkor nem menthetjük, de a UI-t frissítjük
        setTimeout(() => {
          setShowMission(false)
          setShowLevels(true)
        }, 1000)
      }
    } else {
      setEntryStatus(data.mission.statusErrWrong || '[status] ACCESS DENIED — check the spelling of "ACCESS" and the hyphens.')
      setEntryStatusType('err')
    }
  }

  const [highestCompleted, setHighestCompleted] = useState(0)

  // Frissítjük a pályák elérhetőségét Firebase-ből
  useEffect(() => {
    const updateLevelAccess = async () => {
      if (isAuthenticated) {
        const highest = await getHighestCompletedLevel()
        setHighestCompleted(highest)
      } else {
        setHighestCompleted(0)
      }
    }

    // Exportáljuk globálisan a kompatibilitásért (ha valahol még hivatkoznak rá)
    window.updateLevelAccess = updateLevelAccess

    // Kezdeti érték beállítása
    updateLevelAccess()

    // Polling a Firebase változásaihoz
    const interval = setInterval(updateLevelAccess, 2000)

    return () => {
      clearInterval(interval)
      // Töröljük a globális függvényt unmount-nál
      delete window.updateLevelAccess
    }
  }, [isAuthenticated, getHighestCompletedLevel])

  // Ügy 3 unlock dátum ellenőrzése
  useEffect(() => {
    const ugy2Config = ugyConfigs[2]
    if (ugy2Config?.unlockDate) {
      const unlockDate = new Date(ugy2Config.unlockDate)
      const updateUnlock = () => {
        setIsLevel3Unlocked(new Date() >= unlockDate)
      }
      updateUnlock()
      const interval = setInterval(updateUnlock, 60000) // Perenként ellenőrzés
      return () => clearInterval(interval)
    }
  }, [])

  // Ügy 4 unlock dátum ellenőrzése
  useEffect(() => {
    const ugy4Config = ugyConfigs[4]
    if (ugy4Config?.unlockDate) {
      const unlockDate = new Date(ugy4Config.unlockDate)
      const updateUnlock = () => {
        setIsLevel4Unlocked(new Date() >= unlockDate)
      }
      updateUnlock()
      const interval = setInterval(updateUnlock, 60000) // Perenként ellenőrzés
      return () => clearInterval(interval)
    }
  }, [])

  if (!data) {
    return <div className="container">Loading…</div>
  }

  return (
    <div className="aurora-container">
      <SiteNav />

      {!unlocked && (
        <div className="gate" id="gate">
          <div className="gate-card">
            <h1 id="gateTitle">{data.gate?.title || 'Sign in required'}</h1>
            <p id="gateDesc">{data.gate?.desc || ''}</p>
            <form id="gateForm" className="gate-form" onSubmit={handleGateSubmit}>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setGateError('')
                  setRegistrationSuccess(false)
                  setPasswordResetMessage('')
                }}
                style={{marginBottom: '10px'}}
              />
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setGateError('')
                  setRegistrationSuccess(false)
                }}
                style={{marginBottom: '10px'}}
              />
              <div className="gate-actions">
                <button className="btn" type="submit">Sign in</button>
                <button className="btn-ghost" type="button" onClick={handleRegister}>Register</button>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={!email.trim()}
                  style={{
                    opacity: email.trim() ? 1 : 0.5,
                    cursor: email.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  Reset password
                </button>
              </div>
              <button
                className="btn-ghost"
                type="button"
                onClick={handleGoogleLogin}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Continue with Google
              </button>
            </form>
            {registrationSuccess && (
              <div style={{
                marginTop: '10px',
                padding: '12px',
                background: 'rgba(51, 255, 153, 0.1)',
                border: '1px solid rgba(51, 255, 153, 0.3)',
                borderRadius: '8px',
                color: 'var(--ok)',
                fontSize: '14px'
              }}>
                ✓ Registration successful! We sent a confirmation email to <strong>{email}</strong>.<br />
                Check your inbox, then sign in after you verify your email.
              </div>
            )}
            {passwordResetMessage && (
              <div style={{
                marginTop: '10px',
                padding: '12px',
                background: 'rgba(51, 255, 153, 0.1)',
                border: '1px solid rgba(51, 255, 153, 0.3)',
                borderRadius: '8px',
                color: 'var(--ok)',
                fontSize: '14px'
              }}>
                {passwordResetMessage}
              </div>
            )}
            {gateError && <div className="error" id="err" style={{marginTop: '10px'}}>{gateError}</div>}
            {data.gate?.hint && !registrationSuccess && <p id="gateHint" style={{marginTop: '8px', fontSize: '13px', color: 'var(--muted)'}}>{data.gate.hint}</p>}
          </div>
        </div>
      )}

      <main style={{
        filter: unlocked ? 'none' : 'blur(6px)',
        pointerEvents: unlocked ? 'auto' : 'none',
        userSelect: unlocked ? 'auto' : 'none'
      }}>
        {unlocked && (
          <p className="muted" style={{ maxWidth: 720, margin: '12px auto 0', padding: '0 16px', fontSize: 14, lineHeight: 1.55 }}>
            Aurora – an Iterali story world. Practise decisions under pressure. Review without blame. Teams see skill patterns, not individual mistake replays.
          </p>
        )}
        {showMission && (
          <div id="missionPanel" className="cm-surface">
            <span className="cm-badge" id="missionBadge">{data.mission?.badge || ''}</span>
            <h2 className="cm-title" id="missionTitle">{data.mission?.title || ''}</h2>
            <p className="cm-story" id="missionNarr1">{data.mission?.narr1 || ''}</p>
            <p className="cm-story" id="missionNarr2">{data.mission?.narr2 || ''}</p>
            {!missionCompleted && !retroPromptDismissed && (
              <div
                className="cm-card"
                style={{
                  marginBottom:'16px',
                  border:'1px solid rgba(0,229,255,0.25)',
                  background:'rgba(5,16,29,0.8)'
                }}
              >
                <h3 style={{marginTop:0, fontSize:'16px'}}>Already solved this before?</h3>
                <p style={{color:'var(--muted)', margin:'4px 0 12px'}}>
                  If you completed the entry protocol and the first case before registering, we can mark them as done on your account.
                </p>
                <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                  <button
                    className="btn"
                    type="button"
                    onClick={handleRetroCompletionClaim}
                    disabled={retroSaving}
                  >
                    {retroSaving ? 'Saving…' : 'Yes, I already solved it'}
                  </button>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={handleRetroDismiss}
                  >
                    No, I'll solve it now
                  </button>
                </div>
                {retroError && (
                  <div className="error" style={{marginTop:'10px'}}>
                    {retroError}
                  </div>
                )}
              </div>
            )}
            <div className="cm-grid">
              <div className="cm-card">
                <h3 id="missionPaneLeftTitle">{data.mission?.leftTitle || ''}</h3>
                <div className="cm-puzzle" id="missionPuzzleHTML" dangerouslySetInnerHTML={{__html: data.mission?.puzzleHTML || ''}}></div>
                <div className={`cm-statusline caret ${entryStatusType ? `status-${entryStatusType}` : ''}`} id="entryStatus">
                  {entryStatus || data.mission?.statusReady || ''}
                </div>
              </div>
              <div className="cm-card">
                <h3 id="missionPaneRightTitle">{data.mission?.rightTitle || ''}</h3>
                <div className="cm-input">
                  <input
                    id="entryInput"
                    className="input"
                    type="text"
                    placeholder={data.mission?.inputPlaceholder || ''}
                    value={entryCode}
                    onChange={(e) => setEntryCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleEntrySubmit()
                      }
                    }}
                  />
                  <button id="entryBtn" className="btn" onClick={handleEntrySubmit}>Submit</button>
                </div>
                <div className="cm-hint">
                  <details>
                    <summary id="missionHintTitle">{data.mission?.hintTitle || ''}</summary>
                    <p style={{marginTop: '6px', color: 'var(--muted)'}} id="missionHintText">{data.mission?.hintText || ''}</p>
                    <div className="cm-chips" id="missionHintChips">
                      {(data.mission?.hintChips || []).map((chip, i) => (
                        <span key={i} className="cm-chip">{chip}</span>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLevels && (
          <div id="levelsPanel" className="panel">
            <h2 id="levelsTitle">{data.levels?.title || ''}</h2>
            <p id="levelsDesc">{data.levels?.desc || ''}</p>
            <div className="levels-grid" id="levelsGrid">
              {(data.levels?.cards || []).map((card) => {
                // A 3. kártya ne legyen automatikusan feloldva, ha csak a 2-es pálya van teljesítve
                const isUgy2Completed = highestCompleted >= 2
                const isUgy3Completed = highestCompleted >= 3
                const isUgy4Completed = highestCompleted >= 4
                const isUgy3 = card.n === 3
                const isUgy4 = card.n === 4
                const isUgy5 = card.n === 5
                const isCompleted = card.n <= highestCompleted
                
                // Speciális eset: ha a 3. kártya és a 2-es pálya teljesítve van, akkor ne legyen feloldva
                let isUnlocked
                if (card.n >= 5) {
                  // Az 5. ügytől felfelé (5, 6, 7, 8, 9, 10, 11, 12) mindegyik inaktív
                  isUnlocked = false
                } else if (isUgy3 && isUgy2Completed) {
                  // A 3. kártya unlockolva van, ha az ügy 2 teljesítve van ÉS elérkezett a dátum
                  isUnlocked = isLevel3Unlocked
                } else if (isUgy4 && isUgy3Completed) {
                  // A 4. kártya unlockolva van, ha az ügy 3 teljesítve van ÉS elérkezett a dátum
                  isUnlocked = isLevel4Unlocked
                } else {
                  // Minden pálya elérhető, ha már teljesítve van, vagy a következő pálya
                  isUnlocked = card.n <= highestCompleted + 1 || (card.n === 1 && !card.locked)
                }
                const showDecember6 = isUgy3 && isUgy2Completed && !isUnlocked
                const showDecember13 = isUgy4 && isUgy3Completed && !isUnlocked
                
                return isUnlocked ? (
                  <Link
                    key={card.n}
                    to={
                      card.href && card.href !== '#'
                        ? card.href
                        : (card.n === 1 ? '/ugy1' : `/ugy${card.n}`)
                    }
                    className="level-card"
                    style={{
                      position: 'relative'
                    }}
                  >
                    <span className="level-label">Case #{card.n}</span>
                    <img src={card.img} alt={`Case ${card.n}`} loading="lazy" />
                    <div className="case-title">{card.title}</div>
                    {isCompleted && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(51, 255, 153, 0.15)',
                          border: '1px solid rgba(51, 255, 153, 0.4)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          color: '#33ff99',
                          fontFamily: 'Rajdhani, Inter, sans-serif',
                          fontWeight: 600,
                          letterSpacing: '0.3px'
                        }}
                      >
                        ✓ Completed
                      </div>
                    )}
                  </Link>
                ) : (
                  <div 
                    key={card.n} 
                    className="level-card" 
                    aria-disabled={!showDecember6 && !showDecember13}
                    style={{ 
                      position: 'relative',
                      filter: 'grayscale(1) opacity(0.8)'
                    }}
                  >
                    <span className="level-label">Case #{card.n}</span>
                    <img src={card.img} alt={`Case ${card.n}`} loading="lazy" />
                    <div className="case-title">{card.title}</div>
                    {showDecember6 && (
                      <div 
                        className="december-6-notice"
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          right: '8px',
                          background: 'rgba(0, 229, 255, 0.2)',
                          border: '1px solid rgba(0, 229, 255, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          color: '#00e5ff',
                          textAlign: 'center',
                          fontFamily: 'Rajdhani, Inter, sans-serif',
                          fontWeight: 600,
                          backdropFilter: 'blur(6px)',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0, 229, 255, 0.2)',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Opens December 6 at 7 PM
                      </div>
                    )}
                    {showDecember13 && (
                      <div 
                        className="december-13-notice"
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          right: '8px',
                          background: 'rgba(0, 229, 255, 0.2)',
                          border: '1px solid rgba(0, 229, 255, 0.5)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          fontSize: '13px',
                          color: '#00e5ff',
                          textAlign: 'center',
                          fontFamily: 'Rajdhani, Inter, sans-serif',
                          fontWeight: 600,
                          backdropFilter: 'blur(6px)',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0, 229, 255, 0.2)',
                          letterSpacing: '0.3px'
                        }}
                      >
                        Opens December 18 at 7 PM
                      </div>
                    )}
                    {!showDecember6 && !showDecember13 && (
                    <span className="coming" aria-label="Locked">🔒</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Aurora

