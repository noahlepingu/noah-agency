#!/usr/bin/env node
/**
 * scripts/color-utils.mjs — Utilitaires couleur partages
 * Reference : DESIGN_SYSTEM_SPECS.md §4.2 (contraste WCAG), CODE_REVIEW M6/m8
 *
 * Source unique pour :
 *  - luminance / contraste WCAG 2.x (utilisee par contrast-check.mjs et
 *    generate-site.mjs pour le calcul des tokens on-* et *-dark)
 *  - assombrissement reel d'une couleur (interpolation HSL)
 *  - choix d'une couleur de texte lisible sur un fond (on-*)
 *
 * Hex acceptes : #RGB, #RRGGBB, #RRGGBBAA (l'alpha est ignore pour les calculs).
 */

/** Convertit un hex en { r, g, b } (0-255). Retourne null si invalide. */
export function hexToRgb(hex) {
  if (typeof hex !== 'string') return null;
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 4) h = h.split('').map((c) => c + c).join('');
  if (h.length === 8) h = h.slice(0, 6); // ignore l'alpha
  if (!/^[0-9A-Fa-f]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/** rgb {r,g,b} (0-255) -> hex #rrggbb (minuscules). */
export function rgbToHex({ r, g, b }) {
  const to = (v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Luminance relative WCAG 2.x (0 = noir, 1 = blanc). */
export function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
}

/** Ratio de contraste WCAG (1:1 a 21:1). */
export function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Assombrit reellement une couleur : reduction de la luminosite HSL.
 * @param {string} hex - couleur source (#RGB/#RRGGBB/#RRGGBBAA)
 * @param {number} [amount=0.12] - points de luminosite retires (0-1)
 * @returns {string} hex #rrggbb plus sombre
 */
export function darken(hex, amount = 0.12) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const delta = max - min;
  const sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  const newL = Math.max(0.04, l - amount);

  // HSL -> RGB (formule standard, hue en degres 0-360)
  const hue = hueOf(rgb);
  const c = (1 - Math.abs(2 * newL - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = newL - c / 2;
  let rgbOut;
  if (hue < 60) rgbOut = [c, x, 0];
  else if (hue < 120) rgbOut = [x, c, 0];
  else if (hue < 180) rgbOut = [0, c, x];
  else if (hue < 240) rgbOut = [0, x, c];
  else if (hue < 300) rgbOut = [x, 0, c];
  else rgbOut = [c, 0, x];
  return rgbToHex({
    r: (rgbOut[0] + m) * 255,
    g: (rgbOut[1] + m) * 255,
    b: (rgbOut[2] + m) * 255,
  });
}

/** Teinte (0-360 degres) d'une couleur RGB. */
function hueOf({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue;
  if (max === rn) hue = ((gn - bn) / delta) % 6;
  else if (max === gn) hue = (bn - rn) / delta + 2;
  else hue = (rn - gn) / delta + 4;
  return ((hue % 6) + 6) % 6 * 60;
}

/**
 * Choisit le token de texte lisible sur un fond (WCAG AA 4.5:1).
 * @param {string} bgHex - couleur de fond
 * @param {object} [opts] - { light, dark, min }
 * @returns {string} hex du texte (#ffffff ou #1f2937 par defaut)
 */
export function pickOnColor(bgHex, { light = '#ffffff', dark = '#1f2937', min = 4.5 } = {}) {
  return contrastRatio(light, bgHex) >= min ? light : dark;
}

/**
 * Paire (fond sombre + couleur de texte) garantissant un contraste AA.
 * Assombrit progressivement jusqu'a ce que pickOnColor passe la cible.
 * @param {string} hex - couleur source
 * @param {object} [opts] - { min, step }
 * @returns {{ dark: string, on: string }}
 */
export function darkTokenPair(hex, { min = 4.5, step = 0.04 } = {}) {
  let dark = darken(hex, 0.12);
  let on = pickOnColor(dark, { min });
  let n = 0;
  // Si le couple ne depasse pas la cible (marge 0.1), assombrir encore :
  // le texte blanc gagne en contraste quand le fond s'assombrit.
  while (contrastRatio(on, dark) < min + 0.1 && n < 20) {
    dark = darken(dark, step);
    on = pickOnColor(dark, { min });
    n++;
  }
  return { dark, on };
}