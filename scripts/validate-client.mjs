#!/usr/bin/env node
/**
 * validate-client.mjs — Valide un fichier client_data.yaml
 * Referencement : project/database/CLIENT_DATA_VALIDATION.md
 *
 * Codes de sortie :
 *   0 = valide (tous les champs REQUIRED remplis)
 *   1 = erreurs de syntaxe YAML
 *   2 = champs REQUIRED manquants
 *   3 = champs SHOULD manquants (warnings uniquement)
 *
 * Usage : node scripts/validate-client.mjs [--client <slug>] [--verbose]
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const clientArg = args.find((a, i) => args[i - 1] === '--client');
const verbose = args.includes('--verbose');

if (!clientArg) {
  console.error('Usage: node scripts/validate-client.mjs --client <slug>');
  process.exit(1);
}

const clientPath = join(ROOT, 'content', 'clients', clientArg, 'client_data.yaml');
if (!existsSync(clientPath)) {
  console.error(`Client data not found: ${clientPath}`);
  process.exit(1);
}

let data;
try {
  const yamlMod = await import('yaml');
  const yaml = yamlMod.default;
  data = yaml.parse(readFileSync(clientPath, 'utf8'));
} catch (e) {
  console.error(`YAML parsing error: ${e.message}`);
  process.exit(1);
}

const errors = [];
const warnings = [];

// REQUIRED fields
const required = [
  ['business.name', 'Nom du restaurant'],
  ['business.description', 'Description'],
  ['seo.city', 'Ville (seo.city)'],
  ['seo.domain', 'Domaine (seo.domain)'],
  ['contact.phone', 'Telephone'],
  ['contact.email', 'Email'],
  ['contact.address.street', 'Adresse'],
  ['contact.address.city', 'Ville (adresse)'],
  ['contact.address.postal_code', 'Code postal'],
];

for (const [path, label] of required) {
  const val = path.split('.').reduce((o, k) => o?.[k], data);
  if (!val || (typeof val === 'string' && val.trim() === '')) {
    errors.push(`REQUIRED manquant: ${label} (${path})`);
  }
}

// SHOULD fields
const should = [
  ['opening_hours.schedule', 'Horaires (opening_hours.schedule)'],
  ['contact.map.lat', 'Latitude'],
  ['contact.map.lng', 'Longitude'],
  ['contact.phone_intl', 'Telephone international'],
  ['socials.facebook', 'Facebook'],
  ['reviews.reviews', 'Avis clients'],
  ['legal.siret', 'SIRET'],
];

for (const [path, label] of should) {
  const val = path.split('.').reduce((o, k) => o?.[k], data);
  if (!val) {
    warnings.push(`SHOULD manquant: ${label} (${path})`);
  }
}

// Display results
if (errors.length > 0) {
  console.error('\n  VALIDATION FAILED\n');
  errors.forEach(e => console.error(`  ${e}`));
  console.error(`\n  ${errors.length} erreur(s) critique(s)`);
}
if (warnings.length > 0) {
  console.warn('\n  WARNINGS\n');
  warnings.forEach(w => console.warn(`  ${w}`));
  console.warn(`\n  ${warnings.length} avertissement(s)`);
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('\n  VALIDATION PASSED - Tous les champs sont renseignes\n');
}

process.exit(errors.length > 0 ? 2 : warnings.length > 0 ? 3 : 0);