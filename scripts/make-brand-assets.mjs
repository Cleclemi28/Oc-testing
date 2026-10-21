import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const logoSvgPath = path.join(root, 'src', 'assets', 'decor', 'LFDV-icone-et-nom.svg');
const heroPath = path.join(
  root,
  'src',
  'assets',
  'hero',
  'Section-Hero_-Modified-to-be-full-bleed_opti.webp'
);
const publicDir = path.join(root, 'public');

fs.mkdirSync(publicDir, { recursive: true });

/* ------------------------------------------------------------------ */
/* 1. Extraction de l'icône (PNG embarqué dans le SVG du logo)         */
/* ------------------------------------------------------------------ */
const svg = fs.readFileSync(logoSvgPath, 'utf8');
const match = svg.match(/xlink:href="data:image\/png;base64,([^"]+)"/);

if (!match) throw new Error("Icône introuvable dans LFDV-icone-et-nom.svg");

const iconBuffer = Buffer.from(match[1], 'base64');
const iconPath = path.join(root, '.tmp-assets', 'fdlv-icon.png');
fs.mkdirSync(path.dirname(iconPath), { recursive: true });
fs.writeFileSync(iconPath, iconBuffer);

const iconMeta = await sharp(iconBuffer).metadata();
console.log('icône:', iconMeta.width, 'x', iconMeta.height);

/* Icône détourée sur fond transparent, Carrée 512 (logo schema.org + apple-touch-icon) */
const mark = await sharp(iconBuffer)
  .resize({ width: 400, height: 400, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const logoPng = await sharp({
  create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 99, b: 128, alpha: 1 } },
})
  .composite([{ input: mark, gravity: 'center' }])
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(path.join(publicDir, 'logo.png'), logoPng);
console.log('→ public/logo.png');

/* ------------------------------------------------------------------ */
/* 2. Favicon SVG (marque + fond DA)                                   */
/* ------------------------------------------------------------------ */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#006380"/>
  <image x="6" y="6" width="52" height="52" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${match[1]}"/>
</svg>
`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), favicon, 'utf8');
console.log('→ public/favicon.svg');

/* ------------------------------------------------------------------ */
/* 3. Image Open Graph 1200×630                                         */
/* ------------------------------------------------------------------ */
const heroMeta = await sharp(heroPath).metadata();
console.log('hero:', heroMeta.width, 'x', heroMeta.height);

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#006380" stop-opacity="0.94"/>
      <stop offset="52%" stop-color="#1375a2" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="#29b0e6" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <circle cx="1060" cy="120" r="190" fill="#ff8a00" opacity="0.22"/>
  <circle cx="150" cy="560" r="150" fill="#cc3366" opacity="0.18"/>
</svg>
`;

const titleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <g font-family="Poppins, Arial, Helvetica, sans-serif" fill="#ffffff">
    <text x="80" y="300" font-size="26" font-weight="600" letter-spacing="7" opacity="0.9">LA FÊTE DE LA VIE</text>
    <text x="80" y="380" font-size="62" font-weight="700">Prévention santé,</text>
    <text x="80" y="452" font-size="62" font-weight="700">bien-être autrement</text>
    <text x="80" y="520" font-size="28" font-weight="400" opacity="0.92">Des forums santé-addictions festifs, ludiques et participatifs.</text>
  </g>
  <rect x="80" y="212" width="86" height="6" rx="3" fill="#ff8a00"/>
</svg>
`;

const ogBuffer = await sharp(heroPath)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([
    { input: Buffer.from(overlay), top: 0, left: 0 },
    { input: Buffer.from(titleSvg), top: 0, left: 0 },
  ])
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toBuffer();

fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogBuffer);
console.log('→ public/og-image.jpg');
