# Blog témaszűrő, Learning, kétnyelvű cikk

## Változások

- Felül témaszűrő chippek: All, Human, AI & Work, Cyber Careers, Digital Trust, **Learning**
- Learning rovat: `pause-before-you-continue`, `spot-fake-login-pages`, `safe-to-fail-security-practice`, plusz új cikk
- Új cikk dátuma: **2026-08-20** — `practice-the-pause-one-habit` (EN + HU)
- Cikkoldalon 🇭🇺 / 🇬🇧 gombok váltják a nyelvet, ha van `hu` mező

## Fájlok

- `src/data/blogPosts.js` — `blogSections`, `hu`, `getPostLocale`
- `src/pages/Blog.jsx` — szűrők
- `src/pages/BlogPost.jsx` — nyelvváltó
- `src/index.css` — filter + lang stílusok
- `scripts/spa-fallbacks.js` — új slug
