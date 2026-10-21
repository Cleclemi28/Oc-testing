// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique + préfixe de déploiement.
// Défaut : URL GitHub Pages du repo. Passer PUBLIC_SITE_URL / BASE_PATH à "" / "/"
// une fois le domaine demo.lafetedelavie.fr branché (fichier CNAME à la racine).
const site = process.env.PUBLIC_SITE_URL ?? 'https://cleclemi28.github.io/Oc-testing';
const base = process.env.BASE_PATH ?? '/Oc-testing';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  image: {
    // Astro's sharp pipeline emits AVIF/WebP variants from the sources in src/assets.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  integrations: [
    sitemap({
      // On garde la forme canonique (pas de barre oblique finale) et on
      // écarte les pages d'erreur.
      filter: (page) => !page.includes('/404') && !page.endsWith(`${base}/`),
    }),
  ],
});
