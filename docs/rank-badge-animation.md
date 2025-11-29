# Rangjelvény Animáció Implementáció

## Áttekintés

Animált rangjelvény megjelenítése, amikor egy játékos új rangot ér el (pl. Junior nyomozóból Nyomozó lesz).

## Komponensek

### RankBadgeAnimation (`src/components/Scoring/RankBadgeAnimation.jsx`)

- **Pozíció**: Fixed, képernyő közepén
- **Animáció**: 
  - Scale up + rotate animáció
  - Glow effekt késleltetve
  - Rang név megjelenítése
  - 2.5 másodperc után eltűnik
- **Kép**: `/images/badge.png`
- **Hang**: `/sounds/rank-up.mp3` (opcionális, ha nincs, csendes működés)
- **Placeholder**: Ha nincs badge.png, 🏆 emoji jelenik meg

### ScoringContext módosítások

- Hozzáadva `showRankBadge` state
- Az `updateRank` függvény észleli, ha új rangot ért el
- `skipAnimation` paraméter a betöltéskor való animáció kihagyásához

### App.jsx integráció

- `RankBadgeAnimation` komponens renderelése, amikor `showRankBadge` nem null

## Használat

Az animáció automatikusan megjelenik, amikor:
- Egy játékos új rangot ér el (pl. Junior nyomozó → Nyomozó)
- A `updateRank` függvény észleli a rang változást
- Csak akkor triggerelődik, ha nem az első betöltés (skipAnimation: false)

## Működés

1. Pontszám változása → `scoreTask` vagy `scoreLevel` hívódik
2. `updateRank` hívódik az új pontszámmal
3. Ellenőrzi, hogy a jelenlegi rang ID különbözik-e az új rang ID-tól
4. Ha igen, `setShowRankBadge` beállítása
5. `RankBadgeAnimation` komponens megjelenik az App.jsx-ben
6. Animáció lejátszódik (2.5 másodperc)
7. Komponens eltávolítása

## Fájlok

- **Badge kép**: `/public/images/badge.png` (vagy `/images/badge.png`)
- **Hangfájl** (opcionális): `/public/sounds/rank-up.mp3`

## Megjegyzések

- Ha nincs badge.png, automatikusan 🏆 emoji placeholder jelenik meg
- A hang lejátszás opcionális, ha nincs hangfájl, csendes működés
- Az animáció csak akkor jelenik meg, ha valóban új rangot ért el (nem az első betöltéskor)

