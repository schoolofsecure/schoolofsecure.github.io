import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import { TaskFactory, Random } from '../../tasks'
import '../../styles/ugy1.css'

const ALL_TASK_TYPES = [
  'CAESAR', 'VIGENERE', 'XOR', 'HASH_MISMATCH', 'ICON_MEMORY',
  'PASSWORD_STRENGTH', 'PHISHING', 'URL_TRUST', 'LOG_ANALYSIS',
  'SOCIAL_ENGINEERING', 'FIREWALL', 'MISCONFIG', 'RISKY_PERMISSION',
  'SECURITY_DECISION', 'CRYPTO_PUZZLE', 'PSEUDOCODE_BUG',
  'NETWORK_ANOMALY', 'EMAIL_HEADER', 'ATTACK_SCENARIO', 'ZERO_DAY'
]

const TaskPreviewList = () => {
  const [previews, setPreviews] = useState({})
  const [selectedType, setSelectedType] = useState(null)
  const [selectedExample, setSelectedExample] = useState(0)

  useEffect(() => {
    // Seed beállítása konzisztens generáláshoz
    Random.setSeed(12345)
    
    const generatedPreviews = {}
    
    ALL_TASK_TYPES.forEach((type, typeIndex) => {
      const examples = []
      
      // Minden típusból 3 példa generálása
      for (let i = 0; i < 3; i++) {
        const seed = 12345 + typeIndex * 10 + i
        Random.setSeed(seed)
        
        const difficulty = i === 0 ? 'easy' : i === 1 ? 'medium' : 'hard'
        const task = TaskFactory.createRandomTask(difficulty, [type], 2, i + 1)
        task.generate()
        
        examples.push({
          task,
          difficulty,
          seed
        })
      }
      
      generatedPreviews[type] = examples
    })
    
    setPreviews(generatedPreviews)
    
    // Seed reset
    Random.resetSeed()
  }, [])

  const currentExamples = selectedType ? previews[selectedType] : null

  return (
    <div className="container">
      <header>
        <Link to="/" className="brand" aria-label="CyberMystery – Vissza a főoldalra">
          <div className="brand-badge">CM</div>
          <div>Task Preview List</div>
        </Link>
      </header>

      <main>
        <NarrativeBlock badge="Task Preview">
          <h1 style={{ margin: '10px 0 4px' }}>Feladattípusok előnézete</h1>
          <p>
            Minden feladattípusból 3 példa (könnyű, közepes, nehéz). A generálás seedelt módban történik,
            így konzisztens eredményeket kapunk.
          </p>
        </NarrativeBlock>

        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Feladattípusok</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px',
            marginTop: '16px'
          }}>
            {ALL_TASK_TYPES.map(type => (
              <button
                key={type}
                type="button"
                className={selectedType === type ? 'btn' : 'btn-ghost'}
                onClick={() => {
                  setSelectedType(type)
                  setSelectedExample(0)
                }}
                style={{ textAlign: 'left', padding: '10px' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {currentExamples && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>{selectedType} - Példák</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {currentExamples.map((example, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={idx === selectedExample ? 'btn' : 'btn-ghost'}
                  onClick={() => setSelectedExample(idx)}
                >
                  {idx + 1}. {example.difficulty}
                </button>
              ))}
            </div>

            {currentExamples[selectedExample] && (
              <>
                <TaskCard title={`${selectedType} - ${currentExamples[selectedExample].difficulty}`}>
                  <TaskRenderer
                    task={currentExamples[selectedExample].task}
                    onSuccess={() => {}}
                    onFailure={() => {}}
                  />
                </TaskCard>

                <div className="card" style={{ marginTop: '16px', background: '#0b121c', border: '1px solid rgba(207,230,255,0.2)' }}>
                  <h4 style={{ marginTop: 0, fontSize: '14px' }}>Generálás információk</h4>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    <div><strong>Típus:</strong> {selectedType}</div>
                    <div><strong>Nehézség:</strong> {currentExamples[selectedExample].difficulty}</div>
                    <div><strong>Seed:</strong> {currentExamples[selectedExample].seed}</div>
                    <div><strong>ID:</strong> {currentExamples[selectedExample].task.id}</div>
                    {currentExamples[selectedExample].task.solution && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.1)', borderRadius: '4px' }}>
                        <strong>Megoldás:</strong> {JSON.stringify(currentExamples[selectedExample].task.solution)}
                      </div>
                    )}
                    {currentExamples[selectedExample].task.payload && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.05)', borderRadius: '4px', fontSize: '11px' }}>
                        <strong>Payload:</strong>
                        <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {JSON.stringify(currentExamples[selectedExample].task.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default TaskPreviewList

