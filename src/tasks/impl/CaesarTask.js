import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Expanded plaintext pool with more variations
const SAMPLE_PLAINTEXTS = [
  'HELLO WORLD',
  'SECURE CHANNEL',
  'CYBER DEFENCE',
  'TRUST NO ONE',
  'ACCESS GRANTED',
  'ZERO DAY ALERT',
  'AGENT REPORT',
  'LOCKDOWN ACTIVE',
  'BREACH DETECTED',
  'NETWORK WATCH',
  'SHADOW PROTOCOL',
  'DARK WEB ACCESS',
  'ENCRYPTED MESSAGE',
  'SECRET KEY FOUND',
  'ALERT SYSTEM DOWN',
  'INTRUSION DETECTED',
  'BACKUP RESTORED',
  'FIREWALL BYPASSED',
  'ROOT ACCESS GAINED',
  'DATA EXFILTRATED'
]

export class CaesarTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    const rules = StyleHelper.getRandomRules('CAESAR')
    const shiftRange = rules.shifts?.[difficulty] || { easy: [1, 5], medium: [6, 15], hard: [16, 25] }
    
    const plaintextPool = {
      easy: SAMPLE_PLAINTEXTS.slice(0, 6),
      medium: SAMPLE_PLAINTEXTS.slice(3, 12),
      hard: SAMPLE_PLAINTEXTS
    }

    const [min, max] = shiftRange
    const plaintext = Random.choice(plaintextPool[difficulty])
    const shift = Random.int(min, max)

    return new CaesarTask({
      id,
      difficulty,
      parameters: { plaintext, shift, levelNumber, slot }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'CAESAR', difficulty, parameters })
  }

  static encode(text, shift) {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        const idx = base.indexOf(char)
        if (idx === -1) return char
        return base[(idx + shift) % 26]
      })
      .join('')
  }

  generate() {
    if (this.payload) return this.payload
    const { plaintext, shift, levelNumber, slot } = this.parameters
    
    const narrative = {
        intro: 'Under cover of night, hidden traces wait deep inside the system. In the flickering glow of the monitors, signs of suspicious activity begin to surface.',
        task: 'Strange characters flash on the screen, as if someone hurried to hide a message. Decrypt the ciphertext to uncover your first lead.',
        hint: 'Think of the alphabet as a line where each letter shifts a few steps forward or back. Spaces and punctuation stay unchanged.'
    }
    const ciphertext = CaesarTask.encode(plaintext, shift)
    this.solution = plaintext.toUpperCase().replace(/\s+/g, ' ')
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      ciphertext,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput) return false
    const normalized = userInput.toUpperCase().replace(/\s+/g, ' ').trim()
    if (!this.solution) this.generate()
    return normalized === this.solution
  }
}
