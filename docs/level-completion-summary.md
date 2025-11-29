# Pálya Befejezési Összegző Animáció

## Áttekintés

Animált összegző megjelenítése, amikor egy játékos befejez egy pályát. Az összegzés tartalmazza a pálya nevét, a játékos rangját, az összpontszámot és egy motiváló üzenetet.

## Komponensek

### LevelCompletionSummary (`src/components/Scoring/LevelCompletionSummary.jsx`)

- **Pozíció**: Fixed, képernyő közepén
- **Animáció**: 
  - Fade-in + scale up (0.5s)
  - 4 másodperc után fade-out kezdődik (1s)
  - 5 másodperc után teljesen eltűnik
- **Tartalom**:
  - Pálya neve (címsor)
  - Rang (név)
  - Összpontszám
  - Motiváló üzenet (véletlenszerűen választott)
- **Stílus**: 
  - Sötét háttér gradient
  - Cyan border és glow effekt
  - Modern, letisztult design

### ScoringContext módosítások

- Hozzáadva `showLevelCompletion` state
- A `scoreLevel` függvény triggereli az animációt pálya befejezésekor
- Pálya nevek meghatározása (1-12 pálya)

### App.jsx integráció

- `LevelCompletionSummary` komponens renderelése, amikor `showLevelCompletion` nem null

## Használat

Az animáció automatikusan megjelenik, amikor:
- Egy pálya befejeződik
- A `scoreLevel` függvény hívódik meg
- A rendszer automatikusan meghatározza a pálya nevét, rangot és pontszámot

## Működés

1. Pálya befejezése → `handleCompletion` hívódik
2. `scoreLevel` hívódik a pálya adataival
3. `ScoringContext` beállítja a `showLevelCompletion` state-et
4. `LevelCompletionSummary` komponens megjelenik az App.jsx-ben
5. Animáció lejátszódik (5 másodperc)
6. Komponens eltávolítása

## Pálya nevek

1. A Titkosított Adatcsomag
2. A Hamisított Archívum
3. A Kézbesítetlen Üzenet
4. A Hiányzó Idővonal
5. A Rejtett Metaadat
6. A Szivárgó Port
7. A Kettős Identitás
8. A Törött Kulcs
9. A Megszakított Átvitel
10. A Phantom‑Profil
11. A Lopott Árnyékfiók
12. A Főkolompos

## Motiváló üzenetek

Véletlenszerűen választott üzenetek:
- "Kiváló munkát végeztél!"
- "Tovább haladsz a nyomokon!"
- "Közelebb vagy a megoldáshoz!"
- "Remek teljesítmény!"
- "Folytasd így tovább!"

