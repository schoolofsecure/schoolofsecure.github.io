import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const REQUIREMENT_LABELS = {
  minLength: 'at least 8 characters',
  mixedCase: 'both uppercase and lowercase letters',
  number: 'contains a number',
  special: 'contains a special character',
  noDictionary: 'must not contain a forbidden word',
  entropy: 'must not repeat the same character three times'
}

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
    const hintByDifficulty = {
      easy: 'Check whether the password includes a number and is long enough. Special characters are not required here.',
      medium: 'A strong password should mix upper- and lowercase letters, numbers and special characters.',
      hard: 'Avoid forbidden words (password, admin, etc.) and make sure characters do not repeat too often.'
    }
    this.payload = {
      instructions: 'Rate the password strength based on the listed requirements.',
      candidate,
      requirements: requirements.map(req => REQUIREMENT_LABELS[req] || req),
      hint: hintByDifficulty[this.difficulty] || 'Check whether the password meets all listed rules.'
    }
    return this.payload
  }

  validate(userInput) {
    if (!this.payload) this.generate()
    return Boolean(userInput) === Boolean(this.solution)
  }
}
