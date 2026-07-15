import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SERVICES = [
  { id: 'HTTP', name: 'HTTP', port: 80, proto: 'TCP' },
  { id: 'HTTPS', name: 'HTTPS', port: 443, proto: 'TCP' },
  { id: 'SSH', name: 'SSH', port: 22, proto: 'TCP' },
  { id: 'DNS', name: 'DNS', port: 53, proto: 'UDP' },
  { id: 'RDP', name: 'RDP', port: 3389, proto: 'TCP' },
  { id: 'SMTP', name: 'SMTP', port: 25, proto: 'TCP' },
  { id: 'OPENVPN', name: 'OpenVPN', port: 1194, proto: 'UDP' },
  { id: 'SFTP', name: 'SFTP', port: 22, proto: 'TCP' }
]

const FIREWALL_SCENARIOS = [
  {
    id: 'museum-kiosk',
    difficulty: 'easy',
    intro: 'The visitor web kiosk was temporarily isolated from the internal network but still serves the digital exhibition website.',
    instructions: 'Allow the web protocols visitors use, but keep admin SSH closed so the kiosk cannot be configured remotely.',
    hint: 'The kiosk only needs HTTP (80/TCP) and HTTPS (443/TCP); all admin ports should stay closed.',
    allow: ['HTTP', 'HTTPS'],
    deny: ['SSH']
  },
  {
    id: 'sensor-gateway',
    difficulty: 'easy',
    intro: 'Motion sensors communicate through a DNS-based resolver, and the operator interface is available over HTTPS.',
    instructions: 'Let the gateway run DNS queries and HTTPS connections, but block all outbound email so it cannot be abused for spam.',
    hint: 'Only open the protocols the kiosk truly needs to display web content. Mail-related ports are usually unnecessary in this environment.',
    allow: ['DNS', 'HTTPS'],
    deny: ['SMTP']
  },
  {
    id: 'remote-labs',
    difficulty: 'medium',
    intro: 'Researchers connect over VPN, then SSH into lab servers. Attackers, meanwhile, probe RDP and SMTP.',
    instructions: 'Allow OpenVPN and SSH for researchers, but block all RDP and SMTP traffic.',
    hint: '1194/UDP and 22/TCP may pass; 3389/TCP and 25/TCP should stay blocked.',
    allow: ['OPENVPN', 'SSH'],
    deny: ['RDP', 'SMTP']
  },
  {
    id: 'forensic-bridge',
    difficulty: 'hard',
    intro: 'After an incident, only verified data flows are allowed: the forensic team uploads reports over HTTPS, needs DNS lookups, but all remote admin access must be closed.',
    instructions: 'Allow HTTPS and DNS traffic plus SFTP data transfer, but block SSH, RDP, and OpenVPN.',
    hint: '443/TCP, 53/UDP, and SFTP (22/TCP) are required; every remote admin channel stays closed.',
    allow: ['HTTPS', 'DNS', 'SFTP'],
    deny: ['SSH', 'RDP', 'OPENVPN']
  }
]

const mapServices = (codes) => codes.map(code => {
  const svc = SERVICES.find(service => service.id === code)
  if (!svc) {
    throw new Error(`Unknown service: ${code}`)
  }
  return svc
})

export class FirewallRulesTask extends BaseTask {
  static create({ id, difficulty }) {
    const scenarios = FIREWALL_SCENARIOS.filter(s => s.difficulty === difficulty)
    const scenario = scenarios.length > 0 ? Random.choice(scenarios) : FIREWALL_SCENARIOS[0]

    return new FirewallRulesTask({
      id,
      difficulty,
      parameters: { scenario }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'FIREWALL', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { scenario } = this.parameters
    const required = mapServices(scenario.allow)
    const blocked = mapServices(scenario.deny)
    this.solution = {
      allow: required.map(s => `${s.proto}:${s.port}`),
      deny: blocked.map(s => `${s.proto}:${s.port}`)
    }
    this.payload = {
      intro: scenario.intro,
      instructions: scenario.instructions,
      hint: scenario.hint,
      scenarioId: scenario.id,
      requiredServices: required,
      blockedServices: blocked
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput || typeof userInput !== 'object') return false
    if (!this.solution) this.generate()
    const allowed = (userInput.allow || []).sort()
    const denied = (userInput.deny || []).sort()
    return (
      JSON.stringify(allowed) === JSON.stringify(this.solution.allow.sort()) &&
      JSON.stringify(denied) === JSON.stringify(this.solution.deny.sort())
    )
  }
}
