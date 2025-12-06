import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useScoring } from '../../contexts/ScoringContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import ScoreDisplay from '../../components/Scoring/ScoreDisplay'
import { LevelGenerator } from '../../tasks'
import '../../styles/ugy1.css'

// Kis teljesítmény-optimalizáció: késleltetett képbetöltés IntersectionObserverrel
const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
function PerfImg({ src, alt, className, width, height, priority }){
  const ref = useRef(null);
  useEffect(()=>{
    const img = ref.current;
    if(!img) return;
    let loaded = false;
    function loadReal(){
      if(loaded) return;
      loaded = true;
      const real = img.getAttribute('data-src');
      if(real){ img.src = real; }
    }
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting) { loadReal(); io.disconnect(); } });
      }, { rootMargin: '200px 0px' });
      io.observe(img);
      return () => { try { io.disconnect(); } catch(_){} };
    } else {
      loadReal();
    }
  }, []);
  return (
    <img
      ref={ref}
      className={className}
      src={PLACEHOLDER}
      data-src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      fetchPriority={priority ? 'high' : 'low'}
      width={width}
      height={height}
      style={{ backgroundColor:'#0f1621' }}
    />
  );
}

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

const EPISODE_NAME = 'A kézbesítetlen üzenet'

// Képek hozzárendelése a feladattípusokhoz
const TASK_IMAGES = {
  ICON_MEMORY: '/images/3a.jpg',
  NETWORK_ANOMALY: '/images/3b.jpg',
  EMAIL_HEADER: '/images/3c.jpg',
  URL_TRUST: '/images/3d.jpg',
  RISKY_PERMISSION: '/images/3e.jpg'
}

const TASK_STORIES = {
  ICON_MEMORY: {
    title: 'Szimbólum-memória',
    text: `A rendszer naplóiban gyanús ikonok és szimbólumok jelentek meg.
    
A támadó ezeket a jeleket használhatta, hogy kommunikáljon vagy információt hagyjon a rendszerben.
    
Emlékezz vissza a korábban látott ikonokra, és azonosítsd a veszélyes szimbólumokat.`
  },
  NETWORK_ANOMALY: {
    title: 'Hálózati burjánzás',
    text: `A hálózati forgalom elemzése során gyanús kapcsolatokat találtál.
    
A rendszer naplói szerint ismeretlen források próbálnak kapcsolatot létesíteni a belső hálózattal.
    
Elemezd a hálózati forgalmat, és azonosítsd az anomáliákat, hogy megakadályozd a támadást.`
  },
  EMAIL_HEADER: {
    title: 'Fejléc-röntgen',
    text: `Egy gyanús e-mail érkezett a rendszerbe, amely állítólag egy megbízható forrástól származik.
    
A támadó ezt az e-mailt használhatta, hogy megtévesztse a rendszert és hozzáférést szerezzen.
    
Elemezd az e-mail fejlécét, és azonosítsd a gyanús jeleket, hogy megakadályozd a támadást.`
  },
  URL_TRUST: {
    title: 'Kapuhivatkozás vizsgálat',
    text: `A rendszer egy gyanús URL-t észlelt, amely állítólag egy megbízható oldalra mutat.
    
A támadó ezt az URL-t használhatta, hogy megtévesztse a felhasználókat és adatokat lopjon.
    
Elemezd az URL-t, és döntsd el, hogy megbízható-e vagy sem.`
  },
  RISKY_PERMISSION: {
    title: 'Veszélyes engedélykérés',
    text: `Egy alkalmazás szokatlan engedélyeket kér a rendszertől.
    
A naplók szerint a támadó ezt az alkalmazást használhatta, hogy hozzáférést szerezzen a rendszerhez.
    
Elemezd az engedélykéréseket, és döntsd el, hogy melyek a veszélyesek.`
  }
}

// Ellenőrzés: az első két pálya teljesítve van-e
function checkPreviousCompleted() {
  try {
    const ugy1Done = sessionStorage.getItem('cm_lvl1_entry_ok') === '1' ||
                     localStorage.getItem('ugy1_completed') === 'true';
    const ugy2Done = localStorage.getItem('ugy2_completed') === 'true';
    return ugy1Done && ugy2Done;
  } catch(e) {
    return false;
  }
}

const Ugy3 = () => {
  const [step, setStep] = useState(0) // 0..4
  const [tasks, setTasks] = useState([])
  const [done, setDone] = useState([false, false, false, false, false])
  const [previousLocked, setPreviousLocked] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { saveLevelCompletion, isAuthenticated, logout } = useAuth()
  const { scoreTask, scoreLevel } = useScoring()
  const [currentLevel, setCurrentLevel] = useState(3)
  const [errors, setErrors] = useState(0)
  const [taskFeedback, setTaskFeedback] = useState('')
  const levelStartTimeRef = useRef(Date.now())

  // Prefetch következő feladat képe
  useEffect(() => {
    const STEP_IMAGES = ['/images/3a.jpg', '/images/3b.jpg', '/images/3c.jpg', '/images/3d.jpg', '/images/3e.jpg']
    const next = step + 1
    if (next >= STEP_IMAGES.length) return
    const img = new Image()
    img.decoding = 'async'
    img.loading = 'eager'
    img.src = STEP_IMAGES[next]
  }, [step])

  // Feladatok generálása az oldal betöltésekor
  useEffect(() => {
    // Ellenőrizzük, hogy az előző pályák teljesítve vannak-e
    const previousCompleted = checkPreviousCompleted()
    setPreviousLocked(!previousCompleted)

    // QA debug mód: seed és forced types ellenőrzése
    const qaSeed = sessionStorage.getItem('qa_seed')
    const qaLevel = sessionStorage.getItem('qa_level')
    const qaForcedTypes = sessionStorage.getItem('qa_forced_types')
    
    const level = qaLevel ? parseInt(qaLevel, 10) : 3
    const seed = qaSeed ? parseInt(qaSeed, 10) : null
    const forcedTypes = qaForcedTypes ? JSON.parse(qaForcedTypes) : null
    
    setCurrentLevel(level)
    
    // QA mód cleanup
    if (qaSeed) {
      sessionStorage.removeItem('qa_seed')
      sessionStorage.removeItem('qa_level')
      sessionStorage.removeItem('qa_forced_types')
    }
    
    // Fix típusok: ICON_MEMORY, NETWORK_ANOMALY, EMAIL_HEADER, URL_TRUST, RISKY_PERMISSION
    const ugy3Types = forcedTypes || [
      'ICON_MEMORY',
      'NETWORK_ANOMALY',
      'EMAIL_HEADER',
      'URL_TRUST',
      'RISKY_PERMISSION'
    ]
    
    const generatedTasks = LevelGenerator.generateLevel(level, 5, new Map(), 4, {
      seed,
      forcedTypes: ugy3Types,
      forcedDifficulty: 'easy'
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
      localStorage.setItem('ugy3_completed', 'true')
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

  // Ha az előző pályák nincsenek teljesítve, zárolt üzenet
  if (previousLocked) {
    return (
      <div className="container">
        <header>
          <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
            <div className="brand-badge">CM</div>
            <div>A kézbesítetlen üzenet – Ügy #3</div>
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
        <main>
          <div className="card" style={{textAlign:'center', padding:'40px 20px'}}>
            <h2 style={{margin:'0 0 16px'}}>🔒 Pálya zárolva</h2>
            <p className="muted" style={{margin:'0 0 20px', fontSize:'16px', lineHeight:'1.7'}}>
              A harmadik pálya csak az első két pálya teljesítése után érhető el.
              <br />
              Visszatérhetsz az előző pályákra, hogy befejezd a feladatokat.
            </p>
            <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
              <Link className="btn" to="/ugy1">Első pálya</Link>
              <Link className="btn" to="/ugy2">Második pálya</Link>
              <Link className="btn-ghost" to="/aurora">Ügyek áttekintése</Link>
            </div>
            {/* Fejlesztői gomb - zárolás feloldása */}
            <div style={{marginTop:'24px', paddingTop:'24px', borderTop:'1px solid rgba(207,230,255,0.1)'}}>
              <button 
                className="btn-ghost" 
                onClick={() => setPreviousLocked(false)}
                style={{
                  fontSize:'13px',
                  padding:'8px 16px',
                  opacity:0.7,
                  cursor:'pointer'
                }}
                title="Fejlesztői mód: zárolás feloldása"
              >
                🔓 Fejlesztői mód: zárolás feloldása
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>A kézbesítetlen üzenet – Ügy #3</div>
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
        <NarrativeBlock badge="Üzenet – kézbesítetlen nyomok">
          <h1 style={{ margin: '10px 0 4px' }}>A kézbesítetlen üzenet – Ügy #3</h1>
          <p>
            Az előző pályák nyomai egy újabb rejtélyhez vezettek. Egy üzenet soha nem érkezett meg a címzettjéhez, 
          és a nyomok azt sugallják, hogy valaki megszakította a kommunikációt. 
            Az előző két pálya megoldásai kulcsfontosságúak lesznek a folytatáshoz.
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
          <>
            {step === 0 && tasks[0] && (
              <TaskCard title="1. feladat">
                <TaskRenderer
                  task={tasks[0]}
                  taskStory={TASK_STORIES[tasks[0].type]}
                  taskLabel={TASK_LABELS[tasks[0].type]}
                  imageSrc={TASK_IMAGES[tasks[0].type]}
                  onSuccess={() => handleTaskSuccess(0)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 1 && tasks[1] && (
              <TaskCard title="2. feladat">
                <TaskRenderer
                  task={tasks[1]}
                  taskStory={TASK_STORIES[tasks[1].type]}
                  taskLabel={TASK_LABELS[tasks[1].type]}
                  imageSrc={TASK_IMAGES[tasks[1].type]}
                  onSuccess={() => handleTaskSuccess(1)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 2 && tasks[2] && (
              <TaskCard title="3. feladat">
                <TaskRenderer
                  task={tasks[2]}
                  taskStory={TASK_STORIES[tasks[2].type]}
                  taskLabel={TASK_LABELS[tasks[2].type]}
                  imageSrc={TASK_IMAGES[tasks[2].type]}
                  onSuccess={() => handleTaskSuccess(2)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 3 && tasks[3] && (
              <TaskCard title="4. feladat">
                <TaskRenderer
                  task={tasks[3]}
                  taskStory={TASK_STORIES[tasks[3].type]}
                  taskLabel={TASK_LABELS[tasks[3].type]}
                  imageSrc={TASK_IMAGES[tasks[3].type]}
                  onSuccess={() => handleTaskSuccess(3)}
                  onFailure={handleTaskFailure}
                />
              </TaskCard>
            )}

            {step === 4 && tasks[4] && (
              <TaskCard title="5. feladat">
                <TaskRenderer
                  task={tasks[4]}
                  taskStory={TASK_STORIES[tasks[4].type]}
                  taskLabel={TASK_LABELS[tasks[4].type]}
                  imageSrc={TASK_IMAGES[tasks[4].type]}
                  onSuccess={() => handleTaskSuccess(4)}
                  onFailure={handleTaskFailure}
                />
                {completedCount === tasks.length && tasks.length > 0 && (
                  <div className="grid2" style={{ marginTop: '16px' }}>
                    <div></div>
                    <div className="card" style={{ animation: 'fadeIn .3s ease both' }}>
                      <h3 style={{ marginTop: 0, color: '#00e5ff', fontFamily: 'Rajdhani, Inter, sans-serif', fontSize: '18px', fontWeight: 700 }}>Ügy teljesítve</h3>
                      <p className="muted" style={{ marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                        Gratulálunk! Sikeresen megoldottad a harmadik ügyet.
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
                        <Link
                          className="btn"
                          to="/ugy4?start=1"
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
                          Következő ügy →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </TaskCard>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Ugy3
