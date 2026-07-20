# Iterali — defensible homepage copy (Decide → Review → Next)

## Date
2026-07-20

## Goal
Tighten homepage voice so Iterali feels harder to copy: decision-focused, safe-to-fail, one clear next step, privacy as UX — not generic “realistic training” bullets.

## Changes shipped (first pass)

### Style
- No em dashes; no Oxford comma before and/or
- Prefer short natural clauses over list-like punctuation

### Hero (`src/pages/Landing.jsx`)
- **Headline:** Practise the decision you would make at work before it happens for real
- **Lead:** Decide under pressure, review without blame and get one clear next step…

### Individuals path
- **Label:** For people who learn by deciding
- **Title:** Start with one case. We’ll show what to practise next
- Bullets: one case, blame-free review, next practise + structured paths

### Teams path
- **Label:** For teams who practise safely
- **Title:** Skill patterns for leaders and safe-to-fail practice for everyone
- Bullets: workplace decisions, one next step, aggregated gaps (not mistake replays)

### Footer (`src/components/SiteFooter.jsx`)
- Trust line: Minimal data, clear explanations and privacy first.

## Narrative spine
**Decide → Review → Next** — same idea on homepage; later to extend into scenario intro, feedback card, and progress UX.

## Follow-ups
1. ~~Feedback card template in scenarios~~ — first pass done (shared microcopy)
2. ~~Progress: one recommended next case~~ — first pass done
3. ~~“Why we ask” microcopy on auth / save-progress~~ — first pass done
4. ~~Align Values + Blog intros with the same spine~~ — first pass done
5. ~~Soften remaining TaskRenderer task-specific “Correct! / Not quite” lines~~ — done

## TaskRenderer feedback (2026-07-20)
Selection and decision tasks now use “Good call…” / “Common under time pressure…” (or “Common when you rush…”) with a cue to review, matching shared feedback voice.

## Values + Blog (2026-07-20)
- Values hero: Decide. Review. Next.
- Pillars in `brand.js` aligned to decide / review / next step / why we ask
- Blog index: short notes for busy people; excerpts and bodies without em dashes / Oxford commas where updated
- Teams article close: skill patterns, not mistake replays

## Progress UX (2026-07-20)
- Learn dashboard leads with **Your next step** (one lesson + duration + CTA)
- Learn hub shows the same next lesson above the path grid
- Lesson end and game session results use “Your next step” / “Practise this next”
- `getRecommendedNext` now includes `duration` and `pathTitle`

## Feedback microcopy (2026-07-20)
Shared voice for Decide → Review → Next:
- Success: “Good call…” + cue / continue
- Miss: “Common under time pressure…” + spot cue + try safer step
- No em dashes; British English; no Oxford comma before and

Touched: `scoring.js`, `ChallengeInput.jsx`, `styleHelper.js`, `TaskRenderer.jsx` (defaults), `UgyView.jsx`, `ugyConfigs.jsx`, `SpecialComponents.jsx`
