import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const EVENT_POOL = [
  { id: 'evt1', text: 'Ismeretlen IOC jelenik meg a naplókban, amely nem szerepel adatbázisban.', zeroDay: true },
  { id: 'evt2', text: 'Publikált CVE ellenére exploit próbálkozás történik – patch még nincs fenn.', zeroDay: false },
  { id: 'evt3', text: 'Új, aláíratlan driver települ rendszerszinten.', zeroDay: true },
  { id: 'evt4', text: 'Ismert ransomware hash bukkan fel.', zeroDay: false },
  { id: 'evt5', text: 'Speciális sandbox-ban azonosítatlan API hívás történik kernel szinten.', zeroDay: true }
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
      instructions: 'Válaszd ki, mely események utalhatnak zero-day támadásra.',
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


