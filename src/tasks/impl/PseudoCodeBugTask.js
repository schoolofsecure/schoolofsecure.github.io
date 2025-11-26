import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SNIPPETS = [
  {
    language: 'pseudo',
    lines: [
      'function authenticate(username, password) {',
      '  hash = sha256(password)',
      '  if (hash == storedHash) {',
      '    return true',
      '  }',
      '  return false',
      '}'
    ],
    issueLine: 2,
    description: 'Hash-elés előtt nincs só használva'
  },
  {
    language: 'pseudo',
    lines: [
      'query = "SELECT * FROM users WHERE name = \'" + input + "\'"',
      'result = db.execute(query)',
      'return result'
    ],
    issueLine: 1,
    description: 'SQL injection veszély'
  },
  {
    language: 'pseudo',
    lines: [
      'token = crypto.randomBytes(4)',
      'cache.store(userId, token)',
      'return token'
    ],
    issueLine: 1,
    description: 'Gyenge token hossz'
  }
]

export class PseudoCodeBugTask extends BaseTask {
  static create({ id, difficulty }) {
    const snippet = Random.choice(SNIPPETS)
    const extraHints = difficulty === 'hard'
      ? ['Figyeld meg a függvény paramétereit és a visszatérési értékeket.']
      : []

    return new PseudoCodeBugTask({
      id,
      difficulty,
      parameters: { snippet, extraHints }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'PSEUDOCODE_BUG', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { snippet, extraHints } = this.parameters
    this.solution = snippet.issueLine
    this.payload = {
      instructions: 'Jelöld meg, melyik sor tartalmaz biztonsági hibát.',
      snippet,
      hints: extraHints
    }
    return this.payload
  }

  validate(userInput) {
    if (typeof userInput !== 'number') return false
    if (this.solution === null) this.generate()
    return userInput === this.solution
  }
}


