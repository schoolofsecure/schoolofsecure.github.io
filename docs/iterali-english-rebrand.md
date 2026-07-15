# Iterali – angol rebrand és fordítás

## Összefoglaló

A teljes weboldal magyarról természetes angolra lett fordítva, a **CyberMystery** márka **Iterali** névre cserélve.

## Logó

- Fájl: `public/images/iterali logo.png`
- Új komponens: `src/components/BrandLogo.jsx` — minden fejlécben ez jelenik meg a korábbi „CM” badge helyett

## Érintett területek

| Terület | Változás |
|---------|----------|
| Főoldal (`Landing.jsx`) | Angol szöveg, Iterali branding |
| Aurora / ügyek | Angol UI, case címek |
| Feladatok | 19 dinamikus task + ugyConfigs statikus tartalom angolul |
| Auth / pontozás | Hiba- és sikerüzenetek angolul |
| Adatvédelem | Privacy policy angolul |
| Meta | `index.html` lang=en, Iterali title/description |

## Puzzle-válaszok (Case #1)

- Caesar: `Watch out, Zoli might be a secret agent.`
- Log: `CLUES`
- Levél kód: `3871` (változatlan)
- Szókereső: `3542` (változatlan)
- Gate jelszó (aurora.json): `cryptography`

## Indítás

```bash
npm run dev
```

Böngésző: `http://localhost:3000/` (Chrome/Safari ajánlott)
