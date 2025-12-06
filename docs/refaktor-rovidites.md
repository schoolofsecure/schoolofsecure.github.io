# Refaktorálás és rövidítés

## Változtatások

### 1. Törölt fájlok
- `src/pages/ugy4/index.jsx` - nem használt
- `src/pages/ugy5/index.jsx` - nem használt
- `src/pages/ugy6/index.jsx` - nem használt
- `src/pages/ugy7/index.jsx` - nem használt
- `src/pages/ugy8/index.jsx` - nem használt
- `src/pages/ugy9/index.jsx` - nem használt
- `src/pages/ugy10/index.jsx` - nem használt
- `src/pages/ugy11/index.jsx` - nem használt
- `src/pages/ugy12/index.jsx` - nem használt

**Indoklás**: Ezek a fájlok már nem használatosak, mert minden pálya a közös `UgyView` komponenst használja.

### 2. ugyConfigs.jsx rövidítése
- **Előtte**: ~640 sor (ugy4-12 konfigurációk ismétlődve)
- **Utána**: ~450 sor (sablon függvénnyel)

**Változtatás**: `createDynamicUgyConfig` sablon függvény létrehozva, ami generálja az ugy4-12 konfigurációkat.

### 3. TaskRenderer.jsx rövidítése
- **Előtte**: 1614 sor
- **Utána**: ~1500 sor

**Változtatások**:
- `TaskLeftSide` wrapper komponens a bal oldali részhez (taskLabel, taskStory, payload renderelés)
- `TaskRightSide` wrapper komponens a jobb oldali részhez (title, imageSrc, hint, devSkip)
- `DevSkipButton` egyszerűsítve (arrow function)
- Caesar és Vigenere rendererek rövidítve a wrapper komponensek használatával

### 4. UgyView.jsx rövidítése
- `markDone` függvény egyszerűsítve: `d.slice()` helyett `[...d]` spread operátor

### 5. Aurora.jsx rövidítése
- December 6 és December 13 notice-ok összevonva egy komponensbe
- Ismétlődő style objektumok eltávolítva

## Eredmény

- **Törölt fájlok**: 9 fájl (~3600 sor)
- **Rövidített kód**: ~300 sor megtakarítás
- **Tisztább struktúra**: Wrapper komponensek, sablon függvények
- **Könnyebb karbantartás**: Kevesebb ismétlődés

