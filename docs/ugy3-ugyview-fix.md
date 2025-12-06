# Ugy3 - UgyView integráció javítása

## Probléma

Az ugy3.jsx dinamikus feladatokat generál, de az ugy3Config-ben `isDynamic: false` volt, és hiányoztak a szükséges konfigurációk (forcedTypes, forcedDifficulty, taskLabels, taskImages, taskStories).

## Változtatások

### ugyConfigs.jsx

1. **isDynamic**: `false` → `true`
2. **forcedTypes** hozzáadva: `['ICON_MEMORY', 'NETWORK_ANOMALY', 'EMAIL_HEADER', 'URL_TRUST', 'RISKY_PERMISSION']`
3. **forcedDifficulty** hozzáadva: `'easy'`
4. **taskLabels** hozzáadva: minden ugy3 feladattípushoz címke
5. **taskImages** hozzáadva: minden feladattípushoz kép
6. **taskStories** hozzáadva: minden feladattípushoz történet
7. **tasks** tömbre: eltávolítva (mivel dinamikus feladatokat használ)

### UgyView.jsx

1. **forcedTypes és forcedDifficulty** használata: a `LevelGenerator.generateLevel` hívásban most használja a config-ból a `forcedTypes`-t és `forcedDifficulty`-t, ha nincs QA módban megadva
2. **Completion üzenet** hozzáadva: az ugy3-hoz is megjelenik a completion üzenet, hasonlóan az ugy2-hez

## Dátum

2024

