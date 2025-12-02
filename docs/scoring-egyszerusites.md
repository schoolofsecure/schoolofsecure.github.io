# Pontozási rendszer egyszerűsítése

## Változtatás
Minden helyes válasz mostantól +10 pontot ad, a nehézségtől függetlenül.

## Módosított fájlok
- `src/utils/scoring.js`

## Változtatások részletei

### calculateTaskScore függvény
- Eltávolítva: nehézség szorzó alkalmazása
- Előtte: easy=10, medium=15, hard=20 pont
- Most: minden helyes válasz = 10 pont
- Helytelen válasz: továbbra is -5 pont

## Hatás
- Egyszerűbb, átláthatóbb pontozás
- Nehézségtől függetlenül minden helyes válasz ugyanannyit ér
- A pálya bónuszok és egyéb bónuszok továbbra is érvényesek

