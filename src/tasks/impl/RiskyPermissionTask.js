import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const PERMISSIONS = [
  { id: 'camera', text: 'Kamera hozzáférés', riskyFor: ['chat', 'calculator'] },
  { id: 'microphone', text: 'Mikrofon hozzáférés', riskyFor: ['flashlight', 'notes'] },
  { id: 'contacts', text: 'Névjegyek olvasása', riskyFor: ['flashlight', 'weather'] },
  { id: 'sms', text: 'SMS olvasás/küldés', riskyFor: ['calendar', 'music'] },
  { id: 'location', text: 'Precíz helyadatok', riskyFor: ['calculator'] },
  { id: 'storage', text: 'Teljes tárhely írás/olvasás', riskyFor: ['calculator'], safeFor: ['file manager'] }
]

export class RiskyPermissionTask extends BaseTask {
  static create({ id, difficulty }) {
    const appTypes = {
      easy: ['zseblámpa', 'számológép'],
      medium: ['jegyzet app', 'időjárás app'],
      hard: ['üzleti chat', 'titkosított vault']
    }
    const app = Random.choice(appTypes[difficulty])
    const perms = Random.sample(PERMISSIONS, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)
    const risky = perms
      .filter(p => p.riskyFor && p.riskyFor.includes(app.replace(' app', '')))
      .map(p => p.id)

    return new RiskyPermissionTask({
      id,
      difficulty,
      parameters: { app, permissions: perms, risky }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'RISKY_PERMISSION', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { app, permissions, risky } = this.parameters
    this.solution = risky
    this.payload = {
      instructions: `A "${app}" alkalmazás az alábbi engedélyeket kéri. Jelöld ki, melyek túlzottan kockázatosak.`,
      permissions
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const normalized = [...new Set(userInput)].sort()
    const expected = [...new Set(this.solution)].sort()
    return JSON.stringify(normalized) === JSON.stringify(expected)
  }
}


