# Marketing pages clean-code pass

Low-risk refactor to reduce duplication and remove dead CSS without changing behaviour.

## Changes

- Added `PromoCard` for Play/Learn secondary link cards
- Added `pricingPlans` data and mapped Pricing cards
- Replaced inline styles with CSS utilities in `site.css`
- Merged `.play-benefit-grid` into `.teams-benefit-grid--2col`
- Removed unused CSS: `.hero-home`, `.steps-grid`, `.badge-free`, legacy nav aliases
- Removed redundant `index.css` imports from pages (loaded globally in `main.jsx`)

## Files

- `src/components/PromoCard.jsx` (new)
- `src/data/pricingPlans.js` (new)
- `src/pages/Pricing.jsx`, `Play.jsx`, `learn/Learn.jsx`
- `src/styles/site.css`
- `src/components/SiteNav.jsx` and several page imports
