import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useScoring } from '../contexts/ScoringContext'
import NarrativeBlock from '../components/Ugy1/NarrativeBlock'
import TaskCard from '../components/Ugy1/TaskCard'
import ChallengeInput from '../components/Ugy1/ChallengeInput'
import TaskRenderer from '../components/TaskRenderer/TaskRenderer'
import ScoreDisplay from '../components/Scoring/ScoreDisplay'
import { WordSearchMount, MatchTable, ArchiveModal } from '../components/Ugy1/SpecialComponents'
import { ugyConfigs } from './ugyConfigs.jsx'
import { LevelGenerator } from '../tasks'
import '../styles/ugy1.css'

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

// Ellenőrzés: az előző pályák teljesítve vannak-e (Firebase-ből)
async function checkPreviousCompleted(level, checkLevelCompleted) {
  if (level <= 1) return true;
  try {
    if (!checkLevelCompleted) return false;
    
    const ugy1Done = await checkLevelCompleted('ugy1');
    if (level === 2) return ugy1Done;
    if (level === 3) {
      const ugy2Done = await checkLevelCompleted('ugy2');
      return ugy1Done && ugy2Done;
    }
    return true;
  } catch(e) {
    console.warn('checkPreviousCompleted error:', e);
    return false;
  }
}

// Állapot betöltése localStorage-ból
function loadProgress(storageKey) {
  if (!storageKey) return { step: 0, done: [false, false, false, false, false] };
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const { step, done } = JSON.parse(saved);
      return { step: step || 0, done: done || [false, false, false, false, false] };
    }
  } catch(e) {
    console.warn('Nem sikerült betölteni az állapotot:', e);
  }
  return { step: 0, done: [false, false, false, false, false] };
}

const UgyView = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveLevelCompletion, checkLevelCompleted, isAuthenticated, logout } = useAuth();
  const { scoreTask, scoreLevel } = useScoring();
  
  // Kiolvassuk az ügy számát a pathname-ből (/ugy1 -> 1, /ugy2 -> 2, stb.)
  const match = location.pathname.match(/\/ugy(\d+)/);
  const levelNum = match ? parseInt(match[1], 10) : null;
  const config = levelNum ? ugyConfigs[levelNum] : null;
  
  if (!config) {
    return (
      <div className="container">
        <main>
          <div className="card">
            <p className="muted">Ismeretlen ügy: {ugyNumber}</p>
          </div>
        </main>
      </div>
    );
  }

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(Array(config.totalTasks).fill(false));
  const [showArchive, setShowArchive] = useState(false);
  const [errors, setErrors] = useState(0);
  const [taskFeedback, setTaskFeedback] = useState('');
  const levelStartTimeRef = useRef(Date.now());
  
  // Dinamikus feladatok (ugy2)
  const [tasks, setTasks] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(config.level);
  
  // Ugy3 zárolás
  const [previousLocked, setPreviousLocked] = useState(false);
  
  // Ugy2 unlock dátum
  const [isLevel3Unlocked, setIsLevel3Unlocked] = useState(false);

  // Betöltés: állapot visszaállítása és előző pályák ellenőrzése
  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      // Ugy3 zárolás ellenőrzése (Firebase-ből)
      if (config.requiresPrevious && checkLevelCompleted) {
        const previousCompleted = await checkPreviousCompleted(config.level, checkLevelCompleted);
        if (cancelled) return;
        setPreviousLocked(!previousCompleted);
        if (!previousCompleted) return; // Ha zárolva van, ne töltse be a többi adatot
      }
      
      // Ha van ?start=1 paraméter az URL-ben, kezdjük az első feladatnál
      const startFromBeginning = searchParams.get('start') === '1';
      
      if (startFromBeginning) {
        setStep(0);
        setDone(Array(config.totalTasks).fill(false));
      } else if (config.storageKey) {
        const { step: savedStep, done: savedDone } = loadProgress(config.storageKey);
        setStep(savedStep);
        setDone(savedDone);
      }
      
      // Dinamikus feladatok generálása (ugy2)
      if (config.isDynamic) {
        const qaSeed = sessionStorage.getItem('qa_seed');
        const qaLevel = sessionStorage.getItem('qa_level');
        const qaForcedTypes = sessionStorage.getItem('qa_forced_types');
        
        const level = qaLevel ? parseInt(qaLevel, 10) : config.level;
        const seed = qaSeed ? parseInt(qaSeed, 10) : null;
        const forcedTypes = qaForcedTypes ? JSON.parse(qaForcedTypes) : null;
        
        setCurrentLevel(level);
        
        // QA mód cleanup
        if (qaSeed) {
          sessionStorage.removeItem('qa_seed');
          sessionStorage.removeItem('qa_level');
          sessionStorage.removeItem('qa_forced_types');
        }
        
        const generatedTasks = LevelGenerator.generateLevel(level, config.totalTasks, new Map(), 4, {
          seed,
          forcedTypes: forcedTypes || config.forcedTypes,
          forcedDifficulty: config.forcedDifficulty
        });
        
        // Minden feladat payload-jának generálása
        generatedTasks.forEach(task => {
          if (!task.payload) {
            task.generate();
          }
        });
        setTasks(generatedTasks);
        setDone(Array(generatedTasks.length).fill(false));
      }
      
      // Ugy2 unlock dátum ellenőrzése
      if (config.unlockDate) {
        const unlockDate = new Date(config.unlockDate);
        const updateUnlock = () => {
          setIsLevel3Unlocked(new Date() >= unlockDate);
        };
        updateUnlock();
        const interval = setInterval(updateUnlock, 60000);
        return () => clearInterval(interval);
      }
    };
    
    loadData();
    
    return () => {
      cancelled = true;
    };
  }, [config, searchParams, checkLevelCompleted]);

  // Prefetch következő feladat képe
  useEffect(()=>{
    if (!config.images || step + 1 >= config.images.length) return;
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = config.images[step + 1];
  }, [step, config.images]);

  // Mentés minden változásnál (ugy3)
  useEffect(() => {
    if (config.storageKey) {
      try {
        localStorage.setItem(config.storageKey, JSON.stringify({ step, done }));
        if (isAuthenticated) {
          saveLevelCompletion(`ugy${levelNum}`).catch(console.warn);
        }
      } catch(e) {
        console.warn('Nem sikerült menteni az állapotot:', e);
      }
    }
  }, [step, done, isAuthenticated, saveLevelCompletion, config.storageKey, levelNum]);

  const next = () => setStep(s => Math.min(s + 1, config.totalTasks - 1));
  const markDone = (i) => setDone(d => {
    const nd = d.slice();
    nd[i] = true;
    return nd;
  });

  const progressPct = useMemo(() => {
    const completedCount = done.filter(Boolean).length;
    return (completedCount / config.totalTasks) * 100;
  }, [done, config.totalTasks]);

  const completedCount = useMemo(() => done.filter(Boolean).length, [done]);

  const handleCompletion = async () => {
    markDone(config.totalTasks - 1);
    
    // Pálya pontozása (csak bejelentkezés után)
    let result = { feedback: '' };
    if (isAuthenticated) {
      const timeSpent = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
      const totalTasks = config.isDynamic ? tasks.length : config.totalTasks;
      result = scoreLevel({
        level: currentLevel,
        totalTasks,
        completedTasks: completedCount + 1,
        errors,
        timeSpent,
        allCluesCorrect: errors === 0
      });
    }
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    
    try {
      // Mindig mentjük Firebase-be, ha be vagyunk jelentkezve
      if (isAuthenticated) {
        await saveLevelCompletion(`ugy${levelNum}`);
      }
    } catch(e) {
      console.warn(`Nem sikerült menteni a(z) ${levelNum}. pályát:`, e);
    }
  };

  const handleTaskSuccess = (taskIndex, difficulty = 'easy') => {
    // Feladat pontozása (csak bejelentkezés után)
    let result = { feedback: '' };
    if (isAuthenticated) {
      const task = config.isDynamic ? tasks[taskIndex] : null;
      const timeSpent = taskIndex > 0 ? Math.floor((Date.now() - levelStartTimeRef.current) / (taskIndex + 1) / 1000) : null;
      result = scoreTask({
        difficulty: task?.difficulty || difficulty,
        isCorrect: true,
        level: currentLevel,
        timeSpent
      });
    }
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    setTimeout(() => setTaskFeedback(''), 3000);
    
    markDone(taskIndex);
    if (taskIndex < config.totalTasks - 1) {
      setTimeout(next, 400);
    } else {
      handleCompletion();
    }
  };

  const handleTaskFailure = (difficulty = 'easy') => {
    // Hibázás pontozása (csak bejelentkezés után)
    let result = { feedback: '' };
    if (isAuthenticated) {
      const task = config.isDynamic ? tasks[step] : null;
      result = scoreTask({
        difficulty: task?.difficulty || difficulty,
        isCorrect: false,
        level: currentLevel
      });
    }
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    setTimeout(() => setTaskFeedback(''), 3000);
    
    setErrors(prev => prev + 1);
  };

  // Ha az előző pályák nincsenek teljesítve, zárolt üzenet (ugy3)
  if (config.requiresPrevious && previousLocked) {
    return (
      <div className="container">
        <header>
          <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
            <div className="brand-badge">CM</div>
            <div>{config.headerTitle}</div>
          </Link>
        </header>
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
    );
  }

  const currentTask = config.isDynamic ? tasks[step] : null;
  const currentStaticTask = config.isDynamic ? null : config.tasks?.[step];

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>{config.headerTitle}</div>
        </Link>
        {isAuthenticated && (
          <button
            onClick={async () => {
              const result = await logout();
              if (result.success) {
                navigate('/');
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
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = '#cfe6ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)';
              e.target.style.color = 'var(--muted)';
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
            textAlign:'right',
            fontSize:'13px',
            color: taskFeedback.includes('Helyes') ? '#00e5ff' : 'var(--muted)',
            marginTop:'-6px',
            marginBottom:'12px',
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
        <NarrativeBlock badge={config.badge}>
          <h1 style={{margin:'10px 0 4px'}}>{config.narrativeTitle}</h1>
          {typeof config.narrativeText === 'string' ? (
            <p>{config.narrativeText}</p>
          ) : (
            config.narrativeText
          )}
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{width: progressPct + '%'}} /></div>
          <div className="step">{completedCount} / {config.totalTasks}</div>
        </div>

        {/* Dinamikus feladatok (ugy2) */}
        {config.isDynamic && (
          <>
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
                      taskStory={config.taskStories?.[currentTask.type]}
                      taskLabel={config.taskLabels?.[currentTask.type]}
                      imageSrc={config.taskImages?.[currentTask.type]}
                      onSuccess={() => handleTaskSuccess(step)}
                      onFailure={handleTaskFailure}
                    />
                    {completedCount === tasks.length && tasks.length > 0 && (levelNum === 2 || levelNum === 3) && (
                      <div className="grid2" style={{ marginTop: '16px' }}>
                        <div></div>
                        <div className="card" style={{ animation: 'fadeIn .3s ease both' }}>
                          <h3 style={{ marginTop: 0, color: '#00e5ff', fontFamily: 'Rajdhani, Inter, sans-serif', fontSize: '18px', fontWeight: 700 }}>Ügy teljesítve</h3>
                          <p className="muted" style={{ marginBottom: '16px', lineHeight: '1.6', fontSize: '14px' }}>
                            {levelNum === 2 
                              ? <>Gratulálunk! A harmadik ügy <strong>december 6-án, este 7 órakor nyílik</strong>.</>
                              : 'Gratulálunk! Sikeresen megoldottad a harmadik ügyet.'}
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
                            {levelNum === 2 && isLevel3Unlocked ? (
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
                                {config.nextLevelText} →
                              </Link>
                            ) : levelNum === 2 ? (
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
                                {config.nextLevelText} →
                              </button>
                            ) : levelNum === 3 && config.nextLevelRoute ? (
                              <Link
                                className="btn"
                                to={config.nextLevelRoute}
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
                                {config.nextLevelText} →
                              </Link>
                            ) : null}
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
          </>
        )}

        {/* Statikus feladatok (ugy1, ugy3) */}
        {!config.isDynamic && currentStaticTask && (
          <TaskCard title={currentStaticTask.title}>
            <div className="grid2">
              <div className="card">
                <h3>{currentStaticTask.leftTitle}</h3>
                {currentStaticTask.leftContent}
              </div>
              <div className="card">
                <h3>{currentStaticTask.rightTitle}</h3>
                {currentStaticTask.needsMatchTable ? (
                  <>
                    <MatchTable 
                      onDone={handleCompletion} 
                      onFailure={() => handleTaskFailure(currentStaticTask.difficulty)} 
                    />
                    {config.specialComponents?.archive && (
                      <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                        <button className="btn-ghost" type="button" onClick={()=>setShowArchive(true)}>
                          🔍 Nyomok újramegtekintése
                        </button>
                      </div>
                    )}
                    <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                      <button 
                        className="btn-ghost" 
                        onClick={handleCompletion}
                        style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                        title="Fejlesztői mód: feladat megoldása"
                      >
                        ✅ Megoldás
                      </button>
                    </div>
                    {done[step] && (
                      <div className="card" style={{marginTop:'10px', animation:'fadeIn .3s ease both'}}>
                        <div style={{display:'flex', gap:'10px', marginTop:'8px', flexWrap:'wrap'}}>
                          <Link
                            to="/aurora"
                            style={{
                              fontSize:'12px',
                              color:'var(--muted)',
                              textDecoration:'underline',
                              textUnderlineOffset:'4px',
                              padding:'4px 0'
                            }}
                          >
                            Vissza az ügyekhez
                          </Link>
                          {config.nextLevelRoute && (
                            <Link
                              className="btn"
                              to={config.nextLevelRoute}
                              style={{
                                textDecoration:'none',
                                display:'inline-flex',
                                justifyContent:'center',
                                alignItems:'center',
                                textAlign:'center',
                                minWidth:'0',
                                padding:'10px 18px',
                                fontSize:'13px'
                              }}
                            >
                              {config.nextLevelText}
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <ChallengeInput
                      placeholder={currentStaticTask.placeholder || "válasz…"}
                      onCheck={(val, norm) => {
                        const ok = currentStaticTask.expectedAnswer(val, norm);
                        if (ok) { 
                          handleTaskSuccess(step, currentStaticTask.difficulty); 
                        }
                        return ok;
                      }}
                      okText={currentStaticTask.okText || "Helyes! Tovább…"}
                      errText={currentStaticTask.errText || "Nem egészen – próbáld újra."}
                      onFailure={() => handleTaskFailure(currentStaticTask.difficulty)}
                    />
                    {config.images && config.images[step] && (
                      <div className="task-note">
                        <PerfImg 
                          className="task-ill" 
                          src={config.images[step]} 
                          alt={`Illusztráció ${step + 1}`} 
                          width="280" 
                          height="280" 
                          priority 
                        />
                      </div>
                    )}
                    {currentStaticTask.hint && (
                      <div className="hint">
                        <details>
                          <summary>Súgó megnyitása</summary>
                          {currentStaticTask.hint}
                        </details>
                      </div>
                    )}
                    {currentStaticTask.needsWordSearch && config.specialComponents?.wordSearch && (
                      <WordSearchMount />
                    )}
                    {step === config.totalTasks - 1 && done[step] && (
                      <div className="card" style={{marginTop:'10px', animation:'fadeIn .3s ease both'}}>
                        <div style={{display:'flex', gap:'10px', marginTop:'8px', flexWrap:'wrap'}}>
                          <Link
                            to="/aurora"
                            style={{
                              fontSize:'12px',
                              color:'var(--muted)',
                              textDecoration:'underline',
                              textUnderlineOffset:'4px',
                              padding:'4px 0'
                            }}
                          >
                            Vissza az ügyekhez
                          </Link>
                          {config.nextLevelRoute && (
                            <Link
                              className="btn"
                              to={config.nextLevelRoute}
                              style={{
                                textDecoration:'none',
                                display:'inline-flex',
                                justifyContent:'center',
                                alignItems:'center',
                                textAlign:'center',
                                minWidth:'0',
                                padding:'10px 18px',
                                fontSize:'13px'
                              }}
                            >
                              {config.nextLevelText}
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </TaskCard>
        )}
      </main>
      {showArchive && config.specialComponents?.archive && (
        <ArchiveModal onClose={()=>setShowArchive(false)} />
      )}
    </div>
  );
};

export default UgyView;

