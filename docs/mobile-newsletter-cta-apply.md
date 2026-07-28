# Mobil: newsletter, Academy CTA, apply kérdések

## Mit változtattunk

1. **Newsletter email mező** — egysoros (~36px); `.input.landing-newsletter-input` a későbbi `.input` szabály után, hogy ne írja felül.
2. **Share your interest** — a fixed alsó CTA elrejtődik, ha a footer látszik (IntersectionObserver); több alsó padding.
3. **Academy apply** — kérdés + válasz + OK egy képernyőn: kompaktabb mobil tipográfia, kisebb textarea, OK sticky a válasz alatt; lépésváltáskor felgörget a panelhez.
4. **Back + OK** — mobilon egy sorban: Back balra, OK mellette (nem full-width Back).
5. **Ország / background / why now** — Back/OK közvetlenül a mező alatt (`academy-apply-panel--tight`).
6. **Karakterszámláló** — background (20) és why now (40): hány van meg / mennyi kell még az OK-hoz.
7. **Kérdésszámláló** — sticky „Question X of Y” + a kártyán `N / total`; lépésváltáskor a progresshez görget.
8. **Scroll fix** — lépésváltáskor `useLayoutEffect` + `scrollTo(0,0)` / `documentElement` / `body`, hogy a 3.→4. után is az oldal tetejétől jöjjön a kérdés.

## Fájlok

- `src/index.css`
- `src/pages/Academy.jsx`
- `src/pages/AcademyApply.jsx`
- `src/styles/site.css`
