import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SERVICES = [
  { name: 'HTTP', port: 80, proto: 'TCP' },
  { name: 'HTTPS', port: 443, proto: 'TCP' },
  { name: 'SSH', port: 22, proto: 'TCP' },
  { name: 'DNS', port: 53, proto: 'UDP' },
  { name: 'RDP', port: 3389, proto: 'TCP' },
  { name: 'SMTP', port: 25, proto: 'TCP' }
]

export class FirewallRulesTask extends BaseTask {
  static create({ id, difficulty }) {
    const required = Random.sample(SERVICES, difficulty === 'easy' ? 2 : 3)
    const blocked = Random.sample(
      SERVICES.filter(s => !required.includes(s)),
      difficulty === 'hard' ? 2 : 1
    )

    return new FirewallRulesTask({
      id,
      difficulty,
      parameters: { required, blocked }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'FIREWALL', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { required, blocked } = this.parameters
    this.solution = {
      allow: required.map(s => `${s.proto}:${s.port}`),
      deny: blocked.map(s => `${s.proto}:${s.port}`)
    }
    this.payload = {
      instructions: 'Állítsd be a szabályokat: mely protokoll/port párok legyenek engedélyezve vagy tiltva.',
      requiredServices: required,
      blockedServices: blocked
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput || typeof userInput !== 'object') return false
    if (!this.solution) this.generate()
    const allowed = (userInput.allow || []).sort()
    const denied = (userInput.deny || []).sort()
    return (
      JSON.stringify(allowed) === JSON.stringify(this.solution.allow.sort()) &&
      JSON.stringify(denied) === JSON.stringify(this.solution.deny.sort())
    )
  }
}


