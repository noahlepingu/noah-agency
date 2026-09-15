#!/usr/bin/env node
/**
 * dev-site.mjs — Lance le serveur de dev Astro pour un client
 * Usage : node scripts/dev-site.mjs --client <slug>
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

// Generate if not exists
const siteDir = join(ROOT, 'src', 'sites', slug);
if (!existsSync(join(siteDir, 'data.json'))) {
  console.log(`Site "${slug}" not generated. Generating first...`);
  execSync(`node scripts/generate-site.mjs --client ${slug}`, { cwd: ROOT, stdio: 'inherit' });
}

console.log(`\nStarting dev server for "${slug}"...`);
try {
  execSync('npx astro dev', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, CLIENT: slug },
  });
} catch {
  console.error('Dev server stopped.');
}