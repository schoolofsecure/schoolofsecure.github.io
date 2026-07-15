import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SNIPPETS = {
  easy: [
    {
      language: 'pseudo',
      title: 'Simple login check',
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
      description: 'No salt is used before hashing'
    },
    {
      language: 'pseudo',
      title: 'Unsanitized SQL query',
      lines: [
        'query = "SELECT * FROM users WHERE name = \'" + input + "\'"',
        'result = db.execute(query)',
        'return result'
      ],
      issueLine: 1,
      description: 'SQL injection risk'
    }
  ],
  medium: [
    {
      language: 'pseudo',
      title: 'API token generation',
      lines: [
        'function issueToken(user) {',
        '  token = generateRandomString(6)',
        '  db.save(user.id, token, expires=24h)',
        '  return token',
        '}'
      ],
      issueLine: 2,
      description: 'Token is too short and can be brute-forced'
    },
    {
      language: 'pseudo',
      title: 'Admin panel logging',
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
      description: 'The log leaks internal information (username)'
    }
  ],
  hard: [
    {
      language: 'pseudo',
      title: 'Two-factor authentication',
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
      description: 'The accepted code is stored back in cache and can be reused'
    },
    {
      language: 'pseudo',
      title: 'File upload validation',
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
      description: 'Does not inspect file content or double extensions'
    }
  ]
}

export class PseudoCodeBugTask extends BaseTask {
  static create({ id, difficulty }) {
    const pool = SNIPPETS[difficulty] || SNIPPETS.easy
    const snippet = Random.choice(pool)

    const hintsByDifficulty = {
      easy: ['Watch how input is handled — is there filtering or salting?'],
      medium: ['Look at what information gets logged and how strong the protection is.'],
      hard: ['Think through state handling: what happens to accepted codes or filenames?']
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
      instructions: 'Mark the line that contains the security flaw.',
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
