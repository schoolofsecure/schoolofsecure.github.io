# Blog, Values és LinkedIn

## Mit csináltunk

Homepage és site chrome bővítése SEO / trust tartalommal, a hero és fő CTA-k változatlanok.

## Struktúra

- Header: **Blog** → `/blog` (Pricing után)
- Homepage: csak hero + For individuals / For teams (nincs values/blog teaser)
- Footer: Privacy · Terms · Contact · Values · Blog · LinkedIn ikon
- Új oldalak: `/blog`, `/blog/:slug`, `/values`

## Fájlok

- `src/data/blogPosts.js` – cikkek
- `src/data/brand.js` – values pillérek + `LINKEDIN_URL`
- `src/pages/Blog.jsx`, `BlogPost.jsx`, `Values.jsx`
- `src/pages/Landing.jsx`, `SiteNav.jsx`, `SiteFooter.jsx`, `App.jsx`, `index.css`

## Teendő

Állítsd be a valódi LinkedIn URL-t a `src/data/brand.js` fájlban (`LINKEDIN_URL`).

Footer Contact: `mailto:erikapappkovacs@gmail.com`.

Privacy Policy:
- Contact / privacy inquiries: `erikapappkovacs@gmail.com`
- Szöveg: Iterali learning platform (nem csak mystery game) — lásd `docs/privacy-policy-iterali-platform.md`
