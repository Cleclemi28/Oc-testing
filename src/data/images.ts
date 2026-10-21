import type { ImageMetadata } from 'astro';

/**
 * Registre de toutes les images vectorielles / matricielles importables.
 * `import.meta.glob` donne les métadonnées (width/height) sans coût runtime.
 *
 * Les dossiers `banners/` (catalogue des 106 kakémonos) et `gallery/`
 * (variantes responsives) sont exclus : leurs images sont importées
 * explicitement là où elles servent, pour ne pas publier dans dist/
 * des fichiers qui ne sont jamais demandés.
 */
const glob = import.meta.glob<{ default: ImageMetadata }>(
  ['../assets/**/*.{webp,png,svg,jpg}', '!../assets/banners/**', '!../assets/gallery/**'],
  { eager: true }
);

const index = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(glob)) {
  const name = path.split('/').pop()!;
  index.set(name, mod.default);
}

/** Récupère une image par son nom de fichier dans src/assets. */
export function img(name: string): ImageMetadata {
  const found = index.get(name);
  if (!found) throw new Error(`Image introuvable dans src/assets : ${name}`);
  return found;
}

export function has(name: string): boolean {
  return index.has(name);
}

export const heroImage = img('Section-Hero_-Modified-to-be-full-bleed_opti.webp');
export const logoImage = img('LFDV-icone-et-nom.svg');
export const waveDivider = img('Vector.png');
export const badgeCyan = img('Background-1-1.svg');
export const badgeOrange = img('Background-2.svg');
export const badgeGreen = img('Background-3.svg');

export const marginDecor = [img('Margin.png'), img('Margin-1.png'), img('Margin-2.png')];
