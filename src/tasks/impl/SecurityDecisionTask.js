import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const DECISIONS = [
  {
    title: 'Rejtett kapcsolat',
    scenario: 'A rendszer riaszt: rejtett kapcsolat észlelve.',
    options: ['Azonnal lekapcsolod, ezzel megakadályozva, hogy tovább haladjon', 'Megfigyeled a műveletet, hogy több információt gyűjts róla – vállalva a kockázatot', 'Vársz, és csak akkor lépedsz, ha konkrét adatokat látsz'],
    correctIndex: 0
  },
  {
    title: 'Gyanús hálózati forgalom',
    scenario: 'Gyanús hálózati forgalmat észlelsz egy belső szerverről külső címekre.',
    options: ['Azonnal lekapcsolod a szervert', 'Isolálod a hálózatban és megfigyeled a forgalmat', 'Vársz, hátha megszűnik magától'],
    correctIndex: 1
  },
  {
    title: 'Titkosított kapcsolat kísérlet',
    scenario: 'Ismeretlen folyamat próbál titkosított kapcsolatot létesíteni a rendszerből.',
    options: ['Azonnal leállítod a folyamatot', 'Engeded futni, de naplózod és figyeled', 'Nem csinálsz semmit, lehet normális művelet'],
    correctIndex: 0
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
    const hints = {
      easy: 'A biztonság mindig elsőbbséget élvez. Ha bizonytalan vagy, válaszd a legbiztonságosabb opciót.',
      medium: 'Fontold meg a kockázatokat: a túlzott óvatosság információvesztést, a késlekedés pedig nagyobb kárt okozhat.',
      hard: 'Összetett helyzetekben a biztonsági protokollok és az incidenskezelési eljárások egyensúlyát kell megtalálni.'
    }
    this.payload = {
      instructions: 'Válaszd ki a biztonság szempontjából legjobb döntést minden helyzetben.',
      scenarios,
      hint: hints[this.difficulty] || hints.easy
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


