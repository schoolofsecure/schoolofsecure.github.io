# Ügy 4 feloldása - időzített feloldás

## Változtatás
Az ügy 4-et időzített feloldással rendeztük be, hasonlóan az ügy 3-hoz. Az ügy 4 december 13-án este 7-kor lesz elérhető.

## Módosítások

### 1. Ügy 4 konfiguráció (`src/pages/ugyConfigs.jsx`)
- Hozzáadva: `unlockDate: '2025-12-13T19:00:00+01:00'`

### 2. UgyView.jsx időzített feloldás kezelése
- Hozzáadva: `isLevel4Unlocked` state az ügy 4 feloldásának követésére
- Módosítva: unlock dátum ellenőrzés, hogy kezelje az ügy 4-et is
- Módosítva: inaktív pálya ellenőrzés, hogy az ügy 4 csak az unlockDate után legyen elérhető

## Hatás
- Az ügy 4 december 13-án este 7-kor (19:00) lesz automatikusan elérhető
- Az ügy 4 előtt zárolt marad, és "Inaktív pálya" üzenetet jelenít meg
- Az ügy 5-től felfelé továbbra is inaktív marad

## Dátum
2025-01-27

