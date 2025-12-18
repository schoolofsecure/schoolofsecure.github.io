import { TaskFactory } from './TaskFactory'
import { Random } from './utils/random'
import { styleConfig } from './styleConfig'
import { LEVEL_1_TASK_TYPES } from './level1Types'

// Összes feladattípus listája
const ALL_TASK_TYPES = [
  'CAESAR', 'VIGENERE', 'XOR', 'HASH_MISMATCH', 'ICON_MEMORY',
  'PASSWORD_STRENGTH', 'PHISHING', 'URL_TRUST', 'LOG_ANALYSIS',
  'SOCIAL_ENGINEERING', 'FIREWALL', 'MISCONFIG', 'RISKY_PERMISSION',
  'SECURITY_DECISION', 'CRYPTO_PUZZLE', 'PSEUDOCODE_BUG',
  'NETWORK_ANOMALY', 'EMAIL_HEADER', 'ATTACK_SCENARIO', 'ZERO_DAY'
]

export class LevelGenerator {
  /**
   * Generál egy pályát a styleConfig szerint, típus rotációval.
   * @param {number} levelNumber - Pálya száma (2-től kezdve)
   * @param {number} tasksPerLevel - Feladatok száma pályánként (alapértelmezett: 5)
   * @param {Map<number, Set<string>>} typeHistory - Típus előfordulások pályánként (pálya szám -> típusok halmaza)
   * @param {number} cooldown - Hány pálya után használható újra egy típus (alapértelmezett: 4)
   * @param {Object} options - Opcionális beállítások
   * @param {number|null} options.seed - Seed érték determinisztikus generáláshoz
   * @param {Array<string>|null} options.forcedTypes - Kényszerített típusok listája (QA debug módhoz)
   * @returns {Array<BaseTask>} - Generált feladatok listája
   */
  static generateLevel(levelNumber, tasksPerLevel = 5, typeHistory = new Map(), cooldown = 4, options = {}) {
    const { seed = null, forcedTypes = null, forcedDifficulty = null, shuffleTypes = false } = options
    
    // Seed beállítása, ha van
    if (seed !== null) {
      Random.setSeed(seed)
    }
    
    // Speciális eset: 2. pálya fix típusokkal és csak easy nehézséggel
    if (levelNumber === 2 && !forcedTypes) {
      const level2Types = [
        'PASSWORD_STRENGTH',
        'FIREWALL',
        'PHISHING',
        'SOCIAL_ENGINEERING',
        'SECURITY_DECISION'
      ]
      const shuffledTypes = Random.shuffle(level2Types)
      const finalTypes = shuffledTypes.slice(0, tasksPerLevel)
      const tasks = finalTypes.map((type, index) =>
        TaskFactory.createRandomTask('easy', [type], levelNumber, index + 1)
      )
      
      if (seed !== null) {
        Random.resetSeed()
      }
      
      return tasks
    }
    
    // Speciális eset: 4. pálya fix típusokkal, közepes nehézséggel, kevert sorrendben
    if (levelNumber === 4 && forcedTypes && shuffleTypes) {
      const shuffledTypes = Random.shuffle([...forcedTypes])
      const finalTypes = shuffledTypes.slice(0, tasksPerLevel)
      const difficulty = forcedDifficulty || 'medium'
      const tasks = finalTypes.map((type, index) =>
        TaskFactory.createRandomTask(difficulty, [type], levelNumber, index + 1)
      )
      
      if (seed !== null) {
        Random.resetSeed()
      }
      
      return tasks
    }
    
    // Nehézség-eloszlás a pályaszám alapján
    const difficultyWeights = styleConfig.difficultyByLevel[levelNumber] || 
                              styleConfig.difficultyByLevel.default
    
    const tasks = []
    const usedTypesInThisLevel = new Set()
    
    // Kiszámoljuk, mely típusok vannak cooldown-ban (az utolsó cooldown pályán használva voltak)
    const typesInCooldown = new Set()
    for (let i = Math.max(1, levelNumber - cooldown); i < levelNumber; i++) {
      if (i === 1) {
        // Az 1. pálya típusait is hozzáadjuk a cooldown-hoz, ha még cooldown-ban vagyunk
        if (levelNumber <= 1 + cooldown) {
          LEVEL_1_TASK_TYPES.forEach(type => typesInCooldown.add(type))
        }
      } else if (typeHistory.has(i)) {
        typeHistory.get(i).forEach(type => typesInCooldown.add(type))
      }
    }
    
    // Elérhető típusok: minden típus, kivéve a cooldown-ban lévőket
    let availableTypes = ALL_TASK_TYPES.filter(type => !typesInCooldown.has(type))
    
    // Ha nincs elég elérhető típus, akkor bővítjük a listát (de még mindig kerüljük a közvetlen előző pályákat)
    if (availableTypes.length < tasksPerLevel) {
      // Csak az utolsó 2 pályát kerüljük, ha nincs elég típus
      const recentTypes = new Set()
      // Az 1. pálya típusait is figyelembe vesszük
      if (levelNumber <= 1 + 2) {
        LEVEL_1_TASK_TYPES.forEach(type => recentTypes.add(type))
      }
      for (let i = Math.max(2, levelNumber - 2); i < levelNumber; i++) {
        if (typeHistory.has(i)) {
          typeHistory.get(i).forEach(type => recentTypes.add(type))
        }
      }
      availableTypes = ALL_TASK_TYPES.filter(type => !recentTypes.has(type))
    }
    
    // Ha még mindig nincs elég, akkor minden típust használhatunk (kivéve az 1. pálya típusait, ha még cooldown-ban vannak)
    if (availableTypes.length < tasksPerLevel) {
      if (levelNumber <= 1 + cooldown) {
        // Ha még cooldown-ban vagyunk az 1. pálya típusaival, akkor azokat kizárjuk
        availableTypes = ALL_TASK_TYPES.filter(type => !LEVEL_1_TASK_TYPES.includes(type))
      } else {
        availableTypes = [...ALL_TASK_TYPES]
      }
    }
    
    // Keverjük össze az elérhető típusokat
    availableTypes = Random.shuffle([...availableTypes])
    
    const pickFromList = (list) => {
      const filtered = list.filter(type => !usedTypesInThisLevel.has(type))
      return filtered.length > 0 ? Random.choice(filtered) : null
    }

    for (let slot = 1; slot <= tasksPerLevel; slot++) {
      // Választunk egy típust, ami még nem volt használva ezen a pályán
      let selectedType = null
      
      // Ha van forcedTypes, akkor azt használjuk
      if (forcedTypes && forcedTypes.length >= slot) {
        selectedType = forcedTypes[slot - 1]
      } else {
        let attempts = 0
        
        while (!selectedType && attempts < 100) {
          // Először próbáljuk a sequencing preferenciákat
          const sequencingRule = styleConfig.sequencing.find(s => s.slot === slot)
          if (sequencingRule && sequencingRule.preferredTypes) {
            const preferredPool = sequencingRule.preferredTypes.filter(type => availableTypes.includes(type))
            selectedType = pickFromList(preferredPool)
          }
          
          // Ha nincs preferált, akkor az elérhető típusokból választunk
          if (!selectedType) {
            selectedType = pickFromList(availableTypes)
          }
          
          attempts++
        }
        
        // Fallback: ha még mindig nincs típus, akkor olyan típust választunk, ami még nem volt
        if (!selectedType) {
          const fallbackPool = ALL_TASK_TYPES.filter(type => !usedTypesInThisLevel.has(type))
          if (fallbackPool.length === 0) {
            throw new Error('Nincs elég egyedi feladattípus a pálya feltöltéséhez.')
          }
          selectedType = Random.choice(fallbackPool)
        }
      }
      
      usedTypesInThisLevel.add(selectedType)
      
      // Nehézség választása: ha van forcedDifficulty, azt használjuk, különben súlyozott randomizálás
      const difficulty = forcedDifficulty || Random.weightedChoice(difficultyWeights)
      
      // Feladat generálása a kiválasztott típussal
      const task = TaskFactory.createRandomTask(difficulty, [selectedType], levelNumber, slot)
      tasks.push(task)
    }
    
    // Mentjük a típus előfordulásokat
    typeHistory.set(levelNumber, usedTypesInThisLevel)
    
    // Seed reset, ha volt beállítva
    if (seed !== null) {
      Random.resetSeed()
    }
    
    return tasks
  }
  
  /**
   * Generálja az összes pályát (2-12) egyszerre, típus rotációval.
   * @param {number} startLevel - Kezdő pálya száma (alapértelmezett: 2)
   * @param {number} endLevel - Végző pálya száma (alapértelmezett: 12)
   * @param {number} tasksPerLevel - Feladatok száma pályánként (alapértelmezett: 5)
   * @returns {Map<number, Array<BaseTask>>} - Pálya szám -> feladatok listája
   */
  static generateAllLevels(startLevel = 2, endLevel = 12, tasksPerLevel = 5) {
    const allLevels = new Map()
    const typeHistory = new Map()
    
    for (let level = startLevel; level <= endLevel; level++) {
      const tasks = LevelGenerator.generateLevel(level, tasksPerLevel, typeHistory, 4)
      allLevels.set(level, tasks)
    }
    
    return allLevels
  }

  /**
   * Dinamikusan módosítja a feladat nehézségét a pályaszám alapján.
   * @param {BaseTask} task - A feladat objektum
   * @param {number} levelNumber - Pálya száma
   * @param {number} taskIndex - Feladat indexe a pályán belül (0-tól)
   * @returns {BaseTask} - Módosított feladat
   */
  static adjustDifficulty(task, levelNumber, taskIndex) {
    // Magasabb pályákon automatikusan nehezebbé válik
    if (levelNumber >= 5 && task.difficulty === 'easy') {
      // 50% eséllyel közepesre emelkedik
      if (Math.random() < 0.5) {
        task.difficulty = 'medium'
      }
    }
    return task
  }
}


