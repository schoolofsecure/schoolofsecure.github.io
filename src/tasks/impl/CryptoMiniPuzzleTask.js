import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { fauxHash } from '../utils/hash'

export class CryptoMiniPuzzleTask extends BaseTask {
  static create({ id, difficulty }) {
    const steps = difficulty === 'easy'
      ? ['base64']
      : difficulty === 'medium'
        ? ['base64', 'xor']
        : ['base64', 'xor', 'hash']

    const secret = Random.string(difficulty === 'hard' ? 12 : 8, { upper: true, lower: true, numbers: true })
    const xorKey = Random.string(difficulty === 'hard' ? 3 : 1, { upper: true, lower: false, numbers: true })

    return new CryptoMiniPuzzleTask({
      id,
      difficulty,
      parameters: { steps, secret, xorKey }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'CRYPTO_PUZZLE', difficulty, parameters })
  }

  static xor(str, key) {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const keyBuf = encoder.encode(key)
    const result = new Uint8Array(data.length)
    
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ keyBuf[i % keyBuf.length]
    }
    
    return Array.from(result)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  static toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)))
  }

  generate() {
    if (this.payload) return this.payload
    const { steps, secret, xorKey } = this.parameters
    let intermediate = secret

    steps.forEach(step => {
      if (step === 'base64') intermediate = CryptoMiniPuzzleTask.toBase64(intermediate)
      if (step === 'xor') intermediate = CryptoMiniPuzzleTask.xor(intermediate, xorKey)
      if (step === 'hash') intermediate = fauxHash('sha256', intermediate)
    })

    this.solution = secret
    this.payload = {
      instructions: `The following transformations were applied: ${steps.join(' → ')}. Reverse them to recover the original string.`,
      output: intermediate,
      hint: steps.includes('xor') ? `XOR key: ${xorKey}` : undefined
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput) return false
    if (!this.solution) this.generate()
    return userInput.trim() === this.solution
  }
}
