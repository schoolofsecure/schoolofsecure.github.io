import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Bővített plaintext pool több variációval
const SAMPLE_PLAINTEXTS = [
  'HELLO WORLD',
  'SECURE CHANNEL',
  'CYBER DEFENSE',
  'TRUST NO ONE',
  'ACCESS GRANTED',
  'ZERO DAY ALERT',
  'AGENT REPORT',
  'LOCKDOWN ACTIVE',
  'BREACH DETECTED',
  'NETWORK WATCH',
  'SHADOW PROTOCOL',
  'DARK WEB ACCESS',
  'ENCRYPTED MESSAGE',
  'SECRET KEY FOUND',
  'ALERT SYSTEM DOWN',
  'INTRUSION DETECTED',
  'BACKUP RESTORED',
  'FIREWALL BYPASSED',
  'ROOT ACCESS GAINED',
  'DATA EXFILTRATED'
]

export class CaesarTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // styleConfig randomRules használata
    const rules = StyleHelper.getRandomRules('CAESAR')
    const shiftRange = rules.shifts?.[difficulty] || { easy: [1, 5], medium: [6, 15], hard: [16, 25] }
    
    const plaintextPool = {
      easy: SAMPLE_PLAINTEXTS.slice(0, 6),
      medium: SAMPLE_PLAINTEXTS.slice(3, 12),
      hard: SAMPLE_PLAINTEXTS
    }

    const [min, max] = shiftRange
    const plaintext = Random.choice(plaintextPool[difficulty])
    const shift = Random.int(min, max)

    return new CaesarTask({
      id,
      difficulty,
      parameters: { plaintext, shift, levelNumber, slot }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'CAESAR', difficulty, parameters })
  }

  static encode(text, shift) {
    const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    return text
      .toUpperCase()
      .split('')
      .map(char => {
        const idx = base.indexOf(char)
        if (idx === -1) return char
        return base[(idx + shift) % 26]
      })
      .join('')
  }

  generate() {
    if (this.payload) return this.payload
    const { plaintext, shift, levelNumber, slot } = this.parameters
    
    // Narratív szövegek variációi
    const narratives = [
      {
        intro: 'Az éjszaka leple alatt a rendszer mélyén rejtett nyomok várnak. A monitorok remegő fényében gyanús aktivitás jelei bukkannak fel.',
        task: 'A képernyőn furcsa karakterek villognak, mintha valaki sietve rejtette volna el az üzenetet. Fejtsd meg a titkosított üzenetet, hogy megtudd az első nyomot a küldetésedhez.',
        hint: 'Gondolj az ábécére, és képzeld el, hogy minden betű egy kicsit előrébb vagy hátrébb lép a sorban. A szóközök és írásjelek nem változnak.'
      },
      {
        intro: 'A hálózat mélyén titkosított adatok rejtőznek. A biztonsági rendszer riasztásai egyre gyakoribbá válnak.',
        task: 'A titkosított üzenetek mögött rejtett információkat kell feltárnod. A kijelző felvillan, a sorok villogni kezdenek… minden karakter egy újabb nyomot rejt.',
        hint: 'Próbáld kibogozni a titkos üzenetet, amely el van rejtve a karakterek között. A Caesar-kód egyszerű eltolást használ.'
      },
      {
        intro: 'A logfájlok között elrejtett üzenetek várnak a megfejtésre. A rendszer mindig hagy nyomokat, csak meg kell találnod őket.',
        task: 'Elemezd a rendelkezésre álló adatokat és keresd meg a gyanús mintákat. A titkosított hálózaton tovább jutsz, és a következő bizonyíték vár.',
        hint: 'Figyeld a részleteket, mert ott rejlik a megoldás. A kulcs gyakran a legváratlanabb helyen bukkan fel.'
      }
    ]
    
    const narrative = Random.choice(narratives)
    const ciphertext = CaesarTask.encode(plaintext, shift)
    this.solution = plaintext.toUpperCase().replace(/\s+/g, ' ')
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      ciphertext,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!userInput) return false
    const normalized = userInput.toUpperCase().replace(/\s+/g, ' ').trim()
    if (!this.solution) this.generate()
    return normalized === this.solution
  }
}


