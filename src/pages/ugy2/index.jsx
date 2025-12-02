import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  PASSWORD_STRENGTH: 'Gyanús jelszóváltoztatás',
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

const EPISODE_NAME = 'Éjféli kézfogás'

// Képek hozzárendelése a feladattípusokhoz
const TASK_IMAGES = {
  PASSWORD_STRENGTH: '/images/2b.jpg',
  FIREWALL: '/images/2e.jpg',
  PHISHING: '/images/2c.jpg',
  SOCIAL_ENGINEERING: '/images/2a.jpg',
  SECURITY_DECISION: '/images/2d.jpg'
}

const TASK_STORIES = {
  PASSWORD_STRENGTH: {
    title: 'Gyanús jelszóváltoztatás',
    text: `A rendszer egyik adminfiókja szokatlan jelszóváltoztatási kérelmet küldött be.

A kérelem pont akkor érkezett, amikor az ismeretlen „rendszerkapcsolat létesítése" riasztás aktiválódott.

Most rajtad a sor, hogy dönts:

A javasolt jelszó megfelel-e a biztonsági követelményeknek, vagy a támadó próbál gyenge autentikációt becsempészni a rendszerbe.

Válaszd ki a legbiztonságosabb döntést, hogy megakadályozd a támadót a további hozzáférésben.`
  },
  FIREWALL: {
    title: 'Rendszerkapcsolat-vadász tűzfal',
    text: `A tűzfal naplója szerint néhány külső cím váratlanul „engedélyezett” állapotba került.
    Ha rosszul zárod le a szabályt, a múzeum fontos érzékelői némulhatnak el – de ha nyitva hagyod, a támadó tartós hozzáférést szerezhet.

A látogatói webkioszkot ideiglenesen leválasztották a belső hálóról, de továbbra is kiszolgálja a digitális tárlat webes felületét.

Engedélyezd a látogatók által használt webes protokollokat, de tartsd zárva az admin SSH‑csatornát, hogy a kioszkot kívülről ne lehessen módosítani.`
  },
  PHISHING: {
    title: 'Kurátori csali levél',
    text: `Egy kurátor postaládájában gyanús üzenet jelent meg, amely állítólag a belső technikai osztálytól érkezett.

    A logok szerint az éjszakai támadó küldhette, hogy megszerezze a bejelentkezési adatait.

Csak akkor állíthatod le az akciót, ha felismered a rejtett jeleket.

A logfájlok között elrejtett üzenetek várnak a megfejtésre. A rendszer mindig hagy nyomokat – csak meg kell találnod őket.

Egy felhasználó gyanús e-mailt jelentett.

Elemezd az üzenet tartalmát, és azonosítsd a phishing jellemzőket, hogy megakadályozd a támadást.`
  },
  SOCIAL_ENGINEERING: {
    title: 'Beszivárgó kérés',
    text: `Egy sürgős üzenet érkezett – állítólag a múzeum egyik technikusától. A hangvétele személyes, sietős, és segítséget kér.

De valami nem stimmel. A szóhasználat furcsa, a rendszerlogok pedig azt mutatják, hogy a küldő helyéről már korábban is érkeztek gyanús próbálkozások. Lehet, hogy ez csak egy újabb kísérlet arra, hogy rajtad keresztül jusson be a hálózatba.

Vizsgáld meg az üzenetet, elemezd a kérését, és döntsd el:

valódi segítségkérésről van szó, vagy csak egy manipulatív próbálkozás?

Válaszd ki azt a reakciót, amelyik megfelel a biztonsági protokollnak.`
  },
  SECURITY_DECISION: {
    title: 'Nyomok mérlegelése',
    text: `A rendszer riaszt: a támadó létrehozott egy rejtett rendszerkapcsolat‑alagutat.

Most rajtad a sor, hogy dönts:

– Azonnal lekapcsolod, ezzel megakadályozva, hogy tovább haladjon?

– Vagy megfigyeled a műveletet, hogy több információt gyűjts róla – vállalva a kockázatot, hogy közben mélyebbre juthat?

Minden választásod hatással lesz arra, mihez fér hozzá a támadó, és arra is, te mennyit derítesz ki a módszereiről.`
  }
}

const Ugy2 = () => {
  const [step, setStep] = useState(0) // 0..4
  const [tasks, setTasks] = useState([])
  const [done, setDone] = useState([false, false, false, false, false])
  const navigate = useNavigate()
  const { saveLevelCompletion, isAuthenticated, logout } = useAuth()
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
    
    // Pálya pontozása (csak bejelentkezés után)
    let result = { feedback: '' }
    if (isAuthenticated) {
      const timeSpent = Math.floor((Date.now() - levelStartTimeRef.current) / 1000)
      result = scoreLevel({
        level: currentLevel,
        totalTasks,
        completedTasks: completedCount + 1,
        errors,
        timeSpent,
        allCluesCorrect: errors === 0
      })
    }
    
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
      // Feladat pontozása (csak bejelentkezés után)
      let result = { feedback: '' }
      if (isAuthenticated) {
        const timeSpent = taskIndex > 0 ? Math.floor((Date.now() - levelStartTimeRef.current) / (taskIndex + 1) / 1000) : null
        result = scoreTask({
          difficulty: task.difficulty || 'easy',
          isCorrect: true,
          level: currentLevel,
          timeSpent
        })
      }
      
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
      // Hibázás pontozása (csak bejelentkezés után)
      let result = { feedback: '' }
      if (isAuthenticated) {
        result = scoreTask({
          difficulty: task.difficulty || 'easy',
          isCorrect: false,
          level: currentLevel
        })
      }
      
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
          <div>Éjféli kézfogás – Ügy #{currentLevel}</div>
        </Link>
        {isAuthenticated && (
          <button
            onClick={async () => {
              const result = await logout()
              if (result.success) {
                navigate('/')
              }
            }}
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              fontSize: '13px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(207,230,255,0.2)',
              color: 'var(--muted)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Rajdhani, Inter, sans-serif',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)'
              e.target.style.color = '#cfe6ff'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)'
              e.target.style.color = 'var(--muted)'
            }}
          >
            Kijelentkezés
          </button>
        )}
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
        <NarrativeBlock badge="Éjféli kézfogás">
          <h1 style={{ margin: '10px 0 4px' }}>Éjféli kézfogás – Ügy #{currentLevel}</h1>
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
                  imageSrc={TASK_IMAGES[currentTask.type]}
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
                            Tovább az Árnyak Ösvényére →
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
                            Tovább az Árnyak Ösvényére →
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
