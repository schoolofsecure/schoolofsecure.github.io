# QA Debug Panel és Task Preview List

## Áttekintés

Két fejlesztői eszköz lett létrehozva a játék teszteléséhez és a feladatok ellenőrzéséhez.

## 1. QA Debug Panel

**URL:** `/qa-debug`

### Funkciók

1. **Pályaszám választó (1-12)**
   - Dropdown menü, ahol kiválasztható a pálya száma
   - Az 1. pálya fix, a 2-12. pályák dinamikusan generálódnak

2. **Feladattípus választó**
   - Checkbox lista mind a 20 feladattípusból
   - "Összes" és "Törlés" gombok a gyors kiválasztáshoz
   - 5 típus kiválasztása teljes pályához, 1 típus előnézethez

3. **Override Seed mező**
   - Szám beírásával fixálható a generálás
   - Üres mező = random generálás
   - Ugyanaz a seed = ugyanazok a feladatok

4. **Reset Seed gomb**
   - Visszaállítja a seed-et random módra

5. **Generate Preview gombok**
   - **Generate Preview (Pálya)**: Teljes pálya generálása (5 feladat)
   - **Előnézet (1 feladat)**: Egyetlen feladat generálása

6. **Betöltés pályaképernyőre gomb**
   - A kiválasztott beállításokkal betölti a megfelelő pályát
   - Seed és forced types átadása sessionStorage-on keresztül

### Használat

1. Válassz pályaszámot (pl. 2)
2. Opcionálisan állíts be seed-et (pl. 12345)
3. Válassz ki 5 feladattípust (vagy hagyd üresen a random generáláshoz)
4. Kattints a "Generate Preview (Pálya)" gombra
5. Az előnézetben láthatod a generált feladatokat
6. A "Betöltés pályaképernyőre" gombbal betöltheted a teljes pályát

## 2. Task Preview List

**URL:** `/task-preview`

### Funkciók

1. **Összes feladattípus listázása**
   - Mind a 20 típus gombként jelenik meg
   - Kattintással kiválasztható

2. **3 példa minden típusból**
   - Könnyű, közepes, nehéz nehézségi szintek
   - Seedelt generálás (konzisztens eredmények)

3. **Részletes információ**
   - Feladat szövege
   - Input mezők
   - Generált megoldás
   - Payload adatok
   - StyleConfig alkalmazása

### Használat

1. Nyisd meg a `/task-preview` oldalt
2. Kattints egy feladattípusra
3. Válassz nehézségi szintet (1. easy, 2. medium, 3. hard)
4. Nézd meg a generált feladatot és a debug információkat

## 3. Seed Rendszer

### Implementáció

A seed rendszer a `Random` utils-ban van implementálva:

```javascript
// Seed beállítása
Random.setSeed(12345)

// Seed használata (determinisztikus)
const num = Random.random()

// Seed reset
Random.resetSeed()
```

### LevelGenerator Seed Támogatás

```javascript
// Seed nélkül (random)
const tasks = LevelGenerator.generateLevel(2, 5)

// Seed-del (determinisztikus)
const tasks = LevelGenerator.generateLevel(2, 5, new Map(), 4, { seed: 12345 })

// Forced types-szel (QA debug)
const tasks = LevelGenerator.generateLevel(2, 5, new Map(), 4, {
  seed: 12345,
  forcedTypes: ['CAESAR', 'PHISHING', 'LOG_ANALYSIS', 'ICON_MEMORY', 'SECURITY_DECISION']
})
```

## 4. Integráció az ugy2 oldallal

Az ugy2 oldal automatikusan ellenőrzi a sessionStorage-t:

- `qa_seed`: Seed érték
- `qa_level`: Pálya száma
- `qa_forced_types`: Kényszerített típusok (JSON)

Ha ezek léteznek, akkor ezekkel generálja a feladatokat, majd törli őket.

## 5. Route-ok

- `/qa-debug` - QA Debug Panel
- `/task-preview` - Task Preview List

Mindkét oldal elérhető a főmenüből vagy közvetlen URL-lel.

## Példa Használat

### Teljes pálya generálása seed-del

1. Nyisd meg a `/qa-debug` oldalt
2. Válassz pályaszámot: 3
3. Írd be a seed-et: 12345
4. Kattints "Generate Preview (Pálya)"
5. Láthatod az 5 generált feladatot

### Egyetlen feladat előnézete

1. Nyisd meg a `/qa-debug` oldalt
2. Válassz egy feladattípust (pl. PHISHING)
3. Kattints "Előnézet (1 feladat)"
4. Láthatod a generált feladatot

### Pálya betöltése QA módban

1. Nyisd meg a `/qa-debug` oldalt
2. Válassz pályaszámot: 4
3. Írd be a seed-et: 99999
4. Válassz ki 5 feladattípust
5. Kattints "Betöltés pályaképernyőre"
6. Az ugy4 oldal a kiválasztott beállításokkal töltődik be

