import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

// 3 fix szcenárió (3 legit + 3 gyanús URL, összesen 6)
export const SCENARIOS = [
  {
    urls: [
      { url: 'https://banksecure.com', suspicious: false },
      { url: 'https://cybermuseum.org', suspicious: false },
      { url: 'https://vaultpay.io', suspicious: false },
      { url: 'https://banksecure0.com', suspicious: true },
      { url: 'https://login.cybermuseum.org-secure.com', suspicious: true },
      { url: 'https://vaultpay.io.verify-account.org', suspicious: true }
    ]
  },
  {
    urls: [
      { url: 'https://mailcorp.net', suspicious: false },
      { url: 'https://banksecure.com', suspicious: false },
      { url: 'https://cybermuseum.org', suspicious: false },
      { url: 'https://mailcorp.net-support.com', suspicious: true },
      { url: 'https://banksecure.com.verify-account.org', suspicious: true },
      { url: 'https://cybermuseum0.org', suspicious: true }
    ]
  },
  {
    urls: [
      { url: 'https://vaultpay.io', suspicious: false },
      { url: 'https://mailcorp.net', suspicious: false },
      { url: 'https://banksecure.com', suspicious: false },
      { url: 'https://vaultpayio.cn', suspicious: true },
      { url: 'https://login.mailcorp.net-secure.com', suspicious: true },
      { url: 'https://banksecure.com-support.com', suspicious: true }
    ]
  }
]

export class UrlTrustTask extends BaseTask {
  static create({ id, difficulty }) {
    // Random választás a 3 fix szcenárió közül
    const scenario = Random.choice(SCENARIOS)

    return new UrlTrustTask({
      id,
      difficulty,
      parameters: { urls: Random.shuffle([...scenario.urls]) }
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
      urls: urls.map(entry => entry.url),
      hint: 'A gyanús URL-ek gyakran hasonlítanak a megbízható domainekhez, de tartalmaznak apró eltéréseket. Figyeld meg alaposan a domain neveket és hasonlítsd össze őket a megbízható domainekkel.'
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


