/**
 * utils/days.mjs — Source unique de verite pour les jours
 * Remplace les doublons de DAY_MAP / DAY_TO_SCHEMA / DAY_NAMES
 * dans schema.js, hours.js, OpeningHours.astro, ReservationForm.astro.
 */

/** Jours en francais, index = new Date().getDay() (0=Dim) */
export const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/** Jours en francais, ordre lundi-dimanche (index 0-6) */
export const DAY_ORDER_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/** Mapping francais -> schema.org dayOfWeek */
export const FR_TO_SCHEMA = {
  Lundi: 'Monday',
  Mardi: 'Tuesday',
  Mercredi: 'Wednesday',
  Jeudi: 'Thursday',
  Vendredi: 'Friday',
  Samedi: 'Saturday',
  Dimanche: 'Sunday',
};

/** Mapping schema.org dayOfWeek -> francais */
export const SCHEMA_TO_FR = Object.fromEntries(
  Object.entries(FR_TO_SCHEMA).map(([k, v]) => [v, k])
);

/**
 * Nom du jour en francais pour une date ISO (YYYY-MM-DD).
 * @param {string} dateStr - "2026-09-15"
 * @returns {string|null} - "Lundi" | "Mardi" | ... ou null si invalide
 */
export function getDayName(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return DAY_NAMES[d.getDay()];
}

/**
 * Index du jour lundi=0 pour une date ISO.
 * @param {string} dateStr - "2026-09-15"
 * @returns {number|null} - 0 (lundi) a 6 (dimanche) ou null
 */
export function getDayIndex(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const jsDay = d.getDay(); // 0=Dim
  return (jsDay + 6) % 7;   // 0=Lun, 6=Dim
}

/**
 * Index du jour actuel (lundi=0 a dimanche=6).
 * A utiliser UNIQUEMENT cote client.
 * @returns {number} 0-6
 */
export function todayIndex() {
  const jsDay = new Date().getDay();
  return (jsDay + 6) % 7;
}

/**
 * Nom du jour actuel en francais. Cote client uniquement.
 * @returns {string} "Lundi" | "Mardi" | ...
 */
export function todayName() {
  return DAY_ORDER_FR[todayIndex()];
}
