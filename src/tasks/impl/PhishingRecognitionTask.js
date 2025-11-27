import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Bővített phishing elemek pool több variációval
const PHISHING_ELEMENT_POOL = [
  { id: 'spoofed-domain', text: 'Feladó domainje gyanús (paypaI.com)', suspicious: true },
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
  { id: 'privacy-policy', text: 'Adatvédelmi irányelvek linkje', suspicious: false }
]

// Email template-ek phishing feladatokhoz
const EMAIL_TEMPLATES = [
  {
    from: 'security@paypaI.com',
    fromName: 'PayPal Biztonsági Csapat',
    subject: 'Sürgős: Fiókod biztonsági riasztás',
    body: `Tisztelt Ügyfelünk,

A fiókjához gyanús bejelentkezési kísérletet észleltünk. A fiók biztonsága érdekében azonnali intézkedésre van szükség.

Kérjük, kattintson a következő linkre a fiók visszaállításához:
bit.ly/paypal-secure-verify

Ha nem Ön volt, akkor a fiók 12 órán belül lezárásra kerül.

Üdvözlettel,
PayPal Biztonsági Csapat`
  },
  {
    from: 'noreply@banksecure.com',
    fromName: 'BankSecure Ügyfélszolgálat',
    subject: 'Fontos: Fiók frissítés szükséges',
    body: `Tisztelt Ügyfelünk,

A rendszerünkben frissítés történt. A fiókja eléréséhez kérjük, frissítse az adatait.

Kattintson ide: https://banksecure.com/update-now

A fiók elérése 24 órán belül korlátozásra kerül, ha nem frissíti az adatait.

Ügyfélszolgálat: +36-1-234-5678

Üdvözlettel,
BankSecure Csapat`
  },
  {
    from: 'alerts@cyb3rmuseum.org',
    fromName: 'CyberMuseum Rendszergazda',
    subject: 'Azonnali cselekvés szükséges',
    body: `Tisztelt Felhasználó,

A rendszerünkben kritikus biztonsági incidens történt. Azonnali cselekvésre van szükség.

Kattintson a linkre a részletek megtekintéséhez:
http://cyb3rmuseum.org/urgent-action

FIGYELEM: Ha nem cselekszik 6 órán belül, a fiók véglegesen törlésre kerül.

Minden kérdés esetén válaszoljon erre az emailre.

Üdvözlettel,
Rendszergazda`
  },
  {
    from: 'support@amazon-marketplace.com',
    fromName: 'Amazon Marketplace',
    subject: 'Rendelés visszaigazolás',
    body: `Kedves Vásárló,

Köszönjük a rendelését! A rendelés részletei a csatolmányban találhatók.

Kattintson ide a rendelés követéséhez: bit.ly/amazon-order-track

Ha nem Ön adta le a rendelést, azonnal lépjen kapcsolatba velünk.

Üdvözlettel,
Amazon Marketplace Csapat`
  }
]

export class PhishingRecognitionTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // styleConfig randomRules használata
    const rules = StyleHelper.getRandomRules('PHISHING')
    const elementCount = rules.suspiciousElements?.[difficulty] || 
                        (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)
    
    const setSize = elementCount + (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 2)
    const elements = Random.sample(PHISHING_ELEMENT_POOL, setSize)
    const solution = elements.filter(e => e.suspicious).map(e => e.id)

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
    const emailTemplate = Random.choice(EMAIL_TEMPLATES)
    
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
      hint: narrative.hint
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


