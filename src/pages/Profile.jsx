import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useScoring } from '../contexts/ScoringContext'
import SiteNav from '../components/SiteNav'
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
      setDeleteError(result.message || 'Account deletion failed.')
      setDeleteLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const levelNames = {
    1: 'The Encrypted Data Packet',
    2: 'The Forged Archive',
    3: 'The Undelivered Message',
    4: 'The Missing Timeline',
    5: 'The Hidden Metadata',
    6: 'The Leaking Port',
    7: 'The Dual Identity',
    8: 'The Broken Key',
    9: 'The Interrupted Transmission',
    10: 'The Phantom Profile',
    11: 'The Stolen Shadow Account',
    12: 'The Mastermind'
  }

  return (
    <div className="container">
      <SiteNav />

      <main>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ marginTop: 0 }}>Profile</h1>
          
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(207,230,255,0.2)' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: 'var(--muted)', fontSize: '13px' }}>Email address</strong>
            </div>
            <div style={{ fontSize: '16px', color: '#cfe6ff' }}>{user.email}</div>
            {!user.emailVerified && (
              <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: '6px', fontSize: '13px', color: '#ffc107' }}>
                ⚠️ Your email address is not verified yet
              </div>
            )}
          </div>

          {stats && (
            <>
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(207,230,255,0.2)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Statistics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Score</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#00e5ff' }}>{stats.totalPoints || 0}</div>
                  </div>
                  
                  {currentRank && (
                    <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Rank</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#00e5ff' }}>{currentRank.name}</div>
                    </div>
                  )}
                  
                  <div style={{ padding: '12px', background: 'rgba(0,229,255,0.1)', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.2)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Cases completed</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#00e5ff' }}>{stats.completedLevels || 0}</div>
                  </div>
                  
                  {stats.perfectStreak > 0 && (
                    <div style={{ padding: '12px', background: 'rgba(51,255,153,0.1)', borderRadius: '8px', border: '1px solid rgba(51,255,153,0.2)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '4px' }}>Perfect streak</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#33ff99' }}>{stats.perfectStreak}</div>
                    </div>
                  )}
                </div>

                {completedLevels.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Completed cases:</div>
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
                          Case #{level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px' }}>Account settings</h3>
            
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
                Sign out
              </button>
            </div>
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,107,107,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '18px', color: '#ff6b6b' }}>Danger zone</h3>
            
            {!showDeleteConfirm ? (
              <div>
                <p className="muted" style={{ marginBottom: '12px', fontSize: '14px' }}>
                  Deleting your account is permanent. All your data, scores, and progress will be removed and cannot be recovered.
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
                  Delete account
                </button>
              </div>
            ) : (
              <div>
                <p className="muted" style={{ marginBottom: '12px', fontSize: '14px' }}>
                  <strong>Are you sure?</strong> This will permanently delete your account and all associated data.
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
                    {deleteLoading ? 'Deleting…' : 'Yes, delete my account'}
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
                    Cancel
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
