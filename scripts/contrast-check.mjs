#!/usr/bin/env node
/**
 * contrast-check.mjs — Verifie les contrastes d'une palette client
 * Reference : DESIGN_SYSTEM_SPECS.md §4.2
 *
 * Utilise l'algorithme WCAG 2.x relative luminance.
 * Sortie : rapport avec les combinaisons passees/echouees.
 *
 * Usage : node scripts/contrast-check.mjs --client <slug>
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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
for (const [, name, hex] of theme.matchAll(/--color-([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
  colors[name] = hex;
}

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const checks = [
  ['Text on white', colors['gray-900'] || '#111827', '#FFFFFF', 4.5],
  ['Text on white (secondary)', colors['gray-500'] || '#6B7280', '#FFFFFF', 4.5],
  ['White on primary', '#FFFFFF', colors['primary'] || '#B91C1C', 4.5],
  ['White on accent', '#FFFFFF', colors['accent'] || '#DC2626', 4.5],
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