/**
 * tests/validate-client.test.mjs — Validation du client_data.yaml
 * Couvre : codes de sortie 0/2/3 (CLIENT_DATA_VALIDATION.md §2.2),
 * regles croisees C-01/C-04, derivation phone_intl (C-18),
 * rapport markdown, CLI exit code 4.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

import {
  validateClientData,
  deriveClientData,
  buildValidationReport,
  EXIT_OK,
  EXIT_REQUIRED,
  EXIT_FORMAT,
  EXIT_NOT_FOUND,
} from '../scripts/validation-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const exampleYaml = readFileSync(join(ROOT, 'content', 'clients', 'exemple-restaurant', 'client_data.yaml'), 'utf8');
const exampleData = parse(exampleYaml);

test('exemple-restaurant : validation OK (code 0)', () => {
  const { code, result } = validateClientData(exampleData);
  assert.equal(code, EXIT_OK, JSON.stringify(result.blocking, null, 2));
  assert.equal(result.status, 'OK');
  assert.equal(result.category, 'restaurant');
  assert.equal(result.package, 'vitrine_reservation');
});

test('champ REQUIRED manquant -> code 2', () => {
  const data = structuredClone(exampleData);
  delete data.services;
  const { code, result } = validateClientData(data);
  assert.equal(code, EXIT_REQUIRED);
  assert.ok(result.blocking.some((b) => b.path === 'services' && b.kind === 'REQUIRED'));
});

test('erreur de FORMAT -> code 3 (categorie hors enum)', () => {
  const data = structuredClone(exampleData);
  data.business.category = 'cuisine francaise';
  const { code, result } = validateClientData(data);
  assert.equal(code, EXIT_FORMAT);
  assert.ok(result.blocking.some((b) => b.path === 'business.category' && b.kind === 'FORMAT'));
});

test('le FORMAT prend le pas sur les REQUIRED manquants', () => {
  const data = structuredClone(exampleData);
  data.business.category = 'pas une categorie';
  delete data.services;
  const { code } = validateClientData(data);
  assert.equal(code, EXIT_FORMAT); // 3, jamais 2 tant qu il y a une erreur de format
});

test('regle C-01 : categorie != template.type -> bloquant (code 2)', () => {
  const data = structuredClone(exampleData);
  data.template.type = 'commerce';
  const { code, result } = validateClientData(data);
  assert.equal(code, EXIT_REQUIRED);
  assert.ok(result.blocking.some((b) => b.path === 'C-01' && b.kind === 'RULE'));
});

test('regle C-04 : package vitrine_reservation sans reservation -> bloquant (code 2)', () => {
  const data = structuredClone(exampleData);
  data.reservation.enabled = false;
  const { code, result } = validateClientData(data);
  assert.equal(code, EXIT_REQUIRED);
  assert.ok(result.blocking.some((b) => b.path === 'C-04'));
});

test('regle C-06 : avis custom sans items -> bloquant', () => {
  const data = structuredClone(exampleData);
  data.reviews.items = [];
  const { code, result } = validateClientData(data);
  assert.equal(code, EXIT_REQUIRED);
  assert.ok(result.blocking.some((b) => b.path === 'C-06'));
});

test('deriveClientData : address.full, phone_intl, zoom, package par defaut', () => {
  const partial = structuredClone(exampleData);
  delete partial.contact.address.full;
  delete partial.contact.phone_intl;
  const out = deriveClientData(partial);
  assert.equal(out.contact.address.full, '12 Rue de la Gastronomie, 69001 Lyon');
  assert.equal(out.contact.phone_intl, '+33 4 72 00 00 01');
  assert.equal(out.contact.map.zoom, 15);
  assert.equal(out.seo.region, 'Auvergne-Rhone-Alpes');
  assert.equal(out.seo.country, 'FR');

  const noTemplate = structuredClone(exampleData);
  delete noTemplate.template.package;
  assert.equal(deriveClientData(noTemplate).template.package, 'vitrine');
});

test('deriveClientData : EI -> capital "Sans objet (EI)"', () => {
  const data = structuredClone(exampleData);
  data.legal.legal_form = 'EI';
  delete data.legal.capital;
  assert.equal(deriveClientData(data).legal.capital, 'Sans objet (EI)');
});

test('buildValidationReport : contient le RESULTAT et le slug', () => {
  const { result } = validateClientData(exampleData);
  const report = buildValidationReport({ slug: 'exemple-restaurant', result });
  assert.ok(report.includes('# Rapport de validation'));
  assert.ok(report.includes('exemple-restaurant'));
  assert.ok(report.includes('RESULTAT : OK'));
});

test('CLI : fichier introuvable -> exit code 4', () => {
  const res = spawnSync(process.execPath, [
    join(ROOT, 'scripts', 'validate-client.mjs'),
    '--client',
    'aucun-client-pareil',
  ], { encoding: 'utf8' });
  assert.equal(res.status, EXIT_NOT_FOUND);
  assert.ok(res.stdout.includes('FICHIER INTROUVABLE') || res.stderr.includes('FICHIER INTROUVABLE'));
});