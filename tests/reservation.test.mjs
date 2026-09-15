/**
 * tests/reservation.test.mjs — Logique statique des creneaux de reservation
 * (utils/reservation.js) : jours fermes, periodes de fermeture,
 * filtrage/generation des creneaux, aucune source de creneaux (C-05),
 * prochaine date disponible.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getDayName,
  isClosedPeriod,
  isDayOpen,
  getSlotsForDate,
  hasAnySlotSource,
  findNextAvailableDate,
} from '../src/utils/reservation.js';

const SCHEDULE = [
  { day: 'Lundi', open: '12:00', close: '14:00' },
  { day: 'Lundi', open: '18:30', close: '22:00' },
  { day: 'Dimanche', closed: true },
];

test('getDayName : mappe l ordre des jours (Dimanche=0)', () => {
  const d = new Date('2026-09-15T00:00:00'); // weekday quelconque, verifie la coherence
  const names = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  assert.equal(getDayName('2026-09-15'), names[d.getDay()]);
  assert.equal(getDayName('invalide'), null);
});

test('isClosedPeriod : plage start..end inclusive', () => {
  const periods = [{ start: '2026-12-24', end: '2026-12-26', reason: 'Fetes' }];
  assert.equal(isClosedPeriod('2026-12-24', periods), true);
  assert.equal(isClosedPeriod('2026-12-25', periods), true);
  assert.equal(isClosedPeriod('2026-12-26', periods), true);
  assert.equal(isClosedPeriod('2026-12-23', periods), false);
  assert.equal(isClosedPeriod('2026-01-01', undefined), false);
});

test('isDayOpen : jour avec plages + fermeture exceptionnelle', () => {
  const cfg = { schedule: SCHEDULE, closedPeriods: [] };
  assert.equal(isDayOpen('2026-09-14', cfg), true);  // lundi
  assert.equal(isDayOpen('2026-09-13', cfg), false); // dimanche ferme
  assert.equal(isDayOpen('2026-09-14', { ...cfg, closedPeriods: [{ start: '2026-09-14', end: '2026-09-14' }] }), false);
});

test('getSlotsForDate : slots explicites filtres par les plages du jour', () => {
  const cfg = {
    schedule: SCHEDULE,
    closedPeriods: [],
    slots: ['12:00', '13:30', '19:30', '23:00'], // 23:00 hors service
  };
  const { slots, closed } = getSlotsForDate('2026-09-14', cfg); // lundi
  assert.deepEqual(slots, ['12:00', '13:30', '19:30']);
  assert.equal(closed, false);
});

test('getSlotsForDate : generation pas de 30 min depuis les plages', () => {
  const cfg = {
    schedule: [{ day: 'Mardi', open: '12:00', close: '13:00' }],
    closedPeriods: [],
    slots: [], // pas de liste -> generation
  };
  const { slots } = getSlotsForDate('2026-09-15', cfg);
  assert.deepEqual(slots, ['12:00', '12:30']);
});

test('getSlotsForDate : jour ferme -> closed, raison day_closed', () => {
  const cfg = { schedule: SCHEDULE, closedPeriods: [], slots: ['12:00'] };
  const res = getSlotsForDate('2026-09-13', cfg); // dimanche
  assert.equal(res.closed, true);
  assert.equal(res.reason, 'day_closed');
  assert.deepEqual(res.slots, []);
});

test('getSlotsForDate : periode de fermeture -> closed, raison closed_period', () => {
  const cfg = {
    schedule: SCHEDULE,
    closedPeriods: [{ start: '2026-12-24', end: '2026-12-26' }],
    slots: ['12:00'],
  };
  const res = getSlotsForDate('2026-12-24', cfg);
  assert.equal(res.closed, true);
  assert.equal(res.reason, 'closed_period');
});

test('getSlotsForDate : aucun creneau dans les plages -> raison no_slot', () => {
  const cfg = { schedule: SCHEDULE, closedPeriods: [], slots: ['23:00'] };
  const res = getSlotsForDate('2026-09-14', cfg); // lundi, 23:00 hors plage
  assert.equal(res.closed, true);
  assert.equal(res.reason, 'no_slot');
});

test('hasAnySlotSource : conformite C-05', () => {
  assert.equal(hasAnySlotSource({ schedule: SCHEDULE, slots: [] }), true);
  assert.equal(hasAnySlotSource({ schedule: [], slots: ['12:00'] }), true);
  assert.equal(hasAnySlotSource({ schedule: [], slots: [] }), false);
});

test('findNextAvailableDate : renvoie la date `from` si ouverte', () => {
  const cfg = { schedule: SCHEDULE, closedPeriods: [], slots: [] };
  // 2026-09-14 : un lundi (ouvert dans SCHEDULE)
  assert.equal(findNextAvailableDate(cfg, '2026-09-14'), '2026-09-14');
});

test('findNextAvailableDate : null quand tout est ferme (30 jours)', () => {
  const cfg = {
    schedule: SCHEDULE,
    closedPeriods: [{ start: '2026-01-01', end: '2030-01-01' }],
    slots: [],
  };
  assert.equal(findNextAvailableDate(cfg, '2026-09-14'), null);
});