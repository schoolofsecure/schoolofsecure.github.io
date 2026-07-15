import React, { useState, useEffect } from 'react'
import ChallengeInput from './ChallengeInput'

// ——— Word search mounting (simple static board + interactions) ———
export function WordSearchMount(){
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
export function MatchTable({ onDone, onFailure }){
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
  const SOURCES = ['Cipher','Distorted system log','Encrypted letter','Coded letters'];
  const ACCEPT = [
    { texts: ['WATCHOUTZOLIMIGHTBEASECRETAGENT'], src: 'CIPHER' },
    { texts: ['CLUES'], src: 'DISTORTEDSYSTEMLOG' },
    { texts: ['3871'], src: 'ENCRYPTEDLETTER' },
    { texts: ['3542'], src: 'CODEDLETTERS' }
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
        setMsg('Incorrect pairing.');
        onFailure && onFailure();
        return;
      }
      used.add(matchIdx);
    }
    setMsg('Correct! All pairings match.');
    onDone && onDone();
  }
  return (
    <div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'separate', borderSpacing:'0 8px'}}>
          <thead>
            <tr style={{color:'#94a3b8', fontSize:'12px'}}>
              <th style={{textAlign:'left'}}>Clue</th>
              <th style={{textAlign:'left'}}>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i)=>(
              <tr key={i}>
                <td style={{paddingRight:'10px'}}>
                  <input className="input" type="text" placeholder="clue…" value={r.text} onChange={(e)=>updateRow(i,'text', e.target.value)} />
                </td>
                <td>
                  <select className="input" value={r.src} onChange={(e)=>updateRow(i,'src', e.target.value)}>
                    <option value="">– select –</option>
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
        <button className="btn" type="button" onClick={check}>Check</button>
        {msg && <span className="feedback" style={{fontWeight:700}}>{msg}</span>}
      </div>
    </div>
  );
}

// ——— Archive modal: raw view of tasks 1–4 without solutions ———
export function ArchiveModal({ onClose }){
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
    <div className="modal" role="dialog" aria-modal="true" aria-label="Review clues again">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-panel card">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
          <h3 style={{margin:0}}>🔍 Review clues again</h3>
          <button className="btn-ghost" type="button" onClick={onClose}>Close</button>
        </div>
        <div className="archive-grid">
          <section className="card">
            <h3 style={{marginTop:0}}>🔐 1. Cipher task</h3>
            <p className="muted">Encrypted message only:</p>
            <div className="statusline"><code>Zdwfk rxw, Crol pljkw eh d vhfuhw djhqw.</code></div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>🧩 2. Distorted system log</h3>
            <div className="console float-soft" aria-label="System log">
              <span className="line"><span className="ts">2025-11-21 09:02:14</span> <span className="lvl info">INFO</span>  <span className="kv">SessionID=Nd0f94be7ac21f44f...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:17</span> <span className="lvl warn">WARN</span>  <span className="kv">PayloadHash=Y57ac90b32df1a...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:20</span> <span className="lvl info">INFO</span>  <span className="kv">LoginToken=Oaa12f8c0bffe942...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:24</span> <span className="lvl error">ERROR</span> <span className="kv">ReqHash=Mc21f9ee8b1127c3...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:28</span> <span className="lvl info">INFO</span>  <span className="kv">OutID=Od991e0bc113fe0...</span></span>
              <span className="line"><span className="ts">2025-11-21 09:02:32</span> <span className="lvl alert">ALERT</span> <span className="kv">KeyRef=Kb019aaef9e13cc1...</span></span>
            </div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>💌 3. Encrypted letter</h3>
            <div className="card" style={{background:'#0b121c', borderColor:'rgba(207,230,255,0.12)'}}>
              <p className="muted" style={{whiteSpace:'pre-line', margin:0}}>
Dear stranger!

I was supposed to meet you at the café at eight o'clock today,
but in three moments time slipped away.

Every minute I think of you,
and seven steps away I feel your closeness.

First come the moments that live most strongly within me.
Then comes the feeling that first moved my heart.
The next signs hide in the tremors of the space stretched between us.
Finally, a single fleeting minute draws the full picture of the story.

Best regards, S.</p>
            </div>
          </section>
          <section className="card">
            <h3 style={{marginTop:0}}>🔎 4. Coded letters</h3>
            <div className="ws-board">
              <div id="wsGridArchive" className="ws-grid"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

