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
    name: 'Rookie Investigator',
    minLevel: 1,
    maxLevel: 2,
    minPoints: 0,
    description: 'Your first steps in cyber investigations'
  },
  {
    id: 'junior',
    name: 'Junior Investigator',
    minLevel: 3,
    maxLevel: 4,
    minPoints: 100,
    description: 'You are gaining experience following the trail'
  },
  {
    id: 'detective',
    name: 'Investigator',
    minLevel: 5,
    maxLevel: 6,
    minPoints: 250,
    description: 'A trusted member of the team'
  },
  {
    id: 'senior',
    name: 'Senior Investigator',
    minLevel: 7,
    maxLevel: 8,
    minPoints: 450,
    description: 'You are a seasoned expert'
  },
  {
    id: 'specialist',
    name: 'Network Specialist',
    minLevel: 9,
    maxLevel: 10,
    minPoints: 700,
    description: 'Master of network security'
  },
  {
    id: 'master',
    name: 'Master Investigator',
    minLevel: 11,
    maxLevel: 12,
    minPoints: 1000,
    description: 'The highest tier of cyber investigator'
  }
]

/**
 * Achievement típusok
 */
export const ACHIEVEMENTS = {
  PERFECT_LEVEL: {
    id: 'perfect_level',
    name: 'Flawless Case',
    description: 'Complete a case without any mistakes',
    icon: '⭐',
    points: 50
  },
  FAST_COMPLETER: {
    id: 'fast_completer',
    name: 'Lightning Fast',
    description: 'Complete a case in under 5 minutes',
    icon: '⚡',
    points: 20
  },
  ALL_CLUES: {
    id: 'all_clues',
    name: 'Perfect Documentation',
    description: 'Document every clue correctly',
    icon: '📋',
    points: 30
  },
  STREAK_5: {
    id: 'streak_5',
    name: '5-Case Streak',
    description: 'Complete 5 cases in a row without mistakes',
    icon: '🔥',
    points: 100
  },
  MASTER_DETECTIVE: {
    id: 'master_detective',
    name: 'Master Investigator',
    description: 'Reach the highest rank',
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
  // Minden helyes válasz +10 pont, nehézségtől függetlenül
  const points = isCorrect ? SCORING.TASK_COMPLETE : SCORING.TASK_FAILURE
  
  let feedback = ''
  if (isCorrect) {
    feedback = `Correct! +${points} points — you're closer to uncovering the hacker's trail.`
  } else {
    // Minden helytelen válasz -5 pont
    feedback = `Pay closer attention! ${points} points, but you can keep investigating.`
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
    bonuses.push({ type: 'level', points: levelBonus, text: `Case bonus: +${levelBonus} points` })
  }
  
  // Hibátlan pálya bónusz
  if (errors === 0 && completedTasks === totalTasks) {
    totalPoints += SCORING.PERFECT_LEVEL
    bonuses.push({ type: 'perfect', points: SCORING.PERFECT_LEVEL, text: `Flawless case: +${SCORING.PERFECT_LEVEL} points` })
  }
  
  // Gyors teljesítés bónusz (5 perc = 300 másodperc)
  if (timeSpent && timeSpent < 300) {
    totalPoints += SCORING.FAST_COMPLETION
    bonuses.push({ type: 'fast', points: SCORING.FAST_COMPLETION, text: `Fast completion: +${SCORING.FAST_COMPLETION} points` })
  }
  
  // Minden nyom helyes bónusz
  if (allCluesCorrect) {
    totalPoints += SCORING.ALL_CLUES_CORRECT
    bonuses.push({ type: 'clues', points: SCORING.ALL_CLUES_CORRECT, text: `Perfect documentation: +${SCORING.ALL_CLUES_CORRECT} points` })
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
 * Rang meghatározása pálya alapján
 * @param {number} totalPoints - Összes pontszám (nem használjuk, csak kompatibilitás miatt)
 * @param {number} currentLevel - Jelenlegi pálya
 * @returns {Object} - Rang információ
 */
export function getRank(totalPoints, currentLevel) {
  // Csak a pálya alapján határozzuk meg a rangot
  const rank = RANKS.find(r => currentLevel >= r.minLevel && currentLevel <= r.maxLevel)
  
  // Ha nincs találat, akkor az első rang
  return rank || RANKS[0]
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
  let feedback = `Congratulations! Case complete!\n\n`
  feedback += `Total score: ${totalPoints} points\n`
  feedback += `Rank: ${rank.name}\n\n`
  
  if (bonuses.length > 0) {
    feedback += `Bonuses:\n`
    bonuses.forEach(bonus => {
      feedback += `• ${bonus.text}\n`
    })
    feedback += `\n`
  }
  
  if (nextLevel && nextLevel <= 12) {
    feedback += `The next clues await in case ${nextLevel}.`
  } else {
    feedback += `You've reached the highest rank!`
  }
  
  return feedback
}
