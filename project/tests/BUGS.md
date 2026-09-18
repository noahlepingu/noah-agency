# Bugs et observations — Phase 4 QA + Refonte visuelle

Date : 2026-09-18 (maj apres verification refonte « Bistrot lyonnais », commit be42a43)
Etat : OUVERTS (a traiter en Phase 6 — Corrections, sauf mention contraire)
Severite : MAJEUR (bloque une fonctionnalite livrable) / MINEUR (defaut
ponctuel de qualite) / OBSERVATION (limite d'architecture, pas un defaut code)

---

## BUG-QA-13 — Intro accueil : H2 absent des donnees d'exemple (OBSERVATION)

**Etat : OUVERT — a completer cote contenu (client_data.yaml / content).**

- **Description** : la section intro de l'accueil (DA §5.2 : surtitre + H2
  Fraunces 500 + chapeau) ne rend pas de H2 : `texts.index.intro_subtitle`
  est `null` dans `data.json` (non fourni dans le YAML exemple). Le surtitre
  « Bienvenue » (`intro_title`) et le chapeau (`intro_text`) sont rendus.
- **Impact** : section d'intro sans titre ; hierarchie H1 → H2 interrompue
  sur la page d'accueil (le H2 suivant est « La Carte » 2 sections plus loin).
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -c '<h2' dist/exemple-restaurant/index.html` — 0 dans la section intro
- **Correctif possible** : ajouter `intro_subtitle` dans
  `content/clients/exemple-restaurant/client_data.yaml` (et sa version EN).

## BUG-QA-12 — Footer EN : « Site fait a Lyon » non traduit (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend/translations).**

- **Description** : sur les 3 pages EN (`/en/`, `/en/a-propos`, `/en/contact`),
  la signature du footer reste « Site fait a Lyon » (FR). « All rights
  reserved » est bien traduit, mais pas la signature artisanale.
- **Impact** : residu de localisation sur page EN (multilingue moins credible).
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -o 'Site fait a Lyon' dist/exemple-restaurant/en/index.html`
- **Correctif possible** : router la chaine via `ui.footer` (traduction « Made
  in Lyon » dans `content/clients/exemple-restaurant/client_data.yaml` /
  `ui.json`) comme le reste du footer.

## BUG-QA-11 — JSON-LD : description EN en francais (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend/seo).**

- **Description** : sur les pages EN, le JSON-LD `@type:Restaurant` porte une
  `description` en FR (« Restaurant de cuisine francaise avec des produits
  frais et locaux ») alors que `description_en` (« French restaurant with
  fresh, local produce in the heart of Lyon ») est dispose dans
  `client_data.yaml` mais jamais route.
- **Impact** : les moteurs peuvent afficher une description FR dans les SERP
  EN ; donnees structurees incoherentes avec la version linguistique.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `grep -o '"description":"[^"]*"' dist/exemple-restaurant/en/index.html`
- **Correctif possible** : dans `schema.js`/`schema.ts`, choisir
  `business.description_en` quand `lang === 'en'`.

## BUG-QA-10 — Pages EN : metadata SEO (title + description) en francais (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend/seo).**

- **Description** : les `<title>` et `<meta name="description">` des 3 pages
  EN restent strictement identiques aux versions FR (en francais). Ex. :
  `/en/` : title « La Table d'Essai — Restaurant cuisine francaise a Lyon »,
  description « Decouvrez La Table d'Essai... ». `meta_description_en` existe
  dans `client_data.yaml` mais n'est pas route.
- **Cause** : `seo_titles`/`seo_descriptions` de `data.json` sont monolingues
  FR (patterns du `template.yaml`) ; `buildTitle`/`buildDescription`
  (`src/utils/seo.ts`) ne selectionnent jamais de cle EN.
- **Impact** : SEO local EN inexploitable (les pages EN sont indexees avec des
  metadata FR) ; reliquat direct de BUG-QA-01/08 (desormais partiellement
  corriges — voir table de regression).
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `diff <(grep -o '<title>[^<]*' index.html) <(grep -o '<title>[^<]*' en/index.html)`
- **Correctif possible** : router `seo_titles`/`seo_descriptions` par langue
  dans les pages (`lang === 'en' ? data.texts_en ... : data.texts`) et fournir
  les valeurs EN dans le YAML/template content. Se rapprocher de la
  solution BUG-QA-01 Phase 6 (deja implantee pour le corps des pages).

## BUG-QA-09 — EN : lien « See the full menu » → /en/menu → 404 (MINEUR)

**Etat : OUVERT — a corriger en Phase 6 (frontend).**

- **Description** : sur `/en/index.html`, le bouton « See the full menu » de
  la preview Menu pointe vers `/en/menu` — page inexistante (404), car seul
  `/en/`, `/en/a-propos`, `/en/contact` sont traduits (D-FE-04).
  `src/components/Menu.astro` ligne 46 prefxe `/en/` inconditionnellement
  (`Astro.url.pathname.split('/')[1] === 'en' ? 'en/' : ''`) au lieu
  d'utiliser `localizePath`/`translated_routes` (comme Header.astro). Les
  liens equivalents `a-propos`/`contact` EN locales utilisent eux
  `translated_routes` et sont corrects.
- **Impact** : 1 lien casse sur 359 scannes ; le CTA principal de la page EN
  amene sur une erreur 404.
- **Etapes de reproduction** :
  1. `npm run build:example`
  2. `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:4321/en/menu` → 404
  3. (ou) ouvrir `/en/` et cliquer « See the full menu ».
- **Correctif possible** : dans Menu.astro, remplacer le calcul du lien par
  `localizePath('/menu', lang, data.translated_routes)` et, si `/en/menu`
  absent de `translated_routes`, afficher un lien vers `/menu` (page FR) avec
  libelle traduit (meme strategie que le header EN).

---

## BUG-QA-01 — Pages EN : contenu francais affiche (MAJEUR — CORRIGE, reliquat metadata)

**Etat : CORRIGE (refonte be42a43) — corps des pages EN traduit.
  Reliquat metadata SEO non localisees : voir BUG-QA-10 et BUG-QA-11.**

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

**Etat : CORRIGE (refonte be42a43) — 0 occurrence « cuisine cuisine » dans le build.**

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

**Etat : CORRIGE (refonte be42a43) — nav EN « Home/Menu/Reservation/Contact »
+ CTA « Book a table ». Reliquat footer : voir BUG-QA-12.**

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

**Etat : CORRIGE (refonte be42a43) — les `<title>` suivent les patterns
(« La Carte — La Table d'Essai », « Contact — La Table d'Essai », etc.).**

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

**Etat : CORRIGE (refonte be42a43) — descriptions 128-146 car., toutes ≠ titres.**

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

**Etat : CORRIGE (refonte be42a43) — 0 occurrence `ds-consent`/`data-cookie-banner`
sur les 16 pages (aucun script cookie emis sans tiers actifs).**

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

**Etat : INCHANGE (refonte) — toujours `templates/restaurant` en dur dans
generate-site.mjs §3. Decision architecture : voir Roadmap v1 (D-PM-06,
D-UX-12 : template flagship restaurant ; autres secteurs en SHOULD).**

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

**Etat : PARTIELLEMENT CORRIGE (refonte be42a43) — description FR = 140 car. ✓.
  Version EN toujours identique a la FR (reliquat localisation) : voir BUG-QA-10.**

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

Passe refonte (2026-09-18) : aucune regression des fonctionnalites Phase 2/3
apres re-run — 30 tests unitaires PASS, validate:example exit 0,
build:example 16 pages OK, contraste 11/11 PASS, 0 lien casse hors BUG-QA-09
(359 liens scannes), 0 placeholder ({{, $$LANG$$, [Nom], lorem) dans le HTML.

Ancienne passe (2026-09-15) : aucune regression detectee — 30 tests unitaires
PASS, validate:example exit 0, build:example 16 pages OK.

## Bilan

| Severite | Nb | Etat apres refonte |
| -------- | -- | ------------------- |
| MAJEUR | 0 | BUG-QA-01 et BUG-QA-03 corriges (reliquats metadata/footer -> BUG-QA-10/11/12) |
| MINEUR | 5 | BUG-QA-09, 10, 11, 12 (nouveaux, cotes EN) ; BUG-QA-08 partiellement corrige |
| OBSERVATION | 2 | BUG-QA-07 (architecture, inchange) ; BUG-QA-13 (contenu intro manquant) |
| CORRIGES | 6 | BUG-QA-02, 03, 04, 05, 06, 08 (partiel) |

Traitement prevu : BUG-QA-09 (lien 404, 1 ligne Menu.astro) avant toute
livraison multilingue ; BUG-QA-10/11/12 en Phase 6 — Corrections
(frontend/seo/translations, routing par langue des metadata et du schéma).
BUG-QA-13 : completer le YAML exemple (contenu).