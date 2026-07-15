import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = {
  easy: [
    {
      id: 'urgent-message',
      title: 'Urgent message',
      text: 'The tone is personal and urgent, asking for help. System logs show suspicious attempts from the sender\'s location before.',
      actions: [
        { id: 'help_immediately', label: 'Help immediately — the situation is urgent.' },
        { id: 'verify_report', label: 'Verify the sender\'s identity and report it to the security team.' },
        { id: 'forward_colleague', label: 'Forward it to a colleague and let them decide.' }
      ],
      correctAction: 'verify_report',
      explanation: 'Suspicious messages should always be verified, especially when the sender\'s location has a history of suspicious attempts.'
    },
    {
      id: 'tech-support-request',
      title: 'Tech support request',
      text: 'They need immediate access to the system. The request feels personal and pushes for a quick response.',
      actions: [
        { id: 'grant_access', label: 'Grant access because the tech department asked.' },
        { id: 'verify_ticket', label: 'Check for an official ticket and grant access only if one exists.' },
        { id: 'ignore', label: 'Ignore it — probably spam.' }
      ],
      correctAction: 'verify_ticket',
      explanation: 'Every access request must go through the official ticket system, not personal messages.'
    }
  ],
  medium: [
    {
      id: 'fake-invoice',
      title: 'Urgent invoice',
      text: 'An external "vendor" claims by email that the AuroraGrid project will only continue if you wire an advance payment now.',
      actions: [
        { id: 'pay_now', label: 'Pay immediately so the project does not slip.' },
        { id: 'verify_procurement', label: 'Refuse until procurement confirms the request.' },
        { id: 'ask_bank', label: 'Ask the bank whether the transfer is acceptable.' }
      ],
      correctAction: 'verify_procurement',
      explanation: 'Every financial change must be verified through official channels, especially from external parties.'
    },
    {
      id: 'usb-drop',
      title: 'Found USB drive',
      text: 'You find a COBALTIA-branded flash drive in the parking lot labeled "salaries2025.xlsx".',
      actions: [
        { id: 'plug_in', label: 'Plug it into an isolated machine to inspect it.' },
        { id: 'give_manager', label: 'Hand it to my direct manager.' },
        { id: 'submit_it', label: 'Turn it in to the information security team.' }
      ],
      correctAction: 'submit_it',
      explanation: 'Never connect unknown storage devices; let IT inspect them.'
    }
  ],
  hard: [
    {
      id: 'slack-reset',
      title: '"Instant" Slack reset',
      text: 'In AuroraMesh chat, a "global admin" asks you to confirm your account via a private link or it will be deleted.',
      actions: [
        { id: 'click_link', label: 'Click the link and enter my password to stay secure.' },
        { id: 'ask_reason', label: 'Ask in a public channel, but still open the link.' },
        { id: 'refuse_public', label: 'Refuse and verify the official status in a public channel.' }
      ],
      correctAction: 'refuse_public',
      explanation: 'Always confirm through official, verified channels; this may be phishing.'
    },
    {
      id: 'oncall-sms',
      title: 'On-call SMS',
      text: 'At night you get an SMS saying "Night SOC" needs a new transfer key approved via a link within 5 minutes.',
      actions: [
        { id: 'approve', label: 'Approve it — on-call requests can be urgent.' },
        { id: 'call_shift_lead', label: 'Call back the official on-call number to verify.' },
        { id: 'ignore', label: 'Ignore it — probably spam.' }
      ],
      correctAction: 'call_shift_lead',
      explanation: 'Even in emergencies, validate through official channels first (on-call roster).'
    },
    {
      id: 'video_request',
      title: 'Video call request',
      text: 'A new colleague asks on video chat for screen sharing to "show" an internal CRM bug and requests admin rights on your machine.',
      actions: [
        { id: 'share_screen', label: 'Share my screen and grant admin rights.' },
        { id: 'record_meeting', label: 'Start a recording but still fulfill the request.' },
        { id: 'refuse_policy', label: 'Refuse and suggest opening an official ticket.' }
      ],
      correctAction: 'refuse_policy',
      explanation: 'Admin rights are only granted through controlled processes; asking over video chat is suspicious.'
    }
  ]
}

const HINTS = {
  easy: 'Always ask: is the request legitimate? Do you know the person? Is there an official channel?',
  medium: 'Check where the request came from, whether a ticket exists, and refer to policy.',
  hard: 'Urgent, multi-channel attempts should only be fulfilled after official confirmation.'
}

export class SocialEngineeringTask extends BaseTask {
  static create({ id, difficulty }) {
    const pool = SCENARIOS[difficulty] || SCENARIOS.easy
    const scenarioCount = Math.min(pool.length, difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3)
    const scenarios = Random.sample(pool, scenarioCount)

    return new SocialEngineeringTask({
      id,
      difficulty,
      parameters: { scenarios }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'SOCIAL_ENGINEERING', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenarios } = this.parameters
    this.solution = scenarios.map(s => s.correctAction)
    this.payload = {
      instructions: 'Read each situation and choose the response that follows security protocol.',
      scenarios,
      hint: HINTS[this.difficulty]
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    if (userInput.length !== this.solution.length) return false
    return userInput.every((choice, idx) => choice === this.solution[idx])
  }
}
