# Pontozási rendszer egyszerűsítése

## Változtatás
- Minden helyes válasz: +10 pont
- Minden helytelen válasz: -5 pont
- Nehézségtől függetlenül

## Módosított fájlok
- `src/utils/scoring.js`

## Változtatások részletei

### calculateTaskScore függvény
- Eltávolítva: nehézség szorzó alkalmazása
- Előtte: easy=10, medium=15, hard=20 pont helyes válasz esetén
- Most: minden helyes válasz = 10 pont
- Minden helytelen válasz = -5 pont

## Hatás
- Egyszerűbb, átláthatóbb pontozás
- Nehézségtől függetlenül minden válasz ugyanannyit ér
- A pálya bónuszok és egyéb bónuszok továbbra is érvényesek

