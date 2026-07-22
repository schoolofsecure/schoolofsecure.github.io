import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const DIFFICULTY_CONFIG = {
  easy: { suspicious: 3, total: 4 },
  medium: { suspicious: 4, total: 6 },
  hard: { suspicious: 5, total: 8 }
}

const EMAIL_TEMPLATES = {
  easy: [
    {
      email: {
        from: 'security@aurorapay-alert.com',
      fromName: 'AuroraPay Security Team',
      subject: 'Urgent: Security alert on your account',
      body: `Dear Customer,

We detected a suspicious login attempt on your account. Immediate action is required to keep your account secure.

Please click the link below to restore your account:
bit.ly/paypal-secure-verify

If this was not you, your account will be closed within 12 hours.

Help: support.aurorapay.com/help

Best regards,
AuroraPay Security Team`
    },
      elements: [
        { id: 'spoofed-domain', text: 'Sender address is security@aurorapay-alert.com, not the official aurorapay.com domain.', suspicious: true },
        { id: 'short-link', text: 'Shortened link: bit.ly/paypal-secure-verify.', suspicious: true },
        { id: 'urgent-deadline', text: 'Threatens account closure within 12 hours.', suspicious: true },
        { id: 'generic-greeting', text: 'Generic greeting: "Dear Customer".', suspicious: true },
        { id: 'support-link', text: 'Listed support URL: support.aurorapay.com/help.', suspicious: false },
        { id: 'signature', text: 'Signature: AuroraPay Security Team.', suspicious: false }
      ]
    },
    {
      email: {
        from: 'support@orbitmall-billing.com',
      fromName: 'OrbitMall Marketplace',
      subject: 'Order confirmation',
      body: `Dear Shopper,

Thank you for your order! Order details are in the attachment.

Click here to track your order: bit.ly/orbit-order-track

If you did not place this order, contact us immediately.

Live support: help.orbitmall.com/chat

Best regards,
OrbitMall team`
      },
      elements: [
        { id: 'unknown-attachment', text: 'The email references an unknown attachment.', suspicious: true },
        { id: 'short-link', text: 'Shortened tracking link: bit.ly/orbit-order-track.', suspicious: true },
        { id: 'generic-greeting', text: 'Generic greeting: "Dear Shopper".', suspicious: true },
        { id: 'missing-order-details', text: 'No specific order ID is provided.', suspicious: true },
        { id: 'support-chat', text: 'Listed support link: help.orbitmall.com/chat.', suspicious: false },
        { id: 'signature', text: 'Signature: OrbitMall team.', suspicious: false }
      ]
    }
  ],
  medium: [
    {
      email: {
        from: 'noreply@vaultsecure-alert.eu',
      fromName: 'VaultSecure Customer Service',
      subject: 'Important: Account update required',
      body: `Dear Customer,

Our system was updated. To access your account, please update your details.

Click here: https://vaultsecure-support.com/update-now

Your account access will be restricted within 24 hours if you do not update your information.

For verification, please sign in and confirm your current password on the linked page.

Customer service: +36-1-234-5678

Best regards,
BankSecure Team`
    },
      elements: [
        { id: 'spoofed-domain', text: 'Sender address is noreply@vaultsecure-alert.eu, which differs from the official domain.', suspicious: true },
        { id: 'link-mismatch', text: 'The link points to vaultsecure-support.com, not the official portal.', suspicious: true },
        { id: 'generic-greeting', text: 'Generic greeting: "Dear Customer".', suspicious: true },
        { id: 'deadline', text: 'Threatens restriction within 24 hours.', suspicious: true },
        { id: 'credential-request', text: 'The link asks you to confirm your password.', suspicious: true },
        { id: 'support-phone', text: 'Listed support phone: +36-1-234-5678.', suspicious: false },
        { id: 'signature', text: 'Signature: BankSecure Team.', suspicious: false }
      ]
    },
    {
      email: {
      from: 'alerts@dynarchive.org',
      fromName: 'DynArchive Administrator',
      subject: 'Immediate action required',
      body: `Dear User,

A critical security incident occurred in our system. Immediate action is required.

Click the link to view details:
http://cyb3rmuseum.org/urgent-action

WARNING: If you do not act within 6 hours, your account will be permanently deleted.

Incident ID: #CYA-554.
For any questions, reply to this email.

Best regards,
Administrator`
      },
      elements: [
        { id: 'http-link', text: 'Uses an unencrypted link: http://cyb3rmuseum.org/urgent-action.', suspicious: true },
        { id: 'threat-language', text: 'WARNING: threatens deletion within 6 hours.', suspicious: true },
        { id: 'generic-greeting', text: 'Generic greeting: "Dear User".', suspicious: true },
        { id: 'reply-request', text: 'Asks you to reply to this email (not an official channel).', suspicious: true },
        { id: 'lack-of-details', text: 'Provides no concrete recovery steps, only an external link.', suspicious: true },
        { id: 'incident-id', text: 'Provides an incident ID: #CYA-554.', suspicious: false },
        { id: 'signature', text: 'Signature: Administrator.', suspicious: false }
      ]
    }
  ],
  hard: [
    {
      email: {
      from: 'finance@heliostat-solutions.ch',
      fromName: 'Heliostat Treasury',
      subject: 'Re: Urgent accounting audit',
      body: `Hi team,

We close the audit tomorrow, so you need to confirm the transfers in the attached Excel file with macros.

⚠️ If you do not send it back by 18:00 today, the entire project approval will be suspended.

Document: https://skybox-share.com/redir?id=0A12-FAKE-SHARE
Reply to a separate address: treasury.control@consultant-mail.com

Regards,
"Ivett" – external auditor`
    },
      elements: [
        { id: 'macro-attachment', text: 'Asks you to open an Excel file containing macros.', suspicious: true },
        { id: 'ext-link', text: 'External file-sharing link: skybox-share.com/redir?id=0A12-FAKE-SHARE.', suspicious: true },
        { id: 'alternate-reply', text: 'Requests a reply to a consultant-mail.com address.', suspicious: true },
        { id: 'threat-project', text: 'Threatens project suspension after 18:00.', suspicious: true },
        { id: 'external-auditor', text: 'External auditor asks you to confirm transfers.', suspicious: true },
        { id: 'casual-greeting', text: 'Informal greeting: "Hi team".', suspicious: false },
        { id: 'deadline-info', text: 'Provides a specific deadline: 18:00 today.', suspicious: false },
        { id: 'signature', text: 'Signature: "Ivett" – external auditor.', suspicious: false }
      ]
    },
    {
      email: {
      from: 'incident@sentinel-grid.io',
      fromName: 'Sentinel OnCall',
      subject: 'CRITICAL: VPN key compromised',
      body: `On-call team,

Our VPN keys have leaked — immediate rotation is required.

1. Go to https://vpn-reset.azureedge.net
2. Enter the root password (found here: pastebin.com/xyz123)
3. Send the new key back in a REPLY so we can close the ticket.

If there is no response within 20 minutes, all remote access will be blocked.`
      },
      elements: [
        { id: 'external-reset', text: 'VPN reset happens on an external azureedge.net address.', suspicious: true },
        { id: 'pastebin-password', text: 'Root password points to a public pastebin link.', suspicious: true },
        { id: 'send-keys', text: 'The new key must be sent back by email reply.', suspicious: true },
        { id: 'critical-urgency', text: 'Threatens a 20-minute deadline.', suspicious: true },
        { id: 'capitalized-warning', text: 'Subject and instructions use all-caps "CRITICAL" wording.', suspicious: true },
        { id: 'step-list', text: 'Provides detailed numbered steps.', suspicious: false },
        { id: 'team-address', text: 'The message comes from the Sentinel OnCall team.', suspicious: false },
        { id: 'clear-subject', text: 'Clear subject line: VPN key compromised.', suspicious: false }
      ]
    }
  ]
}

const HINTS_BY_DIFFICULTY = {
  easy: 'Domain, urgency and shortened links: look for the most obvious red flags.',
  medium: 'Check whether the domain matches the sender and whether attachments or links look unusual.',
  hard: 'Review the reply-to address, links and headers. Attacks often combine several suspicious elements.'
}

const selectElementsForTemplate = (template, config) => {
  const suspiciousPool = template.elements.filter(e => e.suspicious)
  const safePool = template.elements.filter(e => !e.suspicious)

  const requiredSuspicious = Math.min(config.suspicious, suspiciousPool.length)
  const sampledSuspicious = Random.sample(suspiciousPool, requiredSuspicious)

  const requiredTotal = Math.min(config.total, template.elements.length)
  const remainingSlots = Math.max(0, requiredTotal - sampledSuspicious.length)
  const sampledSafe = remainingSlots > 0
    ? Random.sample(safePool, Math.min(remainingSlots, safePool.length))
    : []

  const combined = Random.shuffle([...sampledSuspicious, ...sampledSafe])
  const solution = sampledSuspicious.map(e => e.id)

  return { elements: combined, solution }
}

export class PhishingRecognitionTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy
    const templateSet = EMAIL_TEMPLATES[difficulty] || EMAIL_TEMPLATES.easy
    const template = Random.choice(templateSet)
    const { elements, solution } = selectElementsForTemplate(template, config)

    return new PhishingRecognitionTask({
      id,
      difficulty,
      parameters: { template, elements, solution, levelNumber, slot }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'PHISHING', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { template, elements, solution } = this.parameters
    
    const narrative = {
        intro: 'Signals arrive through communication channels, and system alerts are growing more frequent.',
        task: 'A suspicious email has arrived in the system. Analyse the message and identify the elements that suggest phishing.',
        hint: 'Watch domain names, greetings, links and wording. Phishing messages often create urgency and include suspicious links.'
    }
    this.solution = solution
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      email: {
        from: template.email.from,
        fromName: template.email.fromName,
        subject: template.email.subject,
        body: template.email.body
      },
      elements,
      hint: HINTS_BY_DIFFICULTY[this.difficulty] || narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const normalizedInput = [...new Set(userInput)].sort()
    const normalizedSolution = [...new Set(this.solution)].sort()
    return JSON.stringify(normalizedInput) === JSON.stringify(normalizedSolution)
  }
}
