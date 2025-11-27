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
    intro: 'A látogatói webkioszkot ideiglenesen leválasztották a belső hálóról, de továbbra is kiszolgálja a digitális tárlat webes felületét.',
    instructions: 'Engedélyezd a látogatók által használt webes protokollokat, de tartsd zárva az admin SSH-t, hogy a kioszkot kívülről ne lehessen konfigurálni.',
    hint: 'A kioszk csak HTTP (80/TCP) és HTTPS (443/TCP) forgalmat igényel, minden admin port maradjon zárva.',
    allow: ['HTTP', 'HTTPS'],
    deny: ['SSH']
  },
  {
    id: 'sensor-gateway',
    difficulty: 'easy',
    intro: 'A mozgásérzékelők egy DNS-alapú címkiszolgálón keresztül kommunikálnak, az üzemeltetői felület pedig HTTPS-en érhető el.',
    instructions: 'Tedd lehetővé, hogy a gateway DNS-lekérdezéseket és HTTPS kapcsolatokat indítson, de blokkolj minden e-mail kimenetet, hogy ne használhassák spamre.',
    hint: 'UDP 53 és TCP 443 szükséges, SMTP port nem.',
    allow: ['DNS', 'HTTPS'],
    deny: ['SMTP']
  },
  {
    id: 'remote-labs',
    difficulty: 'medium',
    intro: 'A kutatók VPN-en keresztül csatlakoznak, majd SSH-val lépnek be a labor szerverekre. A támadók viszont RDP-n és SMTP-n próbálkoznak.',
    instructions: 'Engedélyezd a kutatók OpenVPN és SSH forgalmát, viszont blokkolj minden RDP-t és SMTP-t.',
    hint: '1194/UDP és 22/TCP mehet, 3389/TCP és 25/TCP maradjon tiltott.',
    allow: ['OPENVPN', 'SSH'],
    deny: ['RDP', 'SMTP']
  },
  {
    id: 'forensic-bridge',
    difficulty: 'hard',
    intro: 'Egy incidens után csak az igazolt adatáramlást engedhetitek: a forenzikus csapat HTTPS-en tölti fel a jelentéseket, DNS lekérdezésre szükségük van, de minden távoli admin hozzáférést zárni kell.',
    instructions: 'Engedélyezd a HTTPS és DNS forgalmat, illetve a SFTP alapú adatküldést, de tilts SSH-t, RDP-t és OpenVPN-t.',
    hint: '443/TCP, 53/UDP és SFTP (22/TCP) kell, minden távoli admin csatorna zárt.',
    allow: ['HTTPS', 'DNS', 'SFTP'],
    deny: ['SSH', 'RDP', 'OPENVPN']
  }
]

const mapServices = (codes) => codes.map(code => {
  const svc = SERVICES.find(service => service.id === code)
  if (!svc) {
    throw new Error(`Ismeretlen szolgáltatás: ${code}`)
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


