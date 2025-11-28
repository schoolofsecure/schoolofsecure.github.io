# Pontanimáció Implementáció

## Áttekintés

Duolingo-stílusú animáció implementálva, ami a képernyő közepén jelenik meg, amikor egy feladatot helyesen vagy helytelenül teljesítenek.

## Komponensek

### PointAnimation (`src/components/Scoring/PointAnimation.jsx`)

- **Pozíció**: Fixed, képernyő közepén
- **Animáció**: 
  - Fade in + scale up
  - Felfelé repül (translateY)
  - 1.2 másodperc után eltűnik
- **Stílus**: 
  - **Helyes válasz**: Cyan gradient háttér (+10, +15, +20 pont)
  - **Helytelen válasz**: Piros gradient háttér (-5 pont)
  - Nagy, félkövér szöveg
  - Árnyékok és glow effekt

### ScoringContext módosítások

- Hozzáadva `showPointAnimation` state
- A `scoreTask` függvény triggereli az animációt helyes és helytelen válasz esetén is
- Az animáció pontszáma a `result.points` értéke (pozitív vagy negatív)

### App.jsx integráció

- `AppContent` komponens hozzáadva a `useScoring` hook használatához
- `PointAnimation` komponens renderelése, amikor `showPointAnimation` nem null

## Használat

Az animáció automatikusan megjelenik, amikor:
- Egy feladatot helyesen teljesítenek → **Cyan szín, +X pont**
- Egy feladatot helytelenül teljesítenek → **Piros szín, -5 pont**
- A `scoreTask` függvény hívódik meg (akár `isCorrect: true`, akár `false`)

## Működés

1. Feladat megoldása → `handleTaskSuccess` vagy `handleTaskFailure` hívódik
2. `scoreTask` hívódik (`isCorrect: true` vagy `false`)
3. `ScoringContext` beállítja a `showPointAnimation` state-et (pozitív vagy negatív pontszámmal)
4. `PointAnimation` komponens megjelenik az App.jsx-ben
5. Animáció lejátszódik (1.2 másodperc)
6. Komponens eltávolítása

