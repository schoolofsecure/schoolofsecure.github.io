import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = [
  {
    id: 'phone',
    text: 'Valakitől telefonhívást kapsz, aki az IT osztálynak mondja magát és a VPN jelszavadat kéri.',
    correctAction: 'refuse_and_report'
  },
  {
    id: 'tailgating',
    text: 'Az irodaház bejáratánál egy vendégkártyás ismeretlen kér, hogy engedd be.',
    correctAction: 'deny_and_call_security'
  },
  {
    id: 'usb_drop',
    text: 'A parkolóban találsz egy céges logóval ellátott USB-t.',
    correctAction: 'submit_to_it'
  },
  {
    id: 'fake_hr',
    text: 'E-mailben egy „HR munkatárs” személyes adatlapot kér, csatolt dokumentumban.',
    correctAction: 'verify_channel_first'
  }
]

export class SocialEngineeringTask extends BaseTask {
  static create({ id, difficulty }) {
    const scenarioCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    const scenarios = Random.sample(SCENARIOS, scenarioCount)

    return new SocialEngineeringTask({
      id,
      difficulty,
      parameters: { scenarios }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'SOCIAL_ENGINEERING', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenarios } = this.parameters
    this.solution = scenarios.map(s => s.correctAction)
    this.payload = {
      instructions: 'Minden szituációra válaszd ki a megfelelő reakciót.',
      scenarios
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    if (userInput.length !== this.solution.length) return false
    return userInput.every((choice, idx) => choice === this.solution[idx])
  }
}


