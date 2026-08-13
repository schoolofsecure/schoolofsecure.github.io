# Blog éles: magazin + ütemezett cikkek

Élesben megjelenik a magazinos `/blog` (szűrők, featured, hero).

A **mai napnál későbbi** dátumú cikkek a kódban maradnak, de production buildben nem látszanak:
`getPublishedBlogPosts()` / `getBlogPost()` csak `date <= ma` cikkeket ad.

**Localhost (Vite DEV):** minden cikk látszik előnézetnek.

## Fájlok

- `src/data/blogPosts.js` — publish gate + DEV kivétel
- `src/pages/Blog.jsx`
- `scripts/spa-fallbacks.js` — buildkor csak published blog route-ok
