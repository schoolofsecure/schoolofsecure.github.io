import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const DECISIONS = [
  {
    title: 'Hidden connection',
    scenario: 'The system alerts you: a hidden connection has been detected.',
    options: ['Disconnect immediately to stop it from progressing', 'Monitor the activity to gather more information — accepting the risk', 'Wait and act only when you see concrete data'],
    correctIndex: 0
  },
  {
    title: 'Suspicious network traffic',
    scenario: 'You detect suspicious network traffic from an internal server to external addresses.',
    options: ['Shut down the server immediately', 'Isolate it on the network and monitor the traffic', 'Wait — it might stop on its own'],
    correctIndex: 1
  },
  {
    title: 'Encrypted connection attempt',
    scenario: 'An unknown process is trying to establish an encrypted connection from the system.',
    options: ['Stop the process immediately', 'Let it run but log and monitor it', 'Do nothing — it may be normal activity'],
    correctIndex: 0
  }
]

export class SecurityDecisionTask extends BaseTask {
  static create({ id, difficulty }) {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    const scenarios = Random.sample(DECISIONS, count)

    return new SecurityDecisionTask({
      id,
      difficulty,
      parameters: { scenarios }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'SECURITY_DECISION', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenarios } = this.parameters
    this.solution = scenarios.map(s => s.correctIndex)
    const hints = {
      easy: 'Security always comes first. When in doubt, choose the safest option.',
      medium: 'Weigh the risks: being too cautious can lose information, but delay can cause greater damage.',
      hard: 'In complex situations, balance security protocols with incident response procedures.'
    }
    this.payload = {
      instructions: 'Choose the best security decision in each situation.',
      scenarios,
      hint: hints[this.difficulty] || hints.easy
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
