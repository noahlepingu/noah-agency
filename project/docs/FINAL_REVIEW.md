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
