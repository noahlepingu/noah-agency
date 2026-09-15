# Recommandations de securite — noah-agency

**Agent** : Security Engineer (AGENT 08)
**Date** : 2026-09-15
**Version** : 1.0
**Reference** : `SECURITY_AUDIT.md` (constats), `VERDICT.md` (verdict)

**Consigne** : ces correctifs sont transmis aux developpeurs concernes.
Le security-engineer ne modifie pas le code source directement (regle
d'equipe). Chaque entree indique le fichier, la ligne, le correctif exact
et la priorite.

---

## Priorites

| Code | Signification | Delai |
| ---- | ------------- | ----- |
| CRIT | Critique — bloquant Gate 4 | Avant tout deploiement reel |
| MAJ  | Majeur — requis avant production | Avant Gate 4 |
| MIN  | Mineur — amelioration recommandee | Phase 6 |
| OPT  | Optionnel — amelioration future | Post-livraison |

---

## CRIT-01 : Upgrade Astro (>=7.3.2)

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `package.json` |
| **Ligne** | `"astro": "^5.0.0"` |
| **Constat** | `npm audit` → criticite `critical` (astro <=7.2.7). RCE via AVIF (GHSA-26w7-cxv4-gfx2), SSRF Host header (GHSA-2pvr-wf23-7pc7), XSS define:vars (GHSA-j687-52p2-xcff), XSS spread props (GHSA-jrpj-wcv7-9fh9). |
| **Correctif** | `npm install astro@7.3.2` (ou la derniere 7.x stable). Migration majeure : suivre le guide Astro 5→7 (`https://docs.astro.build/en/guides/upgrade-to/v5/` puis v7). Executer `npm test` (30 tests) + `npm run build:example` (16 pages) + `npm run validate:example` (exit 0) apres migration. Corriger les deprecations. |
| **Qui** | frontend-engineer |
| **Validation** | code-reviewer + security-engineer |

---

## CRIT-02 : Securiser JSON-LD set:html

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `src/layouts/BaseLayout.astro` |
| **Ligne** | 83 |
| **Constat** | `JSON.stringify(schema)` n'echappe pas `<` → injection `</script>` possible si un champ texte YAML contient des balises. XSS stockee sur toutes les pages du site client. Meme classe que GHSA-j687-52p2-xcff. |
| **Correctif** | Remplacer la ligne 83 par : |
| | `const safeSchema = JSON.stringify(schema).replace(/</g, '\\u003c');` |
| | Puis : `<script type="application/ld+json" set:html={safeSchema} />` |
| | **Alternative** : creer une fonction `escapeJsonLd()` dans `src/utils/seo.js` et l'importer (plus propre). |
| **Qui** | frontend-engineer |
| **Validation** | security-engineer + code-reviewer |

---

## MAJ-01 : Retirer Google Fonts CDN (ou conditionner)

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `src/layouts/BaseLayout.astro` |
| **Lignes** | ~79-81 (preconnect + stylesheet Google Fonts) |
| **Constat** | CDN charge inconditionnellement → IP visiteur transmise a Google (USA) sans consentement. Precedent CNIL SAN-2022-004. |
| **Correctif** | **Option A (recommandee)** : retirer les 2 balises `<link>` Google Fonts de BaseLayout.astro. Les polices sont deja self-hosted via `fonts.css` + `public/fonts/` (copie par `generate-site.mjs`). Verifier que `npm run setup` est execute avant le build (ou automatiser dans le CI). |
| | **Option B** : conditionner les liens au consentement via `consent.js` (charger les CDN uniquement si `analytics` ou `fonts` est accepte dans le panneau cookies). Non recommande : les polices self-hosted sont deja la norme (ADR-010). |
| **Verification** | Apres correctif : ouvrir le build genere, verifier l'absence de `fonts.googleapis.com` dans le HTML, verifier que les polices se chargent via `fonts.css` local. |
| **Qui** | frontend-engineer |
| **Validation** | security-engineer |

---

## MAJ-02 : Headers HTTP de securite

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `public/_headers` (Cloudflare Pages) OU `project/infrastructure/DEPLOYMENT.md` (documentation) |
| **Constat** | Aucun header de securite configure. Absence de HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP. |
| **Correctif** | Creer `public/_headers` a la racine du projet avec : |
| | ``` |
| | /* |
| |   Strict-Transport-Security: max-age=31536000; includeSubDomains |
| |   X-Content-Type-Options: nosniff |
| |   X-Frame-Options: DENY |
| |   Referrer-Policy: strict-origin-when-cross-origin |
| |   Permissions-Policy: camera=(), microphone=(), geolocation=() |
| |   Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'self'; frame-ancestors 'none' |
| | ``` |
| | **Note CSP** : `script-src 'unsafe-inline'` est necessaire en v1 (scripts islands Astro). Un hash CSP pourra etre genere au build dans les versions futures. Le `frame-src` pour OpenStreetMap sera ajoute uniquement si la carte est presente (templates restaurant). |
| | **Note `_headers`** : les fichiers `public/_headers` sont copiés dans `dist/` par Astro. Chaque site client herite de ces headers. Si un client a besoin d'un CSP different, le fichier peut etre surcharge dans le dossier client (generique futur). |
| **Ajout** | Ajouter `/.well-known/security.txt` dans `public/` avec contact Noah + politique de divulgation. |
| **Qui** | devops-engineer + frontend-engineer |
| **Validation** | security-engineer |

---

## MAJ-03 : Sous-traitant formulaire

| Champ | Valeur |
| ----- | ------ |
| **Fichiers** | `project/database/REGISTRE_DONNEES.md`, `project/content/legal/PRIVACY_REQUIREMENTS_TEMPLATE.md` |
| **Constat** | Le sous-traitant formulaire est declare « A determiner » (PO-DB-01). Le choix Web3Forms (UE) vs Formspree (USA) conditionne les transferts hors UE. |
| **Correctif** | **A la selection du 1er client reel** : (1) choisir Web3Forms (UE recommande, pas de transfert hors UE) ou Formspree (USA, transfert necessaire a documenter dans la politique de confidentialite) ; (2) completer `PRIVACY_REQUIREMENTS_TEMPLATE.md` avec l'identite reelle du sous-traitant ; (3) ajouter la mention dans les mentions legales du site client ; (4) mettre a jour `REGISTRE_DONNEES.md`. |
| **Qui** | backend-engineer + legal-compliance + Noah |
| **Validation** | security-engineer |

---

## MAJ-04 : Bouton de retrait consentement

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `src/components/Footer.astro` + `src/components/CookieBanner.astro` |
| **Constat** | Le consentement cookie (localStorage `ds_consent`) ne peut pas etre modifie une fois donne. La CNIL exige un mecanisme de retrait/modification. Le template `LEGAL_SITE_TEMPLATES.md` mentionne un lien « Gerer les cookies » dans le footer mais il n'est pas implemente. |
| **Correctif** | (1) Ajouter un lien « Gerer les cookies » dans `Footer.astro` visible uniquement si `third_party` est non vide ; (2) au clic, reouvrir le `CookieBanner.astro` en mode personnalisation (dispatcher un evenement `ds-manage-consent` que le banner ecoute) ; (3) dans le banner, ecouter cet evenement pour afficher le panneau de personnalisation (pas re-initialiser le consentement, juste ouvrir les options). |
| **Qui** | frontend-engineer |
| **Validation** | security-engineer + accessibility-specialist |

---

## MIN-01 : referrerpolicy Map.astro

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `src/components/Map.astro` |
| **Ligne** | 39 |
| **Correctif** | Remplacer `referrerpolicy="no-referrer-when-downgrade"` par `referrerpolicy="no-referrer"`. |
| **Qui** | frontend-engineer |

---

## MIN-02 : StatePage.astro — set:html durci

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `src/components/StatePage.astro` |
| **Ligne** | 45 |
| **Correctif** | Remplacer le `set:html` par un composant Astro dedie pour l'insertion de liens, ou au minimum valider que `phone` et `email` sont bien limites aux caracteres attendus avant substitution. Exemple de garde : |
| | `const safePhone = phone.replace(/[^0-9+\-.() ]/g, '');` |
| | `const safeEmail = email.replace(/[^a-zA-Z0-9@.\-]/g, '');` |
| | Puis utiliser `safePhone` / `safeEmail` dans les templates litteraux. |
| **Qui** | frontend-engineer |

---

## OPT-01 : Dependabot

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `.github/dependabot.yml` (a creer) |
| **Correctif** | Creer `.github/dependabot.yml` avec : |
| | ```yaml |
| | version: 2 |
| | updates: |
| |   - package-ecosystem: "npm" |
| |     directory: "/" |
| |     schedule: { interval: "weekly" } |
| |     open-pull-requests-limit: 5 |
| | ``` |
| **Qui** | devops-engineer |

---

## OPT-02 : npm audit dans CI

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `.github/workflows/ci.yml` |
| **Correctif** | Ajouter une etape apres `npm ci` : `npm audit --audit-level=high`. Si exit code != 0, echouer le workflow (ou avertissement non bloquant en v1 : `continue-on-error: true` avec creation d'un GitHub Issue automatique). |
| **Qui** | devops-engineer |

---

## OPT-03 : CSP avec hash (Phase future)

| Champ | Valeur |
| ----- | ------ |
| **Fichier** | `public/_headers` + build script |
| **Correctif** | Lorsque le build genere des scripts inline (islands hydration), hasher les scripts inline et integrer le hash dans CSP (`'sha256-...'`) pour permettre `script-src 'self'` sans `unsafe-inline`. Necessite un script post-build ou l'utilisation d'un plugin Astro. Priorite basse en v1 (le risque XSS inline est controle par Astro). |
| **Qui** | frontend-engineer + security-engineer |
| **Delai** | Post-livraison |

---

## Synthese des responsabilites

| Correctif | Agent principal | Agent secondaire |
| --------- | --------------- | ------------------ |
| CRIT-01 (upgrade Astro) | frontend-engineer | code-reviewer |
| CRIT-02 (JSON-LD) | frontend-engineer | security-engineer |
| MAJ-01 (fonts CDN) | frontend-engineer | security-engineer |
| MAJ-02 (headers) | devops-engineer | frontend-engineer |
| MAJ-03 (sous-traitant) | backend-engineer | legal-compliance |
| MAJ-04 (retrait consent.) | frontend-engineer | accessibility-specialist |
| MIN-01 (Map referrer) | frontend-engineer | — |
| MIN-02 (StatePage) | frontend-engineer | — |
| OPT-01 (Dependabot) | devops-engineer | — |
| OPT-02 (audit CI) | devops-engineer | — |
| OPT-03 (CSP hash) | frontend-engineer | security-engineer |
