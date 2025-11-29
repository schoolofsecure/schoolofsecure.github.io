import { Random } from './utils/random'
import { styleConfig } from './styleConfig'

const cryptoObj = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : null
import { CaesarTask } from './impl/CaesarTask'
import { VigenereTask } from './impl/VigenereTask'
import { XorTask } from './impl/XorTask'
import { HashMismatchTask } from './impl/HashMismatchTask'
import { IconMemoryTask } from './impl/IconMemoryTask'
import { PasswordStrengthTask } from './impl/PasswordStrengthTask'
import { PhishingRecognitionTask } from './impl/PhishingRecognitionTask'
import { UrlTrustTask } from './impl/UrlTrustTask'
import { LogAnalysisTask } from './impl/LogAnalysisTask'
import { SocialEngineeringTask } from './impl/SocialEngineeringTask'
import { FirewallRulesTask } from './impl/FirewallRulesTask'
import { MisconfigDetectionTask } from './impl/MisconfigDetectionTask'
import { RiskyPermissionTask } from './impl/RiskyPermissionTask'
import { SecurityDecisionTask } from './impl/SecurityDecisionTask'
import { CryptoMiniPuzzleTask } from './impl/CryptoMiniPuzzleTask'
import { PseudoCodeBugTask } from './impl/PseudoCodeBugTask'
import { NetworkAnomalyTask } from './impl/NetworkAnomalyTask'
import { EmailHeaderTask } from './impl/EmailHeaderTask'
import { AttackScenarioTask } from './impl/AttackScenarioTask'
import { ZeroDayTask } from './impl/ZeroDayTask'

/**
 * Feladattípusok regisztrációja típusnév alapján.
 * A Task osztályok type mezőjének meg kell egyeznie a kulccsal.
 */
const TASK_TYPE_MAP = {
  CAESAR: CaesarTask,
  VIGENERE: VigenereTask,
  XOR: XorTask,
  HASH_MISMATCH: HashMismatchTask,
  ICON_MEMORY: IconMemoryTask,
  PASSWORD_STRENGTH: PasswordStrengthTask,
  PHISHING: PhishingRecognitionTask,
  URL_TRUST: UrlTrustTask,
  LOG_ANALYSIS: LogAnalysisTask,
  SOCIAL_ENGINEERING: SocialEngineeringTask,
  FIREWALL: FirewallRulesTask,
  MISCONFIG: MisconfigDetectionTask,
  RISKY_PERMISSION: RiskyPermissionTask,
  SECURITY_DECISION: SecurityDecisionTask,
  CRYPTO_PUZZLE: CryptoMiniPuzzleTask,
  PSEUDOCODE_BUG: PseudoCodeBugTask,
  NETWORK_ANOMALY: NetworkAnomalyTask,
  EMAIL_HEADER: EmailHeaderTask,
  ATTACK_SCENARIO: AttackScenarioTask,
  ZERO_DAY: ZeroDayTask
}

const REGISTERED_TASKS = Object.values(TASK_TYPE_MAP)

export class TaskFactory {
  /**
   * Létrehoz egy véletlenszerű feladatot a styleConfig szerint.
   * @param {string} preferredDifficulty - Preferált nehézség ('easy', 'medium', 'hard')
   * @param {Array<string>|null} preferredTypes - Preferált feladattípusok (pl. ['CAESAR', 'VIGENERE'])
   * @param {number} levelNumber - Pálya száma (opcionális, a komplexitás beállításához)
   * @param {number} slot - Feladat pozíciója a pályán (opcionális)
   * @returns {BaseTask} - Generált feladat
   */
  static createRandomTask(preferredDifficulty, preferredTypes = null, levelNumber = 2, slot = 1) {
    // Feladattípus választása
    let TaskClass
    
    if (preferredTypes && preferredTypes.length > 0) {
      const availablePreferred = preferredTypes
        .filter(type => TASK_TYPE_MAP[type])
        .map(type => TASK_TYPE_MAP[type])

      if (availablePreferred.length > 0) {
        TaskClass = Random.choice(availablePreferred)
      } else {
        TaskClass = TaskFactory._selectTaskByDistribution()
      }
    } else {
      // Nincs preferált típus, teljes eloszlásból választunk
      TaskClass = TaskFactory._selectTaskByDistribution()
    }
    
    const difficulty = preferredDifficulty || Random.choice(['easy', 'medium', 'hard'])
    const id = cryptoObj?.randomUUID ? cryptoObj.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    
    // Feladat létrehozása a styleConfig randomRules szerint
    const task = TaskClass.create({ id, difficulty, levelNumber, slot })
    task.generate()
    return task
  }

  /**
   * Súlyozott választás a styleConfig taskDistribution szerint.
   * @private
   * @returns {Class} - Kiválasztott Task osztály
   */
  static _selectTaskByDistribution() {
    const rnd = Math.random()
    let cumulative = 0
    
    for (const [type, weight] of Object.entries(styleConfig.taskDistribution)) {
      cumulative += weight
      if (rnd <= cumulative) {
        return TASK_TYPE_MAP[type] || Random.choice(REGISTERED_TASKS)
      }
    }
    
    // Fallback
    return Random.choice(REGISTERED_TASKS)
  }
}


