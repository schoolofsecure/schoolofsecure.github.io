import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

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
    const template = Random.choice(SCENARIOS)
    const hints = difficulty === 'easy'
      ? ['Look for the SPF status.']
      : difficulty === 'medium'
        ? ['Check the Received chain.']
        : ['Review the IPs and SPF/DKIM fields.']

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
        ? 'SPF (Sender Policy Framework) checks whether the sender is authorised to send from the domain. A "pass" status means all is well; other values may be suspicious.'
        : 'SPF and DKIM authentication verify email origin. A "pass" status means all is well; other values may be suspicious. The Received chain shows the email\'s path.'
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
