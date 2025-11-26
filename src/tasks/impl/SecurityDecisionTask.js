import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const DECISIONS = [
  {
    scenario: 'Egy külső beszállító admin hozzáférést kér ideiglenesen.',
    options: ['Teljes hozzáférés adása', 'Szerepkör alapú korlátozás és audit log', 'Azonnali elutasítás'],
    correctIndex: 1
  },
  {
    scenario: 'A fejlesztői környezetben érzékeny ügyféladatot találsz.',
    options: ['Figyelmen kívül hagyod', 'Jelented a DPO-nak és incidensként zárod', 'Lemásolod vizsgálathoz'],
    correctIndex: 1
  },
  {
    scenario: 'Ismeretlen e-mail csatolmányt kapsz a vezérigazgató nevében.',
    options: ['Megnyitod azonnal', 'Ellenőrzöd a fejlécet és jelentést teszel', 'Továbbítod kollégának'],
    correctIndex: 1
  }
]

export class SecurityDecisionTask extends BaseTask {
  static create({ id, difficulty }) {
    const count = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3
    const scenarios = Random.sample(DECISIONS, count)

    return new SecurityDecisionTask({
      id,
      difficulty,
      parameters: { scenarios }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'SECURITY_DECISION', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenarios } = this.parameters
    this.solution = scenarios.map(s => s.correctIndex)
    this.payload = {
      instructions: 'Válaszd ki a biztonság szempontjából legjobb döntést minden helyzetben.',
      scenarios
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    if (userInput.length !== this.solution.length) return false
    return userInput.every((choice, idx) => Number(choice) === this.solution[idx])
  }
}


