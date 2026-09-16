# Etat d'avancement du projet

Mis a jour a chaque tache livree. Derniere mise a jour : 2026-09-16 (Phase 6 — Corrections : toutes les corrections du CODE_REVIEW − B1/B2, M1-M7, m1-m9 − livrees et verifiees ; build 16 pages OK, 30 tests OK ; reste Phase 7 = Final Review).

## Vue d'ensemble

| Phase | Intitule | Statut | Responsable principal |
| ----- | -------- | ------ | --------------------- |
| 0     | Discovery (PM, UX, Content/SEO, Legal) | FAIT (propositions validees Gate 1/2 partielles) | PM / UX / Content / Legal |
| 1     | Design & Architecture (UX DA, Solution Architect) | FAIT (architecture PROPOSEE et validee comme hypothese) | UX / Architect |
| 2     | Developpement (frontend, backend, database) | FAIT (base Astro, validation, formulaires, 30 tests OK) | Developpeurs |
| 3     | Infrastructure (DevOps) | FAIT (CI/CD GitHub Actions, hebergement Cloudflare Pages documente, monitoring, sauvegardes/rollback, maintenance operationnelle) | DevOps |
| 4     | Qualite (QA, accessibilite/perf, securite) | FAIT (QA FAIT ; accessibilite/perf FAIT ; securite FAIT — verdict OK SOUS CONDITIONS) | QA / Specialists |
| 5     | Code Review | FAIT (revue independante livree : base saine, 2 BLOCKER + 7 MAJEURS + 9 MINEURS documentes) | Code Reviewer |
| 6     | Corrections | FAIT (toutes les corrections B1/B2, M1-M7, m1-m9 livrees et verifiees — build 16 pages OK, 30 tests OK) | Developpeurs |
| 7     | Final Review | EN ATTENTE | Final Reviewer |
| 8     | Production | EN ATTENTE (depend de l'URL GitHub + compte Cloudflare) | DevOps |
| 9     | Post-deploiement + maintenance | EN ATTENTE | QA / PM / DevOps |

## Historique des taches

| Date | Tache | Agent | Statut | Detail |
| ---- | ----- | ----- | ------ | ------ |
| 2026-09-15 | Initialisation du depot et de la source de verite | Tech Lead | FAIT | README, PROJECT_STATUS, DECISIONS, structure /project, depot git initialise. 14 sous-agents crees conformes aux AGENT 01-14 du cahier des charges. |
| 2026-09-15 | Phase 0 — Livrables Product Manager | PM | FAIT (PROPOSE) | REQUIREMENTS, USER_STORIES, SCOPE, ROADMAP, BUSINESS_PROCESS, KPIS livres dans product/ ; decisions D-PM-01 a 10 actees dans DECISIONS.md. **En attente de la validation Noah (Gate 1) sur : perimetre, prix packages, CLIENT_TYPE, cibles KPI, template flagship, budget.** |
| 2026-09-15 | Phase 0 — Livrables UX Designer | UX | FAIT (PROPOSE) | SITEMAP_MASTER, UX, DESIGN_SYSTEM_SPECS, TEMPLATE_VISION livres dans design/ux/ ; decisions D-UX-01 a 14 actees dans DECISIONS.md. **En attente de la validation Noah (Gate 1/2) sur : sitemap, navigation, mobile UX, etats speciaux, accessibilite, design system (tokens, polices, palettes, composants), templates par secteur.** |
| 2026-09-15 | Phase 0 — Livrables Legal/Compliance | Legal | FAIT (PROPOSE) | LEGAL_BUSINESS, CONTRACT_TEMPLATES, PRIVACY_REQUIREMENTS_TEMPLATE, LEGAL_SITE_TEMPLATES livres dans content/legal/ ; decisions D-LG-01 a 08 actees dans DECISIONS.md. **En attente de la validation Noah (Gate 1) sur : statut juridique (EI), CA previsionnel / regime TVA, CLIENT_TYPE formel, donnees d'identite, verification professionnelle des CGV.** |
| 2026-09-15 | Phase 0 — Livrables Content/SEO | Content/SEO | FAIT (PROPOSE) | CLIENT_DATA_SCHEMA, SEO_SYSTEM, CONTENT_LIBRARY, CONTENT_GUIDELINES livres dans content/ ; decisions D-CS-01 a 10 actees dans DECISIONS.md. **En attente de la validation Noah (Gate 1/2) sur : format fichier client (YAML), structure du schema, types schema.org, patterns metadata, FAQ sectorielle, ton/limites textes, map provider, analytics.** |
| 2026-09-15 | Phase 1 — Livrables Solution Architect | Architect | FAIT (PROPOSE) | STACK (Astro SSG statique), TECHNICAL_ARCHITECTURE (structure base, generation multi-clients, composants, tokens, SEO, formulaires, i18n, cookies, conventions), ADR-01 a 10, MAINTENANCE_PLAN livres dans architecture/ ; decisions D-ARC-01 a 11 actees dans DECISIONS.md. **En attente de la validation Noah (Gate 1/2) : stack, generation, formulaires, deploiement, map, analytics, maintenance.** Points ouverts n°37-42. |
| 2026-09-15 | **Gate 1/2 — Validation Noah** | Noah / Tech Lead | **FAIT (hypotheses validees « pour l'instant »)** | Noah valide : offre & prix PM (D-PM-02/06/07), CLIENT_TYPE B2B prioritaire (D-PM-03, D-LG-03), template flagship restaurant (D-PM-06, D-UX-12), budget 0 € + stack Astro (D-PM-10, D-ARC-01..11). Validation reversible avant Gate 3/4. Section dediee ajoutee dans DECISIONS.md. |
| 2026-09-15 | Phase 2 — Livrables Database Engineer | Database | FAIT (ACTE) | DATA_DECISION (validation formelle « pas de base de donnees », D-ARC-09 confirmee, conditions limites), CLIENT_DATA_VALIDATION (specs de validation YAML : types, formats, 18 contraintes croisees C-01..C-18, rapport Noah), REGISTRE_DONNEES (registre RGPD pratique : flux de donnees, durees de conservation, sous-traitant formulaire) livres dans database/ ; decisions D-DB-01 a 05 actees dans DECISIONS.md. Points ouverts n°43-45 (service de formulaire concret, durees exactes, niveau seo.domain). |
| 2026-09-15 | Phase 2 — Livrables Frontend Engineer | Frontend | FAIT (ACTE) | Base de production Astro livre : `src/` (3 layouts, 21 composants, utils SEO/schema/i18n/forms/hours/consent, translations FR/EN), `templates/restaurant/` (template.yaml + content FR/EN + 13 pages `$$LANG$$`), scripts (generate-site, validate-client, dev, preview, contrast, fetch-fonts), client exemple `exemple-restaurant` (La Table d'Essai, Lyon, données fictives). Verifications : `npm run generate:example` + `npx astro build` = **16 pages OK** (13 FR + 3 EN), `validate:example` exit 0, **aucun lien interne casse**, **aucun placeholder residuel** dans le HTML, 1 seul h1 par page. Bugs corriges en cours de livraison : CTA vides (Astro 5 `Astro.props.children` → `<slot />`), placeholders non remplis dans components (fillObject), routes `/en/*` cassees pour les pages non traduites (localizePath + translated_routes), doublon h1 pages legales (retrait heroTitle LegalLayout). Decisions D-FE-01 a 12 actees dans DECISIONS.md. Points ouverts n°46-48. |
| 2026-09-15 | Phase 2 — Livrables Backend Engineer | Backend | FAIT (ACTE) | Validation client implementee conformement a CLIENT_DATA_VALIDATION.md : `validation-core.mjs` (moteur natif sans dependance, niveaux REQUIRED/SHOULD/COULD, regles C-01..C-18, derivations, rapport markdown) + CLI `validate-client.mjs` (codes 0/1/2/3/4, format > required, rapport `dist/<slug>/validation-report.md`) + `generate-site.mjs` (validation bloquante avant generation, endpoints formulaires, mapping reviews/slots/activityLabel, rapport). Logique formulaires : `src/utils/forms.js` etendu (email/tel FR-intl, `buildFormEndpoint` http/mailto/none, `submitForm`) + `src/utils/reservation.js` (creneaux statiques purs : jours fermes, periode de fermeture, filtrage/generation 30 min, etat « aucun creneau » C-05, prochaine date). Composants : ContactForm i18n via `data-json-form`, ReservationForm avec vraie logique (fini le simulateur). Exemple `client_data.yaml` rendu conforme (category restaurant, template, services, legal_name, siren/siret, meta_description 120-160, reviews.items, reservation.slots). Tests : `npm test` = **30 tests OK** (validation/reservation/forms). Verifications : `validate:example` exit 0, `build:example` = **16 pages OK**, aucun placeholder residuel. Documentation : `project/backend/FORMS_ARCHITECTURE.md`. Decisions D-BE-01 a 07 actees dans DECISIONS.md. Points ouverts n°49-52. |
| 2026-09-15 | Phase 3 — Livrables DevOps Engineer | DevOps | FAIT (ACTE) | Infrastructure completee : **CI_CD.md** (pipeline Git -> CI -> artefact -> deploy, strategie branche unique + dossiers clients, quotas GitHub Actions gratuits), workflows **`.github/workflows/ci.yml`** (push main + PR : npm ci, 30 tests, validate:example, build:example, artefact) et **`deploy-site.yml`** (UNIQUEMENT manuel, workflow_dispatch avec slug — Gate 4 humaine : tests -> validation client code 0 -> build -> `wrangler pages deploy` -> ping HTTPS ; environment production + secrets CLOUDFLARE_*). **DEPLOYMENT.md** (Cloudflare Pages reference : config, DNS apex/www, HTTPS auto, env vars minimales, rollback dashboard, Netlify/GitHub Pages documentes, identite hebergeur Cloudflare Inc. pour mentions legales). **MONITORING.md** (UptimeRobot reference vs Better Stack compares, zero logs serveur, zero analytics par defaut ADR-008, scan liens lychee, frequences et responsabilites). **BACKUP_ROLLBACK.md** (git = sauvegarde, dist/ non sauvegarde justifie, tags releases, rollback 1-clic Cloudflare + rollback git complet, recouvrement depuis bundle). **MAINTENANCE_PLAN.md** (plan architecte applique : npm audit mensuel, renouvellement domaine alerte 60 j, checklist mensuelle concrete, procedure d'incident). **TODO_PRODUCTION.md** (checklist systeme + checklist client pre-Gate 4). **`.env.example`** a la racine. Decisions D-DEVOPS-01 a 09 actees dans DECISIONS.md. Points ouverts n°53-57 (URL GitHub, compte Cloudflare, UptimeRobot, service formulaire).
| 2026-09-15 | Phase 4 — Audit accessibilite + performance (AGENT 11) | A11y/Perf | FAIT (ACTE) | `project/docs/ACCESSIBILITY_AUDIT.md` (WCAG 2.2 AA : 4 constats bloquants — nav aria-label duplique, burger sans nom accessible, focus traps absents, back-to-top focusable cache ; 3 majeurs — contraste gray-400/success, erreurs de formulaire non annoncees ; 11 priorites au total) + `project/docs/PERFORMANCE_AUDIT.md` (budgets OK : HTML max 41,7 Ko, CSS 19,3 Ko, JS max 5,5 Ko, zero JS sur 14/16 pages ; fonts CDN render-blocking a self-hoster ; BUG bundle CSS 404/500). Decisions D-A11Y-01..07 + D-PERF-01..04 actees dans DECISIONS.md. **Corrections a realiser en Phase 6 (frontend).** Points ouverts n°58-61. |
| 2026-09-15 | Phase 4 — Livrables Security Engineer (securite + RGPD) | Security | EN COURS | Audit securite + RGPD realise : `npm audit` aggregate critique (astro@5.18.2 — RCE AVIF, SSRF Host, XSS define:vars). Zero secret expose (grep + .env + GitHub Secrets OK). Code source : 2 constats critiques (JSON-LD set:html `BaseLayout.astro:83`, Google Fonts CDN sans consentement precedent CNIL SAN-2022-004), 2 majeurs (headers HTTP, sous-traitant formulaire), 2 mineurs (Map referrer, StatePage set:html). Cookies = conforme. Formulaires = conforms. Registre = coherent. Verdict : `OK SOUS CONDITIONS` (6 conditions bloquantes Gate 4). Livrables : SECURITY_AUDIT.md, VERDICT.md, RECOMMENDATIONS.md. Decisions D-SEC-01 a 10. Points ouverts n 58-61. |
| 2026-09-15 | Phase 4 — Livrables QA Engineer | QA | FAIT (ACTE) | Campagne de tests systeme + build exemple : `npm test` **30/30 PASS**, `validate:example` exit 0 (47 champs valides), `build:example` **16 pages OK** (13 FR + 3 EN, 8,6 s), audit statique **13 PASS / 0 FAIL reel** (2 faux positifs ecartes : `[open]` CSS, assets `/_astro/*` presents). Livrables : `project/tests/` (TEST_PLAN.md, TEST_RESULTS.md, BUGS.md). **8 bugs documentes** : 2 MAJEURS (BUG-QA-01 `texts_en` jamais consomme -> pages EN en francais ; BUG-QA-03 labels nav/CTA EN en francais), 5 MINEURS (BUG-QA-02 « cuisine cuisine », Q-04 patterns `seo_title` inutilises, Q-05 description=title sur 5 pages, Q-06 script cookies charge sans tiers, Q-08 description accueil 105 car.) et 1 OBSERVATION (BUG-QA-07 generation monotype `templates/restaurant` en dur — a traiter au 2e template). Fixture artisan temporaire : validation conforme (24 REQUIRED detectes), build monotype confirme. Decisions D-QA-01 a 06 actees dans DECISIONS.md. Points ouverts n°62-64 (corrections Phase 6, verification navigateurs Gate 4, refactor generate-site au 2e template). |
| 2026-09-15 | Phase 5 — Code Review | Code Reviewer | FAIT (ACTE) | Revue independante de la base Astro, du template restaurant, du pipeline et des tests : base structurellement saine. Verdict : 2 BLOCKER confirmes (XSS JSON-LD B1, Google Fonts CDN B2), 7 MAJEURS (dont 4 decouvertes : M1 badge Ouvert/Ferme inoperant + jour fige au build, M2 min de reservation fige, M3 third_party client ignore par generate-site, M4 traductions triple source, M5 multilingue EN inexploitable, M6 piege contraste theme genere, M7 mapping jours 6x duplique) + 9 MINEURS (m1-m9). **3 priorites Phase 6 : securite/RGPD, fonctionnalites mortes du pipeline, consolidation base reutilisable.** Livrable : `project/docs/CODE_REVIEW.md`. |
| 2026-09-16 | Phase 6 — Corrections (Code Review) | Frontend + Backend | FAIT (ACTE) | **Toutes les corrections B1/B2/M1-M7/m1-m9 livrees et verifiees** : B1 XSS JSON-LD (echappement `\u003c`), B2 fonts self-hosted (retrait CDN Google), M1 statut horaires runtime (data-schedule + jour courant client), M2 min reservation au runtime, M3 third_party client fusionne (deepMerge client wins), M4 fr.json/en.json supprimes (ui.json seule source), M5 multilingue EN complet (getPageTexts + nav/CTA traduits via ui.nav — « Book a table »), M6 theme.css contraste WCAG (nouveau `scripts/color-utils.mjs` : luminance, darken HSL, pickOnColor 4.5:1 ; fin du blanc sur ambre 2.15:1 et des dark alpha CC), M7 module `src/utils/days.mjs` partage, m1 localizePath partout (fixe `localize is not defined`), m2 horaires schema centralises dans hours.js, m4 code mort supprime (consent.js, LanguageSwitcher var morte, 2e script CookieBanner), m5 chaines FR dur traduites (Gallery/Breadcrumb/plan-du-site), m6 SEO seo_titles/seo_descriptions generes depuis template.yaml, m7 script cookie conditionnel SSG (0 script sans tiers), m8 contrast-check token-based (hex 8 chiffres + paires -dark), m9 CTA rel noopener inconditionnel. **Decouverte critique corrigee** : tokens.css ecrasait le theme.css client dans la cascade → tokens de marque deplaces dans `@layer ds-brand` (theme client gagne toujours). Verifications : `npm test` 30/30, `validate:example` exit 0, `build:example` 16 pages, `contrast` all pass, 285 liens internes 0 casse, 0 placeholder, 0 double h1, nav EN traduite. Livrable : `project/docs/PHASE6_CORRECTIONS.md`. Points ouverts n°65-69 (pages legales description=title, patrons seo monolingues, contrast-check hors CI, Menu.astro fallback FR, images client reelles). |

## Prochaine etape

**Phase 7 — Final Review** : a lancer
- ~~**Phase 5 Code Review**~~ — **FAIT (CODE_REVIEW.md, 18 points documentes, 3 priorites)**
- ~~**Phase 6 Corrections**~~ — **FAIT (PHASE6_CORRECTIONS.md, B1/B2/M1-M7/m1-m9 traites, 30 tests OK, 16 pages build OK, contraste OK, 0 lien casse)**
- **final-product-reviewer** : dernier controle global avant livraison — « Est-ce que je livrerais ce site a un client ? ». Verifier : qualite visuelle, UX, contenu, fonctionnalites, performance, SEO, accessibilite, securite, legal, KPIs. S'appuie sur le build `dist/exemple-restaurant/` + tous les rapports Phase 4/5/6.

Les decisions en suspens (prix finaux, statut juridique reel, TVA reelle,
donnees identite, hebergeur nomme, service de formulaire concret, polices
definitives) restent ouvertes jusqu'aux Gates 3/4 — elles ne bloquent pas le
developpement de la base de production.

**Dependances DevOps -> autres agents :**
- **legal-compliance** : identite de l'hebergeur (Cloudflare, Inc. — D-DEVOPS-03) a integrer dans LEGAL_SITE_TEMPLATES.md §1 (mentions legales) ; identite Noah (SIREN/SIRET) toujours attendue (point ouvert n°24).
- **security-engineer** : validation zero-cookie par defaut (ADR-008), headers, secrets GitHub.
- **qa-engineer** : scan de liens `npx lychee` + tests finaux sur le build (Phase 4) ; le workflow CI execute deja validate:example + build:example (base de reference).

**Dependances Architect -> autres agents :**
- **content-seo** : ajout propose au schema `seo.domain` (canonical/sitemap/OG) +
  champs EN optionnels (point ouvert n°37).
- **legal-compliance** : service de formulaire tiers = sous-traitant a inscrire
  dans PRIVACY_REQUIREMENTS ; hebergeur final a nommer dans les mentions legales.
- **devops-engineer** : choix de l'hebergeur statique (Cloudflare Pages en
  reference, ADR-005), domaine, HTTPS, rollback.
- ~~**database-engineer (AGENT 07)** : confirmation « pas de base de donnees »
  (D-ARC-09 / ADR-009)~~ — **FAIT** : D-DB-01 a 05, livrables dans database/
  (DATA_DECISION, CLIENT_DATA_VALIDATION, REGISTRE_DONNEES).
- **security-engineer** : validation zero-cookie par defaut, anti-spam, headers.
- **frontend/backend-engineer** : implementation Astro conforme (STACK.md,
  TECHNICAL_ARCHITECTURE.md), contrat de generation et de formulaires.

**Dependances UX -> autres agents :**
- **content-seo** : contenus des pages (textes, images, metadata, FAQ, SEO local).
- **solution-architect** : faisabilite technique des formulaires, reservation, multilingue, map provider, tokens CSS.
- **frontend-engineer** : implementation des layouts, composants, interactions.
- **security-engineer** : evaluation cookies (maps, analytics).
- **accessibility-specialist** : validation WCAG 2.2 AA.

**Dependances Legal -> autres agents :**
- **Noah (Gate 1)** : validation D-LG-01 a 08 — statut juridique, CA previsionnel / regime TVA, CLIENT_TYPE formel, donnees d'identite, verification professionnelle des CGV (points 21 a 27 DECISIONS.md).
- **content-seo** : contenu reel des pages legales (mentions, confidentialite) et donnees reelles du client (fichier de donnees section 11).
- **security-engineer** : evaluation cookies/traceurs avant integration des tiers (analytics, maps, video).
- **solution-architect / devops-engineer** : identite et localisation de l'hebergeur et des sous-traitants pour les pages legales et le registre RGPD.

**Dependances Content/SEO -> autres agents :**
- **UX Designer** : coherence du schema de donnees client avec les tokens du design system (DESIGN_SYSTEM_SPECS.md section 7), nomenclature des sections (SITEMAP_MASTER.md), etats speciaux (UX.md section 4).
- **Solution Architect** : faisabilite technique du mapping placeholders -> composants, sitemap.xml dynamique, performance, choix map provider (impact cookies).
- **Frontend Engineer** : integration des donnees structurees JSON-LD dans le HTML, remplacement des placeholders, generation des balises meta/OG.
- **Legal / Compliance** : contenu des mentions legales et de la politique de confidentialite (templates genriques a completer).
- **Noah (Gate 1/2)** : validation D-CS-01 a 10 — format fichier client, schema donnees, types schema.org, patterns metadata, FAQ sectorielle, ton/limites textes, checklist de validation.

## Dependances

- Aucune phase ne demarre avant la validation de la Phase 0 (jalon J0) — y compris
  **Gate 1 Noah** sur les decisions D-PM-01 a 10, D-LG-01 a 08 ET **Gate 1/2 Noah**
  sur les decisions D-UX-01 a 14 ET D-CS-01 a 10 (DECISIONS.md).
- Les decisions B2B/B2C et TVA (legal-compliance) conditionnent les templates
  contractuels.
- Les decisions UX (familles de polices, palettes, map provider, carousel)
  conditionnent l'implementation frontend (Phase 2).
- Les decisions Content/SEO (format fichier client, map provider, analytics)
  conditionnent l'implementation technique (Phase 2).
- Aucune donnee client reelle n'existe encore : tout sera identifie comme manque.
- Dependances PM vers les autres agents : legal-compliance (CLIENT_TYPE, TVA,
  templates contractuels, PRIVACY_REQUIREMENTS) ; content-seo (fichier de donnees
  client section 11, SEO local) ; ux-designer (parcours et design system specs
  coherents avec les user stories) ; solution-architect (faisabilite technique et
  budget, perimetre v1).
- Dependances UX vers les autres agents : content-seo (contenus pages) ;
  solution-architect (faisabilite technique, tokens CSS, map provider) ;
  frontend-engineer (implementation composants) ; security-engineer (cookies) ;
  accessibility-specialist (validation WCAG 2.2 AA).
- Dependances Legal vers les autres agents : content-seo (contenu legal reel et
  donnees client) ; security-engineer (evaluation cookies) ; devops-engineer
  (identite hebergeur, sous-traitants) ; Noah (validation des documents avant
  toute utilisation commerciale).
- Dependances Content/SEO vers les autres agents : UX (design system tokens,
  sitemap, etats speciaux) ; architect (faisabilite placeholders, map,
  performance) ; frontend (integration JSON-LD, meta, placeholders) ;
  legal (contenu pages legales) ; Noah (validation D-CS-01 a 10).
- Dependances Architect vers les autres agents : content-seo (ajout seo.domain,
  champs EN) ; legal (sous-traitant formulaire, hebergeur) ; devops (hebergeur
  statique, domaine) ; database-engineer (validation « pas de DB », D-ARC-09) ;
  security (zero-cookie, anti-spam) ; frontend/backend (implementation Phase 2
  conforme STACK/TECHNICAL_ARCHITECTURE).
- Dependances Database vers les autres agents : content-seo (schema source
  CLIENT_DATA_SCHEMA, ajout seo.domain niveau definitif — regle C-17 en attente) ;
  ~~backend-engineer (implementation validate-client.mjs conforme
  CLIENT_DATA_VALIDATION.md)~~ — **FAIT (D-BE-01..03, D-BE-07, tests OK)** ;
  legal (durees de conservation, sous-traitant
  formulaire concret PO-DB-01) ; devops (hebergeur du depot pour sauvegardes git).