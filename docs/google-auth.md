# Google Authentication

## Mit csináltunk

Firebase Google bejelentkezés hozzáadva az e-mail/jelszó mellé.

## Érintett fájlok

- `src/contexts/AuthContext.jsx` – `loginWithGoogle()` (`GoogleAuthProvider` + `signInWithPopup`)
- `src/components/SiteNav.jsx` – „Continue with Google” gomb a login panelben
- `src/pages/Aurora.jsx` – „Continue with Google” gomb a gate formon

## Firebase Console (egyszeri beállítás)

1. Authentication → Sign-in method → Google → Enable
2. Authentication → Settings → Authorized domains: `localhost` + éles domain

## Hatás

- Felhasználók Google-fiókkal is be tudnak jelentkezni
- E-mail/jelszó login változatlan
- Google user esetén az e-mail általában verified, így `isAuthenticated` működik
