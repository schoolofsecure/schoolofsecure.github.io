# Fejlesztői Skip Gomb

## Változtatások

Hozzáadva egy fejlesztői skip gomb minden feladat rendererhez a TaskRenderer komponensben.

## Részletek

- **Komponens**: `DevSkipButton` - egy új komponens, ami egy kis, szürke gombot jelenít meg
- **Funkció**: A gombra kattintva a feladat automatikusan sikeresnek minősül és továbblépünk
- **Megjelenés**: Minden rendererben az "Ellenőrzés" gomb mellett vagy alatt jelenik meg
- **Stílus**: Kis, szürke, ghost stílusú gomb, hogy ne zavarja a normál használatot

## Rendererek

A gomb hozzáadva az összes feladat típushoz:
- CaesarTaskRenderer
- VigenereTaskRenderer
- PhishingTaskRenderer
- LogAnalysisTaskRenderer
- IconMemoryTaskRenderer
- SocialEngineeringTaskRenderer
- FirewallTaskRenderer
- SecurityDecisionTaskRenderer
- PasswordStrengthTaskRenderer
- MisconfigTaskRenderer
- NetworkAnomalyTaskRenderer
- EmailHeaderTaskRenderer
- UrlTrustTaskRenderer
- RiskyPermissionTaskRenderer
- DefaultTaskRenderer

## Használat

A gombra kattintva a `handleDevSkip` függvény hívódik meg, ami:
1. Beállítja a `solved` állapotot `true`-ra
2. Meghívja az `onSuccess` callback-et, ami továbblépteti a felhasználót

