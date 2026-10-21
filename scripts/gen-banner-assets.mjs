/**
 * Génère src/data/banner-assets.ts : les imports statiques des seules
 * bannières utilisées par la galerie d'accueil.
 *
 * Pourquoi un fichier généré ? Le catalogue complet (106 kakémonos) vit dans
 * src/assets/banners. Si on l'importe via import.meta.glob, Astro optimise et
 * publie les 106 images (≈ 8 Mo) alors que la home page n'en montre que 22.
 * Les imports explicites garantissent que seules les images réellement
 * utilisées arrivent dans dist/.
 *
 * Usage : node scripts/gen-banner-assets.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const galleryDir = join(root, 'src', 'assets', 'gallery');
const target = join(root, 'src', 'data', 'banner-assets.ts');

/** La sélection affichée par la galerie (à maintenir en sync avec banners.ts). */
const FEATURED = [
  'sport.webp',
  'Gestes-et-postures.webp',
  'Tester-votre-souffle.webp',
  'Danse.webp',
  'Tombola.webp',
  'Place-publique.webp',
  '1_surendettement_2.webp',
  '3_Drogue_2.webp',
  '4_auto_alcool_2.webp',
  'cannabis.webp',
  'Velo-smoothie.webp',
  'Nutrissimo.webp',
  'Identite-Numerique.webp',
  'Technoference.webp',
  'Atelier-Bien-etre.webp',
  'Le-puzzle-du-sommeil.webp',
  'banniere_1er_secours.webp',
  'bonne_dents.webp',
  'Coeur.webp',
  'compost.webp',
  'eco_responsable.webp',
  'Les-langages-de-lamour-copie.webp',
];

/** Transforme un nom de fichier en identifiant JS valide. */
const identifier = (name) =>
  name
    .replace(/\.webp$/, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(\d)/, 'n$1');

const imports = [];
const entries = [];

for (const file of FEATURED) {
  const base = file.replace(/\.[^.]+$/, '');
  const small = `${base}-360.webp`;
  const large = `${base}-600.webp`;

  for (const variant of [small, large]) {
    if (!existsSync(join(galleryDir, variant))) {
      throw new Error(`Fichier manquant : src/assets/gallery/${variant}`);
    }
  }

  const smallId = identifier(small);
  const largeId = identifier(large);

  imports.push(`import ${smallId} from '../assets/gallery/${small}';`);
  imports.push(`import ${largeId} from '../assets/gallery/${large}';`);
  entries.push(`  '${file}': { small: ${smallId}, large: ${largeId} },`);
}

const content = `/* Fichier généré par scripts/gen-banner-assets.mjs — ne pas éditer à la main. */
import type { ImageMetadata } from 'astro';

${imports.join('\n')}

/**
 * Versions responsives des bannières affichées dans la galerie d'accueil.
 * L'import étant explicite, seules ces images sont publiées dans dist/.
 */
export const bannerAssets: Record<string, { small: ImageMetadata; large: ImageMetadata }> = {
${entries.join('\n')}
};
`;

writeFileSync(target, content, 'utf8');
console.log(`✔ ${target} — ${FEATURED.length} bannières, ${imports.length} imports.`);
