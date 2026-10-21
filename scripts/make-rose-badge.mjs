/**
 * Crée la 4e pastille décorative de la DA (variante rose #CC3366)
 * à partir de Background-1-1.svg, pour garder exactement le même gabarit.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(ROOT, 'src/assets/decor/Background-1-1.svg');
const dest = path.join(ROOT, 'src/assets/decor/Background-4-rose.svg');

const svg = await fs.readFile(src, 'utf8');
const rose = svg.replace('#29B0E6', '#CC3366');
if (rose === svg) throw new Error('Couleur source introuvable dans Background-1-1.svg');
await fs.writeFile(dest, rose, 'utf8');
console.log('Écrit :', path.relative(ROOT, dest));
