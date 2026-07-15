import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const CONFIG_SNIPPETS = [
  {
    system: 'NGINX',
    lines: [
      'server {',
      '  listen 80;',
      '  server_name api.internal;',
      '  location /admin {',
      '    allow all;',
      '  }',
      '}'
    ],
    issueLine: 4,
    issueDescription: 'Admin endpoint accessible from any IP'
  },
  {
    system: 'AWS S3',
    lines: [
      '{',
      '  "Version": "2012-10-17",',
      '  "Statement": [{',
      '    "Effect": "Allow",',
      '    "Principal": "*",',
      '    "Action": "s3:GetObject",',
      '    "Resource": "arn:aws:s3:::corp-data/*"',
      '  }]',
      '}'
    ],
    issueLine: 5,
    issueDescription: 'Public bucket'
  },
  {
    system: 'PostgreSQL',
    lines: [
      'host    all    all    0.0.0.0/0    trust'
    ],
    issueLine: 1,
    issueDescription: 'Passwordless login allowed'
  }
]

export class MisconfigDetectionTask extends BaseTask {
  static create({ id, difficulty }) {
    const snippet = Random.choice(CONFIG_SNIPPETS)
    const decoys = Random.int(difficulty === 'hard' ? 2 : 1, difficulty === 'easy' ? 1 : 3)
    const extraLines = Array.from({ length: decoys }, (_, idx) => ({
      lineNumber: snippet.lines.length + idx + 1,
      text: '# Comment',
      isIssue: false
    }))
    const lines = snippet.lines.map((text, idx) => ({
      lineNumber: idx + 1,
      text,
      isIssue: idx + 1 === snippet.issueLine
    }))
    const combined = lines.concat(extraLines)

    return new MisconfigDetectionTask({
      id,
      difficulty,
      parameters: {
        system: snippet.system,
        lines: Random.shuffle(combined)
      }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'MISCONFIG', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { system, lines } = this.parameters
    this.solution = lines.filter(line => line.isIssue).map(line => line.lineNumber)
    this.payload = {
      instructions: `Select the misconfigured setting(s) in the ${system} configuration below.`,
      lines
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const normalized = [...new Set(userInput)].map(Number).sort((a, b) => a - b)
    const solutionSorted = [...this.solution].sort((a, b) => a - b)
    return JSON.stringify(normalized) === JSON.stringify(solutionSorted)
  }
}
