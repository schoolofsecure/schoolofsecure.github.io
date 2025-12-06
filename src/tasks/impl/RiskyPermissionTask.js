import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

// Engedélyek definíciója
const PERMISSIONS = {
  camera: { id: 'camera', text: 'Kamera hozzáférés' },
  microphone: { id: 'microphone', text: 'Mikrofon hozzáférés' },
  contacts: { id: 'contacts', text: 'Névjegyek olvasása' },
  sms: { id: 'sms', text: 'SMS olvasás/küldés' },
  location: { id: 'location', text: 'Precíz helyadatok' },
  storage: { id: 'storage', text: 'Teljes tárhely írás/olvasás' }
}

// 3 fix szcenárió
export const SCENARIOS = [
  {
    app: 'zseblámpa',
    permissions: [
      PERMISSIONS.camera,
      PERMISSIONS.microphone,
      PERMISSIONS.contacts
    ],
    risky: ['camera', 'microphone', 'contacts'] // Egy zseblámpának semmilyen engedélyt nem kellene kérnie
  },
  {
    app: 'időjárás app',
    permissions: [
      PERMISSIONS.location,
      PERMISSIONS.contacts,
      PERMISSIONS.sms
    ],
    risky: ['contacts', 'sms'] // Helyadatok logikus, de névjegyek és SMS nem
  },
  {
    app: 'jegyzet app',
    permissions: [
      PERMISSIONS.storage,
      PERMISSIONS.camera,
      PERMISSIONS.microphone
    ],
    risky: ['microphone'] // Tárhely és kamera logikus (jegyzetek mentése, fotó), de mikrofon veszélyes lehet
  }
]

export class RiskyPermissionTask extends BaseTask {
  static create({ id, difficulty }) {
    // Random választás a 3 fix szcenárió közül
    const scenario = Random.choice(SCENARIOS)
    
    // Keverjük össze az engedélyeket
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
      hint: 'Gondold végig, hogy az alkalmazás funkciójához szükséges-e az adott engedély. Ha egy engedély nem kapcsolódik az alkalmazás céljához, az gyanús lehet.'
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


