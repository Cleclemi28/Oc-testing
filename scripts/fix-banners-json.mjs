import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const bannersDir = path.join(root, 'assets', 'banners');
const jsonPath = path.join(root, 'data', 'banners.json');

const onDisk = new Set(fs.readdirSync(bannersDir));

const list = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const missing = [];
const fixed = list.map((entry) => {
  const name = entry.file.replace(/\.[^.]+$/, '');
  const candidates = [`${name}.webp`, `${name}.jpg`, `${name}.png`];
  const found = candidates.find((c) => onDisk.has(c));
  if (!found) {
    missing.push(entry.file);
    return entry;
  }
  return { ...entry, file: found };
});

console.log('total:', list.length, 'missing:', missing.length);
if (missing.length) console.log('MISSING:', missing);

fs.writeFileSync(jsonPath, JSON.stringify(fixed, null, 2) + '\n', 'utf8');
console.log('written', jsonPath);
