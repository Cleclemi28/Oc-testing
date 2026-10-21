import type { APIRoute } from 'astro';

/**
 * robots.txt généré à la compilation : l'URL du sitemap suit `site`
 * (variable d'environnement PUBLIC_SITE_URL) et le préfixe `base`.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://cleclemi28.github.io/Oc-testing');
  const base = import.meta.env.BASE_URL.replace(/\/*$/, '/');
  const sitemap = new URL(`${base}sitemap-index.xml`, origin).href;

  const body = `User-agent: *
Disallow:

# Blocage du crawler d'IA ClaudeBot
User-agent: ClaudeBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: Amazonbot
Disallow: /

Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
