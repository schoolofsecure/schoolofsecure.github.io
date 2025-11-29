import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const ASCII_WORDS = [
  'SIGNAL',
  'VECTOR',
  'ENIGMA',
  'CIPHER',
  'MODULE',
  'CONTROL',
  'SECURE',
  'PACKET'
]

export class XorTask extends BaseTask {
  static create({ id, difficulty }) {
    const lengthMap = { easy: [4, 6], medium: [6, 8], hard: [8, 12] }
    const [minLen, maxLen] = lengthMap[difficulty]
    const word = Random.choice(ASCII_WORDS)
    const plaintext = Random.string(Random.int(minLen, maxLen), { upper: true, lower: true, numbers: true })
    const keyLength = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 4
    const key = Random.string(keyLength, { upper: true, lower: true, numbers: true })

    return new XorTask({
      id,
      difficulty,
      parameters: { plaintext: plaintext + word, key }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'XOR', difficulty, parameters })
  }

  static xorStrings(text, key) {
    const encoder = new TextEncoder()
    const textBytes = encoder.encode(text)
    const keyBytes = encoder.encode(key)
    const result = textBytes.map((byte, idx) => byte ^ keyBytes[idx % keyBytes.length])
    return Array.from(result)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  generate() {
    if (this.payload) return this.payload
    const { plaintext, key } = this.parameters
    const ciphertext = XorTask.xorStrings(plaintext, key)
    this.solution = plaintext
    this.payload = {
      instructions: 'Az alábbi hexadecimális XOR eredményt kell visszafejteni.',
      ciphertext,
      keyHint: key.length === 1 ? 'Kulcs hossza: 1 byte' : `Kulcs hossza: ${key.length} karakter`
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput) return false
    if (!this.solution) this.generate()
    return userInput.trim() === this.solution
  }
}


