/**
 * Converts the downloaded raster sources into WebP and prunes the originals.
 * A WebP variant is only kept when it is actually smaller than the source
 * (tiny PNG icons often win as PNG).
 *
 * Usage: node scripts/optimize-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  { dir: 'src/assets/team', width: 700, quality: 82 },
  { dir: 'src/assets/banners', width: 760, quality: 74 },
  { dir: 'src/assets/decor', width: 1400, quality: 86 },
];

let before = 0;
let after = 0;
let converted = 0;
let kept = 0;

/** Windows can transiently lock a file right after sharp wrote it. Retry then give up. */
async function remove(file) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await fs.unlink(file);
      return;
    } catch (err) {
      if (err.code === 'ENOENT') return;
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
    }
  }
  console.warn(`  could not remove ${file}`);
}

for (const { dir, width, quality } of TARGETS) {
  const abs = path.join(ROOT, dir);
  let entries = [];
  try {
    entries = await fs.readdir(abs);
  } catch {
    continue;
  }

  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const src = path.join(abs, name);
    const out = path.join(abs, name.replace(/\.\w+$/, '.webp'));
    const srcSize = (await fs.stat(src)).size;

    await sharp(src)
      .resize({ width: width, withoutEnlargement: true })
      .webp({ quality, effort: 5 })
      .toFile(out);

    const outSize = (await fs.stat(out)).size;

    if (outSize < srcSize) {
      await remove(src);
      before += srcSize;
      after += outSize;
      converted++;
    } else {
      await remove(out);
      before += srcSize;
      after += srcSize;
      kept++;
    }
  }
}

console.log(
  `${converted} converted to WebP, ${kept} kept as source format.` +
    `  ${(before / 1024 / 1024).toFixed(2)} Mo -> ${(after / 1024 / 1024).toFixed(2)} Mo`
);
