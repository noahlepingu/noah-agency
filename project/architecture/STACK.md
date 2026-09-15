# STACK.md — Decision de stack pour la base de production

Version : 0.1 (Phase 1 — Design & Architecture)
Porteur : Solution Architect (AGENT 04)
Statut : PROPOSE — a valider par Noah (Gate 1/2).
Reference : cahier des charges sections 8-11 + Agent 04 (principe de simplicite) ;
REQUIREMENTS.md (NFR-PERF, NFR-BUDGET, FR-SEO) ; DESIGN_SYSTEM_SPECS.md (tokens CSS).

---

## 1. Ce que le systeme doit produire

Le systeme genere des **sites statiques** multi-clients depuis une base unique :

- aucune base de donnees par defaut (a confirmer par AGENT 07) ;
- rapides (Core Web Vitals verts, NFR-PERF-01 : LCP < 2,5 s, CLS < 0,1, INP < 200 ms) ;
- themables par template secteur + fichier `client_data.yaml` (FR-DATA-01) ;
- avec formulaires (contact, reservation, devis) — solution la plus simple ;
- SEO local integre des la conception (JSON-LD, metadata, sitemap, robots — SEO_SYSTEM.md) ;
- deployables gratuitement ou a faible cout (NFR-BUDGET-01) ;
- FR par defaut, EN basique sur les pages cles en option (FR-I18N-01) ;
- reutilisables : prochain site = configuration + contenu + design (cahier des charges section 8).

## 2. Criteres de choix

| Critere | Importance | Detail |
| ------- | ---------- | ------ |
| Sortie 100 % statique | MUST | Pas de serveur, pas de DB, hebergement gratuit |
| Zero JS par defaut | MUST | Le JS ne charge que si necessaire (interactions) |
| Systeme de composants | MUST | Les 15 composants du design system (props, etats, a11y) |
| Pilote par des donnees | MUST | `client_data.yaml` alimente directement les pages |
| i18n FR + EN optionnel | SHOULD | Routing /en, hreflang, fichiers de traductions |
| SEO integre | SHOULD | Sitemap, metadata, JSON-LD, images optimisees |
| Simplicite de maintenance | MUST | Peu de concepts, build reproductible |
| Couts | MUST | 0 EUR de licence, hebergement gratuit |

## 3. Analyse comparee (synthese)

| Option | Type | Statique | Composants | Pilote donnees | i18n | JS client | Verdict |
| ------ | ---- | -------- | ---------- | -------------- | ---- | --------- | ------- |
| **Astro** | SSG composants | Oui (defaut) | Natif (.astro, props) | Excellente | Integre | 0 par defaut (islands) | **CHOISI** |
| Eleventy | SSG minimal | Oui | Partiels/macros manuels | Excellente (_data) | Plugin | 0 | Alternative sobre |
| Next.js | Framework React | Possible (export) | React | Moyenne | Integre | React 100 % | Refuse (lourd) |
| Vite + vanilla | Build front | Non (a construire) | A ecrire | A construire | A construire | Selon travail | Refuse (trop manuel) |
| Hugo | SSG Go | Oui | Templates Go | Bonne (YAML) | Integre | 0 | Refuse (ecosysteme) |

### Pourquoi pas

- **Next.js** : le contre-exemple exact du cahier des charges (Agent 04) : React,
  SSR/API, poids. Meme en export statique, il apporte un framework d'application
  la ou un SSG suffit. Refuse.
- **Vite + vanilla** : rien d'inclus (routing, i18n, SEO, images) ; tout serait a
  developper a chaque projet. Refuse.
- **Hugo** : excellent mais composants en Go (moins naturel pour l'equipe et les
  agents d'IA), systeme de composants moins riche que .astro. Refuse (documente).
- **Eleventy** : valide techniquement ; repertoires de layouts/composants plus
  restreints. Conserve comme **fallback « zero-dependance »** documente (ADR-001).

## 4. DECISION

### Stack de la base de production : **Astro (SSG statique)**

- **Astro** en mode `output: 'static'` (par defaut) : chaque site client est une
  build statique — HTML + CSS + un peu de JS uniquement pour les composants
  interactifs (islands : menu burger, formulaires, FAQ accordion, cookie banner).
- **Aucun framework UI** (React/Vue/Svelte) dans les composants : HTML + CSS purs.
- **Node.js LTS** comme seul runtime de build (gratuit, standard).
- Aligne sur D-UX-07 (design system framework-agnostic : le moteur de rendu
  n'impose aucune discipline de style, tokens CSS custom properties).

### Ce que la stack n'inclut PAS (et pourquoi)

| Technologie | Decision | Raison |
| ----------- | -------- | ------ |
| Base de donnees | NON en v1 | Site vitrine : aucune donnee dynamique a stocker (ADR-009) |
| API / routes serveur | NON | Rien a servir dynamiquement |
| Redis / cache serveur | NON | Inutile sur du statique servi par CDN |
| Docker | NON | Build local + deploy statique suffisent |
| Microservices | NON | Un seul build par site |
| CMS | NON | Contenu gere par l'agence via `client_data.yaml` (SCOPE.md OUT) |

### Dependances principales (indicatives, package.json)

| Dependance | Role | Cout |
| ---------- | ---- | ---- |
| `astro` (stable >= 5) | SSG, routing, i18n, composants | MIT, gratuit |
| `@astrojs/sitemap` | sitemap.xml | MIT, gratuit |
| `@astrojs/check` + `typescript` | Typage des props | MIT, gratuit |
| `yaml` | Lecture de `client_data.yaml` (scripts) | MIT, gratuit |
| `ajv` | Validation JSON Schema du fichier client | MIT, gratuit |
| `sharp` (via `astro:assets`) | Optimisation images (WebP, dimensions) | Apache, gratuit |
| Inter / Playfair Display | Self-hosted en woff2 dans `/public` | OFL, gratuit |

Pas de librairie d'icones imposee : **icones SVG inline** (zero dependance,
accessibles via aria-hidden, legeres) — tranche le point ouvert UX n°19.

## 5. Budget

- **Couts systeme : 0 EUR** — Astro, plugins, Node, validation : open-source/MIT.
- Polices : telechargees une fois puis servies depuis le site (self-hosted ;
  aucun appel a Google Fonts, benefice RGPD + performance).
- Hebergement des sites clients : **offre gratuite d'un hebergeur statique**
  (ADR-005 : Cloudflare Pages en reference ; Netlify, GitHub Pages documentes).
- Couts potentiels futurs (documentes avant engagement, D-PM-10) : domaine du
  client (~10-15 EUR/an, a la charge du client), service tiers de formulaire si
  le plan gratuit est depasse, outil de monitoring si besoin.

## 6. Alternatives documentees (filet de securite)

- **Eleventy** : si Astro devenait problematique, la base (composants
  HTML/CSS/JS vanilla, tokens CSS, donnees YAML) est reutilisable telle quelle ;
  seuls les gabarits `.astro` seraient portes en Nunjucks (ADR-001).
- **Service de formulaire tiers** remplacable par une fonction serverless
  (Cloudflare Pages Functions) sans toucher aux composants (ADR-003).
- **Hebergeur** interchangeable car sortie 100 % statique (ADR-005).

## 7. Dependances vers les autres agents

- **database-engineer (AGENT 07)** : confirmer « pas de base de donnees » pour
  le perimetre v1 (ADR-009).
- **frontend-engineer** : implementation Astro conforme a ce document ; aucun
  framework UI ; islands uniquement pour les composants interactifs.
- **backend-engineer** : integration formulaire (endpoint configurable, ADR-003).
- **devops-engineer** : choix final de l'hebergeur statique (ADR-005) + identite
  de l'hebergeur pour les mentions legales des sites clients.
- **security-engineer** : validation absence de cookies par defaut (ADR-007/008).
- **qa / accessibility / performance** : audits sur une build statique de chaque
  template (Phase 4).