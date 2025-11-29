# Pálya Generálás - Típus Rotáció Rendszer

## Áttekintés

A 2. pályától kezdve (összesen 11 dinamikus pálya, 2-12) minden pálya **5 különböző feladatot** tartalmaz, ahol:

- **20 különböző feladattípus** van összesen
- **Az 1. pálya fix** (statikus feladatok: CAESAR, LOG_ANALYSIS, CRYPTO_PUZZLE, ICON_MEMORY, SECURITY_DECISION)
- **Az 1. pálya típusai NEM jelennek meg a 2-5. pályákon** (4 pálya cooldown)
- Minden pályán **5 különböző típus** jelenik meg
- **Ugyanaz a típus nem szerepel az előző 3-4 pályában** (cooldown mechanizmus)
- Ha pályák száma > 4, a típusok újra használhatók, de csak 3-4 pályával korábbi előfordulás után

## Mechanizmus

### Cooldown Rendszer

1. **1. pálya típusai kizárva**: Az 1. pálya típusai (CAESAR, LOG_ANALYSIS, CRYPTO_PUZZLE, ICON_MEMORY, SECURITY_DECISION) **NEM jelennek meg a 2-5. pályákon**
2. **4 pálya cooldown**: Egy feladattípus csak akkor használható újra, ha legalább 4 pálya telt el az utolsó előfordulása óta
3. **Típus követés**: A rendszer nyilvántartja, hogy melyik típus volt használva az egyes pályákon
4. **Elérhető típusok**: Minden pálya generálásakor csak azok a típusok elérhetők, amelyek nincsenek cooldown-ban

### Generálás Logika

```javascript
// Példa: 2. pálya generálása
const tasks = LevelGenerator.generateLevel(2, 5, typeHistory, 4)

// Példa: Összes pálya generálása egyszerre
const allLevels = LevelGenerator.generateAllLevels(2, 12, 5)
```

### Sorrendi Preferenciák

A `styleConfig.sequencing` szerint:
- **1. slot**: CAESAR, VIGENERE, XOR (nyitó puzzle)
- **2. slot**: LOG_ANALYSIS, HASH_MISMATCH (bizonyíték / log)
- **3. slot**: PHISHING, URL_TRUST, EMAIL_HEADER (kommunikáció)
- **4. slot**: ICON_MEMORY, NETWORK_ANOMALY, CRYPTO_PUZZLE
- **5. slot**: SECURITY_DECISION, MISCONFIG, FIREWALL, RISKY_PERMISSION

## Példa Pálya Eloszlás

### Pálya 1 (Fix - statikus)
- CAESAR - Rejtjel
- LOG_ANALYSIS - Torzult rendszerlog
- CRYPTO_PUZZLE - Titkosított levél
- ICON_MEMORY - Kódolt betűk
- SECURITY_DECISION - Nyomok dokumentálása

### Pálya 2 (Az 1. pálya típusai kizárva)
- VIGENERE (easy) - Az 1. pálya típusai cooldown-ban
- HASH_MISMATCH (medium)
- PHISHING (medium)
- NETWORK_ANOMALY (easy)
- MISCONFIG (hard)

### Pálya 3 (Az 1. pálya típusai még mindig kizárva)
- XOR (medium) - Az 1. pálya típusai és a 2. pálya típusai cooldown-ban
- EMAIL_HEADER (easy)
- SOCIAL_ENGINEERING (medium)
- PSEUDOCODE_BUG (easy)
- FIREWALL (hard)

### Pálya 4 (Az 1. pálya típusai még mindig kizárva)
- PASSWORD_STRENGTH (medium) - Az 1. pálya típusai és a 2-3. pálya típusai cooldown-ban
- URL_TRUST (easy)
- RISKY_PERMISSION (medium)
- ATTACK_SCENARIO (hard)
- ZERO_DAY (easy)

### Pálya 5 (Az 1. pálya típusai még mindig kizárva)
- VIGENERE (medium) - Az 1. pálya típusai és a 2-4. pálya típusai cooldown-ban
- HASH_MISMATCH (easy)
- PHISHING (medium)
- NETWORK_ANOMALY (hard)
- MISCONFIG (easy)

### Pálya 6 (Az 1. pálya típusai már újra használhatók!)
- CAESAR (medium) - **Újra használható** (5 pálya telt el az 1. pálya óta)
- LOG_ANALYSIS (hard) - **Újra használható**
- CRYPTO_PUZZLE (easy) - **Újra használható**
- ICON_MEMORY (medium) - **Újra használható**
- SECURITY_DECISION (hard) - **Újra használható**

## Feladattípusok Listája (20 típus)

1. **CAESAR** - Caesar-kód dekódolás
2. **VIGENERE** - Vigenère-kód dekódolás
3. **XOR** - XOR titkosítás
4. **HASH_MISMATCH** - Hash ellenőrzés
5. **ICON_MEMORY** - Ikon memória puzzle
6. **PASSWORD_STRENGTH** - Jelszó-erősség értékelés
7. **PHISHING** - Phishing email felismerés
8. **URL_TRUST** - URL megbízhatóság ellenőrzés
9. **LOG_ANALYSIS** - Log fájl elemzés
10. **SOCIAL_ENGINEERING** - Social engineering döntés
11. **FIREWALL** - Tűzfal szabályok
12. **MISCONFIG** - Konfiguráció hibakeresés
13. **RISKY_PERMISSION** - Kockázatos engedélyek
14. **SECURITY_DECISION** - Biztonsági döntési puzzle
15. **CRYPTO_PUZZLE** - Kriptográfiai puzzle
16. **PSEUDOCODE_BUG** - Pszeudokód hibakeresés
17. **NETWORK_ANOMALY** - Hálózati anomália felismerés
18. **EMAIL_HEADER** - Email fejléc elemzés
19. **ATTACK_SCENARIO** - Támadási szcenárió felismerés
20. **ZERO_DAY** - Zero-day exploit felismerés

## Használat

### Egy pálya generálása

```javascript
import { LevelGenerator } from './tasks'

// 2. pálya generálása
const tasks = LevelGenerator.generateLevel(2, 5)
tasks.forEach(task => task.generate())
```

### Összes pálya generálása

```javascript
// Összes pálya (2-12) generálása egyszerre
const allLevels = LevelGenerator.generateAllLevels(2, 12, 5)

// Pálya 2 feladatainak elérése
const level2Tasks = allLevels.get(2)
```

## Garantált Változatosság

- ✅ Minden pályán **5 különböző típus**
- ✅ **4 pálya cooldown** biztosítja, hogy ugyanaz a típus ne jöjjön vissza túl gyakran
- ✅ **20 típus** elég ahhoz, hogy mind a 11 pályán változatos legyen
- ✅ **Sorrendi preferenciák** biztosítják a logikus feladat sorrendet
- ✅ **Nehézség fokozatos növekedése** a pályák előrehaladtával

