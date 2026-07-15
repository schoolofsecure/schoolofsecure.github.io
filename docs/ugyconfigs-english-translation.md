# ugyConfigs.jsx English Translation

Translated all user-facing Hungarian strings in `src/pages/ugyConfigs.jsx` to natural English.

## Puzzle answer changes (Case #1)

| Task | Hungarian | English |
|------|-----------|---------|
| Task 1 (Caesar) | `Vigyázz, Zoli lehet titkosügynök.` | `Watch out, Zoli might be a secret agent.` |
| Task 1 ciphertext | `Yljbdcc, Crol ohkhw wlwnrvxjbqrn` | `Zdwfk rxw, Crol pljkw eh d vhfuhw djhqw.` |
| Task 2 (log) | `NYOMOK` | `CLUES` (log values updated to start with C-L-U-E-S) |
| Task 3 (letter) | `3871` | unchanged |
| Task 4 (word search) | `3542` | unchanged |

## Naming

- Ügy → Case (e.g. "Case #1")
- Routes and image paths unchanged

## Follow-up

`src/components/Ugy1/SpecialComponents.jsx` still uses Hungarian match-table sources and answers (`NYOMOK`, `REJTJEL`, etc.) — update separately for Task 5 to work in English.
