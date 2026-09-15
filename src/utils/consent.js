/**
 * utils/consent.js — Gestion du consentement cookies (client-side)
 * Reference : TECHNICAL_ARCHITECTURE.md §10, UX.md §4.7, ADR-007/008, D-LG-05
 *
 * Le cookie banner n'apparait QUE si `third_party` est non vide dans la config.
 * Le choix est stocke en localStorage (pas de cookie) pendant 6 mois.
 * Les scripts tiers ne se chargent qu'apres consentement explicite.
 */

const STORAGE_KEY = 'ds_consent';
const EXPIRY_MONTHS = 6;

/**
 * @typedef {object} ConsentData
 * @property {boolean} necessary - toujours true
 * @property {boolean} analytics - mesure d'audience
 * @property {boolean} maps - cartes Google (si active)
 * @property {boolean} timestamp - date du consentement (ms)
 */

/**
 * Recuperer le consentement stocke (ou null si inexpir/expirant).
 * @returns {ConsentData|null}
 */
export function getConsent() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Verifier l'expiration (6 mois)
    if (data?.timestamp) {
      const age = Date.now() - data.timestamp;
      if (age > EXPIRY_MONTHS * 30 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Verifier si l'utilisateur a donne son consentement.
 * @returns {boolean}
 */
export function hasConsented() {
  return getConsent() !== null;
}

/**
 * Enregistrer les choix de consentement.
 * @param {object} categories - { analytics: boolean, maps: boolean }
 */
export function setConsent(categories) {
  if (typeof window === 'undefined') return;
  const data = {
    necessary: true,
    analytics: !!categories.analytics,
    maps: !!categories.maps,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
  // Notifier les composants
  try {
    window.dispatchEvent(new CustomEvent('ds-consent-updated', { detail: data }));
  } catch {}
}

/**
 * Supprimer le consentement (reinitialiser).
 */
export function removeConsent() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('ds-consent-updated', { detail: null }));
  } catch {}
}

/**
 * Verifier si un type de cookie est autorise.
 * @param {'analytics'|'maps'} category
 * @returns {boolean}
 */
export function isAllowed(category) {
  const consent = getConsent();
  if (!consent) return false;
  return consent[category] === true;
}