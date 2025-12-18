# Pontszámok újratöltése és szinkronizálása

## Probléma
A pontszámok eltűntek, nulláról indultak, és az új ügyeknél nem töltődtek be a korábbi pontok. A 4. pályánál nulláról kezdett és 210 pont lett, de a korábbi pályák pontjai nem jelentek meg.

## Megoldás
A `scoreLevel` függvényben most mindig újratöltjük az adatokat, ha a `totalPoints` 0 vagy kisebb, mint a `levelStats`-ból számított összeg. Emellett a szinkronizáció is javítva lett, hogy mindig a nagyobb értéket használja.

## Módosított fájlok
- `src/contexts/ScoringContext.jsx`
- `src/pages/UgyView.jsx`

## Változtatások részletei

### ScoringContext.jsx - scoreLevel függvény
- A függvény most `async` lett
- Újratöltjük az adatokat, ha a `totalPoints` 0 vagy kisebb, mint a `levelStats`-ból számított összeg
- A szinkronizáció most mindig ellenőrzi, hogy a `levelStats`-ból számított összeg nagyobb-e, mint a jelenlegi `totalPoints`
- Ha igen, akkor a számított összeget használjuk

### UgyView.jsx - handleCompletion függvény
- A `scoreLevel` hívásnál most `await`-et használunk, mert a függvény `async` lett

## Hatás
- A pontszámok most mindig betöltődnek, amikor egy új ügyre navigálsz
- A korábbi pályák pontjai megjelennek az új ügyeknél is
- A pontszámok szinkronban maradnak a `levelStats` adatokkal
- Nem veszítesz el pontokat, ha valami miatt a `totalPoints` nem töltődik be megfelelően

