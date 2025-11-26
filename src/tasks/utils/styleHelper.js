/**
 * Helper függvények a styleConfig használatához.
 */
import { styleConfig } from '../styleConfig'
import { Random } from './random'

export const StyleHelper = {
  /**
   * Visszaadja a feladattípushoz tartozó randomizálási szabályokat.
   * @param {string} taskType - Feladattípus (pl. 'CAESAR')
   * @returns {Object} - Randomizálási szabályok
   */
  getRandomRules(taskType) {
    return styleConfig.randomRules[taskType] || {}
  },

  /**
   * Visszaadja a nehézséghez tartozó komplexitási paramétereket.
   * @param {string} difficulty - Nehézség ('easy', 'medium', 'hard')
   * @returns {Object} - Komplexitási paraméterek
   */
  getComplexity(difficulty) {
    return styleConfig.complexity[difficulty] || styleConfig.complexity.easy
  },

  /**
   * Generál egy narratív szöveget a styleConfig textStyle szerint.
   * @param {string} type - Szöveg típusa ('intro', 'taskDescription', 'hint')
   * @param {Object} context - Kontextus információk (pl. { taskType, difficulty })
   * @returns {string} - Generált narratív szöveg
   */
  generateNarrative(type, context = {}) {
    const { taskType, difficulty } = context
    const length = styleConfig.textStyle.narrationLength[type] || 100
    
    // Alap narratív szövegek pool-ja
    const narratives = {
      intro: [
        'Az éjszaka leple alatt a rendszer mélyén rejtett nyomok várnak.',
        'A monitorok remegő fényében gyanús aktivitás jelei bukkannak fel.',
        'A logfájlok között elrejtett üzenetek várnak a megfejtésre.',
        'A hálózat mélyén titkosított adatok rejtőznek.',
        'A biztonsági rendszer riasztásai egyre gyakoribbá válnak.'
      ],
      taskDescription: [
        'Elemezd a rendelkezésre álló adatokat és keresd meg a gyanús mintákat.',
        'A titkosított üzenetek mögött rejtett információkat kell feltárnod.',
        'Figyeld meg a rendellenességeket és azonosítsd a fenyegetést.',
        'A logfájlok között keresd a kulcsot a megoldáshoz.',
        'A kommunikációs csatornákon keresztül érkező jelek várnak elemzésre.'
      ],
      hint: [
        'Gondold végig, milyen mintázatokat keresel.',
        'Figyeld a részleteket, mert ott rejlik a megoldás.',
        'A kulcs gyakran a legváratlanabb helyen bukkan fel.',
        'Ne siess, alaposan elemezd az adatokat.',
        'A rendszer mindig hagy nyomokat, csak meg kell találnod őket.'
      ]
    }
    
    const pool = narratives[type] || narratives.intro
    return Random.choice(pool)
  },

  /**
   * Generál visszajelzést a styleConfig textStyle.feedback szerint.
   * @param {boolean} success - Sikeres volt-e a válasz
   * @returns {string} - Visszajelzés szövege
   */
  generateFeedback(success) {
    if (success) {
      const messages = [
        'Nyom megerősítve.',
        'Helyes megoldás!',
        'Továbbhaladsz a nyomozásban.',
        'A következő lépésre léphetsz.',
        'Jó irány!'
      ]
      return Random.choice(messages)
    } else {
      const messages = [
        'Valami nem stimmel, próbáld újra.',
        'Figyeld a részleteket, ott rejlik a megoldás.',
        'Nem egészen – próbáld újra.',
        'Közelebb vagy, de még nem ez a megoldás.',
        'Gondold végig újra a lépéseket.'
      ]
      return Random.choice(messages)
    }
  }
}

