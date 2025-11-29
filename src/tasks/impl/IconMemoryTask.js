import { BaseTask } from '../types/TaskInterface'
import { Random } from '../utils/random'
import { StyleHelper } from '../utils/styleHelper'

// Bővített ikon pool több variációval
const ICON_SET = [
  { id: 'lock', label: 'Lakatos ikon', type: 'safe' },
  { id: 'shield', label: 'Pajzs ikon', type: 'safe' },
  { id: 'skull', label: 'Halálfej ikon', type: 'threat' },
  { id: 'bug', label: 'Bogár ikon', type: 'threat' },
  { id: 'email', label: 'E-mail ikon', type: 'neutral' },
  { id: 'wifi', label: 'Wi-Fi ikon', type: 'neutral' },
  { id: 'warning', label: 'Figyelmeztetés ikon', type: 'threat' },
  { id: 'key', label: 'Kulcs ikon', type: 'safe' },
  { id: 'firewall', label: 'Tűzfal ikon', type: 'safe' },
  { id: 'virus', label: 'Vírus ikon', type: 'threat' },
  { id: 'hacker', label: 'Hacker ikon', type: 'threat' },
  { id: 'database', label: 'Adatbázis ikon', type: 'neutral' },
  { id: 'server', label: 'Szerver ikon', type: 'neutral' },
  { id: 'encryption', label: 'Titkosítás ikon', type: 'safe' }
]

export class IconMemoryTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    // styleConfig randomRules használata
    const rules = StyleHelper.getRandomRules('ICON_MEMORY')
    const complexity = StyleHelper.getComplexity(difficulty)
    
    const pairCount = rules.pairs?.[difficulty] || complexity.iconCount || 
                     (difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5)
    const chosen = Random.sample(ICON_SET, pairCount * 2) // Dupla, hogy legyen párosítás
    const requiredTypes = chosen.filter(icon => icon.type === 'threat').map(icon => icon.id)

    return new IconMemoryTask({
      id,
      difficulty,
      parameters: {
        icons: chosen,
        requiredTypes,
        levelNumber,
        slot
      }
    })
  }

  constructor({ id, difficulty, parameters }) {
    super({ id, type: 'ICON_MEMORY', difficulty, parameters })
  }

  generate() {
    if (this.payload) return this.payload
    const { icons, requiredTypes, levelNumber, slot } = this.parameters
    
    // Narratív szövegek variációi
    const narratives = [
      {
        intro: 'A rendszer egyik archivált adatcsomagjában furcsa szövegrácsot találtak. A technikusok szerint valaki szándékosan rejtett el benne kulcsszavakat.',
        task: 'A biztonsági csapat téged kér, hogy keresd meg a rejtett szavakat — ezek vezetnek a következő nyomhoz. De vigyázz: a támadó mindig hagy egy hamis nyomot is.',
        hint: 'Minden szó első betűje számot rejt. Figyeld a rácsban elrejtett kulcsszavakat, így juthatsz a következő kódhoz.'
      },
      {
        intro: 'A monitorok remegő fényében gyanús aktivitás jelei bukkannak fel. A rendszer ikonjai között gyanús mintázatok találhatók.',
        task: 'Jegyezd meg, mely ikonok jelentenek kockázatot (pl. malware/phishing), majd jelöld ki őket. A memória teszt segít azonosítani a fenyegetéseket.',
        hint: 'Figyeld a részleteket, mert ott rejlik a megoldás. A veszélyes ikonok gyakran hasonlóak a biztonságosakhoz.'
      },
      {
        intro: 'A hálózat mélyén titkosított adatok rejtőznek. A biztonsági rendszer riasztásai egyre gyakoribbá válnak.',
        task: 'A rendszer ikonjai között gyanús elemek találhatók. Azonosítsd azokat az ikonokat, amelyek potenciális biztonsági kockázatot jeleznek.',
        hint: 'Ne siess, alaposan elemezd az adatokat. A rendszer mindig hagy nyomokat, csak meg kell találnod őket.'
      }
    ]
    
    const narrative = Random.choice(narratives)
    this.solution = requiredTypes
    
    this.payload = {
      intro: narrative.intro,
      instructions: narrative.task,
      icons,
      hint: narrative.hint
    }
    return this.payload
  }

  validate(userInput) {
    if (!Array.isArray(userInput)) return false
    if (!this.solution) this.generate()
    const sortedInput = [...new Set(userInput)].sort()
    const sortedSolution = [...new Set(this.solution)].sort()
    return JSON.stringify(sortedInput) === JSON.stringify(sortedSolution)
  }
}


