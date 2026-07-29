# Honeypot és maxLength védelem az űrlapokon

## Mit változtattunk

1. **Honeypot** — rejtett `_honey` mező minden űrlapon. Ha bot kitölti, a beküldés csendben sikerül (de nem megy el az email).
2. **maxLength** — minden szöveges mező korlátozott:
   - Név: 120
   - Email: 254
   - Ország: 100
   - Szituáció (egyéb): 200
   - Background: 2000
   - Forrás (egyéb): 200
   - Why now: 3000
   - Üzenet (contact/teams): 3000
   - Cég: 200

## Érintett fájlok

- `src/utils/formSubmit.js`
- `src/pages/AcademyApply.jsx`
- `src/pages/Contact.jsx`
- `src/pages/ForTeams.jsx`
- `src/pages/Landing.jsx`
