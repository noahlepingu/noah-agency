/**
 * tests/forms.test.mjs — utils/forms.js : validators, honeypot,
 * buildFormEndpoint (endpoint tiers / fallback mailto), envoi.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidEmail,
  isValidPhoneFr,
  isValidPhoneIntl,
  validateField,
  validateForm,
  checkHoneypot,
  buildFormEndpoint,
  submitForm,
} from '../src/utils/forms.js';

test('isValidEmail : emprise et rejets simples', () => {
  assert.equal(isValidEmail('jean@example.com'), true);
  assert.equal(isValidEmail('  jean@example.com  '), true);
  assert.equal(isValidEmail('pas-un-email'), false);
  assert.equal(isValidEmail('a@'), false);
  assert.equal(isValidEmail(''), false);
});

test('isValidPhoneFr : formats FR 10 chiffres (espaces/points/tirets)', () => {
  assert.equal(isValidPhoneFr('04 72 00 00 01'), true);
  assert.equal(isValidPhoneFr('0472000001'), true);
  assert.equal(isValidPhoneFr('04.72.00.00.01'), true);
  assert.equal(isValidPhoneFr('04-72-00-00-01'), true);
  assert.equal(isValidPhoneFr('04 72 00 00 0'), false); // 9 chiffres
  assert.equal(isValidPhoneFr('+33472000001'), false); // format international, pas FR
});

test('isValidPhoneIntl : format international (separateurs ignores)', () => {
  assert.equal(isValidPhoneIntl('+33472000001'), true);
  assert.equal(isValidPhoneIntl('+33 4 72 00 00 01'), true);
  assert.equal(isValidPhoneIntl('0472000001'), false); // pas de +
});

test('validateField : required, email, optionnel vide', () => {
  assert.equal(validateField('nom', '', { required: true, message: 'Nom obligatoire' }), 'Nom obligatoire');
  assert.equal(validateField('email', 'bad', { type: 'email', message: 'Email invalide' }), 'Email invalide');
  assert.equal(validateField('message', '', { type: 'text' }), null); // optionnel vide OK
  assert.equal(validateField('phone', '04 72 00 00 01', { type: 'phone' }), null);
});

test('validateForm : comptage des erreurs', () => {
  const res = validateForm(
    { name: '', email: 'bad', phone: '04 72 00 00 01' },
    {
      name: { required: true, message: 'Nom obligatoire' },
      email: { type: 'email', message: 'Email invalide', required: true },
      phone: { type: 'phone' },
    },
  );
  assert.equal(res.valid, false);
  assert.equal(res.errorCount, 2);
  assert.ok(res.errors.name);
  assert.ok(res.errors.email);
  assert.ok(!res.errors.phone);
});

test('checkHoneypot : champ vide = humain', () => {
  assert.equal(checkHoneypot(''), true);
  assert.equal(checkHoneypot('   '), true);
  assert.equal(checkHoneypot('robot'), false);
});

test('buildFormEndpoint : endpoint tiers / mailto / aucun', () => {
  assert.deepEqual(buildFormEndpoint({ endpoint: 'https://formspree.io/f/abc123' }), { kind: 'http', url: 'https://formspree.io/f/abc123' });
  assert.deepEqual(buildFormEndpoint({ endpoint: '', email: 'contact@example.com' }), { kind: 'mailto', url: 'mailto:contact@example.com' });
  assert.deepEqual(buildFormEndpoint({ endpoint: '   ', email: '' }), { kind: 'none', url: '' });
});

test('submitForm : aucun endpoint -> false (aucun effet de bord)', async () => {
  const ok = await submitForm({ endpoint: '', email: '' });
  assert.equal(ok, false);
});