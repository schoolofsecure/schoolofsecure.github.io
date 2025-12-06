import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useScoring } from '../contexts/ScoringContext'
import '../index.css'

const Profile = () => {
  const { user, logout, deleteAccount, checkLevelCompleted, getHighestCompletedLevel } = useAuth()
  const { totalPoints, currentRank, achievements, getStats } = useScoring()
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [stats, setStats] = useState(null)
  const [completedLevels, setCompletedLevels] = useState([])
  const [highestLevel, setHighestLevel] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const loadStats = async () => {
      const statsData = getStats()
      setStats(statsData)
      
      const highest = await getHighestCompletedLevel()
      setHighestLevel(highest)
      
      // Betöltjük, hogy mely pályák teljesítve vannak
      const completed = []
      for (let i = 1; i <= 12; i++) {
        const isCompleted = await checkLevelCompleted(`ugy${i}`)
        if (isCompleted) {
          completed.push(i)
        }
      }
      setCompletedLevels(completed)
    }

    loadStats()
  }, [user, navigate, getStats, getHighestCompletedLevel, checkLevelCompleted])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate('/')
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError('')
    
    const result = await deleteAccount()
    
    if (result.success) {
      navigate('/')
    } else {
      setDeleteError(result.message || 'Fiók törlése sikertelen.')
      setDeleteLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const levelNames = {
    1: 'A Titkosított Adatcsomag',
    2: 'A Hamisított Archívum',
    3: 'A Kézbesítetlen Üzenet',
    4: 'A Hiányzó Idővonal',
    5: 'A Rejtett Metaadat',
    6: 'A Szivárgó Port',
    7: 'A Kettős Identitás',
    8: 'A Törött Kulcs',
    9: 'A Megszakított Átvitel',
    10: 'A Phantom‑Profil',
    11: 'A Lopott Árnyékfiók',
    12: 'A Főkolompos'
  }

  return (
    <div className="container">
      <header>
        <Link to="/aurora" className="brand" aria-label="CyberMystery – Vissza az ügyekhez">
          <div className="brand-badge">CM</div>
          <div>Profil</div>
        </Link>
      </header>

      <main>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ marginTop: 0 }}>Profil</h1>
          
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(207,230,255,0.2)' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: 'var(--muted)', fontSize: '13px' }}>E-mail cím</strong>
            </div>
            <div style={{ fontSize: '16px', color: '#cfe6ff' }}>{user.email}</div>
            {!user.emailVerified && (
              <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: '6px', fontSize: '13px', color: '#ffc107' }}>
                ⚠️ Az e-mail címed még nincs megerősítve
              </div>
            )}
          </div>

          {stats && (
            <>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(207,230,255,0.2)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Statisztikák</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Pontszám</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#00e5ff' }}>{stats.totalPoints || 0}</div>
                  </div>
                  
                  {currentRank && (
                    <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Rang</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#00e5ff' }}>{currentRank.name}</div>
                    </div>
                  )}
                  
                  <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Teljesített pályák</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#00e5ff' }}>{stats.completedLevels || 0}</div>
                  </div>
                  
                  {stats.perfectStreak > 0 && (
                    <div style={{ padding: '12px', background: 'rgba(51,255,153,0.1)', borderRadius: '8px', border: '1px solid rgba(51,255,153,0.2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Hibátlan sorozat</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#33ff99' }}>{stats.perfectStreak}</div>
                    </div>
                  )}
                </div>

                {completedLevels.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Teljesített ügyek:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {completedLevels.map(level => (
                        <span
                          key={level}
                          style={{
                            padding: '4px 10px',
                            background: 'rgba(51,255,153,0.15)',
                            border: '1px solid rgba(51,255,153,0.3)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#33ff99',
                            fontFamily: 'Rajdhani, Inter, sans-serif',
                            fontWeight: 600
                          }}
                        >
                          Ügy #{level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Fiók beállítások</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn-ghost"
                onClick={handleLogout}
                style={{
                  padding: '12px 18px',
                  textAlign: 'left',
                  justifyContent: 'flex-start'
                }}
              >
                Kijelentkezés
              </button>
            </div>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,107,107,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', color: '#ff6b6b' }}>Veszélyes zóna</h3>
            
            {!showDeleteConfirm ? (
              <div>
                <p className="muted" style={{ marginBottom: '12px', fontSize: '14px' }}>
                  A fiók törlése végleges. Minden adatod, pontszámaid és teljesítéseid törlődnek, és ezt nem lehet visszavonni.
                </p>
                <button
                  className="btn-ghost"
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: '12px 18px',
                    borderColor: 'rgba(255,107,107,0.4)',
                    color: '#ff6b6b'
                  }}
                >
                  Fiók törlése
                </button>
              </div>
            ) : (
              <div>
                <p className="muted" style={{ marginBottom: '12px', fontSize: '14px' }}>
                  <strong>Biztos vagy benne?</strong> Ez a művelet véglegesen törli a fiókodat és minden adatodat.
                </p>
                {deleteError && (
                  <div style={{ marginBottom: '12px', padding: '10px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '6px', color: '#ff6b6b', fontSize: '13px' }}>
                    {deleteError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    className="btn"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    style={{
                      padding: '12px 18px',
                      background: 'rgba(255,107,107,0.2)',
                      borderColor: '#ff6b6b',
                      color: '#ff6b6b'
                    }}
                  >
                    {deleteLoading ? 'Törlés folyamatban...' : 'Igen, törlöm a fiókomat'}
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteError('')
                    }}
                    disabled={deleteLoading}
                    style={{ padding: '12px 18px' }}
                  >
                    Mégse
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile

