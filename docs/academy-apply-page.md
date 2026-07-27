# /academy – jelentkezési oldal

## Cél
A jelentkezés lényege külön oldalon: application, nem checkout.

## Tartalom
- Cím: **Apply first.** / **We'll decide** + aláhúzott *together.*
- Bevezető: kis cohort, személyes coaching, calm habits
- 3 lépés: Submit application → Book call → We decide together
- CTA: Start the application → `/academy/apply`

## Layout
- Bal: Apply szöveg + 3 lépés + egy CTA alul: **Start the application** (narancs gradient) → `/academy/apply`
- Jobb: **Common Questions** accordion
- Nincs email: kérdésekhez `/teams#contact` contact form link
- Nincs felső Apply gomb az academy oldalon

## Application form (`/academy/apply`)
Typeform-szerű lépések (Iterali-ra szabva):
1. Intro — Apply to the Iterali Academy + Start
2. Serious commitment (Yes / No → exit)
3. Where based (timezone)
4. Current situation (A–G)
5. Professional background
6. How did you hear about us
7. Why applying now (részletes)
8. Contact — name + email → FormSubmit

Progress bar, narancs OK / Submit gombok.

## Következő cohort
- `src/data/academyCohort.js`: Only 5 seats for the next cohort, starts Monday 14 September 2026
- Megjelenik: `/academy` + apply intro

## FAQ (Iterali)
- Idő / hét
- Full-time munka mellett
- Refund
- Programme hossza
- Kihagyott event
- Még nem tudom, hol akadok el / lehet-e jelentkezni
