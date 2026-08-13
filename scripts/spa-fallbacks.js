#!/usr/bin/env node
/**
 * GitHub Pages serves missing paths as 404.html with HTTP 404.
 * Copying index.html into each known route folder makes those URLs return 200.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPublishedBlogPosts } from '../src/data/blogPosts.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const indexHtml = join(dist, 'index.html')

if (!existsSync(indexHtml)) {
  console.error('dist/index.html missing — run build first')
  process.exit(1)
}

const blogRoutes = getPublishedBlogPosts().map((post) => `blog/${post.slug}`)

const routes = [
  'academy',
  'academy/apply',
  'contact',
  'about',
  'teams',
  'blog',
  'magazine',
  ...blogRoutes,
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

const notFound = join(dist, '404.html')
copyFileSync(indexHtml, notFound)

console.log(`SPA fallbacks: ${routes.length} routes (${blogRoutes.length} published blog posts) + 404.html`)
