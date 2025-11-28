import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'

const DIFFICULTY_CONFIG = {
  easy: { suspicious: 3, total: 4 },
  medium: { suspicious: 4, total: 6 },
  hard: { suspicious: 5, total: 8 }
}

// Email template-ek phishing feladatokhoz
const EMAIL_TEMPLATES = {
  easy: [
    {
      email: {
        from: 'security@aurorapay-alert.com',
      fromName: 'AuroraPay Biztonsági Csapat',
      subject: 'Sürgős: Fiókod biztonsági riasztás',
      body: `Tisztelt Ügyfelünk,

A fiókjához gyanús bejelentkezési kísérletet észleltünk. A fiók biztonsága érdekében azonnali intézkedésre van szükség.

Kérjük, kattintson a következő linkre a fiók visszaállításához:
bit.ly/paypal-secure-verify

Ha nem Ön volt, akkor a fiók 12 órán belül lezárásra kerül.

Segítség: support.aurorapay.com/help

Üdvözlettel,
AuroraPay Biztonsági Csapat`
    },
      elements: [
        { id: 'spoofed-domain', text: 'Feladó címe security@aurorapay-alert.com, nem a hivatalos aurorapay.com domain.', suspicious: true },
        { id: 'short-link', text: 'Rövidített link: bit.ly/paypal-secure-verify.', suspicious: true },
        { id: 'urgent-deadline', text: '12 órán belüli lezárást helyez kilátásba.', suspicious: true },
        { id: 'generic-greeting', text: 'Általános megszólítás: „Tisztelt Ügyfelünk”.', suspicious: true },
        { id: 'support-link', text: 'Megadott hivatalos támogatási URL: support.aurorapay.com/help.', suspicious: false },
        { id: 'signature', text: 'Aláírás: AuroraPay Biztonsági Csapat.', suspicious: false }
      ]
    },
    {
      email: {
        from: 'support@orbitmall-billing.com',
      fromName: 'OrbitMall Piac',
      subject: 'Rendelés visszaigazolás',
      body: `Kedves Vásárló,

Köszönjük a rendelését! A rendelés részletei a csatolmányban találhatók.

Kattintson ide a rendelés követéséhez: bit.ly/orbit-order-track

Ha nem Ön adta le a rendelést, azonnal lépjen kapcsolatba velünk.

Azonnali ügyfélszolgálat: help.orbitmall.com/chat

Üdvözlettel,
OrbitMall csapat`
      },
      elements: [
        { id: 'unknown-attachment', text: 'A levél ismeretlen csatolmányra hivatkozik.', suspicious: true },
        { id: 'short-link', text: 'Rövidített követési link: bit.ly/orbit-order-track.', suspicious: true },
        { id: 'generic-greeting', text: 'Általános megszólítás: „Kedves Vásárló”.', suspicious: true },
        { id: 'missing-order-details', text: 'Nincs konkrét rendelési azonosító feltüntetve.', suspicious: true },
        { id: 'support-chat', text: 'Megadott ügyfélszolgálati link: help.orbitmall.com/chat.', suspicious: false },
        { id: 'signature', text: 'Aláírás: OrbitMall csapat.', suspicious: false }
      ]
    }
  ],
  medium: [
    {
      email: {
        from: 'noreply@vaultsecure-alert.eu',
      fromName: 'VaultSecure Ügyfélszolgálat',
      subject: 'Fontos: Fiók frissítés szükséges',
      body: `Tisztelt Ügyfelünk,

A rendszerünkben frissítés történt. A fiókja eléréséhez kérjük, frissítse az adatait.

Kattintson ide: https://vaultsecure-support.com/update-now

A fiók elérése 24 órán belül korlátozásra kerül, ha nem frissíti az adatait.

Az azonosításhoz kérjük, jelentkezzen be és erősítse meg jelenlegi jelszavát a megadott oldalon.

Ügyfélszolgálat: +36-1-234-5678

Üdvözlettel,
BankSecure Csapat`
    },
      elements: [
        { id: 'spoofed-domain', text: 'Feladó címe noreply@vaultsecure-alert.eu, eltér a hivatalos domain-től.', suspicious: true },
        { id: 'link-mismatch', text: 'A link a vaultsecure-support.com oldalra mutat, nem a hivatalos portálra.', suspicious: true },
        { id: 'generic-greeting', text: 'Általános megszólítás: „Tisztelt Ügyfelünk”.', suspicious: true },
        { id: 'deadline', text: '24 órán belüli korlátozást helyez kilátásba.', suspicious: true },
        { id: 'credential-request', text: 'Jelszó megerősítésére szólít fel a linkben.', suspicious: true },
        { id: 'support-phone', text: 'Megadott ügyfélszolgálati telefonszám: +36-1-234-5678.', suspicious: false },
        { id: 'signature', text: 'Aláírás: BankSecure Csapat.', suspicious: false }
      ]
    },
    {
      email: {
      from: 'alerts@dynarchive.org',
      fromName: 'DynArchive Rendszergazda',
      subject: 'Azonnali cselekvés szükséges',
      body: `Tisztelt Felhasználó,

A rendszerünkben kritikus biztonsági incidens történt. Azonnali cselekvésre van szükség.

Kattintson a linkre a részletek megtekintéséhez:
http://cyb3rmuseum.org/urgent-action

FIGYELEM: Ha nem cselekszik 6 órán belül, a fiók véglegesen törlésre kerül.

Incidens azonosító: #CYA-554.
Minden kérdés esetén válaszoljon erre az emailre.

Üdvözlettel,
Rendszergazda`
      },
      elements: [
        { id: 'http-link', text: 'Nem titkosított linket használ: http://cyb3rmuseum.org/urgent-action.', suspicious: true },
        { id: 'threat-language', text: 'FIGYELEM: 6 órán belüli törléssel fenyeget.', suspicious: true },
        { id: 'generic-greeting', text: 'Általános megszólítás: „Tisztelt Felhasználó”.', suspicious: true },
        { id: 'reply-request', text: 'A levél arra kér, hogy erre az emailre válaszoljanak (nem hivatalos csatorna).', suspicious: true },
        { id: 'lack-of-details', text: 'Nem ad konkrét helyreállítási lépéseket, csak egy külső linket.', suspicious: true },
        { id: 'incident-id', text: 'Incidens azonosítót ad meg: #CYA-554.', suspicious: false },
        { id: 'signature', text: 'Aláírás: Rendszergazda.', suspicious: false }
      ]
    }
  ],
  hard: [
    {
      email: {
      from: 'finance@heliostat-solutions.ch',
      fromName: 'Heliostat Treasury',
      subject: 'Re: Sürgős könyvelési audit',
      body: `Sziasztok,

Holnap zárjuk az auditot, ezért a mellékelt makrókat tartalmazó Excelben kell visszaigazolnotok az utalásokat.

⚠️ Ha ma 18:00-ig nem külditek vissza, a teljes projekt engedélye felfüggesztésre kerül.

Dokumentum: https://skybox-share.com/redir?id=0A12-FAKE-SHARE
Válasz: külön címre (treasury.control@consultant-mail.com)

Üdv,
„Ivett" – külsős könyvvizsgáló`
    },
      elements: [
        { id: 'macro-attachment', text: 'Makrókat tartalmazó Excel megnyitására szólít fel.', suspicious: true },
        { id: 'ext-link', text: 'Külső fájlmegosztó link: skybox-share.com/redir?id=0A12-FAKE-SHARE.', suspicious: true },
        { id: 'alternate-reply', text: 'Választ egy consultant-mail.com címre kér.', suspicious: true },
        { id: 'threat-project', text: 'Projekt felfüggesztésével fenyeget 18:00 után.', suspicious: true },
        { id: 'external-auditor', text: 'Külsős könyvvizsgáló kéri az utalások megerősítését.', suspicious: true },
        { id: 'casual-greeting', text: 'Informális megszólítás: „Sziasztok”.', suspicious: false },
        { id: 'deadline-info', text: 'Konkrét határidőt ad meg: ma 18:00.', suspicious: false },
        { id: 'signature', text: 'Aláírás: „Ivett" – külsős könyvvizsgáló.', suspicious: false }
      ]
    },
    {
      email: {
      from: 'incident@sentinel-grid.io',
      fromName: 'Sentinel OnCall',
      subject: 'KRITIKUS: VPN kulcs kompromittálódott',
      body: `On-call csapat,

A VPN kulcsaink kiszivárogtak – azonnali rotáció szükséges.

1. Ugrás a https://vpn-reset.azureedge.net oldalra
2. Írd be a root jelszót (itt találod: pastebin.com/xyz123)
3. A kész kulcsot küldd vissza ide VÁLASZBAN, hogy a ticketet lezárhassuk.

Ha 20 percen belül nincs visszajelzés, a teljes távoli hozzáférést tiltjuk.`
      },
      elements: [
        { id: 'external-reset', text: 'VPN reset külső azureedge.net címen történik.', suspicious: true },
        { id: 'pastebin-password', text: 'Root jelszót publikusan megosztott pastebin linkre irányít.', suspicious: true },
        { id: 'send-keys', text: 'Az új kulcsot válaszként kell elküldeni emailben.', suspicious: true },
        { id: 'critical-urgency', text: '20 perces határidővel fenyeget.', suspicious: true },
        { id: 'capitalized-warning', text: 'A tárgy és utasítások végig nagybetűs „KRITIKUS” jelzést tartalmaznak.', suspicious: true },
        { id: 'step-list', text: 'Részletes, számozott lépéseket ad.', suspicious: false },
        { id: 'team-address', text: 'Az üzenet a Sentinel OnCall csapattól érkezik.', suspicious: false },
        { id: 'clear-subject', text: 'Egyértelmű témát jelöl: VPN kulcs kompromittálódott.', suspicious: false }
      ]
    }
  ]
}

const HINTS_BY_DIFFICULTY = {
  easy: 'Domain, sürgetés és rövidített link: keresd a legnyilvánvalóbb jeleket.',
  medium: 'Nézd meg, egyezik-e a domain a feladóval, és van-e rendellenes csatolmány/link.',
  hard: 'Vizsgáld meg a reply-to címet, a linkeket és a fejlécet. Gyakran több gyanús elem együtt jelzi a támadást.'
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
    
    // Email template választása
    // Fix narratíva minden PhishingRecognitionTask-nál
    const narrative = {
        intro: 'A kommunikációs csatornákon keresztül érkező jelek várnak elemzésre. A rendszer riasztásai egyre gyakoribbá válnak.',
        task: 'Egy gyanús email érkezett a rendszerbe. Elemezd az üzenetet és azonosítsd azokat az elemeket, amelyek adathalászatra utalnak.',
        hint: 'Figyeld meg a domain neveket, a megszólításokat, a linkeket és a nyelvhasználatot. A phishing üzenetek gyakran sürgetnek és gyanús linkeket tartalmaznak.'
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


