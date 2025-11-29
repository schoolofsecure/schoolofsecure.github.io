## Belépés utáni Aurora átirányítás

- **Változtatott fájl**: `src/pages/Landing.jsx`
- **Változás**: sikeres belépés után a felhasználó automatikusan az `/aurora` oldalra kerül átirányításra.
- **Megoldás**:
  - `useNavigate` importálása a `react-router-dom`‑ból.
  - `const navigate = useNavigate()` a `Landing` komponensben.
  - A `handleLogin` függvényben, sikeres bejelentkezés (`result.success`) esetén: panel bezárása után `navigate('/aurora')`.


