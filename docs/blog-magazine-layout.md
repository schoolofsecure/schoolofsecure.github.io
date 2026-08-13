# Blog magazinos lista

A `/blog` oldal magazinos kinézetet kapott; a menüben továbbra is „Blog”.

## Mit lát az olvasó

- Felül egy nagy **featured** cikk (`featured: true`, különben a legfrissebb)
- Alatta egységes **article card** rács (desktop 2 oszlop, mobil 1)
- Minden cikken **rovatcímke** (`section`): Human, AI & Work, Cyber Careers, Digital Trust
- Rövid bevezető (`excerpt`) + olvasási idő

## Fájlok

- `src/pages/Blog.jsx` — layout
- `src/pages/BlogPost.jsx` — rovat a cikkoldalon
- `src/data/blogPosts.js` — `section`, `featured`, `getFeaturedBlogPost`
- `src/index.css` — `.blog-mag-*` stílusok
