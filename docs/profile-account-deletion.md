# Profil oldal és account törlés implementálása

## Változtatások

### 1. AuthContext.jsx
- Hozzáadva `deleteUser` import a Firebase Auth-ból
- Hozzáadva `deleteDoc`, `collection`, `getDocs` import a Firestore-ból
- Új `deleteAccount` funkció:
  - Törli a Firestore adatokat (completions, scoring, preferences)
  - Törli a Firebase Auth felhasználót
  - Hibakezelés: `auth/requires-recent-login` esetén értesítés

### 2. Profile.jsx (új fájl)
- Profil oldal létrehozva:
  - E-mail cím megjelenítése
  - E-mail megerősítés státusza
  - Statisztikák (pontszám, rang, teljesített pályák, hibátlan sorozat)
  - Teljesített ügyek listája
  - Kijelentkezés gomb
  - Fiók törlés funkció:
    - Kétlépcsős megerősítés
    - Végleges törlés figyelmeztetés
    - Hibakezelés

### 3. App.jsx
- Új route: `/profile` → `Profile` komponens

### 4. Landing.jsx
- "Profil" gomb módosítva: `Link` komponens használata `/profile`-ra

### 5. Aurora.jsx
- "Kijelentkezés" gomb lecserélve "Profil" linkre

### 6. UgyView.jsx
- "Kijelentkezés" gomb lecserélve "Profil" linkre

## Funkciók

- Profil oldal elérése minden oldalról
- Statisztikák megjelenítése
- Fiók törlés biztonságos megerősítéssel
- Firestore adatok teljes törlése

