# Iterali: játék + tanulási platform

## Két termékterület

1. **Ingyenes játék** (`/play`, `/aurora`, `/ugy1`…): változatlan mechanika, neon vizuál csak itt.
2. **Fizetős tanulás** (`/learn`): külön, nyugodtabb layout, leckék, dashboard.

## Navigáció

Home · Play · Learn · For Teams · Pricing · Sign In · Play Free (CTA)

## Új oldalak

| Útvonal | Funkció |
|---------|---------|
| `/play` | Ingyenes játék bemutató |
| `/learn` | 7 learning path áttekintő |
| `/learn/paths/:id` | Path + leckék |
| `/learn/lessons/:id` | 3–7 perces lecke + kvíz |
| `/learn/dashboard` | Haladás, ajánlások |
| `/pricing` | €0 és €5.99/hó, €49.99/év |
| `/teams` | Csapatok, egyedi árazás |

## Játék → tanulás

Case befejezése után: `GameSessionResults` (pont, pontosság, personal best, Explore Learning / Play Again).

## Haladás

`LearningProgressContext` + localStorage (`iterali_learning_progress`).

## Nem változott

- UgyConfigs, feladatok, Aurora logika
- Nincs Academy, certificate, LMS a játékban
