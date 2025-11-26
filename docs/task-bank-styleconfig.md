# Task Bank - StyleConfig és Dinamikus Generálás

## Áttekintés

A 2. pályától kezdve a feladatok dinamikusan generálódnak a `styleConfig` modul szerint, hogy illeszkedjenek az 1. pálya hangulatához és struktúrájához.

## Használat

### Pálya generálása

```javascript
import { LevelGenerator } from './tasks'

// 2. pálya generálása (5 feladat)
const tasks = LevelGenerator.generateLevel(2, 5)

// Minden task objektum tartalmazza:
// - id: egyedi azonosító
// - type: feladattípus (pl. 'CAESAR', 'PHISHING')
// - difficulty: nehézség ('easy', 'medium', 'hard')
// - payload: feladat adatai (generate() hívás után)
// - solution: megoldás (validate() használja)
```

### Feladat generálása és validálása

```javascript
// Feladat generálása
const task = tasks[0]
task.generate() // Létrehozza a payload-t

// Felhasználói válasz validálása
const isValid = task.validate(userInput)
```

## StyleConfig Struktúra

### 1. Feladattípus-eloszlás

A `taskDistribution` meghatározza, milyen arányban jelennek meg a különböző feladattípusok:

- **CAESAR**: 8%
- **PHISHING**: 7%
- **LOG_ANALYSIS**: 7%
- **VIGENERE**: 6%
- stb.

### 2. Nehézség-eloszlás pályánként

A `difficultyByLevel` meghatározza a nehézség arányokat pályánként:

- **2. pálya**: 55% könnyű, 35% közepes, 10% nehéz
- **3. pálya**: 45% könnyű, 45% közepes, 10% nehéz
- **4. pálya**: 30% könnyű, 55% közepes, 15% nehéz
- stb.

### 3. Sorrend / Rotáció

A `sequencing` meghatározza, milyen típusú feladatok jelennek meg adott pozíciókon:

- **1. slot**: CAESAR, VIGENERE, XOR (nyitó puzzle)
- **2. slot**: LOG_ANALYSIS, HASH_MISMATCH (bizonyíték / log)
- **3. slot**: PHISHING, URL_TRUST, EMAIL_HEADER (kommunikáció)
- **4. slot**: ICON_MEMORY, NETWORK_ANOMALY, CRYPTO_PUZZLE
- **5. slot**: SECURITY_DECISION, MISCONFIG, FIREWALL, RISKY_PERMISSION

### 4. Randomizálási szabályok

A `randomRules` meghatározza, milyen paraméterek variálhatók feladattípusonként:

- **CAESAR**: shift tartomány (easy: 1-5, medium: 6-15, hard: 16-25)
- **PHISHING**: gyanús elemek száma (easy: 3, medium: 4, hard: 5)
- **LOG_ANALYSIS**: log sorok száma (easy: 8, medium: 12, hard: 16)
- stb.

## Példa Generált Pályák

### 2. Pálya (példa)

1. **CAESAR** (easy) - "Yljbdcc, Crol ohkhw wlwnrvxjbqrn"
2. **LOG_ANALYSIS** (medium) - Log fájl elemzés, 12 sor, 2 anomália
3. **PHISHING** (medium) - Email elemzés, 4 gyanús elem
4. **ICON_MEMORY** (easy) - 3 ikon párosítás
5. **SECURITY_DECISION** (hard) - Biztonsági döntési puzzle

### 3. Pálya (példa)

1. **VIGENERE** (medium) - Kulcsszó: "SECRET"
2. **HASH_MISMATCH** (medium) - MD5/SHA1 hash ellenőrzés
3. **URL_TRUST** (medium) - Domain spoofing felismerés
4. **NETWORK_ANOMALY** (hard) - 8 hálózati flow elemzés
5. **MISCONFIG** (hard) - Konfiguráció hibakeresés

## Task Implementáció Minta

Minden Task osztálynak tartalmaznia kell:

1. **create()** statikus metódus: `styleConfig.randomRules` használata
2. **generate()** metódus: narratív szövegek variációival
3. **validate()** metódus: robusztus validáció

```javascript
export class MyTask extends BaseTask {
  static create({ id, difficulty, levelNumber = 2, slot = 1 }) {
    const rules = StyleHelper.getRandomRules('MY_TASK')
    // ... paraméterek generálása
    return new MyTask({ id, difficulty, parameters })
  }

  generate() {
    const narratives = [
      { intro: '...', task: '...', hint: '...' },
      // több variáció
    ]
    const narrative = Random.choice(narratives)
    // ... payload generálás
  }

  validate(userInput) {
    // ... validáció logika
  }
}
```

## Új Feladattípus Hozzáadása

1. Hozz létre egy új fájlt `src/tasks/impl/MyTask.js`
2. Implementáld a `BaseTask` osztályt
3. Regisztráld a `TaskFactory.js`-ben
4. Add hozzá a `styleConfig.taskDistribution`-hoz
5. Add hozzá a `styleConfig.randomRules`-hoz
6. Opcionálisan: add hozzá a `styleConfig.sequencing`-hez

## Variációk

Minden feladattípus tartalmaz **legalább 3-5 variációt**:

- **Plaintext pool**: több mintázat a titkosított üzenetekhez
- **Narratív szövegek**: több intro/task/hint kombináció
- **Paraméterek**: randomizált értékek a nehézség szerint

## Dokumentáció Frissítése

Ez a dokumentáció frissül, amikor új feladattípusokat adunk hozzá vagy módosítjuk a styleConfig-et.

