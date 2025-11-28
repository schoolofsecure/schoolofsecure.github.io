import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

const USER_IDS = ['svc-api', 'analyst', 'backup', 'netops', 'audit', 'admin', 'guest', 'monitor']
const ACTIONS = ['LOGIN', 'UPLOAD', 'DOWNLOAD', 'DELETE', 'PRIV_ESC', 'SCAN', 'EXEC', 'MODIFY']
const IPS = ['10.0.4.12', '172.16.9.8', '192.168.1.55', '203.0.113.44', '198.51.100.77', '10.0.4.15', '172.16.9.12']

export class LogAnalysisTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // styleConfig randomRules használata
    const rules = StyleHelper.getRandomRules('LOG_ANALYSIS')
    const complexity = StyleHelper.getComplexity(difficulty)
    
    const rowCount = rules.rows?.[difficulty] || complexity.logRows || 
                    (difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16)
    const rows = []
    const anomalyCount = rules.anomalies?.[difficulty] || 
                        (difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1)
    const anomalyIndexes = new Set()
    while (anomalyIndexes.size < anomalyCount) anomalyIndexes.add(Random.int(0, rowCount - 1))

    for (let i = 0; i < rowCount; i++) {
      const row = {
        timestamp: `2025-12-0${Random.int(1, 7)} ${Random.int(0, 23).toString().padStart(2, '0')}:${Random.int(0, 59).toString().padStart(2, '0')}:${Random.int(0, 59).toString().padStart(2, '0')}`,
        user: Random.choice(USER_IDS),
        action: Random.choice(ACTIONS),
        ip: Random.choice(IPS),
        status: 'OK'
      }
      rows.push(row)
    }

    const anomalies = []
    anomalyIndexes.forEach(idx => {
      const anomalyType = Random.choice(['geo', 'status', 'priv', 'time'])
      anomalies.push(idx)
      if (anomalyType === 'geo') rows[idx].ip = '45.12.88.199'
      if (anomalyType === 'status') rows[idx].status = 'FAIL'
      if (anomalyType === 'priv') rows[idx].action = 'PRIV_ESC'
      if (anomalyType === 'time') rows[idx].timestamp = `2025-12-02 03:${Random.int(0, 10).toString().padStart(2, '0')}:12`
    })

    return new LogAnalysisTask({
      id,
      difficulty,
      parameters: { rows, anomalies: Array.from(anomalyIndexes) }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'LOG_ANALYSIS', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { rows, anomalies, levelNumber, slot } = this.parameters
    
    // Fix narratíva minden LogAnalysisTask-nál
    const narrative = {
      intro: 'Ahogy a rendszer biztonsági szerverszobájába lépsz, a levegő vibrál. A ventilátorok túl gyorsan pörögnek, a monitorokon pedig remegő sorok futnak.',
      task: 'A technikusok szerint valaki éjjel hozzáfért a rendszerhez és „kitisztította" a nyomait. Csakhogy a hacker amatőr hibát vétett: hátrahagyott egy félbehagyott logfájlt, amelyben a fontos részeket ugyan törölte, de egy mintát nem tudott eltakarni.',
      hint: 'Figyeld a kulcs-érték párokat. Minden érték vezető karaktere fontos a következő feladathoz. Gyűjtsd össze ezeket a karaktereket, és rakd össze a jelszót!'
    }
    this.solution = anomalies.sort((a, b) => a - b)
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      rows,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const sortedInput = [...new Set(userInput)].map(Number).sort((a, b) => a - b)
    return JSON.stringify(sortedInput) === JSON.stringify(this.solution)
  }
}


