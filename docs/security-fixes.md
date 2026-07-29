# Biztonsági javítások

## Mit változtattunk

1. **Dev Skip gomb** — csak `import.meta.env.DEV` módban látszik (élesben nem). Érintett: `UgyView.jsx`.
2. **Email-enumeráció** — jelszó-visszaállításnál egységes üzenet: „If that email is registered, we sent a reset link." Nem árulja el, hogy létezik-e a fiók. Érintett: `AuthContext.jsx`.
3. **FormSubmit CAPTCHA** — `_captcha: 'false'` eltávolítva → FormSubmit alapértelmezett CAPTCHA-ja aktív, ami csökkenti a spam kockázatot. Érintett: `formSubmit.js`.

## Fájlok

- `src/pages/UgyView.jsx`
- `src/contexts/AuthContext.jsx`
- `src/utils/formSubmit.js`
