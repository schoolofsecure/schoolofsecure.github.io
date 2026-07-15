import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const EVENT_POOL = [
  { id: 'evt1', text: 'An unknown IOC appears in the logs and is not in any database.', zeroDay: true },
  { id: 'evt2', text: 'An exploit attempt occurs despite a published CVE — no patch is installed yet.', zeroDay: false },
  { id: 'evt3', text: 'A new, unsigned driver is installed at system level.', zeroDay: true },
  { id: 'evt4', text: 'A known ransomware hash appears.', zeroDay: false },
  { id: 'evt5', text: 'In a special sandbox, an unidentified API call occurs at kernel level.', zeroDay: true }
]

export class ZeroDayTask extends BaseTask {
  static create({ id, difficulty }) {
    const events = Random.sample(EVENT_POOL, difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4)
    return new ZeroDayTask({
      id,
      difficulty,
      parameters: { events }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'ZERO_DAY', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { events } = this.parameters
    this.solution = events
      .map((evt, idx) => (evt.zeroDay ? idx : null))
      .filter(idx => idx !== null)
    this.payload = {
      instructions: 'Select the events that may indicate a zero-day attack.',
      events
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
