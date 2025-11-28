/**
 * Pontozási rendszer a nyomozós játékhoz
 * Duolingo-stílusú logika: motiváló, de nem teljesen büntető
 */

// Pontozási konstansok
export const SCORING = {
  // Alappontok feladatokhoz
  TASK_COMPLETE: 10,        // Feladat sikeres teljesítése
  TASK_FAILURE: -5,          // Hibázás (nem teljesen büntető)
  PERFECT_LEVEL: 50,         // Hibátlan pálya bónusz
  FAST_COMPLETION: 20,      // Gyors teljesítés bónusz (pl. < 5 perc)
  ALL_CLUES_CORRECT: 30,    // Minden nyom helyes dokumentálása
  
  // Nehézség szorzók
  DIFFICULTY_MULTIPLIER: {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0
  },
  
  // Pálya bónuszok
  LEVEL_BONUS: {
    1: 0,    // Nincs bónusz az első pályán
    2: 10,
    3: 15,
    4: 20,
    5: 25,
    6: 30,
    7: 35,
    8: 40,
    9: 45,
    10: 50,
    11: 60,
    12: 75
  }
}

/**
 * Rangrendszer definíciója
 */
export const RANKS = [
  {
    id: 'novice',
    name: 'Nyomozó-újonc',
    minLevel: 1,
    maxLevel: 2,
    minPoints: 0,
    description: 'Első lépések a kibernyomozásban'
  },
  {
    id: 'junior',
    name: 'Junior nyomozó',
    minLevel: 3,
    maxLevel: 4,
    minPoints: 100,
    description: 'Tapasztalatot szerzel a nyomok követésében'
  },
  {
    id: 'detective',
    name: 'Nyomozó',
    minLevel: 5,
    maxLevel: 6,
    minPoints: 250,
    description: 'Megbízható tag a csapatban'
  },
  {
    id: 'senior',
    name: 'Senior nyomozó',
    minLevel: 7,
    maxLevel: 8,
    minPoints: 450,
    description: 'Tapasztalt szakértő vagy'
  },
  {
    id: 'specialist',
    name: 'Hálózat-specialista',
    minLevel: 9,
    maxLevel: 10,
    minPoints: 700,
    description: 'A hálózati biztonság mestere'
  },
  {
    id: 'master',
    name: 'Mester nyomozó',
    minLevel: 11,
    maxLevel: 12,
    minPoints: 1000,
    description: 'A legmagasabb szintű kibernyomozó'
  }
]

/**
 * Achievement típusok
 */
export const ACHIEVEMENTS = {
  PERFECT_LEVEL: {
    id: 'perfect_level',
    name: 'Hibátlan pálya',
    description: 'Teljesítsd egy pályát hiba nélkül',
    icon: '⭐',
    points: 50
  },
  FAST_COMPLETER: {
    id: 'fast_completer',
    name: 'Villámgyors',
    description: 'Teljesíts egy pályát 5 perc alatt',
    icon: '⚡',
    points: 20
  },
  ALL_CLUES: {
    id: 'all_clues',
    name: 'Tökéletes dokumentálás',
    description: 'Minden nyomot helyesen dokumentálj',
    icon: '📋',
    points: 30
  },
  STREAK_5: {
    id: 'streak_5',
    name: '5 pálya sorozat',
    description: 'Teljesíts 5 pályát sorban hiba nélkül',
    icon: '🔥',
    points: 100
  },
  MASTER_DETECTIVE: {
    id: 'master_detective',
    name: 'Mester nyomozó',
    description: 'Érd el a legmagasabb rangot',
    icon: '👑',
    points: 200
  }
}

/**
 * Pontszám számítás feladat teljesítéséhez
 * @param {Object} params - Paraméterek
 * @param {string} params.difficulty - Nehézség (easy, medium, hard)
 * @param {boolean} params.isCorrect - Helyes válasz
 * @param {number} params.level - Pálya száma
 * @param {number} params.timeSpent - Eltelt idő másodpercben (opcionális)
 * @returns {Object} - Pontok és visszajelzés
 */
export function calculateTaskScore({ difficulty, isCorrect, level, timeSpent = null }) {
  const basePoints = isCorrect ? SCORING.TASK_COMPLETE : SCORING.TASK_FAILURE
  const multiplier = SCORING.DIFFICULTY_MULTIPLIER[difficulty] || 1.0
  const points = Math.round(basePoints * multiplier)
  
  let feedback = ''
  if (isCorrect) {
    const levelBonus = SCORING.LEVEL_BONUS[level] || 0
    const totalPoints = points + (levelBonus > 0 ? Math.round(levelBonus / 5) : 0)
    feedback = `Helyes döntés! +${totalPoints} pont, a hacker nyomai közelebb kerülnek a feltáráshoz.`
  } else {
    feedback = `Figyelj jobban! ${points} pont, de még mindig nyomozhatsz tovább.`
  }
  
  return {
    points,
    feedback,
    isCorrect
  }
}

/**
 * Pálya befejezési pontszám számítása
 * @param {Object} params - Paraméterek
 * @param {number} params.level - Pálya száma
 * @param {number} params.totalTasks - Összes feladat
 * @param {number} params.completedTasks - Teljesített feladatok
 * @param {number} params.errors - Hibák száma
 * @param {number} params.timeSpent - Eltelt idő másodpercben
 * @param {boolean} params.allCluesCorrect - Minden nyom helyes
 * @returns {Object} - Összesített pontok és bónuszok
 */
export function calculateLevelScore({ level, totalTasks, completedTasks, errors, timeSpent, allCluesCorrect }) {
  let totalPoints = 0
  const bonuses = []
  
  // Alap pontok (minden teljesített feladatért)
  const taskPoints = completedTasks * SCORING.TASK_COMPLETE
  totalPoints += taskPoints
  
  // Pálya bónusz
  const levelBonus = SCORING.LEVEL_BONUS[level] || 0
  if (levelBonus > 0) {
    totalPoints += levelBonus
    bonuses.push({ type: 'level', points: levelBonus, text: `Pálya bónusz: +${levelBonus} pont` })
  }
  
  // Hibátlan pálya bónusz
  if (errors === 0 && completedTasks === totalTasks) {
    totalPoints += SCORING.PERFECT_LEVEL
    bonuses.push({ type: 'perfect', points: SCORING.PERFECT_LEVEL, text: `Hibátlan pálya: +${SCORING.PERFECT_LEVEL} pont` })
  }
  
  // Gyors teljesítés bónusz (5 perc = 300 másodperc)
  if (timeSpent && timeSpent < 300) {
    totalPoints += SCORING.FAST_COMPLETION
    bonuses.push({ type: 'fast', points: SCORING.FAST_COMPLETION, text: `Gyors teljesítés: +${SCORING.FAST_COMPLETION} pont` })
  }
  
  // Minden nyom helyes bónusz
  if (allCluesCorrect) {
    totalPoints += SCORING.ALL_CLUES_CORRECT
    bonuses.push({ type: 'clues', points: SCORING.ALL_CLUES_CORRECT, text: `Tökéletes dokumentálás: +${SCORING.ALL_CLUES_CORRECT} pont` })
  }
  
  // Hibák levonása (de nem teljesen büntető)
  const errorPenalty = errors * Math.abs(SCORING.TASK_FAILURE)
  totalPoints -= errorPenalty
  
  // Minimum 0 pont
  totalPoints = Math.max(0, totalPoints)
  
  return {
    totalPoints,
    bonuses,
    taskPoints,
    errorPenalty,
    levelBonus
  }
}

/**
 * Rang meghatározása pontok és pálya alapján
 * @param {number} totalPoints - Összes pontszám
 * @param {number} currentLevel - Jelenlegi pálya
 * @returns {Object} - Rang információ
 */
export function getRank(totalPoints, currentLevel) {
  // Először a pálya alapján
  let rank = RANKS.find(r => currentLevel >= r.minLevel && currentLevel <= r.maxLevel)
  
  // Ha nincs találat, vagy a pontok alapján magasabb rang jár
  const pointsBasedRank = RANKS.slice().reverse().find(r => totalPoints >= r.minPoints)
  
  if (pointsBasedRank && (!rank || pointsBasedRank.minPoints > rank.minPoints)) {
    rank = pointsBasedRank
  }
  
  // Ha még mindig nincs, akkor az első rang
  if (!rank) {
    rank = RANKS[0]
  }
  
  return rank
}

/**
 * Achievement ellenőrzése
 * @param {Object} stats - Játékos statisztikák
 * @returns {Array} - Új achievement-ek
 */
export function checkAchievements(stats) {
  const newAchievements = []
  
  // Hibátlan pálya
  if (stats.currentLevelErrors === 0 && stats.currentLevelCompleted) {
    newAchievements.push(ACHIEVEMENTS.PERFECT_LEVEL)
  }
  
  // Gyors teljesítés
  if (stats.currentLevelTimeSpent && stats.currentLevelTimeSpent < 300) {
    newAchievements.push(ACHIEVEMENTS.FAST_COMPLETER)
  }
  
  // Minden nyom helyes
  if (stats.allCluesCorrect) {
    newAchievements.push(ACHIEVEMENTS.ALL_CLUES)
  }
  
  // 5 pálya sorozat
  if (stats.perfectStreak >= 5) {
    newAchievements.push(ACHIEVEMENTS.STREAK_5)
  }
  
  // Mester nyomozó
  const currentRank = getRank(stats.totalPoints, stats.highestLevel)
  if (currentRank.id === 'master') {
    newAchievements.push(ACHIEVEMENTS.MASTER_DETECTIVE)
  }
  
  return newAchievements
}

/**
 * Visszajelzés generálása pálya végén
 * @param {Object} params - Paraméterek
 * @param {number} params.totalPoints - Összes pontszám
 * @param {Object} params.rank - Rang információ
 * @param {Array} params.bonuses - Bónuszok listája
 * @param {number} params.nextLevel - Következő pálya száma
 * @returns {string} - Visszajelzés szövege
 */
export function generateLevelCompletionFeedback({ totalPoints, rank, bonuses, nextLevel }) {
  let feedback = `Gratulálunk! Teljesítetted a pályát!\n\n`
  feedback += `Összes pontszám: ${totalPoints} pont\n`
  feedback += `Rang: ${rank.name}\n\n`
  
  if (bonuses.length > 0) {
    feedback += `Bónuszok:\n`
    bonuses.forEach(bonus => {
      feedback += `• ${bonus.text}\n`
    })
    feedback += `\n`
  }
  
  if (nextLevel && nextLevel <= 12) {
    feedback += `A következő nyomok a ${nextLevel}. pályán várnak.`
  } else {
    feedback += `Elérted a legmagasabb szintet!`
  }
  
  return feedback
}

