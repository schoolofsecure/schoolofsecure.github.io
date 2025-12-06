# Ugy4-ugy12 pályák előkészítése

## Változtatások

### 1. ugyConfigs.jsx
- Hozzáadva ugy4-ugy12 konfigurációk
- Minden pálya dinamikus (`isDynamic: true`)
- Minden pálya `requiresPrevious: true` - előző pályák teljesítése szükséges
- Minden pálya ugyanazokat a `taskLabels` és `taskStories` használja, mint ugy2
- Képek: minden pálya ugyanazt a képet használja (4.jpg, 5.jpg, stb.)

### 2. App.jsx
- Hozzáadva route-ok: `/ugy4` ... `/ugy12`
- Minden route ugyanazt a `UgyView` komponenst használja

### 3. UgyView.jsx
- `checkPreviousCompleted` funkció általánosítva
- Most már minden pálya esetén ellenőrzi, hogy az összes előző pálya teljesítve van-e

## Pálya konfigurációk

Minden pálya (ugy4-ugy12) hasonló struktúrával:
- Dinamikus feladatgenerálás
- Előző pályák teljesítése szükséges
- 5 feladat
- Ugyanazok a task típusok, mint ugy2

## Megjegyzések

- Az Aurora oldal automatikusan megjeleníti az összes pályát az `aurora.json`-ból
- A pályák zárolva vannak, amíg az előző pályák nincsenek teljesítve
- A képek jelenleg ugyanazok minden feladatnál (később lehet finomhangolni)

