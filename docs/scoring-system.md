# Pontozási és Rangrendszer Dokumentáció

## Áttekintés

A játék Duolingo-stílusú pontozási és rangrendszert használ, amely motiváló, de nem teljesen büntető. A rendszer a játékos teljesítményét pontokkal értékeli, és rangokat ad a pályák alapján.

## Főbb komponensek

### 1. Pontozási Rendszer (`src/utils/scoring.js`)

#### Alappontok
- **Feladat sikeres teljesítése**: +10 pont
- **Hibázás**: -5 pont (nem teljesen büntető)
- **Hibátlan pálya bónusz**: +50 pont
- **Gyors teljesítés bónusz**: +20 pont (< 5 perc)
- **Minden nyom helyes bónusz**: +30 pont

#### Nehézség szorzók
- **Könnyű**: 1.0x
- **Közepes**: 1.5x
- **Nehéz**: 2.0x

#### Pálya bónuszok
Minden pálya után pálya-specifikus bónusz jár:
- Pálya 1: 0 pont
- Pálya 2: 10 pont
- Pálya 3: 15 pont
- ... (növekvő)
- Pálya 12: 75 pont

### 2. Rangrendszer

A 12 pálya 6 rangra van osztva:

1. **Nyomozó-újonc** (🔍) - Pálya 1-2, 0+ pont
2. **Junior nyomozó** (🕵️) - Pálya 3-4, 100+ pont
3. **Nyomozó** (🕵️‍♂️) - Pálya 5-6, 250+ pont
4. **Senior nyomozó** (🕵️‍♀️) - Pálya 7-8, 450+ pont
5. **Hálózat-specialista** (🎯) - Pálya 9-10, 700+ pont
6. **Mester nyomozó** (👑) - Pálya 11-12, 1000+ pont

### 3. Achievement-ek

- **Hibátlan pálya** (⭐): Teljesítsd egy pályát hiba nélkül (+50 pont)
- **Villámgyors** (⚡): Teljesíts egy pályát 5 perc alatt (+20 pont)
- **Tökéletes dokumentálás** (📋): Minden nyomot helyesen dokumentálj (+30 pont)
- **5 pálya sorozat** (🔥): Teljesíts 5 pályát sorban hiba nélkül (+100 pont)
- **Mester nyomozó** (👑): Érd el a legmagasabb rangot (+200 pont)

### 4. Visszajelzések

#### Feladat után
- **Helyes válasz**: "Helyes döntés! +X pont, a hacker nyomai közelebb kerülnek a feltáráshoz."
- **Hibázás**: "Figyelj jobban! -X pont, de még mindig nyomozhatsz tovább."

#### Pálya végén
Összegző visszajelzés, amely tartalmazza:
- Összes pontszám
- Jelenlegi rang
- Bónuszok listája
- Következő pálya információ

## Implementáció

### ScoringContext (`src/contexts/ScoringContext.jsx`)

A pontozási rendszer React Context API-t használ, amely:
- Tárolja a játékos pontszámát
- Kezeli a rangokat
- Nyomon követi az achievement-eket
- Menti az adatokat (jelenleg localStorage, később Firebase)

### ScoreDisplay komponens (`src/components/Scoring/ScoreDisplay.jsx`)

A jobb felső sarokban megjelenített komponens, amely mutatja:
- Jelenlegi rang (ikon + név)
- Összes pontszám

### Integráció

#### ugy1 és ugy2 oldalak

Mindkét oldal:
1. Eltávolította az életek rendszerét
2. Eltávolította a figurajelet
3. Hozzáadta a `ScoreDisplay` komponenst
4. Integrálta a pontozást a feladatokba
5. Hozzáadta a visszajelzéseket

#### Feladat pontozása

```javascript
const result = scoreTask({
  difficulty: 'easy' | 'medium' | 'hard',
  isCorrect: true | false,
  level: 1-12,
  timeSpent: number (opcionális, másodpercben)
})
```

#### Pálya pontozása

```javascript
const result = scoreLevel({
  level: 1-12,
  totalTasks: number,
  completedTasks: number,
  errors: number,
  timeSpent: number (másodpercben),
  allCluesCorrect: boolean
})
```

## Jövőbeli fejlesztések

1. **Firebase integráció**: A pontozási adatok Firebase-be mentése
2. **Leaderboard**: Ranglista a legjobb játékosokkal
3. **További achievement-ek**: További kihívások és jutalmak
4. **Statisztikák oldal**: Részletes statisztikák a játékos teljesítményéről

