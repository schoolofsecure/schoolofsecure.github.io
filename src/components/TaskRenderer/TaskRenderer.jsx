import React, { useState } from 'react'
import ChallengeInput from '../Ugy1/ChallengeInput'

/**
 * Univerzális Task renderer komponens, ami a dinamikusan generált feladatokat jeleníti meg.
 * A Task objektum type mezője alapján választja ki a megfelelő renderelési módot.
 */
const TaskRenderer = ({ task, onSuccess, onFailure }) => {
  if (!task || !task.payload) {
    return <div className="card"><p className="muted">Feladat betöltése...</p></div>
  }

  const { type, payload, solution } = task

  switch (type) {
    case 'CAESAR':
      return <CaesarTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    case 'VIGENERE':
      return <VigenereTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    case 'PHISHING':
      return <PhishingTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    case 'LOG_ANALYSIS':
      return <LogAnalysisTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    case 'ICON_MEMORY':
      return <IconMemoryTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    case 'XOR':
    case 'HASH_MISMATCH':
    case 'PASSWORD_STRENGTH':
    case 'URL_TRUST':
    case 'SOCIAL_ENGINEERING':
    case 'FIREWALL':
    case 'MISCONFIG':
    case 'RISKY_PERMISSION':
    case 'SECURITY_DECISION':
    case 'CRYPTO_PUZZLE':
    case 'PSEUDOCODE_BUG':
    case 'NETWORK_ANOMALY':
    case 'EMAIL_HEADER':
    case 'ATTACK_SCENARIO':
    case 'ZERO_DAY':
      // Alapértelmezett renderelés szöveges inputtal
      return <DefaultTaskRenderer task={task} payload={payload} onSuccess={onSuccess} onFailure={onFailure} />
    
    default:
      return <div className="card"><p className="muted">Ismeretlen feladattípus: {type}</p></div>
  }
}

// Caesar Task Renderer
const CaesarTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const handleCheck = (value, normalize) => {
    const isValid = task.validate(value)
    setFeedback(isValid ? 'ok' : 'err')
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
    return isValid
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Rejtjel</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        <div className="statusline">
          <code style={{fontSize:'16px', letterSpacing:'2px', wordBreak:'break-all'}}>
            {payload.ciphertext}
          </code>
        </div>
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Válasz</h3>
        <ChallengeInput
          placeholder="dekódolt üzenet…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Vigenère Task Renderer
const VigenereTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [solved, setSolved] = useState(false)

  const handleCheck = (value, normalize) => {
    const isValid = task.validate(value)
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
    return isValid
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Titkosított üzenet</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        <div className="statusline">
          <code style={{fontSize:'16px', letterSpacing:'2px', wordBreak:'break-all'}}>
            {payload.ciphertext}
          </code>
        </div>
        {payload.key && (
          <p className="muted" style={{marginTop:'8px', fontSize:'13px'}}>
            Kulcs: <code>{payload.key}</code>
          </p>
        )}
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Válasz</h3>
        <ChallengeInput
          placeholder="dekódolt üzenet…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Phishing Task Renderer
const PhishingTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedIds)
    setFeedback(isValid ? 'ok' : 'err')
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Email elemzés</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Gyanús elemek</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px'}}>
          {payload.elements?.map((element) => (
            <label
              key={element.id}
              style={{
                display:'flex',
                alignItems:'center',
                gap:'10px',
                padding:'10px',
                borderRadius:'8px',
                border:'1px solid rgba(207,230,255,0.2)',
                cursor:'pointer',
                backgroundColor: selectedIds.includes(element.id) 
                  ? 'rgba(0,229,255,0.1)' 
                  : 'transparent',
                transition:'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(element.id)}
                onChange={() => toggleSelection(element.id)}
                style={{cursor:'pointer'}}
              />
              <span style={{flex:1, fontSize:'14px'}}>{element.text}</span>
            </label>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{marginBottom:'12px'}}>
            {feedback === 'ok' 
              ? 'Helyes! Minden gyanús elem azonosítva.' 
              : 'Nem stimmel minden jelölés. Gondold végig, melyik mező tényleg gyanús.'}
          </div>
        )}
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            {solved ? 'Feladat teljesítve' : 'Ellenőrzés'}
          </button>
          {!solved && (
            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                setSelectedIds([])
                setFeedback(null)
              }}
            >
              Jelölések törlése
            </button>
          )}
        </div>
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Log Analysis Task Renderer
const LogAnalysisTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [selectedRows, setSelectedRows] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const toggleRow = (index) => {
    setSelectedRows(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedRows)
    setFeedback(isValid ? 'ok' : 'err')
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Rendszerlog elemzés</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Log sorok</h3>
        <div style={{overflowX:'auto', marginBottom:'16px'}}>
          <table style={{width:'100%', borderCollapse:'separate', borderSpacing:'0 4px', fontSize:'12px'}}>
            <thead>
              <tr style={{color:'#94a3b8', fontSize:'11px'}}>
                <th style={{textAlign:'left', padding:'4px'}}>Időbélyeg</th>
                <th style={{textAlign:'left', padding:'4px'}}>Felhasználó</th>
                <th style={{textAlign:'left', padding:'4px'}}>Művelet</th>
                <th style={{textAlign:'left', padding:'4px'}}>IP</th>
                <th style={{textAlign:'left', padding:'4px'}}>Státusz</th>
              </tr>
            </thead>
            <tbody>
              {payload.rows?.map((row, index) => (
                <tr
                  key={index}
                  onClick={() => toggleRow(index)}
                  style={{
                    cursor:'pointer',
                    backgroundColor: selectedRows.includes(index)
                      ? 'rgba(0,229,255,0.15)'
                      : 'transparent',
                    transition:'background-color 0.2s'
                  }}
                >
                  <td style={{padding:'6px', fontFamily:'monospace'}}>{row.timestamp}</td>
                  <td style={{padding:'6px'}}>{row.user}</td>
                  <td style={{padding:'6px'}}>{row.action}</td>
                  <td style={{padding:'6px', fontFamily:'monospace'}}>{row.ip}</td>
                  <td style={{padding:'6px', color:row.status === 'FAIL' ? '#ff6b6b' : '#51cf66'}}>
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{marginBottom:'12px'}}>
            {feedback === 'ok' 
              ? 'Helyes! Minden gyanús sor azonosítva.' 
              : 'Nem stimmel minden jelölés. Gondold végig, melyik sor tényleg gyanús.'}
          </div>
        )}
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            {solved ? 'Feladat teljesítve' : 'Ellenőrzés'}
          </button>
          {!solved && (
            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                setSelectedRows([])
                setFeedback(null)
              }}
            >
              Jelölések törlése
            </button>
          )}
        </div>
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Icon Memory Task Renderer
const IconMemoryTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedIds)
    setFeedback(isValid ? 'ok' : 'err')
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Memória ikon puzzle</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Ikonok</h3>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(120px, 1fr))',
          gap:'12px',
          marginBottom:'16px'
        }}>
          {payload.icons?.map((icon) => (
            <button
              key={icon.id}
              type="button"
              onClick={() => toggleSelection(icon.id)}
              style={{
                padding:'16px',
                borderRadius:'8px',
                border:'2px solid',
                borderColor: selectedIds.includes(icon.id)
                  ? '#00e5ff'
                  : 'rgba(207,230,255,0.3)',
                backgroundColor: selectedIds.includes(icon.id)
                  ? 'rgba(0,229,255,0.1)'
                  : 'transparent',
                cursor:'pointer',
                transition:'all 0.2s',
                fontSize:'32px'
              }}
            >
              <div style={{fontSize:'32px', marginBottom:'4px'}}>
                {icon.type === 'threat' ? '⚠️' : icon.type === 'safe' ? '🔒' : '📧'}
              </div>
              <div style={{fontSize:'11px', color:'var(--muted)'}}>{icon.label}</div>
            </button>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{marginBottom:'12px'}}>
            {feedback === 'ok' 
              ? 'Helyes! Minden veszélyes ikon azonosítva.' 
              : 'Nem stimmel minden jelölés. Gondold végig, melyik ikon jelenti a kockázatot.'}
          </div>
        )}
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            {solved ? 'Feladat teljesítve' : 'Ellenőrzés'}
          </button>
          {!solved && (
            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                setSelectedIds([])
                setFeedback(null)
              }}
            >
              Jelölések törlése
            </button>
          )}
        </div>
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Default Task Renderer (szöveges input)
const DefaultTaskRenderer = ({ task, payload, onSuccess, onFailure }) => {
  const [solved, setSolved] = useState(false)

  const handleCheck = (value, normalize) => {
    const isValid = task.validate(value)
    if (isValid) {
      setSolved(true)
      onSuccess?.()
    } else {
      onFailure?.()
    }
    return isValid
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        <h3>Feladat</h3>
        {payload.intro && <p className="muted">{payload.intro}</p>}
        <p className="muted">{payload.instructions}</p>
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Válasz</h3>
        <ChallengeInput
          placeholder="válasz…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
        {!solved && (
          <div style={{marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(207,230,255,0.2)', display:'flex', gap:'8px', flexWrap:'wrap'}}>
            <button 
              className="btn-ghost" 
              onClick={handleDevSkip}
              style={{fontSize:'13px', padding:'8px 14px', cursor:'pointer', fontWeight:600, borderColor:'rgba(0,229,255,0.4)'}}
              title="Fejlesztői mód: feladat megoldása és következő"
            >
              ✅ Megoldás + Következő
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskRenderer

