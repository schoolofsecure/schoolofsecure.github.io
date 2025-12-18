import React, { useState, useEffect } from 'react'
import ChallengeInput from '../Ugy1/ChallengeInput'
import { PerfImg } from '../PerfImg'

/**
 * Univerzális Task renderer komponens, ami a dinamikusan generált feladatokat jeleníti meg.
 * A Task objektum type mezője alapján választja ki a megfelelő renderelési módot.
 */
const TaskRenderer = ({ task, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  if (!task || !task.payload) {
    return <div className="card"><p className="muted">Feladat betöltése...</p></div>
  }

  const { type, payload, solution } = task

  switch (type) {
    case 'CAESAR':
      return <CaesarTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'VIGENERE':
      return <VigenereTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'PHISHING':
      return <PhishingTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'LOG_ANALYSIS':
      return <LogAnalysisTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'ICON_MEMORY':
      return <IconMemoryTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'PASSWORD_STRENGTH':
      return <PasswordStrengthTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'XOR':
    case 'HASH_MISMATCH':
    case 'SOCIAL_ENGINEERING':
      return <SocialEngineeringTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'FIREWALL':
      return <FirewallTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'MISCONFIG':
      return <MisconfigTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'NETWORK_ANOMALY':
      return <NetworkAnomalyTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'EMAIL_HEADER':
      return <EmailHeaderTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'URL_TRUST':
      return <UrlTrustTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'RISKY_PERMISSION':
      return <RiskyPermissionTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'SECURITY_DECISION':
      return <SecurityDecisionTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    case 'CRYPTO_PUZZLE':
    case 'PSEUDOCODE_BUG':
    case 'ATTACK_SCENARIO':
    case 'ZERO_DAY':
      // Alapértelmezett renderelés szöveges inputtal
      return <DefaultTaskRenderer task={task} payload={payload} taskStory={taskStory} taskLabel={taskLabel} onSuccess={onSuccess} onFailure={onFailure} imageSrc={imageSrc} showDevSkip={showDevSkip} />
    
    default:
      return <div className="card"><p className="muted">Ismeretlen feladattípus: {type}</p></div>
  }
}

const HintDetails = ({ text }) => {
  if (!text) return null
  return (
    <div className="hint" style={{ marginTop: '12px' }}>
      <details>
        <summary>Súgó megnyitása</summary>
        <p className="muted" style={{ margin: '8px 0 0' }}>{text}</p>
      </details>
    </div>
  )
}

const DevSkipButton = ({ onSkip, disabled }) => (
  <button
    className="btn-ghost"
    type="button"
    onClick={onSkip}
    disabled={disabled}
    style={{ fontSize: '11px', padding: '4px 8px', opacity: 0.6, borderColor: 'rgba(207,230,255,0.1)', color: 'var(--muted)' }}
    title="Fejlesztői mód: feladat kihagyása"
  >
    ⏭️ Skip
  </button>
)

// Közös wrapper a bal oldali részhez
const TaskLeftSide = ({ taskLabel, taskStory, payload, children }) => (
  <div className="card">
    {taskLabel && <h3>{taskLabel}</h3>}
    {taskStory && (
      <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
        {taskStory.text}
      </p>
    )}
    {!taskStory && payload?.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
    {payload?.instructions && (
      <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>
        {payload.instructions}
      </p>
    )}
    {children}
  </div>
)

// Közös wrapper a jobb oldali részhez
const TaskRightSide = ({ title, imageSrc, hint, children, devSkip, showDevSkip = false }) => (
  <div className="card">
    {title && <h3>{title}</h3>}
    {children}
    {devSkip && showDevSkip && (
      <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
        {devSkip}
      </div>
    )}
    {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
    <HintDetails text={hint} />
  </div>
)

// Caesar Task Renderer
const CaesarTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [solved, setSolved] = useState(false)
  const handleCheck = (value) => task.validate(value)
  const handleDevSkip = () => { setSolved(true); onSuccess?.() }

  return (
    <div className="grid2">
      <TaskLeftSide taskLabel={taskLabel} taskStory={taskStory} payload={payload}>
        <div className="statusline">
          <code style={{fontSize:'16px', letterSpacing:'2px', wordBreak:'break-all'}}>{payload.ciphertext}</code>
        </div>
      </TaskLeftSide>
      <TaskRightSide title="Válasz" imageSrc={imageSrc} hint={payload.hint} devSkip={<DevSkipButton onSkip={handleDevSkip} disabled={solved} />} showDevSkip={showDevSkip}>
        <ChallengeInput
          key={task?.id || 'caesar'}
          placeholder="dekódolt üzenet…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </TaskRightSide>
    </div>
  )
}

// Vigenère Task Renderer
const VigenereTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [solved, setSolved] = useState(false)
  const handleCheck = (value) => task.validate(value)
  const handleDevSkip = () => { setSolved(true); onSuccess?.() }

  return (
    <div className="grid2">
      <TaskLeftSide taskLabel={taskLabel} taskStory={taskStory} payload={payload}>
        <div className="statusline">
          <code style={{fontSize:'16px', letterSpacing:'2px', wordBreak:'break-all'}}>{payload.ciphertext}</code>
        </div>
        {payload.key && <p className="muted" style={{marginTop:'8px', fontSize:'13px'}}>Kulcs: <code>{payload.key}</code></p>}
      </TaskLeftSide>
      <TaskRightSide title="Válasz" imageSrc={imageSrc} hint={payload.hint} devSkip={<DevSkipButton onSkip={handleDevSkip} disabled={solved} />} showDevSkip={showDevSkip}>
        <ChallengeInput
          key={task?.id || 'vigenere'}
          placeholder="dekódolt üzenet…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
      </TaskRightSide>
    </div>
  )
}

// Phishing Task Renderer
const PhishingTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
        {payload.email && (
          <div className="statusline" style={{ marginTop: '16px', padding: '16px', background: '#0b121c', borderRadius: '8px', border: '1px solid rgba(207,230,255,0.2)' }}>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(207,230,255,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Feladó:</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                {payload.email.fromName} &lt;{payload.email.from}&gt;
              </div>
            </div>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(207,230,255,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Tárgy:</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{payload.email.subject}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>Üzenet:</div>
              <div style={{ fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#cfe6ff' }}>
                {payload.email.body}
              </div>
            </div>
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
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Log Analysis Task Renderer
const LogAnalysisTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
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
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
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
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Icon Memory Task Renderer
const IconMemoryTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
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
        <div style={{display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center'}}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
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
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Social Engineering Task Renderer
const SocialEngineeringTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [choices, setChoices] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const handleSelect = (scenarioId, actionId) => {
    setChoices(prev => ({ ...prev, [scenarioId]: actionId }))
    setFeedback(null)
  }

  const handleSubmit = () => {
    if (!payload.scenarios || payload.scenarios.length === 0) return
    const answers = payload.scenarios.map(sc => choices[sc.id] ?? null)
    if (answers.some(ans => !ans)) {
      setFeedback('missing')
      return
    }
    const isValid = task.validate(answers)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
      </div>
      <div className="card">
        <h3>Válaszok</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payload.scenarios?.map((scenario, idx) => (
            <div key={scenario.id} className="card" style={{ background: '#050a12', borderColor: 'rgba(207,230,255,0.15)' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>{idx + 1}. {scenario.title}</strong>
              </div>
              <p className="muted" style={{ marginTop: '4px' }}>{scenario.text}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                {scenario.actions?.map(action => (
                  <button
                    key={action.id}
                    type="button"
                    className={choices[scenario.id] === action.id ? 'btn' : 'btn-ghost'}
                    onClick={() => handleSelect(scenario.id, action.id)}
                    style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {feedback === 'missing' && (
          <div className="feedback err" style={{ margin: '12px 0' }}>
            Minden helyzethez válassz reakciót az ellenőrzés előtt.
          </div>
        )}
        {feedback && feedback !== 'missing' && (
          <div className={`feedback ${feedback}`} style={{ margin: '12px 0' }}>
            {feedback === 'ok'
              ? 'Megfelelően reagáltál minden szituációban.'
              : 'Nem minden reakció felelt meg a protokollnak. Gondold át újra a lépéseket.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Firewall Task Renderer
const FirewallTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [rules, setRules] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const services = React.useMemo(() => {
    const map = new Map()
    const list = [...(payload.requiredServices || []), ...(payload.blockedServices || [])]
    list.forEach(service => {
      const key = `${service.proto}:${service.port}`
      if (!map.has(key)) {
        map.set(key, service)
      }
    })
    return Array.from(map.entries())
  }, [payload.requiredServices, payload.blockedServices])

  useEffect(() => {
    const initial = {}
    services.forEach(([key]) => { initial[key] = null })
    setRules(initial)
    setFeedback(null)
    setSolved(false)
  }, [services])

  const updateRule = (key, action) => {
    setRules(prev => ({ ...prev, [key]: prev[key] === action ? null : action }))
    setFeedback(null)
  }

  const handleSubmit = () => {
    const allow = []
    const deny = []
    Object.entries(rules).forEach(([key, action]) => {
      if (action === 'allow') allow.push(key)
      if (action === 'deny') deny.push(key)
    })
    const isValid = task.validate({ allow, deny })
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <>
            <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
              {taskStory.text}
            </p>
          </>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
      </div>
      <div className="card">
        <h3>Szolgáltatások</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map(([key, service]) => (
            <div
              key={key}
              style={{
                padding: '10px',
                border: '1px solid rgba(207,230,255,0.2)',
                borderRadius: '8px',
                background: 'rgba(5,10,18,0.85)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{service.name}</strong>
                  <div className="muted" style={{ fontSize: '11px' }}>
                    {service.proto} / {service.port}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className={rules[key] === 'allow' ? 'btn' : 'btn-ghost'}
                    onClick={() => updateRule(key, 'allow')}
                  >
                    Engedélyez
                  </button>
                  <button
                    type="button"
                    className={rules[key] === 'deny' ? 'btn' : 'btn-ghost'}
                    onClick={() => updateRule(key, 'deny')}
                  >
                    Tilt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ margin: '12px 0' }}>
            {feedback === 'ok'
              ? 'Helyes szabályok! A forgalom a megfelelő irányban engedélyezett.'
              : 'Nem stimmel. Ellenőrizd, mely szolgáltatásoknak kell menniük és melyeket kell zárni.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Security Decision Task Renderer
const SecurityDecisionTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [answers, setAnswers] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    setAnswers(Array(payload.scenarios?.length || 0).fill(null))
    setFeedback(null)
    setSolved(false)
  }, [payload.scenarios])

  const selectAnswer = (index, optionIndex) => {
    setAnswers(prev => {
      const copy = prev.slice()
      copy[index] = optionIndex
      return copy
    })
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(answers)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        <p className="muted" style={{ marginTop: taskStory ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
      </div>
      <div className="card">
        <h3>Döntési helyzetek</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payload.scenarios?.map((scenario, scenarioIndex) => (
            <div key={scenarioIndex} style={{ padding: '12px', border: '1px solid rgba(207,230,255,0.2)', borderRadius: '8px' }}>
              <strong style={{ display: 'block', marginBottom: '6px' }}>{scenario.title || `${scenarioIndex + 1}. helyzet`}</strong>
              <p className="muted" style={{ marginBottom: '10px', whiteSpace: 'pre-line' }}>{scenario.scenario || scenario.text}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {scenario.options?.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: answers[scenarioIndex] === optionIndex ? '#00e5ff' : 'rgba(207,230,255,0.2)',
                      backgroundColor: answers[scenarioIndex] === optionIndex ? 'rgba(0,229,255,0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name={`scenario-${scenarioIndex}`}
                      checked={answers[scenarioIndex] === optionIndex}
                      onChange={() => selectAnswer(scenarioIndex, optionIndex)}
                      style={{ marginRight: '8px' }}
                    />
                    {typeof option === 'string' ? option : option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ margin: '12px 0' }}>
            {feedback === 'ok'
              ? 'Helyes döntések! A helyzetet megfelelően dokumentáltad.'
              : 'Nem minden döntés felel meg a protokollnak. Gondold át, milyen bizonyíték kell a jegyzőkönyvbe.'}
          </div>
        )}
        {payload.hint && <HintDetails text={payload.hint} />}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: payload.hint ? '12px' : '0', alignItems:'center' }}>
          <button
            className="btn"
            type="button"
            onClick={handleSubmit}
            disabled={solved || answers.some(ans => ans === null)}
          >
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
      </div>
    </div>
  )
}

// Password Strength Task Renderer
const PasswordStrengthTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const handleSubmit = () => {
    const isValid = task.validate(selectedAnswer)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <div className="statusline" style={{ marginTop: '12px', padding: '12px', background: '#0b121c', borderRadius: '8px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Jelszó:</strong>
          </div>
          <code style={{ fontSize: '16px', letterSpacing: '2px', wordBreak: 'break-all' }}>
            {payload.candidate}
          </code>
        </div>
        {payload.requirements && (
          <div style={{ marginTop: '12px' }}>
            <strong style={{ fontSize: '14px' }}>Követelmények:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0, fontSize: '13px' }}>
              {payload.requirements.map((req, idx) => (
                <li key={idx} style={{ marginBottom: '4px', color: 'var(--muted)' }}>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Válasz</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid',
              borderColor: selectedAnswer === true ? '#00e5ff' : 'rgba(207,230,255,0.3)',
              backgroundColor: selectedAnswer === true ? 'rgba(0,229,255,0.1)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => {
              setSelectedAnswer(true)
              setFeedback(null)
            }}
          >
            <input
              type="radio"
              name="password-strength"
              checked={selectedAnswer === true}
              onChange={() => {
                setSelectedAnswer(true)
                setFeedback(null)
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Megfelel a követelményeknek</span>
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid',
              borderColor: selectedAnswer === false ? '#00e5ff' : 'rgba(207,230,255,0.3)',
              backgroundColor: selectedAnswer === false ? 'rgba(0,229,255,0.1)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => {
              setSelectedAnswer(false)
              setFeedback(null)
            }}
          >
            <input
              type="radio"
              name="password-strength"
              checked={selectedAnswer === false}
              onChange={() => {
                setSelectedAnswer(false)
                setFeedback(null)
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Nem felel meg a követelményeknek</span>
          </label>
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! A jelszó értékelése stimmel.'
              : 'Nem stimmel. Gondold végig, mely követelmények teljesülnek és melyek nem.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={selectedAnswer === null || solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Misconfig Task Renderer
const MisconfigTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [selectedLines, setSelectedLines] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const toggleLine = (lineNumber) => {
    setSelectedLines(prev => 
      prev.includes(lineNumber)
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedLines)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        <p className="muted" style={{ marginTop: (taskStory ? '12px' : (taskLabel ? '8px' : '0')) }}>{payload.instructions || ''}</p>
      </div>
      <div className="card">
        <h3>Konfiguráció</h3>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#0b121c', borderRadius: '8px', border: '1px solid rgba(207,230,255,0.2)' }}>
          <pre style={{ margin: 0, fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {payload.lines?.map((line, idx) => (
              <div
                key={idx}
                onClick={() => toggleLine(line.lineNumber)}
                style={{
                  cursor: 'pointer',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  backgroundColor: selectedLines.includes(line.lineNumber) ? 'rgba(0,229,255,0.2)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <span style={{ color: 'var(--muted)', marginRight: '8px' }}>{line.lineNumber}:</span>
                <span>{line.text}</span>
              </div>
            ))}
          </pre>
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! Minden hibás sor azonosítva.'
              : 'Nem stimmel. Gondold végig, mely sorok tartalmazzák a hibás beállításokat.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Network Anomaly Task Renderer
const NetworkAnomalyTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {payload.instructions && (
          <p className="muted" style={{ marginTop: (taskStory ? '12px' : (taskLabel ? '8px' : '0')) }}>{payload.instructions}</p>
        )}
      </div>
      <div className="card">
        <h3>Hálózati forgalom</h3>
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 4px', fontSize: '12px' }}>
            <thead>
              <tr style={{ color: '#94a3b8', fontSize: '11px' }}>
                <th style={{ textAlign: 'left', padding: '4px' }}>Forrás</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>Cél</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>Port</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>Protokoll</th>
                <th style={{ textAlign: 'left', padding: '4px' }}>Bájt</th>
              </tr>
            </thead>
            <tbody>
              {payload.flows?.map((flow, index) => (
                <tr
                  key={index}
                  onClick={() => toggleRow(index)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedRows.includes(index)
                      ? 'rgba(0,229,255,0.15)'
                      : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <td style={{ padding: '6px', fontFamily: 'monospace' }}>{flow.source}</td>
                  <td style={{ padding: '6px', fontFamily: 'monospace' }}>{flow.destination}</td>
                  <td style={{ padding: '6px' }}>{flow.port}</td>
                  <td style={{ padding: '6px' }}>{flow.protocol}</td>
                  <td style={{ padding: '6px', fontFamily: 'monospace' }}>{flow.bytes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! Minden anomália azonosítva.'
              : 'Nem stimmel. Gondold végig, mely forgalmi sorok jelentenek anomáliát.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Email Header Task Renderer
const EmailHeaderTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [selectedIssues, setSelectedIssues] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const issueOptions = [
    { id: 'spf', label: 'SPF hiba' },
    { id: 'dkim', label: 'DKIM hiba' },
    { id: 'received-0', label: 'Gyanús Received sor (első)' },
    { id: 'received-1', label: 'Gyanús Received sor (második)' }
  ]

  const toggleIssue = (issueId) => {
    setSelectedIssues(prev => 
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedIssues)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {payload.instructions && (
          <p className="muted" style={{ marginTop: (taskStory ? '12px' : (taskLabel ? '8px' : '0')) }}>{payload.instructions}</p>
        )}
        {payload.header && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#0b121c', borderRadius: '8px', border: '1px solid rgba(207,230,255,0.2)' }}>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(207,230,255,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Feladó:</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{payload.header.from}</div>
            </div>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(207,230,255,0.1)' }}>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Received:</div>
              {payload.header.received?.map((rec, idx) => (
                <div key={idx} style={{ fontSize: '12px', fontFamily: 'monospace', marginTop: '4px' }}>
                  {rec}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>SPF: <span style={{ color: payload.header.spf === 'pass' ? '#51cf66' : '#ff6b6b' }}>{payload.header.spf}</span></div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>DKIM: <span style={{ color: payload.header.dkim === 'pass' ? '#51cf66' : '#ff6b6b' }}>{payload.header.dkim}</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="card">
        <h3>Gyanús jelek</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {issueOptions.map(option => (
            <label
              key={option.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(207,230,255,0.2)',
                cursor: 'pointer',
                backgroundColor: selectedIssues.includes(option.id)
                  ? 'rgba(0,229,255,0.1)'
                  : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={selectedIssues.includes(option.id)}
                onChange={() => toggleIssue(option.id)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ flex: 1, fontSize: '14px' }}>{option.label}</span>
            </label>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! Minden gyanús jel azonosítva.'
              : 'Nem stimmel. Gondold végig, mely jelek jelentenek problémát.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// URL Trust Task Renderer
const UrlTrustTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [selectedUrls, setSelectedUrls] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const toggleUrl = (index) => {
    setSelectedUrls(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedUrls)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {payload.instructions && (
          <p className="muted" style={{ marginTop: (taskStory ? '12px' : (taskLabel ? '8px' : '0')) }}>{payload.instructions}</p>
        )}
      </div>
      <div className="card">
        <h3>URL-ek</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {payload.urls?.map((url, index) => (
            <label
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(207,230,255,0.2)',
                cursor: 'pointer',
                backgroundColor: selectedUrls.includes(index)
                  ? 'rgba(0,229,255,0.1)'
                  : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={selectedUrls.includes(index)}
                onChange={() => toggleUrl(index)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ flex: 1, fontSize: '14px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{url}</span>
            </label>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! Minden gyanús URL azonosítva.'
              : 'Nem stimmel. Gondold végig, mely URL-ek gyanúsak vagy hamisak.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Risky Permission Task Renderer
const RiskyPermissionTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [selectedPerms, setSelectedPerms] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [solved, setSolved] = useState(false)

  const togglePerm = (permId) => {
    setSelectedPerms(prev => 
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    )
    setFeedback(null)
  }

  const handleSubmit = () => {
    const isValid = task.validate(selectedPerms)
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
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {payload.instructions && (
          <p className="muted" style={{ marginTop: (taskStory ? '12px' : (taskLabel ? '8px' : '0')) }}>{payload.instructions}</p>
        )}
      </div>
      <div className="card">
        <h3>Engedélyek</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {payload.permissions?.map((perm) => (
            <label
              key={perm.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(207,230,255,0.2)',
                cursor: 'pointer',
                backgroundColor: selectedPerms.includes(perm.id)
                  ? 'rgba(0,229,255,0.1)'
                  : 'transparent',
                transition: 'background-color 0.2s'
              }}
            >
              <input
                type="checkbox"
                checked={selectedPerms.includes(perm.id)}
                onChange={() => togglePerm(perm.id)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ flex: 1, fontSize: '14px' }}>{perm.text}</span>
            </label>
          ))}
        </div>
        {feedback && (
          <div className={`feedback ${feedback}`} style={{ marginBottom: '12px' }}>
            {feedback === 'ok'
              ? 'Helyes! Minden veszélyes engedély azonosítva.'
              : 'Nem stimmel. Gondold végig, mely engedélyek túlzottan kockázatosak.'}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems:'center' }}>
          <button className="btn" type="button" onClick={handleSubmit} disabled={solved}>
            Ellenőrzés
          </button>
          {showDevSkip && <DevSkipButton onSkip={handleDevSkip} disabled={solved} />}
        </div>
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        <HintDetails text={payload.hint} />
      </div>
    </div>
  )
}

// Default Task Renderer (szöveges input)
const DefaultTaskRenderer = ({ task, payload, taskStory, taskLabel, onSuccess, onFailure, imageSrc, showDevSkip = false }) => {
  const [solved, setSolved] = useState(false)

  const handleCheck = (value, normalize) => {
    const isValid = task.validate(value)
    // onSuccess-t a ChallengeInput kezeli az onSuccess prop-on keresztül
    return isValid
  }

  const handleDevSkip = () => {
    setSolved(true)
    onSuccess?.()
  }

  return (
    <div className="grid2">
      <div className="card">
        {taskLabel && <h3>{taskLabel}</h3>}
        {taskStory && (
          <p className="muted" style={{ whiteSpace: 'pre-line', marginTop: taskLabel ? '8px' : '0' }}>
            {taskStory.text}
          </p>
        )}
        {!taskStory && payload.intro && <p className="muted" style={{ marginTop: taskLabel ? '8px' : '0' }}>{payload.intro}</p>}
        <p className="muted" style={{ marginTop: (taskStory || payload.intro) ? '12px' : (taskLabel ? '8px' : '0') }}>{payload.instructions}</p>
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
          key={task?.id || 'default'}
          placeholder="válasz…"
          onCheck={handleCheck}
          okText="Helyes! Tovább…"
          errText="Nem egészen – próbáld újra."
          onSuccess={onSuccess}
          onFailure={onFailure}
        />
        {showDevSkip && (
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <DevSkipButton onSkip={handleDevSkip} disabled={solved} />
          </div>
        )}
        {imageSrc && <div className="task-note"><PerfImg className="task-ill" src={imageSrc} alt="Illusztráció" width="280" height="280" priority /></div>}
        {payload.hint && (
          <div className="hint" style={{marginTop:'12px'}}>
            <details>
              <summary>Súgó megnyitása</summary>
              <p className="muted" style={{margin:'8px 0 0'}}>{payload.hint}</p>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskRenderer

