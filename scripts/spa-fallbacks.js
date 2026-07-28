#!/usr/bin/env node
/**
 * GitHub Pages serves missing paths as 404.html with HTTP 404.
 * Copying index.html into each known route folder makes those URLs return 200.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const indexHtml = join(dist, 'index.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run build first')
  process.exit(1)
}

const routes = [
  'academy',
  'academy/apply',
  'contact',
  'about',
  'teams',
  'blog',
  'blog/pause-before-you-continue',
  'blog/spot-fake-login-pages',
  'blog/safe-to-fail-security-practice',
  'blog/human-centred-security-teams',
  'values',
  'privacy',
  'terms',
  'aurora',
  'profile',
  ...Array.from({ length: 12 }, (_, i) => `ugy${i + 1}`),
]

for (const route of routes) {
  const targetDir = join(dist, route)
  mkdirSync(targetDir, { recursive: true })
  copyFileSync(indexHtml, join(targetDir, 'index.html'))
}

copyFileSync(indexHtml, join(dist, '404.html'))
console.log(`SPA fallbacks written for ${routes.length} routes + 404.html`)
