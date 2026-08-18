# Blog posts újraépítés (2026. augusztus)

A git checkout után elveszett blogtartalom újraépítve.

## Fájlok

- `src/data/blogPosts.js` — teljes lista (interjú import + 19 cikk)
- `src/data/blogInterviewSzatmari.js` — `section: Human`, `date: 2026-08-20`
- `scripts/spa-fallbacks.js` — minden blog slug (beleértve `digitalisation-szatmari-anita`)

## Struktúra

- `blogSections`: Human, AI & Work, Cyber Careers, Digital Trust, Learning
- Tömb: először `szatmariInterview`, utána dátum szerint newest-first
- Dátumok: interjú után 3 naponta (2026-08-23 … 2026-10-16)

## Ellenőrzés

- `blogPosts.length === 20`
- Első: interjú 2026-08-20
- Utolsó a „rest” között: `your-brain-is-the-new-attack-surface` 2026-08-23
