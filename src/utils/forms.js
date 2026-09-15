/**
 * utils/forms.js — Validation cote client et helpers pour formulaires
 * Reference : UX.md §4.4 (erreurs), §4.5 (confirmation), TECHNICAL_ARCHITECTURE.md §8
 */

/** Regles de validation (CLIENT_DATA_VALIDATION.md §3.2) */
const VALIDATORS = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => /^0[1-9]([ .-]?\d{2}){4}$/.test(v),
  text: (v) => typeof v === 'string' && v.trim().length >= 2,
  required: (v) => typeof v === 'string' && v.trim().length > 0,
};

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