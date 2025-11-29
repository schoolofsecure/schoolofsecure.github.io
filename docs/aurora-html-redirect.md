## Aurora.html átirányítás

- **Változtatott fájlok**: 
  - `src/App.jsx` - Route hozzáadva az `/aurora.html` útvonalhoz
  - `src/pages/ugy7/index.jsx` - Linkek frissítve
  - `src/pages/ugy8/index.jsx` - Linkek frissítve
  - `src/pages/ugy9/index.jsx` - Linkek frissítve
  - `src/pages/ugy10/index.jsx` - Linkek frissítve
  - `src/pages/ugy11/index.jsx` - Linkek frissítve
  - `src/pages/ugy12/index.jsx` - Linkek frissítve

- **Változás**: 
  - Az `/aurora.html` útvonal automatikusan átirányít az `/aurora` oldalra
  - Minden `aurora.html` link átírva `/aurora`-ra

- **Megoldás**:
  - `Navigate` importálása a `react-router-dom`-ból
  - Route hozzáadva: `<Route path="/aurora.html" element={<Navigate to="/aurora" replace />} />`
  - Összes `href="/aurora.html"` link lecserélve `href="/aurora"`-ra

