# Aurora Firebase Login Debug

## Probléma
A localhost:3000/aurora oldalon nem látszanak a Firebase login módosítások.

## Lehetséges okok és megoldások

### 1. Böngésző cache
**Megoldás**: Hard refresh
- **Windows/Linux**: `Ctrl + Shift + R` vagy `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 2. SessionStorage/LocalStorage
Az `unlocked` állapot `true` lehet a sessionStorage miatt, ezért nem látszik a Gate form.

**Megoldás**: Töröld a böngésző konzolban:
```javascript
sessionStorage.removeItem('cm_lvl1_unlocked')
sessionStorage.removeItem('cm_lvl1_entry_ok')
localStorage.removeItem('ugy1_completed')
```

Vagy nyisd meg az oldalt inkognitó módban.

### 3. Dev szerver újraindítása
**Megoldás**: 
```bash
# Állítsd le a jelenlegi dev szervert (Ctrl+C)
# Majd indítsd újra:
npm run dev
```

### 4. Ellenőrzés
A Gate formnak két mezőt kell tartalmaznia:
- Email input mező (`type="email"`)
- Password input mező (`type="password"`)
- Bejelentkezés gomb
- Regisztráció gomb

Ha még mindig nem látszik, ellenőrizd a böngésző konzolt (F12) hibákért.

