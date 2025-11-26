import { TaskFactory } from './TaskFactory'
import { Random } from './utils/random'
import { styleConfig } from './styleConfig'

export class LevelGenerator {
  /**
   * Generál egy pályát a styleConfig szerint.
   * @param {number} levelNumber - Pálya száma (2-től kezdve)
   * @param {number} tasksPerLevel - Feladatok száma pályánként (alapértelmezett: 5)
   * @returns {Array<BaseTask>} - Generált feladatok listája
   */
  static generateLevel(levelNumber, tasksPerLevel = 5) {
    // Nehézség-eloszlás a pályaszám alapján
    const difficultyWeights = styleConfig.difficultyByLevel[levelNumber] || 
                              styleConfig.difficultyByLevel.default
    
    const tasks = []
    
    for (let slot = 1; slot <= tasksPerLevel; slot++) {
      // Sorrendi preferenciák ellenőrzése
      const sequencingRule = styleConfig.sequencing.find(s => s.slot === slot)
      const preferredTypes = sequencingRule ? sequencingRule.preferredTypes : null
      
      // Nehézség választása súlyozott randomizálással
      const difficulty = Random.weightedChoice(difficultyWeights)
      
      // Feladat generálása a styleConfig szerint
      const task = TaskFactory.createRandomTask(difficulty, preferredTypes, levelNumber, slot)
      tasks.push(task)
    }
    
    return tasks
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


