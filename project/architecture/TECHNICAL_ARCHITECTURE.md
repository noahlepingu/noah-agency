# TECHNICAL_ARCHITECTURE.md — Architecture technique du systeme de production

Version : 0.1 (Phase 1 — Design & Architecture)
Porteur : Solution Architect (AGENT 04)
Statut : PROPOSE — a valider par Noah (Gate 1/2).
Reference : STACK.md (decision Astro), DESIGN_SYSTEM_SPECS.md (tokens/composants),
SITEMAP_MASTER.md (pages/slots), CLIENT_DATA_SCHEMA.md (donnees client),
SEO_SYSTEM.md (SEO local), TEMPLATE_VISION.md (templates secteurs), UX.md (etats speciaux).

---

## 1. Principes d'architecture

1. **Statique par defaut** : chaque site client est un ensemble de fichiers
   HTML/CSS/JS generes au build. Zero serveur, zero base de donnees, zero runtime.
2. **Configuration + contenu + design** (cahier des charges section 8) : tout
   ecart au standard est identifie et chiffre avant engagement, jamais code ad hoc
   dans la base.
3. **Simplicite** (Agent 04) : on n'ajoute une technologie que si elle repond a
   un besoin reel non couvert plus simplement. Aucune des exclusions du STACK.md
   (DB, API, Docker, CMS) n'est reintroduite sans ADR.
4. **Zero traceur par defaut** (D-LG-05) : pas de cookie non necessaire ; les
   tiers sont configures, pas imposes.
5. **SEO comme fonctionnalite produit** (D-CS-04) : metadata, JSON-LD, sitemap,
   robots generes systematiquement au build.
6. **Donnees jamais inventees** (D-CS-02, NFR-INTEG-01) : le build bloque si un
   champ REQUIRED manque ; les donnees viennent exclusivement de `client_data.yaml`.

## 2. Vue d'ensemble

```text
                    BASE DE PRODUCTION (depot unique)
┌────────────────────────────────────────────────────────────────────┐
│  src/            composants, layouts, styles, utils, traductions   │
│  templates/      definitions par secteur (pages, sections, defauts)│
│  schemas/        JSON Schema de validation client_data.yaml        │
│  scripts/        validate -> generate -> build -> deploy           │
└───────────────────────────┬────────────────────────────────────────┘
                            │  client_data.yaml (source unique)
                            ▼
        ┌─────────────────────────────────────────────────┐
        │  GENERATION (scripts/generate-site.mjs)         │
        │  1. valider (REQUIRED bloquent)                 │
        │  2. mater dans src/sites/<slug>/                │
        │      pages + theme.css + data.json              │
        │  3. astro build -> dist/<slug>/                 │
        └─────────────────────────────────────────────────┘
                            ▼
        preview local -> GATE 3 (Noah + client) -> GATE 4 (Noah)
                            ▼
        DEPLOY (scripts/deploy-site.mjs) vers hebergeur statique gratuit
```

Un **site client** = `content/clients/<slug>/client_data.yaml` + template choisi
+ assets images. Le meme code source produit tous les clients ; le build est
rejoue a chaque modification du fichier client ou de la base.

## 3. Structure du depot

```text
noah-agency/
├── astro.config.mjs            # lit l'env CLIENT (slug) ; outDir dist/<slug>
│                               # srcDir src/sites/<slug> ; publicDir assets client
├── package.json                # scripts : validate, build:site, preview, deploy
├── schemas/
│   └── client_data.schema.json # JSON Schema du client_data.yaml (D-CS-01)
├── scripts/
│   ├── validate-client.mjs     # validation REQUIRED/SHOULD/COULD + rapport
│   ├── generate-site.mjs       # assemble src/sites/<slug> depuis template+config
│   └── deploy-site.mjs         # Gate 4 puis publication statique
├── src/                        # = BASE DE PRODUCTION (partagee, jamais dupliquee)
│   ├── components/             # 15 composants DS + specifiques secteurs
│   ├── layouts/                # BaseLayout, ContentLayout, LegalLayout, FormLayout
│   ├── styles/                 # tokens.css, base.css, utilities.css
│   ├── utils/                  # seo.js, schema.js, forms.js, i18n.js, hours.js
│   ├── translations/           # fr.json, en.json (chaines UI + etats speciaux)
│   └── sites/                  # GENEREE par script (gitignoree)
├── templates/
│   └── restaurant/             # template flagship (v1)
│       ├── template.yaml       # pages, sections, CTA, palette/fonts/FAQ par defaut
│       ├── pages/              # definitions de pages (composants + ordre)
│       └── content/            # textes par defaut a placeholders (CONTENT_LIBRARY)
├── content/
│   └── clients/
│       └── <slug>/
│           ├── client_data.yaml
│           └── assets/         # logo, hero, galerie, og-image (1200x630)
├── dist/                       # builds (gitignoree)
└── public/                     # favicon.svg, robots/404 par defaut, fallbacks
```

Regles : `src/sites/` et `dist/` sont regenerables a tout moment (jamais
commites). Tout ce qui est partage vit dans `src/` (importe par alias
`@components`, `@layouts`, `@styles`, `@utils`). Les templates ne contiennent
que de la **configuration et du contenu**, pas de logique metier.

## 4. Pipeline de generation d'un site client

```text
npm run validate  -- --client <slug>   # rapport champs manquants ; bloque si REQUIRED
npm run build:site -- --client <slug>  # generate + astro build -> dist/<slug>/ + preview
# GATE 3 : Noah + client valident la preview (design, contenu, fonctionnement)
npm run deploy    -- --client <slug>   # GATE 4 : Noah autorise explicitement, puis publication
```

Etapes detaillees de `generate-site.mjs` :

1. **Valider** `content/clients/<slug>/client_data.yaml` contre
   `schemas/client_data.schema.json` (ajv) : formats (regex), enums, obligations
   contextuelles (restaurant -> menu ; vitrine_reservation -> reservation ; B2C ->
   mediateur). Produit le rapport REQUIRED/SHOULD/COULD (CLIENT_DATA_SCHEMA.md).
   **Le build refuse de continuer** si un champ REQUIRED est vide.
2. **Mater** `src/sites/<slug>/` : pages .astro generees depuis
   `templates/<type>/pages/` (slots de sections SITEMAP_MASTER.md §5 activees par
   le package) ; `data.json` (conversion YAML -> JSON importable) ; `theme.css`
   (tokens de marque depuis `branding`).
3. **Build** : `astro build` avec `CLIENT=<slug>` (config Astro fixe
   `srcDir`, `outDir`, `publicDir`, `site`). Sortie : `dist/<slug>/`.
4. **Rapport de generation** : pages creees, images optimisees, champs
   SHOULD manquants, rappel du contenu a faire valider par Noah (FR-SEO-05).

Le mecanisme est volontairement **un build Astro par client** : isolé, annulable
(suppression de `src/sites/<slug>`), rejouable, et sans impact sur les autres
clients. Details d'implementation (alias, config) a ajuster en Phase 2 par le
frontend/backend engineer, sans changer le contrat ci-dessus.

## 5. Systeme de composants

### 5.1 Composants generiques (design system, DESIGN_SYSTEM_SPECS.md §5)

Header, Footer, Hero, CTA, ContactForm, Gallery, Testimonials, Pricing, FAQ,
Map, Menu, OpeningHours, SocialLinks, CookieBanner, LanguageSwitcher.

### 5.2 Composants specifiques par secteur (TEMPLATE_VISION.md)

- Restaurant : MenuCard, ReservationForm, WineList, HoursBlock.
- Artisan : DevisForm, RealisationCard, ServiceCard.
- Commerce : ProductCard, CategoryFilter, PromoBanner.
- Independant : RDVForm, PrestationCard, TarifBlock.
- Association : AdhesionForm, EventCard, ActionCard.

### 5.3 Regles de construction

- Un composant = un fichier `.astro` PascalCase (`Header.astro`, `MenuCard.astro`).
- **Props typees** (JSDoc ou TypeScript) conformes au catalogue UX (nommage des
  props identique aux specs) ; les valeurs proviennent du `data.json` client ou
  des textes par defaut du template.
- **Etats** : default, hover, focus, disabled, loading, error, success, empty —
  chaque etat est CSS d'abord, JS seulement si interaction.
- **Accessibilite** : label, ARIA, focus, contraste — conforme UX.md §5 et
  WCAG 2.2 AA (validation accessibility-specialist en Phase 4).
- **Zero JS par defaut** : le composant n'embarque de script (island) que si une
  interaction l'exige (burger, formulaire, accordion, cookie banner, switcher).
- Classes CSS prefixees `ds-` (`ds-header`, `ds-header__nav`) pour eviter toute
  collision avec le contenu client ; les tokens UX (`--space-*`, `--color-*`,
  `--radius-*`, `--text-*`, `--bp-*`, `--z-*`, `--shadow-*`, `--transition-*`)
  sont la seule source de valeurs (DESIGN_SYSTEM_SPECS.md §2).

## 6. Design tokens et theming

- `src/styles/tokens.css` : tokens fondationnels et fonctionnels (UX §2 et §4.1),
  **jamais modifies par un client**.
- `theme.css` (genere par client) : redefinit uniquement les tokens de marque
  depuis `branding` : `--color-primary|secondary|accent` + variantes, et les
  familles/poids de polices (UX §4.1). Injection via une feuille chargee apres
  `tokens.css` — **aucun composant ne change** d'un client a l'autre.
- Palettes et typographies par defaut par template (restaurant rouge/dore +
  Playfair Display/Inter) : dans `templates/<type>/template.yaml`, surchargeables
  par le client. Contraste >= 4.5:1 verifie avant validation (UX §4.2).
- Polices **self-hosted** (woff2, `font-display: swap`, preload) : zero appel
  tiers, performance et RGPD (SEO_SYSTEM.md §10.2).

## 7. SEO (aligne sur SEO_SYSTEM.md)

Utilitaires dans `src/utils/` :

- `seo.js` : construit le bloc metadata de chaque page — title (patterns
  SEO_SYSTEM §4.1), meta description, canonical, robots (`index,follow` par defaut ;
  `noindex` sur 404/500/construction), Open Graph + Twitter Card (1200x630) ;
  - champ `seo.domain` attendu dans `client_data.yaml` (voir points ouverts) ;
- `schema.js` : generateurs JSON-LD par page — LocalBusiness/Restaurant/NGO,
  Menu/MenuSection/MenuItem, OpeningHoursSpecification (mapping jours FR->EN),
  GeoCoordinates, AggregateRating/Review (avis reels uniquement, D-CS-06),
  FAQPage, BreadcrumbList, ContactPoint (SEO_SYSTEM §3) ;
- sitemap.xml : `@astrojs/sitemap` (site = domaine client) ; robots.txt genere
  avec `Sitemap:` — SEO_SYSTEM §6.4/6.5 ;
- URLs lisibles : slugs du SITEMAP_MASTER §7 (`/menu`, `/a-propos`, `/reservation`) ;
  breadcrumb BreadcrumbList sur toutes les pages sauf accueil.

## 8. Formulaires

### 8.1 Architecture (solution la plus simple : endpoint tiers configurable)

- **Un contrat unique** : le formulaire POST en `application/x-www-form-urlencoded`
  ou JSON vers un endpoint HTTPS defini dans la configuration du site
  (`contact.form_endpoint`, `reservation.form_endpoint`).
- **Reference v1 : service de formulaire gratuit** (classe Formspree / Web3Forms) :
  zero code serveur a maintenir, fonctionne sur n'importe quel hebergeur statique,
  plan gratuit suffisant pour un restaurant/artisan (< 50-250 envois/mois).
  Le service est declare comme **sous-traitant** dans PRIVACY_REQUIREMENTS
  (dependance legal) ; ses limites (quotas) sont documentees.
- **Fallback documente** : fonction serverless Cloudflare Pages Functions branchee
  sur le meme endpoint (ADR-003) si le plan gratuit est depasse — les composants
  ne changent pas.
- **Progressive enhancement** : sans JS, la soumission native POST aboutit sur une
  page de confirmation statique ; avec JS, `fetch` -> confirmation inline
  (UX.md §4.5 : role="status", reset du formulaire).
- **Anti-spam** : honeypot + validation cote client + anti-spam du service.
  Pas de reCAPTCHA par defaut (script/cookies tiers — contradictoire avec
  zero-traceur D-LG-05) ; re-evaluable si spam constate (ADR-003).
- **Mentions CNIL** (FR-LEGAL-06) : finalite, base legale, destinataires, duree,
  droits — texte genere depuis `content` (bibliotheque legale) et affiche dans le
  composant ; lien vers la politique de confidentialite.
- **Aucun stockage cote systeme** : l'agence ne conserve rien ; la duree est
  celle du service tiers (FR-FORM-04, PRIVACY_REQUIREMENTS).

### 8.2 Cas particuliers

- **Reservation v1 = formulaire simple** (D-PM-07) : creneaux statiques depuis
  `reservation.slots` (optionnel) + `opening_hours` + `closed_periods`. A la
  soumission, le JS verifie la date : jour ferme (`closed: true` ou absent) ou
  periode de fermeture ou creneau hors liste -> etat **« Aucun creneau
  disponible »** (UX.md §4.3) avec 2 actions : choisir une autre date / appeler.
  Sinon, envoi au service tiers + confirmation recapitulative (UX.md §4.6).
- **method = phone_only | external_link** (CLIENT_DATA_SCHEMA §11) : le composant
  affiche un lien tel: ou un lien externe au lieu du formulaire.
- **Erreurs** : par champ (aria-invalid, message sous le champ) + global
  (role="alert", liens ancres) — UX.md §4.4.
- **DevisForm / RDVForm / AdhesionForm** : memes regles, champs specifiques par
  secteur (formulaires multi-usage d'un composant `Form` generique).

### 8.3 Formulaire et cookies

Le formulaire et son envoi ne posent **aucun cookie**, aucun traceur : conforme
au zero-traceur par defaut. Les donnees partent au service tiers (documente).

## 9. Multilingue (FR + EN optionnel)

- **FR par defaut** : pages a la racine (`/`, `/menu`, `/contact`...).
- **EN basique** (option `template.multilingual: true`) : pages cles uniquement
  (accueil, contact, a propos — SITEMAP_MASTER §4), routes `/en/...`.
- Mecanisme : Astro i18n (`locales: ['fr', 'en']`, defaultLocale fr) ; fichiers
  `src/translations/fr.json` / `en.json` (chaines UI, etats speciaux, navigations) +
  textes de section traduits par defaut dans les templates ; champs EN du client
  (ex. `business.description_en`) documentes comme COULD dans le schema.
- **SEO** : hreflang fr/en/x-default->fr ; canonical toujours vers la page FR
  (SEO_SYSTEM §9) ; sitemap multilingue.
- **LanguageSwitcher** : dans le header (DESIGN_SYSTEM_SPECS §5.15) ; persistance
  en **localStorage** (pas de cookie -> pas de consentement requis).

## 10. Cookies et consentement

- Aucun cookie de navigation propre ; aucun traceur tiers par defaut (D-LG-05).
- Le **CookieBanner n'est rendu que si** la configuration du site declare des
  tiers (`third_party: [...]` non vide : map google, analytics, video, ...).
- Choix persisté en localStorage (6 mois) ; 3 options (tout accepter / tout
  refuser / personnaliser), refus aussi facile que l'acceptation (CNIL).
- Les scripts tiers (ex. map Google si un client l'exige) ne se chargent
  qu'apres consentement — pattern documente dans `utils/consent.js`.

## 11. Carte (map)

- **Reference : OpenStreetMap** — integration legere (iframe OSM ou Leaflet
  vanilla, tiles OSM) **sans cookie**, gratuite, deuxieme arbitrage : l'iframe OSM
  est la solution la plus simple (zero dependance JS) ; Leaflet si un rendu plus
  riche est demande. Fallback accessible : coordonnees en texte + lien
  « Voir sur la carte » (SEO_SYSTEM §2.2, UX §5.5).
- `hasMap` JSON-LD : URL Google Maps / OSM construite depuis lat/lng.
- **Google Maps : uniquement si le client le demande explicitement** (cookie
  requis -> banner + consentement) — arbitrage depose (ADR-007).
- Geocodage : tentative depuis l'adresse, sinon champ REQUIS (SEO_SYSTEM §2.2).

## 12. Conventions de code

| Sujet | Convention |
| ----- | ---------- |
| Fichiers | kebab-case (`contact-form/`) ; composants PascalCase (`Header.astro`) |
| CSS | classes prefixees `ds-` ; tokens UX uniquement ; BEM leger (`ds-header__nav`) |
| Donnees | `client_data.yaml` source unique ; conversion `data.json` au build |
| Images | `astro:assets` (WebP, lazy-loading, dimensions declarees, alt obligatoire) |
| JS | vanilla, ES modules, pas de jQuery ; islands Astro uniquement |
| Accessibilite | labels visibles, focus, ARIA selon UX.md §5 ; skip link dans BaseLayout |
| Erreurs | etats speciaux UX.md §4 systematiques (404.html, 500, construction, etc.) |
| Git | pas de secrets ni .env (endpoints publics uniquement) ; .gitignore `src/sites`, `dist` |
| Pages 500 | statique : `404.html` servi par l'hebergeur ; page 500 incluse dans la base (future fonction serverless) ; page construction = 503 selon SEO_SYSTEM §4.4 |

## 13. Dependances et interactions

- **content-seo** : ajout propose au schema `seo.domain` (REQUIRED au build pour
  canonical/sitemap/OG) et champs EN optionnels (voir points ouverts).
- **legal-compliance** : service de formulaire tiers a inscrire comme
  sous-traitant dans PRIVACY_REQUIREMENTS ; hebergeur des sites a nommer dans les
  mentions legales (identite reelle fournie par devops).
- **devops-engineer** : hebergeur statique (ADR-005), domaine, HTTPS, rollback.
- **security-engineer** : validation cookies (OSM sans cookie), anti-spam,
  headers HTTP, dependances auditees.
- **accessibility/performance** : audits par build statique en Phase 4.
- **database-engineer** : confirmer l'absence de DB (ADR-009).

## 14. Points ouverts

1. **Ajout `seo.domain`** au client_data.yaml (necessaire pour canonical,
   sitemap, OG) — proposition a content-seo et Noah.
2. **Service de formulaire concret** (Formspree/Web3Forms/autre) : choisi avec le
   1er client, apres verification RGPD du prestataire.
3. **Hebergeur final des sites** : decision devops (Cloudflare Pages reference).
4. **Validation AGENT 07** : pas de base de donnees pour v1.
5. **Polices/familles definitives** : Gate 2 Noah (UX recommande Inter +
   Playfair Display) ; implementation self-hosted.
6. **Analytics sans cookie** (Plausible/Umami) uniquement si un client le demande
   (ADR-008) — aucune par defaut.