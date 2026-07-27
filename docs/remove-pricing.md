# Remove Pricing from the public site

Removed the Pricing page and all public price / plan CTAs so the site no longer sells packages on-site.

## Changes

- Nav: removed Pricing link
- Route: `/pricing` redirects to `/learn`
- Deleted `Pricing.jsx` and `pricingPlans.js`
- Learn “Also available”: For Teams + Free game (no View plans)
- Removed unused pricing CSS from `site.css`

## Files

- `src/App.jsx`
- `src/components/SiteNav.jsx`
- `src/pages/learn/Learn.jsx`
- `src/styles/site.css`
- deleted: `src/pages/Pricing.jsx`, `src/data/pricingPlans.js`
