import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import ChallengeInput from '../../components/Ugy1/ChallengeInput'
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

// Caesar shift dekódolás
function CaesarShiftDecode(input, shift) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const up = (input || '').toUpperCase();
  let out = '';
  for (let ch of up) {
    const i = A.indexOf(ch);
    if (i < 0) { out += ch; continue; }
    const j = (i - (shift % 26) + 26) % 26;
    out += A[j];
  }
  return out;
}

// Vigenère dekódolás
function vigenereDecode(cipher, key) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const clean = (cipher || '').toUpperCase().replace(/[^A-ZÁÉÍÓÖŐÚÜŰ]/g,'');
  const k = (key || '').toUpperCase().replace(/[^A-Z]/g,'');
  let out = '';
  let ki = 0;
  for (let ch of clean.normalize('NFD').replace(/[\u0300-\u036f]/g,'')) {
    const ci = A.indexOf(ch);
    if (ci < 0) { out += ch; continue; }
    const kk = A.indexOf(k[ki % k.length]);
    const pi = (ci - kk + 26) % 26;
    out += A[pi];
    ki++;
  }
  return out;
}

// Állapot mentés és betöltés localStorage-ból
const STORAGE_KEY = 'ugy4_progress';
const STORAGE_COMPLETED_KEY = 'ugy4_completed';

// saveProgress will be updated inside the component to use useAuth hook

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { step, done } = JSON.parse(saved);
      return { step: step || 0, done: done || [false,false,false,false,false] };
    }
  } catch(e) {
    console.warn('Nem sikerült betölteni az állapotot:', e);
  }
  return { step: 0, done: [false,false,false,false,false] };
}

// Ellenőrzés: az előző pályák teljesítve vannak-e
function checkPreviousCompleted() {
  try {
    // Ellenőrizzük az összes előző pályát
    const checks = [];
    for(let i = 1; i < 4; i++) {
      if(i === 1) {
        checks.push(sessionStorage.getItem('cm_lvl1_entry_ok') === '1' ||
                   localStorage.getItem('ugy1_completed') === 'true');
      } else {
        checks.push(localStorage.getItem(`ugy${i}_completed`) === 'true');
      }
    }
    return checks.every(c => c === true);
  } catch(e) {
    return false;
  }
}

const Ugy4 = () => {
  const [step, setStep] = useState(0); // 0..4
  const [done, setDone] = useState([false,false,false,false,false]);
  const [previousLocked, setPreviousLocked] = useState(true);
  const [searchParams] = useSearchParams()
  const { saveLevelCompletion, isAuthenticated } = useAuth()

  // Betöltés: állapot visszaállítása és előző pályák ellenőrzése
  useEffect(() => {
    const startFromBeginning = searchParams.get('start') === '1';
    
    if (startFromBeginning) {
      setStep(0);
      setDone([false, false, false, false, false]);
    } else {
      const { step: savedStep, done: savedDone } = loadProgress();
      setStep(savedStep);
      setDone(savedDone);
    }
    
    // Ellenőrizzük, hogy az előző pályák teljesítve vannak-e
    const previousCompleted = checkPreviousCompleted();
    setPreviousLocked(!previousCompleted);
  }, []);

  // Prefetch következő feladat képe
  useEffect(()=>{
    const STEP_IMAGES = ['/images/4a.jpg','/images/4b.jpg','/images/4c.jpg','/images/4d.jpg','/images/4e.jpg'];
    const next = step + 1;
    if(next >= STEP_IMAGES.length) return;
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = STEP_IMAGES[next];
  }, [step]);

  // Mentés minden változásnál
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, done }));
      if (isAuthenticated) {
        saveLevelCompletion('ugy4').catch(console.warn)
      }
    } catch(e) {
      console.warn('Nem sikerült menteni az állapotot:', e);
    }
  }, [step, done, isAuthenticated, saveLevelCompletion]);

  const next = () => setStep(s => Math.min(s+1, 4));
  const markDone = (i) => setDone(d => {
    const nd = d.slice(); nd[i] = true; return nd;
  });

  const progressPct = useMemo(() => ((done.filter(Boolean).length)/5)*100, [done]);

  // Ha az előző pályák nincsenek teljesítve, zárolt üzenet
  if (previousLocked) {
    return (
      <div className="container">
        <header>
          <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
            <div className="brand-badge">CM</div>
            <div>A Hiányzó Idővonal – Ügy #4</div>
          </Link>
        </header>
        <main>
          <div className="card" style={{textAlign:'center', padding:'40px 20px'}}>
            <h2 style={{margin:'0 0 16px'}}>🔒 Pálya zárolva</h2>
            <p className="muted" style={{margin:'0 0 20px', fontSize:'16px', lineHeight:'1.7'}}>
              A 4. pálya csak az első két pálya teljesítése után érhető el.
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

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>A Hiányzó Idővonal – Ügy #4</div>
        </Link>
      </header>

      <main>
        <NarrativeBlock badge="hiányzó idővonal">
          <h1 style={{margin:'10px 0 4px'}}>A Hiányzó Idővonal – Ügy #4</h1>
          <p>Az előző pályák nyomai egy újabb rejtélyhez vezettek.</p>
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{width: progressPct + '%'}} /></div>
          <div className="step">{done.filter(Boolean).length} / 5</div>
        </div>

        {/* Feladat 1: Alap feladat */}
        {step === 0 && (
          <TaskCard title="1. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Első feladat</h3>
                <p className="muted">
                  Ez az első feladat a 4. pályán. 
                  Az előző pályák megoldásait kombinálva kell továbblépned.
                </p>
                <div className="statusline">
                  A feladat részletei hamarosan...
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="megoldás…"
                  onCheck={(val, norm)=>{
                    // Ideiglenes megoldás - később ki kell egészíteni
                    const ok = false;
                    if (ok) { markDone(0); setTimeout(next, 400); }
                    return ok;
                  }}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/4a.jpg" alt="Illusztráció 4a" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      A feladat részletei hamarosan...
                    </p>
                  </details>
                </div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { markDone(0); setTimeout(next, 200); }}
                    style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                    title="Fejlesztői mód: feladat megoldása és következő"
                  >
                    ✅ Megoldás + Következő
                  </button>
                </div>
              </div>
            </div>
          </TaskCard>
        )}

        {/* További feladatok - ideiglenesen üresek */}
        {step === 1 && (
          <TaskCard title="2. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Második feladat</h3>
                <p className="muted">A feladat részletei hamarosan...</p>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput placeholder="megoldás…" onCheck={() => false} />
                <div className="task-note"><PerfImg className="task-ill" src="/images/4b.jpg" alt="Illusztráció 4b" width="280" height="280" priority /></div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { markDone(1); setTimeout(next, 200); }}
                    style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                    title="Fejlesztői mód: feladat megoldása és következő"
                  >
                    ✅ Megoldás + Következő
                  </button>
                </div>
              </div>
            </div>
          </TaskCard>
        )}

        {step === 2 && (
          <TaskCard title="3. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Harmadik feladat</h3>
                <p className="muted">A feladat részletei hamarosan...</p>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput placeholder="megoldás…" onCheck={() => false} />
                <div className="task-note"><PerfImg className="task-ill" src="/images/4c.jpg" alt="Illusztráció 4c" width="280" height="280" priority /></div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { markDone(2); setTimeout(next, 200); }}
                    style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                    title="Fejlesztői mód: feladat megoldása és következő"
                  >
                    ✅ Megoldás + Következő
                  </button>
                </div>
              </div>
            </div>
          </TaskCard>
        )}

        {step === 3 && (
          <TaskCard title="4. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Negyedik feladat</h3>
                <p className="muted">A feladat részletei hamarosan...</p>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput placeholder="megoldás…" onCheck={() => false} />
                <div className="task-note"><PerfImg className="task-ill" src="/images/4d.jpg" alt="Illusztráció 4d" width="280" height="280" priority /></div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { markDone(3); setTimeout(next, 200); }}
                    style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                    title="Fejlesztői mód: feladat megoldása és következő"
                  >
                    ✅ Megoldás + Következő
                  </button>
                </div>
              </div>
            </div>
          </TaskCard>
        )}

        {step === 4 && (
          <TaskCard title="5. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Ötödik feladat</h3>
                <p className="muted">A feladat részletei hamarosan...</p>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput placeholder="megoldás…" onCheck={() => false} />
                <div className="task-note"><PerfImg className="task-ill" src="/images/4e.jpg" alt="Illusztráció 4e" width="280" height="280" priority /></div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { 
                      markDone(4); 
                      try {
                        localStorage.setItem('ugy4_completed', 'true');
                        if (isAuthenticated) {
                          saveLevelCompletion('ugy4').catch(console.warn)
                        }
                      } catch(e) {
                        console.warn('Nem sikerült menteni a teljesítést:', e);
                      }
                    }}
                    style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
                    title="Fejlesztői mód: feladat megoldása"
                  >
                    ✅ Megoldás
                  </button>
                </div>
                {done[4] && (
                  <div className="card" style={{marginTop:'10px', animation:'fadeIn .3s ease both'}}>
                    <div style={{display:'flex', gap:'10px', marginTop:'8px', flexWrap:'wrap'}}>
                      <Link className="btn" to="/aurora">Vissza az ügyekhez</Link>
                      <Link className="btn-ghost" to="/ugy3" style={{textDecoration:'none'}}>Előző ügy</Link>
                      <Link className="btn-ghost" to="/ugy5?start=1" style={{textDecoration:'none'}}>Következő ügy</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TaskCard>
        )}
      </main>
    </div>
  );
};

export default Ugy4

