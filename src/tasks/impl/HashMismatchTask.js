import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { fauxHash } from '../utils/hash'

const WORD_BANK = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo',
  'foxtrot', 'golf', 'hotel', 'india', 'juliet',
  'kilo', 'lima', 'mike', 'november', 'oscar'
]

const hashString = (algorithm, text) => fauxHash(algorithm, text)

export class HashMismatchTask extends BaseTask {
  static create({ id, difficulty }) {
    const countMap = { easy: 3, medium: 5, hard: 7 }
    const algorithms = difficulty === 'easy'
      ? ['md5']
      : difficulty === 'medium'
        ? ['md5', 'sha1']
        : ['md5', 'sha1', 'sha256']

    const entries = Random.sample(WORD_BANK, countMap[difficulty]).map(word => {
      const algo = Random.choice(algorithms)
      return { word, algorithm: algo, hash: hashString(algo, word) }
    })

    const mismatchIndex = Random.int(0, entries.length - 1)
    const wrongWord = entries[mismatchIndex].word + 'x'
    entries[mismatchIndex].hash = hashString(entries[mismatchIndex].algorithm, wrongWord)

    return new HashMismatchTask({
      id,
      difficulty,
      parameters: { entries, mismatchIndex }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'HASH_MISMATCH', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { entries } = this.parameters
    this.solution = this.parameters.mismatchIndex
    this.payload = {
      instructions: 'One hash in the list below does not match its input word. Select the incorrect row.',
      entries
    }
    return this.payload
  }

  validate(userInput) {
    if (typeof userInput !== 'number') return false
    if (this.solution === null || this.solution === undefined) this.generate()
    return userInput === this.solution
  }
}
