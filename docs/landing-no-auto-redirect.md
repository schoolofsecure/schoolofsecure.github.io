# Landing oldal – auto-redirect javítás

## Probléma
Bejelentkezett (email megerősített) felhasználó a `/` megnyitásakor azonnal átirányításra került `/aurora`-ra, így a kezdőoldal nem volt látható.

## Megoldás
Eltávolítva a `Landing.jsx`-ből az automatikus redirect `useEffect`. A kezdőoldal most mindig megjelenik; bejelentkezés után továbbra is az Aurora-ra visz a Log in gomb.
