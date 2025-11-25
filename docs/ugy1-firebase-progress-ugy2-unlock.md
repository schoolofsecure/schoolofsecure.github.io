# ugy1 Firebase Progress Mentés és ugy2 Automatikus Aktiválás

## Áttekintés

Az ugy1 oldal teljesítésekor a progress mostantól **csak Firebase-be** kerül mentésre, localStorage használat nélkül. Az Aurora oldalon a 2. szint automatikusan aktiválódik, ha az ugy1 teljesítve van.

## Változtatások

### 1. ugy1/index.jsx - localStorage eltávolítása

**Fájl:** `src/pages/ugy1/index.jsx`

A `handleCompletion` függvényből eltávolítottuk a `localStorage.setItem('ugy1_completed', 'true');` sort. Mostantól csak Firebase mentés történik.

**Előtte:**
```javascript
const handleCompletion = async () => {
  markDone(4);
  try {
    localStorage.setItem('ugy1_completed', 'true');  // ← ELTÁVOLÍTVA
    if (isAuthenticated) {
      await saveLevelCompletion('ugy1');
    }
  } catch(e) {
    console.warn('Nem sikerült menteni a teljesítést:', e);
  }
};
```

**Utána:**
```javascript
const handleCompletion = async () => {
  markDone(4);
  try {
    if (isAuthenticated) {
      await saveLevelCompletion('ugy1');
    }
  } catch(e) {
    console.warn('Nem sikerült menteni a teljesítést:', e);
  }
};
```

### 2. Aurora.jsx - Szint aktiválási logika módosítása

**Fájl:** `src/pages/Aurora.jsx`

Módosítottuk a szint unlock logikát, hogy ha van legalább 1 teljesített ügy (`highestCompleted >= 1`), akkor a következő ügy (2. szint) is automatikusan feloldódjon.

**Előtte:**
```javascript
const isUnlocked = card.n <= highestCompleted || (card.n === 1 && !card.locked)
```

**Utána:**
```javascript
const isUnlocked = card.n <= highestCompleted + 1 || (card.n === 1 && !card.locked)
```

Ez azt jelenti, hogy:
- Ha `highestCompleted = 0` (nincs teljesített ügy), akkor csak az 1. ügy unlocked
- Ha `highestCompleted = 1` (ugy1 teljesítve), akkor az 1. és 2. ügy is unlocked
- Ha `highestCompleted = 2` (ugy1 és ugy2 teljesítve), akkor az 1., 2. és 3. ügy is unlocked
- És így tovább...

## Működés

1. **Progress mentés:** Amikor a felhasználó befejezi az ugy1 oldal 5. feladatát, a `handleCompletion` függvény meghívódik
2. **Firebase mentés:** Ha a felhasználó be van jelentkezve (`isAuthenticated === true`), akkor a `saveLevelCompletion('ugy1')` függvény Firebase-be menti a teljesítést
3. **Szint aktiválás:** Az Aurora oldalon a `getHighestCompletedLevel()` függvény lekéri a legmagasabb teljesített szintet Firebase-ből
4. **Automatikus unlock:** Ha `highestCompleted >= 1`, akkor a következő szint (2. ügy) is automatikusan feloldódik

## Megjegyzések

- **Fontos:** Az ugy1 oldalról minden localStorage használat eltávolítva
- Ez a minta később más ügyeknél is követendő (ugy2 → ugy3, ugy3 → ugy4, stb.)
- A Firebase mentés csak akkor történik, ha a felhasználó be van jelentkezve és az e-mail címe megerősítve van

## Tesztelés

1. Bejelentkezés után teljesítsd az ugy1 oldalt
2. Ellenőrizd, hogy az Aurora oldalon a 2. ügy feloldódott-e
3. Ellenőrizd a Firebase konzolban, hogy a `users/{uid}/completions/ugy1` dokumentum létrejött-e

