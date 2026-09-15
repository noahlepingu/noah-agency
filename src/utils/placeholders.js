/**
 * utils/placeholders.js — Remplacement de placeholders [Nom], [Ville], etc.
 * Utilise par scripts/generate-site.mjs (cote Node) et par les composants
 * si besoin de remplacement dynamique (non recommande en statique).
 *
 * Reference : project/content/CLIENT_DATA_SCHEMA.md §6 (mapping placeholders),
 *             CONTENT_LIBRARY.md §1 (principe).
 */

/**
 * Mappe les placeholders attendus depuis les donnees client + config template.
 * Gere les variantes de casse ([Nom] / [nom]) et les aliases.
 */
export function buildPlaceholderMap(clientData, templateConfig) {
  if (!clientData || typeof clientData !== 'object') return {};

  const business = clientData.business || {};
  const seo = clientData.seo || {};
  const contact = clientData.contact || {};
  const legal = clientData.legal || {};
  const openingHours = clientData.opening_hours || {};
  const reservation = clientData.reservation || {};

  const categoryLabel =
    templateConfig?.activityLabel ||
    (typeof business.category === 'string'
      ? business.category.charAt(0).toUpperCase() + business.category.slice(1)
      : '');

  // Formatage heures resumes
  let horairesLabel = '';
  if (openingHours.enabled && openingHours.schedule && openingHours.schedule.length > 0) {
    const openDays = openingHours.schedule.filter((d) => !d.closed);
    if (openDays.length > 0) {
      const first = openDays[0]?.day || '';
      const last = openDays[openDays.length - 1]?.day || '';
      horairesLabel = `du ${first} au ${last}`;
    }
  }

  return {
    // Business
    'Nom': business.name || '',
    'nom': business.name || '',
    'Activite': categoryLabel,
    'activite': categoryLabel,
    'Description': business.description || '',
    'Description_courte': business.description || '',
    'Mission_courte': business.description || '',
    // SEO / Localisation
    'Ville': seo.city || '',
    'ville': seo.city || '',
    'Quartier': seo.district || '',
    'District': seo.district || '',
    'Zone': seo.zone || '',
    'Region': seo.region || '',
    'Pays': seo.country || 'FR',
    // Contact
    'Adresse': contact.address?.full || '',
    'Adresse_complete': contact.address?.full || '',
    'Telephone': contact.phone || '',
    'telephone': contact.phone || '',
    'Telephone_intl': contact.phone_intl || '',
    'Email': contact.email || '',
    'email': contact.email || '',
    // Coordonnees
    'Latitude': contact.map?.lat || '',
    'Longitude': contact.map?.lng || '',
    // Horaires
    'Horaires': horairesLabel,
    'Nombre': reservation.max_party_size || 8,
    // Legal
    'Nom_commercial': business.name || '',
    'Forme_juridique': legal.legal_form || '',
    'SIREN': legal.siren || '',
    'SIRET': legal.siret || '',
    'Nom_directeur': legal.director || '',
    'Nom_hebergeur': legal.host_name || '',
    'Adresse_hebergeur': legal.host_address || '',
    'Email_pro': legal.email_pro || '',
    'Telephone_pro': legal.phone_pro || '',
  };
}

/**
 * Remplace tous les placeholders [xxx] dans un texte par les valeurs
 * correspondantes du mapping. Les placeholders non trouves restent
 * en l'etat (visibles dans le rapport de validation, utile pour Noah).
 */
export function fillTemplate(text, placeholders) {
  if (typeof text !== 'string' || !text) return text;
  if (!placeholders || Object.keys(placeholders).length === 0) return text;

  // Remplacement iteratif (un seul niveau, pas d'imbrication)
  return text.replace(/\[([^\]]+)\]/g, (match, key) => {
    const trimmedKey = key.trim();
    const trimmedKeyLower = trimmedKey.toLowerCase();

    // Recherche exacte d'abord, puis case-insensitive
    if (placeholders[trimmedKey] !== undefined) return placeholders[trimmedKey];
    if (placeholders[trimmedKeyLower] !== undefined) return placeholders[trimmedKeyLower];

    // Pas trouve : on laisse le placeholder tel quel
    return match;
  });
}

/**
 * Parcourt recursivement un objet texte (sections JSON) et remplace
 * les placeholders dans toutes les valeurs string.
 */
export function fillTemplateObject(obj, placeholders) {
  if (!obj || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = fillTemplate(value, placeholders);
    } else if (value && typeof value === 'object') {
      result[key] = fillTemplateObject(value, placeholders);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Collecte les placeholders non resolus dans un texte (pour le rapport).
 * Retourne un tableau de { raw, key }.
 */
export function findUnresolvedPlaceholders(text, resolvedKeys) {
  if (typeof text !== 'string') return [];
  const results = [];
  const regex = /\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const key = match[1].trim();
    const value = resolvedKeys[key] || resolvedKeys[key.toLowerCase()];
    if (value === undefined || value === '') {
      results.push({ raw: match[0], key });
    }
  }
  return results;
}