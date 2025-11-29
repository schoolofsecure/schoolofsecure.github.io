import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

export class NetworkAnomalyTask extends BaseTask {
  static create({ id, difficulty }) {
    const flowCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10
    const flows = []

    for (let i = 0; i < flowCount; i++) {
      flows.push({
        source: `10.0.${Random.int(0, 5)}.${Random.int(1, 254)}`,
        destination: `172.16.${Random.int(0, 5)}.${Random.int(1, 254)}`,
        bytes: Random.int(1000, 50000),
        port: Random.choice([80, 443, 22, 445, 3389, 8080]),
        protocol: Random.choice(['TCP', 'UDP']),
        isAnomaly: false
      })
    }

    const anomalyCount = difficulty === 'hard' ? 3 : 2
    const anomalyIndexes = Random.sample([...flows.keys()], anomalyCount)
    anomalyIndexes.forEach(idx => {
      const flow = flows[idx]
      flow.isAnomaly = true
      flow.bytes = Random.int(200000, 900000)
      flow.port = Random.choice([23, 1337, 31337])
      flow.destination = `203.0.113.${Random.int(10, 200)}`
    })

    return new NetworkAnomalyTask({
      id,
      difficulty,
      parameters: { flows }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'NETWORK_ANOMALY', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { flows } = this.parameters
    this.solution = flows
      .map((flow, idx) => (flow.isAnomaly ? idx : null))
      .filter(idx => idx !== null)
    this.payload = {
      instructions: 'A hálózati forgalmi táblázatból válaszd ki az anomáliákat.',
      flows
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const normalized = [...new Set(userInput)].map(Number).sort((a, b) => a - b)
    const solutionSorted = [...this.solution].sort((a, b) => a - b)
    return JSON.stringify(normalized) === JSON.stringify(solutionSorted)
  }
}


