/**
 * utils/hours.js — Utilitaires pour les horaires d'ouverture
 * Reference : CLIENT_DATA_SCHEMA.md §3 (opening_hours.schedule, closed_periods),
 *             UX.md §4.12 (OpeningHours), DESIGN_SYSTEM_SPECS §5.12
 */
import { FR_TO_SCHEMA, DAY_ORDER_FR, DAY_NAMES } from './days.mjs';

/**
 * Formatte le tableau de schedule en texte synthetique (HTML ou texte brut).
 * Ex: "du Mardi au Samedi, 11h30-14h30 / 18h30-23h00"
 */
export function formatSchedule(schedule) {
  if (!schedule || schedule.length === 0) return '';

  // Regrouper par jour
  const byDay = {};
  for (const entry of schedule) {
    if (entry.closed) continue;
    const day = entry.day;
    if (!byDay[day]) byDay[day] = [];
    if (entry.open && entry.close) {
      byDay[day].push(`${entry.open}-${entry.close}`);
    }
  }

  const openDays = Object.keys(byDay);
  if (openDays.length === 0) return '';

  const firstIdx = DAY_ORDER_FR.indexOf(openDays[0]);
  const lastIdx = DAY_ORDER_FR.indexOf(openDays[openDays.length - 1]);
  const rangeLabel =
    firstIdx >= 0 && lastIdx >= firstIdx && lastIdx - firstIdx + 1 === openDays.length
      ? `du ${openDays[0]} au ${openDays[lastIdx]}`
      : openDays.join(', ');

  const hoursPerDay = openDays.map((day) => byDay[day].join(' / ')).join(', ');
  return `${rangeLabel}, ${hoursPerDay}`;
}

/**
 * Retourne le statut actuel (ouvert/ferme) du restaurant.
 * @param {Array} schedule - opening_hours.schedule
 * @param {Array} [closedPeriods] - closed_periods
 * @returns {{ open: boolean, label: string, nextChange: string|null }}
 */
export function getTodayStatus(schedule, closedPeriods) {
  if (!schedule || schedule.length === 0) {
    return { open: false, label: 'Ferme', nextChange: null };
  }

  const now = new Date();
  const todayName = DAY_NAMES[now.getDay()];
  const todaySchedule = schedule.filter((s) => s.day === todayName && !s.closed);

  if (todaySchedule.length === 0) {
    return { open: false, label: 'Ferme', nextChange: null };
  }

  // Vérifier fermetures exceptionnelles
  if (closedPeriods && closedPeriods.length > 0) {
    const today = now.toISOString().slice(0, 10);
    for (const period of closedPeriods) {
      if (today >= period.start && today <= period.end) {
        return {
          open: false,
          label: `Ferme (${period.reason || 'fermeture exceptionnelle'})`,
          nextChange: null,
        };
      }
    }
  }

  // Vérifier chaque créneau du jour
  let isOpen = false;
  for (const entry of todaySchedule) {
    if (!entry.open || !entry.close) continue;
    const [oh, om] = entry.open.split(':').map(Number);
    const [ch, cm] = entry.close.split(':').map(Number);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = oh * 60 + om;
    const closeMinutes = ch * 60 + cm;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      isOpen = true;
      break;
    }
  }

  return {
    open: isOpen,
    label: isOpen ? 'Ouvert' : 'Ferme',
    nextChange: null,
  };
}

/**
 * Convertit le schedule en format OpeningHoursSpecification schema.org.
 * Source unique du groupement horaires schema.org (CODE_REVIEW m2 :
 * l'ancien toOpeningHoursSchema de hours.js et buildOpeningHoursSchema de
 * schema.js etaient deux copies divergentes du meme objet).
 */
export function buildOpeningHoursSchema(schedule) {
  if (!schedule || schedule.length === 0) return [];

  // Regrouper par creneau identique (open-close) -> jour(s) associe(s)
  const groups = {};
  for (const entry of schedule) {
    if (entry.closed || !entry.open || !entry.close) continue;
    const key = `${entry.open}-${entry.close}`;
    if (!groups[key]) groups[key] = { open: entry.open, close: entry.close, days: [] };
    groups[key].days.push(FR_TO_SCHEMA[entry.day] || entry.day);
  }

  return Object.values(groups)
    .filter((g) => g.days.length > 0)
    .map((g) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: g.days,
      opens: g.open,
      closes: g.close,
    }));
}

/**
 * Verifie si une date est un jour ouvert (pour ReservationForm).
 */
export function isDayOpen(dateStr, schedule, closedPeriods) {
  if (!schedule || schedule.length === 0) return false;

  const date = new Date(dateStr + 'T00:00:00');
  const dayName = DAY_NAMES[date.getDay()];

  // Vérifier les fermetures exceptionnelles
  if (closedPeriods && closedPeriods.length > 0) {
    for (const period of closedPeriods) {
      if (dateStr >= period.start && dateStr <= period.end) return false;
    }
  }

  const dayEntries = schedule.filter((s) => s.day === dayName && !s.closed);
  return dayEntries.length > 0;
}