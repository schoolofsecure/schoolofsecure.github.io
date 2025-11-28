import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../index.css'
import '../styles/aurora.css'

const Aurora = () => {
  const { loginWithEmail, registerWithEmail, isAuthenticated, user, saveLevelCompletion, checkMissionCompletion, getHighestCompletedLevel } = useAuth()
  const [data, setData] = useState(null)
  const [unlocked, setUnlocked] = useState(false)
  const [showLevels, setShowLevels] = useState(false)
  const [showMission, setShowMission] = useState(false)
  const [missionCompleted, setMissionCompleted] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gateError, setGateError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [entryCode, setEntryCode] = useState('')
  const [entryStatus, setEntryStatus] = useState('')
  const [entryStatusType, setEntryStatusType] = useState('')
  const [retroPromptDismissed, setRetroPromptDismissed] = useState(true)
  const [retroSaving, setRetroSaving] = useState(false)
  const [retroError, setRetroError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/data/aurora.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (data?.mission) {
      setEntryStatus(data.mission.statusReady || '[status] READY — várakozás a bevitelre…')
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
      if (isAuthenticated) {
        setUnlocked(true)
        
        // Ellenőrizzük a mission teljesítését Firebase-ből
        const completed = await checkMissionCompletion()
        setMissionCompleted(completed)
        
        // Ha a mission már teljesítve van Firebase-ben, akkor rögtön a levels panelt mutatjuk
        if (completed) {
          setShowLevels(true)
          setShowMission(false)
        } else {
          setShowLevels(false)
          setShowMission(true)
        }
      } else {
        // Ha nincs bejelentkezve, akkor zárolva marad
        setUnlocked(false)
        setShowLevels(false)
        setShowMission(false)
        setMissionCompleted(false)
      }
    }
    
    checkMission()
  }, [isAuthenticated, checkMissionCompletion])

  useEffect(() => {
    if (isAuthenticated) {
      setRetroPromptDismissed(false)
    } else {
      setRetroPromptDismissed(true)
      setRetroError('')
    }
  }, [isAuthenticated])

  const handleGateSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setGateError('Írj be az e-mail címet és a jelszót.')
      return
    }
    
    const result = await loginWithEmail(email, password)
    if (result.success) {
      setUnlocked(true)
      setGateError('')
      // A useEffect automatikusan ellenőrzi a mission teljesítését és beállítja a panelt
    } else {
      setGateError(result.message || 'Bejelentkezés sikertelen.')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setGateError('Írj be az e-mail címet és a jelszót.')
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
        setGateError(result.message || 'Regisztráció sikertelen.')
        setRegistrationSuccess(false)
      }
    } catch (error) {
      setGateError(error.message || 'Regisztráció sikertelen.')
      setRegistrationSuccess(false)
    }
  }

  const handleRetroCompletionClaim = async () => {
    if (!isAuthenticated) return
    setRetroSaving(true)
    setRetroError('')
    try {
      const missionResult = await saveLevelCompletion('mission')
      if (!missionResult?.success) {
        throw new Error(missionResult?.message || 'Nem sikerült rögzíteni a belépő protokollt.')
      }
      const ugy1Result = await saveLevelCompletion('ugy1')
      if (!ugy1Result?.success) {
        throw new Error(ugy1Result?.message || 'Nem sikerült rögzíteni az első ügyet.')
      }
      setMissionCompleted(true)
      setRetroPromptDismissed(true)
      setShowMission(false)
      setShowLevels(true)
      if (typeof window.updateLevelAccess === 'function') {
        window.updateLevelAccess()
      }
    } catch (error) {
      setRetroError(error.message || 'Nem sikerült rögzíteni a teljesítést. Próbáld meg újra.')
    } finally {
      setRetroSaving(false)
    }
  }

  const handleEntrySubmit = async () => {
    if (!data?.mission) return
    const allowed = /^[A-Za-z0-9-]+$/
    const v = entryCode.trim()
    
    if (!v) {
      setEntryStatus(data.mission.statusErrEmpty || '[status] HIBA — üres bevitel.')
      setEntryStatusType('err')
      return
    }
    if (!allowed.test(v)) {
      setEntryStatus(data.mission.statusErrChars || '[status] HIBA — csak betűk, számok és kötőjel engedélyezett.')
      setEntryStatusType('err')
      return
    }
    if (v.toUpperCase() === (data.mission.expected || '').toUpperCase()) {
      setEntryStatus(data.mission.statusOk || '[status] ACCESS GRANTED — belépő protokoll teljesítve.')
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
          console.warn('Nem sikerült menteni a mission teljesítését Firebase-be:', error)
          setEntryStatus('Hiba történt a mentés során. Próbáld újra.')
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
      setEntryStatus(data.mission.statusErrWrong || '[status] ACCESS DENIED — ellenőrizd az „ACCESS" írásmódját és a kötőjeleket.')
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

  if (!data) {
    return <div className="container">Betöltés...</div>
  }

  return (
    <div className="aurora-container">
      <header className="aurora-header">
        <Link to="/" className="aurora-brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div className="brand-title">CyberMystery</div>
        </Link>
      </header>

      {!unlocked && (
        <div className="gate" id="gate">
          <div className="gate-card">
            <h1 id="gateTitle">{data.gate?.title || 'Belépés szükséges'}</h1>
            <p id="gateDesc">{data.gate?.desc || ''}</p>
            <form id="gateForm" className="gate-form" onSubmit={handleGateSubmit}>
              <input
                id="email"
                className="input"
                type="email"
                placeholder="E-mail cím"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setGateError('')
                  setRegistrationSuccess(false)
                }}
                style={{marginBottom: '10px'}}
              />
              <input
                id="password"
                className="input"
                type="password"
                placeholder="Jelszó"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setGateError('')
                  setRegistrationSuccess(false)
                }}
                style={{marginBottom: '10px'}}
              />
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button className="btn" type="submit">Bejelentkezés</button>
                <button className="btn-ghost" type="button" onClick={handleRegister}>Regisztráció</button>
              </div>
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
                ✓ Sikeres regisztráció! Küldtünk egy megerősítő e-mailt az <strong>{email}</strong> címre.<br />
                Ellenőrizd a postaládádat, majd jelentkezz be a jelszóval, miután megerősítetted az e-mailt.
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
                <h3 style={{marginTop:0, fontSize:'16px'}}>Már megoldottad korábban?</h3>
                <p style={{color:'var(--muted)', margin:'4px 0 12px'}}>
                  Ha regisztráció előtt már teljesítetted a belépő protokollt és az első ügyet, most vissza tudjuk jelölni neked.
                </p>
                <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                  <button
                    className="btn"
                    type="button"
                    onClick={handleRetroCompletionClaim}
                    disabled={retroSaving}
                  >
                    {retroSaving ? 'Mentés folyamatban…' : 'Igen, már megoldottam'}
                  </button>
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => setRetroPromptDismissed(true)}
                  >
                    Nem, most fogom megoldani
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
                  <button id="entryBtn" className="btn" onClick={handleEntrySubmit}>Beküldés</button>
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
                const isUgy3 = card.n === 3
                // Speciális eset: ha a 3. kártya és a 2-es pálya teljesítve van, akkor ne legyen feloldva
                let isUnlocked
                if (isUgy3 && isUgy2Completed) {
                  // A 3. kártya ne legyen feloldva, ha csak a 2-es pálya van teljesítve
                  isUnlocked = false
                } else {
                  isUnlocked = card.n <= highestCompleted + 1 || (card.n === 1 && !card.locked)
                }
                const showDecember6 = isUgy3 && isUgy2Completed && !isUnlocked
                
                return isUnlocked ? (
                  <Link
                    key={card.n}
                    to={card.href || (card.n === 1 ? '/ugy1' : `/ugy${card.n}`)}
                    className="level-card"
                  >
                    <span className="level-label">Ügy #{card.n}</span>
                    <img src={card.img} alt={`Ügy ${card.n}`} loading="lazy" />
                    <div className="case-title">{card.title}</div>
                  </Link>
                ) : (
                  <div 
                    key={card.n} 
                    className="level-card" 
                    aria-disabled={!showDecember6}
                    style={{ 
                      position: 'relative',
                      filter: showDecember6 ? 'none' : 'grayscale(1) opacity(0.8)'
                    }}
                  >
                    <span className="level-label">Ügy #{card.n}</span>
                    <img src={card.img} alt={`Ügy ${card.n}`} loading="lazy" />
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
                        December 6-án, este 7 órakor nyílik
                      </div>
                    )}
                    {!showDecember6 && (
                      <span className="coming" aria-label="Zárolt">🔒</span>
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

