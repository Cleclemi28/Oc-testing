import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const srcDir = path.join(root, 'src', 'assets', 'banners');
const outDir = path.join(root, 'src', 'assets', 'gallery');

fs.mkdirSync(outDir, { recursive: true });

/* Les 49 bannières mises en avant dans la galerie horizontale. */
const FEATURED = [
  'sport.webp',
  'Gestes-et-postures.webp',
  'Mini-Gym.webp',
  'parcours-sante.webp',
  'Tester-votre-souffle.webp',
  'Danse.webp',
  'Tombola.webp',
  'Scultures-de-ballons.webp',
  'Remue-meninges.webp',
  'dopaminepartybanniere.webp',
  'Place-publique.webp',
  '1_surendettement_2.webp',
  '3_Drogue_2.webp',
  '4_auto_alcool_2.webp',
  '6_chronophage_2.webp',
  '5_il-est-des-notres_2.webp',
  'cannabis.webp',
  'Info-intox.webp',
  'Velo-smoothie.webp',
  'Vitamine-HD.webp',
  'Nutrissimo.webp',
  'Cocktail.webp',
  'Identite-Numerique.webp',
  'Technoference.webp',
  'Digital-Box.webp',
  'Maitrise-banner.webp',
  'Cyber-Harcelement-800x2000-1.webp',
  'Atelier-Bien-etre.webp',
  'Emotions.webp',
  'EstimeDeSoi_Rollup-general.webp',
  'le-poids-des-mots.webp',
  'Le-puzzle-du-sommeil.webp',
  'sommeil.webp',
  'banniere_1er_secours.webp',
  'Attention-danger-.webp',
  'risques_domestiques2.webp',
  'attention_les_oreilles.webp',
  'Au-coeur-de-la-fumee.webp',
  'compost.webp',
  'eco_responsable.webp',
  'Repair-cafe.webp',
  'Troc-de-graines.webp',
  'zero_dechet.webp',
  'bonne_dents.webp',
  'Cancer.webp',
  'Coeur.webp',
  'dondorganes.webp',
  'discrimanation5.webp',
  'Les-langages-de-lamour-copie.webp',
];

const WIDTHS = [360, 600];

let before = 0;
let after = 0;

for (const file of FEATURED) {
  const input = path.join(srcDir, file);
  if (!fs.existsSync(input)) throw new Error(`Source absente : ${file}`);

  const base = file.replace(/\.[^.]+$/, '');
  before += fs.statSync(input).size;

  for (const width of WIDTHS) {
    const output = path.join(outDir, `${base}-${width}.webp`);
    const buffer = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 68, effort: 6 })
      .toBuffer();
    fs.writeFileSync(output, buffer);
    after += buffer.length;
  }
}

console.log(`Source  : ${(before / 1024).toFixed(0)} Ko`);
console.log(`Optimisé: ${(after / 1024).toFixed(0)} Ko (${WIDTHS.length} versions x ${FEATURED.length})`);
console.log(
  `Par bannière (moyenne) : ${(after / FEATURED.length / WIDTHS.length / 1024).toFixed(0)} Ko`
);
