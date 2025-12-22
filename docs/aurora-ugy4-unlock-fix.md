# Aurora oldal - Ügy 4 feloldás javítása

## Probléma
Az Aurora oldalon az ügy 4 nem volt feloldva, még akkor sem, amikor az ügy 3 teljesítve volt és elérkezett a december 18-i dátum.

## Ok
1. Az Aurora.jsx-ben a 528-530. sorokban minden 4. ügytől felfelé automatikusan zárolt maradt (`isUnlocked = false`)
2. Az ugy4Config-ban hiányzott az `unlockDate` beállítás
3. Az Aurora.jsx-ben nem volt dátum-alapú ellenőrzés az ügy 4-re (csak az ügy 3-ra volt)

## Módosítások

### 1. ugyConfigs.jsx - Ügy 4 unlock dátum hozzáadása
**Fájl:** `src/pages/ugyConfigs.jsx`

Hozzáadva az `unlockDate: '2025-12-18T19:00:00+01:00'` az ugy4Config-hoz.

### 2. Aurora.jsx - Ügy 4 unlock logika implementálása
**Fájl:** `src/pages/Aurora.jsx`

- Hozzáadva `isLevel4Unlocked` state változó
- Hozzáadva useEffect az ügy 4 unlock dátum ellenőrzésére (hasonlóan az ügy 3-hoz)
- Módosítva az unlock logika:
  - Az 5. ügytől felfelé marad inaktív (korábban 4-től)
  - Az ügy 4 most dátum-alapúan unlockolódik, ha az ügy 3 teljesítve van ÉS elérkezett a december 18-i dátum

## Hatás
- Az ügy 4 most már feloldódik december 18-án este 7-kor, ha az ügy 3 teljesítve van
- Az ügy 4 előtt zárolt marad, és "December 18-án, este 7 órakor nyílik" üzenetet jelenít meg
- Az ügy 5-től felfelé továbbra is inaktív marad

## További módosítás
- Eltávolítva az ügy 5 december 24-i megnyitási dátumának beállítása (showDecember24 változó és kapcsolódó UI elemek)

## Dátum
2025-01-27

