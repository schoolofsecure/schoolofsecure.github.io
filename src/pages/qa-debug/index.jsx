import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import { LevelGenerator, TaskFactory } from '../../tasks'
import { LEVEL_1_TASK_TYPES } from '../../tasks/level1Types'
import { Random } from '../../tasks/utils/random'
import '../../styles/ugy1.css'

const ALL_TASK_TYPES = [
  'CAESAR', 'VIGENERE', 'XOR', 'HASH_MISMATCH', 'ICON_MEMORY',
  'PASSWORD_STRENGTH', 'PHISHING', 'URL_TRUST', 'LOG_ANALYSIS',
  'SOCIAL_ENGINEERING', 'FIREWALL', 'MISCONFIG', 'RISKY_PERMISSION',
  'SECURITY_DECISION', 'CRYPTO_PUZZLE', 'PSEUDOCODE_BUG',
  'NETWORK_ANOMALY', 'EMAIL_HEADER', 'ATTACK_SCENARIO', 'ZERO_DAY'
]

const QADebugPanel = () => {
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState(2)
  const [selectedTypes, setSelectedTypes] = useState(new Set())
  const [seed, setSeed] = useState('')
  const [previewTasks, setPreviewTasks] = useState([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [previewMode, setPreviewMode] = useState('level') // 'level' | 'single'

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    setSelectedTypes(new Set(ALL_TASK_TYPES))
  }

  const handleDeselectAll = () => {
    setSelectedTypes(new Set())
  }

  const generatePreview = () => {
    const seedValue = seed ? parseInt(seed, 10) : null
    const forcedTypes = selectedTypes.size > 0 ? Array.from(selectedTypes) : null
    
    if (previewMode === 'level') {
      // Teljes pálya generálása
      const tasks = LevelGenerator.generateLevel(
        selectedLevel,
        5,
        new Map(),
        4,
        { seed: seedValue, forcedTypes }
      )
      
      tasks.forEach(task => {
        if (!task.payload) {
          task.generate()
        }
      })
      
      setPreviewTasks(tasks)
      setCurrentTaskIndex(0)
    } else {
      // Egyetlen feladat generálása
      if (selectedTypes.size === 0) {
        alert('Válassz ki legalább egy feladattípust!')
        return
      }
      
      const type = Array.from(selectedTypes)[0]
      const difficulty = 'medium'
      const task = TaskFactory.createRandomTask(difficulty, [type], selectedLevel, 1)
      task.generate()
      
      setPreviewTasks([task])
      setCurrentTaskIndex(0)
    }
  }

  const handleLoadLevel = () => {
    if (selectedLevel === 1) {
      navigate('/ugy1')
      return
    }
    
    // Seed beállítása, ha van
    if (seed) {
      Random.setSeed(parseInt(seed, 10))
    }
    
    // Navigálás az ugy2 oldalra, de előbb generáljuk a feladatokat
    // A seed-et sessionStorage-ba mentjük, hogy az ugy2 oldal használhassa
    if (seed) {
      sessionStorage.setItem('qa_seed', seed)
      sessionStorage.setItem('qa_level', selectedLevel.toString())
      if (selectedTypes.size > 0) {
        sessionStorage.setItem('qa_forced_types', JSON.stringify(Array.from(selectedTypes)))
      }
    }
    
    navigate(`/ugy${selectedLevel}`)
  }

  const currentTask = previewTasks[currentTaskIndex]

  return (
    <div className="container">
      <header>
        <BrandLogo ariaLabel="Iterali – Back to home" />
          <div>QA Debug Panel</div>
      </header>

      <main>
        <NarrativeBlock badge="QA & Development">
          <h1 style={{ margin: '10px 0 4px' }}>QA Debug Panel</h1>
          <p>
            Fejlesztői eszköz a pályák és feladatok teszteléséhez. Itt generálhatsz előnézetet,
            seed-et állíthatsz be, és kényszerítheted a feladattípusokat.
          </p>
        </NarrativeBlock>

        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Pálya beállítások</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                Pályaszám (1-12)
              </label>
              <select
                className="input"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(parseInt(e.target.value, 10))}
                style={{ minWidth: '120px' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(level => (
                  <option key={level} value={level}>
                    Pálya {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                Override Seed
              </label>
              <input
                type="number"
                className="input"
                placeholder="Üres = random"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                style={{ minWidth: '150px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button
                className="btn-ghost"
                type="button"
                onClick={() => {
                  setSeed('')
                  Random.resetSeed()
                }}
              >
                Reset Seed
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600 }}>
                Feladattípusok (válassz 5-öt teljes pályához, vagy 1-et előnézethez)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-ghost" type="button" onClick={handleSelectAll} style={{ fontSize: '12px' }}>
                  Összes
                </button>
                <button className="btn-ghost" type="button" onClick={handleDeselectAll} style={{ fontSize: '12px' }}>
                  Törlés
                </button>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid rgba(207,230,255,0.2)',
              borderRadius: '8px'
            }}>
              {ALL_TASK_TYPES.map(type => (
                <label
                  key={type}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    backgroundColor: selectedTypes.has(type) ? 'rgba(0,229,255,0.1)' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.has(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                  <span style={{ fontSize: '13px' }}>{type}</span>
                </label>
              ))}
            </div>
            {selectedLevel === 1 && (
              <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,193,7,0.1)', borderRadius: '8px', fontSize: '13px' }}>
                <strong>Megjegyzés:</strong> Az 1. pálya fix feladatokkal rendelkezik: {LEVEL_1_TASK_TYPES.join(', ')}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setPreviewMode('level')
                generatePreview()
              }}
            >
              Generate Preview (Pálya)
            </button>
            <button
              className="btn-ghost"
              type="button"
              onClick={() => {
                setPreviewMode('single')
                generatePreview()
              }}
            >
              Előnézet (1 feladat)
            </button>
            <button
              className="btn"
              type="button"
              onClick={handleLoadLevel}
              style={{ marginLeft: 'auto' }}
            >
              Betöltés pályaképernyőre
            </button>
          </div>
        </div>

        {previewTasks.length > 0 && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>Előnézet</h3>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {previewTasks.map((task, idx) => (
                <button
                  key={task.id}
                  type="button"
                  className={idx === currentTaskIndex ? 'btn' : 'btn-ghost'}
                  onClick={() => setCurrentTaskIndex(idx)}
                  style={{ minWidth: '120px' }}
                >
                  {idx + 1}. {task.type}
                </button>
              ))}
            </div>

            {currentTask && (
              <TaskCard title={`${currentTaskIndex + 1}. feladat – ${currentTask.type} (${currentTask.difficulty})`}>
                <TaskRenderer
                  task={currentTask}
                  onSuccess={() => {
                    if (currentTaskIndex < previewTasks.length - 1) {
                      setCurrentTaskIndex(currentTaskIndex + 1)
                    }
                  }}
                  onFailure={() => {}}
                />
                <div className="card" style={{ marginTop: '16px', background: '#0b121c', border: '1px solid rgba(207,230,255,0.2)' }}>
                  <h4 style={{ marginTop: 0, fontSize: '14px' }}>Debug információk</h4>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    <div><strong>ID:</strong> {currentTask.id}</div>
                    <div><strong>Típus:</strong> {currentTask.type}</div>
                    <div><strong>Nehézség:</strong> {currentTask.difficulty}</div>
                    <div><strong>Pálya:</strong> {selectedLevel}</div>
                    <div><strong>Slot:</strong> {currentTaskIndex + 1}</div>
                    {currentTask.solution && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.1)', borderRadius: '4px' }}>
                        <strong>Megoldás:</strong> {JSON.stringify(currentTask.solution)}
                      </div>
                    )}
                  </div>
                </div>
              </TaskCard>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default QADebugPanel

