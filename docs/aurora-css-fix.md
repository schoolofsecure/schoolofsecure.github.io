# Aurora CSS frissítés

## Probléma
Az Aurora oldal CSS-je nem egyezett meg az eredeti HTML megoldással (`aurora.html.backup`).

## Végrehajtott változtatások

### 1. `.cm-surface` stílusok
- **Háttérszín**: `#0b121c` → `#0f1621`
- **Box-shadow hozzáadva**: `0 10px 24px rgba(0,0,0,0.35), inset 0 0 60px rgba(0,229,255,0.05)`
- **`::after` pseudo-element hozzáadva**: Radial gradient effektek a háttérben

### 2. `.cm-badge` stílusok
- **Háttér hozzáadva**: `rgba(0,229,255,0.12)`
- **Border szín**: `rgba(0,229,255,0.35)` (korábban `rgba(207,230,255,0.2)`)
- **Font-weight**: `700` hozzáadva
- **Letter-spacing**: `.4px` hozzáadva

### 3. Új stílusok hozzáadva
- **`.cm-title`**: Rajdhani font, 22px, letter-spacing
- **`.cm-story`**: Muted szín, 1.8 line-height
- **`.cm-puzzle`**: Ink szín, 1.7 line-height
- **`.cm-card h3`**: Rajdhani font, 18px
- **`.cm-input`**: Grid layout `1fr auto` oszlopokkal

### 4. `.cm-grid` módosítás
- **Grid-template-columns**: `1fr 1fr` → `1.1fr .9fr`
- **Gap**: `16px` → `14px`

### 5. `.cm-card` módosítás
- **Háttérszín**: `#0f1621` → `#0d141d`
- **Padding**: `16px` → `14px`

### 6. `.cm-statusline` módosítás
- **Font-family**: Monospace betűtípus hozzáadva
- **Szín**: `#9fb6d3` (korábban `var(--muted)`)
- **Font-size**: `12px` (korábban `14px`)

### 7. `.cm-hint` stílusok
- **Details háttér**: `#0f1621`
- **Border**: Dashed `rgba(207,230,255,0.18)`
- **Summary szín és font-weight**: `var(--ink)`, `600`

### 8. `.cm-chip` és `.cm-chips` stílusok
- **`.cm-chips`**: Flex container hozzáadva
- **`.cm-chip`**: Háttér `#101b2a`, szín `#b9d6ff`, padding `6px 10px`

### 9. `.intro-hero` bővítések
- **`::before` pseudo-element**: Conic gradient blur effekt
- **`.accent-line`**: Dekoratív vonalak hozzáadva
- **`.accent-line.b`**: Második accent line
- **`h2` és `p.lead`**: Stílusok hozzáadva

### 10. `.levels-grid` módosítás
- **Grid-template-columns**: `repeat(auto-fill, minmax(200px, 1fr))` → `repeat(4, 1fr)`

### 11. Animációk hozzáadva
- **`@keyframes neonFlicker`**: Neon villogás animáció
- **`.neon-flicker`**: Animáció osztály
- **`@keyframes caretBlink`**: Caret villogás animáció
- **`.caret::after`**: Villogó caret karakter

### 12. Általános stílusok
- **`.input`**: Általános input stílus hozzáadva
- **`.btn`**: Általános gomb stílus hozzáadva
- **`.brand-title`**: Stílus hozzáadva
- **`.status-ok` és `.status-err`**: Általános státusz osztályok

### 13. Media query módosítás
- **Max-width**: `960px` → `900px` a `.cm-grid`-hez

### 14. További hiányzó stílusok
- **`.gate-form`**: Grid layout hozzáadva `1fr auto` oszlopokkal
- **`.level-card:hover`**: Hover effekt hozzáadva (`background: #101a27`)
- **`.level-card`**: `display: grid; place-items: center;` hozzáadva
- **`.level-card img`**: `display: block;` hozzáadva
- **`.intro-hero .badge`**: `letter-spacing: .4px;` hozzáadva

### 15. Media query frissítés
- **Max-width 560px**: `.gate-form` és `.btn` stílusok hozzáadva

### 16. React komponens módosítás
- **`Aurora.jsx`**: `gate-form` className hozzáadva a form elemhez

## Eredmény
Az Aurora oldal CSS-je most pontosan ugyanúgy néz ki, mint az eredeti HTML megoldás (`aurora.html.backup`).

## Fájlok módosítva
- `src/styles/aurora.css`
- `src/pages/Aurora.jsx`

