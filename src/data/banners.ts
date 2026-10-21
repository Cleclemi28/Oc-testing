import raw from './banners.json';
import { bannerAssets } from './banner-assets';

export interface BannerMeta {
  /** Nom de fichier source dans src/assets/banners */
  file: string;
  /** Libellé lisible (dérivé de l'alt de la médiathèque) */
  label: string;
}

export interface Banner extends BannerMeta {
  /** URL publique (générée par Astro, base incluse) */
  src: string;
  /** Set de sources responsives (galerie uniquement) */
  srcSet?: string;
  width: number;
  height: number;
}

/**
 * Catalogue des bannières publiées sur /bannieres/ (106 kakémonos).
 * Les fichiers X- / Xbanner (brouillons) sont exclus par le script de collecte.
 *
 * On ne conserve ici que les métadonnées : les images du catalogue complet ne
 * sont pas importées (elles quadrupleraient le poids du build alors que la
 * home page n'en affiche que 22 — voir src/data/banner-assets.ts).
 */
export const banners: BannerMeta[] = (raw as { alt: string; file: string }[])
  .map((entry) => ({
    file: entry.file,
    label: entry.alt,
  }))
  .sort((a, b) => a.file.localeCompare(b.file, 'fr'));

/**
 * Sélection affichée dans la galerie horizontale épinglée.
 * Le catalogue complet (106 kakémonos) reste accessible via /bannieres/.
 * L'ordre suit une progression thématique : mouvement → festive → addictions →
 * nutrition → écrans → bien-être → risques → environnement → santé → lien social.
 *
 * On limite la sélection à 22 kakémonos : au-delà, le rail horizontal devient
 * trop long et la page défile de plusieurs dizaines de milliers de pixels.
 */
const FEATURED = [
  // Mouvement & gestes
  'sport.webp',
  'Gestes-et-postures.webp',
  'Tester-votre-souffle.webp',
  // Festif
  'Danse.webp',
  'Tombola.webp',
  'Place-publique.webp',
  // Addictions
  '1_surendettement_2.webp',
  '3_Drogue_2.webp',
  '4_auto_alcool_2.webp',
  'cannabis.webp',
  // Alimentation
  'Velo-smoothie.webp',
  'Nutrissimo.webp',
  // Écrans & numérique
  'Identite-Numerique.webp',
  'Technoference.webp',
  // Bien-être
  'Atelier-Bien-etre.webp',
  'Le-puzzle-du-sommeil.webp',
  // Santé & prévention
  'banniere_1er_secours.webp',
  'bonne_dents.webp',
  'Coeur.webp',
  // Environnement
  'compost.webp',
  'eco_responsable.webp',
  // Lien social
  'Les-langages-de-lamour-copie.webp',
] as const;

const byFile = new Map(banners.map((banner) => [banner.file, banner]));

/**
 * Sélection de bannières affichée dans la galerie épinglée.
 * Les images sont servies en versions allégées (360 / 600 px de large),
 * largement suffisantes pour une carte de 215 px de large.
 */
export const featuredBanners: Banner[] = FEATURED.map((file) => {
  const meta = byFile.get(file);
  if (!meta) throw new Error(`Bannière absente du catalogue : ${file}`);

  const assets = bannerAssets[file];
  if (!assets) throw new Error(`Bannière absente des assets : ${file}`);

  return {
    ...meta,
    src: assets.large.src,
    srcSet: `${assets.small.src} 360w, ${assets.large.src} 600w`,
    width: assets.large.width,
    height: assets.large.height,
  };
});
