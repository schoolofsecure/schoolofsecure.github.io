import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import { LevelGenerator } from '../../tasks'
import '../../styles/ugy1.css'

const MAX_LIVES = 3

const Ugy2 = () => {
  const [step, setStep] = useState(0) // 0..4
  const [tasks, setTasks] = useState([])
  const [done, setDone] = useState([false, false, false, false, false])
  const { saveLevelCompletion, isAuthenticated } = useAuth()
  const [lives, setLives] = useState(MAX_LIVES)
  const [lifeMessage, setLifeMessage] = useState('')
  const [currentLevel, setCurrentLevel] = useState(2)

  // Feladatok generálása az oldal betöltésekor
  useEffect(() => {
    // QA debug mód: seed és forced types ellenőrzése
    const qaSeed = sessionStorage.getItem('qa_seed')
    const qaLevel = sessionStorage.getItem('qa_level')
    const qaForcedTypes = sessionStorage.getItem('qa_forced_types')
    
    const level = qaLevel ? parseInt(qaLevel, 10) : 2
    const seed = qaSeed ? parseInt(qaSeed, 10) : null
    const forcedTypes = qaForcedTypes ? JSON.parse(qaForcedTypes) : null
    
    setCurrentLevel(level)
    
    // QA mód cleanup
    if (qaSeed) {
      sessionStorage.removeItem('qa_seed')
      sessionStorage.removeItem('qa_level')
      sessionStorage.removeItem('qa_forced_types')
    }
    
    const generatedTasks = LevelGenerator.generateLevel(level, 5, new Map(), 4, {
      seed,
      forcedTypes
    })
    
    // Minden feladat payload-jának generálása
    generatedTasks.forEach(task => {
      if (!task.payload) {
        task.generate()
      }
    })
    setTasks(generatedTasks)
    setDone(Array(generatedTasks.length).fill(false))
  }, [])

  const next = () => setStep(s => Math.min(s + 1, 4))
  const markDone = (i) => setDone(d => {
    const nd = d.slice()
    nd[i] = true
    return nd
  })

  const completedCount = useMemo(() => done.filter(Boolean).length, [done])
  const totalTasks = tasks.length || 5
  const progressPct = useMemo(() => (totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0), [completedCount, totalTasks])

  const loseLife = () => {
    setLives((prev) => Math.max(0, prev - 1))
  }

  const rewardLife = () => {
    setLives((prev) => prev + 1)
  }

  useEffect(() => {
    if (lives === 0) {
      setLifeMessage('Elfogytak az életek. Újrakezdjük az ügyet az elejétől.')
      const timeout = setTimeout(() => {
        setStep(0)
        setDone([false, false, false, false, false])
        setLives(MAX_LIVES)
        setLifeMessage('Újrakezdve – 3 friss élet.')
        setTimeout(() => setLifeMessage(''), 2000)
      }, 1800)
      return () => clearTimeout(timeout)
    }
  }, [lives])

  const handleCompletion = async () => {
    markDone(4)
    try {
      if (isAuthenticated) {
        await saveLevelCompletion('ugy2')
      }
      rewardLife()
    } catch (e) {
      console.warn('Nem sikerült menteni a teljesítést:', e)
    }
  }

  const handleTaskSuccess = (taskIndex) => {
    markDone(taskIndex)
    if (taskIndex < 4) {
      setTimeout(next, 400)
    } else {
      handleCompletion()
    }
  }

  const handleTaskFailure = () => {
    loseLife()
  }

  const currentTask = tasks[step]

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>Ügy #{currentLevel}</div>
        </Link>
      </header>
      <div
        className="lives-hud"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)' }}>
          <span role="img" aria-label="Játékos ikon">🕵️</span>
          <strong style={{ fontFamily: 'Rajdhani, Inter, sans-serif', letterSpacing: '0.4px' }}>Életek</strong>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minHeight: '16px' }}>
          {lives === 0 && <span style={{ color: 'var(--danger)', fontSize: '12px' }}>nincs</span>}
          {lives > 0 && lives <= 3 && (
            <span>
              {Array.from({ length: lives }).map((_, idx) => (
                <span key={idx} style={{ color: '#00e5ff', marginRight: '2px' }}>●</span>
              ))}
            </span>
          )}
          {lives > 3 && (
            <span style={{ color: '#00e5ff', fontWeight: 700, fontSize: '13px' }}>
              {lives} élet
            </span>
          )}
        </div>
      </div>
      {lifeMessage && (
        <div
          style={{
            textAlign: 'right',
            fontSize: '12px',
            color: 'var(--muted)',
            marginTop: '-6px',
            marginBottom: '12px'
          }}
        >
          {lifeMessage}
        </div>
      )}

      <main>
        <NarrativeBlock badge={`Ügy #${currentLevel}`}>
          <h1 style={{ margin: '10px 0 4px' }}>Ügy #{currentLevel}</h1>
          <p>
            Az üres termekben csak az érzékelők pislognak. Az archívumban mozgás nyomai, de hiányzik az idővonal.
            A restaurátor szerint „csak egy kis rendrakás" – szerintünk nem.
          </p>
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{ width: progressPct + '%' }} /></div>
          <div className="step">{completedCount} / {totalTasks}</div>
        </div>

        {tasks.length === 0 ? (
          <div className="card">
            <p className="muted">Feladatok betöltése...</p>
          </div>
        ) : (
          <TaskCard title={`${step + 1}. feladat`}>
            {currentTask ? (
              <>
                <TaskRenderer
                  task={currentTask}
                  onSuccess={() => handleTaskSuccess(step)}
                  onFailure={handleTaskFailure}
                />
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(207,230,255,0.2)',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}
                >
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => handleTaskSuccess(step)}
                    style={{
                      fontSize: '13px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      borderColor: 'rgba(0,229,255,0.4)'
                    }}
                  >
                    ✅ Megoldás + Következő
                  </button>
                </div>
              </>
            ) : (
              <p className="muted">Aktív feladat betöltése...</p>
            )}
          </TaskCard>
        )}

        {completedCount === tasks.length && tasks.length > 0 && (
          <div className="card" style={{ marginTop: '20px', animation: 'fadeIn .3s ease both' }}>
            {currentLevel === 2 ? (
              <>
                <h3 style={{ marginTop: 0 }}>✅ Pálya teljesítve</h3>
                <p className="muted" style={{ marginBottom: '16px' }}>
                  Gratulálunk! A harmadik pálya <strong>december 6-án, este 7 órakor nyílik</strong>.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    to="/aurora"
                    style={{
                      fontSize: '12px',
                      color: 'var(--muted)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      padding: '4px 0'
                    }}
                  >
                    Vissza az ügyekhez
                  </Link>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  to="/aurora"
                  style={{
                    fontSize: '12px',
                    color: 'var(--muted)',
                    textDecoration: 'underline',
                    textUnderlineOffset: '4px',
                    padding: '4px 0'
                  }}
                >
                  Vissza az ügyekhez
                </Link>
                <Link
                  className="btn"
                  to={`/ugy${currentLevel + 1}`}
                  style={{
                    textDecoration: 'none',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minWidth: '0',
                    padding: '10px 18px',
                    fontSize: '13px'
                  }}
                >
                  Tovább a következő ügyre
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Ugy2
