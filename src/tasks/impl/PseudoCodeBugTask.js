import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SNIPPETS = {
  easy: [
    {
      language: 'pseudo',
      title: 'Egyszerű belépési ellenőrzés',
      lines: [
        'function authenticate(username, password) {',
        '  hash = sha256(password)',
        '  if (hash == storedHash) {',
        '    return true',
        '  }',
        '  return false',
        '}'
      ],
      issueLine: 2,
      description: 'Hash-elés előtt nincs só használva'
    },
    {
      language: 'pseudo',
      title: 'Vizsgálatlan SQL lekérdezés',
      lines: [
        'query = "SELECT * FROM users WHERE name = \'" + input + "\'"',
        'result = db.execute(query)',
        'return result'
      ],
      issueLine: 1,
      description: 'SQL injection veszély'
    }
  ],
  medium: [
    {
      language: 'pseudo',
      title: 'API token generálás',
      lines: [
        'function issueToken(user) {',
        '  token = generateRandomString(6)',
        '  db.save(user.id, token, expires=24h)',
        '  return token',
        '}'
      ],
      issueLine: 2,
      description: 'Túl rövid token, brute force-lal kitalálható'
    },
    {
      language: 'pseudo',
      title: 'Log írás admin panelhez',
      lines: [
        'log("Admin login attempt: " + username)',
        'if (isValid(username, password)) {',
        '  log("Success for user " + username)',
        '  grantAccess(username)',
        '} else {',
        '  log("Failed attempt")',
        '}'
      ],
      issueLine: 1,
      description: 'A napló belső infót szivárogtat (felhasználónév)'
    }
  ],
  hard: [
    {
      language: 'pseudo',
      title: 'Kétfaktoros hitelesítés',
      lines: [
        'function verify2FA(user, code) {',
        '  lastCode = cache.get(user.id)',
        '  if (code == lastCode) {',
        '    cache.store(user.id, code)',
        '    return true',
        '  }',
        '  return false',
        '}'
      ],
      issueLine: 4,
      description: 'Az elfogadott kódot visszateszi a cache-be, így újra felhasználható'
    },
    {
      language: 'pseudo',
      title: 'Fájl feltöltés ellenőrzés',
      lines: [
        'function handleUpload(file) {',
        '  name = file.name',
        '  if (name.endsWith(".jpg")) {',
        '    save("/uploads/" + name, file.content)',
        '    return "OK"',
        '  }',
        '  return "Reject"',
        '}'
      ],
      issueLine: 4,
      description: 'Nem vizsgálja a fájl tartalmát / dupla kiterjesztést'
    }
  ]
}

export class PseudoCodeBugTask extends BaseTask {
  static create({ id, difficulty }) {
    const pool = SNIPPETS[difficulty] || SNIPPETS.easy
    const snippet = Random.choice(pool)

    const hintsByDifficulty = {
      easy: ['Figyeld meg, hogyan kezelik a bemenetet – van-e szűrés vagy sózás.'],
      medium: ['Nézd meg, milyen információ kerül naplózásra vagy hány bitekből áll a védelem.'],
      hard: ['Gondold végig az állapotkezelést: mi történik az elfogadott kódokkal vagy fájlnevekkel?']
    }

    return new PseudoCodeBugTask({
      id,
      difficulty,
      parameters: { snippet, hint: hintsByDifficulty[difficulty] }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'PSEUDOCODE_BUG', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { snippet, hint } = this.parameters
    this.solution = snippet.issueLine
    this.payload = {
      instructions: 'Jelöld meg, melyik sor tartalmaz biztonsági hibát.',
      snippet,
      hint,
      description: snippet.description,
      title: snippet.title
    }
    return this.payload
  }

  validate(userInput) {
    if (typeof userInput !== 'number') return false
    if (this.solution === null) this.generate()
    return userInput === this.solution
  }
}


