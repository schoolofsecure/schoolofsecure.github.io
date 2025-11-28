# Scoring Firebase Migráció

## Áttekintés

A scoring adatok mostantól Firebase-ben vannak tárolva localStorage helyett, és bejelentkezés nélkül nem működik a scoring funkció.

## Változtatások

### 1. AuthContext.jsx - Scoring mentés/betöltés függvények

**Fájl:** `src/contexts/AuthContext.jsx`

Hozzáadott függvények:
- `saveScoringData(scoringData)` - Firebase-be menti a scoring adatokat `users/{uid}/scoring/data` dokumentumba
- `loadScoringData()` - Firebase-ből betölti a scoring adatokat

Firestore struktúra: `users/{uid}/scoring/data` dokumentum:
```javascript
{
  totalPoints: number,
  achievements: array,
  levelStats: object,
  perfectStreak: number,
  highestLevel: number,
  updatedAt: timestamp
}
```

### 2. ScoringContext.jsx - Firebase integráció

**Fájl:** `src/contexts/ScoringContext.jsx`

Módosítások:
- **loadScoringData()**: Firebase-ből tölti be az adatokat `useAuth().loadScoringData()` hívással
- **saveScoringData()**: Firebase-be menti `useAuth().saveScoringData()` hívással
- **useEffect inicializálás**: Csak bejelentkezés után tölti be az adatokat, bejelentkezés nélkül ne inicializál scoring-ot
- **scoreTask() és scoreLevel()**: Csak bejelentkezés után működnek, ellenőrzés az elején
- **Alapértelmezett értékek**: Ha nincs bejelentkezve, ne állítson be scoring adatokat

### 3. ScoreDisplay.jsx - Bejelentkezési ellenőrzés

**Fájl:** `src/components/Scoring/ScoreDisplay.jsx`

Módosítás:
- `useAuth()` hook hozzáadva
- Ha nincs bejelentkezve (`!isAuthenticated`), a komponens nem jelenik meg (return null)

### 4. App.jsx - Scoring animációk bejelentkezési ellenőrzéssel

**Fájl:** `src/App.jsx`

Módosítás:
- `useAuth()` hook hozzáadva az AppContent komponensben
- Scoring animációk csak bejelentkezés után jelennek meg (`isAuthenticated && ...`)

### 5. ugy1 és ugy2 oldalak - Scoring hívások ellenőrzése

**Fájlok:** `src/pages/ugy1/index.jsx`, `src/pages/ugy2/index.jsx`

Módosítás:
- `handleCompletion()`, `handleTaskSuccess()`, `handleTaskFailure()` függvényekben ellenőrzés, hogy be van-e jelentkezve
- Ha nincs bejelentkezve, ne hívja meg a scoring függvényeket

## Technikai részletek

- Firebase Firestore használata: `users/{uid}/scoring/data` dokumentum
- localStorage eltávolítva a scoring kontextusból
- Bejelentkezés nélkül a scoring state alapértelmezett értékekkel marad (50 pont, null rank)
- ScoreDisplay és animációk csak bejelentkezés után láthatók
- Scoring funkciók (scoreTask, scoreLevel) csak bejelentkezés után működnek

