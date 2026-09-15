// astro.config.mjs — Configuration Astro par client.
//
// Un build Astro est execute PAR client : l'environnement CLIENT=<slug>
// determine srcDir / publicDir / outDir / site (domaine du client).
// Le dossier src/sites/<slug>/ est MATERIALISE par scripts/generate-site.mjs
// (ADR-002 : valider -> generer -> build -> dist/<slug>).
//
// Reference : project/architecture/TECHNICAL_ARCHITECTURE.md §3-4, STACK.md (ADR-001).

import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const client = (process.env.CLIENT || 'exemple-restaurant').trim();

// Slug valide : minuscules + tirets (anti path traversal, cf. CLIENT_DATA_VALIDATION.md §3.2)
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(client)) {
  throw new Error(`CLIENT invalide : "${client}" (slug attendu : minuscules + tirets).`);
}

const cwd = process.cwd();
const siteDir = path.join(cwd, 'src', 'sites', client);

// Domaine par defaut (dev) — surcharge par le client_data.yaml genere en data.json
let site = 'https://exemple-restaurant.demo';
const dataFile = path.join(siteDir, 'data.json');
if (fs.existsSync(dataFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    if (data && data.seo && typeof data.seo.domain === 'string' && data.seo.domain) {
      site = `https://${data.seo.domain}`;
    }
  } catch {
    // data.json corrompu -> on garde le domaine par defaut (dev local uniquement)
  }
}

export default defineConfig({
  site,
  srcDir: siteDir,
  publicDir: path.join(siteDir, 'public'),
  outDir: path.join(cwd, 'dist', client),
  output: 'static',
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  vite: {
    resolve: {
      alias: {
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@translations': fileURLToPath(new URL('./src/translations', import.meta.url)),
      },
    },
  },
});