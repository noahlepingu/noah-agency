#!/usr/bin/env node
/**
 * preview-site.mjs — Preview le build d'un client
 * Usage : node scripts/preview-site.mjs --client <slug>
 */
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const clientArg = args.find((a, i) => args[i - 1] === '--client');
const slug = clientArg || 'exemple-restaurant';

const distDir = join(ROOT, 'dist', slug);
if (!existsSync(distDir)) {
  console.error(`Build not found for "${slug}". Run build:example first.`);
  process.exit(1);
}

console.log(`\nPreviewing "${slug}"...`);
try {
  execSync('npx astro preview', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, CLIENT: slug },
  });
} catch {
  console.error('Preview server stopped.');
}