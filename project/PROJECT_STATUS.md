# Etat d'avancement du projet

Mis a jour a chaque tache livree. Derniere mise a jour : 2026-09-15 (Gate 1/2 Noah : validation des decisions cles, lancement Phase 2).

## Vue d'ensemble

| Phase | Intitule | Statut | Responsable principal |
| ----- | -------- | ------ | --------------------- |
| 0     | Discovery (PM, UX, Content/SEO, Legal) | FAIT (propositions validees Gate 1/2 partielles) | PM / UX / Content / Legal |
| 1     | Design & Architecture (UX DA, Solution Architect) | FAIT (architecture PROPOSEE et validee comme hypothese) | UX / Architect |
| 2     | Developpement (frontend, backend, database) | EN COURS | Developpeurs |
| 3     | Infrastructure (DevOps) | EN ATTENTE | DevOps |
| 4     | Qualite (QA, accessibilite/perf, securite) | EN ATTENTE | QA / Specialists |
| 5     | Code Review | EN ATTENTE | Code Reviewer |
| 6     | Corrections | EN ATTENTE | Developpeurs |
| 7     | Final Review | EN ATTENTE | Final Reviewer |
| 8     | Production | EN ATTENTE | DevOps |
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

## Prochaine etape

**Phase 2 — Developpement** : lancer en cascade
- **database-engineer** : valider « pas de base de donnees » (D-ARC-09 / ADR-009),
- **frontend-engineer** : base `src/` Astro (layouts, composants 15+specifiques, tokens, template restaurant flagship, etats speciaux, bandeau cookies, selecteur langue),
- **backend-engineer** : formulaire contact + reservation (validation statique creneaux, cas « aucun creneau », fallback), endpoints tiers configurables,
- integration des livrables content-seo (placeholders, JSON-LD, meta, client_data.yaml) et du design system UX.

Les decisions en suspens (prix finaux, statut juridique reel, TVA reelle,
donnees identite, hebergeur nomme, service de formulaire concret, polices
definitives) restent ouvertes jusqu'aux Gates 3/4 — elles ne bloquent pas le
developpement de la base de production.

**Dependances Architect -> autres agents :**
- **content-seo** : ajout propose au schema `seo.domain` (canonical/sitemap/OG) +
  champs EN optionnels (point ouvert n°37).
- **legal-compliance** : service de formulaire tiers = sous-traitant a inscrire
  dans PRIVACY_REQUIREMENTS ; hebergeur final a nommer dans les mentions legales.
- **devops-engineer** : choix de l'hebergeur statique (Cloudflare Pages en
  reference, ADR-005), domaine, HTTPS, rollback.
- **database-engineer (AGENT 07)** : confirmation « pas de base de donnees »
  (D-ARC-09 / ADR-009).
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