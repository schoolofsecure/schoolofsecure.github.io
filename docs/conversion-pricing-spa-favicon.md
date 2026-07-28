# Conversion fixes: ár, SPA 200, favicon, cookie

## Academy ár / keretek
- Blokk az `/academy` oldalon:
  - **About €11 a day**
  - 6 hónap, live sessions, coaching
  - **€2,000 — an investment in yourself.**
- FAQ: „How much does it cost?” + refund említ €2,000-t

## SPA 404 → 200 (GitHub Pages)
- `scripts/spa-fallbacks.js` másolja az `index.html`-t az ismert route mappákba
- `yarn build` futtatja
- Deploy workflow: külön 404 copy lépés törölve (a script intézi)

## Favicon
- Sötét háttér (`#0b121c`), vastagabb fehér `i` — böngészőfülön látható

## Cookie mobil
- Nem full-width; jobb alsó, max ~240px
- Rövidített szöveg
