const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'
const symbols = '!@#$%^&*()_-+=[]{};:,./?<>\'\"'

// Seed-alapú PRNG (Linear Congruential Generator)
class SeededRandom {
  constructor(seed = null) {
    this.seed = seed !== null ? seed : Math.floor(Math.random() * 2147483647)
    this.state = this.seed
  }

  next() {
    this.state = (this.state * 1103515245 + 12345) & 0x7fffffff
    return this.state / 0x7fffffff
  }

  reset() {
    this.state = this.seed
  }
}

// Globális seed state
let globalSeed = null
let seededRng = null

export const Random = {
  /**
   * Beállítja a seed értékét. Ha null, akkor random módba vált.
   * @param {number|null} seed - Seed érték vagy null
   */
  setSeed(seed) {
    globalSeed = seed
    seededRng = seed !== null ? new SeededRandom(seed) : null
  },

  /**
   * Visszaadja a jelenlegi seed értékét.
   * @returns {number|null}
   */
  getSeed() {
    return globalSeed
  },

  /**
   * Visszaállítja a seed-et (random mód).
   */
  resetSeed() {
    Random.setSeed(null)
  },

  /**
   * Visszaad egy random számot (0-1 között). Ha seed van beállítva, determinisztikus.
   */
  random() {
    if (seededRng) {
      return seededRng.next()
    }
    return Math.random()
  },

  int(min, max) {
    return Math.floor(Random.random() * (max - min + 1)) + min
  },
  choice(list) {
    return list[Random.int(0, list.length - 1)]
  },
  sample(list, count) {
    const copy = [...list]
    const result = []
    while (result.length < Math.min(count, list.length)) {
      const idx = Random.int(0, copy.length - 1)
      result.push(copy.splice(idx, 1)[0])
    }
    return result
  },
  shuffle(list) {
    const copy = [...list]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Random.int(0, i)
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  },
  string(length, { upper = true, lower = true, numbers = true, special = false } = {}) {
    let pool = ''
    if (upper) pool += letters
    if (lower) pool += lowerLetters
    if (numbers) pool += digits
    if (special) pool += symbols
    if (!pool) pool = letters
    return Array.from({ length }, () => pool[Random.int(0, pool.length - 1)]).join('')
  },
  pickDifficultyWeights(level) {
    if (level <= 2) return { easy: 0.6, medium: 0.35, hard: 0.05 }
    if (level <= 4) return { easy: 0.4, medium: 0.45, hard: 0.15 }
    if (level <= 7) return { easy: 0.25, medium: 0.5, hard: 0.25 }
    return { easy: 0.1, medium: 0.45, hard: 0.45 }
  },
  weightedChoice(weights) {
    const rnd = Random.random()
    let cumulative = 0
    for (const [key, weight] of Object.entries(weights)) {
      cumulative += weight
      if (rnd <= cumulative) return key
    }
    return Object.keys(weights)[0]
  }
}


