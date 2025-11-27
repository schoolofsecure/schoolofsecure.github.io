import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Bővített phishing elemek pool több variációval
const PHISHING_ELEMENT_POOL = [
  { id: 'spoofed-domain', text: 'Feladó domainje gyanús (aurora-pay.com)', suspicious: true },
  { id: 'urgent-tone', text: 'Sürgős lezárással fenyeget 12 órán belül', suspicious: true },
  { id: 'legit-contact', text: 'Ügyfélszolgálat hivatalos száma szerepel', suspicious: false },
  { id: 'attachment', text: 'Ismeretlen .zip csatolmány', suspicious: true },
  { id: 'public-greeting', text: '„Tisztelt Ügyfelünk" megszólítás', suspicious: true },
  { id: 'signed-ceo', text: 'Vállalati CEO aláírás', suspicious: false },
  { id: 'short-link', text: 'Rövidített link (bit.ly/secure)', suspicious: true },
  { id: 'dmca-footer', text: 'DMCA/GDPR lábléc', suspicious: false },
  { id: 'typo-domain', text: 'Helyesírási hiba a domainben (cyb3rmuseum.org)', suspicious: true },
  { id: 'suspicious-reply', text: 'A „Válasz" cím gyanús karaktereket tartalmaz', suspicious: true },
  { id: 'generic-link', text: 'Általános link gomb rövidített URL-lel', suspicious: true },
  { id: 'threat-language', text: 'Fenyegető nyelvhasználat és sürgetés', suspicious: true },
  { id: 'legit-logo', text: 'Hivatalos vállalati logó', suspicious: false },
  { id: 'privacy-policy', text: 'Adatvédelmi irányelvek linkje', suspicious: false },
  { id: 'dkim-fail', text: 'A fejléc szerint SPF/DKIM ellenőrzés sikertelen', suspicious: true },
  { id: 'replyto-mismatch', text: 'A válaszcím más domainre mutat', suspicious: true },
  { id: 'ip-mismatch', text: 'Az üzenet Ázsiából érkezett, miközben a csapat Európában dolgozik', suspicious: true },
  { id: 'it-ticket', text: 'IT ticket szám szerepel, de nincs összefüggés a tárggyal', suspicious: false },
  { id: 'legalese', text: 'Jogosnak tűnő hosszú lábléc, de nincs cégadat', suspicious: true },
  { id: 'internal-note', text: '„Belső üzenet" megjelölés, de publikus csatornán érkezett', suspicious: true }
]

const DIFFICULTY_CONFIG = {
  easy: { suspicious: 3, total: 4 },
  medium: { suspicious: 4, total: 6 },
  hard: { suspicious: 5, total: 8 }
}

// Email template-ek phishing feladatokhoz
const EMAIL_TEMPLATES = {
  easy: [
    {
      from: 'security@aurorapay.com',
      fromName: 'AuroraPay Biztonsági Csapat',
      subject: 'Sürgős: Fiókod biztonsági riasztás',
      body: `Tisztelt Ügyfelünk,

A fiókjához gyanús bejelentkezési kísérletet észleltünk. A fiók biztonsága érdekében azonnali intézkedésre van szükség.

Kérjük, kattintson a következő linkre a fiók visszaállításához:
bit.ly/paypal-secure-verify

Ha nem Ön volt, akkor a fiók 12 órán belül lezárásra kerül.

Üdvözlettel,
AuroraPay Biztonsági Csapat`
    },
    {
      from: 'support@orbitmall.com',
      fromName: 'OrbitMall Piac',
      subject: 'Rendelés visszaigazolás',
      body: `Kedves Vásárló,

Köszönjük a rendelését! A rendelés részletei a csatolmányban találhatók.

Kattintson ide a rendelés követéséhez: bit.ly/orbit-order-track

Ha nem Ön adta le a rendelést, azonnal lépjen kapcsolatba velünk.

Üdvözlettel,
OrbitMall csapat`
    }
  ],
  medium: [
    {
      from: 'noreply@vaultsecure.eu',
      fromName: 'VaultSecure Ügyfélszolgálat',
      subject: 'Fontos: Fiók frissítés szükséges',
      body: `Tisztelt Ügyfelünk,

A rendszerünkben frissítés történt. A fiókja eléréséhez kérjük, frissítse az adatait.

Kattintson ide: https://vaultsecure.eu/update-now

A fiók elérése 24 órán belül korlátozásra kerül, ha nem frissíti az adatait.

Ügyfélszolgálat: +36-1-234-5678

Üdvözlettel,
BankSecure Csapat`
    },
    {
      from: 'alerts@dynarchive.org',
      fromName: 'DynArchive Rendszergazda',
      subject: 'Azonnali cselekvés szükséges',
      body: `Tisztelt Felhasználó,

A rendszerünkben kritikus biztonsági incidens történt. Azonnali cselekvésre van szükség.

Kattintson a linkre a részletek megtekintéséhez:
http://cyb3rmuseum.org/urgent-action

FIGYELEM: Ha nem cselekszik 6 órán belül, a fiók véglegesen törlésre kerül.

Minden kérdés esetén válaszoljon erre az emailre.

Üdvözlettel,
Rendszergazda`
    }
  ],
  hard: [
    {
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
    {
      from: 'incident@sentinel-grid.io',
      fromName: 'Sentinel OnCall',
      subject: 'KRITIKUS: VPN kulcs kompromittálódott',
      body: `On-call csapat,

A VPN kulcsaink kiszivárogtak – azonnali rotáció szükséges.

1. Ugrás a https://vpn-reset.azureedge.net oldalra
2. Írd be a root jelszót (itt találod: pastebin.com/xyz123)
3. A kész kulcsot küldd vissza ide VÁLASZBAN, hogy a ticketet lezárhassuk.

Ha 20 percen belül nincs visszajelzés, a teljes távoli hozzáférést tiltjuk.`
    }
  ]
}

const HINTS_BY_DIFFICULTY = {
  easy: 'Domain, sürgetés és rövidített link: keresd a legnyilvánvalóbb jeleket.',
  medium: 'Nézd meg, egyezik-e a domain a feladóval, és van-e rendellenes csatolmány/link.',
  hard: 'Vizsgáld meg a reply-to címet, a linkeket és a fejlécet. Gyakran több gyanús elem együtt jelzi a támadást.'
}

export class PhishingRecognitionTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy
    const suspiciousPool = PHISHING_ELEMENT_POOL.filter(e => e.suspicious)
    const safePool = PHISHING_ELEMENT_POOL.filter(e => !e.suspicious)

    const suspiciousElements = Random.sample(suspiciousPool, config.suspicious)
    const safeElements = Random.sample(safePool, Math.max(0, config.total - config.suspicious))
    const elements = Random.shuffle([...suspiciousElements, ...safeElements])
    const solution = suspiciousElements.map(e => e.id)

    return new PhishingRecognitionTask({
      id,
      difficulty,
      parameters: { elements, solution, levelNumber, slot }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'PHISHING', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { elements, solution, levelNumber, slot } = this.parameters
    
    // Email template választása
    const templates = EMAIL_TEMPLATES[this.difficulty] || EMAIL_TEMPLATES.easy
    const emailTemplate = Random.choice(templates)
    
    // Narratív szövegek variációi
    const narratives = [
      {
        intro: 'A kommunikációs csatornákon keresztül érkező jelek várnak elemzésre. A rendszer riasztásai egyre gyakoribbá válnak.',
        task: 'Egy gyanús email érkezett a rendszerbe. Elemezd az üzenetet és azonosítsd azokat az elemeket, amelyek adathalászatra utalnak.',
        hint: 'Figyeld meg a domain neveket, a megszólításokat, a linkeket és a nyelvhasználatot. A phishing üzenetek gyakran sürgetnek és gyanús linkeket tartalmaznak.'
      },
      {
        intro: 'A hálózat mélyén titkosított adatok rejtőznek. A biztonsági rendszer riasztásai egyre gyakoribbá válnak.',
        task: 'A rendszer egy potenciálisan veszélyes emailt észlelt. Vizsgáld meg az üzenet részleteit és jelöld ki a gyanús elemeket.',
        hint: 'A valódi vállalati üzenetek hivatalos domainről érkeznek, nem tartalmaznak rövidített linkeket, és nem sürgetnek azonnali cselekvésre.'
      },
      {
        intro: 'A logfájlok között elrejtett üzenetek várnak a megfejtésre. A rendszer mindig hagy nyomokat, csak meg kell találnod őket.',
        task: 'Egy felhasználó gyanús emailt jelentett. Elemezd az üzenet tartalmát és azonosítsd a phishing jellemzőket.',
        hint: 'Gondold végig, milyen mintázatokat keresel. A phishing üzenetek gyakran használnak gyanús domaineket, sürgető nyelvet és rövidített linkeket.'
      }
    ]
    
    const narrative = Random.choice(narratives)
    this.solution = solution
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      email: {
        from: emailTemplate.from,
        fromName: emailTemplate.fromName,
        subject: emailTemplate.subject,
        body: emailTemplate.body
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


