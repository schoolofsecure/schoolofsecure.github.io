/**
 * Helper functions for using styleConfig.
 */
import { styleConfig } from '../styleConfig'
import { Random } from './random'

export const StyleHelper = {
  getRandomRules(taskType) {
    return styleConfig.randomRules[taskType] || {}
  },

  getComplexity(difficulty) {
    return styleConfig.complexity[difficulty] || styleConfig.complexity.easy
  },

  generateNarrative(type, context = {}) {
    const narratives = {
      intro: [
        'Under cover of night, hidden clues wait deep inside the system.',
        'In the flickering glow of the monitors, signs of suspicious activity appear.',
        'Messages hidden in the log files are waiting to be decoded.',
        'Encrypted data lurks in the depths of the network.',
        'The security system alerts are growing more frequent.'
      ],
      taskDescription: [
        'Analyze the available data and look for suspicious patterns.',
        'You need to uncover the information hidden behind the encrypted messages.',
        'Watch for anomalies and identify the threat.',
        'Search the log files for the key to the solution.',
        'Signals coming through the communication channels need your analysis.'
      ],
      hint: [
        'Think about what patterns you are looking for.',
        'Watch the details — that is where the answer hides.',
        'The key often shows up in the most unexpected place.',
        'Do not rush — analyze the data carefully.',
        'The system always leaves traces; you just have to find them.'
      ]
    }

    const pool = narratives[type] || narratives.intro
    return Random.choice(pool)
  },

  generateFeedback(success) {
    if (success) {
      const messages = [
        'Clue confirmed.',
        'Correct!',
        'You are moving forward in the investigation.',
        'You can take the next step.',
        'Good direction!'
      ]
      return Random.choice(messages)
    } else {
      const messages = [
        'Something is off — try again.',
        'Watch the details — that is where the answer hides.',
        'Not quite — give it another shot.',
        'You are close, but that is not the answer.',
        'Walk through the steps again.'
      ]
      return Random.choice(messages)
    }
  }
}
