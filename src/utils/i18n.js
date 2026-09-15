/**
 * utils/i18n.js — Utilitaires pour la gestion de la langue
 * Reference : project/architecture/TECHNICAL_ARCHITECTURE.md §9, ADR-004
 */

/**
 * Charge les UI strings pour une langue donnee.
 * @param {string} lang - 'fr' ou 'en'
 * @param {object} translations - { fr: {...}, en: {...} }
 * @returns {object}
 */
export function getUI(lang, translations) {
  return translations[lang] || translations.fr || {};
}

/**
 * Resolve un chemin de page en retirant le prefixe /en/ si present.
 * @param {string} pathname
 * @returns {string} chemin FR equivalent
 */
export function toFR(pathname) {
  if (!pathname) return '/';
  return pathname.replace(/^\/en(\/|$)/, '/');
}

/**
 * Construit l'equivalent EN d'un chemin FR.
 * @param {string} frPath
 * @returns {string}
 */
export function toEN(frPath) {
  if (!frPath || frPath === '/') return '/en/';
  if (frPath.startsWith('/en/')) return frPath;
  return `/en${frPath.startsWith('/') ? '' : '/'}${frPath}`;
}

/**
 * Determiner si une page est disponible en EN.
 * @param {string} pathname
 * @param {string[]} enPages - pages generées en EN (ex: ['/', '/contact'])
 */
export function isPageAvailableInLang(pathname, enPages) {
  const frPath = toFR(pathname);
  return enPages.some((p) => p === frPath || frPath.startsWith(p));
}

/**
 * Localise un chemin interne : prefixe /en seulement si la page
 * possede une version traduite, sinon conserve le lien FR (pas de 404).
 * @param {string} path
 * @param {'fr'|'en'} lang
 * @param {string[]} [translatedRoutes] - routes avec version EN (data.translated_routes)
 * @returns {string}
 */
export function localizePath(path, lang, translatedRoutes = []) {
  if (lang !== 'en') return path;
  if (translatedRoutes.includes(path)) return path === '/' ? '/en/' : `/en${path}`;
  return path;
}

/**
 * Traduire un chemin de navigation courant vers l'autre langue.
 * @param {string} currentPath
 * @param {string} currentLang
 * @returns {{ href: string, label: string }}
 */
export function getLanguageSwitchHref(currentPath, currentLang) {
  if (currentLang === 'en') {
    return { href: toFR(currentPath), label: 'Fran\u00e7ais' };
  }
  return { href: toEN(currentPath), label: 'English' };
}

/**
 * Detecter la langue actuelle depuis localStorage (client) ou defaut.
 * @returns {'fr'|'en'}
 */
export function detectLanguage() {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = localStorage.getItem('ds_lang');
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {}
  return 'fr';
}

/**
 * Sauvegarder le choix de langue dans localStorage.
 * @param {'fr'|'en'} lang
 */
export function saveLanguage(lang) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ds_lang', lang);
  } catch {}
}