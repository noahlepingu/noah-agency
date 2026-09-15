# Bugs et observations — Phase 4 QA

Date : 2026-09-15
Etat : OUVERTS (a traiter en Phase 6 — Corrections, sauf mention contraire)
Severite : MAJEUR (bloque une fonctionnalite livrable) / MINEUR (defaut
ponctuel de qualite) / OBSERVATION (limite d'architecture, pas un defaut code)

---

## BUG-QA-01 — Pages EN : contenu francais affiche (MAJEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend).**

- **Description** : Les 3 pages EN (`/en/`, `/en/a-propos`, `/en/contact`)
  affichent le contenu FR. `data.texts_en` existe dans `data.json` et contient
  la traduction EN complète, mais **aucun composant ne le lit** : toutes les
  pages utilisent `data.texts`. Grep : `texts_en` est absent de tous les
  fichiers `src/**/*.astro|js|ts` (hors data.json genere).
- **Impact** : multilingue EN inexploitable — les visiteurs EN voient du FR.
  Contredit REQUIREMENTS FR-I18N et D-PM-08 (EN basique pages cles).
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. Ouvrir `dist/exemple-restaurant/en/index.html` : hero et textes = FR
     (« Savourez une experience culinaire unique... », accent « né » present).
  3. De meme pour `en/a-propos` et `en/contact`.
- **Cause probable** : les pages (templates/restaurant/pages/*.astro) font
  `const texts = data.texts?.xxx` — la cle EN n'est jamais selectionnee selon
  `lang`. Solution envisagee Phase 6 : `const texts = (lang === 'en' ? data.texts_en : data.texts)?.xxx` ou utilisation de `data.texts[lang]`.

## BUG-QA-02 — A-propos : meta description « cuisine cuisine francaise » (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend/content).**

- **Description** : `dist/exemple-restaurant/a-propos/index.html` contient
  « ...pour la cuisine cuisine francaise... » (doublon du mot « cuisine »).
- **Cause** : `templates/restaurant/content/fr.json` -> `a-propos.content` :
  « ...pour la cuisine [Activite]. » avec `[Activite]` = « cuisine francaise »
  (activityLabel). L'injection produit « la cuisine cuisine francaise ».
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -o "cuisine cuisine" dist/exemple-restaurant/a-propos/index.html`
- **Correctif possible** : reformuler le texte template (« ...pour la
  [Activite]. ») ou fixer activityLabel (mais il est calibre pour SEO
  « Restaurant cuisine francaise a Lyon »).

## BUG-QA-03 — Navigation EN : labels et CTA en francais (MAJEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend).**

- **Description** : sur les pages EN, le header affiche « Accueil », « La
  Carte », « Reservation », « Contact » et le CTA « Reserver une table » —
  tous en FR. `src/translations/ui.json` contient pourtant les labels EN
  (`ui.nav`), mais `Header.astro` lit `data.components.header.nav` (labels FR
  du template.yaml), jamais `ui.nav`. Le fallback `aria-label` du logo est
  aussi « Accueil » en dur.
- **Impact** : la navigation d'une page EN est entierement en francais ;
  le multilingue n'est pas credible.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. Ouvrir `dist/exemple-restaurant/en/index.html` : liens nav = labels FR.
- **Notes** : les href sont correctement localises (`/en/contact`) via
  `translated_routes` ; seuls les labels sont en FR. Pour menu/reservation
  (non traduits), le lien pointe sur la page FR — acceptable ; le label doit
  rester comprehensible EN.

## BUG-QA-04 — Patterns SEO `seo_title` du template inutilises (MINEUR)

**Etat : OUVERT — a arbitrer en Phase 6 (frontend/seo).**

- **Description** : `templates/restaurant/template.yaml` definit des patterns
  `seo_title` par page (ex. index « [Nom] — Restaurant [Activite] a
  [Ville] », contact « Contact — [Nom] ») mais les pages construisent leur
  `<title>` depuis `texts.title`/`texts.hero_title` via `buildTitle` sans
  reemployer ces patterns. Resultat : titles courts et sans leverage SEO
  (ex. contact = « Contact » 7 car., index = « La Table d'Essai » 20 car.,
  faq = « Questions frequentes » 20 car.).
- **Impact** : SEO local (requis par D-CS-*, SEO_SYSTEM.md §4.1) non
  exploite : le pattern ville/activite n'apparait dans aucun title.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -o '<title>[^<]*</title>' dist/exemple-restaurant/contact/index.html`
  3. Comparer a `template.yaml` `pages[contact].seo_title`.

## BUG-QA-05 — Meta description = titre sur 5 pages (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend).**

- **Description** : `contact.astro`, `reservation.astro`, `faq.astro`,
  `galerie.astro`, `temoignages.astro` passent `description={title}` a
  PageLayout (ex. `<meta name="description" content="Contact">`). Le module
  `buildDescription` (avec fallback `seo.meta_description`) n'est importe que
  par index/menu/a-propos.
- **Impact** : meta descriptions inexploitables (7 a 20 car., dupliquent le
  title) ; les pages contact/reservation/faq n'ont aucune description SEO.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -o '<meta name="description" content="[^"]*"' dist/exemple-restaurant/contact/index.html`
     => `content="Contact"`.
- **Correctif suggere** : utiliser `buildDescription({ description: texts.subtitle || texts.content }, data)`
  (fallback `seo.meta_description`) comme fait sur index/menu/a-propos.

## BUG-QA-06 — Script du bandeau cookies charge sans tiers actifs (MINEUR)

**Etat : OUVERT — a arbitrer en Phase 6 (frontend/perf).**

- **Description** : `CookieBanner.astro` rend `null` quand
  `third_party.analytics=false && maps=false` (comportement correct : aucun
  bandeau affiche), mais Astro inclut quand meme le `<script>` inline qui
  fait `document.querySelector("[data-cookie-banner]")` sur chaque page —
  ~0,9 kB de JS parse/execute inutilement sur les 16 pages (le selecteur
  retourne null et le script se termine).
- **Impact** : poids JS legerement augmente pour rien ; l'evenement
  « ds-consent-updated » est egalement ecoute a vide sur chaque page.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -c "ds-consent-updated" dist/exemple-restaurant/index.html` => 3
     (script present alors que le bandeau n'existe pas dans le DOM).
- **Correctif suggere** : placer le `<script>` sous la condition SSG
  (Astro.processScripts ou `<Fragment>` conditionnel) pour ne l'emettre que
  si `hasThirdParty`, ou charger le script dans le composant uniquement quand
  rendu.

## BUG-QA-07 — Generation monotype : `templates/restaurant` en dur (OBSERVATION)

**Etat : OUVERT — decision architecture (Roadmap v1 = template flagship
restaurant, D-PM-06/D-UX-12).**

- **Description** : `scripts/generate-site.mjs` §3 charge toujours
  `templates/restaurant/template.yaml` et copie les pages de ce dossier, quel
  que soit `business.category` / `template.type` du client (ex. artisan
  accepte par la validation mais genererait un site restaurant).
- **Impact** : la promesse multi-secteurs du cahier des charges (section 8-10 :
  templates/artisan, commerce...) n'est pas encore implementee ; toute
  categorie non-restaurant genere un mauvais site aujourd'hui.
- **Reproduction (raisonnement) :**
  1. Creer un client `category: artisan` VALIDE (REQUIRED remplis,
     regle C-01 respectee)
  2. `node scripts/generate-site.mjs --client <slug> --build`
  3. Le build produit des pages restaurant (menu, reservation...) pour un
     cafe artisan.
- **Note** : conforme au perimetre v1 (flag D-PM-06 : autres secteurs en
  SHOULD) ; a documenter explicitement dans generate-site.mjs et a verifier
  quand un 2e template sera livre (roadmap). La lecture du template devrait
  suivre `clientData.template?.type`.

## BUG-QA-08 — Index : meta description 105 car. et identique EN/FR (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend/content).**

- **Description** : la meta description de l'accueil
  (`dist/exemple-restaurant/index.html`) fait 105 caracteres (< 120-160
  recommande par SEO_SYSTEM.md) ; celle de `en/index.html` est strictement
  identique (ici : texte FR), en lien avec BUG-QA-01.
- **Cause** : `index.astro` passe `description = texts.hero_subtitle`
  (fallback `data.seo.meta_description` absent de hero_subtitle), et le
  fallback EN n'existe pas.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. Comparer les `<meta name="description">` de `index.html` et `en/index.html`.
- **Correctif suggere** : router via `data.texts_en` (BUG-QA-01) et utiliser
  un texte dedie de 120-160 car. pour la description accueil (template
  content/fr.json + en.json).

---

## Regressions

Aucune regression detectee sur les fonctionnalites Phase 2/3 apres re-run :
30 tests unitaires PASS, validate:example exit 0, build:example 16 pages OK.

## Bilan

| Severite | Nb | Traitement prevu |
| -------- | -- | ---------------- |
| MAJEUR | 2 (BUG-QA-01, BUG-QA-03) | Phase 6 — Corrections (frontend, multilingue) |
| MINEUR | 5 (BUG-QA-02, 04, 05, 06, 08) | Phase 6 — Corrections (frontend/seo) |
| OBSERVATION | 1 (BUG-QA-07) | Decision archi (roadmap 2e template ; a documenter) |