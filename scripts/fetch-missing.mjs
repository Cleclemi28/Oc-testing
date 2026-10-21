import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), '..');
const BASE = 'https://lafetedelavie.fr/wp-content/uploads';

const JOBS = [
  ['src/assets/team', '2026/09/Animatrice_fond_F5E8C7-e1790319440830.png'],
  ['src/assets/team', '2026/09/Benevole_fond_F5E8C7-e1790264348754.png'],
  ['src/assets/team', '2026/09/Educateur_fond_F5E8C7-e1790264656222.png'],
  ['src/assets/team', '2026/09/Enseignant_fond_F5E8C7-e1790319553224.png'],
  ['src/assets/team', '2026/09/Infirmiere2-e1790320529723.png'],
  ['src/assets/team', '2026/09/Organisateur_fond_F5E8C7-e1790319597489.png'],
  ['src/assets/team', '2026/09/Psychologue_fond_F5E8C7-e1790319496961.png'],
  ['src/assets/team', '2026/09/Sportif_fond_F5E8C7-e1790319646737.png'],
  ['src/assets/team', '2026/09/Martin-CABY.png'],
  ['src/assets/team', '2026/09/Michel-CAMBRELIN-e1790087579320.png'],
  ['src/assets/decor', '2026/07/Background-1.png'],
  ['src/assets/decor', '2026/07/Background-2.png'],
  ['src/assets/decor', '2026/07/Overlay.png'],
  ['src/assets/decor', '2026/07/Overlay-1.png'],
  ['src/assets/decor', '2026/07/Overlay-2.png'],
  ['src/assets/decor', '2026/07/Overlay-4.png'],
  ['src/assets/decor', '2026/06/fdlvLogo.png'],
  ['src/assets/decor', '2026/06/cropped-La-fete-de-la-vie-logo-1.png'],
];

let ok = 0;
const failed = [];
await Promise.all(
  JOBS.map(async ([dir, rel]) => {
    const dest = path.join(ROOT, dir, path.basename(rel));
    try {
      const res = await fetch(`${BASE}/${rel}`, { signal: AbortSignal.timeout(90_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buf);
      ok++;
      console.log(`ok  ${rel} (${(buf.length / 1024).toFixed(0)} Ko)`);
    } catch (e) {
      failed.push(`${rel}: ${e.message}`);
      console.error(`FAIL ${rel}: ${e.message}`);
    }
  })
);
console.log(`\n${ok} ok, ${failed.length} failed`);
