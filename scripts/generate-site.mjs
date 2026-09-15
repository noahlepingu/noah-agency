#!/usr/bin/env node
/**
 * generate-site.mjs — Genere un site client dans src/sites/<slug>
 * Pipeline : valider -> creer data.json -> theme.css -> copier pages -> copier public
 *
 * Structure generee :
 *   src/sites/<slug>/
 *     pages/         (Astro srcDir/pages)
 *     public/        (Astro publicDir)
 *     data.json      (donnees fusionnees)
 *     theme.css      (custom properties du client)
 *
 * Usage : node scripts/generate-site.mjs --client <slug> [--build]
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

let clientData;
try {
  const yamlMod = await import('yaml');
  const yaml = yamlMod.default;
  clientData = yaml.parse(readFileSync(clientPath, 'utf8'));
} catch (e) {
  console.error('Failed to parse client_data.yaml:', e.message);
  process.exit(1);
}

// --- 2. Load template ---
const templateDir = join(ROOT, 'templates', 'restaurant');
const templatePath = join(templateDir, 'template.yaml');
let template;
try {
  const yamlMod = await import('yaml');
  const yaml = yamlMod.default;
  template = yaml.parse(readFileSync(templatePath, 'utf8'));
} catch (e) {
  console.error('Failed to parse template.yaml:', e.message);
  process.exit(1);
}

// --- 3. Build placeholder map ---
function buildPlaceholders(client, tmpl) {
  const b = client.business || {};
  const s = client.seo || {};
  const c = client.contact || {};
  const l = client.legal || {};
  return {
    'Nom': b.name || '',
    'Activite': tmpl.activityLabel || (b.category || ''),
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

// --- 4. Build data.json ---
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
if (clientData.reviews?.reviews) components.testimonials.reviews = clientData.reviews.reviews;
if (clientData.faq?.questions) components.faq.questions = clientData.faq.questions;
if (clientData.gallery?.images) components.gallery.images = clientData.gallery.images;

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

// --- 5. Create site directory ---
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

// --- 6. Generate theme.css ---
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

// --- 7. Copy pages from template ---
// Pages are at templates/restaurant/pages/*.astro
// They use $$LANG$$ marker, replaced with 'fr' or 'en'
// They import: '../data.json', '../theme.css', '@components/...', '@layouts/...', '@utils/...', '../../translations/ui.json'

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

// --- 8. Copy public assets ---
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

// --- 9. Generate robots.txt ---
writeFileSync(join(publicDir, 'robots.txt'), `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`, 'utf8');
console.log('  Created robots.txt');

// --- 10. Generate sitemap.xml ---
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

// --- 11. Build (optional) ---
if (shouldBuild) {
  console.log('\nBuilding with Astro...');
  try {
    execSync('npx astro build', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, CLIENT: slug, NODE_ENV: 'production' },
    });
    console.log(`\nBuild complete! Output: dist/${slug}/`);
  } catch (e) {
    console.error('\nBuild failed. Check errors above.');
    process.exit(1);
  }
}