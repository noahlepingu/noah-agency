# FINAL_REVIEW.md — Revue finale Phase 7

Date : 2026-09-16
Auteur : AGENT 14 — Final Product Reviewer
Base : version régénérée du build `dist/exemple-restaurant/` (16 pages, 384 Ko, 13h26)
Client évalué : La Table d'Essai (restaurant fictif, Lyon)
Question de référence : **Est-ce que je livrerais réellement ce site à un client ?**

---

## Verdict

**A LIVRER AVEC RÉSERVES**

La base de production est **structurellement saine** et le pipeline fonctionne
(config → validate → generate → build → déploy). Le site démo est **crédible**
au premier regard : nom, activité, ville, CTA et parcours principal sont
immédiatement compréhensibles. Cependant, **plusieurs points bloquent la
livraison à un 1er client réel** (Gate 4) et certains défauts de qualité
nécessitent une correction avant même la Gate 3.

---

## Checklist détaillée

### 1. Compréhension immédiate / Crédibilité

| Contrôle | Statut | Preuve |
|----------|--------|--------|
| Nom, activité, ville dans le 1er écran | **OK** | Hero FR : "La Table d'Essai" + "cuisine française à Lyon" + CTA "Réserver une table" / "Voir la carte" |
| Hiérarchie visuelle claire | **OK** | H1 = nom, sous-titre = activité + ville, 2 CTA secondaires prominent |
| Aucun placeholder visible | **OK** | Grep `[Nom]`/`[Ville]`/`[Activite]` = 0 dans le HTML généré |
| Aucun "lorem ipsum" | **OK** | Vérifié globalement |
| Mentions légales présentes | **OK** | mentions-legales/index.html (10,4 Ko, noindex) |
| Hébergeur identifié | **WARN** | "OVH SAS, Roubaix" dans le build (données fictives client) — mais décision système D-DEVOPS-03 = Cloudflare Pages. Template légal toujours à `[Nom de l'hebergeur]` (dépendance en attente) |
| Identité éditeur | **OK** | Jean Dupont, Lyon (fictionnel, marqué "à compléter" dans le template) |
| 404/500 présents | **OK** | 404.html (10,8 Ko), 500.html (10,9 Ko), messages clairs, liens retour + contact |

### 2. Parcours / CTA / Fonctionnel

| Contrôle | Statut | Preuve |
|----------|--------|--------|
| Navigation fluide (5 items + CTA) | **OK** | Accueil, La Carte, Réservation, Contact, CTA header |
| CTA principal vers /reservation | **OK** | Présent dans nav, hero, footer, pages internes |
| Formulaire contact fonctionnel | **OK** | 5 champs + honeypot + notice RGPD + role=status |
| Formulaire réservation fonctionnel | **OK** | Date/heure/slots/invités/nom/email/tél/message + honeypot + état "Aucun créneau disponible" |
| Menu mobile accessible | **OK** | aria-expanded + aria-controls + focus trap (Tab/Escape/retour) |
| Skip to content | **OK** | `<a class="sr-only focus:...">Aller au contenu</a>` |
| Bandeau cookies absent quand pas de tiers | **OK** | Aucune occurrence `ds-consent-updated` dans le build (third_party = false/false) |
| 285 liens internes vérifiés | **OK** | 0 cassé (résolver re-corrige, validation sur build régénéré) |
| Pages légales non liées depuis nav | **OK** | Mentions légales, confidentialité, plan du site absentes du menu (conforme D-FE-04) |
| Aucun JavaScript inutile émis | **OK** | 12/16 pages = 0 JS ; 4 pages = scripts fonctionnels (0,3 à 4,5 Ko) |

### 3. Technique / Sécurité / Conformité

| Contrôle | Statut | Preuve | Gate |
|----------|--------|--------|------|
| Tests unitaires | **OK** | 30/30 PASS | — |
| Validation client | **OK** | exit 0, 47/64 champs, 6 recommandés | — |
| Build | **OK** | 16 pages, exit 0 | — |
| JSON-LD échappé (XSS) | **OK** | set:html avec `\u003c` (B1 fixé) | C-02 |
| Polices self-hosted (B2) | **OK** | Aucune requête fonts.googleapis / gstatic dans le build | C-03 |
| Zero tiers par défaut | **OK** | Aucune requête externe, aucun script tiers émis | — |
| Fichier `_headers` | **NON FAIT** | Absent de dist/public/ | **C-04 — Gate 4 bloquée** |
| Astro ≥ 7.3.2 | **NON FAIT** | astro@5.18.2, npm audit : 3 vuln (1 critical) | **C-01 — Gate 4 bloquée** |
| security.txt | **NON FAIT** | Aucun `.well-known/security.txt` | **C-07** |
| Bouton retrait consentement (footer) | **NON FAIT** | Pas de lien "Gérer les cookies" / ds-manage-consent dans Footer.astro | **C-06** |
| Sous-traitant formulaire | **EN ATTENTE** | mailto fallback (pas de service tiers) — décision requise pour 1er client réel | **C-05** |
| Dependabot CI | **NON FAIT** | Pas de `.github/dependabot.yml` | **C-08** |
| npm audit dans CI | **NON FAIT** | ci.yml : tests + validate + build uniquement | **C-09** |
| `.env` absent du dépôt | **OK** | .gitignore correct, aucun `.env` commis | — |
| Secrets GitHub non exposés | **OK** | Aucune clé/secret dans le code | — |

### 4. Contenu / SEO

| Contrôle | Statut | Preuve |
|----------|--------|--------|
| Textes cohérents, sans erreur majeure | **OK** | Vérifié globalement (hors BUG-QA-02) |
| BUG-QA-02 « cuisine cuisine » | **NON CORRIGÉ** | a-propos FR : "la cuisine cuisine française", a-propos EN : "cuisine francaise cuisine" |
| H1 unique par page | **OK** | Vérifié, 0 double H1 |
| Title tags 30-60 car. | **OK** | 31-58 car. sur les 11 pages indexables |
| Meta descriptions 120-160 car. | **FAILLI** | 63-95 car. sur toutes les pages indexables (cible non atteinte) |
| Canonical sur toutes les pages | **OK** | 16/16 pages |
| Hreflang (fr, x-default, en) | **OK** | Index : fr + x-default + en ; autres pages : fr + x-default seulement (pas de doublon) |
| robots.txt | **OK** | Allow: / + Sitemap |
| sitemap.xml | **OK** | 14 URLs (exclut 404/500) |
| OG:title / OG:description | **OK** | Présentes sur les pages indexables |
| OG:image | **ABSENT** | Aucune balise og:image (D-CS-05 requiert 1200×630 pour tout site réel) |
| JSON-LD Restaurant | **NON ÉMIS** | Homepage = AUCUN JSON-LD. Seules 5 pages en ont (LocalBusiness sur a-propos/contact FR+EN, FAQPage sur faq). La fonction `restaurant()` de schema.js (hasMenu, acceptsReservations, openingHoursSpecification) n'est jamais appelée. Code mort. Contredit D-CS-03 |
| JSON-LD LocalBusiness | **PARTIEL** | Émis sur 4 pages (a-propos/contact FR+EN) mais `opening_hours` absent au top-level de data.json → champ `openingHoursSpecification` manquant dans le schéma |
| Multilingue EN complet | **PARTIEL** | Hero + nav + CTA + sous-titre EN ✓. Menu = FR ("La Carte"), jours horaires = FR ("Lundi"), avis = FR, FAQ = FR. Limitation documentée PO-P6-02 |
| EN meta description identique FR | **LIMITATION CONNUE** | Texte français sur page EN (template.yaml monolingue). `seo_description_en` existe dans client_data mais n'est pas consommé (PO-P6-02) |

### 5. Accessibilité / Performance

| Contrôle | Statut | Preuve |
|----------|--------|--------|
| Nav aria-label | **OK** | `ui.header.desktopNav` ou fallback "Navigation principale" |
| Burger aria-expanded/aria-controls | **OK** | Labels dynamiques "Ouvrir/Fermer le menu" + sr-only |
| Focus trap menu mobile | **OK** (code) | focusTrap, Tab cycle, Escape, retour focus — test navigateur requis Phase 8 |
| BackToTop non focusable quand caché | **OK** | `visibility: hidden` appliqué |
| Erreurs formulaire announce | **OK** | `aria-describedby` + `role="status"` |
| Contraste gray-400 « Fermé » | **FAILLI** | #9CA3AF sur blanc = 2,54:1 (< 4,5:1 WCAG 1.4.3). Visible sur homepage (4 occurrences) |
| Contraste success « Ouvert » | **FAILLI** | #059669 sur blanc = 3,77:1 (< 4,5:1 WCAG 1.4.3). Visible sur homepage (1 occurrence) |
| Cibles footer < 24px | **NON CORRIGÉ** | Footer links sans padding/min-height (mineur) |
| Body scroll lock menu mobile | **NON CORRIGÉ** | Header overflow-y:auto mais pas de body lock (mineur) |
| `prefers-reduced-motion` | **OK** | BackToTop + scroll smooth respectueux |
| HTML budgets (< 50 Ko) | **OK** | 10-42 Ko par page, total 300,5 Ko |
| JS budgets (0 par défaut) | **OK** | 12/16 pages = 0 JS ; 4 pages = scripts fonctionnels (< 5 Ko) |
| CSS 2 bundles | **OK** | 14,8 + 4,1 Ko = 18,9 Ko total |
| 404/500 CSS incomplet | **BUG** | Un seul bundle chargé, ne contient pas `.ds-btn` → boutons CTA non stylisés (D-PERF-02 non corrigé) |
| Fonts self-hosted (code) | **OK** | fonts.css déclare @font-face vers /fonts/*.woff2 (Playfair + Inter) |
| Fonts dans le build démo | **ABSENT** | Pas de répertoire `/fonts/` dans dist — police fallback Georgia/system-ui. `npm run setup` requis avant production |
| Aucune requête externe | **OK** | 0 requêtes tierces dans le build |

### 6. KPI Système / Réutilisabilité

| Contrôle | Statut | Preuve |
|----------|--------|--------|
| Pipeline fonctionnel | **OK** | validate → generate → build : démontré (47/64 champs → 16 pages) |
| Composants réutilisables | **OK** | 21 composants src/components/ (Header, Footer, Hero, CTA, forms, etc.) |
| Layouts | **OK** | 3 layouts (Base, Page, Legal) |
| Translations centralisées | **OK** | src/translations/ui.json (fr + en) — single source of truth (M4 fixé) |
| Tokens design system | **OK** | tokens.css + theme.css généré par client, @layer ds-brand (fix cascade) |
| Multi-clients | **OK** | generate-site.mjs × client_data.yaml × template.yaml |
| Monotype v1 | **OBSERVATION** | templates/restaurant seule ; generate hardcode restaurant (BUG-QA-07, D-PM-06) |
| Tests 30/30 | **OK** | validation, reservation, forms |
| KPIs définis | **OK** | KPIS.md : 9 KPIs + 6 complémentaires, cibles, méthode de mesure |
| Checklist pré-production | **OK** | TODO_PRODUCTION.md : checklist système + client, items Gate 4 |
| Documentation complète | **OK** | project/ = product, design, content, architecture, infrastructure, tests, docs |

---

## Corrections requises avant le 1er client réel

### Bloquantes Gate 4 (doivent être faites avant déploiement)

| # | Sévérité | Correction | Responsable | Reference |
| - | -------- | ---------- | ----------- | --------- |
| B1 | **CRITIQUE** | Upgrade Astro ≥ 7.3.2 (`npm audit` : 3 vuln, 1 critical) | DevOps | C-01 |
| B2 | **MAJEUR** | Créer `public/_headers` (Security headers : CSP, X-Frame-Options, etc.) | DevOps | C-04 |
| B3 | **MAJEUR** | Ajouter lien "Gérer les cookies" (ds-manage-consent) dans Footer.astro pour retrait consentement | Frontend | C-06 |
| B4 | **MAJEUR** | Créer `.well-known/security.txt` | DevOps | C-07 |
| B5 | **MAJEUR** | Ajouter `npm audit` dans ci.yml (tests + audit + validate + build) | DevOps | C-09 |
| B6 | **MINEUR** | Ajouter `.github/dependabot.yml` | DevOps | C-08 |
| B7 | **MINEUR** | Documenter le choix sous-traitant formulaire (Web3Forms/Formspree/mailto) | Noah + PM | C-05 |

### Qualité recommandée avant Gate 3

| # | Sévérité | Correction | Responsable | Reference |
| - | -------- | ---------- | ----------- | --------- |
| Q1 | **MAJEUR** | Corriger « cuisine cuisine » : reformuler template `a-propos.content` ("...pour la [Activite].") | Content | BUG-QA-02 |
| Q2 | **MAJEUR** | Corriger contraste hours : `--color-gray-400` → `--color-gray-500` pour "Fermé" + `--color-success-dark` pour "Ouvert" (WCAG 1.4.3) | Frontend + Design | D-A11Y-05 |
| Q3 | **MAJEUR** | Corriger 404/500 : inclure le bundle CSS contenant `.ds-btn` (D-PERF-02) | Frontend | D-PERF-02 |
| Q4 | **MAJEUR** | Activer JSON-LD Restaurant sur homepage (import + passage `jsonLd` dans index.astro) | Content/SEO | D-CS-03 |
| Q5 | **MINEUR** | Meta descriptions : porter à 120-160 car. sur toutes les pages indexables | Content | PO-P6-01 |
| Q6 | **MINEUR** | Ajouter `og:image` au template (1200×630) avec fallback placeholder | Content | D-CS-05 |

### Pré-requis opérationnels avant production

| # | Action | Qui |
| - | ------ | ----- |
| P1 | Exécuter `npm run setup` (fetch-fonts) pour alimenter `/fonts/` avant le build de production | Noah/DevOps |
| P2 | Configurer les secrets GitHub (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID) | Noah |
| P3 | Créer le dépôt GitHub, premier push, CI verte | Noah/DevOps |
| P4 | Configurer l'environnement « production » avec reviewers (Gate 4 bis) | Noah |
| P5 | Valider la checklist pré-production (TODO_PRODUCTION.md §2) | Noah |

---

## Ce que Noah doit faire personnellement

1. **Gate 3** : Ouvrir `dist/exemple-restaurant/` dans un navigateur et valider le rendu visuel (desktop + mobile), les formulaires, le menu, les horaires, la carte. C'est la validation humaine de la qualité perçue.

2. **Gate 4** : Après résolution des corrections B1-B6 et des points P1-P5, déclencher manuellement le workflow `deploy-site.yml` depuis GitHub Actions (slug = exemple-restaurant). L'environnement « production » avec reviewers ajoute une couche de sécurité.

3. **Données réelles** : Pour un 1er client réel, remplir `client_data.yaml` avec les vraies informations (SIREN, hébergeur, adresse, tarifs). Le système ne fabrique jamais les données — il les demande et les valide.

4. **Décisions en attente** :
   - Choix hébergeur (Cloudflare Pages, confirmé en D-DEVOPS-03) → intégrer dans LEGAL_SITE_TEMPLATES.md
   - Service formulaire tiers ou mailto (C-05)
   - Activation tiers (analytics, maps) → active le bandeau cookies + consent
   - Contenu images réelles (hero, galerie) → impacts og:image et UA

---

## Recommandations Gates 3/4

### Gate 3 (avant livraison) — Noah valide

Avant de valider la Gate 3, Noah doit vérifier dans un navigateur :

1. **Visuel** : le hero, la navigation, les sections (menu, horaires, carte, avis, FAQ) sont lisibles et cohérents
2. **Mobile** : le menu burger ouvre/ferme, le focus trap fonctionne, les formulaires sont utilisables
3. **Formulaires** : envoyer un test contact (mailto), vérifier le honeypot, tester les erreurs (champs vides)
4. **Liens internes** : naviguer entre toutes les pages sans erreur
5. **404** : accéder à `/nimpporte quoi` → vérifier le message et les CTA (attention : boutons non stylisés tant que D-PERF-02 n'est pas corrigé)
6. **SEO** : vérifier les title tags et descriptions dans l'inspecteur
7. **Accessibilité** : navigation clavier (Tab, Escape), lecteur d'écran si disponible

**Recommandation** : corriger Q1-Q4 (cuisine cuisine, contraste, 404/500 CSS, JSON-LD) **avant** la Gate 3 pour éviter une session de validation avec des défauts connus.

### Gate 4 (mise en production) — Noah autorise le déploiement

Conditions préalables non négociables :

1. **B1** : Astro ≥ 7.3.2 (sécurité critique)
2. **B2** : `_headers` configuré
3. **P1** : Fonts fetchées
4. **P2** : Secrets GitHub configurés
5. **P3** : CI verte avec npm audit
6. **TODO_PRODUCTION.md** : checklist système cochée

---

## Limitations documentées (acceptées pour v1)

| Limite | Impact | Reference |
|--------|--------|-----------|
| EN partiel (menu, horaires jours, FAQ, avis restent FR) | Acceptable pour un restaurant français ; documenter comme "EN basique pages cles" | PO-P6-02 |
| EN meta description identique FR | SEO minor impact ; `seo_description_en` existe mais non consommé | PO-P6-02 |
| Monotype : template restaurant uniquement | Conforme D-PM-06 v1 ; artisan/commerce en roadmap | BUG-QA-07, ROADMAP |
| Pas de formulaire tiers (mailto) | Suffisant pour démo ; decision requise pour client réel | C-05 |
| og:image absent | Démo sans images réelles ; requis pour tout client réel | D-CS-05 |
| Hébergeur fictif (OVH) dans le build | Client fictif = données fictives ; template légal à compléter | LEGAL_SITE_TEMPLATES.md |
| PascalCase composants (vs kebab-case) | Conforme au conventionnel Astro ; pas de régression | OBS-01 |

---

## Conclusion

Le système de production démontre sa promesse : **config + contenu + design = site** sans développement ad hoc pour un client restaurant. Le pipeline (validate → generate → build) fonctionne, les tests passent, la documentation est complète, et le code est structurellement propre.

**Ce qui reste avant un 1er client réel :**
- 4 corrections de qualité (Q1-Q4) — quelques heures de travail
- 7 items de sécurité Gate 4 (B1-B7) — plupart documentés, à exécuter
- 5 prérequis opérationnels (P1-P5) — dépendent de Noah (compte GitHub, Cloudflare)

**Ce qui fonctionne bien :**
- Pipeline reproductible (démontré sur données fictives)
- Base de composants réutilisable (21 composants, 3 layouts, design system)
- Tests automatisés (30/30)
- Documentation exhaustive (product → infrastructure)
- Conformité RGPD de base (cookies conditionnels, formulaires a11y, mentions légales)
- Accessibilité mostly correcte (4/4 blockers corrigés, focus trap, aria labels)

La réutilisabilité pour un 2e client restaurant sera immédiate (nouveau YAML → pipeline → déploiement). La réutilisabilité pour d'autres secteurs nécessite le développement du template artisan/commerce (roadmap v2).

---

*Rapport généré par AGENT 14 — Final Product Reviewer*
*Base : build dist/exemple-restaurant/ régénéré le 2026-09-16, 13h26*

---

# Sprint Qualité Q1-Q6 — Corrections Phase 7

Date : 2026-09-16
Responsable : AGENT 05 — Frontend Engineer
Portée : corrections de qualité recommandées avant Gate 3 (Q1-Q6 du verdict Phase 7).

## Résumé exécutif

Les 6 corrections sont implementées et vérifiées. Le pipeline est intact :
30/30 tests, validate:example exit 0, build 16 pages, contrast all pass.
CSS bundle global unique (17 Ko au lieu de 14,8 + 4,1 Ko = 18,9 Ko) —
régression de taille, avantage a11y et maintenabilité.

## Q1 — BUG-QA-02 « cuisine cuisine » (MAJEUR) — CORRIGÉ

**Problème** : `fr.json` a-propos.content contient « pour la cuisine [Activite] » ;
avec `activityLabel = "cuisine francaise"`, la phrase génère « la cuisine cuisine
française ». Même issue côté EN (« [Activite] cuisine » → « cuisine française cuisine »).

**Correctif** :
- `fr.json` : « pour la cuisine [Activite] » → « pour la [Activite] »
- `en.json` : « for [Activite] cuisine » → « for [Activite] »

**Fichiers modifiés** : `templates/restaurant/content/fr.json`, `templates/restaurant/content/en.json`

**Vérification** :
```bash
grep -r "cuisine cuisine" dist/exemple-restaurant/ | wc -l  # → 0
# FR : "passion de son fondateur pour la cuisine francaise"
# EN : "born from a passion for cuisine francaise"
```

---

## Q2 — Contraste badges horaires WCAG 1.4.3 (MAJEUR) — CORRIGÉ

**Problème** : badge « Ouvert » en `--color-success` (#059669, 3.77:1) et
« Fermé » en `--color-gray-400` (#9CA3AF, 2.54:1) — tous deux sous 4.5:1.

**Correctif** :
1. `tokens.css` : ajout `--color-success-dark: #047857;` (5.48:1)
2. `OpeningHours.astro` : `.ds-opening__open` → `--color-success-dark`,
   `.ds-opening__closed` et `.ds-opening__hours--closed` → `--color-gray-500` (#6B7280, 4.83:1)
3. `contrast-check.mjs` : ajout des 2 paires badges (D-A11Y-05, m8) :
   `Success-dark badge on white (Ouvert)` et `Gray-500 badge on white (Ferme)`

**Fichiers modifiés** : `src/styles/tokens.css`, `src/components/OpeningHours.astro`,
`scripts/contrast-check.mjs`

**Token ajouté** : `--color-success-dark: #047857;`

**Vérification** :
```bash
npm run contrast
# [PASS] Success-dark badge on white (Ouvert): #047857 on #FFFFFF = 5.48:1 (min 4.5:1)
# [PASS] Gray-500 badge on white (Ferme): #6B7280 on #FFFFFF = 4.83:1 (min 4.5:1)
# All checks passed!
```

---

## Q3 — 404/500 : bundle CSS sans `.ds-btn` (MAJEUR) — CORRIGÉ

**Problème** : les pages 404/500 ne chargeaient que le bundle global (tokens,
base, utilities) qui ne contenait pas `.ds-btn`. Les boutons CTA du StatePage
et du Header n'étaient pas stylés. Le scope Astro du composant `CTA.astro`
(data-astro-cid) empêchait la propagation même aux autres composants utilisant
`.ds-btn` en HTML brut (Header, CookieBanner, StatePage, ContactForm, ReservationForm).

**Correctif** :
1. Création `src/styles/buttons.css` — styles `.ds-btn` **globaux** (non scopeés)
2. Import dans `BaseLayout.astro` : `import '../styles/buttons.css';`
3. Suppression du `<style>` dans `CTA.astro` (dupliqué maintenant)

**Conséquence** : le build Astro fusionne tous les styles en un seul bundle
(`confidentialite.*.css`, ~17 Ko). Ce bundle est chargé par toutes les pages
y compris 404/500. Le CSS total est réduit (17 Ko au lieu de 18,9 Ko)
et les boutons sont stylés partout.

**Fichiers modifiés** : `src/layouts/BaseLayout.astro`, `src/components/CTA.astro`
**Fichier ajouté** : `src/styles/buttons.css`

**Vérification** :
```bash
# 404.html charge le bundle global contenant .ds-btn (unscoped)
grep -o '/_astro/[^"]*\.css' dist/exemple-restaurant/404.html | xargs -I{} grep -c '\.ds-btn{' dist/exemple-restaurant/{}  # → 1
# Le sélecteur .ds-btn{ est global (pas de [data-astro-cid-XXXX])
```

---

## Q4 — JSON-LD Restaurant jamais émis (MAJEUR) — CORRIGÉ

**Problème** : la fonction `restaurant()` existait dans `schema.js` mais
n'était jamais appelée. `data.json` ne contenait pas `menu`/`reservation`/
`reviews`/`opening_hours` au top-level, rendant les champs `hasMenu`,
`acceptsReservations` et `openingHoursSpecification` manquants même pour
`localBusiness()` (sous-parti « PARTIEL » du rapport).

**Correctif** :
1. `generate-site.mjs` : ajout de 4 clés au top-level de `data.json` :
   `opening_hours`, `menu`, `reservation`, `reviews` (copie depuis clientData)
2. `schema.js` `restaurant()` : ajout de `servesCuisine` (depuis `seo.activityLabel`)
   et `priceRange` (optionnel, depuis `seo.price_range` si fourni par le client)
3. `index.astro` : appel `restaurant(data, siteUrl)` et passage `jsonLd={[schema]}`

**Clés ajoutées à data.json** : `opening_hours`, `menu`, `reservation`, `reviews`

**Fichiers modifiés** : `scripts/generate-site.mjs`, `src/utils/schema.js`,
`templates/restaurant/pages/index.astro`

**Vérification** :
```bash
grep -c '"Restaurant"' dist/exemple-restaurant/index.html  # → 1
# Schema complet : @type Restaurant, acceptsReservations: true,
# hasMenu (La Carte), openingHoursSpecification (4 entries),
# servesCuisine: "cuisine francaise", aggregateRating, name, address, url
# Bonus : a-propos LocalBusiness possede maintenant openingHoursSpecification (4)
```

---

## Q5 — Meta descriptions trop courtes (MINEUR) — CORRIGÉ

**Problème** : les descriptions SEO (63-95 car.) étaient sous la cible 120-160 car.

**Correctif** : enrichissement des 8 patrons `seo_description` dans
`templates/restaurant/template.yaml` avec des textes plus complets contenant
CTA, activité et localisation. Longueurs après remplissage : 128-148 car.

**Fichiers modifiés** : `templates/restaurant/template.yaml`

**Vérification** :
```bash
python3 -c "
import re
paths = ['dist/exemple-restaurant/index.html', ..., 'dist/exemple-restaurant/en/a-propos/index.html']
for p in paths:
    m = re.search(r'content=\"(.*?)\"', open(p).read().split('name=\"description\"')[1][:200])
    ok = 120 <= len(m.group(1)) <= 160
    print(('OK' if ok else 'FAIL'), len(m.group(1)))
"  # → OK 140, OK 148, OK 138, OK 128, OK 139, OK 139, OK 146, OK 144 (FR+EN)
```

---

## Q6 — og:image absent (MINEUR) — CORRIGÉ

**Problème** : aucune balise `og:image` dans le build (D-CS-05 requiert 1200×630).

**Correctif** : résolution automatique dans `BaseLayout.astro` — émet `og:image`
avec URL absolue quand `data.hero_image.src` existe, graceful (jamais de tag) sans image.

**Décision D-FE-Q6-01** : pas de placeholder local (image placeholder visible
dans les partages sociaux = mauvaise UX). Implémentation graceful — quand un
client fournit `hero_image` (1200×630), la balise `og:image` apparaît automatiquement.
Le champ `hero_image` est déjà requis dans `client_data.yaml` (schema = champ
SHOULD au niveau système, REQUIRED pour tout site social-media-ready).

**Fichiers modifiés** : `src/layouts/BaseLayout.astro`

**Vérification** :
```bash
# Sans hero_image (client exemple) : graceful absent
grep -c 'og:image' dist/exemple-restaurant/index.html  # → 0
# Test avec hero_image injecté temporairement : émet URL absolue
# https://la-table-dessai-demo.example.com/images/hero.jpg ✓
```

---

## Stats post-sprint

| Metrique | Avant | Après |
|----------|-------|-------|
| npm test | 30/30 | 30/30 ✓ |
| validate:example | exit 0 | exit 0 ✓ |
| build pages | 16 | 16 ✓ |
| contrast | all pass (10 paires) | all pass (12 paires) ✓ |
| CSS bundles | 2 (14,8 + 4,1 = 18,9 Ko) | 1 (17 Ko) ✓ |
| cuisine cuisine | 2 occurrences | 0 ✓ |
| JSON-LD Restaurant | absent | émis (complet) ✓ |
| og:image | absent | graceful (0 ou URL) ✓ |
| meta descriptions | 63-95 car. | 128-148 car. ✓ |
| Pages 404/500 .ds-btn | non stylé | stylé (bundle global) ✓ |
| LocalBusiness openingHours | manquant | 4 entries ✓ |

## Dépendances

- **DevOps (B1)** : l'upgrade Astro ≥ 7.3.2 (npm audit) reste prerequisite
  avant production — les changements du sprint sont indépendants du versionnage.
- **DevOps (B2)** : `public/_headers` (CSP, X-Frame-Options) pas impacté.
- **content-seo** : le champ `seo.price_range` (COULD) est requis pour
  l'émission `priceRange` dans le JSON-LD Restaurant — à documenter
  dans CLIENT_DATA_VALIDATION.md et CLIENT_DATA_SCHEMA.md.

---

# Sprint Gate 4 — Infrastructure securite

Date : 2026-09-16
Responsable : AGENT 12 — DevOps Engineer
Portée : conditions bloquantes Gate 4 du verdict FINAL_REVIEW Phase 7 :
**B2 / C-04** (headers HTTP), **B4 / C-07** (security.txt), **B5 / C-09**
(npm audit CI), **B6 / C-08** (Dependabot). Bonus : `npm run contrast` dans
la CI.
Périmètre respecté : `public/` + miroir `templates/restaurant/public/`,
`.github/`, `project/infrastructure/`, `project/docs/`. **Aucune
modification de `package.json` / `src/`** (sprint frontend Astro 5→7 en
parallèle — celui-ci est arrivé à astro@7.3.2, `npm audit` = 0 vulnérabilité).

## Résumé exécutif

Les 4 conditions (C-04, C-07, C-08, C-09) sont levées. Vérifications :

- `npm audit` **0 vulnérabilité** (astro@7.3.2 déjà installé par le sprint
  parallèle) → l'étape CI `npm audit --audit-level=high` passe au vert.
- `npm run build:example` : **16 pages OK** — `dist/exemple-restaurant/_headers`
  et `dist/exemple-restaurant/.well-known/security.txt` présents.
- 30/30 tests PASS, `validate:example` exit 0, `contrast` all pass.

## B2 / C-04 — Fichier `_headers` (MAJEUR — corrigé)

### Emplacement (point important, variance documentée au pipeline)

Le pipeline réel (ADR-002) ne copie **pas** la racine `public/` en bloc : 
`scripts/generate-site.mjs` §9 ne récupère que `favicon.svg` de la racine
et copie **`templates/<template>/public/`** dans `src/sites/<slug>/public/`
(→ `dist/<slug>/` par Astro). Deux choix d'implantation cohérents avec
l'énoncé de mission (« cree `public/_headers` ») :

1. **Canonique (déployée)** : `templates/restaurant/public/_headers` —
   copiée dans **chaque** build client par le pipeline, vérifiée dans `dist/`.
2. **Miroir** : `public/_headers` — même contenu, sert de référence
   documentaire (et évite une régression silencieuse si le pipeline évolue
   vers une copie de la racine). `grep` de désynchronisation possible.

Le format Cloudflare Pages est confirmé sur la doc officielle
(developers.cloudflare.com/pages/configuration/headers/) : chemin / glob puis
lignes indentées `  [Nom]: valeur` ; les **commentaires `#` sont supportés**.
Un seul glob `/*` suffit (le site entier est l'application ; les en-têtes
sur les assets `/_astro/*` sont inoffensifs) — pas de globs supplémentaires
nécessaires.

### Contenu exact (identique dans les 2 copies)

```text
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), document-domain=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src https://www.openstreetmap.org; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

### Justification de chaque directive (preuves grep sur le build 16 pages)

| Directive | Valeur | Preuve grep (build exemple) | Pourquoi |
| --------- | ------ | --------------------------- | -------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | — | Force HTTPS 1 an (y compris sous-domaines). Cloudflare Pages = HTTPS par défaut (certificat auto, HTTP→HTTPS) : HSTS valide sans risque de blocage en HTTP |
| `X-Content-Type-Options` | `nosniff` | — | Anti MIME sniffing |
| `X-Frame-Options` | `DENY` | — | Anti clickjacking (compatible navigateurs ne supportant pas `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | — | Referer complet en même-origine, origine seule en cross-origin ; cohérent avec la correction mineure Map (no-referrer, REC-05) |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), document-domain=()` | aucun usage de ces features dans le build | Désactive les features non utilisées (privacy by design) ; `fullscreen=(self)` conservé (galerie) ; `document-domain=()` ajouté (durcissement, exemple officiel Cloudflare) |
| `default-src 'self'` | même-origine par défaut | 0 requête tierce dans le build (aucun `src/href` http(s) externe hors OSM) | Zéro tiers par défaut (ADR-008) ; toute ressource externe devra être listée explicitement |
| `script-src 'self' 'unsafe-inline'` | bundles + blocs inline | `grep -rho '<script type="module">' dist/ | wc -l` = **39** ; bundles externes : ContactForm (2), OpeningHours (4), ReservationForm (1) | `'self'` : les 3 bundles `/_astro/*.js`. `'unsafe-inline'` : **obligatoire en v1** — Astro génère des blocs inline exécutables : burger menu (16×, 1 111 o), back-to-top (16×, 253 o), lang-switcher (6×, 178 o), lightbox galerie (1×). Les blocs JSON-LD (7×) ne sont pas exécutés (non bloqués par CSP). Compromis documenté (SECURITY_AUDIT §6) : hashs/nonces = évolution future nécessitant une étape de post-build (hors périmètre v1, sprint Astro en cours) |
| `style-src 'self' 'unsafe-inline'` | bundle CSS + styles inline | `<style>` sur **16/16** pages (2 blocs/page) ; attributs `style="` : **24** | Astro inline les styles (2 blocs par page) + attributes inline du theme : `'unsafe-inline'` requis |
| `img-src 'self' data:` | images same-origin + data URIs | 0 data:image dans le build actuel | Images client réelles (hero/gallery) servies en même-origine ; data: pour icônes inline futures |
| `font-src 'self' data:` | polices self-hosted | `fonts.css` déclare `@font-face` vers `/fonts/*.woff2` (ADR-010) | Polices self-hosted (plus de CDN Google — B2 fixé Phase 6) ; data: pour @font-face data-URI |
| `connect-src 'self'` | fetch/XHR même-origine | formulaire démo = fallback **mailto** (navigation, pas fetch) ; `src/utils/forms.js` n'utilise fetch que si `form_endpoint` http | **Règle opérationnelle documentée** : dès qu'un client active un endpoint tiers (Web3Forms/Formspree), ajouter son origine à `connect-src` ET `form-action` (DEPLOYMENT.md §12.3, TODO_PRODUCTION.md) |
| `frame-src https://www.openstreetmap.org` | iframe carte | `grep -rho 'src="https://www.openstreetmap.org[^"]*"' dist/` = **4** embed.html | Map OpenStreetMap (ADR-007) — seule iframe du système |
| `base-uri 'self'` | anti `<base>` | — | Defense en profondeur |
| `form-action 'self'` | soumissions natives | formulaires en JS (preventDefault + fetch) en v1 ; same caveat endpoint tier | même règle opérationnelle que `connect-src` ; en l'absence de JS c'est la soumission native qui est contrôlée |
| `frame-ancestors 'none'` | anti clickjacking | — | Plus fort que X-Frame-Options (CSP3) ; les deux posés (défense en profondeur) |

Non inclus (documenté) : `upgrade-insecure-requests` (site 100 % HTTPS via
HSTS + Cloudflare, aucune ressource http://) ; `X-Robots-Tag` (l'indexation
est gérée par `robots.txt` ; les pages légales ont déjà `<meta
robots="noindex">` via LegalLayout). `script-src-attr`/`style-src-attr` :
aucun handler inline (`onclick=` : **0**, `javascript:` : **0**) — couverts
par défaut.

## B4 / C-07 — security.txt (RFC 9116) (MAJEUR — corrigé)

Créé dans `templates/restaurant/public/.well-known/security.txt` (canonique,
copié dans chaque build) + miroir `public/.well-known/`. Vérifié dans
`dist/exemple-restaurant/.well-known/security.txt`.

```text
Contact: mailto:[CONTACT-EMAIL]
Expires: 2027-09-16T00:00:00.000Z
Preferred-Languages: fr, en
Canonical: [SECURITY-TXT-URL]
Policy: tbd
```

**Placeholders à remplacer par Noah avant production réelle** (champ par
champ, DEPLOYMENT.md §12.4, TODO_PRODUCTION.md §3.3) :

| Placeholder | Remplacer par | Exemple |
| ----------- | ------------- | ------- |
| `[CONTACT-EMAIL]` | Email de contact sécurité **du site client** (jamais inventé) | `security@latabledessai.fr` |
| `[SECURITY-TXT-URL]` | URL absolue du fichier sur le domaine du client | `https://latabledessai.fr/.well-known/security.txt` |
| `Expires` | Date ≤ 1 an après publication (RFC 9116) | `2027-09-16T00:00:00.000Z` — **renouveler chaque année** (ajouté à la checklist mensuelle MAINTENANCE_PLAN.md §6.2) |
| `Policy` | URL d'une politique de divulgation (sinon `tbd`) | `tbd` par défaut |

Vérification pré-production : `grep -c 'CONTACT-EMAIL' dist/<slug>/.well-known/security.txt`
— doit retourner **0** (aucun placeholder restant ; le build démo conserve les
placeholders tant que Noah n'a pas défini le contact réel du client).

## B5 / C-09 — npm audit dans le CI (MAJEUR — corrigé)

Dans `.github/workflows/ci.yml`, après les tests :

```yaml
- name: Audit de securite des dependances (echec si >= high)
  run: npm audit --audit-level=high
```

**Choix du niveau `high`** : la CI échoue si une vulnérabilité **haute ou
critique** apparaît (bloquant Gate 4), tout en tolérant les niveaux modérés
et bas (non bloquants, suivis par Dependabot weekly). Pour un site statique
zero-exécution-serveur, le risque exploitable est concentré au build
(cf. audit Phase 4) ; les vulnérabilités hautes/critiques dans les
dépendances de build sont donc le bon seuil de blocage, sans immobiliser le
pipeline pour des niveaux modérés sans impact. Le sprint parallèle ayant
porté astro à 7.3.2, `npm audit --audit-level=high` passe à 0 vulnérabilité.
`--omit=dev` non retenu : les vulnérabilités de dev-deps (esbuild/sharp)
impactent le build (exécution en CI) ; les garder dans le périmètre.

**Note exercée par le DevOps** : le sprint parallèle Astro exigent
`engines >=22.12.0` (Astro 7 refuse Node 20) — `ci.yml` charge maintenant
Node 22 (setup-node). **Dépendance signalée au sprint frontend** :
`.github/workflows/deploy-site.yml` utilise encore `node-version: 20`
(ligne 53) et cassera avec astro@7.3.2 — à aligner sur 22 par le sprint
Astro (CD hors périmètre de celui-ci).

## C-08 / B6 — Dependabot (MINEUR — corrigé)

`.github/dependabot.yml` :

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 3
    commit-message:
      prefix: "chore(deps)"
      include: "scope"
    labels:
      - "dependencies"
      - "security"
    reviewers:
      # - "yugmerabtene"   # à activer : reviewer Noah
```

**Choix weekly vs monthly** : le rythme hebdomadaire est retenu car les CVE
npm (astro, yaml) justifient un délai court de prise en compte ; le volume
est faible (2 dépendances + dev-deps) et plafonné par
`open-pull-requests-limit: 3`. Chaque PR Dependabot est vérifiée par le CI
(dont `npm audit --audit-level=high`) avant merge par Noah — cohérent avec
la procédure « CVE critique < 7 jours » (MAINTENANCE_PLAN.md §3.4). Le
reviewer Noah est laissé en placeholder commenté (compte GitHub réel à
confirmer).

## Bonus — `npm run contrast` dans la CI

Ajouté après `npm test` (script existant, zéro dépendance) :

```yaml
- name: Contraste des tokens du design system (WCAG 1.4.3)
  run: npm run contrast
```

Verrouille la régression de contraste du thème généré (M6 Phase 6, Q2)
à chaque push/PR.

## Checklist mise à jour (TODO_PRODUCTION.md)

- **§2.1 Système** : Dependabot actif (obligatoire, plus optionnel),
  CI avec audit + contrast.
- **§3.3 Client** : en-têtes de sécurité vérifiés au post-deploy (curl des
  6 headers), `security.txt` complété (aucun placeholder), endpoints
  formulaire tiers intégrés à la CSP (`connect-src` + `form-action`).
- **§3.4 Gate 3→4** : renvois à DEPLOYMENT.md §12.
- **MAINTENANCE_PLAN.md §6.2** : renouvellement annuel `Expires` de
  security.txt + re-vérification mensuelle des en-têtes.

## Vérifications finales (exécutées)

```bash
npm run build:example        # 16 pages OK (Node 22, astro@7.3.2)
ls dist/exemple-restaurant/_headers                        # présent
ls dist/exemple-restaurant/.well-known/security.txt        # présent
grep -c 'Strict-Transport-Security' dist/exemple-restaurant/_headers  # 1
grep -rho '<script type="module">' dist/exemple-restaurant/ | wc -l   # 39 (inline)
grep -rho '<style' dist/exemple-restaurant/ | wc -l                  # 32 (2/page, 16 pages)
grep -rho 'src="https://www.openstreetmap.org[^"]*"' dist/exemple-restaurant/ | wc -l  # 4
npm test                    # 30/30 PASS
npm run validate:example    # exit 0
npm run contrast            # all pass
npm audit --audit-level=high  # 0 vulnérabilité
```

## Conformité avec SECURITY_AUDIT.md (§6)

La condition C-04 reprend exactement la recommandation REC-06 :
HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy, CSP. La CSP
appliquée est **stricte** (plus restrictive que le modèle de l'audit :
`font-src` sans `*`, `base-uri`, `frame-ancestors`) mais prouvée
compatible avec le build réel (grep ci-dessus). `security.txt` est créé
(attendu par l'audit §6). Dependabot + npm audit CI résolvent REC-08.
Aucun conflit relevé — la preuve applicative (build + curl dist) prime sur
le modèle théorique ; chaque écart au modèle de l'audit est explicitement
justifié ci-dessus.

## Points ouverts transmis

1. **deploy-site.yml Node 20 → 22** : à traiter par le sprint Astro
   (dépendance croisée signalée).
2. **Hashs/nonces CSP** (`script-src` sans `unsafe-inline`) : évolution
   future (post-build) — documentée, non bloquante Gate 4.
3. **Endpoint formulaire tiers** : l'activation d'un endpoint externe chez
   un client réel exige la mise à jour `connect-src`/`form-action` de la
   CSP (procédure DEPLOYMENT.md §12.3, checklist TODO_PRODUCTION §3.2).
4. **security.txt par client** : placeholders à remplir par Noah avant
   chaque mise en production réelle (le template fournit le squelette
   commun).

---

# Sprint Gate 4 — Upgrade Astro + gestion cookies

Date : 2026-09-16
Responsable : AGENT 05 — Frontend Engineer
Portée : conditions bloquantes Gate 4 du verdict FINAL_REVIEW Phase 7 :
**B1 / C-01** (upgrade Astro ≥ 7.3.2 — 3 vulnérabilités npm audit, dont
1 critical) et **B3 / C-06** (lien « Gérer les cookies » pour retrait /
modification du consentement — exigence CNIL).
Périmètre respecté : `package.json`, `package-lock.json`, `.nvmrc`,
`src/` (Footer, CookieBanner, BaseLayout, translations). **Aucune
modification** de `.github/workflows/` ni des pages légales. Les
corrections Q1-Q6 (sprint précédent) sont conservées et re-vérifiées.

## B1 / C-01 — Upgrade Astro 5 → 7 (CRITIQUE — corrigé)

### Constat initial

```text
astro@5.18.2 — npm audit : 3 vulnérabilités (1 low esbuild, 1 high sharp, 1 critical astro)
critical : GHSA-26w7-cxv4-gfx2 — RCE via optimisation d'images AVIF (astro < 7.2.8)
+ XSS define:vars (GHSA-j687-52p2-xcff), SSRF Host (GHSA-2pvr-wf23-7pc7),
auth bypass base (GHSA-376h-93r7-7g6f), XSS transitions/slot names...
```

Le correctif des advisories critiques (RCE AVIF, auth bypass, XSS View
Transitions) **n'existe que dans la ligne 7.x** (>= 7.2.8 / 7.3.0) :
Astro 6.4.8 resterait vulnérable. L'upgrade vers **astro@7.3.2** est donc
obligatoire, et elle impose **Node >= 22.12.0** (`engines` d'astro 7 :
`node >=22.12.0` — Node 20 LTS n'est plus supporté depuis Astro 6).

### Décision D-FE-G4-01 — Migration runtime Node 20 → 22

Astro 7.3.2 exige Node >= 22.12.0 ; le projet (ex Node 20.20.2, CI Node 20)
devait migrer. Acté :

1. `package.json` : `engines.node` `>=20.3.0` → `>=22.12.0` ;
   `astro` `^5.0.0` → `^7.3.2`.
2. Ajout de `.nvmrc` (`22.12.0`) — recommandation officielle du guide de
   migration Astro v6 (documentation astro.build « Upgrade to v6 », § Node 22).
3. CI : `ci.yml` passé en Node 22 par le sprint DevOps (commit 7fba9ed).
   **Dépendance croisée restante** : `deploy-site.yml` encore en
   `node-version: 20` — corrigé par le sprint DevOps (je ne touche pas à
   `.github/workflows/`, périmètre mission).

### Commandes de migration

```bash
# Avant : node v20.20.2, astro@5.18.2
nvm install 22.23.2 && nvm use 22.23.2   # Node 22 LTS (Jod)
npm install  # re-resout astro@7.3.2 + vite@8.3.0 + esbuild@0.28.2 + sharp@0.35.4
```

### Breaking changes Astro v6/v7 rencontrés et résolutions

Aucun changement de code n'a été nécessaire pour ce projet (le pipeline
`generate-site.mjs → astro build` multi-clients d'ADR-002 a fonctionné
tel quel). Breakings évalués et écartés, avec la preuve :

| Breaking change (guide v6/v7) | Impact projet | Résolution / preuve |
|---|---|---|
| Node 20 supprimé (v6) | **RÉEL** | `engines` + `.nvmrc` + CI Node 22 (D-FE-G4-01) |
| Compilateur Rust (v7) : tags non fermés = erreur, HTML non auto-corrigé | Évalué | 23 templates `.astro` sans tag non fermé — build 16 pages OK |
| `compressHTML: 'jsx'` (v7) : suppression des espaces entre éléments inline | Évalué | CSS `.ds-footer__legal-list` en flexbox (gap) — aucune régression visuelle de texte ; inspecté : labels et textes intacts dans le build |
| Vite 8 (v7) : imports JSON | Évalué | `import uiStrings from '@translations/ui.json'` (alias Vite) fonctionne — build OK |
| `Astro.glob()` supprimé (v6) | Aucun usage | grep 0 occurrence |
| `<ViewTransitions />` / `astro:transitions` internals supprimés | Aucun usage | grep 0 occurrence |
| `getStaticPaths()` / content collections | Aucun usage | pages statiques, data.json importé directement |
| Flags expérimentaux supprimés (v7) | Aucun usage | config sans `experimental` |
| `src/fetch.ts` réservé (v7) | Aucun usage | pas de fichier fetch.ts |
| `@layer` / styles globaux / `is:inline` | Inchangés | `@layer ds-brand` (theme.css), 2 scripts `is:inline` (CookieBanner, Footer) émis correctement — vérifié dans le build |
| Aliases `@components/@layouts/@styles/@utils/@translations` | Inchangés | résolution Vite intacte — build 16 pages OK |

Les chemins dynamiques multi-clients d'`astro.config.mjs` (srcDir /
publicDir / outDir selon `CLIENT`, ADR-002) et les routes générées
`$$LANG$$` fonctionnent : build prouvé sur `exemple-restaurant` (16 pages,
FR + EN) et sur une fixture `exemple-restaurant-cookies` (16 pages,
supprimée après test).

### Résultat npm audit avant / après

```text
AVANT  : 3 vulnérabilités (1 low esbuild, 1 high sharp, 1 critical astro)
APRÈS  : 0 vulnérabilité  (npm audit ET npm audit --omit=dev)
```

## B3 / C-06 — Lien « Gérer les cookies » (MAJEUR — corrigé)

### Problème

Le CookieBanner persiste le choix dans `localStorage` (`ds_consent`, 6 mois)
mais, une fois le choix fait, **aucun mécanisme** ne permettait de le
modifier ou de retirer le consentement depuis le site. La CNIL exige un
moyen de retrait/modification à tout moment.

### Comportement implémenté (décision D-FE-G4-02)

Le clic sur « Gérer les cookies » **réouvre le bandeau in-place** via
l'événement `ds-manage-consent` (pas de rechargement — meilleure UX,
aucune perte de contexte) :

1. `Footer.astro` : lien (bouton `type="button"`, `aria-haspopup="dialog"`)
   affiché **uniquement** si `third_party.analytics || third_party.maps`
   (même condition que le CookieBanner).
2. Un script `is:inline` (émis uniquement si tiers actifs) écoute le clic
   et dispatch `window.CustomEvent('ds-manage-consent')`.
3. `CookieBanner.astro` : écoute `ds-manage-consent` → réaffiche le
   bandeau, **cases pré-cochées** selon le consentement courant
   (`syncCheckboxes`), focus restauré sur le premier bouton. Le retrait
   se fait via « Tout refuser » (persiste false + émet
   `ds-consent-updated`).

### Correctifs connexes (bugs latents corrigés)

- **Attribut `hidden` manquant** sur le `<div data-cookie-banner>` : sans
  lui, le bandeau était visible au chargement même avec un consentement
  stocké (contradiction avec le commentaire « Consenti, pas d'affichage »).
- **Boutons jamais liés quand un consentement existait** : l'ancien code
  sortait tôt (`return`) si `ds_consent` valide → les boutons restaient
  inopérants. Restructuration : les listeners sont toujours bindés, le
  bandeau ne s'affiche au chargement que si **aucun** choix valide n'existe.
- **Pré-cochage** : au chargement et à la réouverture, les checkboxes
  reflètent le dernier consentement (avant : toujours décochées).

### Clés i18n ajoutées (`src/translations/ui.json`)

```json
"footer": {
  "manageCookies": "Gerer les cookies"   // fr
  // "manageCookies": "Manage cookies"   // en
}
```

### Condition d'affichage (vérifiée dans le build)

- **Sans tiers** (`exemple-restaurant` : third_party analytics=false,
  maps=false) : 0 occurrence de « Gerer les cookies », `ds-manage-consent`,
  `data-manage-consent` ou `ds-cookie-banner` dans `dist/` — aucun script
  cookie émis. ✅
- **Avec tiers** (fixture temporaire `exemple-restaurant-cookies`,
  analytics=true, maps=true, supprimée après test) : lien présent sur les
  16 pages (FR « Gerer les cookies » / EN « Manage cookies »), bandeau avec
  `hidden`, scripts `ds-manage-consent` et `ds-consent-updated` émis. ✅
  Comportement prouvé par test runtime (mock DOM, 5 scénarios) :
  affichage au chargement sans choix, « Tout accepter » persiste et masque,
  rechargement avec choix → bandeau masqué, `ds-manage-consent` → bandeau
  réouvert avec cases pré-cochées, « Tout refuser » (retrait) → false
  persistant + événement émis.

## Vérifications finales (post-sprint)

```text
npm test                : 30/30 PASS
npm run validate:example: exit 0
npm run build:example   : 16 pages, exit 0
npm run contrast        : all pass (12 paires)
npm audit --omit=dev    : 0 vulnérabilité
npm audit               : 0 vulnérabilité

Régressions Q1-Q6      : JSON-LD Restaurant présent (1),
                         meta descriptions 120-160 (128-148),
                         0 « cuisine cuisine », 0 placeholder HTML,
                         404/500 avec ds-btn, 0 erreur render.
```

## Points ouverts transmis

1. **`deploy-site.yml` Node 20 → 22** : à corriger par le sprint DevOps
   (je ne modifie pas `.github/workflows/` par contrat de mission ; le CI
   `ci.yml` est déjà en Node 22).
2. **Scripts tiers réels** (analytics/maps) : le mécanisme de consentement
   (bandeau + lien + événements) est prêt ; l'injection effective des
   scripts tiers reste à poser lors de l'activation d'un tiers chez un
   client réel (les points d'intégration lisent `ds_consent` /
   `ds-consent-updated` avant injection — cf. commentaire « Blocage
   effectif » du CookieBanner).
