#!/usr/bin/env node
/**
 * contrast-check.mjs — Verifie les contrastes d'une palette client
 * Reference : DESIGN_SYSTEM_SPECS.md §4.2, CODE_REVIEW M6/m8
 *
 * Utilise l'algorithme WCAG 2.x relative luminance (scripts/color-utils.mjs).
 * Sortie : rapport avec les combinaisons passees/echouees.
 * Verifie les tokens reels du theme genere, y compris les couples on-*
 * (le token --color-on-secondary ne doit plus etre #fff sur ambre = 2.1:1)
 * et les variantes -dark (hex 8 chiffres acceptes).
 *
 * Usage : node scripts/contrast-check.mjs --client <slug>
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { contrastRatio } from './color-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const clientArg = args.find((a, i) => args[i - 1] === '--client');
const slug = clientArg || 'exemple-restaurant';

// Load theme.css to extract colors
const themePath = join(ROOT, 'src', 'sites', slug, 'theme.css');
if (!existsSync(themePath)) {
  console.error(`Theme not found: ${themePath}. Run generate first.`);
  process.exit(1);
}

const theme = readFileSync(themePath, 'utf8');
const colors = {};
// Matche les hex 6 chiffres ET 8 chiffres (alpha). Fallbacks = palette DA 2.6.
for (const [, name, hex] of theme.matchAll(/--color-([\w-]+):\s*(#[0-9A-Fa-f]{6}(?:[0-9A-Fa-f]{2})?)/g)) {
  colors[name] = hex;
}

const checks = [
  ['Text on white', colors['gray-900'] || '#111827', '#FFFFFF', 4.5],
  ['Text on white (secondary)', colors['gray-500'] || '#6B7280', '#FFFFFF', 4.5],
  ['White on primary', '#FFFFFF', colors['primary'] || '#3A2E27', 4.5],
  ['White on accent', '#FFFFFF', colors['accent'] || '#B4542C', 4.5],
  // Tokens on-* reels : le texte choisi sur son fond (M6).
  ['On-primary token on primary', colors['on-primary'] || '#FBF7F0', colors['primary'] || '#3A2E27', 4.5],
  ['On-secondary token on secondary', colors['on-secondary'] || '#241B16', colors['secondary'] || '#A67C52', 4.5],
  ['On-accent token on accent', colors['on-accent'] || '#FBF7F0', colors['accent'] || '#B4542C', 4.5],
  // Variantes -dark : ce sont elles du hover/skip-link (m8).
  ['On-primary-dark token on primary-dark', colors['on-primary-dark'] || '#FBF7F0', colors['primary-dark'] || colors['primary'] || '#3A2E27', 4.5],
  ['On-accent-dark token on accent-dark', colors['on-accent-dark'] || '#FBF7F0', colors['accent-dark'] || colors['accent'] || '#B4542C', 4.5],
  // Badges horaires "Ouvert"/"Ferme" (D-A11Y-05, WCAG 1.4.3) : tokens fondationnels
  // definis dans src/styles/tokens.css (absents du theme.css client) — m8.
  // --color-success-dark (#047857) = 5.48:1 ; --color-gray-500 (#6B7280) = 4.83:1.
  ['Success-dark badge on white (Ouvert)', colors['success-dark'] || '#047857', '#FFFFFF', 4.5],
  ['Gray-500 badge on white (Ferme)', colors['gray-500'] || '#6B7280', '#FFFFFF', 4.5],
];

console.log(`\n  Contrast Check — ${slug}\n`);
let failed = 0;

for (const [label, fg, bg, min] of checks) {
  const ratio = contrastRatio(fg, bg);
  const pass = ratio >= min;
  const icon = pass ? 'PASS' : 'FAIL';
  console.log(`  [${icon}] ${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1 (min ${min}:1)`);
  if (!pass) failed++;
}

console.log(`\n  ${failed === 0 ? 'All checks passed!' : `${failed} check(s) failed.`}`);
process.exit(failed > 0 ? 1 : 0);