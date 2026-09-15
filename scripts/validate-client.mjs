#!/usr/bin/env node
/**
 * validate-client.mjs — Valide un fichier client_data.yaml (CLI).
 * Referencement : project/database/CLIENT_DATA_VALIDATION.md §2.2
 *
 * Codes de sortie :
 *   0 = VALIDATION OK          (aucun champ bloquant)
 *   1 = ERREUR YAML            (erreur de parse)
 *   2 = EN ATTENTE DE DONNEES  (champs REQUIRED manquants)
 *   3 = ERREUR FORMAT          (regex / enum / type invalide)
 *   4 = FICHIER INTROUVABLE
 *
 * Usage : node scripts/validate-client.mjs --client <slug> [--verbose]
 * Rapport : console + fichier dist/<slug>/validation-report.md
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'yaml';
import {
  validateClientData,
  buildValidationReport,
  EXIT_OK,
  EXIT_YAML,
  EXIT_NOT_FOUND,
} from './validation-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const clientArg = args.find((a, i) => args[i - 1] === '--client');
const verbose = args.includes('--verbose');

if (!clientArg) {
  console.error('Usage: node scripts/validate-client.mjs --client <slug> [--verbose]');
  process.exit(1);
}

const slug = clientArg;
const clientPath = join(ROOT, 'content', 'clients', slug, 'client_data.yaml');
if (!existsSync(clientPath)) {
  console.error(`FICHIER INTROUVABLE : ${clientPath}`);
  process.exit(EXIT_NOT_FOUND);
}

let rawText;
try {
  rawText = readFileSync(clientPath, 'utf8');
} catch (e) {
  console.error(`FICHIER INTROUVABLE : ${clientPath} (${e.message})`);
  process.exit(EXIT_NOT_FOUND);
}

let data;
try {
  data = parse(rawText);
} catch (e) {
  console.error(`ERREUR YAML : ${e.message}`);
  process.exit(EXIT_YAML);
}

const { code, result } = validateClientData(data);

// Rapport fichier : dist/<slug>/validation-report.md
const distDir = join(ROOT, 'dist', slug);
try {
  mkdirSync(distDir, { recursive: true });
  const report = buildValidationReport({ slug, result });
  writeFileSync(join(distDir, 'validation-report.md'), report, 'utf8');
} catch {
  // Le rapport fichier est un plus ; ne fait pas echouer la validation.
}

// Rapport console
const message = code === EXIT_OK
  ? 'VALIDATION OK'
  : result.status === 'ERREUR FORMAT' ? 'ERREUR FORMAT' : `EN ATTENTE DE DONNEES : ${result.blocking.length} champ(s) bloquant(s)`;

console.log(`\n  ${message}`);
console.log(`  Projet : ${slug}`);
console.log(`  Champs valides : ${result.validCount} / ${result.total}`);
console.log(`  Secteur : ${result.category} | Package : ${result.package}`);

if (result.blocking.length > 0) {
  console.error(`\n  ${result.blocking.length} champ(s) bloquant(s) :`);
  for (const b of result.blocking) {
    console.error(`    - ${b.path} : ${b.action}`);
  }
}
if (result.recommended.length > 0) {
  console.warn(`\n  ${result.recommended.length} champ(s) recommande(s) :`);
  for (const r of result.recommended) {
    console.warn(`    - ${r.path} : ${r.action}`);
  }
}
if (verbose && result.optional.length > 0) {
  console.log(`\n  ${result.optional.length} champ(s) optionnel(s) :`);
  for (const o of result.optional) {
    console.log(`    - ${o.path}`);
  }
}

console.log(`\n  Rapport : dist/${slug}/validation-report.md`);
process.exit(code);