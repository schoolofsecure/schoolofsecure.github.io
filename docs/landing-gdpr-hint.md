# Landing oldal - GDPR hint megjelenítése alert helyett

## Áttekintés

A Landing oldalon a gombokra (heroBtn, signupBtn) kattintva, ha a felhasználó nem fogadta el a GDPR-t, mostantól nem alert jelenik meg, hanem a gdprHint üzenet jelenik meg és a felhasználó automatikusan a GDPR szekcióhoz görget.

## Változtatások

### Landing.jsx

**Fájl:** `src/pages/Landing.jsx`

1. **Új state hozzáadva:** `showGdprHint` - jelzi, hogy a GDPR hint-et meg kell jeleníteni
2. **handleSignup módosítva:** Az alert helyett a `showGdprHint` state-et állítja be `true`-ra, és automatikusan a GDPR szekcióhoz görget
3. **gdprHint feltételes megjelenítés:** A hint mostantól piros színnel és félkövér betűtípussal jelenik meg, ha a felhasználó a gombra kattintott GDPR elfogadás nélkül
4. **Checkbox onChange:** Amikor a felhasználó elfogadja a GDPR-t, a `showGdprHint` automatikusan `false`-ra áll

## Működés

1. **Gombra kattintás GDPR nélkül:**
   - A `handleSignup` függvény meghívódik
   - Ha `!gdprAgreed`, akkor:
     - Megakadályozza a link követését (`e.preventDefault()`)
     - Beállítja a `showGdprHint` state-et `true`-ra
     - Automatikusan a GDPR szekcióhoz görget (`scrollIntoView`)
   - Ha `gdprAgreed`, akkor a `showGdprHint` `false`-ra áll

2. **gdprHint megjelenítés:**
   - Ha `showGdprHint === true`: piros szín (`var(--danger)`) és félkövér betűtípus
   - Ha `showGdprHint === false` de `!gdprAgreed`: normál szürke szín (`var(--muted)`)
   - Ha `gdprAgreed === true`: a hint eltűnik

3. **Checkbox változás:**
   - Amikor a felhasználó bejelöli a checkbox-ot, a `showGdprHint` automatikusan `false`-ra áll

## Előnyök

- **Jobb UX:** Nincs zavaró alert ablak
- **Vizuális visszajelzés:** A piros színű hint egyértelműen jelzi a problémát
- **Automatikus navigáció:** A felhasználó automatikusan a GDPR szekcióhoz görget
- **Smooth scroll:** A görgetés animált, nem ugrik

