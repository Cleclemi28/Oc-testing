import sharp from 'sharp';
import fs from 'node:fs';

const files = ['sport.webp', '3_Drogue_2.webp', 'Vitamine-HD.webp', 'Cyber-Harcelement-800x2000-1.webp'];

for (const f of files) {
  const src = `src/assets/banners/${f}`;
  const original = fs.statSync(src).size;
  const row = [`${f.padEnd(36)} orig ${(original / 1024).toFixed(0)}Ko`];
  for (const [w, q] of [[360, 70], [720, 70], [720, 60], [500, 65]]) {
    const buf = await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: q, effort: 6 }).toBuffer();
    row.push(`${w}q${q}=${(buf.length / 1024).toFixed(0)}Ko`);
  }
  console.log(row.join('  '));
}
