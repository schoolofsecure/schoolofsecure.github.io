# Retro Prompt Firebase Migráció

## Áttekintés

A `retro_prompt_seen` localStorage helyett Firebase-ben van tárolva, így minden eszközön működik.

## Változtatások

### 1. AuthContext.jsx - Retro prompt függvények hozzáadása

**Fájl:** `src/contexts/AuthContext.jsx`

Hozzáadott függvények:
- `getRetroPromptSeen()` - Firebase-ből ellenőrzi, hogy látta-e már a promptot
- `setRetroPromptSeen()` - Firebase-be menti, hogy látta a promptot

Firestore struktúra: `users/{uid}/preferences/data` dokumentum:
```javascript
{
  retroPromptSeen: boolean,
  updatedAt: timestamp
}
```

### 2. Aurora.jsx - localStorage helyett Firebase használata

**Fájl:** `src/pages/Aurora.jsx`

Módosítások:
- **useEffect (61. sor)**: `localStorage.getItem()` helyett `getRetroPromptSeen()` hívás
- **handleRetroCompletionClaim (156. sor)**: `localStorage.setItem()` helyett `setRetroPromptSeen()` hívás
- **handleRetroDismiss (174. sor)**: `localStorage.setItem()` helyett `setRetroPromptSeen()` hívás
- **useAuth hook**: Hozzáadva `getRetroPromptSeen` és `setRetroPromptSeen` függvények

## Technikai részletek

- Firebase Firestore használata: `users/{uid}/preferences/data` dokumentum
- localStorage eltávolítva a retro prompt kezelésből
- Minden eszközön működik, mert Firebase-ben van tárolva
- A prompt csak egyszer jelenik meg felhasználónként, függetlenül az eszköztől

