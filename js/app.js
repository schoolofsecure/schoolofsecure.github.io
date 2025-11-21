/* Lightweight dynamic assembler – loads header/footer/blocks and page JSON.
   NOTE: This is the source; production should use minified+obfuscated bundle. */
(function(){
  async function fetchText(url){
    const r = await fetch(url, { cache: 'no-store' });
    if(!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
    return await r.text();
  }
  async function fetchJSON(url){
    const r = await fetch(url, { cache: 'no-store' });
    if(!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
    return await r.json();
  }
  function routeKey(){
    const p = (location.pathname || '/').replace(/^\//,'');
    return p || 'index.html';
  }
  async function loadPartials(){
    const header = await fetchText('/partials/header.html').catch(()=>'<header></header>');
    const footer = await fetchText('/partials/footer.html').catch(()=>'<footer></footer>');
    return { header, footer };
  }
  async function assemble(){
    const app = document.getElementById('app');
    if(!app){ console.warn('No #app root'); return; }
    const { header, footer } = await loadPartials();
    const routes = await fetchJSON('/data/routes.json');
    const pages = await fetchJSON('/data/pages.json');
    const rk = routeKey();
    const pageKey = (routes.routes && routes.routes[rk]) || 'landing';
    const page = pages[pageKey] || { blocks: [] };
    const blocksHTML = [];
    for(const blk of page.blocks){
      if(blk.type === 'partial' && blk.path){
        try {
          blocksHTML.push(await fetchText(blk.path));
        } catch(e){
          blocksHTML.push(`<!-- missing: ${blk.path} -->`);
        }
      }
    }
    app.innerHTML = `
      <div class="container">
        ${header}
        <main>
          ${blocksHTML.join('\n')}
        </main>
        ${footer}
      </div>
    `;
    // Page-specific hydration
    if(pageKey === 'aurora'){
      try { await hydrateAurora(); } catch(e){ console.error('Aurora hydrate error', e); }
    }
  }
  async function hydrateAurora(){
    const data = await fetchJSON('/data/aurora.json');
    // Gate texts
    const gate = data.gate || {};
    const gateEl = document.getElementById('gate');
    const FORM = document.getElementById('gateForm');
    const INPUT = document.getElementById('pass');
    const ERR = document.getElementById('err');
    const CONTENT = document.querySelector('main');
    // Basic styles fallback
    if(CONTENT){ CONTENT.style.filter = 'blur(6px)'; CONTENT.style.pointerEvents='none'; CONTENT.style.userSelect='none'; }
    if(document.getElementById('gateTitle')) document.getElementById('gateTitle').textContent = gate.title || 'Belépés szükséges';
    if(document.getElementById('gateDesc')) document.getElementById('gateDesc').textContent = gate.desc || '';
    if(document.getElementById('gateHint')) document.getElementById('gateHint').textContent = gate.hint || '';
    if(INPUT) INPUT.placeholder = gate.placeholder || 'Belépési kulcs';
    function unlock(){
      if(gateEl) gateEl.style.display = 'none';
      if(CONTENT){ CONTENT.style.filter='none'; CONTENT.style.pointerEvents='auto'; CONTENT.style.userSelect='auto'; }
      try { sessionStorage.setItem('cm_lvl1_unlocked','1'); } catch(e){}
      // Show mission by default; levels hidden until entry ok
      showEl('introPanel', true);
      showEl('levelsPanel', false);
      setupMission(data);
    }
    function showEl(id, vis){
      const el = document.getElementById(id);
      if(el) el.style.display = vis ? '' : 'none';
    }
    try { if(sessionStorage.getItem('cm_lvl1_unlocked') === '1'){ unlock(); } } catch(e){}
    if(FORM){
      FORM.addEventListener('submit', (e)=>{
        e.preventDefault();
        const v = (INPUT.value||'').trim();
        if(!v){ if(ERR) ERR.textContent = 'Írj be a belépési kulcsot.'; INPUT && INPUT.focus(); return; }
        if(v === (gate.pass || '')){ unlock(); } else { if(ERR) ERR.textContent = 'Helytelen kulcs. Próbáld újra.'; INPUT && INPUT.focus(); }
      });
    }
    // Levels titles
    const levels = data.levels || {};
    if(document.getElementById('levelsTitle')) document.getElementById('levelsTitle').textContent = levels.title || '';
    if(document.getElementById('levelsDesc')) document.getElementById('levelsDesc').textContent = levels.desc || '';
    const grid = document.getElementById('levelsGrid');
    if(grid && Array.isArray(levels.cards)){
      grid.innerHTML = '';
      levels.cards.forEach(card=>{
        const a = document.createElement(card.locked ? 'div' : 'a');
        if(!card.locked){ a.href = card.href || '#'; a.className = 'level-card'; a.style.textDecoration='none'; }
        else { a.className = 'level-card'; a.setAttribute('aria-disabled','true'); }
        a.innerHTML = `
          <span class="level-label">Ügy #${card.n}</span>
          <img src="${card.img}" alt="Ügy ${card.n}" loading="lazy" />
          <div class="case-title">${card.title}</div>
          ${card.locked ? '<span class="coming" aria-label="Zárolt">🔒</span>' : ''}
        `;
        grid.appendChild(a);
      });
    }
    function setupMission(d){
      const m = d.mission || {};
      const setText = (id, t)=>{ const el = document.getElementById(id); if(el) el.textContent = t || ''; };
      setText('introBadge', d.intro?.badge);
      setText('introTitle', d.intro?.title);
      setText('introLead', d.intro?.lead);
      const chips = document.getElementById('introChips');
      if(chips){ chips.innerHTML = (d.intro?.chips||[]).map(c=>`<span class="chip">${c}</span>`).join(''); }
      const startBtn = document.getElementById('startQuizBtn'); if(startBtn) startBtn.textContent = d.intro?.start || 'Kezdés';
      setText('missionBadge', m.badge);
      setText('missionTitle', m.title);
      setText('missionNarr1', m.narr1);
      setText('missionNarr2', m.narr2);
      setText('missionPaneLeftTitle', m.leftTitle);
      const puzzleHTML = document.getElementById('missionPuzzleHTML'); if(puzzleHTML) puzzleHTML.innerHTML = m.puzzleHTML || '';
      const entryStatus = document.getElementById('entryStatus'); if(entryStatus) entryStatus.textContent = m.statusReady || '';
      setText('missionPaneRightTitle', m.rightTitle);
      const entryInput = document.getElementById('entryInput'); if(entryInput) entryInput.placeholder = m.inputPlaceholder || '';
      setText('missionHintTitle', m.hintTitle);
      setText('missionHintText', m.hintText);
      const hintChips = document.getElementById('missionHintChips'); if(hintChips) hintChips.innerHTML = (m.hintChips||[]).map(c=>`<span class="cm-chip">${c}</span>`).join('');
      const entryBtn = document.getElementById('entryBtn');
      function setEntryStatus(ok, text){
        if(!entryStatus) return;
        entryStatus.classList.remove('status-ok','status-err');
        entryStatus.classList.add(ok ? 'status-ok' : 'status-err');
        entryStatus.textContent = text;
      }
      function doneEntry(){
        try { sessionStorage.setItem('cm_lvl1_entry_ok','1'); } catch(e){}
        setEntryStatus(true, m.statusOk || '');
        const code = document.getElementById('entryCode'); if(code){ code.textContent='ACCESS‑LEVEL: NOVICE-01'; code.classList.add('neon-flicker'); }
        showEl('introPanel', false);
        showEl('levelsPanel', true);
      }
      function handleEntry(){
        const allowed = /^[A-Za-z0-9-]+$/;
        const v = (entryInput?.value || '').trim();
        if(!v){ setEntryStatus(false, m.statusErrEmpty || ''); return; }
        if(!allowed.test(v)){ setEntryStatus(false, m.statusErrChars || ''); return; }
        if(v.toUpperCase() === (m.expected || '').toUpperCase()){ doneEntry(); } else { setEntryStatus(false, m.statusErrWrong || ''); }
      }
      if(entryBtn) entryBtn.addEventListener('click', handleEntry);
      if(entryInput) entryInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleEntry(); } });
    }
  }
  window.addEventListener('DOMContentLoaded', assemble);
})();


