import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useScoring } from '../../contexts/ScoringContext'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import ChallengeInput from '../../components/Ugy1/ChallengeInput'
import ScoreDisplay from '../../components/Scoring/ScoreDisplay'
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

const Ugy1 = () => {
  const [step, setStep] = useState(0); // 0..4
  const [done, setDone] = useState([false,false,false,false,false]);
  const [showArchive, setShowArchive] = useState(false);
  const { saveLevelCompletion, isAuthenticated, logout } = useAuth();
  const { scoreTask, scoreLevel } = useScoring();
  const [errors, setErrors] = useState(0);
  const [taskFeedback, setTaskFeedback] = useState('');
  const levelStartTimeRef = useRef(Date.now());
  
  // Prefetch következő feladat képe a gyorsabb élményért
  useEffect(()=>{
    const STEP_IMAGES = ['/images/1a.jpg','/images/1b.jpg','/images/1c.jpg','/images/1d.jpg','/images/1e.jpg'];
    const next = step + 1;
    if(next >= STEP_IMAGES.length) return;
    const img = new Image();
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = STEP_IMAGES[next];
  }, [step]);

  const next = () => setStep(s => Math.min(s+1, 4));
  const markDone = (i) => setDone(d => {
    const nd = d.slice(); nd[i] = true; return nd;
  });

  const progressPct = useMemo(() => ((done.filter(Boolean).length)/5)*100, [done]);

  const handleCompletion = async () => {
    markDone(4);
    
    // Pálya pontozása
    const timeSpent = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
    const result = scoreLevel({
      level: 1,
      totalTasks: 5,
      completedTasks: 5,
      errors,
      timeSpent,
      allCluesCorrect: errors === 0
    });
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    
    try {
      if (isAuthenticated) {
        await saveLevelCompletion('ugy1');
      }
    } catch(e) {
      console.warn('Nem sikerült menteni a teljesítést:', e);
    }
  };
  
  const handleTaskSuccess = (taskIndex, difficulty = 'easy') => {
    // Feladat pontozása
    const timeSpent = taskIndex > 0 ? Math.floor((Date.now() - levelStartTimeRef.current) / (taskIndex + 1) / 1000) : null;
    const result = scoreTask({
      difficulty,
      isCorrect: true,
      level: 1,
      timeSpent
    });
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    setTimeout(() => setTaskFeedback(''), 3000);
    
    markDone(taskIndex);
    if (taskIndex < 4) {
      setTimeout(next, 400);
    } else {
      handleCompletion();
    }
  };
  
  const handleTaskFailure = (difficulty = 'easy') => {
    // Hibázás pontozása
    const result = scoreTask({
      difficulty,
      isCorrect: false,
      level: 1
    });
    
    // Visszajelzés megjelenítése
    setTaskFeedback(result.feedback);
    setTimeout(() => setTaskFeedback(''), 3000);
    
    setErrors(prev => prev + 1);
  };

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>A múzeum éjszakája – Ügy #1</div>
        </Link>
        {isAuthenticated && (
          <button
            onClick={async () => {
              await logout()
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
        <NarrativeBlock badge="Múzeum – éjszakai műszak">
          <h1 style={{margin:'10px 0 4px'}}>A múzeum éjszakája – Ügy #1</h1>
          <p>Az üres termekben csak az érzékelők pislognak. Az archívumban mozgás nyomai, de hiányzik az idővonal. 
          A restaurátor szerint „csak egy kis rendrakás" – szerintünk nem.</p>
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{width: progressPct + '%'}} /></div>
          <div className="step">{done.filter(Boolean).length} / 5</div>
        </div>

        {step === 0 && (
          <TaskCard title="1. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Rejtjel</h3>
                <p className="muted">
                  Éjfél van, a múzeum szerveréről váratlanul titkosított üzenet érkezett.<br /><br />
                  A képernyőn furcsa karakterek villognak, mintha valaki sietve rejtette volna el az üzenetet.<br /><br />
                  <code>Yljbdcc, Crol ohkhw wlwnrvxjbqrn</code><br /><br />
                  A biztonsági csapat tanácstalan, de te, friss kibernyomozóként, készen állsz a felderítésre.
                </p>
                <div className="statusline">
                  Fejtsd meg a titkosított üzenetet, hogy megtudd az első nyomot a küldetésedhez.
                  A kijelző felvillan, a sorok villogni kezdenek… minden karakter egy újabb nyomot rejt.
                  Ha sikerül megfejtened, a titkosított hálózaton tovább jutsz, és a következő bizonyíték vár.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="üzenet…"
                  onCheck={(val, norm)=>{
                    const expected = 'Vigyázz, Zoli lehet titkosügynök.';
                    const ok = norm(val) === norm(expected);
                    if (ok) { handleTaskSuccess(0, 'easy'); }
                    return ok;
                  }}
                  onFailure={() => handleTaskFailure('easy')}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/1a.jpg" alt="Illusztráció 1a" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Gondolj az ábécére, és képzeld el, hogy minden betű egy kicsit előrébb vagy hátrébb lép a sorban.
                      A szóközök és írásjelek nem változnak. Próbáld kibogozni a titkos üzenetet, amely el van rejtve a karakterek között.
                    </p>
                    <div className="hint-chips" aria-hidden="true">
                      <span className="hint-chip">rot‑3</span>
                      <span className="hint-chip">shift‑3</span>
                      <span className="hint-chip">A↔X, B↔Y, C↔Z</span>
                      <span className="hint-chip">Caesar</span>
                    </div>
                  </details>
                </div>
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

        {step === 1 && (
          <TaskCard title="2. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Torzult rendszerlog</h3>
                <p className="muted">Ahogy a múzeum biztonsági szerverszobájába lépsz, a levegő vibrál.</p>
                <p className="muted">A ventilátorok túl gyorsan pörögnek, a monitorokon pedig remegő sorok futnak.</p>
                <p className="muted" style={{marginTop:'8px'}}>
                  A technikusok szerint valaki éjjel hozzáfért a rendszerhez és „kitisztította" a nyomait.
                  Csakhogy a hacker amatőr hibát vétett: hátrahagyott egy félbehagyott logfájlt, amelyben a fontos részeket ugyan törölte,
                  de egy mintát nem tudott eltakarni.
                </p>
                <p className="muted" style={{marginTop:'8px'}}>A logfájl vége villogva jelenik meg előtted:</p>
                <div className="console float-soft" aria-label="Rendszer napló">
                  <span className="line"><span className="ts">2025-11-21 09:02:14</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Nd0f94be7ac21f44f...</span></span>
                  <span className="line"><span className="ts">2025-11-21 09:02:17</span> <span className="lvl warn">WARN</span>  <span className="kv">PayloadHash=Y57ac90b32df1a...</span></span>
                  <span className="line"><span className="ts">2025-11-21 09:02:20</span> <span className="lvl info">INFO</span>  <span className="kv">LoginToken=Oaa12f8c0bffe942...</span></span>
                  <span className="line"><span className="ts">2025-11-21 09:02:24</span> <span className="lvl error">ERROR</span> <span className="kv">ReqHash=Mc21f9ee8b1127c3...</span></span>
                  <span className="line"><span className="ts">2025-11-21 09:02:28</span> <span className="lvl info">INFO</span>  <span className="kv">OutID=Od991e0bc113fe0...</span></span>
                  <span className="line"><span className="ts">2025-11-21 09:02:32</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Kb019aaef9e13cc1...</span></span>
                </div>
                <div className="statusline" style={{marginTop:'10px'}}>
                  Gyűjtsd össze a naplósorok értékeinek első betűit,
                  olvasd össze kulcsszóvá, majd írj be a mezőbe.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="kulcsszó…"
                  onCheck={(val, norm)=>{
                    const v = norm(val).replace(/[\s\-_.]/g,'');
                    const ok = (v === 'NYOMOK');
                    if (ok) { handleTaskSuccess(1, 'medium'); }
                    return ok;
                  }}
                  onFailure={() => handleTaskFailure('medium')}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/1b.jpg" alt="Illusztráció 1b" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Figyeld a kulcs‑érték párokat. Minden érték vezető karaktere fontos a következő feladathoz.
                      Gyűjtsd össze ezeket a karaktereket, és rakd össze a jelszót!
                      (Magyarázat: a „kulcs‑érték pár" olyan forma, mint „Név=Secure" – a bal oldal a kulcs, a jobb oldal az érték.)
                    </p>
                  </details>
                </div>
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
                <h3>Titkosított levél</h3>
                <div className="card" style={{background:'#0b121c', borderColor:'rgba(207,230,255,0.12)'}}>
                  <p className="muted" style={{whiteSpace:'pre-line', margin:0}}>
Kedves ismeretlen!

Ma nyolckor a kávézónál vártalak volna,
de három pillanat alatt elszaladt az idő.

Minden percben egyetlen percet gondolok rád,
és hét lépés távolságban érzem a közelséged.

 Először azok a pillanatok törnek elő, amelyek a legerősebben élnek bennem.
 Ezután következik az érzés, ami először megmozdította a szívemet.
 A következő jelek a közénk feszülő tér rezdüléseiben bújnak meg.
 Végül a röpke, elsuhanó percek rajzolják ki a történet teljes képét.

Üdvözlettel, S.</p>
                </div>
                <div className="statusline" style={{marginTop:'10px'}}>
                  Gépeld be a 4 számjegyű kulcskódot – a levél suttogja a megoldást.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="4 számjegy…"
                  onCheck={(val, _norm)=>{
                    const v = String(val||'').replace(/\D/g,'');
                    const ok = (v === '3871');
                    if (ok) { handleTaskSuccess(2, 'medium'); }
                    return ok;
                  }}
                  okText="Helyes! Tovább…"
                  errText="Nem egészen – figyeld a számokat szavakban és a sorrendet."
                  onFailure={() => handleTaskFailure('medium')}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/1c.jpg" alt="Illusztráció 1c" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Figyeld a levél apró utalásait – bizonyos szavak mögött rejlenek a kulcs jelei.
                      A sorrend titka a történet ritmusában bújik meg: csak ha jól olvasod, áll össze a kód.
                    </p>
                  </details>
                </div>
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
                <h3>Kódolt betűk</h3>
                <p className="muted" style={{margin:'8px 0 10px'}}>
                  A múzeum egyik archivált adatcsomagjában furcsa szövegrácsot találtak.<br /><br />
                  A technikusok szerint valaki szándékosan rejtett el benne kulcsszavakat, amelyek a rendszerbe történt behatolásra utalnak.
                  A mintázat túl rendezett ahhoz, hogy véletlen legyen.<br /><br />
                  A biztonsági csapat téged kér, hogy keresd meg a rejtett szavakat — ezek vezetnek a következő nyomhoz.<br />
                  De vigyázz: a támadó mindig hagy egy hamis nyomot is, hogy megtévessze a nyomozókat.
                </p>
                <div className="ws-wrap">
                  <div className="ws-board">
                    <div id="wsGrid" className="ws-grid"></div>
                  </div>
                  <div className="ws-words">
                    <strong>Keresendő szavak:</strong>
                    <ul id="wsList" style={{margin:'8px 0 0 16px', padding:0}}></ul>
                    <div id="wsDone" className="ws-done">Kész!</div>
                  </div>
                </div>
                <div className="statusline" style={{marginTop:'10px'}}>
                  Jelöld ki a rácsban elrejtett szavakat.
                  A megtalált szavak első betűi számokká alakulnak – olvasd össze a négy számot kóddá.
                </div>
              </div>
              <div className="card">
                <h3>Kód</h3>
                <ChallengeInput
                  placeholder="4 számjegy…"
                  onCheck={(val, _norm)=>{
                    const v = String(val||'').replace(/\D/g,'');
                    const ok = (v === '3542');
                    if (ok) { handleTaskSuccess(3, 'hard'); }
                    return ok;
                  }}
                  okText="Helyes! Tovább…"
                  errText="Nem egészen – előbb találd meg a szavakat, majd alakítsd számokká az első betűiket."
                  onFailure={() => handleTaskFailure('hard')}
                />
                <PerfImg className="task-ill" src="/images/1d.jpg" alt="Illusztráció 1d" width="280" height="280" priority />
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Minden szó első betűje számot rejt. Figyeld a rácsban elrejtett kulcsszavakat, így juthatsz a következő kódhoz.
                    </p>
                  </details>
                </div>
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
            <WordSearchMount />
          </TaskCard>
        )}

        {step === 4 && (
          <TaskCard title="5. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Nyomok dokumentálása</h3>
                <p className="muted">A központ rákérdez, mennyire figyeltél az eddigi nyomokra. Egy ügyes kibernyomozó minden nyomot rendszerez, hogy később könnyen visszakereshető legyen.</p>
                <p className="muted">Dokumentáld az előző négy feladat nyomait! Írj le minden nyomot külön sorban, és jelöld, honnan származik. Csak akkor tudsz továbblépni, ha mind a négy nyomot helyesen jegyzed fel.</p>
                <div className="task-note"><PerfImg className="task-ill" src="/images/1e.jpg" alt="Illusztráció 1e" width="280" height="280" priority /></div>
              </div>
              <div className="card">
                <h3>Táblázat</h3>
                <MatchTable onDone={handleCompletion} onFailure={() => handleTaskFailure('hard')} />
                <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                  <button className="btn-ghost" type="button" onClick={()=>setShowArchive(true)}>
                    🔍 Nyomok újramegtekintése
                  </button>
                </div>
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
                {done[4] && (
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
                      <Link
                        className="btn"
                        to="/ugy2"
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
                        Tovább az Éjféli kézfogásra
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TaskCard>
        )}
      </main>
      {showArchive && <ArchiveModal onClose={()=>setShowArchive(false)} />}
    </div>
  );
};

// ——— Word search mounting (simple static board + interactions) ———
function WordSearchMount(){
  useEffect(()=>{
    const WORDS = ['CIPHER','ENCRYPT','DATA','LOGIC'];
    const SIZE = 10;
    const root = document.getElementById('wsGrid');
    const list = document.getElementById('wsList');
    if(!root || !list) return;
    
    // Event listeners tárolása cleanup-hoz
    const eventListeners = [];
    const empty = Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>'' ));
    function inBounds(r,c){ return r>=0 && r<SIZE && c>=0 && c<SIZE; }
    function placeWord(grid, word, r, c, dr, dc){
      for(let i=0;i<word.length;i++){
        grid[r+dr*i][c+dc*i] = word[i];
      }
    }
    const planned = [
      { w:'CIPHER',  r:1, c:1, dr:0,  dc:1 },
      { w:'ENCRYPT', r:2, c:2, dr:1,  dc:0 },
      { w:'DATA',    r:9, c:9, dr:-1, dc:0 },
      { w:'LOGIC',   r:4, c:9, dr:0,  dc:-1 }
    ];
    planned.forEach(p => placeWord(empty, p.w, p.r, p.c, p.dr, p.dc));
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(empty[r][c]==='') empty[r][c] = A[Math.floor(Math.random()*A.length)];
      }
    }
    root.style.gridTemplateColumns = `repeat(${SIZE}, 34px)`;
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const div = document.createElement('div');
        div.className = 'ws-cell';
        div.setAttribute('data-r', String(r));
        div.setAttribute('data-c', String(c));
        div.textContent = empty[r][c];
        root.appendChild(div);
      }
    }
    let activeWord = null;
    function setActive(word){
      activeWord = word;
      list.querySelectorAll('li').forEach(li=>{
        if(li.getAttribute('data-w') === word){ li.classList.add('active'); }
        else { li.classList.remove('active'); }
      });
    }
    function addWordItem(w){
      const li = document.createElement('li');
      li.textContent = w;
      li.setAttribute('data-w', w);
      li.addEventListener('click', ()=>{
        if(li.classList.contains('found')) return;
        setActive(w);
      });
      list.appendChild(li);
      return li;
    }
    const wordItems = {};
    WORDS.forEach(w=>{ wordItems[w] = addWordItem(w); });
    let start = null;
    let isDown = false;
    function getCell(el){
      if(!el || !el.classList.contains('ws-cell')) return null;
      return { r: parseInt(el.getAttribute('data-r')), c: parseInt(el.getAttribute('data-c')) };
    }
    function clearSelection(){
      root.querySelectorAll('.ws-cell.sel').forEach(e=>e.classList.remove('sel'));
    }
    function markSel(r1,c1,r2,c2){
      clearSelection();
      if(r1===r2){
        const min = Math.min(c1,c2), max=Math.max(c1,c2);
        for(let c=min;c<=max;c++){
          root.querySelector(`.ws-cell[data-r="${r1}"][data-c="${c}"]`)?.classList.add('sel');
        }
      } else if(c1===c2){
        const min = Math.min(r1,r2), max=Math.max(r1,r2);
        for(let r=min;r<=max;r++){
          root.querySelector(`.ws-cell[data-r="${r}"][data-c="${c1}"]`)?.classList.add('sel');
        }
      }
    }
    function readSel(r1,c1,r2,c2){
      if(r1===r2){
        const min = Math.min(c1,c2), max=Math.max(c1,c2);
        let s=''; for(let c=min;c<=max;c++) s += empty[r1][c];
        return s;
      } else if(c1===c2){
        const min = Math.min(r1,r2), max=Math.max(r1,r2);
        let s=''; for(let r=min;r<=max;r++) s += empty[r][c1];
        return s;
      }
      return '';
    }
    function commit(r1,c1,r2,c2){
      const s = readSel(r1,c1,r2,c2);
      if(!s) return;
      const candidates = [s, s.split('').reverse().join('')];
      let found = activeWord && candidates.includes(activeWord) ? activeWord : WORDS.find(w => candidates.includes(w));
      if(found){
        if(r1===r2){
          const min = Math.min(c1,c2), max=Math.max(c1,c2);
          for(let c=min;c<=max;c++){
            root.querySelector(`.ws-cell[data-r="${r1}"][data-c="${c}"]`)?.classList.add('found');
          }
        } else if(c1===c2){
          const min = Math.min(r1,r2), max=Math.max(r1,r2);
          for(let r=min;r<=max;r++){
            root.querySelector(`.ws-cell[data-r="${r}"][data-c="${c1}"]`)?.classList.add('found');
          }
        }
        const li = wordItems[found]; if(li){ li.classList.add('found'); }
        if(activeWord === found){ activeWord = null; }
        function letterToDigit(ch){
          const code = (ch.toUpperCase().charCodeAt(0) - 64);
          const d = code % 10;
          return d;
        }
        const forward = (s === found);
        const firstChar = forward ? s[0] : s[s.length-1];
        const firstCell = forward ? { rr: r1, cc: c1 } : { rr: r2, cc: c2 };
        const firstEl = root.querySelector(`.ws-cell[data-r="${firstCell.rr}"][data-c="${firstCell.cc}"]`);
        if(firstEl){
          firstEl.textContent = String(letterToDigit(firstChar));
        }
        const allFound = WORDS.every(w=>wordItems[w].classList.contains('found'));
        if(allFound){
          const doneEl = document.getElementById('wsDone'); if(doneEl){ doneEl.style.display='block'; }
        }
      }
      clearSelection();
    }
    const handleContextMenu = (e) => { e.preventDefault(); };
    const handleMouseDown = (e) => {
      const cell = getCell(e.target);
      if(!cell) return;
      if(!(e.button === 0 || e.button === 2)) return;
      isDown = true; start = cell;
      if(e.button === 2) e.preventDefault();
      clearSelection();
    };
    const handleMouseOver = (e) => {
      if(!isDown || !start) return;
      const cell = getCell(e.target);
      if(!cell) return;
      if(cell.r===start.r || cell.c===start.c){
        markSel(start.r, start.c, cell.r, cell.c);
      }
    };
    const handleMouseUp = (e) => {
      if(!isDown || !start) return;
      isDown = false;
      const cell = getCell(e.target);
      if(!cell){ clearSelection(); start=null; return; }
      if(cell.r===start.r || cell.c===start.c){
        commit(start.r, start.c, cell.r, cell.c);
      } else { clearSelection(); }
      start = null;
    };
    
    root.addEventListener('contextmenu', handleContextMenu);
    root.addEventListener('mousedown', handleMouseDown);
    root.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup function
    return () => {
      root.removeEventListener('contextmenu', handleContextMenu);
      root.removeEventListener('mousedown', handleMouseDown);
      root.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseup', handleMouseUp);
      root.innerHTML = '';
      if(list) list.innerHTML = '';
    };
  }, []);
  return null;
}

// ——— Match table (task 5) ———
function MatchTable({ onDone, onFailure }){
  const [rows, setRows] = useState([
    { text:'', src:'' },
    { text:'', src:'' },
    { text:'', src:'' },
    { text:'', src:'' }
  ]);
  const [msg, setMsg] = useState('');
  function norm(s){
    return String(s||'')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^A-Za-z0-9]/g,'')
      .toUpperCase();
  }
  const SOURCES = ['Rejtjel','Torzult rendszerlog','Titkosított levél','Kódolt betűk'];
  const ACCEPT = [
    { texts: ['VIGYAZZZOLILEHETTITKOSUGYNOK'], src: 'REJTJEL' },
    { texts: ['NYOMOK'], src: 'TORZULTRENDSZERLOG' },
    { texts: ['3871'], src: 'TITKOSITOTTLEVEL' },
    { texts: ['3542'], src: 'KODOLTBETUK' }
  ];
  function updateRow(i, field, val){
    setRows(prev=>{
      const p = prev.slice();
      p[i] = { ...p[i], [field]: val };
      return p;
    });
  }
  function check(){
    const used = new Set();
    for(const row of rows){
      const t = norm(row.text);
      const s = norm(row.src);
      const matchIdx = ACCEPT.findIndex((a, idx) => {
        if(used.has(idx)) return false;
        const textOk = a.texts.some(x=>x===t);
        const srcOk = (a.src === s);
        return textOk && srcOk;
      });
      if(matchIdx === -1){
        setMsg('Helytelen párosítás.');
        onFailure && onFailure();
        return;
      }
      used.add(matchIdx);
    }
    setMsg('Helyes! Minden párosítás stimmel.');
    onDone && onDone();
  }
  return (
    <div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'separate', borderSpacing:'0 8px'}}>
          <thead>
            <tr style={{color:'#94a3b8', fontSize:'12px'}}>
              <th style={{textAlign:'left'}}>Nyom</th>
              <th style={{textAlign:'left'}}>Forrás</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i)=>(
              <tr key={i}>
                <td style={{paddingRight:'10px'}}>
                  <input className="input" type="text" placeholder="nyom…" value={r.text} onChange={(e)=>updateRow(i,'text', e.target.value)} />
                </td>
                <td>
                  <select className="input" value={r.src} onChange={(e)=>updateRow(i,'src', e.target.value)}>
                    <option value="">– válassz –</option>
                    {SOURCES.map(s=>(
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display:'flex', gap:'10px', marginTop:'10px', alignItems:'center'}}>
        <button className="btn" type="button" onClick={check}>Ellenőrzés</button>
        {msg && <span className="feedback" style={{fontWeight:700}}>{msg}</span>}
      </div>
    </div>
  );
}

// ——— Archive modal: raw view of tasks 1–4 without solutions ———
function ArchiveModal({ onClose }){
  useEffect(()=>{
    const root = document.getElementById('wsGridArchive');
    if(!root) return;
    const SIZE = 10;
    const WORDS = ['CIPHER','ENCRYPT','DATA','LOGIC'];
    const empty = Array.from({length:SIZE},()=>Array.from({length:SIZE},()=>'' ));
    function placeWord(grid, word, r, c, dr, dc){
      for(let i=0;i<word.length;i++){
        grid[r+dr*i][c+dc*i] = word[i];
      }
    }
    function letterToDigit(ch){
      const code = (ch.toUpperCase().charCodeAt(0) - 64);
      return String(code % 10);
    }
    const planned = [
      { w:'CIPHER',  r:1, c:1, dr:0,  dc:1 },
      { w:'ENCRYPT', r:2, c:2, dr:1,  dc:0 },
      { w:'DATA',    r:9, c:9, dr:-1, dc:0 },
      { w:'LOGIC',   r:4, c:9, dr:0,  dc:-1 }
    ];
    planned.forEach(p => placeWord(empty, p.w, p.r, p.c, p.dr, p.dc));
    planned.forEach(p => {
      const firstR = p.r;
      const firstC = p.c;
      const firstChar = empty[firstR][firstC];
      if(firstChar && /[A-Z]/.test(firstChar)){
        empty[firstR][firstC] = letterToDigit(firstChar);
      }
    });
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(empty[r][c]==='') empty[r][c] = A[Math.floor(Math.random()*A.length)];
      }
    }
    root.style.gridTemplateColumns = `repeat(${SIZE}, 34px)`;
    root.innerHTML = '';
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const div = document.createElement('div');
        div.className = 'ws-cell';
        div.textContent = empty[r][c];
        root.appendChild(div);
      }
    }
  }, []);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Nyomok újramegtekintése">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
          <h3 style={{margin:0}}>🔍 Nyomok újramegtekintése</h3>
          <button className="btn-ghost" type="button" onClick={onClose}>Bezárás</button>
        </div>
        <div className="archive-grid">
          <section className="card">
            <h3 style={{marginTop:0}}>🔐 1. Rejtjeles feladat</h3>
            <p className="muted">Csak a titkosított üzenet:</p>
            <div className="statusline"><code>Yljbdcc, Crol ohkhw wlwnrvxjbqrn</code></div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>🧩 2. Torzult rendszerlog</h3>
            <div className="console float-soft" aria-label="Rendszer napló">
              <span className="line"><span className="ts">2025-11-21 09:02:14</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Nd0f94be7ac21f44f...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:17</span> <span className="lvl warn">WARN</span>  <span className="kv">PayloadHash=Y57ac90b32df1a...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:20</span> <span className="lvl info">INFO</span>  <span className="kv">LoginToken=Oaa12f8c0bffe942...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:24</span> <span className="lvl error">ERROR</span> <span className="kv">ReqHash=Mc21f9ee8b1127c3...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:28</span> <span className="lvl info">INFO</span>  <span className="kv">OutID=Od991e0bc113fe0...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:32</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Kb019aaef9e13cc1...</span></span>
            </div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>💌 3. Titkosított levél</h3>
            <div className="card" style={{background:'#0b121c', borderColor:'rgba(207,230,255,0.12)'}}>
              <p className="muted" style={{whiteSpace:'pre-line', margin:0}}>
Kedves ismeretlen!

Ma nyolckor a kávézónál vártalak volna,
de három pillanat alatt elszaladt az idő.

Minden percben egyetlen percet gondolok rád,
és hét lépés távolságban érzem a közelséged.

 Először azok a pillanatok törnek elő, amelyek a legerősebben élnek bennem.
 Ezután következik az érzés, ami először megmozdította a szívemet.
 A következő jelek a közénk feszülő tér rezdüléseiben bújnak meg.
 Végül a röpke, elsuhanó percek rajzolják ki a történet teljes képét.

Üdvözlettel, S.</p>
            </div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>🔎 4. Kódolt betűk</h3>
            <div className="ws-board">
              <div id="wsGridArchive" className="ws-grid"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Ugy1
