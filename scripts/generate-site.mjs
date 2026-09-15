#!/usr/bin/env node
/**
 * generate-site.mjs — Genere un site client dans src/sites/<slug> puis build.
 *
 * Pipeline (ADR-002, TECHNICAL_ARCHITECTURE.md §4) :
 *   valider (REQUIRED bloquent) -> creer data.json -> theme.css ->
 *   copier pages -> copier public -> robots/sitemap -> astro build
 *
 * Le contrat : un client_data.yaml VALIDE produit un site buildable.
 * Si la validation echoue (code != 0), la generation est REFUSEE et un
 * rapport est ecrit dans dist/<slug>/validation-report.md.
 *
 * Usage : node scripts/generate-site.mjs --client <slug> [--build]
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { parse } from 'yaml';
import { validateClientData, deriveClientData, buildValidationReport } from './validation-core.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const clientArg = args.find((a, i) => args[i - 1] === '--client');
const shouldBuild = args.includes('--build');

if (!clientArg) {
  console.error('Usage: node scripts/generate-site.mjs --client <slug> [--build]');
  process.exit(1);
}

const slug = clientArg;
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Invalid slug: "${slug}". Use lowercase alphanumeric + hyphens.`);
  process.exit(1);
}

// --- 1. Load client data ---
const clientPath = join(ROOT, 'content', 'clients', slug, 'client_data.yaml');
if (!existsSync(clientPath)) {
  console.error(`Client data not found: ${clientPath}`);
  process.exit(1);
}

let rawData;
try {
  rawData = parse(readFileSync(clientPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse client_data.yaml:', e.message);
  process.exit(1);
}

// --- 2. VALIDATE (etape bloquante du pipeline) ---
const { code: validationCode, result: validationResult } = validateClientData(rawData);
const report = buildValidationReport({ slug, result: validationResult });
const reportRel = join('dist', slug, 'validation-report.md');
try {
  mkdirSync(join(ROOT, 'dist', slug), { recursive: true });
  writeFileSync(join(ROOT, reportRel), report, 'utf8');
} catch {}
if (validationCode !== 0) {
  console.error(`\n  ${validationResult.blocking.length} champ(s) bloquant(s) — generation REFUSEE`);
  console.error(`  Rapport : ${reportRel}\n`);
  for (const b of validationResult.blocking) {
    console.error(`    - ${b.path} : ${b.action}`);
  }
  process.exit(1);
}
console.log(`  Validation OK (${validationResult.validCount} champs valides)`);

// Donnees derivees (address.full, phone_intl, defauts — §5.1)
const clientData = deriveClientData(rawData);

// --- 3. Load template ---
const templateDir = join(ROOT, 'templates', 'restaurant');
const templatePath = join(templateDir, 'template.yaml');
let template;
try {
  template = parse(readFileSync(templatePath, 'utf8'));
} catch (e) {
  console.error('Failed to parse template.yaml:', e.message);
  process.exit(1);
}

// --- 4. Build placeholder map ---
function buildPlaceholders(client, tmpl) {
  const b = client.business || {};
  const s = client.seo || {};
  const c = client.contact || {};
  const l = client.legal || {};
  return {
    'Nom': b.name || '',
    'Activite': s.activityLabel || client.template?.activityLabel || tmpl.activityLabel || b.category || '',
    'Ville': s.city || '',
    'Adresse_complete': c.address?.full || '',
    'Adresse': c.address?.full || '',
    'Telephone': c.phone || '',
    'Telephone_intl': c.phone_intl || c.phone || '',
    'Email': c.email || '',
    'Nom_commercial': l.legal_name || b.name || '',
    'Forme_juridique': l.legal_form || '',
    'SIREN': l.siren || '',
    'SIRET': l.siret || '',
    'Nom_directeur': l.director || '',
    'Nom_hebergeur': l.host_name || '',
    'Adresse_hebergeur': l.host_address || '',
    'Email_pro': l.email_pro || c.email || '',
  };
}

function fillTemplate(text, placeholders) {
  if (typeof text !== 'string') return text;
  return text.replace(/\[([^\]]+)\]/g, (m, key) => placeholders[key.trim()] ?? m);
}

function fillObject(obj, placeholders) {
  if (!obj || typeof obj !== 'object') return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') result[k] = fillTemplate(v, placeholders);
    else if (v && typeof v === 'object') result[k] = fillObject(v, placeholders);
    else result[k] = v;
  }
  return result;
}

const placeholders = buildPlaceholders(clientData, template);

// --- 5. Build data.json ---
const siteUrl = `https://${clientData.seo?.domain || 'example.com'}`;

// Deep merge template components with client components
function deepMerge(target, source) {
  const result = JSON.parse(JSON.stringify(target));
  for (const [k, v] of Object.entries(source || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (!result[k] || typeof result[k] !== 'object') result[k] = {};
      deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

const components = deepMerge(template.components || {}, clientData.components || {});

// Load and fill content texts
let contentFr = {};
let contentEn = {};
try { contentFr = JSON.parse(readFileSync(join(templateDir, 'content', 'fr.json'), 'utf8')); } catch {}
try { contentEn = JSON.parse(readFileSync(join(templateDir, 'content', 'en.json'), 'utf8')); } catch {}

const textsFr = fillObject(contentFr.texts || {}, placeholders);
const textsEn = fillObject(contentEn.texts || {}, placeholders);

// Override components with client-specific data
if (clientData.opening_hours) {
  components.opening_hours = { ...components.opening_hours, ...clientData.opening_hours };
}
if (clientData.contact?.map) {
  components.map = { ...components.map, lat: clientData.contact.map.lat, lng: clientData.contact.map.lng, address: clientData.contact.address?.full || '' };
}
if (clientData.menu?.categories) components.menu.categories = clientData.menu.categories;
// Avis : schema = reviews.items (compat annee : reviews.reviews)
components.testimonials = {
  ...components.testimonials,
  reviews: clientData.reviews?.items || clientData.reviews?.reviews || components.testimonials?.reviews || [],
};
if (clientData.faq?.questions) components.faq.questions = clientData.faq.questions;
if (clientData.gallery?.images) components.gallery.images = clientData.gallery.images;

// --- Formulaires : endpoints + config depuis client_data (ADR-003) ---
// contact.form_endpoint / reservation.form_endpoint surchargent le template.
if (!components.contact_form) components.contact_form = {};
components.contact_form = {
  ...components.contact_form,
  action: clientData.contact?.form_endpoint || components.contact_form.action || '',
  email: clientData.contact?.email || components.contact_form.email || '',
  phone: clientData.contact?.phone || components.contact_form.phone || '',
};

if (!components.reservation_form) components.reservation_form = {};
components.reservation_form = {
  ...components.reservation_form,
  action: clientData.reservation?.form_endpoint || components.reservation_form.action || '',
  time_slots: clientData.reservation?.slots || clientData.reservation?.time_slots || components.reservation_form.time_slots || [],
  max_party_size: clientData.reservation?.max_party_size ?? components.reservation_form.max_party_size ?? 8,
  phone: clientData.contact?.phone || components.reservation_form.phone || '',
  email: clientData.contact?.email || components.reservation_form.email || '',
  schedule: clientData.opening_hours?.schedule || components.reservation_form.schedule || [],
  closed_periods: clientData.opening_hours?.closed_periods || components.reservation_form.closed_periods || [],
};

// Fill placeholders in components (logo_text, address strings, etc.)
const filledComponents = fillObject(components, placeholders);

const data = {
  slug,
  site_url: siteUrl,
  business: clientData.business || {},
  seo: clientData.seo || {},
  contact: clientData.contact || {},
  socials: clientData.socials || {},
  texts: textsFr,
  texts_en: textsEn,
  components: filledComponents,
  third_party: template.third_party || {},
  hero_image: clientData.hero_image || null,
  site_pages: (template.pages || [])
    .filter(p => !['404', '500'].includes(p.route.replace(/^\//, '')))
    .map(p => ({ route: p.route, label: fillTemplate((p.seo_title || '').split('—')[0]?.trim() || p.route, placeholders) })),
  translated_routes: (template.pages || []).filter(p => p.translate).map(p => p.route),
};

// --- 6. Create site directory ---
// Structure: src/sites/<slug>/  (this IS the srcDir for Astro)
//   pages/           <- Astro pages
//   public/          <- Astro publicDir
//   data.json        <- merged data
//   theme.css        <- client custom properties

const siteDir = join(ROOT, 'src', 'sites', slug);
const pagesDir = join(siteDir, 'pages');
const publicDir = join(siteDir, 'public');

// Clean existing
if (existsSync(siteDir)) rmSync(siteDir, { recursive: true });
mkdirSync(pagesDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });

// Write data.json at site root (pages import from ../data.json)
writeFileSync(join(siteDir, 'data.json'), JSON.stringify(data, null, 2), 'utf8');
console.log('  Created data.json');

// --- 7. Generate theme.css ---
const branding = { ...(template.branding || {}), ...(clientData.branding || {}) };
const themeCss = `/* Theme genere pour ${slug} — ne pas editer manuellement */
:root {
  --font-heading: '${branding.fonts?.heading || 'Playfair Display'}', Georgia, serif;
  --font-body: '${branding.fonts?.body || 'Inter'}', system-ui, sans-serif;
  --color-primary: ${branding.primary_color || '#B91C1C'};
  --color-primary-light: ${branding.primary_color || '#B91C1C'}15;
  --color-primary-dark: ${branding.primary_color || '#B91C1C'}CC;
  --color-secondary: ${branding.secondary_color || '#F59E0B'};
  --color-secondary-light: ${branding.secondary_color || '#F59E0B'}15;
  --color-secondary-dark: ${branding.secondary_color || '#F59E0B'}CC;
  --color-accent: ${branding.accent_color || '#DC2626'};
  --color-accent-light: ${branding.accent_color || '#DC2626'}15;
  --color-accent-dark: ${branding.accent_color || '#DC2626'}CC;
  --color-on-primary: #fff;
  --color-on-secondary: #fff;
  --color-on-accent: #fff;
  --color-on-surface: #fff;
}`;
writeFileSync(join(siteDir, 'theme.css'), themeCss, 'utf8');
console.log('  Created theme.css');

// --- 8. Copy pages from template ---
// Pages are at templates/restaurant/pages/*.astro
// They use $$LANG$$ marker, replaced with 'fr' or 'en'
// They import: '../data.json', '../theme.css', '@components/...', '@layouts/...', '@utils/...'

const langConfig = (template.pages || []).filter(p => p.translate);
const enDir = join(pagesDir, 'en');

for (const page of template.pages || []) {
  const srcFile = join(templateDir, 'pages', page.file);
  if (!existsSync(srcFile)) {
    console.warn(`  Warning: page template not found: ${srcFile}`);
    continue;
  }

  const content = readFileSync(srcFile, 'utf8');

  // FR version -> pages/<file>
  const frContent = content
    .replace(/\$\$LANG\$\$/g, 'fr')
    .replace(/\$\$THEME_CSS_PATH\$\$/g, '../theme.css')
    .replace(/\$\$DATA_PATH\$\$/g, '../data.json');
  writeFileSync(join(pagesDir, page.file), frContent, 'utf8');

  // EN version -> pages/en/<file> (for translate:true pages)
  if (page.translate) {
    mkdirSync(enDir, { recursive: true });
    const enContent = content
      .replace(/\$\$LANG\$\$/g, 'en')
      .replace(/\$\$THEME_CSS_PATH\$\$/g, '../../theme.css')
      .replace(/\$\$DATA_PATH\$\$/g, '../../data.json');
    writeFileSync(join(enDir, page.file), enContent, 'utf8');
  }
}
console.log(`  Created ${(template.pages || []).length} FR pages + ${langConfig.length} EN pages`);

// --- 9. Copy public assets ---
const templatePublic = join(templateDir, 'public');
if (existsSync(templatePublic)) cpSync(templatePublic, publicDir, { recursive: true });

// Copy fonts if cached
const fontsCache = join(ROOT, 'fonts-cache');
if (existsSync(fontsCache)) {
  const fontsDir = join(publicDir, 'fonts');
  mkdirSync(fontsDir, { recursive: true });
  cpSync(fontsCache, fontsDir, { recursive: true });
}

// Copy favicon
const faviconSrc = join(ROOT, 'public', 'favicon.svg');
if (existsSync(faviconSrc)) cpSync(faviconSrc, join(publicDir, 'favicon.svg'));

// --- 10. Generate robots.txt ---
writeFileSync(join(publicDir, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`, 'utf8');
console.log('  Created robots.txt');

// --- 11. Generate sitemap.xml ---
const sitemapUrls = (template.pages || [])
  .filter(p => !['404', '500'].includes(p.route.replace(/^\//, '')))
  .flatMap(p => {
    const urls = [`${siteUrl}${p.route === '/' ? '' : p.route}`];
    if (p.translate) urls.push(`${siteUrl}/en${p.route === '/' ? '/' : p.route}`);
    return urls;
  });
writeFileSync(join(publicDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`, 'utf8');
console.log('  Created sitemap.xml');

console.log(`\nSite "${slug}" generated in ${siteDir}`);

// --- 12. Build (optional) ---
if (shouldBuild) {
  console.log('\nBuilding with Astro...');
  try {
    execSync('npx astro build', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, CLIENT: slug, NODE_ENV: 'production' },
    });
    console.log(`\nBuild complete! Output: dist/${slug}/`);
    console.log(`Validation report: dist/${slug}/validation-report.md`);
  } catch (e) {
    console.error('\nBuild failed. Check errors above.');
    process.exit(1);
  }
}