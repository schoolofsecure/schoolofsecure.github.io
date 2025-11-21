#!/usr/bin/env node
/**
 * Optimize images into WebP variants for faster loading.
 * - Level thumbnails (images/1.jpg..12.jpg): 640w, 1280w
 * - Task illustrations (images/1a.jpg..1e.jpg): 560w
 * - Secure portrait (images/secure.png): 400w
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'images');
const OUT_DIR = path.join(IMG_DIR, 'opt');

async function ensureDir(p){ await fs.promises.mkdir(p, { recursive: true }); }

async function optimizeFile(srcPath, targets){
  const name = path.basename(srcPath, path.extname(srcPath));
  const buf = await fs.promises.readFile(srcPath);
  await Promise.all(targets.map(async ({ width, suffix }) => {
    const out = path.join(OUT_DIR, `${name}-${suffix}.webp`);
    const img = sharp(buf, { failOn: 'none' }).resize({ width, withoutEnlargement: true });
    await img.webp({ quality: 82, effort: 5 }).toFile(out);
    // eslint-disable-next-line no-console
    console.log('✓', path.relative(ROOT, out));
  }));
}

async function run(){
  await ensureDir(OUT_DIR);
  const files = await fs.promises.readdir(IMG_DIR);
  const levelThumbs = files.filter(f => /^\d+\.jpe?g$/i.test(f));
  const tasks = files.filter(f => /^\d+[a-e]\.jpe?g$/i.test(f));
  const secure = files.filter(f => /^secure\.(png|jpe?g)$/i.test(f));

  for(const f of levelThumbs){
    await optimizeFile(path.join(IMG_DIR, f), [
      { width: 640, suffix: '640' },
      { width: 1280, suffix: '1280' },
    ]);
  }
  for(const f of tasks){
    await optimizeFile(path.join(IMG_DIR, f), [
      { width: 560, suffix: '560' },
    ]);
  }
  for(const f of secure){
    await optimizeFile(path.join(IMG_DIR, f), [
      { width: 400, suffix: '400' },
    ]);
  }
}

run().catch(err => { console.error(err); process.exit(1); });


