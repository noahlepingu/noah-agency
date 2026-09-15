# noah-agency — Systeme de production de sites web

Base de production Astro pour sites statiques multi-clients (template flagship : restaurant).

## Prerequis

- Node.js >= 20.3.0
- npm

## Installation

```bash
npm install
```

## Generer un site client

```bash
# Generer le site exemple (src/sites/exemple-restaurant/)
npm run generate:example

# Generer depuis un client_data.yaml custom
npm run generate -- --client <slug>
```

Le script `generate-site.mjs` :
1. Valide `content/clients/<slug>/client_data.yaml`
2. Fusionne les donnees client avec le template restaurant
3. Remplit les placeholders [Nom], [Ville], etc.
4. Genere `src/sites/<slug>/` (pages, data.json, theme.css, public/)
5. Genere robots.txt et sitemap.xml

## Build

```bash
# Build le site exemple
npm run build:example

# Build + generate en une seule commande
npm run build:example

# Output : dist/<slug>/
```

## Valider les donnees client

```bash
npm run validate -- --client <slug>
# Codes sortie : 0=valide, 2=erreurs, 3=warnings
```

## Contraste

```bash
npm run contrast -- --client <slug>
```

## Polices (optionnel)

```bash
npm run setup  # Telecharge les polices Google Fonts dans fonts-cache/
```

## Structure

```
noah-agency/
├── src/
│   ├── components/          # Composants Astro (Header, Footer, Hero, etc.)
│   ├── layouts/             # BaseLayout, PageLayout, LegalLayout
│   ├── styles/              # Design tokens, base, utilities
│   ├── translations/        # ui.json (FR/EN)
│   ├── utils/               # SEO, schema, forms, hours, etc.
│   └── sites/<slug>/        # Sites generees (gitignore)
├── templates/
│   └── restaurant/          # Template flagship
│       ├── template.yaml    # Configuration du template
│       ├── content/         # Textes FR/EN avec placeholders
│       └── pages/           # Pages .astro avec $$LANG$$
├── content/
│   └── clients/<slug>/      # client_data.yaml par client
├── scripts/                 # generate, validate, fetch-fonts, etc.
├── public/                  # Assets partages (favicon)
└── fonts-cache/             # Polices telechargees (optionnel)
```

## Architecture

- **ADR-002** : Pipeline valider -> generer -> build -> dist/<slug>
- **Budget 0EUR** : aucune dependance payante (Astro + YAML uniquement)
- **WCAG 2.2 AA** : contraste >= 4.5:1, focus visible, ARIA, skip-link
- **SEO** : JSON-LD, sitemap.xml, robots.txt, canonical, hreflang, OG
- **Pas de cookies tiers** : OpenStreetMap (iframe, pas de tracking)
- **Multilingue** : FR + EN (pages cles dupliquees avec $$LANG$$)