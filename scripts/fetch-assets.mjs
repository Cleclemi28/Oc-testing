/**
 * Downloads every asset needed by the demo from the public WordPress media library
 * into src/assets/ (or public/fonts/ for the self-hosted webfonts).
 *
 * Usage: node scripts/fetch-assets.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, '.tmp-assets');
const BASE = 'https://lafetedelavie.fr/wp-content/uploads';

const OUT = {
  hero: path.join(ROOT, 'src/assets/hero'),
  banners: path.join(ROOT, 'src/assets/banners'),
  team: path.join(ROOT, 'src/assets/team'),
  partners: path.join(ROOT, 'src/assets/partners'),
  decor: path.join(ROOT, 'src/assets/decor'),
  fonts: path.join(ROOT, 'public/fonts'),
};

/** File lists. `null` in the tuple means "derive the name from the URL". */
const FILES = [
  // --- Hero ---
  ['hero', '2026/10/Section-Hero_-Modified-to-be-full-bleed_opti.webp'],

  // --- Team illustrations (transparent PNG) ---
  ['team', '2026/06/Animatrice.png'],
  ['team', '2026/06/Educateur.png'],
  ['team', '2026/06/Sportif.png'],
  ['team', '2026/06/Enseignant.png'],
  ['team', '2026/06/Organisateur.png'],
  ['team', '2026/06/Psychologue.png'],
  ['team', '2026/06/Infirmiere.png'],
  ['team', '2026/06/Benevole.png'],

  // --- Portraits ---
  ['team', '2026/06/Michel-CAMBRELIN-e1790087579320.png'],
  ['team', '2026/06/Martin-CABY.png'],

  // --- Partner logos ---
  ['partners', '2026/06/image-5.png'],   // Hauts de France
  ['partners', '2026/06/image-7.png'],   // Région Nord
  ['partners', '2026/06/image-8.png'],   // Astek
  ['partners', '2026/06/image-11.png'],  // Crédit Agricole
  ['partners', '2026/06/image-20.png'],  // Kolabee
  ['partners', '2026/06/image-21.png'],  // Santélys
  ['partners', '2026/06/image-22.png'],  // Mild et CA
  ['partners', '2026/06/image-25.png'],  // Croix Rouge
  ['partners', '2026/06/image-64.png'],  // Prévention routière
  ['partners', '2026/06/image-9.png'],   // République Française
  ['partners', '2026/06/image-6.png'],   // CPAM
  ['partners', '2026/09/IP-Lille-e1789998071267.png'],

  // --- Decorative DA motifs ---
  ['decor', '2026/06/Background-1-1.svg'],
  ['decor', '2026/06/Background-2.svg'],
  ['decor', '2026/06/Background-3.svg'],
  ['decor', '2026/06/Margin.png'],
  ['decor', '2026/06/Margin-1.png'],
  ['decor', '2026/06/Margin-2.png'],
  ['decor', '2026/06/Vector-1024x88.png'],
  ['decor', '2026/06/Vector.png'],
  ['decor', '2026/06/Container-2-1.png'],
  ['decor', '2026/07/Container-1.png'],
  ['decor', '2026/06/LFDV-icone-et-nom.svg'],
  ['decor', '2026/06/cropped-fdlvLogo.png'],
  ['decor', '2026/06/Icon2.png'],
  ['decor', '2026/06/Icon3.png'],
  ['decor', '2026/06/Icon4.png'],
  ['decor', '2026/06/image-2.jpg'],
  ['decor', '2026/06/image-3.jpg'],
  ['decor', '2026/06/image-4.jpg'],
];

// Self-hosted webfonts (latin subset only, woff2).
const FONT_BASE = 'https://lafetedelavie.fr/wp-content/uploads/omgf';
const FONTS = [
  ['elementor-gf-fredokaone/fredoka-one-normal-latin-400.woff2', 'fredoka-one-latin-400.woff2'],
  ['elementor-gf-poppins/poppins-normal-latin-400.woff2', 'poppins-latin-400.woff2'],
  ['elementor-gf-poppins/poppins-normal-latin-500.woff2', 'poppins-latin-500.woff2'],
  ['elementor-gf-poppins/poppins-normal-latin-600.woff2', 'poppins-latin-600.woff2'],
  ['elementor-gf-poppins/poppins-normal-latin-700.woff2', 'poppins-latin-700.woff2'],
];

const failed = [];
let done = 0;

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; site-build/1.0)' },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  return buf.length;
}

/** Runs `worker` over `items` with a bounded number of parallel requests. */
async function pool(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      try {
        await worker(items[idx]);
        done++;
        if (done % 20 === 0) console.log(`  ${done}/${items.length + FONT_FILES.length}`);
      } catch (err) {
        failed.push(`${items[idx].url} :: ${err.message}`);
        console.error(`  FAIL ${items[idx].url} :: ${err.message}`);
      }
    }
  });
  await Promise.all(runners);
}

const FONT_FILES = FONTS;

async function main() {
  await fs.mkdir(TMP, { recursive: true });
  for (const dir of Object.values(OUT)) await fs.mkdir(dir, { recursive: true });

  // ---- Banners: read the published catalogue from /bannieres/ ----
  const bannieresHtml = await fs.readFile(path.join(TMP, 'bannieres.html'), 'utf8');
  const seen = new Map();
  for (const m of bannieresHtml.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
    const alt = (tag.match(/alt="([^"]*)"/) || [])[1] || '';
    if (!/uploads\/2026\/09\//.test(src)) continue;
    const name = src.split('/').pop().replace(/-\d+x\d+(?=\.\w+$)/, '');
    if (!name || name.startsWith('X-') || name.startsWith('XBanner') || name.startsWith('Xbanner')) continue;
    if (seen.has(name)) continue;
    seen.set(name, { alt: alt.replace(/[_.]/g, ' ').trim(), file: name });
  }
  const banners = [...seen.values()];
  console.log(`Banners published: ${banners.length}`);
  await fs.writeFile(
    path.join(ROOT, 'src/data/banners.json'),
    JSON.stringify(banners, null, 2) + '\n'
  );

  const jobs = [
    ...FILES.map(([bucket, rel]) => ({
      url: `${BASE}/${rel}`,
      dest: path.join(OUT[bucket], path.basename(rel)),
    })),
    ...banners.map((b) => ({
      url: `${BASE}/2026/09/${b.file}`,
      dest: path.join(OUT.banners, b.file),
    })),
  ];

  console.log(`Downloading ${jobs.length} assets...`);
  await pool(jobs, 8, (j) => download(j.url, j.dest));

  console.log('Downloading fonts...');
  await pool(
    FONTS.map(([rel, out]) => ({ url: `${FONT_BASE}/${rel}`, dest: path.join(OUT.fonts, out) })),
    5,
    (j) => download(j.url, j.dest)
  );

  console.log(`\nDone: ${done} ok, ${failed.length} failed.`);
  if (failed.length) {
    console.log('\nFailures:');
    for (const f of failed) console.log('  ' + f);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
