import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

// 3 fix szcenárió
export const SCENARIOS = [
  {
    plaintext: 'DATACENTER BREACH',
    key: 'KEY'
  },
  {
    plaintext: 'TRUSTED NODE ALERT',
    key: 'LOCK'
  },
  {
    plaintext: 'SHADOW PROXY ACTIVE',
    key: 'CODE'
  }
]

export class VigenereTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // Random választás a 3 fix szcenárió közül
    const scenario = Random.choice(SCENARIOS)

    return new VigenereTask({
      id,
      difficulty,
      parameters: { 
        plaintext: scenario.plaintext, 
        key: scenario.key,
        levelNumber, 
        slot 
      }
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


