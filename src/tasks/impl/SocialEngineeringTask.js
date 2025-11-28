import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const SCENARIOS = {
  easy: [
    {
      id: 'urgent-message',
      title: 'Sürgős üzenet',
      text: 'A hangvétele személyes, sietős, és segítséget kér. A rendszerlogok szerint a küldő helyéről már korábban is érkeztek gyanús próbálkozások.',
      actions: [
        { id: 'help_immediately', label: 'Azonnal segítek, mert sürgős a helyzet.' },
        { id: 'verify_report', label: 'Ellenőrzöm a küldő azonosítóját és jelentést teszek a biztonsági csapatnak.' },
        { id: 'forward_colleague', label: 'Továbbítom egy kollégának, hogy ő döntsön.' }
      ],
      correctAction: 'verify_report',
      explanation: 'Gyanús üzeneteket mindig ellenőrizni kell, különösen ha a küldő helyéről korábban is érkeztek gyanús próbálkozások.'
    },
    {
      id: 'tech-support-request',
      title: 'Technikai támogatás kérés',
      text: 'Azonnali hozzáférésre van szükségük a rendszerhez. A kérés személyes hangvételű és sürgeti a választ.',
      actions: [
        { id: 'grant_access', label: 'Megadom a hozzáférést, mert a technikai osztály kéri.' },
        { id: 'verify_ticket', label: 'Ellenőrzöm, hogy van-e hivatalos ticket, és csak akkor adok hozzáférést.' },
        { id: 'ignore', label: 'Figyelmen kívül hagyom, biztos spam.' }
      ],
      correctAction: 'verify_ticket',
      explanation: 'Minden hozzáférési kérést hivatalos ticket rendszeren keresztül kell kezelni, nem személyes üzeneteken.'
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


