## Scoring mentés javítás

- **Változtatott fájl**: `src/contexts/ScoringContext.jsx`
- **Probléma**: A pálya befejezésekor a mentés a régi state értékeket használta, mert a `setState` hívások aszinkronok
- **Megoldás**:
  - A mentés előtt kiszámoljuk a frissített értékeket (`updatedLevelStats`, `updatedPerfectStreak`, `updatedAchievements`)
  - A mentéskor ezeket a frissített értékeket használjuk, nem a state-et
  - A betöltésnél javítottuk a logikát: ha `data.totalPoints` létezik (akár 0 is), azt használjuk, nem 50-et

- **Eredmény**: Most már helyesen menti és betölti a pontszámot, akkor is ha 0 pont van

