# Conversion fixes: ár, SPA 200, favicon, cookie

## Academy ár / keretek
- Blokk az `/academy` oldalon:
  - **About €11 a day**
  - for calm, confident habits in your everyday online life.
  - **€2,000 for six months of live sessions, guided practice and personal coaching — an investment in habits that protect your time, data and peace of mind.**
- FAQ: „How much does it cost?” ugyanerre hangolva; refund említ €2,000-t

## SPA 404 → 200 (GitHub Pages)
- `scripts/spa-fallbacks.js` másolja az `index.html`-t az ismert route mappákba
- `yarn build` futtatja
- Deploy workflow: külön 404 copy lépés törölve (a script intézi)

## Favicon
- Sötét háttér (`#0b121c`), vastagabb fehér `i` — böngészőfülön látható

## Cookie mobil
- Nem full-width; jobb alsó, max ~240px
- Rövidített szöveg
