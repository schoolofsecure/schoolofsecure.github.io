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

const DIFFICULTIES = ['easy', 'medium', 'hard']
const BASE_SEED = 12345

// Variációk száma típusonként easy módban
const EASY_VARIATIONS = {
  'PASSWORD_STRENGTH': 3, // password1, Cyber2024, Secret123
  'SOCIAL_ENGINEERING': 2, // urgent-message, tech-support-request
  'FIREWALL': 2, // museum-kiosk, sensor-gateway
  'SECURITY_DECISION': 3, // 3 különböző helyzet
  'PHISHING': 2, // 2 email template
  // Egyéb típusoknál 1 variáció
}

const TaskPreviewList = () => {
  const [previews, setPreviews] = useState({})
  const [selectedType, setSelectedType] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [selectedVariation, setSelectedVariation] = useState(0)

  useEffect(() => {
    const generated = {}

    ALL_TASK_TYPES.forEach((type, typeIndex) => {
      generated[type] = {}
      DIFFICULTIES.forEach((difficulty, diffIndex) => {
        const variationTarget = difficulty === 'easy' ? (EASY_VARIATIONS[type] || 1) : 1
        const variations = []
        const seen = new Set()
        let attempt = 0

        while (variations.length < variationTarget && attempt < variationTarget * 5) {
          const seed = BASE_SEED + typeIndex * 1000 + diffIndex * 100 + attempt * 10
        Random.setSeed(seed)
        const task = TaskFactory.createRandomTask(difficulty, [type], 2, diffIndex + 1)
        task.generate()
          const signature = JSON.stringify({ payload: task.payload, solution: task.solution })

          if (!seen.has(signature)) {
            seen.add(signature)
            variations.push({
          seed,
              task,
              variationIndex: variations.length
            })
          }
          attempt++
        }

        generated[type][difficulty] = variations
      })
    })

    setPreviews(generated)
    setSelectedType(ALL_TASK_TYPES[0])
    Random.resetSeed()
  }, [])

  const currentVariations = selectedType && previews[selectedType]
    ? previews[selectedType][selectedDifficulty] || []
    : []
  const current = currentVariations[selectedVariation] || null

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
            Válassz feladattípust, majd nehézségi szintet: minden kombinációhoz seedelt, fix feladatot mutatunk
            megoldással együtt. Easy módban az összes variáció megjelenik.
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
                  setSelectedDifficulty('easy')
                  setSelectedVariation(0)
                }}
                style={{ textAlign: 'left', padding: '10px' }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {selectedType && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>{selectedType} – Nehézség</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {DIFFICULTIES.map(diff => (
                <button
                  key={diff}
                  type="button"
                  className={selectedDifficulty === diff ? 'btn' : 'btn-ghost'}
                  onClick={() => {
                  setSelectedDifficulty(diff)
                  setSelectedVariation(0)
                }}
                >
                  {diff}
                </button>
              ))}
            </div>

            {currentVariations.length > 1 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Variációk ({currentVariations.length})</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentVariations.map((variation, index) => (
                    <button
                      key={index}
                      type="button"
                      className={selectedVariation === index ? 'btn' : 'btn-ghost'}
                      onClick={() => setSelectedVariation(index)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      Variáció {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {current && (
              <>
                <TaskCard title={`${selectedType} – ${selectedDifficulty}${currentVariations.length > 1 ? ` (Variáció ${selectedVariation + 1})` : ''}`}>
                  <TaskRenderer
                    task={current.task}
                    onSuccess={() => {}}
                    onFailure={() => {}}
                  />
                </TaskCard>

                <div className="card" style={{ marginTop: '16px', background: '#0b121c', border: '1px solid rgba(207,230,255,0.2)' }}>
                  <h4 style={{ marginTop: 0, fontSize: '14px' }}>Generálás információk</h4>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    <div><strong>Seed:</strong> {current.seed}</div>
                    <div><strong>ID:</strong> {current.task.id}</div>
                    <div><strong>Variáció:</strong> {current.variationIndex + 1} / {currentVariations.length}</div>
                    {current.task.solution && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.1)', borderRadius: '4px' }}>
                        <strong>Megoldás:</strong> {JSON.stringify(current.task.solution)}
                      </div>
                    )}
                    {current.task.payload && (
                      <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.05)', borderRadius: '4px', fontSize: '11px' }}>
                        <strong>Payload:</strong>
                        <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {JSON.stringify(current.task.payload, null, 2)}
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

