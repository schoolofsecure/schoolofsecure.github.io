import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = [
  {
    prompt: 'A felhasználók hamis Google bejelentkezési oldalra jutnak egy SMS-ben küldött linkről.',
    options: ['Phishing', 'Man-in-the-middle', 'SQL injection'],
    answer: 0
  },
  {
    prompt: 'A támadó a Wi-Fi hotspot közepén ülve módosítja a forgalmat.',
    options: ['DNS poisoning', 'Man-in-the-middle', 'Ransomware'],
    answer: 1
  },
  {
    prompt: 'Ismeretlen processz tömegesen titkosítja a szerveren lévő adatokat és váltságdíjat kér.',
    options: ['Ransomware', 'Brute force', 'Session hijack'],
    answer: 0
  },
  {
    prompt: 'A támadó adatbázisból érzékeny információt szív ki hibás input validáció miatt.',
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
      instructions: 'Az alábbi szcenáriók közül válaszd ki, milyen támadásról van szó.',
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


