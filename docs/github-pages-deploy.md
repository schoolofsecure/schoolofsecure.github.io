# GitHub Pages Deploy Workflow

A frontend automatikus buildelése és GitHub Pages-re való deployolása GitHub Actions workflow segítségével.

## Workflow leírás

A `.github/workflows/deploy.yml` fájl tartalmazza a deploy workflow-t, ami:

1. **Trigger**: `main` branch push esetén automatikusan fut
2. **Build**: Yarn-nal telepíti a függőségeket és build-eli a frontendet
3. **Deploy**: A `dist` mappa tartalmát és a `CNAME` fájlt deploy-olja a `gh-pages` branch-re

## Lépések

1. Checkout a kód
2. Node.js 20 LTS beállítása yarn cache-pel
3. Dependencies telepítése (`yarn install --frozen-lockfile`)
4. Build futtatása (`yarn build`)
5. CNAME fájl másolása a dist mappába
6. GitHub Pages deploy (`peaceiris/actions-gh-pages` action)

## Követelmények

- A workflow automatikusan fut a `main` branch push-akor
- A `GITHUB_TOKEN` automatikusan elérhető, nincs szükség külön beállításra
- A `dist` mappa tartalma kerül a `gh-pages` branch root-jába
- A `CNAME` fájl is átmásolódik a `dist` mappába a custom domain miatt

