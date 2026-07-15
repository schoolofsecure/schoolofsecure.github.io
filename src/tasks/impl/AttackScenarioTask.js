import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = [
  {
    prompt: 'Users land on a fake Google login page from a link sent by SMS.',
    options: ['Phishing', 'Man-in-the-middle', 'SQL injection'],
    answer: 0
  },
  {
    prompt: 'An attacker sits in the middle of a Wi-Fi hotspot and modifies traffic.',
    options: ['DNS poisoning', 'Man-in-the-middle', 'Ransomware'],
    answer: 1
  },
  {
    prompt: 'An unknown process mass-encrypts data on a server and demands a ransom.',
    options: ['Ransomware', 'Brute force', 'Session hijack'],
    answer: 0
  },
  {
    prompt: 'An attacker extracts sensitive data from a database because of weak input validation.',
    options: ['Cross-site scripting', 'SQL injection', 'Command injection'],
    answer: 1
  }
]

export class AttackScenarioTask extends BaseTask {
  static create({ id, difficulty }) {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    const scenarios = Random.sample(SCENARIOS, count)

    return new AttackScenarioTask({
      id,
      difficulty,
      parameters: { scenarios }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'ATTACK_SCENARIO', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenarios } = this.parameters
    this.solution = scenarios.map(s => s.answer)
    this.payload = {
      instructions: 'For each scenario below, identify the type of attack.',
      scenarios
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    if (userInput.length !== this.solution.length) return false
    return userInput.every((choice, idx) => Number(choice) === this.solution[idx])
  }
}
