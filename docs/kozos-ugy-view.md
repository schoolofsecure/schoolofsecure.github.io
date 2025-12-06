# Közös ügy view komponens

## Áttekintés

Az ugy1, ugy2, ugy3 oldalak korábban külön fájlokban voltak, de hasonló struktúrát követtek. Létrehoztunk egy közös `UgyView` komponenst, ami az ugy1 struktúráját követi (etalon), és a route alapján betölti a megfelelő tartalmat.

## Fő változtatások

### Új fájlok

1. **`src/pages/UgyView.jsx`** - Közös view komponens
   - Az ugy1 struktúráját követi (header, ScoreDisplay, NarrativeBlock, progress, TaskCard)
   - A route alapján (location.pathname) kiolvassa az ügy számát
   - Konfiguráció alapján működik

2. **`src/pages/ugyConfigs.jsx`** - Konfiguráció fájl
   - Minden ügy konfigurációja (ugy1, ugy2, ugy3)
   - Címek, badge-ek, képek, navigáció
   - Statikus feladatok definíciói (ugy1, ugy3)
   - Dinamikus feladat beállítások (ugy2)

3. **`src/components/Ugy1/SpecialComponents.jsx`** - Speciális komponensek
   - WordSearchMount komponens
   - MatchTable komponens
   - ArchiveModal komponens
   - Az ugy1-ből kivont speciális logikák

### Módosított fájlok

- **`src/App.jsx`** - Route-ok módosítva, hogy a közös UgyView komponenst használják

### Törölt fájlok

- `src/pages/ugy1/index.jsx` - törölve (helyette UgyView)
- `src/pages/ugy2/index.jsx` - törölve (helyette UgyView)
- `src/pages/ugy3/index.jsx` - törölve (helyette UgyView)

## Konfiguráció struktúra

Minden ügyhez egy konfiguráció objektum:

```javascript
{
  level: 1,
  title: "A múzeum éjszakája",
  badge: "Múzeum – éjszakai műszak",
  headerTitle: "A múzeum éjszakája – Ügy #1",
  narrativeTitle: "A múzeum éjszakája – Ügy #1",
  narrativeText: "...",
  isDynamic: false, // ugy2 esetén true
  totalTasks: 5,
  images: [...],
  nextLevelRoute: "/ugy2",
  nextLevelText: "Tovább az Éjféli kézfogásra",
  specialComponents: { wordSearch: true, matchTable: true, archive: true },
  tasks: [...] // statikus feladatok vagy null (ha dinamikus)
}
```

## Implementációs részletek

### UgyView komponens

- Route paraméter: location.pathname-ből olvassa ki az ügy számát (`/ugy1` -> 1, `/ugy2` -> 2, stb.)
- Konfiguráció betöltése a szám alapján
- Dinamikus/statikus feladatkezelés a konfig alapján
- Speciális komponensek feltételes renderelése
- Az ugy1 logikája (step, done, handleTaskSuccess, stb.) általánosítva

### Konfigurációk

- **ugy1Config**: statikus feladatok, WordSearchMount, MatchTable, ArchiveModal
- **ugy2Config**: dinamikus feladatok (LevelGenerator), TaskRenderer
- **ugy3Config**: statikus feladatok (jelenleg üres, de struktúra kész), zárolás logika

## Előnyök

- Egyetlen fájl karbantartása a három ügyhöz
- Könnyű új ügyek hozzáadása (csak konfiguráció)
- Konzisztens struktúra és UX
- Kódduplikáció megszüntetése

