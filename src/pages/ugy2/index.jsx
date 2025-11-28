import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useScoring } from '../../contexts/ScoringContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import ScoreDisplay from '../../components/Scoring/ScoreDisplay'
import { LevelGenerator } from '../../tasks'
import '../../styles/ugy1.css'
const TASK_LABELS = {
  CAESAR: 'Titkosított suttogás',
  VIGENERE: 'Kulcskeringő',
  XOR: 'Villanó bitek',
  HASH_MISMATCH: 'Elcsúszott ujjlenyomat',
  ICON_MEMORY: 'Szimbólum-memória',
  PASSWORD_STRENGTH: 'Admin jelszó audit',
  PHISHING: 'Kurátori csali levél',
  URL_TRUST: 'Kapuhivatkozás vizsgálat',
  LOG_ANALYSIS: 'Éjjeli logvadászat',
  SOCIAL_ENGINEERING: 'Beszivárgó kérés',
  FIREWALL: 'Rendszerkapcsolat-vadász tűzfal',
  MISCONFIG: 'Rejtett konfigurációs hiba',
  RISKY_PERMISSION: 'Veszélyes engedélykérés',
  SECURITY_DECISION: 'Nyomok mérlegelése',
  CRYPTO_PUZZLE: 'Mini kripto rejtély',
  PSEUDOCODE_BUG: 'Pszeudokód csapda',
  NETWORK_ANOMALY: 'Hálózati burjánzás',
  EMAIL_HEADER: 'Fejléc-röntgen',
  ATTACK_SCENARIO: 'Támadási mozaik',
  ZERO_DAY: 'Nulladik nap dilemma'
}

const getTaskTitle = (task, index) => {
  return `${index + 1}. feladat`
}

const EPISODE_NAME = 'Éjszakai rendszerkapcsolat létesítése'

const TASK_STORIES = {
  PASSWORD_STRENGTH: {
    title: 'Admin jelszó audit',
    text: `A rendszer egyik adminfiókja gyanús jelszóváltoztatási kérelmet küldött be.
    A kérelmet pont akkor adták le, amikor az ismeretlen „rendszerkapcsolat létesítése” kapcsolat megjelent.
    Döntened kell, hogy a javasolt jelszó megfelel-e a követelményeknek, vagy a támadó próbál gyenge autentikációt becsempészni.`
  },
  FIREWALL: {
    title: 'Rendszerkapcsolat-vadász tűzfal',
    text: `A tűzfal naplója szerint pár külső cím hirtelen „engedélyezett” állapotba került.
    Ha rosszul zárod le a szabályt, fontos érzékelők némulhatnak el, de ha nyitva hagyod, a támadó tartós hozzáférést kap.`
  },
  PHISHING: {
    title: 'Kurátori csali levél',
    text: `Egy kurátor postaládájában gyanús üzenet jelent meg a belső technikai osztály nevében.
    A logok szerint az éjszakai támadó küldhette, hogy megszerezze a bejelentkezési adatait.
    Csak akkor állíthatod le az akciót, ha felismered a rejtett jeleket.`
  },
  SOCIAL_ENGINEERING: {
    title: 'Beszivárgó kérés',
    text: `Egy személyes hangvételű üzenet szerint a küldő a múzeum technikusa, aki sürgősen segítséget kér.
    Valójában ez lehet a támadó kísérlete, hogy benned találjon új belépési pontot.
    Elemezd a kérést, és dönts, hogy valós-e vagy manipulatív.`
  },
  SECURITY_DECISION: {
    title: 'Nyomok mérlegelése',
    text: `A rendszer jelzi, hogy a támadó létrehozott egy „rendszerkapcsolat-alagutat”.
    Azonnal lekapcsolod, vagy megfigyeled, hogy több információt gyűjts?
    A döntésed hatással lesz arra, mihez fér hozzá a támadó – és te mire jössz rá.`
  }
}

const Ugy2 = () => {
  const [step, setStep] = useState(0) // 0..4
  const [tasks, setTasks] = useState([])
  const [done, setDone] = useState([false, false, false, false, false])
  const { saveLevelCompletion, isAuthenticated } = useAuth()
  const { scoreTask, scoreLevel } = useScoring()
  const [currentLevel, setCurrentLevel] = useState(2)
  const [errors, setErrors] = useState(0)
  const [taskFeedback, setTaskFeedback] = useState('')
  const [levelStartTime] = useState(Date.now())
  const levelStartTimeRef = useRef(Date.now())

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

  const handleCompletion = async () => {
    markDone(tasks.length - 1)
    
    // Pálya pontozása
    const timeSpent = Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
    const result = scoreLevel({
      level: currentLevel,
      totalTasks,
      completedTasks: completedCount + 1,
      errors,
      timeSpent,
      allCluesCorrect: errors === 0
    })
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback)
    
    try {
      if (isAuthenticated) {
        await saveLevelCompletion(`ugy${currentLevel}`)
      }
    } catch (e) {
      console.warn(`Nem sikerült menteni a(z) ${currentLevel}. pályát:`, e)
    }
  }

  const handleTaskSuccess = (taskIndex) => {
    const task = tasks[taskIndex]
    if (task) {
      // Feladat pontozása
      const timeSpent = taskIndex > 0 ? Math.floor((Date.now() - levelStartTimeRef.current) / (taskIndex + 1) / 1000) : null
      const result = scoreTask({
        difficulty: task.difficulty || 'easy',
        isCorrect: true,
        level: currentLevel,
        timeSpent
      })
      
      // Visszajelzés megjelenítése
      setTaskFeedback(result.feedback)
      setTimeout(() => setTaskFeedback(''), 3000)
    }
    
    markDone(taskIndex)
    if (taskIndex < tasks.length - 1) {
      setTimeout(next, 400)
    } else {
      handleCompletion()
    }
  }

  const handleTaskFailure = () => {
    const task = tasks[step]
    if (task) {
      // Hibázás pontozása
      const result = scoreTask({
        difficulty: task.difficulty || 'easy',
        isCorrect: false,
        level: currentLevel
      })
      
      // Visszajelzés megjelenítése
      setTaskFeedback(result.feedback)
      setTimeout(() => setTaskFeedback(''), 3000)
    }
    
    setErrors(prev => prev + 1)
  }

  const currentTask = tasks[step]

  const [isLevel3Unlocked, setIsLevel3Unlocked] = useState(false)

  useEffect(() => {
    const unlockDate = new Date('2025-12-06T19:00:00+01:00')
    const updateUnlock = () => {
      setIsLevel3Unlocked(new Date() >= unlockDate)
    }
    updateUnlock()
    const interval = setInterval(updateUnlock, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>Éjszakai rendszerkapcsolat létesítése – Ügy #{currentLevel}</div>
        </Link>
      </header>
      <ScoreDisplay />
      {taskFeedback && (
        <div
          style={{
            textAlign: 'right',
            fontSize: '13px',
            color: taskFeedback.includes('Helyes') ? '#00e5ff' : 'var(--muted)',
            marginTop: '-6px',
            marginBottom: '12px',
            padding: '8px 12px',
            background: taskFeedback.includes('Helyes') ? 'rgba(0,229,255,0.1)' : 'rgba(207,230,255,0.05)',
            borderRadius: '6px',
            border: `1px solid ${taskFeedback.includes('Helyes') ? 'rgba(0,229,255,0.3)' : 'rgba(207,230,255,0.2)'}`
          }}
        >
          {taskFeedback}
        </div>
      )}

      <main>
        <NarrativeBlock badge="Éjszakai rendszerkapcsolat létesítése">
          <h1 style={{ margin: '10px 0 4px' }}>Éjszakai rendszerkapcsolat létesítése – Ügy #{currentLevel}</h1>
          <p>
            A múzeum csendje most valahogy nyugtalanítóbb, mint előző éjjel. A kamera-rendszer továbbra is akadozik,
            a hálózati térkép pedig ismeretlen kapcsolatokat mutat – olyanokat, amelyeknek nem kellene létezniük.
          </p>
          <p>
            Úgy tűnik, az éjszakai behatoló nem csak a gépeket érintette, hanem lassan próbál behatolni a teljes rendszerbe.
            Ha sikerül neki mélyebbre jutnia, a múzeum rendszereinek titkai pillanatok alatt kiszivároghatnak. Rajtad múlik, hogy visszaverd a támadást.
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
          <TaskCard title={getTaskTitle(currentTask, step)}>
            {currentTask ? (
              <>
                <TaskRenderer
                  task={currentTask}
                  taskStory={TASK_STORIES[currentTask.type]}
                  taskLabel={TASK_LABELS[currentTask.type]}
                  onSuccess={() => handleTaskSuccess(step)}
                  onFailure={handleTaskFailure}
                />
                {completedCount === tasks.length && tasks.length > 0 && currentLevel === 2 && (
                  <div className="grid2" style={{ marginTop: '16px' }}>
                    <div></div>
                    <div className="card" style={{ animation: 'fadeIn .3s ease both' }}>
                      <h3 style={{ marginTop: 0, color: '#00e5ff', fontFamily: 'Rajdhani, Inter, sans-serif', fontSize: '18px', fontWeight: 700 }}>Ügy teljesítve</h3>
                      <p className="muted" style={{ marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                        Gratulálunk! A harmadik ügy <strong>december 6-án, este 7 órakor nyílik</strong>.
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
                        {isLevel3Unlocked ? (
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
                            Tovább a harmadik ügyre →
                          </Link>
                        ) : (
                          <button
                            className="btn"
                            disabled
                            style={{
                              opacity: 0.5,
                              cursor: 'not-allowed',
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center',
                              minWidth: '0',
                              padding: '10px 18px',
                              fontSize: '13px',
                              background: 'rgba(0, 229, 255, 0.2)',
                              border: '1px solid rgba(0, 229, 255, 0.3)',
                              color: 'rgba(0, 229, 255, 0.5)'
                            }}
                          >
                            Tovább a harmadik ügyre →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="muted">Aktív feladat betöltése...</p>
            )}
          </TaskCard>
        )}
      </main>
    </div>
  )
}

export default Ugy2
