# La Fête de la Vie — démo de la home page

Refonte de la page d'accueil de [lafetedelavie.fr](https://lafetedelavie.fr) :
démo statique **Astro 5 + GSAP**, sans WordPress, publiée sur GitHub Pages.

> Périmètre : **la home page uniquement**. Les autres pages du site restent
> sur le WordPress de production (les liens secondaires y pointent).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:4321/Oc-testing/
npm run build      # génère dist/
npm run preview    # sert dist/
```

## Ce qui est dans la démo

| Section | Effet |
| --- | --- |
| Intro | Superposition d'ouverture animée en CSS, logo en silhouette, voile qui sort |
| Hero | Aurore (halos animés), halo qui suit le curseur, travelling lent, titre découpé en lignes |
| Partenaires | Deux bandeaux de logos en défilement continu (directions opposées) |
| Manifeste | Titre en lignes masquées + mots qui s'allument au scroll |
| Piliers | Cartes empilées (sticky) qui se posent en cascade, inclinaison 3D au survol |
| Bandeau | Typographie géante pilotée par le scroll |
| Bannières | Galerie horizontale épinglée avec profondeur 3D, chargement progressif, barre de progression |
| Étapes | Rail vertical qui s'illumine au scroll |
| Intervenants | Cascade de cartes en 3D |
| Chiffres | Compteurs animés |
| Témoignages | Carrousel accessible (boutons + clavier) |
| Contact | Formulaire avec pot à miel (anti-spam, sans reCAPTCHA) |

En plus : curseur personnalisé (desktop), barre de progression de lecture,
révélations au scroll, `prefers-reduced-motion` respecté.

## Performance

- Page initiale : **≈ 175 Ko compressés**, 23 requêtes.
- Aucune requête vers un tiers (polices auto-hébergées, pas de Google Fonts).
- Images : AVIF/WebP avec `srcset`/`sizes`, chargement progressif dans la galerie.

## SEO / accessibilité / RGPD

- Un seul H1, JSON-LD `NGO`, Open Graph complet, Twitter Card,
  `sitemap.xml`, `robots.txt` (ClaudeBot / AhrefsBot / Amazonbot bloqués),
  URL canonique.
- Navigation clavier, `aria-label`, dimensions explicites, contrastes vérifiés.
- `prefers-reduced-motion` coupe toutes les animations.

## Déploiement

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
build le site et le publie sur GitHub Pages à chaque push sur `main`.

- **URL par défaut** : `https://cleclemi28.github.io/Oc-testing`
  (elle est déduite automatiquement par le workflow).
- **Domaine personnalisé** : définir la variable de dépôt `CUSTOM_DOMAIN`
  (`demo.lafetedelavie.fr`) — le workflow ajoute alors le `CNAME` et bascule
  les URL canoniques sur `https://demo.lafetedelavie.fr`.

Variables d'environnement utilisées au build :

| Variable | Défaut | Rôle |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `https://cleclemi28.github.io/Oc-testing` | URL canonique, sitemap, OG |
| `BASE_PATH` | `/Oc-testing` | Préfixe des fichiers générés |

## Scripts

| Script | Rôle |
| --- | --- |
| `scripts/make-brand-assets.mjs` | Favicon, logo, image OG |
| `scripts/make-gallery-images.mjs` | Variantes 360 / 600 px des bannières |
| `scripts/gen-banner-assets.mjs` | Génère `src/data/banner-assets.ts` (imports explicites des 22 bannières de la galerie) |
