#!/usr/bin/env node
/**
 * fetch-fonts.mjs — Telecharge les polices Google Fonts (Inter + Fraunces)
 * en woff2 et les place dans fonts-cache/.
 *
 * Inter : statique (400/500/600/700). Fraunces : variable (wght+opsz),
 * avec fallback statique 400/500/600/700 si l'API variable echoue.
 * (UX_REDESIGN_RESTAURANT.md §3.1 — Fraunces remplace Playfair Display.)
 *
 * Utilise Google Fonts CSS API v2 (pas de compte requis).
 * Si le telechargement echoue, le build continue avec fallback system fonts.
 *
 * Usage : node scripts/fetch-fonts.mjs
 */
import { writeFileSync, mkdirSync } from 'fs';
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
    family: 'Fraunces',
    // Tentative variable d'abord (woff2 a axes wght + opsz).
    // Le CSS2 de Google sert UN fichier variable par face (normal / italic).
    variable: [
      { css: 'opsz,wght@9..144,400..700', name: 'fraunces-latin-wght-normal.woff2' },
      { css: 'ital,opsz,wght@1,9..144,400..700', name: 'fraunces-latin-wght-italic.woff2' },
    ],
    // Fallback : poids statiques classes (memes noms que l'ancien flux).
    fallbackWeights: [400, 500, 600, 700],
    subset: 'latin',
  },
];

/**
 * User-Agent navigateur moderne : Google Fonts sert alors du woff2
 * (un UA "bot" ne recoit que du ttf). Le CSS renvoie un bloc @font-face
 * par sous-ensemble (cyrillic, latin, ...) : on ne garde que le bloc
 * latin (unicode-range U+0000-00FF) — les autres scripts sont inutiles
 * pour un site vitrine FR/EN.
 */
const UA_CHROME =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

async function fetchCSS(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA_CHROME },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchFontFile(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA_CHROME },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function cssUrlFor(font, axes) {
  return `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:${axes}&display=swap`;
}

/**
 * Extrait l'URL woff2 du bloc @font-face LATTIN (unicode-range U+0000-00FF).
 * @param {string} css - reponse CSS2 de Google Fonts
 * @returns {string|null}
 */
function extractLatinWoff2(css) {
  const blocks = css.split('@font-face').filter((b) => b.includes('U+0000-00FF'));
  for (const block of blocks) {
    const match = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/);
    if (match) return match[1];
  }
  return null;
}

async function downloadWoff2(font, cssQuery, filename) {
  const cssUrl = cssUrlFor(font, cssQuery);
  const css = await fetchCSS(cssUrl);
  const url = extractLatinWoff2(css);
  if (!url) {
    console.warn(`  No latin woff2 URL found for ${font.family} (${cssQuery})`);
    return false;
  }
  const woff2 = await fetchFontFile(url);
  writeFileSync(join(CACHE_DIR, filename), woff2);
  console.log(`  Downloaded: ${filename} (${(woff2.length / 1024).toFixed(1)} KB)`);
  return true;
}

async function main() {
  mkdirSync(CACHE_DIR, { recursive: true });
  let downloaded = 0;

  for (const font of FONTS) {
    // 1) Tentative variable (Fraunces) — 1 fichier par face si OK.
    if (font.variable) {
      let ok = 0;
      for (const v of font.variable) {
        try {
          if (await downloadWoff2(font, v.css, v.name)) { downloaded++; ok++; }
        } catch (e) {
          console.warn(`  Failed to download ${font.family} variable (${v.css}): ${e.message}`);
        }
      }
      if (ok === font.variable.length) continue; // variable : suffisant
      console.warn(`  Variable ${font.family} incomplete — fallback aux poids statiques.`);
    }

    // 2) Poids statiques (Inter, ou fallback Fraunces).
    for (const weight of font.weights || font.fallbackWeights) {
      const filename = `${font.family.toLowerCase().replace(/ /g, '-')}-${font.subset}-${weight}-normal.woff2`;
      try {
        if (await downloadWoff2(font, `wght@${weight}`, filename)) downloaded++;
      } catch (e) {
        console.warn(`  Failed to download ${font.family} w${weight}: ${e.message}`);
      }
    }
  }

  console.log(`\n  ${downloaded} font file(s) cached in fonts-cache/`);
}

main().catch((e) => {
  console.warn(`  Font download failed: ${e.message}`);
  console.warn('  Continuing with fallback system fonts.');
});