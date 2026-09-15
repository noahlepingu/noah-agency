/**
 * utils/forms.js — Validation cote client et helpers pour formulaires
 * Reference : UX.md §4.4 (erreurs), §4.5 (confirmation),
 *             TECHNICAL_ARCHITECTURE.md §8, project/backend/FORMS_ARCHITECTURE.md
 *
 * Fonctions PURES (testables en node:test) : les composants Astro les
 * importent et re-utilisent la memes regex que la validation serveur/CLI
 * (scripts/validation-core.mjs FORMATS).
 */

/** Regex de reference (meme source que validation-core.mjs §3.2) */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_FR_RE = /^0[1-9]([ .-]?\d{2}){4}$/;
export const PHONE_INTL_RE = /^\+[1-9]\d{1,14}$/;

/** Regles de validation (CLIENT_DATA_VALIDATION.md §3.2) */
const VALIDATORS = {
  email: (v) => EMAIL_RE.test(v),
  phone: (v) => PHONE_FR_RE.test(v),
  text: (v) => typeof v === 'string' && v.trim().length >= 2,
  required: (v) => typeof v === 'string' && v.trim().length > 0,
};

/** Email valide ? (pure) */
export function isValidEmail(v) {
  return typeof v === 'string' && EMAIL_RE.test(v.trim());
}

/** Telephone francais valide ? (pure) */
export function isValidPhoneFr(v) {
  return typeof v === 'string' && PHONE_FR_RE.test(v.trim());
}

/** Telephone international valide ? (pure) */
export function isValidPhoneIntl(v) {
  return typeof v === 'string' && PHONE_INTL_RE.test(v.replace(/[\s.-]/g, ''));
}

/**
 * Valide un champ individuel.
 * @param {string} name - nom du champ
 * @param {string} value - valeur saisie
 * @param {object} rules - { type: 'email'|'phone'|'text'|'required', message: string, required?: boolean }
 * @returns {string|null} message d'erreur ou null si valide
 */
export function validateField(name, value, rules = {}) {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (rules.required && trimmed.length === 0) {
    return rules.message || `Veuillez renseigner ${name}.`;
  }

  if (!rules.required && trimmed.length === 0) {
    return null; // champ optionnel vide = OK
  }

  if (rules.type && VALIDATORS[rules.type]) {
    if (!VALIDATORS[rules.type](trimmed)) {
      return rules.message || `Valeur invalide pour ${name}.`;
    }
  }

  return null;
}

/**
 * Valide un formulaire complet.
 * @param {object} values - { fieldName: value }
 * @param {object} schema - { fieldName: { type, message, required } }
 * @returns {{ valid: boolean, errors: { [field]: message }, errorCount: number }}
 */
export function validateForm(values, schema) {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(field, values[field] || '', rules);
    if (error) errors[field] = error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    errorCount: Object.keys(errors).length,
  };
}

/**
 * Verifie le honeypot (anti-spam, TECHNICAL_ARCHITECTURE.md §8.1).
 * Le champ honeypot doit etre vide.
 */
export function checkHoneypot(value) {
  return !value || value.trim().length === 0;
}

/**
 * Charge les scripts tiers apres consentement (consent.js).
 */
export function loadConsentedScripts(categories) {
  if (!categories || typeof window === 'undefined') return;
  try {
    const event = new CustomEvent('ds-consent', { detail: categories });
    window.dispatchEvent(event);
  } catch {}
}

/* ---------------------------------------------------------------- */
/* Endpoint + envoi (FORMS_ARCHITECTURE.md §3)                       */
/* ---------------------------------------------------------------- */

/**
 * Construit la cible d'envoi d'un formulaire.
 * - endpoint configure (Formspree / Web3Forms) -> kind "http"
 * - sinon fallback mailto (aucun backend, budget 0) -> kind "mailto"
 * @param {{ endpoint?: string, email?: string }} cfg
 * @returns {{ kind: 'http'|'mailto'|'none', url: string }}
 */
export function buildFormEndpoint({ endpoint = '', email = '' } = {}) {
  const ep = typeof endpoint === 'string' ? endpoint.trim() : '';
  if (/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(ep)) return { kind: 'http', url: ep };
  if (isValidEmail(email)) return { kind: 'mailto', url: `mailto:${email}` };
  return { kind: 'none', url: '' };
}

/**
 * Envoi du formulaire selon la cible.
 * - http : POST urlencoded (accept) vers l'endpoint tiers.
 * - mailto : build de l'URI mailto (ouverture du client mail).
 * - none : impossible (aucun endpoint, aucun email) -> retourne false.
 * Nb : pas de fetch possible vers mailto ; l'envoi est une navigation.
 */
export async function submitForm({ endpoint = '', email = '', data = {}, formData = null } = {}) {
  const { kind, url } = buildFormEndpoint({ endpoint, email });
  if (kind === 'none') return false;

  if (kind === 'mailto') {
    const subject = encodeURIComponent(String(data.subject || 'Formulaire du site'));
    const body = encodeURIComponent(String(data.body || ''));
    window.location.href = `${url}?subject=${subject}&body=${body}`;
    return true;
  }

  const body = formData instanceof FormData
    ? formData
    : new URLSearchParams(Object.entries(data).filter(([, v]) => v != null)).toString();
  const res = await fetch(url, {
    method: 'POST',
    body,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}