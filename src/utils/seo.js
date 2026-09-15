/**
 * utils/seo.js — Utilitaires SEO : metadata, balises meta, Open Graph, robots.
 * Reference : project/content/SEO_SYSTEM.md §4-5, TECHNICAL_ARCHITECTURE.md §7
 */

/**
 * Genere les patterns de title par page (SEO_SYSTEM.md §4.1).
 * @param {object} pageData - data.texts[currentPage]
 * @param {object} clientData - data.client
 * @returns {string} title tronque a 60 car. max
 */
export function buildTitle(pageData, clientData) {
  const raw = pageData?.title || '';
  // Remplacer les placeholders simples [Nom] etc. dans le pattern
  const filled = raw
    .replace(/\[Nom\]/g, clientData?.business?.name || '')
    .replace(/\[Activite\]/g, clientData?.seo?.activityLabel || '')
    .replace(/\[Ville\]/g, clientData?.seo?.city || '');
  // Tronquer a 60 car. (SEO_SYSTEM.md §4.1)
  return filled.length > 60 ? filled.slice(0, 57) + '...' : filled;
}

/**
 * Genere la meta description depuis les données page ou le pattern par defaut.
 * @param {object} pageData
 * @param {object} clientData
 * @returns {string} 120-160 car.
 */
export function buildDescription(pageData, clientData) {
  const raw = pageData?.description || clientData?.seo?.meta_description || '';
  const filled = raw
    .replace(/\[Nom\]/g, clientData?.business?.name || '')
    .replace(/\[Ville\]/g, clientData?.seo?.city || '')
    .replace(/\[Activite\]/g, clientData?.seo?.activityLabel || '');
  return filled.length > 160 ? filled.slice(0, 157) + '...' : filled;
}

/**
 * Construit l'URL canonique.
 * @param {string} siteUrl - ex: https://exemple-restaurant.demo
 * @param {string} path - ex: /menu
 * @param {string} lang - 'fr' ou 'en'
 * @returns {string}
 */
export function buildCanonical(siteUrl, path, lang = 'fr') {
  const base = siteUrl.replace(/\/+$/, '');
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en' && !cleanPath.startsWith('/en/')) {
    cleanPath = `/en${cleanPath}`;
  }
  // Pas de trailing slash (SEO_SYSTEM.md §4.3)
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }
  return `${base}${cleanPath}`;
}

/**
 * Retourne les balises hreflang pour une page donnee.
 * @param {string} siteUrl
 * @param {string} frPath - chemin FR
 * @param {string|null} enPath - chemin EN (null si pas traduit)
 * @returns {Array<{hreflang:string, href:string}>}
 */
export function buildHreflang(siteUrl, frPath, enPath = null) {
  const items = [
    { hreflang: 'fr', href: buildCanonical(siteUrl, frPath, 'fr') },
    { hreflang: 'x-default', href: buildCanonical(siteUrl, frPath, 'fr') },
  ];
  if (enPath) {
    items.push({ hreflang: 'en', href: buildCanonical(siteUrl, enPath, 'en') });
  }
  return items;
}

/**
 * Retourne les balises robots pour une page.
 * @param {string} pageSlug
 * @returns {string} 'index,follow' ou 'noindex,nofollow'
 */
export function buildRobots(pageSlug) {
  const noIndex = ['404', '500', 'construction', 'confirmation'];
  return noIndex.includes(pageSlug) ? 'noindex,nofollow' : 'index,follow';
}

/**
 * Genere les metadonnees Open Graph (SEO_SYSTEM.md §5.1).
 */
export function buildOG({ title, description, imageUrl, pageUrl, siteName, locale = 'fr_FR' }) {
  return {
    'og:title': title || '',
    'og:description': description || '',
    'og:image': imageUrl || '',
    'og:type': 'website',
    'og:url': pageUrl || '',
    'og:locale': locale,
    'og:site_name': siteName || '',
  };
}

/**
 * Genere les Twitter Cards (SEO_SYSTEM.md §5.2).
 */
export function buildTwitter({ title, description, imageUrl }) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title || '',
    'twitter:description': description || '',
    'twitter:image': imageUrl || '',
  };
}