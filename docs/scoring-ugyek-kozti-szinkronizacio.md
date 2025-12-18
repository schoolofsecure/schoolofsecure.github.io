# Pontozás szinkronizálása az ügyek között

## Probléma
A korábbi pontszámok nem jelentek meg a 4. ügynél, hanem előről kezdődtek. Ez azért történt, mert a ScoringContext csak a bejelentkezéskor töltötte be a pontszámokat, az ügyek közötti navigáláskor nem frissült az adat.

## Megoldás
A `scoreLevel` függvényben ellenőrizzük és szinkronizáljuk a `totalPoints`-ot a `levelStats` alapján, ha szükséges. Ez biztosítja, hogy az előző ügyek pontszámai is benne legyenek a számításban.

## Módosított fájlok
- `src/contexts/ScoringContext.jsx`

## Változtatások részletei

### scoreLevel függvény
- A függvény elején ellenőrizzük, hogy a `totalPoints` 0-e, de van-e már `levelStats` adat
- Ha igen, újraszámoljuk a `totalPoints`-ot a `levelStats`-ból
- A számítás során ezt a szinkronizált értéket használjuk
- Ugyanez az ellenőrzés történik akkor is, amikor egy pálya már teljesítve van (újrajátszás esetén)

## Hatás
- Az előző ügyek pontszámai mostantól megjelennek az új ügyeknél is
- A pontszámok szinkronban maradnak a `levelStats` adatokkal
- A felhasználók láthatják a korábbi pontjaikat minden ügynél

