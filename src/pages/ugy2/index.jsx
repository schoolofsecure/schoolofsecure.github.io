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

  // Feladatok generálása az oldal betöltésekor
  useEffect(() => {
    const generatedTasks = LevelGenerator.generateLevel(2, 5)
    // Minden feladat payload-jának generálása
    generatedTasks.forEach(task => {
      if (!task.payload) {
        task.generate()
      }
    })
    setTasks(generatedTasks)
  }, [])

  const next = () => setStep(s => Math.min(s + 1, 4))
  const markDone = (i) => setDone(d => {
    const nd = d.slice()
    nd[i] = true
    return nd
  })

  const progressPct = useMemo(() => ((done.filter(Boolean).length) / 5) * 100, [done])

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
          <div>A hamisított archívum – Ügy #2</div>
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
        <NarrativeBlock badge="Archívum – hamisított nyomok">
          <h1 style={{ margin: '10px 0 4px' }}>A hamisított archívum – Ügy #2</h1>
          <p>
            Az üres termekben csak az érzékelők pislognak. Az archívumban mozgás nyomai, de hiányzik az idővonal.
            A restaurátor szerint „csak egy kis rendrakás" – szerintünk nem.
          </p>
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{ width: progressPct + '%' }} /></div>
          <div className="step">{done.filter(Boolean).length} / 5</div>
        </div>

        {tasks.length === 0 ? (
          <div className="card">
            <p className="muted">Feladatok betöltése...</p>
          </div>
        ) : (
          <>
            {step === 0 && currentTask && (
              <TaskCard title="1. feladat">
                <TaskRenderer
                  task={currentTask}
                  onSuccess={() => handleTaskSuccess(0)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 1 && tasks[1] && (
              <TaskCard title="2. feladat">
                <TaskRenderer
                  task={tasks[1]}
                  onSuccess={() => handleTaskSuccess(1)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 2 && tasks[2] && (
              <TaskCard title="3. feladat">
                <TaskRenderer
                  task={tasks[2]}
                  onSuccess={() => handleTaskSuccess(2)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 3 && tasks[3] && (
              <TaskCard title="4. feladat">
                <TaskRenderer
                  task={tasks[3]}
                  onSuccess={() => handleTaskSuccess(3)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 4 && tasks[4] && (
              <TaskCard title="5. feladat">
                <TaskRenderer
                  task={tasks[4]}
                  onSuccess={() => handleTaskSuccess(4)}
                  onFailure={handleTaskFailure}
                />
                {done[4] && (
                  <div className="card" style={{ marginTop: '10px', animation: 'fadeIn .3s ease both' }}>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
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
                        to="/ugy3"
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
                  </div>
                )}
              </TaskCard>
            )}
          </>
        )}

        <div className="card" style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4].map((idx) => (
            <button
              key={idx}
              type="button"
              className={idx === step ? 'btn' : 'btn-ghost'}
              style={{ minWidth: '160px' }}
              onClick={() => setStep(idx)}
            >
              {idx + 1}. feladat
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Ugy2
