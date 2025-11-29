# Aurora React komponens szöveg frissítése

## Dátum
2025-01-27

## Cél
Az Aurora React komponensben lévő szövegek megegyezzenek az eredeti HTML verzióval (`aurora.html.backup`).

## Változtatások

### 1. Mission panel hintText frissítése

**Fájl:** `data/aurora.json` és `public/data/aurora.json`

**Régi szöveg:**
```json
"hintText": "Egy extra „C" betű csúszott be a „ACCESS" szóba. Tipp: csak a javasolt karaktereket használd."
```

**Új szöveg:**
```json
"hintText": "Figyeld meg: az egyik betűből túl sok van, és nem minden karakter megengedett. Használj csak betűket, számokat és kötőjelet."
```

Ez a szöveg most megegyezik az eredeti HTML-ben lévő szöveggel (sor 352-353).

### 2. Beküldés gomb szövegének frissítése

**Fájl:** `src/pages/Aurora.jsx`

**Régi szöveg:**
```jsx
<button id="entryBtn" className="btn" onClick={handleEntrySubmit}>Küldés</button>
```

**Új szöveg:**
```jsx
<button id="entryBtn" className="btn" onClick={handleEntrySubmit}>Beküldés</button>
```

Ez a szöveg most megegyezik az eredeti HTML-ben lévő szöveggel (sor 347).

## Ellenőrzés

Minden szöveg az Aurora React komponensben most megegyezik az eredeti HTML verzióban lévő szövegekkel:
- ✅ Gate panel szövegek
- ✅ Mission panel szövegek (badge, title, narr1, narr2, leftTitle, rightTitle, hintTitle, hintText)
- ✅ Button szövegek
- ✅ Levels panel szövegek

## Megjegyzések

A React komponens jelenleg nem tartalmazza az intro hero panelt, amely az eredeti HTML-ben szerepel. Ez a panel a kérdéssor bevezetőjét tartalmazza, de mivel a React verzióban nincs kérdéssor implementálva, ez a rész nem lett hozzáadva.

