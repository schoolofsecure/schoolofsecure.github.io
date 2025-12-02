# Kijelentkezés után főoldalra irányítás

## Változtatás

A pályákon (ugy1, ugy2, Aurora) történő kijelentkezés után a felhasználó automatikusan a főoldalra kerül.

## Módosított fájlok

- `src/pages/ugy1/index.jsx`
  - Hozzáadva: `useNavigate` import
  - Logout után: `navigate('/')` hívás sikeres kijelentkezés esetén

- `src/pages/ugy2/index.jsx`
  - Hozzáadva: `useNavigate` import
  - Logout után: `navigate('/')` hívás sikeres kijelentkezés esetén

- `src/pages/Aurora.jsx`
  - Logout után: `navigate('/')` hívás hozzáadva a meglévő state reset után

