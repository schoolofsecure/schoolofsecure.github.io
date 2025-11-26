const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'
const symbols = '!@#$%^&*()_-+=[]{};:,./?<>\'\"'

export const Random = {
  int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
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
      const j = Math.floor(Math.random() * (i + 1))
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
    const rnd = Math.random()
    let cumulative = 0
    for (const [key, weight] of Object.entries(weights)) {
      cumulative += weight
      if (rnd <= cumulative) return key
    }
    return Object.keys(weights)[0]
  }
}


