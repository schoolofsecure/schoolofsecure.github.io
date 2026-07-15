import React, { useState, useEffect } from 'react'
import BrandLogo from '../../components/BrandLogo'
import NarrativeBlock from '../../components/Ugy1/NarrativeBlock'
import TaskCard from '../../components/Ugy1/TaskCard'
import TaskRenderer from '../../components/TaskRenderer/TaskRenderer'
import { TaskFactory, Random, LevelGenerator } from '../../tasks'
import { RiskyPermissionTask } from '../../tasks/impl/RiskyPermissionTask'
import { SCENARIOS as RISKY_PERMISSION_SCENARIOS } from '../../tasks/impl/RiskyPermissionTask'
import { VigenereTask } from '../../tasks/impl/VigenereTask'
import { SCENARIOS as VIGENERE_SCENARIOS } from '../../tasks/impl/VigenereTask'
import { NetworkAnomalyTask } from '../../tasks/impl/NetworkAnomalyTask'
import { SCENARIOS as NETWORK_ANOMALY_SCENARIOS } from '../../tasks/impl/NetworkAnomalyTask'
import { EmailHeaderTask } from '../../tasks/impl/EmailHeaderTask'
import { SCENARIOS as EMAIL_HEADER_SCENARIOS } from '../../tasks/impl/EmailHeaderTask'
import { UrlTrustTask } from '../../tasks/impl/UrlTrustTask'
import { SCENARIOS as URL_TRUST_SCENARIOS } from '../../tasks/impl/UrlTrustTask'
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
  const [ugy3Tasks, setUgy3Tasks] = useState({}) // { type: [variations] }
  const [selectedUgy3Task, setSelectedUgy3Task] = useState(null)
  const [selectedUgy3Variation, setSelectedUgy3Variation] = useState(0)

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

    // 3. pálya feladatainak generálása - 3 variáció minden típushoz
    const ugy3Types = [
      'VIGENERE',
      'NETWORK_ANOMALY',
      'EMAIL_HEADER',
      'URL_TRUST',
      'RISKY_PERMISSION'
    ]
    
    const ugy3TasksGenerated = {}
    
    ugy3Types.forEach((type, typeIndex) => {
      const variations = []
      
      // RISKY_PERMISSION esetén explicit módon generáljuk a 3 fix szcenáriót
      if (type === 'RISKY_PERMISSION') {
        RISKY_PERMISSION_SCENARIOS.forEach((scenario, scenarioIndex) => {
          // Keverjük össze az engedélyeket, hogy valósághű legyen
          const shuffledPermissions = Random.shuffle([...scenario.permissions])
          
          const task = new RiskyPermissionTask({
            id: `risky-perm-${scenarioIndex}`,
            difficulty: 'easy',
            parameters: {
              app: scenario.app,
              permissions: shuffledPermissions,
              risky: [...scenario.risky]
            }
          })
          task.generate()
          
          variations.push({
            seed: BASE_SEED + 9999 + typeIndex * 10000 + scenarioIndex,
            task,
            variationIndex: scenarioIndex,
            type
          })
        })
      } else if (type === 'VIGENERE') {
        // VIGENERE esetén explicit módon generáljuk a 3 fix szcenáriót
        VIGENERE_SCENARIOS.forEach((scenario, scenarioIndex) => {
          const task = new VigenereTask({
            id: `vigenere-${scenarioIndex}`,
            difficulty: 'easy',
            parameters: {
              plaintext: scenario.plaintext,
              key: scenario.key,
              levelNumber: 3,
              slot: scenarioIndex + 1
            }
          })
          task.generate()
          
          variations.push({
            seed: BASE_SEED + 9999 + typeIndex * 10000 + scenarioIndex,
            task,
            variationIndex: scenarioIndex,
            type
          })
        })
      } else if (type === 'NETWORK_ANOMALY') {
        // NETWORK_ANOMALY esetén explicit módon generáljuk a 3 fix szcenáriót
        NETWORK_ANOMALY_SCENARIOS.forEach((scenario, scenarioIndex) => {
          const task = new NetworkAnomalyTask({
            id: `network-anomaly-${scenarioIndex}`,
            difficulty: 'easy',
            parameters: {
              flows: [...scenario.flows]
            }
          })
          task.generate()
          
          variations.push({
            seed: BASE_SEED + 9999 + typeIndex * 10000 + scenarioIndex,
            task,
            variationIndex: scenarioIndex,
            type
          })
        })
      } else if (type === 'EMAIL_HEADER') {
        // EMAIL_HEADER esetén explicit módon generáljuk a 3 fix szcenáriót
        EMAIL_HEADER_SCENARIOS.forEach((scenario, scenarioIndex) => {
          const task = new EmailHeaderTask({
            id: `email-header-${scenarioIndex}`,
            difficulty: 'easy',
            parameters: {
              template: scenario,
              hints: ['Keresd a SPF státuszt.'],
              difficulty: 'easy'
            }
          })
          task.generate()
          
          variations.push({
            seed: BASE_SEED + 9999 + typeIndex * 10000 + scenarioIndex,
            task,
            variationIndex: scenarioIndex,
            type
          })
        })
      } else if (type === 'URL_TRUST') {
        // URL_TRUST esetén explicit módon generáljuk a 3 fix szcenáriót
        URL_TRUST_SCENARIOS.forEach((scenario, scenarioIndex) => {
          const task = new UrlTrustTask({
            id: `url-trust-${scenarioIndex}`,
            difficulty: 'easy',
            parameters: {
              urls: Random.shuffle([...scenario.urls])
            }
          })
          task.generate()
          
          variations.push({
            seed: BASE_SEED + 9999 + typeIndex * 10000 + scenarioIndex,
            task,
            variationIndex: scenarioIndex,
            type
          })
        })
      } else {
        // Egyéb típusoknál a régi logika
        const seen = new Set()
        let attempt = 0
        const variationTarget = 3
        
        // Nagyobb seed különbségek a különböző variációkhoz
        const seedBase = BASE_SEED + 9999 + typeIndex * 10000
        
        while (variations.length < variationTarget && attempt < variationTarget * 20) {
          // Nagyobb különbségek a seed-ek között, hogy biztosan eltérő feladatokat kapjunk
          const seed = seedBase + attempt * 100
          Random.setSeed(seed)
          
          const task = TaskFactory.createRandomTask('easy', [type], 3, attempt + 1)
          
          // Biztosítjuk, hogy a feladat teljesen generálva legyen
          if (!task.payload) {
            task.generate()
          } else {
            // Ha már van payload, újrageneráljuk, hogy biztosan friss legyen
            task.payload = null
            task.solution = null
            task.generate()
          }
          
          // Részletesebb signature a payload és solution alapján
          const signature = JSON.stringify({
            type: task.type,
            payload: task.payload,
            solution: task.solution,
            difficulty: task.difficulty
          })
          
          if (!seen.has(signature) && task.payload && task.solution !== undefined) {
            seen.add(signature)
            variations.push({
              seed,
              task,
              variationIndex: variations.length,
              type
            })
          }
          attempt++
        }
        
        // Ha még mindig nincs elég variáció, próbáljuk meg más slot értékekkel
        if (variations.length < variationTarget) {
          for (let slot = 1; slot <= 10 && variations.length < variationTarget; slot++) {
            const seed = seedBase + slot * 1000
            Random.setSeed(seed)
            
            const task = TaskFactory.createRandomTask('easy', [type], 3, slot)
            if (!task.payload) {
              task.generate()
            } else {
              task.payload = null
              task.solution = null
              task.generate()
            }
            
            const signature = JSON.stringify({
              type: task.type,
              payload: task.payload,
              solution: task.solution,
              difficulty: task.difficulty
            })
            
            if (!seen.has(signature) && task.payload && task.solution !== undefined) {
              seen.add(signature)
              variations.push({
                seed,
                task,
                variationIndex: variations.length,
                type
              })
            }
          }
        }
      }
      
      ugy3TasksGenerated[type] = variations
    })
    
    setUgy3Tasks(ugy3TasksGenerated)
    if (ugy3Types.length > 0) {
      setSelectedUgy3Task(ugy3Types[0])
    }
    Random.resetSeed()
  }, [])

  const currentVariations = selectedType && previews[selectedType]
    ? previews[selectedType][selectedDifficulty] || []
    : []
  const current = currentVariations[selectedVariation] || null

  return (
    <div className="container">
      <header>
        <BrandLogo ariaLabel="Iterali – Back to home" />
          <div>Task Preview List</div>
      </header>

      <main>
        <NarrativeBlock badge="Task Preview">
          <h1 style={{ margin: '10px 0 4px' }}>Feladattípusok előnézete</h1>
          <p>
            Válassz feladattípust, majd nehézségi szintet: minden kombinációhoz seedelt, fix feladatot mutatunk
            megoldással együtt. Easy módban az összes variáció megjelenik.
          </p>
        </NarrativeBlock>

        {/* 3. pálya feladatainak előnézete */}
        <div className="card" style={{ marginTop: '20px', background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <h3 style={{ color: '#00e5ff' }}>3. pálya feladatainak előnézete</h3>
          <p className="muted" style={{ marginBottom: '16px', fontSize: '14px' }}>
            A 3. pálya 5 fix feladatát mutatjuk: VIGENERE, NETWORK_ANOMALY, EMAIL_HEADER, URL_TRUST, RISKY_PERMISSION (mind easy nehézség). Minden típushoz 3 variáció.
          </p>
          
          {Object.keys(ugy3Tasks).length > 0 && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Feladattípusok</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['VIGENERE', 'NETWORK_ANOMALY', 'EMAIL_HEADER', 'URL_TRUST', 'RISKY_PERMISSION'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={selectedUgy3Task === type ? 'btn' : 'btn-ghost'}
                      onClick={() => {
                        setSelectedUgy3Task(type)
                        setSelectedUgy3Variation(0)
                      }}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {selectedUgy3Task && ugy3Tasks[selectedUgy3Task] && ugy3Tasks[selectedUgy3Task].length > 0 && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Variációk ({ugy3Tasks[selectedUgy3Task].length})</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {ugy3Tasks[selectedUgy3Task].map((variation, index) => (
                        <button
                          key={index}
                          type="button"
                          className={selectedUgy3Variation === index ? 'btn' : 'btn-ghost'}
                          onClick={() => setSelectedUgy3Variation(index)}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          Variáció {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {ugy3Tasks[selectedUgy3Task][selectedUgy3Variation] && (
                    <>
                      <TaskCard title={`3. pálya – ${selectedUgy3Task} (easy)${ugy3Tasks[selectedUgy3Task].length > 1 ? ` (Variáció ${selectedUgy3Variation + 1})` : ''}`}>
                        <TaskRenderer
                          task={ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task}
                          onSuccess={() => {}}
                          onFailure={() => {}}
                        />
                      </TaskCard>

                      <div className="card" style={{ marginTop: '16px', background: '#0b121c', border: '1px solid rgba(207,230,255,0.2)' }}>
                        <h4 style={{ marginTop: 0, fontSize: '14px' }}>Generálás információk</h4>
                        <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                          <div><strong>Típus:</strong> {selectedUgy3Task}</div>
                          <div><strong>Nehézség:</strong> easy</div>
                          <div><strong>Seed:</strong> {ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].seed}</div>
                          <div><strong>Variáció:</strong> {selectedUgy3Variation + 1} / {ugy3Tasks[selectedUgy3Task].length}</div>
                          <div><strong>ID:</strong> {ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task.id}</div>
                          {ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task.solution && (
                            <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.1)', borderRadius: '4px' }}>
                              <strong>Megoldás:</strong> {JSON.stringify(ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task.solution)}
                            </div>
                          )}
                          {ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task.payload && (
                            <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,229,255,0.05)', borderRadius: '4px', fontSize: '11px' }}>
                              <strong>Payload:</strong>
                              <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(ugy3Tasks[selectedUgy3Task][selectedUgy3Variation].task.payload, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>

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

            {currentVariations.length > 0 && (
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
