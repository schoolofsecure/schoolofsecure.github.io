import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const PERMISSIONS = {
  camera: { id: 'camera', text: 'Camera access' },
  microphone: { id: 'microphone', text: 'Microphone access' },
  contacts: { id: 'contacts', text: 'Read contacts' },
  sms: { id: 'sms', text: 'Read/send SMS' },
  location: { id: 'location', text: 'Precise location' },
  storage: { id: 'storage', text: 'Full storage read/write' }
}

export const SCENARIOS = [
  {
    app: 'Flashlight',
    permissions: [
      PERMISSIONS.camera,
      PERMISSIONS.microphone,
      PERMISSIONS.contacts
    ],
    risky: ['camera', 'microphone', 'contacts']
  },
  {
    app: 'Weather app',
    permissions: [
      PERMISSIONS.location,
      PERMISSIONS.contacts,
      PERMISSIONS.sms
    ],
    risky: ['contacts', 'sms']
  },
  {
    app: 'Notes app',
    permissions: [
      PERMISSIONS.storage,
      PERMISSIONS.camera,
      PERMISSIONS.microphone
    ],
    risky: ['microphone']
  }
]

export class RiskyPermissionTask extends BaseTask {
  static create({ id, difficulty }) {
    const scenario = Random.choice(SCENARIOS)
    const shuffledPermissions = Random.shuffle([...scenario.permissions])

    return new RiskyPermissionTask({
      id,
      difficulty,
      parameters: { 
        app: scenario.app, 
        permissions: shuffledPermissions, 
        risky: scenario.risky 
      }
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
      permissions,
      hint: 'Consider whether each permission is actually needed for what the app does. If a permission does not match the app\'s purpose, it may be suspicious.'
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution || !this.payload) this.generate()
    if (!this.solution) return false
    const normalized = [...new Set(userInput)].sort()
    const expected = [...new Set(this.solution)].sort()
    return JSON.stringify(normalized) === JSON.stringify(expected)
  }
}
