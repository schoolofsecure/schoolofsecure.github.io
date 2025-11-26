import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const PASSWORD_HINTS = [
  'legalább 8 karakter',
  'nagybetű és kisbetű is',
  'szám és speciális karakter',
  'ne tartalmazzon tiltott szót',
  'ne ismételje háromszor ugyanazt a karaktert'
]

export class PasswordStrengthTask extends BaseTask {
  static create({ id, difficulty }) {
    const requirements = {
      easy: ['minLength', 'number'],
      medium: ['minLength', 'number', 'special', 'mixedCase'],
      hard: ['minLength', 'number', 'special', 'mixedCase', 'noDictionary', 'entropy']
    }

    const samplePasswords = {
      easy: ['password1', 'Cyber2024', 'Secret123'],
      medium: ['P@ssphrase88', 'Vault#2025', 'Control99!'],
      hard: ['S3cure!Matrix2025', 'ZeroDay#Signal42', 'KeyGrid99!!']
    }

    return new PasswordStrengthTask({
      id,
      difficulty,
      parameters: {
        requirements: requirements[difficulty],
        candidate: Random.choice(samplePasswords[difficulty])
      }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'PASSWORD_STRENGTH', difficulty, parameters })
  }

  static evaluate(password, rules) {
    const checks = {
      minLength: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|]/.test(password),
      mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
      noDictionary: !/password|secret|admin|cyber/i.test(password),
      entropy: new Set(password).size >= Math.min(6, password.length)
    }
    return rules.every(rule => checks[rule])
  }

  generate() {
    if (this.payload) return this.payload
    const { requirements, candidate } = this.parameters
    this.solution = PasswordStrengthTask.evaluate(candidate, requirements)
    this.payload = {
      instructions: 'Értékeld a jelszó erősségét a felsorolt követelmények alapján.',
      candidate,
      requirements: requirements.map(req => PASSWORD_HINTS[['minLength','mixedCase','number','special','noDictionary','entropy'].indexOf(req)] || req)
    }
    return this.payload
  }

  validate(userInput) {
    if (!this.payload) this.generate()
    return Boolean(userInput) === Boolean(this.solution)
  }
}


