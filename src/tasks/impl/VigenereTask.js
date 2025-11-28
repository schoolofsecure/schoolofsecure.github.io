import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Bővített plaintext pool több variációval
const VIGENERE_TEXTS = [
  'DATACENTER BREACH',
  'TRUSTED NODE ALERT',
  'SHADOW PROXY ACTIVE',
  'MONITOR ALL CHANNELS',
  'ARCHIVE LOCKDOWN ENABLED',
  'FORENSIC TEAM EN ROUTE',
  'SURVEILLANCE GRID ONLINE',
  'ENCRYPTED MESSAGE FOUND',
  'SECRET KEY DISCOVERED',
  'INTRUSION DETECTED NOW',
  'BACKUP SYSTEM RESTORED',
  'FIREWALL BYPASSED HERE',
  'ROOT ACCESS GAINED',
  'DATA EXFILTRATED',
  'ZERO DAY EXPLOIT'
]

export class VigenereTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // styleConfig randomRules használata
    const rules = StyleHelper.getRandomRules('VIGENERE')
    const keyLengths = rules.keyLengths?.[difficulty] || { easy: [3, 4], medium: [5, 6], hard: [7, 10] }
    
    const pool = {
      easy: VIGENERE_TEXTS.slice(0, 5),
      medium: VIGENERE_TEXTS.slice(2, 10),
      hard: VIGENERE_TEXTS
    }

    const [min, max] = keyLengths
    const key = Random.string(Random.int(min, max), { upper: true, lower: false, numbers: false })
    const plaintext = Random.choice(pool[difficulty])

    return new VigenereTask({
      id,
      difficulty,
      parameters: { plaintext, key, levelNumber, slot }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'VIGENERE', difficulty, parameters })
  }

  static encode(text, key) {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const normalized = text.toUpperCase().replace(/[^A-Z]/g, '')
    let result = ''
    for (let i = 0; i < normalized.length; i++) {
      const t = A.indexOf(normalized[i])
      const k = A.indexOf(key[i % key.length].toUpperCase())
      result += A[(t + k) % 26]
    }
    return result
  }

  generate() {
    if (this.payload) return this.payload
    const { plaintext, key, levelNumber, slot } = this.parameters
    
    // Fix narratíva minden VigenereTask-nál
    const narrative = {
      intro: 'A hálózat mélyén titkosított adatok rejtőznek. A biztonsági rendszer riasztásai egyre gyakoribbá válnak.',
      task: 'A Vigenère-kóddal titkosított üzenet a rendszer mélyén rejtőzik. Fejtsd meg a kulcsot és olvasd el a rejtett információt.',
      hint: 'A Vigenère-kód egy kulcsszó alapján működik. Minden betűhöz a kulcs megfelelő betűjét használja az eltoláshoz.'
    }
    const ciphertext = VigenereTask.encode(plaintext, key)
    this.solution = plaintext.toUpperCase().replace(/[^A-Z]/g, '')
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      ciphertext,
      key,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput) return false
    const normalized = userInput.toUpperCase().replace(/[^A-Z]/g, '')
    if (!this.solution) this.generate()
    return normalized === this.solution
  }
}


