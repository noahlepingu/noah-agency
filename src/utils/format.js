/**
 * utils/format.js — Formateurs d'affichage (prix, nombres)
 *
 * Norme typographique francaise : virgule decimale, espace avant €, deux
 * decimales — ex. « 9,50 € » / « 22,00 € ». Le formatage n'existe que a
 * l'AFFICHAGE : les donnees (data.json, client_data.yaml, JSON-LD
 * schema.org) restent des NOMBRES (price: 9.5, 22). Ne jamais ecrire
 * « €9.5 » dans un template.
 *
 * Reference : UX_REDESIGN_RESTAURANT.md §5.3 (prix Inter 600 tabular-nums),
 *             norme typographique FR (espace avant €, virgule decimale).
 */

/**
 * Formate un prix en euros, locale fr-FR.
 * @param {number|string} price - valeur numerique (nombre pur, pas de symbole)
 * @returns {string} ex. « 9,50 € » ; '' si non numerique
 */
export function formatPrice(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
}