/**
 * utils/reservation.js — Validation statique des creneaux de reservation
 * Reference : TECHNICAL_ARCHITECTURE.md §8.2 (reservation v1),
 *             UX.md §4.3 (etat « aucun creneau disponible »),
 *             CLIENT_DATA_SCHEMA.md §11 (reservation), C-05 (source de creneaux).
 *
 * Fonctions PURES (aucun acces DOM/global) : testables en node:test et
 * utilisables dans les composants Astro (islands) sans changement.
 *
 * Sources de creneaux :
 *  1. reservation.slots (ou time_slots) : liste explicite d'heures ;
 *     chaque slot doit tomber dans une plage d'ouverture du jour concerne.
 *  2. Sinon, generation depuis opening_hours.schedule du jour (pas de 30 min).
 * Si aucune des deux sources n'existe, la reservation affichera toujours
 * « aucun creneau » -> etat dedie (UX.md §4.3).
 */

/** Ordre des jours (index = new Date().getDay()) */
const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

/** Nom du jour (FR) pour une date ISO YYYY-MM-DD. */
export function getDayName(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return DAY_NAMES[d.getDay()];
}

/** Convertit "HH:MM" en minutes depuis minuit ; null si invalide. */
function toMinutes(hhmm) {
  if (typeof hhmm !== 'string') return null;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function toHHMM(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Vraie si dateStr tombe dans une periode de fermeture exceptionnelle.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {Array} closedPeriods - [{ start, end, reason? }]
 */
export function isClosedPeriod(dateStr, closedPeriods = []) {
  if (!Array.isArray(closedPeriods)) return false;
  return closedPeriods.some((p) => p && p.start && p.end && dateStr >= p.start && dateStr <= p.end);
}

/**
 * Creneaux d'ouverture (plages) pour un jour donne, depuis le schedule.
 * @param {string} dateStr
 * @param {Array} schedule - opening_hours.schedule
 * @returns {Array<{open:string, close:string}>}
 */
export function getDayOpenRanges(dateStr, schedule = []) {
  const dayName = getDayName(dateStr);
  if (!dayName) return [];
  return (schedule || [])
    .filter((s) => s && s.day === dayName && !s.closed && s.open && s.close)
    .map((s) => ({ open: s.open, close: s.close }));
}

/**
 * Un jour est-il ouvert ? (jour avec au moins une plage d'ouverture et
 * hors periode de fermeture exceptionnelle).
 * @param {string} dateStr - YYYY-MM-DD
 * @param {object} config - { schedule, closedPeriods }
 */
export function isDayOpen(dateStr, { schedule = [], closedPeriods = [] } = {}) {
  if (isClosedPeriod(dateStr, closedPeriods)) return false;
  return getDayOpenRanges(dateStr, schedule).length > 0;
}

/**
 * Liste complete des creneaux valides pour une date donnee.
 * @param {string} dateStr - YYYY-MM-DD
 * @param {object} config - { schedule, closedPeriods, slots, stepMinutes }
 * @returns {{ slots: string[], closed: boolean, reason: string|null }}
 *   - closed: true si le jour est ferme (ou pas de source de creneaux).
 *   - slots: liste triee d'heures "HH:MM" valides pour ce jour.
 */
export function getSlotsForDate(dateStr, { schedule = [], closedPeriods = [], slots = [], stepMinutes = 30 } = {}) {
  // 1. Periode de fermeture exceptionnelle
  if (isClosedPeriod(dateStr, closedPeriods)) {
    return { slots: [], closed: true, reason: 'closed_period' };
  }

  // 2. Jour sans plage d'ouverture
  const ranges = getDayOpenRanges(dateStr, schedule);
  if (ranges.length === 0) {
    return { slots: [], closed: true, reason: 'day_closed' };
  }

  // 3. Filtre des slots explicites dans les plages d'ouverture du jour
  const explicitSlots = Array.isArray(slots) ? slots.map((s) => String(s)).filter(Boolean) : [];
  let resultSlots;
  if (explicitSlots.length > 0) {
    resultSlots = [...new Set(explicitSlots)]
      .filter((slot) => {
        const min = toMinutes(slot);
        if (min == null) return false;
        return ranges.some((r) => {
          const open = toMinutes(r.open);
          const close = toMinutes(r.close);
          return open != null && close != null && min >= open && min < close;
        });
      })
      .sort();
  } else {
    // 4. Generation depuis les plages d'ouverture (pas fixe stepMinutes)
    const set = new Set();
    for (const r of ranges) {
      const open = toMinutes(r.open);
      const close = toMinutes(r.close);
      if (open == null || close == null || close <= open) continue;
      for (let m = open; m < close; m += stepMinutes) {
        set.add(toHHMM(m));
      }
    }
    resultSlots = [...set].sort();
  }

  return {
    slots: resultSlots,
    closed: resultSlots.length === 0,
    reason: resultSlots.length === 0 ? 'no_slot' : null,
  };
}

/**
 * La reservation peut-elle proposer au moins un creneau un jour donne ?
 * (equivalent C-05 : ni slots ni schedule -> « aucun creneau » systematique)
 * @param {object} config - { schedule, slots }
 */
export function hasAnySlotSource({ schedule = [], slots = [] } = {}) {
  const hasSchedule = Array.isArray(schedule) && schedule.some((s) => s && !s.closed && s.open && s.close);
  const hasSlots = Array.isArray(slots) && slots.length > 0;
  return hasSchedule || hasSlots;
}

/**
 * Premiere date disponible a partir de `from` (inclus) avec au moins un
 * creneau, dans les 30 prochains jours, ou null.
 * @param {object} config
 * @param {string} [from] - YYYY-MM-DD (defaut : aujourd'hui)
 * @returns {string|null}
 */
export function findNextAvailableDate({ schedule = [], closedPeriods = [], slots = [], stepMinutes = 30 } = {}, from) {
  const start = from ? new Date(`${from}T00:00:00`) : new Date();
  if (Number.isNaN(start.getTime())) return null;
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    if (d.getDay() === 0) continue; // Dimanche jamais genere (exemple) -> reste general
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const { slots: daySlots } = getSlotsForDate(iso, { schedule, closedPeriods, slots, stepMinutes });
    if (daySlots.length > 0) return iso;
  }
  return null;
}