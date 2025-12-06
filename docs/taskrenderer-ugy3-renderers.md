# TaskRenderer - 3. pálya rendererek hozzáadása

## Változtatások

A bak fájlból átkerültek a hiányzó rendererek a TaskRenderer.jsx-be, hogy a 3. pálya feladatainak megfelelő renderelésük legyen.

## Hozzáadott rendererek

1. **MisconfigTaskRenderer**: Konfigurációs hibák azonosítására, sorok kijelölésével
2. **NetworkAnomalyTaskRenderer**: Hálózati anomáliák azonosítására, táblázatos forgalom megjelenítéssel
3. **EmailHeaderTaskRenderer**: E-mail fejléc elemzésére, SPF/DKIM ellenőrzéssel
4. **UrlTrustTaskRenderer**: URL-ek megbízhatóságának értékelésére, checkbox listával
5. **RiskyPermissionTaskRenderer**: Veszélyes engedélyek azonosítására, checkbox listával

## Switch case frissítések

- `MISCONFIG` → `MisconfigTaskRenderer` (korábban `DefaultTaskRenderer`)
- `NETWORK_ANOMALY` → `NetworkAnomalyTaskRenderer` (korábban `DefaultTaskRenderer`)
- `EMAIL_HEADER` → `EmailHeaderTaskRenderer` (korábban `DefaultTaskRenderer`)
- `URL_TRUST` → `UrlTrustTaskRenderer` (korábban `SocialEngineeringTaskRenderer`)
- `RISKY_PERMISSION` → `RiskyPermissionTaskRenderer` (korábban `DefaultTaskRenderer`)

## Dátum

2024

