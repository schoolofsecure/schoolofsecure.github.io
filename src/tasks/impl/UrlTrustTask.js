import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

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
      urls: urls.map(entry => entry.url),
      hint: 'Suspicious URLs often mimic trusted domains with small differences. Compare domain names carefully against the legitimate ones.'
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
