# First free case — Recognise risky logins

## Date
2026-07-20

## Goal
Deliver the homepage promise in the first free practise: decide under pressure, review without blame, one clear next step. Safe-to-fail. No workplace identity in the scenario.

## Path
**Recognise risky logins** (4 steps)

1. `session-expired` — fake session popup + countdown  
2. `lookalike-domain` — misspelled login domain  
3. `urgency-lockout` — chat verify-in-60-seconds  
4. `bookmark-habit` — default habit, then link to Learn lesson `phishing-fake-login`

## Routes
- `/play` — entry with first-case CTA  
- `/play/case/:caseId` — decide → review → next  

## Files
- `src/data/freeCases.js`
- `src/pages/FreeCase.jsx`
- `src/styles/freeCase.css`
- `src/pages/Play.jsx`
- `src/App.jsx` (route)
