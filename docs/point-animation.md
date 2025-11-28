# Pontanimáció Implementáció

## Áttekintés

Duolingo-stílusú animáció implementálva, ami a képernyő közepén jelenik meg, amikor egy feladatot helyesen teljesítenek.

## Komponensek

### PointAnimation (`src/components/Scoring/PointAnimation.jsx`)

- **Pozíció**: Fixed, képernyő közepén
- **Animáció**: 
  - Fade in + scale up
  - Felfelé repül (translateY)
  - 1.2 másodperc után eltűnik
- **Stílus**: 
  - Cyan gradient háttér
  - Nagy, félkövér szöveg
  - Árnyékok és glow effekt

### ScoringContext módosítások

- Hozzáadva `showPointAnimation` state
- A `scoreTask` függvény triggereli az animációt helyes válasz esetén
- Az animáció pontszáma a `result.points` értéke

### App.jsx integráció

- `AppContent` komponens hozzáadva a `useScoring` hook használatához
- `PointAnimation` komponens renderelése, amikor `showPointAnimation` nem null

## Használat

Az animáció automatikusan megjelenik, amikor:
- Egy feladatot helyesen teljesítenek
- A `scoreTask` függvény `isCorrect: true` paraméterrel hívódik meg

## Működés

1. Feladat helyes megoldása → `handleTaskSuccess` hívódik
2. `scoreTask` hívódik `isCorrect: true`-val
3. `ScoringContext` beállítja a `showPointAnimation` state-et
4. `PointAnimation` komponens megjelenik az App.jsx-ben
5. Animáció lejátszódik (1.2 másodperc)
6. Komponens eltávolítása

