import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const LEGIT_DOMAINS = ['banksecure.com', 'cybermuseum.org', 'vaultpay.io', 'mailcorp.net']
const SPOOF_PATTERNS = [
  domain => domain.replace('o', '0'),
  domain => `login.${domain}-secure.com`,
  domain => `${domain}.verify-account.org`,
  domain => domain.replace('.com', '-support.com'),
  domain => `${domain.replace('.', '')}.cn`
]

export class UrlTrustTask extends BaseTask {
  static create({ id, difficulty }) {
    const total = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9
    const legitCount = difficulty === 'hard' ? 3 : 4
    const urls = []

    for (let i = 0; i < legitCount; i++) {
      urls.push({ url: `https://${Random.choice(LEGIT_DOMAINS)}`, suspicious: false })
    }
    while (urls.length < total) {
      const base = Random.choice(LEGIT_DOMAINS)
      const spoof = Random.choice(SPOOF_PATTERNS)(base)
      urls.push({ url: `https://${spoof}`, suspicious: true })
    }

    return new UrlTrustTask({
      id,
      difficulty,
      parameters: { urls: Random.shuffle(urls) }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'URL_TRUST', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { urls } = this.parameters
    this.solution = urls
      .map((entry, idx) => (entry.suspicious ? idx : null))
      .filter(idx => idx !== null)
    this.payload = {
      instructions: 'Válaszd ki a hamis vagy gyanús URL-eket.',
      urls: urls.map(entry => entry.url)
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const sortedInput = [...new Set(userInput)].map(Number).sort((a, b) => a - b)
    const sortedSolution = [...this.solution].sort((a, b) => a - b)
    return JSON.stringify(sortedInput) === JSON.stringify(sortedSolution)
  }
}


