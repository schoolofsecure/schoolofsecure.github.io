## Landing oldal – felső navigációs belépés/regisztráció panel

### Cél
- A belépés / regisztráció lehetőség elegáns megjelenítése a nyitóoldal jobb felső sarkában
- Állapotjelzés biztosítása anélkül, hogy az e-mail cím megjelenne

### Változtatások

1. **Fejléc bővítése**
   - A brand logó mellé egy jobb oldali „auth widget” került
   - Az állapotpillantó kizárólag bejelentkezéskor jelenik meg (`Bejelentkezve` / `Megerősítés szükséges`), e-mail cím továbbra sincs feltüntetve

2. **Két, egységes stílusú CTA gomb**
   - A `Belépés` és `Regisztráció` gomb kapszulaformát kapott azonos mérettel; a regisztrációs CTA kapott élénk (cián) gradienst, míg a belépés halványabb, üveg-szerű variáns
   - Mindkettő a lenyíló panelt nyitja a megfelelő móddal (`login` vagy `register`)

3. **Lenyíló panel és CTA integráció**
   - Kompakt űrlap, amely címkével jelzi az aktuális módot
   - A CTA gomb módosítható (`Belépés` vagy `Regisztráció`), alatta egy váltó link engedi a mód cseréjét
   - Bejelentkezett felhasználóknak egy visszafogott állapot-szöveg és kijelentkezés gomb jelenik meg, e-mail cím nélkül
   - A „Kezdd el a nyomozást” és „Kérem az első nyomot” gombok mostantól közvetlenül a regisztrációs panelt nyitják, ha a GDPR checkbox be van jelölve; egyébként a gdprHinthez görgetnek
   - A GDPR figyelmeztetés overlayként jelenik meg közvetlenül a CTA-n, amikor az egér fölé kerül (vagy ha hibajelzés szükséges), így a környező tartalom nem mozdul el

4. **Jelentkezz kártya eltávolítása**
   - A hero utáni külön „Jelentkezz” kártya megszűnt; a „Kezdd el a nyomozást” CTA után közvetlenül a GDPR elfogadó blokk következik, majd indul a „Miért izgalmas?” rész

### Használat
- A gombok `aria-expanded` / `aria-controls` attribútumokkal jelzik a panel állapotát
- Sikeres bejelentkezés/regisztráció/kijelentkezés után a panel automatikusan bezárul
- A panel jobb felső sarkában ✕ gombbal is zárható

