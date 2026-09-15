#!/usr/bin/env node
/**
 * fetch-fonts.mjs — Telecharge les polices Google Fonts (Inter + Playfair Display)
 * en woff2 et les place dans fonts-cache/.
 *
 * Utilise Google Fonts CSS API v2 (pas de compte requis).
 * Si le telechargement echoue, le build continue avec fallback system fonts.
 *
 * Usage : node scripts/fetch-fonts.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(ROOT, 'fonts-cache');

const FONTS = [
  {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    subset: 'latin',
  },
  {
    family: 'Playfair Display',
    weights: [700],
    subset: 'latin',
  },
];

async function fetchCSS(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; noah-agency/1.0)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchFontFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  mkdirSync(CACHE_DIR, { recursive: true });
  let downloaded = 0;

  for (const font of FONTS) {
    for (const weight of font.weights) {
      const cssUrl = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:wght@${weight}&display=swap&subset=${font.subset}`;
      try {
        const css = await fetchCSS(cssUrl);
        // Extract woff2 URL from CSS
        const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
        if (!match) {
          console.warn(`  No woff2 URL found for ${font.family} w${weight}`);
          continue;
        }
        const woff2 = await fetchFontFile(match[1]);
        const filename = `${font.family.toLowerCase().replace(/ /g, '-')}-${font.subset}-${weight}-normal.woff2`;
        writeFileSync(join(CACHE_DIR, filename), woff2);
        downloaded++;
        console.log(`  Downloaded: ${filename} (${(woff2.length / 1024).toFixed(1)} KB)`);
      } catch (e) {
        console.warn(`  Failed to download ${font.family} w${weight}: ${e.message}`);
      }
    }
  }

  console.log(`\n  ${downloaded} font file(s) cached in fonts-cache/`);
}

main().catch(e => {
  console.warn(`  Font download failed: ${e.message}`);
  console.warn('  Continuing with fallback system fonts.');
});