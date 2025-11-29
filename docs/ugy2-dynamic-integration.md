# ugy2 Dinamikus Integráció

## Áttekintés

Az `ugy2` oldal mostantól dinamikusan generált feladatokat használ a `LevelGenerator` és `TaskRenderer` komponensek segítségével.

## Változtatások

### 1. TaskRenderer Komponens

**Fájl:** `src/components/TaskRenderer/TaskRenderer.jsx`

Univerzális komponens, ami a dinamikusan generált feladatokat rendereli a `type` mező alapján.

**Támogatott feladattípusok:**
- `CAESAR` - Caesar-kód dekódolás
- `VIGENERE` - Vigenère-kód dekódolás
- `PHISHING` - Phishing email elemzés (checkbox lista)
- `LOG_ANALYSIS` - Log fájl elemzés (táblázat, több választás)
- `ICON_MEMORY` - Ikon memória puzzle
- Alapértelmezett - Szöveges input (minden más típus)

**Használat:**
```jsx
<TaskRenderer
  task={currentTask}
  onSuccess={() => handleTaskSuccess(step)}
  onFailure={handleTaskFailure}
/>
```

### 2. ugy2 Oldal Integráció

**Fájl:** `src/pages/ugy2/index.jsx`

**Változtatások:**
- `LevelGenerator.generateLevel(2, 5)` hívása az oldal betöltésekor
- Dinamikus feladatok generálása a `styleConfig` szerint
- `TaskRenderer` komponens használata a rendereléshez
- Statikus `TEMPLATE_TASKS` eltávolítva

**Működés:**
1. Az oldal betöltésekor `useEffect` generálja a 5 feladatot
2. Minden feladat `generate()` metódusa meghívódik a payload létrehozásához
3. A `TaskRenderer` komponens a feladat `type`-ja alapján választja ki a renderelési módot
4. Sikeres megoldás esetén a `handleTaskSuccess` hívódik
5. Az utolsó feladat teljesítésekor Firebase-be mentés történik

## Példa Generált Pálya

A `LevelGenerator.generateLevel(2, 5)` például ezt generálhatja:

1. **CAESAR** (easy) - "Yljbdcc, Crol ohkhw wlwnrvxjbqrn"
2. **LOG_ANALYSIS** (medium) - 12 log sor, 2 anomália
3. **PHISHING** (medium) - Email elemzés, 4 gyanús elem
4. **ICON_MEMORY** (easy) - 3 ikon párosítás
5. **SECURITY_DECISION** (hard) - Biztonsági döntési puzzle

## Következő Lépések

1. **Életrendszer integrálása** - Az `ugy1`-hez hasonlóan
2. **Többi Task implementáció frissítése** - A maradék 15 Task frissítése a styleConfig-tel
3. **További Task renderer komponensek** - Speciális renderelés a komplexebb feladattípusokhoz
4. **Tesztelés** - Különböző pályák generálásának tesztelése

## Hibakeresés

Ha a feladatok nem jelennek meg:
- Ellenőrizd a böngésző konzolt hibákért
- Ellenőrizd, hogy a `tasks` state nem üres
- Ellenőrizd, hogy a `currentTask` létezik
- Ellenőrizd, hogy a Task `generate()` metódusa meghívódott

## Jegyzetek

- A feladatok minden oldalbetöltéskor újragenerálódnak
- A jelenlegi implementáció nem menti a generált feladatokat (minden betöltéskor új)
- Később lehet implementálni seed-alapú generálást a konzisztencia érdekében

