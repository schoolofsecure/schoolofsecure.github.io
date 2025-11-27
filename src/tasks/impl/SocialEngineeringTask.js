import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = {
  easy: [
    {
      id: 'phone-it',
      title: 'Telefonos „IT” hívás',
      text: 'Egy AuroraSec nevű „IT technikus” telefonon a VPN jelszavadat kéri, hogy frissítést telepítsen.',
      actions: [
        { id: 'share_creds', label: 'Megadom a jelszót, hogy gyorsan végezzen.' },
        { id: 'refuse_report', label: 'Elutasítom és jelzem a SOC-nak.' },
        { id: 'later', label: 'Megígérem, hogy később írásban elküldöm.' }
      ],
      correctAction: 'refuse_report',
      explanation: 'Az IT sosem kér jelszót telefonon; azonnal jelenteni kell.'
    },
    {
      id: 'tailgate',
      title: 'Beengednél valakit?',
      text: 'Az irodába érve egy idegen kér, hogy tartsd neki az ajtót, mert „ott felejtette a belépőkártyát”.',
      actions: [
        { id: 'let_in', label: 'Beengedem, nehogy kint maradjon.' },
        { id: 'deny_security', label: 'Megkérem, várja meg a recepciót és hívom a biztonságot.' },
        { id: 'ask_name', label: 'Megkérdezem a nevét, de azért beengedem.' }
      ],
      correctAction: 'deny_security',
      explanation: 'Ismeretleneket kártya nélkül nem szabad beengedni, inkább kísérjük a recepciónak.'
    }
  ],
  medium: [
    {
      id: 'fake-invoice',
      title: 'Sürgős számla',
      text: 'Egy külsős „szállító” e-mailben azt állítja, hogy az AuroraGrid projektet csak akkor folytatják, ha most átutalsz egy előleget.',
      actions: [
        { id: 'pay_now', label: 'Azonnal utalok, nehogy csússzon a projekt.' },
        { id: 'verify_procurement', label: 'Visszautasítom, amíg a beszerzéssel nem egyeztetek.' },
        { id: 'ask_bank', label: 'Megkérdezem a bankot, hogy jóváírható-e.' }
      ],
      correctAction: 'verify_procurement',
      explanation: 'Minden pénzügyi változtatást hivatalos csatornán kell ellenőrizni, különösen külsős igény esetén.'
    },
    {
      id: 'usb-drop',
      title: 'Talált USB',
      text: 'A parkolóban találsz egy COBALTIA logós pendrive-ot, rajta „bérek2025.xlsx” felirattal.',
      actions: [
        { id: 'plug_in', label: 'Bedugom egy izolált gépbe megnézni.' },
        { id: 'give_manager', label: 'Odaadom a közvetlen vezetőmnek.' },
        { id: 'submit_it', label: 'Leadom az információbiztonsági csapatnak.' }
      ],
      correctAction: 'submit_it',
      explanation: 'Ismeretlen adathordozót soha nem csatlakoztatunk; az IT vizsgálja meg.'
    }
  ],
  hard: [
    {
      id: 'slack-reset',
      title: '„Azonnali” Slack reset',
      text: 'AuroraMesh chatben egy „globális admin” azt kéri, hogy egy privát linkre kattintva erősítsd meg a fiókodat, különben törlik.',
      actions: [
        { id: 'click_link', label: 'Kattintok és megadom a jelszót, hogy biztonságban legyen.' },
        { id: 'ask_reason', label: 'Rákérdezek nyilvános csatornában, de a linket megnyitom.' },
        { id: 'refuse_public', label: 'Elutasítom, és nyilvános csatornában ellenőrzöm a hivatalos státuszt.' }
      ],
      correctAction: 'refuse_public',
      explanation: 'Mindig hivatalos, ellenőrzött csatornán kérj megerősítést; phishing lehet.'
    },
    {
      id: 'oncall-sms',
      title: 'On-call SMS',
      text: 'Éjjel SMS-t kapsz, hogy az „Éjjeli SOC” új átutalási kulcsot kér, és a küldött linket 5 percen belül jóvá kell hagynod.',
      actions: [
        { id: 'approve', label: 'Jóváhagyom, mert on-call sürgős lehet.' },
        { id: 'call_shift_lead', label: 'Visszahívom a hivatalos on-call számot ellenőrzéshez.' },
        { id: 'ignore', label: 'Figyelmen kívül hagyom, biztos spam.' }
      ],
      correctAction: 'call_shift_lead',
      explanation: 'SOS helyzetben is előbb validáld hivatalos csatornán (on-call lista).'
    },
    {
      id: 'video_request',
      title: 'Video-meghívás',
      text: 'Egy új kolléga videochaten kér képernyőmegosztást, hogy „megmutathassa” a belső CRM hibát, és admin jogot kér a gépedre.',
      actions: [
        { id: 'share_screen', label: 'Megosztom a képernyőt és admin jogot adok.' },
        { id: 'record_meeting', label: 'Elindítok egy rögzítést, de teljesítem a kérést.' },
        { id: 'refuse_policy', label: 'Elutasítom, és javaslom a hivatalos ticketet.' }
      ],
      correctAction: 'refuse_policy',
      explanation: 'Admin jogot csak szabályozott folyamatban adunk; videochaten kérni gyanús.'
    }
  ]
}

const HINTS = {
  easy: 'Mindig gondold át: jogos-e a kérés? Ismered a kérő személyt? Létezik hivatalos csatorna?',
  medium: 'Ellenőrizd, honnan érkezett az igény, van-e dokumentált ticket, és hivatkozz politikákra.',
  hard: 'Sürgősnek tűnő, többcsatornás próbálkozásokat csak hivatalos visszaigazolással teljesítsd.'
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
      instructions: 'Olvasd el a helyzetet, majd válaszd ki azt a reakciót, amelyik megfelel a biztonsági protokollnak.',
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


