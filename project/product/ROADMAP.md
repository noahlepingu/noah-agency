# ROADMAP.md — Phases 0 a 9 (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Principe : phases du cahier des charges (section 22) appliquees a la construction
du systeme lui-meme, puis re-appliquees a chaque projet client (cycle par client).

---

## 1. Vue d'ensemble

| Phase | Intitule | Livrables cles | Responsable principal | Statut |
| ----- | -------- | -------------- | --------------------- | ------ |
| 0 | Discovery | Offre, perimetre, requirements, business process, KPIs, UX, contenus, conformite legal | PM / UX / Content / Legal | EN COURS |
| 1 | Design & Architecture | Design system, UI specs, stack, ADR, structure templates | UX / Architect | A VENIR |
| 2 | Developpement | Composants, templates, forms, cookie system, SEO utils, generation site | Developpeurs | A VENIR |
| 3 | Infrastructure | Hosting, domaine, DNS, HTTPS, CI/CD | DevOps | A VENIR |
| 4 | Qualite | Tests, accessibilite/perf, securite | QA / Specialists | A VENIR |
| 5 | Code Review | Revue complete | Code Reviewer | A VENIR |
| 6 | Corrections | Corrections actees | Developpeurs | A VENIR |
| 7 | Final Review | Rapport client/product reviewer | Final Reviewer | A VENIR |
| 8 | Production | Deploiement du systeme documente | DevOps + Noah | A VENIR |
| 9 | Post-deploiement | Monitoring, maintenance, projet pilote, KPIs | QA / PM / DevOps | A VENIR |

## 2. Jalons (milestones) et gates de validation Noah

| Jalon | Contenu | Gate | Condition de passage |
| ----- | ------- | ---- | -------------------- |
| J0 | Fin de la Phase 0 | **Gate 1** | Noah valide : perimetre v1, offre/prix, CLIENT_TYPE, KPIs, brief systeme (sections 2-3 de SCOPE) |
| J1 | Design & Architecture valides | **Gate 2** (design systeme) | Noah valide : direction artistique, structure, contenu principal |
| J2 | Developpement v1 termine (base + template restaurant) | — | DoD technique respecte |
| J3 | Infrastructure operationalle (staging) | — | Deploiement de test reussi, rollback prouve |
| J4 | Qualite flambant neuve : QA, a11y/perf, securite | — | Aucun bug critique/majeur ; audits verts |
| J5 | Code review + corrections | — | Revue approuvee, dette documentee |
| J6 | Final review | **Gate 3** | Noah valide le systeme (fonctionnel, conforme, documente) |
| J7 | Mise en production | **Gate 4** | Noah autorise explicitement le deploiement reel |
| J8 | Post-deploiement | — | Monitoring actif ; **projet pilote** lance ; KPIs mesures |

> Les gates 1-4 du cahier des charges (section 23) s'appliquent au systeme ET
> seront re-appliquees a chaque projet client (validation par Noah + client).

## 3. Phase 0 — Discovery (en cours, sprint 0)

Sous-taches et ordre (certaines en parallele) :

| # | Tache | Agent | Livrable | Depend de |
| - | ----- | ----- | -------- | --------- |
| 0.1 | Offre, business process, perimetre, KPIs, requirements, stories, roadmap | PM | product/*.md (ce dossier) | — |
| 0.2 | Fichier de donnees client + bibliotheque de contenus + SEO local | content-seo | content/* | 0.1 (perimetre) |
| 0.3 | Parcours UX, sitemap, wireframes, design system specs | ux-designer | design/* | 0.1 |
| 0.4 | Conformite business : immatriculation, TVA, CLIENT_TYPE, templates contractuels, PRIVACY_REQUIREMENTS | legal-compliance | content/legal*, DECISIONS | 0.1 (B2B/B2C) |
| 0.5 | Faisabilite technique, budget, options stack | solution-architect | architecture/* | 0.1 |

Fin de Phase 0 : **checkpoint J0 / Gate 1** — Noah valide ou arbitre les points
ouverts (section 7 de DECISIONS.md).

## 4. Phase 1 — Design & Architecture

- UX-designer : design system master (couleurs, typo, grille, composants),
  UI specs, gabarits de templates par secteur (restaurant en priorite).
- Solution-architect : stack (simplicite avant tout, cahier des charges Agent 04),
  structure du projet, ADR, strategie templates, budget (gratuit/low-cost).
- Legal : templates de documents commerciaux B2B/B2C et pages legales (brouillons).
- **Sortie** : J1 + Gate 2 (Noah valide design/structure/contenu principal).

## 5. Phase 2 — Developpement (socle du systeme)

Sprints 1-3 (sprints de 2 semaines indicatifs) :

| Sprint | Contenu | Stories visees |
| ------ | ------- | -------------- |
| S1 | Design system code + composants de base (Header, Footer, Hero, CTA, ContactForm, CookieBanner, OpeningHours, SocialLinks) | N-02, N-03 |
| S2 | Layouts, pages legales, Menu/Gallery/Testimonials/FAQ/Map/Pricing, SEO utilities (metadata, donnees structurees, Open Graph, sitemap) | V-05, V-07, N-10 |
| S3 | Fichier de donnees client + generation d'assemblage (config -> site), template restaurant complet, forms avec mentions CNIL | N-01, N-02, V-03, V-04 |
| S3b | Brouillons documents commerciaux + TVA configurable + CLIENT_TYPE | N-04, N-08, C-01, C-06 |

- Integration-engineer : formulaire email, reservation v1 (formulaire simple).
- **Sortie** : J2.

## 6. Phase 3 — Infrastructure

- DevOps : hosting gratuit/low-cost, domaine (documente), DNS, HTTPS, CI/CD light,
  deployment reproductible, rollback, monitoring de base, variables d'environnement
  (jamais de secrets en repo).
- **Sortie** : J3 (environnement de test).

## 7. Phase 4 — Qualite

- QA-engineer : plan de tests (fonctionnel, navigation, formulaires, responsive,
  liens, erreurs, regression) + execution automatique ou il est possible.
- Accessibility/Performance : audit WCAG 2.2 AA + Core Web Vitals mobile ; images,
  fonts, cache, JS/CSS.
- Security : secrets, headers, dependances, HTTPS, stockage des donnees, cookies.
- **Sortie** : J4 (zero critique/majeur).

## 8. Phase 5 — Code Review

- Code-reviewer : architecture, qualite, duplication, securite, maintenabilite,
  conventions, dette technique. Corrections gerees en Phase 6.
- **Sortie** : J5.

## 9. Phase 6 — Corrections

- Developpeurs : corrigent les points actes en revue ; regression tests.
- **Sortie** : J6 (transition Final Review).

## 10. Phase 7 — Final Review (client/product reviewer)

- Mise a la place d'utilisateurs decouvrant le systeme et un site genere :
  comprehension, credibilite, esthetique, parcours, CTA, mobile, contenu,
  performances, coherence.
- Rendu : rapport final + liste de conformite (DoD).
- **Sortie** : J6 finalise + **Gate 3** (Noah valide le systeme avant livraison).

## 11. Phase 8 — Production

- DevOps : deploiement reel du systeme (hosting, domaine, HTTPS, monitoring).
- **Gate 4** : Noah autorise explicitement le deploiement.
- **Sortie** : J7 — le systeme est en ligne et exploitable.

## 12. Phase 9 — Post-deploiement et maintenance

- QA/DevOps : monitoring actif, detection d'erreurs, rapports.
- PM/Noah : lancement du **premier projet pilote** (client restaurant lyonnais) ;
  application du pipeline commercial complet (BUSINESS_PROCESS.md) ;
  **mesure des KPIs** (KPIS.md) des le pilote.
- Boucle d'amelioration : chaque projet client alimente la base (composants,
  templates, contenus, KPI) — section 8 « template + personnalisation ».

## 13. Cycle par projet client (apres le J7)

Chaque nouveau client repasse un mini-cycle avec ses propres gates :

```
Discovery (PM) -> UX -> DA -> Contenu/SEO -> Tech (archi config) -> Dev (assemblage)
-> QA/Sec/A11y/Perf -> Gate 1-2-3 Noah+client -> Deploiement (Gate 4) -> Maintenance
```

Ce cycle est detaille dans BUSINESS_PROCESS.md (etape 7) et alimente les KPIs.

## 14. Calendrier indicatif (non engageant)

| Milestone | Cible indicative |
| --------- | ---------------- |
| J0 (Gate 1) | Fin Phase 0 (cette session + arbitrages Noah) |
| J1 (Gate 2) | fin Phase 1 |
| J2 | fin Phase 2 |
| J3 | fin Phase 3 |
| J4 | fin Phase 4 |
| J5-J6 (Gate 3) | fin Phases 5-7 |
| J7 (Gate 4) | fin Phase 8 |
| J8 | Phase 9 : pilote + KPIs |

> Aucun delai ferme n'est engage : Noah fixe les priorites et les dates en Gate 1.