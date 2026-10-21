/**
 * Métadonnées et liens du site.
 * Les 5 pages secondary ne sont pas migrées dans cette démo : on pointe
 * directement vers le WordPress de production.
 */
export const site = {
  name: 'La Fête de la Vie',
  legalName: 'La Fête de la Vie',
  tagline: "Faire de la prévention santé bien-être autrement",
  description:
    "La Fête de la Vie est une association engagée dans la prévention et la promotion de la santé, la sensibilisation aux addictions et le bien-être. Des forums santé festifs, ludiques et participatifs, clés en main, pour tous les publics.",
  url: 'https://lafetedelavie.fr',
  locale: 'fr_FR',
  lang: 'fr',
  founded: '2011',
  email: 'lafetedelavie@gmail.com',
  phone: '06 82 82 23 28',
  phoneHref: '+33682822328',
  address: {
    street: "62 rue de l'égalité",
    postalCode: '59290',
    city: 'Wasquehal',
    region: 'Hauts-de-France',
    country: 'FR',
  },
} as const;

export const nav = [
  { label: 'Accueil', href: 'https://lafetedelavie.fr/' },
  { label: "L'association", href: 'https://lafetedelavie.fr/association-la-fete-de-la-vie/' },
  { label: 'Organiser un forum', href: 'https://lafetedelavie.fr/organiser-un-forum/' },
  { label: "S'engager", href: 'https://lafetedelavie.fr/sengager-a-nos-cotes/' },
  { label: 'Les bannières', href: 'https://lafetedelavie.fr/bannieres/' },
] as const;

export const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/lafetedelavie/', icon: 'instagram' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/f%C3%AAte-de-la-vie/', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://www.youtube.com/@lafetedelavie-jouerpourdej1343', icon: 'youtube' },
] as const;

export const ctas = {
  organize: { label: 'Organiser un forum', href: 'https://lafetedelavie.fr/organiser-un-forum/' },
  intervene: { label: 'Devenir intervenant', href: 'https://lafetedelavie.fr/sengager-a-nos-cotes/' },
  association: {
    label: 'Découvrir notre association',
    href: 'https://lafetedelavie.fr/association-la-fete-de-la-vie/',
  },
  youtube: {
    label: 'Voir notre chaîne',
    href: 'https://www.youtube.com/@lafetedelavie-jouerpourdej1343',
  },
  join: { label: 'Rejoindre le collectif', href: 'https://lafetedelavie.fr/sengager-a-nos-cotes/' },
  banners: { label: 'Voir toutes les bannières', href: 'https://lafetedelavie.fr/bannieres/' },
  donate: {
    label: 'Faites un don',
    href: 'https://www.helloasso.com/associations/fete-de-la-vie/collectes/ensemble-offrons-un-cadeau-et-deux-heures-de-prevention-sante-2',
  },
} as const;

export const legalLinks = [
  { label: 'Mentions légales', href: 'https://lafetedelavie.fr/mentions-legales/' },
  { label: 'Politique de confidentialité', href: 'https://lafetedelavie.fr/politique-de-confidentialite/' },
  { label: 'Politique de cookies', href: 'https://lafetedelavie.fr/politique-de-cookies-ue/' },
] as const;
