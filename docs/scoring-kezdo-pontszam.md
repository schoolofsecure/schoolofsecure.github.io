# Pontozási rendszer kezdőpontszám módosítása

## Változtatás
A játék kezdőpontszáma 50-ről 0-ra változott.

## Módosított fájlok
- `src/contexts/ScoringContext.jsx`

## Változtatások részletei

### Kezdőpontszám inicializálás
- `useState(50)` → `useState(0)` (17. sor)
- Bejelentkezés nélküli inicializálás: `setTotalPoints(50)` → `setTotalPoints(0)` (32. sor)

### Adatbetöltés
- Alapértelmezett érték: `50` → `0` (72. sor)
- LevelStats számítás: `reduce(..., 50)` → `reduce(..., 0)` (82. sor)
- Nincs mentett adat esetén: `setTotalPoints(50)` → `setTotalPoints(0)` (92. sor)
- Hiba esetén: `setTotalPoints(50)` → `setTotalPoints(0)` (98. sor)

## Hatás
- Új játékosok 0 ponttal kezdenek
- Mentett adatok betöltésekor a pontszám a pályák pontszámaiból számolódik (0-ról indulva)
- A rangrendszer továbbra is a pálya alapján működik

