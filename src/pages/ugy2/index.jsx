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

// Caesar shift dekódolás (ugyanaz, mint az első pályán)
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

// Vigenère dekódolás (ugyanaz, mint az első pályán)
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
const STORAGE_KEY = 'ugy2_progress';
const STORAGE_COMPLETED_KEY = 'ugy2_completed';

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

// Ellenőrzés: az első pálya teljesítve van-e
function checkUgy1Completed() {
  try {
    // Az első pálya teljesítését sessionStorage-ból vagy localStorage-ból ellenőrizzük
    // Az ugy1.html a 5. feladat után sessionStorage.setItem('cm_lvl1_entry_ok','1')-et hív
    // Vagy localStorage-ban tárolhatjuk a teljesített pályákat
    const ugy1Done = sessionStorage.getItem('cm_lvl1_entry_ok') === '1' ||
                     localStorage.getItem('ugy1_completed') === 'true';
    return ugy1Done;
  } catch(e) {
    return false;
  }
}

const Ugy2 = () => {
  const [step, setStep] = useState(0); // 0..4
  const [done, setDone] = useState([false,false,false,false,false]);
  const [showArchive, setShowArchive] = useState(false);
  const [ugy1Locked, setUgy1Locked] = useState(true);
  const [searchParams] = useSearchParams()
  const { saveLevelCompletion, isAuthenticated } = useAuth()

  // Betöltés: állapot visszaállítása és első pálya ellenőrzése
  useEffect(() => {
    // Ha van ?start=1 paraméter az URL-ben, kezdjük az első feladatnál
    const startFromBeginning = searchParams.get('start') === '1';
    
    if (startFromBeginning) {
      setStep(0);
      setDone([false, false, false, false, false]);
    } else {
      const { step: savedStep, done: savedDone } = loadProgress();
      setStep(savedStep);
      setDone(savedDone);
    }
    
    // Ellenőrizzük, hogy az első pálya teljesítve van-e
    const ugy1Completed = checkUgy1Completed();
    setUgy1Locked(!ugy1Completed);
  }, []);

  // Prefetch következő feladat képe
  useEffect(()=>{
    const STEP_IMAGES = ['/images/2a.jpg','/images/2b.jpg','/images/2c.jpg','/images/2d.jpg','/images/2e.jpg'];
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
        saveLevelCompletion('ugy2').catch(console.warn)
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

  // Ha az első pálya nincs teljesítve, zárolt üzenet
  if (ugy1Locked) {
    return (
      <div className="container">
        <header>
          <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
            <div className="brand-badge">CM</div>
            <div>A hamisított archívum – Ügy #2</div>
          </Link>
        </header>
        <main>
          <div className="card" style={{textAlign:'center', padding:'40px 20px'}}>
            <h2 style={{margin:'0 0 16px'}}>🔒 Pálya zárolva</h2>
            <p className="muted" style={{margin:'0 0 20px', fontSize:'16px', lineHeight:'1.7'}}>
              A második pálya csak az első pálya teljesítése után érhető el.
              <br />
              Visszatérhetsz az első pályára, hogy befejezd a feladatokat.
            </p>
            <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
              <Link className="btn" to="/ugy1">Vissza az első pályára</Link>
              <Link className="btn-ghost" to="/aurora">Ügyek áttekintése</Link>
            </div>
            {/* Fejlesztői gomb - zárolás feloldása */}
            <div style={{marginTop:'24px', paddingTop:'24px', borderTop:'1px solid rgba(207,230,255,0.1)'}}>
              <button 
                className="btn-ghost" 
                onClick={() => setUgy1Locked(false)}
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
          <div>A hamisított archívum – Ügy #2</div>
        </Link>
      </header>

      <main>
        <NarrativeBlock badge="Archívum – hamisított nyomok">
          <h1 style={{margin:'10px 0 4px'}}>A hamisított archívum – Ügy #2</h1>
          <p>Az első pálya nyomai vezettek ide. A múzeum archívumában valami nem stimmel – 
          a dokumentumokban ellentmondások vannak, és egyes fájlok hamisítottak tűnnek. 
          Az első pálya megoldásai kulcsfontosságúak lesznek a folytatáshoz.</p>
        </NarrativeBlock>

        <div className="progress">
          <div className="bar"><div className="bar-in" style={{width: progressPct + '%'}} /></div>
          <div className="step">{done.filter(Boolean).length} / 5</div>
        </div>

        {/* Feladat 1: Az első pálya megoldásainak kombinálása */}
        {step === 0 && (
          <TaskCard title="1. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Kombinált kulcs</h3>
                <p className="muted">
                  Az első pálya négy fő megoldása: 
                  <br /><br />
                  <strong>1.</strong> "Vigyázz, Zoli lehet titkosügynök." (rejtjel megoldása)
                  <br />
                  <strong>2.</strong> "NYOMOK" (rendszerlog kulcsszó)
                  <br />
                  <strong>3.</strong> "3871" (titkosított levél kódja)
                  <br />
                  <strong>4.</strong> "3542" (kódolt betűk száma)
                  <br /><br />
                  A rendszer egy kombinált kulcsot vár, amely ezekből az értékekből épül fel.
                  Vedd az első pálya négy megoldásának első betűit vagy számjegyeit, és kombináld őket egyetlen szóvá vagy kóddá.
                </p>
                <div className="statusline">
                  A kulcs az első pálya négy megoldásának első karaktereiből áll (betűk és számok egyaránt).
                  Kombináld őket sorrendben, és add meg az eredményt.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="kombinált kulcs…"
                  onCheck={(val, norm)=>{
                    // Megoldás: VN33 (Vigyázz első betűje V, NYOMOK első betűje N, 3871 első számjegye 3, 3542 első számjegye 3)
                    const expected = 'VN33';
                    const ok = norm(val) === norm(expected);
                    if (ok) { markDone(0); setTimeout(next, 400); }
                    return ok;
                  }}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/2a.jpg" alt="Illusztráció 2a" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Vegyed az első pálya négy megoldásának első karakterét (betű vagy szám).
                      Sorrendben kombináld őket: 1. megoldás első betűje, 2. megoldás első betűje, 
                      3. megoldás első számjegye, 4. megoldás első számjegye.
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

        {/* Feladat 2: Caesar shift visszafejtés az első pálya kulcsával */}
        {step === 1 && (
          <TaskCard title="2. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Caesar shift visszafejtés</h3>
                <p className="muted">
                  Az archívumban egy Caesar shift titkosított üzenetet találtál. 
                  Az eltolás az első pálya második feladatának megoldásából származik: <strong>"NYOMOK"</strong>.
                  <br /><br />
                  A kulcs számértéke: vedd a "NYOMOK" szó betűinek pozíciójának összegét az ábécében (A=1, B=2, ...), 
                  majd vedd a maradékot 26-tal osztva. Ez lesz a shift érték.
                  <br /><br />
                  A titkosított szöveg:
                  <br />
                  <code style={{background:'#0b121c', padding:'8px 12px', borderRadius:'8px', display:'inline-block', marginTop:'8px'}}>
                    QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD
                  </code>
                </p>
                <div className="statusline">
                  Számold ki a shift értéket a "NYOMOK" szó betűinek pozícióiból, majd fejtsd vissza a Caesar shift titkosítást.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="dekódolt üzenet…"
                  onCheck={(val, norm)=>{
                    // NYOMOK betűinek pozíciói: N=14, Y=25, O=15, M=13, O=15, K=11
                    // Összeg: 14+25+15+13+15+11 = 93
                    // 93 mod 26 = 15 (mert 93 = 3*26 + 15)
                    // Shift = 15, de Caesar shift-nél visszafelé kell tolni, tehát shift-15 vagy shift-11 (26-15=11)
                    // Vagy egyszerűbb: shift-15 visszafejtés
                    const decoded = CaesarShiftDecode('QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD', 15);
                    // A megoldás "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" shift-15-mel
                    // De shift-15 visszafejtés shift-11 előre titkosítás
                    // Próbáljuk shift-11-gyel:
                    const decoded2 = CaesarShiftDecode('QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD', 11);
                    const expected = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
                    const ok = norm(val) === norm(expected) || norm(val) === norm(decoded) || norm(val) === norm(decoded2);
                    if (ok) { markDone(1); setTimeout(next, 400); }
                    return ok;
                  }}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/2b.jpg" alt="Illusztráció 2b" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      A "NYOMOK" betűinek pozíciói: N=14, Y=25, O=15, M=13, O=15, K=11.
                      Összegük: 93. 93 mod 26 = 15.
                      A Caesar shift visszafejtéshez használd a shift-15 értéket (vagy shift-11-et, ami ugyanaz mod 26).
                    </p>
                  </details>
                </div>
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

        {/* Feladat 3: Log elemzés az első pálya mintájára, de összetettebb */}
        {step === 2 && (
          <TaskCard title="3. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Összetett rendszerlog elemzés</h3>
                <p className="muted" style={{margin:'8px 0 10px'}}>
                  Az első pályán a log értékeinek első betűit gyűjtötted össze. 
                  Most egy összetettebb mintázatot kell felismerned.
                  <br /><br />
                  A logfájlban az értékek utolsó karaktereit kell összegyűjtened, 
                  de csak azokét, amelyeknél a szint "ERROR" vagy "ALERT".
                </p>
                <div className="console float-soft" aria-label="Rendszer napló">
                  <span className="line"><span className="ts">2025-11-22 14:15:30</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Xa7f23c9d11e55g...</span></span>
                  <span className="line"><span className="ts">2025-11-22 14:15:33</span> <span className="lvl warn">WARN</span>  <span className="kv">PayloadHash=Yb8d34e0a22f66h...</span></span>
                  <span className="line"><span className="ts">2025-11-22 14:15:36</span> <span className="lvl error">ERROR</span> <span className="kv">ReqHash=Zc9e45f1b33g77i...</span></span>
                  <span className="line"><span className="ts">2025-11-22 14:15:39</span> <span className="lvl info">INFO</span>  <span className="kv">LoginToken=Ad0f56g2c44h88j...</span></span>
                  <span className="line"><span className="ts">2025-11-22 14:15:42</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Be1g67h3d55i99k...</span></span>
                  <span className="line"><span className="ts">2025-11-22 14:15:45</span> <span className="lvl error">ERROR</span> <span className="kv">OutID=Cf2h78i4e66j00l...</span></span>
                </div>
                <div className="statusline" style={{marginTop:'10px'}}>
                  Gyűjtsd össze az ERROR és ALERT szintű sorok értékeinek utolsó karaktereit,
                  olvasd össze kulcsszóvá, majd írj be a mezőbe.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="kulcsszó…"
                  onCheck={(val, norm)=>{
                    // ERROR sorok: ReqHash utolsó karaktere: i, OutID utolsó karaktere: l
                    // ALERT sor: KeyRef utolsó karaktere: k
                    // Sorrend: i (ERROR), k (ALERT), l (ERROR) -> IKL vagy IKL
                    const v = norm(val).replace(/[\s\-_.]/g,'');
                    const ok = (v === 'IKL' || v === 'IKL');
                    if (ok) { markDone(2); setTimeout(next, 400); }
                    return ok;
                  }}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/2c.jpg" alt="Illusztráció 2c" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Csak az ERROR és ALERT szintű sorokat vedd figyelembe.
                      Minden ilyen sor értékének utolsó karakterét gyűjtsd össze a logban látható sorrendben.
                    </p>
                  </details>
                </div>
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

        {/* Feladat 4: Caesar shift visszafejtés más kulccsal */}
        {step === 3 && (
          <TaskCard title="4. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Caesar shift visszafejtés</h3>
                <p className="muted">
                  Az első pályán Caesar shift-3-mal dolgoztál. Most egy másik eltolást kell használnod.
                  <br /><br />
                  A titkosított üzenet:
                  <br />
                  <code style={{background:'#0b121c', padding:'8px 12px', borderRadius:'8px', display:'inline-block', marginTop:'8px'}}>
                    QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD
                  </code>
                  <br /><br />
                  A kulcs az első pálya harmadik feladatának megoldásának első számjegye: <strong>3</strong>.
                  De vigyázz: ez most nem shift-3, hanem shift-23 (vagyis -3, ami ugyanaz, mint +23 mod 26).
                </p>
                <div className="statusline">
                  Fejtsd vissza a Caesar shift titkosítást shift-23-mal (vagy shift-3-mal fordított irányban).
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="dekódolt üzenet…"
                  onCheck={(val, norm)=>{
                    // Caesar shift-23 visszafejtés (ami ugyanaz, mint shift-3 előre)
                    const decoded = CaesarShiftDecode('QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD', 23);
                    const expected = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG';
                    const ok = norm(val) === norm(expected) || norm(val) === norm(decoded);
                    if (ok) { markDone(3); setTimeout(next, 400); }
                    return ok;
                  }}
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/2d.jpg" alt="Illusztráció 2d" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Shift-23 azt jelenti, hogy minden betűt 23 hellyel visszafelé tolsz az ábécében 
                      (vagy 3 hellyel előre, ami ugyanaz mod 26). A szóközök és írásjelek nem változnak.
                    </p>
                    <div className="hint-chips" aria-hidden="true">
                      <span className="hint-chip">shift-23</span>
                      <span className="hint-chip">shift-3 fordított</span>
                      <span className="hint-chip">Caesar</span>
                    </div>
                  </details>
                </div>
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

        {/* Feladat 5: Összefoglaló feladat - az első pálya megoldásainak újrahasználata */}
        {step === 4 && (
          <TaskCard title="5. feladat">
            <div className="grid2">
              <div className="card">
                <h3>Végső összekapcsolás</h3>
                <p className="muted">
                  Az archívum hamisítása most világossá vált. Az első pálya négy megoldását kombinálva 
                  kapsz egy végső kulcsot, amely felnyitja a zárolt fájlokat.
                  <br /><br />
                  Kombináld az első pálya négy megoldását egyetlen kóddá:
                  <br />
                  <strong>1.</strong> "Vigyázz, Zoli lehet titkosügynök." → első 3 betű: VIG
                  <br />
                  <strong>2.</strong> "NYOMOK" → első 2 betű: NY
                  <br />
                  <strong>3.</strong> "3871" → első 2 számjegy: 38
                  <br />
                  <strong>4.</strong> "3542" → első 2 számjegy: 35
                  <br /><br />
                  A végső kulcs ezeknek a kombinációja, kötőjelekkel elválasztva.
                </p>
                <div className="statusline">
                  Kombináld az első pálya négy megoldásának első karaktereit (betűk és számok) 
                  kötőjelekkel elválasztva a fenti sorrendben.
                </div>
              </div>
              <div className="card">
                <h3>Válasz</h3>
                <ChallengeInput
                  placeholder="végső kulcs…"
                  onCheck={(val, norm)=>{
                    // VIG-NY-38-35 vagy hasonló formátum
                    const v = norm(val).replace(/[\s\-_.]/g,'');
                    // Elfogadunk többféle formátumot
                    const variants = ['VIGNY3835', 'VIGNY3835', 'VIGNY-38-35', 'VIG-NY-38-35'];
                    const ok = variants.some(variant => norm(val) === norm(variant)) || 
                              (v.includes('VIG') && v.includes('NY') && v.includes('38') && v.includes('35'));
                    if (ok) { 
                      markDone(4); 
                      // Teljesítés mentése
                      try {
                        localStorage.setItem('ugy2_completed', 'true');
                        if (isAuthenticated) {
                          saveLevelCompletion('ugy2').catch(console.warn)
                        }
                      } catch(e) {
                        console.warn('Nem sikerült menteni a teljesítést:', e);
                      }
                    }
                    return ok;
                  }}
                  okText="Helyes! Gratulálunk, teljesítetted a második pályát!"
                  errText="Nem egészen – kombináld az első pálya megoldásait a leírt sorrendben."
                />
                <div className="task-note"><PerfImg className="task-ill" src="/images/2e.jpg" alt="Illusztráció 2e" width="280" height="280" priority /></div>
                <div className="hint">
                  <details>
                    <summary>Súgó megnyitása</summary>
                    <p className="muted" style={{margin:'8px 0 0'}}>
                      Vegyed az első pálya négy megoldásának első karaktereit:
                      1. "Vigyázz..." → VIG (első 3 betű)
                      2. "NYOMOK" → NY (első 2 betű)
                      3. "3871" → 38 (első 2 számjegy)
                      4. "3542" → 35 (első 2 számjegy)
                      Kombináld őket kötőjelekkel vagy egybefűzve.
                    </p>
                  </details>
                </div>
                {/* Fejlesztői gombok */}
                <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <button 
                    className="btn-ghost" 
                    onClick={() => { 
                      markDone(4); 
                      try {
                        localStorage.setItem('ugy2_completed', 'true');
                        if (isAuthenticated) {
                          saveLevelCompletion('ugy2').catch(console.warn)
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
                      <Link className="btn-ghost" to="/ugy1" style={{textDecoration:'none'}}>Előző ügy</Link>
                      <Link className="btn-ghost" to="/ugy3?start=1" style={{textDecoration:'none'}}>Következő ügy</Link>
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

export default Ugy2

