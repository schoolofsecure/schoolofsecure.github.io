## Landing oldal bejelentkezett felhasználó átirányítása

- **Változtatott fájl**: `src/pages/Landing.jsx`
- **Változás**: Ha be van jelentkezve a felhasználó (és megerősítette az e-mail címét), akkor automatikusan átirányít az `/aurora` oldalra
- **Megoldás**:
  - `loading` hozzáadása a `useAuth` hook-ból
  - `useEffect` hozzáadása, ami ellenőrzi a bejelentkezési állapotot
  - Ha `!loading && user && user.emailVerified`, akkor `navigate('/aurora', { replace: true })`

