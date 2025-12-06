import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

// 3 fix szcenárió (easy módban 5 flow, 2 anomália)
export const SCENARIOS = [
  {
    flows: [
      { source: '10.0.1.50', destination: '172.16.2.100', bytes: 15000, port: 80, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.2.75', destination: '172.16.3.200', bytes: 45000, port: 443, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.3.120', destination: '203.0.113.50', bytes: 500000, port: 23, protocol: 'TCP', isAnomaly: true },
      { source: '10.0.4.90', destination: '172.16.1.150', bytes: 12000, port: 22, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.5.200', destination: '203.0.113.100', bytes: 750000, port: 1337, protocol: 'TCP', isAnomaly: true }
    ]
  },
  {
    flows: [
      { source: '10.0.1.100', destination: '172.16.2.50', bytes: 20000, port: 443, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.2.150', destination: '203.0.113.75', bytes: 600000, port: 31337, protocol: 'TCP', isAnomaly: true },
      { source: '10.0.3.80', destination: '172.16.3.100', bytes: 18000, port: 80, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.4.200', destination: '203.0.113.150', bytes: 850000, port: 23, protocol: 'TCP', isAnomaly: true },
      { source: '10.0.5.60', destination: '172.16.1.200', bytes: 25000, port: 22, protocol: 'TCP', isAnomaly: false }
    ]
  },
  {
    flows: [
      { source: '10.0.1.180', destination: '172.16.2.80', bytes: 30000, port: 22, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.2.90', destination: '172.16.3.120', bytes: 22000, port: 443, protocol: 'TCP', isAnomaly: false },
      { source: '10.0.3.150', destination: '203.0.113.200', bytes: 700000, port: 1337, protocol: 'TCP', isAnomaly: true },
      { source: '10.0.4.110', destination: '203.0.113.125', bytes: 550000, port: 23, protocol: 'TCP', isAnomaly: true },
      { source: '10.0.5.70', destination: '172.16.1.90', bytes: 15000, port: 80, protocol: 'TCP', isAnomaly: false }
    ]
  }
]

export class NetworkAnomalyTask extends BaseTask {
  static create({ id, difficulty }) {
    // Random választás a 3 fix szcenárió közül
    const scenario = Random.choice(SCENARIOS)

    return new NetworkAnomalyTask({
      id,
      difficulty,
      parameters: { flows: [...scenario.flows] }
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
      flows,
      hint: 'A normál hálózati forgalom jellemzően kisebb adatmennyiséget és ismert portokat használ. A gyanús kapcsolatok gyakran eltérnek a szokásos mintáktól - figyeld meg az adatmennyiség nagyságrendjét, a port számokat és a cél IP-címeket.'
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


