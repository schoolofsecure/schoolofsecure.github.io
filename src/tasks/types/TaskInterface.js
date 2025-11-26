/**
 * Alap Task osztály, amelyet minden feladattípus kiterjeszt.
 * A concrete generate()/validate() logikát az impl modulok adják meg.
 */
export class BaseTask {
  constructor({ id, type, difficulty, parameters = {} }) {
    this.id = id
    this.type = type
    this.difficulty = difficulty
    this.parameters = parameters
    this.payload = null
    this.solution = null
  }

  /**
   * Feladat adatainak létrehozása.
   * A leszármazottakban kötelezően implementálandó.
   * @returns {Object} - a feladat megjelenítéséhez szükséges adatok
   */
  generate() {
    throw new Error('generate() must be implemented in subclass')
  }

  /**
   * Felhasználói válasz validálása.
   * @param {*} userInput
   * @returns {boolean}
   */
  validate(_userInput) {
    throw new Error('validate() must be implemented in subclass')
  }
}


