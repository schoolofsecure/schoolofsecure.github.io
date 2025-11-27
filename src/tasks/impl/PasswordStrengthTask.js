import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const REQUIREMENT_LABELS = {
  minLength: 'legalább 8 karakter',
  mixedCase: 'nagybetű és kisbetű is',
  number: 'tartalmaz számot',
  special: 'tartalmaz speciális karaktert',
  noDictionary: 'ne tartalmazzon tiltott szót',
  entropy: 'ne ismételje háromszor ugyanazt a karaktert'
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
      easy: 'Figyeld meg: kell-e szám, és elég hosszú‑e a jelszó. A speciális karakterek itt még nem kötelezők.',
      medium: 'A megfelelő jelszó vegyes kis- és nagybetűt, számot és speciális jelet is tartalmazzon.',
      hard: 'A tiltott szavakat (password, admin stb.) kerüld, és ügyelj arra is, hogy ne ismétlődjön túl sok karakter.'
    }
    this.payload = {
      instructions: 'Értékeld a jelszó erősségét a felsorolt követelmények alapján.',
      candidate,
      requirements: requirements.map(req => REQUIREMENT_LABELS[req] || req),
      hint: hintByDifficulty[this.difficulty] || 'Vizsgáld meg, hogy a jelszó teljesíti‑e a felsorolt szabályokat.'
    }
    return this.payload
  }

  validate(userInput) {
    if (!this.payload) this.generate()
    return Boolean(userInput) === Boolean(this.solution)
  }
}


