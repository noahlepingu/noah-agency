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
# Codes sortie (CLIENT_DATA_VALIDATION.md §2.2) :
#   0 = VALIDATION OK          4 = FICHIER INTROUVABLE
#   1 = ERREUR YAML            2 = EN ATTENTE DE DONNEES (REQUIRED manquants)
#   3 = ERREUR FORMAT           (SHOULD/COULD ne changent jamais le code)
# Rapport : dist/<slug>/validation-report.md (console + fichier)
```

## Tests

```bash
npm test   # node --test tests/*.test.mjs (validation, reservation, forms)
```

## Formulaires (contact + reservation)

- **Aucun backend serveur** (ADR-003) : envoi vers un endpoint tiers
  (Formspree / Web3Forms) si configure, sinon **fallback mailto**.
- Configuration par client dans `client_data.yaml` :
  `contact.form_endpoint` et `reservation.form_endpoint` ("" = mailto).
- Reservation : creneaux statiques (slots explicites filtres par les plages
  d'ouverture, sinon generation 30 min) — etat « aucun creneau » dedie.
- Logique partagee : `src/utils/forms.js` + `src/utils/reservation.js`
  (fonctions pures). Documentation : `project/backend/FORMS_ARCHITECTURE.md`.

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
│   ├── utils/               # SEO, schema, forms, reservation, hours, etc.
│   └── sites/<slug>/        # Sites generees (gitignore)
├── templates/
│   └── restaurant/          # Template flagship
│       ├── template.yaml    # Configuration du template
│       ├── content/         # Textes FR/EN avec placeholders
│       └── pages/           # Pages .astro avec $$LANG$$
├── content/
│   └── clients/<slug>/      # client_data.yaml par client
├── scripts/                 # generate, validate, validation-core, tests, etc.
├── tests/                   # Tests unitaires node:test (forms, reservation, validation)
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