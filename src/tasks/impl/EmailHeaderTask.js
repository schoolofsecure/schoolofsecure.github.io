import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

// 3 fix szcenárió (easy módban csak SPF ellenőrzés)
export const SCENARIOS = [
  {
    from: 'alerts@banksecure.com',
    received: [
      'from smtp.banksecure.com (10.10.10.5) by mx.banksecure.com',
      'from userpc.banksecure.com (192.0.2.10) by smtp.banksecure.com'
    ],
    spf: 'pass',
    dkim: 'pass',
    anomalyIndex: null
  },
  {
    from: 'security@cybermuseum.org',
    received: [
      'from mail.randomhost.ru (203.0.113.55) by mx.cybermuseum.org',
      'from localhost (127.0.0.1) by mail.randomhost.ru'
    ],
    spf: 'fail',
    dkim: 'fail',
    anomalyIndex: 0
  },
  {
    from: 'support@vaultpay.io',
    received: [
      'from webmail.vaultpay.io (198.51.100.44) by mx.vaultpay.io',
      'from suspicious-node (185.1.1.1) by webmail.vaultpay.io'
    ],
    spf: 'neutral',
    dkim: 'pass',
    anomalyIndex: 1
  }
]

export class EmailHeaderTask extends BaseTask {
  static create({ id, difficulty }) {
    // Random választás a 3 fix szcenárió közül
    const template = Random.choice(SCENARIOS)
    const hints = difficulty === 'easy'
      ? ['Keresd a SPF státuszt.']
      : difficulty === 'medium'
        ? ['Ellenőrizd a Received láncot.']
        : ['Vizsgáld az IP-ket és az SPF/DKIM mezőket is.']

    return new EmailHeaderTask({
      id,
      difficulty,
      parameters: { template, hints, difficulty }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'EMAIL_HEADER', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { template, hints, difficulty } = this.parameters
    const issues = []
    
    // Easy módban csak SPF-et ellenőrizünk
    if (difficulty === 'easy') {
      if (template.spf !== 'pass') issues.push('spf')
    } else {
      if (template.spf !== 'pass') issues.push('spf')
      if (template.dkim !== 'pass') issues.push('dkim')
      if (template.anomalyIndex !== null) issues.push(`received-${template.anomalyIndex}`)
    }
    
    this.solution = issues
    this.payload = {
      header: template,
      hints,
      hint: difficulty === 'easy'
        ? 'Az SPF (Sender Policy Framework) ellenőrzi, hogy az e-mail küldője jogosult-e az adott domainről küldeni. A "pass" státusz azt jelenti, hogy minden rendben, más értékek gyanúsak lehetnek.'
        : 'Az SPF és DKIM hitelesítési protokollok ellenőrzik az e-mail eredetét. A "pass" státusz azt jelenti, hogy minden rendben, más értékek gyanúsak lehetnek. A Received lánc mutatja az e-mail útvonalát.'
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const normalized = [...new Set(userInput)].sort()
    const solutionSorted = [...this.solution].sort()
    return JSON.stringify(normalized) === JSON.stringify(solutionSorted)
  }
}


