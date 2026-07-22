import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

const ICON_SET = [
  { id: 'lock', label: 'Lock icon', type: 'safe' },
  { id: 'shield', label: 'Shield icon', type: 'safe' },
  { id: 'skull', label: 'Skull icon', type: 'threat' },
  { id: 'bug', label: 'Bug icon', type: 'threat' },
  { id: 'email', label: 'Email icon', type: 'neutral' },
  { id: 'wifi', label: 'Wi-Fi icon', type: 'neutral' },
  { id: 'warning', label: 'Warning icon', type: 'threat' },
  { id: 'key', label: 'Key icon', type: 'safe' },
  { id: 'firewall', label: 'Firewall icon', type: 'safe' },
  { id: 'virus', label: 'Virus icon', type: 'threat' },
  { id: 'hacker', label: 'Hacker icon', type: 'threat' },
  { id: 'database', label: 'Database icon', type: 'neutral' },
  { id: 'server', label: 'Server icon', type: 'neutral' },
  { id: 'encryption', label: 'Encryption icon', type: 'safe' }
]

export class IconMemoryTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    const rules = StyleHelper.getRandomRules('ICON_MEMORY')
    const complexity = StyleHelper.getComplexity(difficulty)
    
    const pairCount = rules.pairs?.[difficulty] || complexity.iconCount || 
                     (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)
    const chosen = Random.sample(ICON_SET, pairCount * 2)
    const requiredTypes = chosen.filter(icon => icon.type === 'threat').map(icon => icon.id)

    return new IconMemoryTask({
      id,
      difficulty,
      parameters: {
        icons: chosen,
        requiredTypes,
        levelNumber,
        slot
      }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'ICON_MEMORY', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { icons, requiredTypes, levelNumber, slot } = this.parameters
    
    const narratives = [
      {
        intro: 'Technicians found a strange text grid inside an archived data packet. Someone deliberately hid keywords inside it.',
        task: 'Security needs you to find the hidden words — they lead to the next lead. But watch out: the attacker always leaves a false trail too.',
        hint: 'Each word\'s first letter hides a number. Look for hidden keywords in the grid to reach the next code.'
      },
      {
        intro: 'In the flickering glow of the monitors, suspicious activity appears among the system icons.',
        task: 'Remember which icons signal risk (e.g. malware/phishing), then select them. The memory test helps identify threats.',
        hint: 'Watch the details — that is where the answer hides. Dangerous icons often look similar to safe ones.'
      },
      {
        intro: 'Encrypted data hides deep in the network. Security alerts are growing more frequent.',
        task: 'Suspicious elements appear among the system icons. Identify the icons that indicate a potential security risk.',
        hint: 'Take your time and analyse carefully. The system always leaves traces — you just have to find them.'
      }
    ]
    
    const narrative = Random.choice(narratives)
    this.solution = requiredTypes
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      icons,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const sortedInput = [...new Set(userInput)].sort()
    const sortedSolution = [...new Set(this.solution)].sort()
    return JSON.stringify(sortedInput) === JSON.stringify(sortedSolution)
  }
}
