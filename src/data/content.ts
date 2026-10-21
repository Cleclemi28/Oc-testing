import { img } from './images';
import type { ImageMetadata } from 'astro';

/* ==========================================================================
   Les 4 piliers
   ========================================================================== */

export const pillars = [
  {
    title: 'Des événements clé en main',
    body: "Des forums santé complets, pensés avec vous et livrés prêts à ouvrir : nous prenons en charge l'ensemble du dispositif, du premier rendez-vous jusqu'au rangement de la salle.",
    accent: 'rose',
    badge: 'Background-4-rose.svg',
  },
  {
    title: 'Modulables et exportables',
    body: "Nous imaginons des solutions adaptables à votre structure, à votre public et facilement déployables quel que soit le terrain.",
    accent: 'cyan',
    badge: 'Background-1-1.svg',
  },
  {
    title: 'Entièrement piloté',
    body: "Nous pilotons l'organisation en fonction de vos attentes : mobilisation / communication / logistique… pour le bon fonctionnement de l'événement.",
    accent: 'orange',
    badge: 'Background-2.svg',
  },
  {
    title: 'Avec de nombreux outils',
    body: "Nous mettons à disposition notre catalogue d'outils et kakémonos sur mesure aux différents partenaires impliqués.",
    accent: 'green',
    badge: 'Background-3.svg',
  },
] as const;

export type Pillar = (typeof pillars)[number];

/* ==========================================================================
   Les 4 étapes
   ========================================================================== */

export const steps = [
  {
    number: '01',
    title: 'La Construction',
    body: "Le projet s'organise autour d'un rétroplanning construit à partir du jour J, avec des temps de coordination réguliers pour avancer efficacement à chaque étape.",
  },
  {
    number: '02',
    title: 'La Mobilisation',
    body: "Motivation et coordination des structures partenaires du territoire, ainsi que de nos bénévoles pour la tenue des stands.",
  },
  {
    number: '03',
    title: 'La Communication',
    body: "Création et impression des différents supports de l'événement : flyers, affiches, visuels réseaux sociaux…",
  },
  {
    number: '04',
    title: "L'organisation",
    body: "Le jour J, une coordination est mise en place pour l'installation des stands, un briefing des équipes avec rappel des rôles, objectifs et déroulé de la journée… jusqu'à la désinstallation et au rangement de la salle.",
  },
] as const;

/* ==========================================================================
   Chiffres clés
   ========================================================================== */

export const stats = [
  {
    value: 2011,
    suffix: '',
    label: 'Création du concept',
    body: "Date de la création du concept Fête de la Vie. De grands forums santé festifs et ludiques avec plus de 1000 participants.",
  },
  {
    value: 100,
    suffix: '+',
    label: 'Forums organisés',
    body: "Depuis 2011, ce sont plus d'une centaine de forums sur l'ensemble du territoire national, principalement sur les Hauts-de-France.",
  },
  {
    value: 60000,
    suffix: '',
    label: 'Participants',
    body: "Plusieurs dizaines de milliers de participants ont reçu près de deux heures d'informations santé à chaque passage.",
  },
] as const;

/* ==========================================================================
   Témoignages
   ========================================================================== */

export const testimonials = [
  {
    quote:
      "Je pense que ce genre de journée il faudrait en faire beaucoup plus souvent, car effectivement les gens sont sensibilisés. Avec l'étude du souffle, les gens sont très surpris de savoir que leur souffle va bien ou ne va pas bien. Ils peuvent le mesurer, et je pense que ça peut les aider à changer leurs habitudes.",
    name: 'Michèle Catto',
    role: 'Pneumologue Tabacologue, C.H.R.U. Lille',
  },
  {
    quote:
      "Très bon ressenti, c'est génial, c'est la fête. Il y a plein d'enfants. Les parents sont venus de tous les quartiers. C'est pouvoir parler des addictions, prévenir, faire des ces choses à ce sujet, dans une ambiance bon enfant, agréable et familiale. Et je suis persuadé que c'est la meilleure prévention qui existe.",
    name: 'Frédéric Kochman',
    role: 'Pédopsychiatre',
  },
  {
    quote:
      "Ces forums santé sont extrêmement riches d'atouts pour transmettre un savoir, des informations utiles pour être en bonne santé. A travers le jeu, la différenciation, chaque intervenant est bien formé en amont et compétent pour s'adapter à chaque personne du public. Trois mots d'ordre : ludique, participatif et très mobilisant pour repartir chez soi au moins avec un défi santé.",
    name: 'Richard Andrzejewski',
    role: 'Addictologue, CSAPA',
  },
] as const;

/* ==========================================================================
   Les intervenants
   ========================================================================== */

export const team = [
  {
    name: 'Animatrice',
    file: 'Animatrice_fond_F5E8C7-e1790319440830.webp',
    body: "Anime les ateliers et les temps festifs qui embarquent tout le public.",
  },
  {
    name: 'Éducateur',
    file: 'Educateur_fond_F5E8C7-e1790264656222.webp',
    body: 'Pédagogue, rend l’information santé lisible et immédiatement actionnable.',
  },
  {
    name: 'Infirmière',
    file: 'Infirmiere2-e1790320529723.webp',
    body: 'Réalise les ateliers santé, les mesures et les dépistages en direct.',
  },
  {
    name: 'Psychologue',
    file: 'Psychologue_fond_F5E8C7-e1790319496961.webp',
    body: 'Apporte une écoute sans jugement, entièrement orientée bien-être.',
  },
  {
    name: 'Sportif',
    file: 'Sportif_fond_F5E8C7-e1790319646737.webp',
    body: 'Transforme l’appropriation des bons réflexes en mouvement et en jeu.',
  },
  {
    name: 'Enseignant',
    file: 'Enseignant_fond_F5E8C7-e1790319553224.webp',
    body: 'Porte le message santé auprès des plus jeunes, en milieu scolaire.',
  },
  {
    name: 'Organisateur',
    file: 'Organisateur_fond_F5E8C7-e1790319597489.webp',
    body: 'Coordonne le terrain, les stands, les partenaires et le déroulé du jour J.',
  },
  {
    name: 'Bénévole',
    file: 'Benevole_fond_F5E8C7-e1790264348754.webp',
    body: 'Le cœur du collectif : énergie, accueil et transmission au quotidien.',
  },
] as const;

export const teamImages: Record<string, ImageMetadata> = Object.fromEntries(
  team.map((member) => [member.file, img(member.file)])
);

/* ==========================================================================
   Partenaires
   ========================================================================== */

export const partners = [
  { name: 'Hauts de France', file: 'image-5.png' },
  { name: 'Région Nord', file: 'image-7.png' },
  { name: 'Astek', file: 'image-8.png' },
  { name: 'Crédit Agricole', file: 'image-11.png' },
  { name: 'Kolabee', file: 'image-20.png' },
  { name: 'Santélys', file: 'image-21.png' },
  { name: 'Mild et CA', file: 'image-22.png' },
  { name: 'Croix Rouge', file: 'image-25.png' },
  { name: 'Prévention routière', file: 'image-64.png' },
  { name: 'République Française', file: 'image-9.png' },
  { name: 'CPAM', file: 'image-6.png' },
  { name: 'IP Lille', file: 'IP-Lille-e1789998071267.png' },
] as const;

export const partnerImages: Record<string, ImageMetadata> = Object.fromEntries(
  partners.map((partner) => [partner.file, img(partner.file)])
);

/* ==========================================================================
   Le collectif — portraits
   ========================================================================== */

export const portraits = [
  {
    name: 'Michel Cambrelin',
    role: 'Président de La Fête de la Vie',
    file: 'Michel-CAMBRELIN-e1790087579320.webp',
  },
  { name: 'Martin Caby', role: 'Fondateur du concept', file: 'Martin-CABY.webp' },
] as const;

export const portraitImages: Record<string, ImageMetadata> = Object.fromEntries(
  portraits.map((portrait) => [portrait.file, img(portrait.file)])
);
