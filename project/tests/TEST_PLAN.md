# Plan de tests — Système noah-agency (Phase 4, QA)

Date : 2026-09-15
Responsable : QA Engineer (AGENT 10)
Perimetre : systeme de production (generation multi-clients Astro) + site
exemple genere (`exemple-restaurant` — La Table d'Essai, Lyon, donnees fictives).
Reference : README.md, ADR-002 (generation), TECHNICAL_ARCHITECTURE.md,
UX.md (etats speciaux §4), FORMS_ARCHITECTURE.md (backend),
CLIENT_DATA_VALIDATION.md (backend), SEO_SYSTEM.md (content), DESIGN_SYSTEM_SPECS.md (UX).

## 1. Perimetre et hors perimetre

### Dans le perimetre (tests fonctionnels + statiques)
- Pipeline de generation : validation du YAML client -> data.json -> pages -> build Astro.
- Site genere : navigation, liens internes, metadata SEO, hreflang, JSON-LD,
  sitemap/robots, etats speciaux (404/500, aucun creneau, formulaire vide),
  i18n FR/EN, bandeau cookies, accessibilite de base (skip-link, lang, h1 unique).
- Logique metier unitaire couverte par `tests/` (30 tests : validation client,
  reservation, formulaires).
- Reproductibilite : un client_data.yaml VALIDE produit un site buildable ;
  un client INVALIDE est refuse avec un rapport.

### Hors perimetre (autres agents)
- Audit WCAG complet, contrastes finaux, Core Web Vitals mesures reels,
  audit de securite authentique (headers HTTP, CSP, XSS) -> accessibility,
  performance, security engineers (deja livres pour la securite).
- Compatibilite navigateurs reels (Chrome/Firefox/Safari/Edge) sur machine :
  le build est statique et les tests sont statiques/unitaires ; une
  verification navigateur est prevue au deploiement (Gate 4) via la checklist
  TODO_PRODUCTION.md. Tests responsives statiques (CSS media queries) analyses
  dans le code, execution visuelle hors perimetre v1 (aucun navigateur dispo
  dans l'environnement WSL).

## 2. Strategie

Trois niveaux :
1. **Unitaire** — deja implemente par frontend/backend : `npm test` (30 tests,
   node:test, zero dependance). Regression a chaque modification.
2. **Pipeline** — `validate:example` (code 0) puis `build:example` (16 pages,
   build OK). Contrat : validation -> generation -> build reproductible.
3. **Audit statique du build** — script `qa-audit.mjs` (outil local QA, lieu :
   `/tmp/opencode/qa-audit.mjs`, non versionne) sur `dist/exemple-restaurant` :
   pages attendues FR/EN, h1 unique, lang attr, liens internes, placeholders
   residuels, sitemap/robots, JSON-LD, hreflang, formulaires, etats 404/500,
   bandeau cookies, skip-link.

### Cas de test multi-template (artisan)
Fixture temporaire `content/clients/qa-artisan-test/` (category artisan,
template artisan, package vitrine) creee pour verifier le comportement
multi-categorie. Resultat : la validation detecte correctement les champs
manquants (code 3, 24 champs bloquants) ; la generation reste monotype
(voir BUG-QA-07 / observation architecture multi-templates D-UX-12 SHOULD).
La fixture n'est pas conservee (eviter de polluer `content/clients/`).

## 3. Matrice de tests

### 3.1 Pipeline et generation (systeme)
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-PIPE-01 | `npm test` | 30 tests pass, 0 fail | OK |
| T-PIPE-02 | `validate:example` | exit 0, rapport `dist/exemple-restaurant/validation-report.md` | OK |
| T-PIPE-03 | `build:example` | 16 pages (13 FR + 3 EN), build OK | OK |
| T-PIPE-04 | YAML invalide (champs REQUIRED manquants) | code 2/3, generation REFUSEE, rapport ecrit | OK (unit test + fixture artisan) |
| T-PIPE-05 | Regles croisees C-01..C-17 | bloquantes/SHOULD conformes spec | OK (unit tests) |
| T-PIPE-06 | Placeholders `[Nom]`, `[Activite]`, `[Ville]`... remplis | aucun placeholder residuel dans le HTML | OK (hors faux positifs CSS `[open]`) |

### 3.2 Site genere — navigation et pages
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-NAV-01 | Nombre de pages | 16 pages : 13 FR + 3 EN (index/a-propos/contact) | OK |
| T-NAV-02 | Liens internes | aucun 404 interne ; assets `/_astro/*` presents | OK |
| T-NAV-03 | Lang switcher FR<->EN | lien `/en/` sur pages FR, lien `/` sur pages EN | OK |
| T-NAV-04 | Plan du site | liste les 11 pages principales ; liens valides | OK |
| T-NAV-05 | Breadcrumb contact/reservation | Accueil -> Contact / Reservation | OK |
| T-NAV-06 | CTA header (Reserver) | lien `/reservation` (FR) ; sur EN -> `/reservation` (FR, page non traduite — scope) | OK (observation) |

### 3.3 SEO et metadata
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-SEO-01 | Sitemap | 14 URLs (11 FR + 3 EN), toutes resolues | OK |
| T-SEO-02 | robots.txt | User-agent * + Sitemap | OK |
| T-SEO-03 | JSON-LD | blocs valides (Restaurant, FAQ, etc.) | OK (5 blocs) |
| T-SEO-04 | hreflang pages traduites | fr/x-default/en sur index, a-propos, contact (les 2 versions) | OK |
| T-SEO-05 | Pages legales | noindex,nofollow (confidentialite, mentions, plan) | OK |
| T-SEO-06 | Titles | < 60 car. | PARTIEL (issu de `texts.title`, pattern `seo_title` inutilise — BUG-QA-04) |
| T-SEO-07 | Meta descriptions | 120-160 car. | PARTIEL (5 pages = titre en description ; index 105 car. — BUG-QA-05, BUG-QA-08) |

### 3.4 i18n FR/EN
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-118N-01 | Contenu EN | textes EN sur en/index, en/a-propos, en/contact | ECHEC (BUG-QA-01 : textes FR affiches) |
| T-118N-02 | Nav EN | labels nav EN (Home, The Menu...) | ECHEC (BUG-QA-03 : labels FR) |
| T-118N-03 | Footer EN | "All rights reserved" | OK (footer traduit) |
| T-118N-04 | URLs EN | `/en/*` correctes, pas de 404 | OK |
| T-118N-05 | Routes non traduites | menu/reservation restent FR (liens directs, pas de 404) | OK (scope multilingue basique) |

### 3.5 Formulaires (cas limites)
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-FORM-01 | Contact : champs + validation client | 5 champs, validation email/tel, honeypot, endpoint configurable | OK (unit tests + HTML) |
| T-FORM-02 | Reservation : creneaux | 9 slots 12:00-21:00, max 8 couverts | OK |
| T-FORM-03 | Jour ferme | etat « aucun creneau » dedie | OK (unit tests getSlotsForDate) |
| T-FORM-04 | Periode de fermeture | closed, raison closed_period | OK (unit tests) |
| T-FORM-05 | Aucun creneau valide | raison no_slot | OK (unit tests) |
| T-FORM-06 | Fallback endpoint | aucun endpoint -> false / mailto securise | OK (unit tests) |
| T-FORM-07 | Pas d'endpoint tiers actif | action non postee (mailto/js), conforme ADR-003 | OK (observation : a configurer au 1er client reel) |

### 3.6 Etats speciaux
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-STATE-01 | 404 | page avec header/footer/CTA, h1 unique, noindex | OK |
| T-STATE-02 | 500 | idem | OK |
| T-STATE-03 | Galerie vide (0 image) | etat vide | OK |
| T-STATE-04 | FAQ vide | etat vide gere | OK (CSS/JS) |

### 3.7 Accessibilite de base (statique)
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-A11Y-01 | Skip-link | 16/16 pages `href="#contenu"` + `<main id="contenu">` | OK |
| T-A11Y-02 | lang attribute | toutes pages (fr/en) | OK |
| T-A11Y-03 | h1 unique | 1 par page | OK |
| T-A11Y-04 | Menu mobile | aria-expanded/aria-controls, Escape | OK (code) |
| T-A11Y-05 | Bandeau cookies | role=dialog, options, focus trap | OK (code) — note : script charge meme sans tiers (BUG-QA-06) |
| T-A11Y-06 | Contrastes | verifie via `npm run contrast` / rapport UX | Hors QA (accessibility engineer) |

### 3.8 Responsive / navigateurs
| Ref | Cas | Attend | Statut |
| --- | --- | --- | --- |
| T-RESP-01 | Breakpoints CSS (mobile < 1024px, desktop >= 1024px) | burger + menu plein ecran ; nav horizontale desktop | OK (code + CSS builds) |
| T-RESP-02 | Tests navigateurs reels | Chrome/Firefox/Safari/Edge | HORS PERIMETRE v1 (environnement sans navigateur ; prevu Gate 4, TODO_PRODUCTION.md) |

## 4. Environnement et outils

- Node 20.20.2 (nvm), Linux/WSL, Astro 5.x, yaml 2.x.
- `npm test`, `npm run validate:example`, `npm run build:example`.
- Script d'audit QA local : `/tmp/opencode/qa-audit.mjs` (non versionne).

## 5. Criteres de sortie

1. `npm test` : 30/30 OK.
2. `validate:example` : exit 0.
3. `build:example` : 16 pages OK.
4. Aucun lien interne casse, aucun placeholder residuel, 1 h1/page.
5. BUGS.md tenu a jour ; blocages remontes au Tech Lead (Phase 6 corrections).