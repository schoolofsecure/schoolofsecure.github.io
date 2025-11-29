## 2025-11-28 – Aurora ügy újrajátszás

- A `src/pages/Aurora.jsx` állományban a kártya linkje most már akkor is az `/ugyN` útvonalra mutat, ha az alap JSON-ben `href: "#"` szerepelt.
- Így a már teljesített ügyeknél sem lesz inaktív a kártya; bármikor újra megnyitható az adott ügy oldala.

