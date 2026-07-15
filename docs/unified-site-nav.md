# Unified site navigation

## Date
2026-07-15

## Summary
All pages now use the same header navigation as the landing page via the shared `SiteNav` component.

## Changes
- `SiteNav.jsx` rebuilt to match landing: nav links, Sign In panel, Play Free / My learning / Profile buttons
- `Landing.jsx` uses `SiteNav` instead of inline header
- Added `SiteNav` to: Aurora, Profile, Privacy, NotFound, UgyView (case pages)
- Game case title shown below nav as `.case-title-bar`
- Active link highlights Play for `/aurora` and `/ugy*` routes, Learn for `/learn/*`

## Styles
- New `.site-header*` classes in `index.css`
