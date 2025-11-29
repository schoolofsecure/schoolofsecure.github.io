import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const HEADER_TEMPLATES = [
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
    from: 'alerts@banksecure.com',
    received: [
      'from mail.randomhost.ru (203.0.113.55) by mx.banksecure.com',
      'from localhost (127.0.0.1) by mail.randomhost.ru'
    ],
    spf: 'fail',
    dkim: 'fail',
    anomalyIndex: 0
  },
  {
    from: 'security@cybermuseum.org',
    received: [
      'from webmail.cybermuseum.org (198.51.100.44) by mx.cybermuseum.org',
      'from suspicious-node (185.1.1.1) by webmail.cybermuseum.org'
    ],
    spf: 'neutral',
    dkim: 'fail',
    anomalyIndex: 1
  }
]

export class EmailHeaderTask extends BaseTask {
  static create({ id, difficulty }) {
    const template = Random.choice(HEADER_TEMPLATES)
    const hints = difficulty === 'easy'
      ? ['Keresd a SPF/DKIM státuszokat.']
      : difficulty === 'medium'
        ? ['Ellenőrizd a Received láncot.']
        : ['Vizsgáld az IP-ket és az SPF/DKIM mezőket is.']

    return new EmailHeaderTask({
      id,
      difficulty,
      parameters: { template, hints }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'EMAIL_HEADER', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { template, hints } = this.parameters
    const issues = []
    if (template.spf !== 'pass') issues.push('spf')
    if (template.dkim !== 'pass') issues.push('dkim')
    if (template.anomalyIndex !== null) issues.push(`received-${template.anomalyIndex}`)
    this.solution = issues
    this.payload = {
      instructions: 'Elemezd az e-mail fejléceket és jelöld meg a gyanús jeleket.',
      header: template,
      hints
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


