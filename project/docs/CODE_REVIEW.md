# Code Review — Revue technique independante

Date : 2026-09-15
Auteur : AGENT 13 — Code Reviewer (independent des developpeurs)
Perimetre : base de production Astro multi-clients (ADR-002) + template
flagship restaurant + scripts de pipeline + tests. Phase 5.
Methode : lecture du code source (src/, templates/, scripts/, tests/),
croisement avec les decisions actees (DECISIONS.md, ADR 001-010) et les
rapports Phase 4 (SECURITY_AUDIT, ACCESSIBILITY_AUDIT, PERFORMANCE_AUDIT,
BUGS.md, VERDICT.md). Aucune modification de code effectuee.

---

## Verdict

La base est **structurellement saine et conforme aux decisions d'architecture**
(SSG statique zero-JS par defaut, generation valider->generer->build, tokens
CSS, pas de dependance payante). La qualite unitaire est bonne : tests
significatifs, conventions respectees, commentaires utiles.

Le systeme n'est cependant **pas exempt de correctifs avant production** :
2 points BLOCKER securite/RGPD (deja conditionnes par la Phase 4, confirmes
par cette revue), 7 points MAJEURS dont 4 decouvertes par cette revue
(fonctionnalites mortes liees au modele SSG, config client ignoree, derive
des traductions, piege de contraste dans le theme genere).

Echelle de severite :

| Niveau | Definition |
| ------ | ---------- |
| BLOCKER | Doit etre corrige avant toute mise en production reelle (Gate 4) |
| MAJEUR | Doit etre corrige en Phase 6 : fonctionnalite inoperative ou derive structurelle |
| MINEUR | Defaut ponctuel de qualite / i18n / code mort |
| INFO | Amelioration recommandee, non bloquante |

---

## Points BLOCKER (securite / RGPD) — confirmations Phase 4

### B1. XSS JSON-LD via `set:html` non echappe — `src/layouts/BaseLayout.astro:83`

```astro
const schema = ...; // JSON.stringify des donnees client (description, reviews, FAQ, horaires)
<Fragment set:html={`<script type="application/ld+json">${schema}</script>`} />
```

`JSON.stringify` n'echappe pas `<` : un champ texte du client_data.yaml
(menu, FAQ, avis...) contenant `</script>` permet une injection de balise dans
le `<head>` de chaque page. Classe GHSA-j687-52p2-xcff. Confirme le constat
SECURITY_AUDIT C-02.

**Correctif** : `schema.replace(/</g, '\\u003c')` avant injection.

### B2. Google Fonts CDN charge sans consentement — `src/layouts/BaseLayout.astro:79-81`

```astro
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?...">
```

Requete inconditionnelle vers Google (USA) sur toutes les pages — IP envoyee
sans consentement (precedent CNIL SAN-2022-004). `fonts.css` + `fetch-fonts.mjs`
(self-hosted, ADR-010) existent deja mais ne sont pas utilises par defaut.
Confirme le constat SECURITY_AUDIT C-03.

**Correctif** : retirer les 3 liens CDN ; `fetch-fonts.mjs` + copie dans
`public/fonts/` (deja fait par `generate-site.mjs` quand `fonts-cache/`
existe), avec fallback system-ui.

---

## Points MAJEURS

### M1. Badge « Ouvert/Ferme » inoperant — `src/components/OpeningHours.astro`

Le statut temps reel est **mort** : le script lit une donnee jamais posee.

```astro
<!-- ligne 22 : le conteneur est rendu SANS data-schedule -->
{data.show_status ? <div id="ds-status" class="ds-opening__status" data-status></div> : null}

<!-- script (lignes 47-50) : lit une donnee absente du DOM -->
const scheduleJson = (statusEl.dataset.schedule || '[]');
let schedule;
try { schedule = JSON.parse(scheduleJson); } catch { schedule = []; }
if (schedule.length) { /* ... jamais execute : [] est vide */ }
```

`show_status: true` est configure (template.yaml, data.json) mais le badge
"Ouvert"/"Ferme" n'apparait **jamais**. Par ailleurs, ligne 27 :

```astro
const isToday = new Date().getDay() === (FR_DAYS.indexOf(day) + 1) % 7;
```

`new Date()` est evalue au **build** (SSG) : la ligne « aujourd'hui » surlignee
est fige sur le jour de generation et devient fausse des le lendemain.

**Correctif** : poser `data-schedule={JSON.stringify(schedule)}` sur le
conteneur status (ligne 22) ; reporter le calcul du jour courant cote client
(le script existe deja et pourrait regler lui-meme la classe `--today`).

### M2. Date minimale de reservation figee au build — `src/components/ReservationForm.astro:66`

```astro
min={new Date().toISOString().slice(0, 10)}
```

Une valeur calculee au build sur un site statique : l'attribut `min` devient
périmé des le jour suivant le build (les dates passees redeviennent
selectionnables, puis plus tard toutes les dates sont passees). Sans
regeneration, le formulaire perd sa garde-fou temporel.

**Correctif** : ne pas mettre de `min` au build ; fixer la borne au runtime
dans le script (meme pattern que le statut M1), ou emettre la date de build
avec un avertissement.

### M3. `third_party` du client ignore par le pipeline — `scripts/generate-site.mjs:210`

```js
third_party: template.third_party || {},
```

La section `third_party` du `client_data.yaml` (analytics, maps) est **ecrasee**
par celle du template : un client qui demanderait une mesure d'audience ou une
carte tierce (ADR-008 : activable « si un client le demande ») ne changerait
**rien** au site genere — ni bandeau cookies, ni integration. La promesse
« configuration + contenu » de D-PM-01 est rompue sur ce point.

**Correctif** : fusionner le contrat tiers comme les autres composants
(`{ ...template.third_party, ...clientData.third_party }`) et propager aux
composants (CookieBanner, Map).

### M4. Traductions : trois fichiers derives, un seul utilise — `src/translations/`

`ui.json` (structure `{ fr, en }`) est la seule source consommee
(`import uiStrings from '@translations/ui.json'` dans toutes les pages).
`fr.json` et `en.json` (structure plate) sont **morts** mais toujours
maintenus, et **divergent** de `ui.json` :

| Cle | ui.json | fr.json / en.json |
| --- | ------- | ----------------- |
| `nav.menu` | « La Carte » | « Le menu » |
| `states.404.cta` vs `cta1` | `cta1` | `cta` (structure differente) |
| `form.retry`, `form.backHome` | absents | presents |
| `cookie.necessary*`, `analytics*`, `map*` | absents | presents |
| `hours.label` | absent | present |

Deux sources de verite en derive : tout developpement futur corrigera l'un
sans l'autre.

**Correctif** : supprimer `fr.json` / `en.json` (ou les generer depuis
`ui.json`), et unifier les schemas de cles.

### M5. Multilingue EN inexploitable — pages du template (confirme BUG-QA-01/03)

`generate-site.mjs` genere bien `data.texts_en` (JSON complet, lignes 156-157),
mais **aucune page ne le lit** :

```astro
<!-- templates/restaurant/pages/index.astro:25 (identique en/ et fr/) -->
const texts = data.texts?.index || {};
```

`texts_en` est absent de tous les fichiers `src/**/*.astro|js`. Les pages EN
(`/en/`) affichent donc le contenu FR (hero, intro, a-propos, legal), et les
fallbacks FR en dur (`'Reserver'`, `'La Carte'`) fuient dans l'interface EN.
Ce point rend le multilingue (D-PM-08) non livrable.

**Correctif** : `const texts = (lang === 'en' ? data.texts_en : data.texts)?.[page]`
dans les pages du template, et — pour la nav — basculer `Header.astro` sur
`ui.nav` (deja traduit) au lieu des labels FR de `data.components.header.nav`.

### M6. Theme genere : tokens de contraste en contradiction avec le design system

`src/sites/<slug>/theme.css` (genere par `generate-site.mjs` §7) :

```css
--color-on-primary: #fff;
--color-on-secondary: #fff;   /* tokens.css: #1f2937 (texte sombre sur ambre) */
--color-on-accent: #fff;
--color-primary-dark: #B91C1CCC;  /* tokens.css: #7f1d1d — hex+alpha, pas un vrai sombre */
```

Trois derives :

1. `--color-on-secondary: #fff` contredit `tokens.css:129` (`#1f2937`) : blanc
   sur ambre `#F59E0B` = **2,1:1** — echec WCAG AA 4,5:1. Aucun composant ne
   consomme ce token aujourd'hui (`grep --color-on-secondary` : aucune
   utilisation), mais le generateur fige un piege pour le prochain template
   qui utilisera la variante `secondary` (D-UX-10 : palettes par secteur).
2. `--color-*-dark: <hex>CC` : variante « dark » obtenue par opacite 80 % au
   lieu d'une teinte sombre — texte/clic sur ces fonds produit une couleur
   semi-transparente instable selon le fond (hover CTA, skip-link).
3. `contrast-check.mjs` ne teste ni `white-on-secondary` ni les 8 chiffres
   hexadécimaux generes : le CI ne peut pas detecter ces defauts.

**Correctif** : calculer les couleurs `on-*` a partir du contraste (le script
`contrast-check.mjs` existe deja — l'utiliser comme garde-fou de generation),
deriver `dark` par interpolation reelle, et ajouter la paire
white/on-secondary aux checks.

### M7. Mapping des jours FR duplique six fois

| Fichier | Symbole | Ordre |
| ------- | ------- | ----- |
| `src/utils/schema.js` | `DAY_MAP` (Lundi->Monday...) | lundi..dimanche |
| `src/utils/hours.js` | `DAY_TO_SCHEMA` | lundi..dimanche |
| `src/utils/reservation.js` | `DAY_NAMES` (getDayName) | dimanche..samedi |
| `src/components/OpeningHours.astro` | `FR_DAYS` (l.14) + `days` (script l.46) | 2 x lundi..dimanche |
| `scripts/validation-core.mjs` | `DAYS_FR` | lundi..dimanche |

Six copies du meme domaine avec **deux ordres contradictoires**
(Array.getDay() : dimanche = 0). Toute evolution (jours anglais, fermeture
exceptionnelle) devra etre repete 6 fois — la promesse « base reutilisable »
(D-PM-01) en prend un coup.

**Correctif** : creer `src/utils/days-fr.mjs` (constantes + helpers
`FR_DAYS`, `dayIndex(dateStr)`, `translateDay(frDay)`) importe partout, teste
une fois. Les regex `FORMATS` de `validation-core.mjs` restent en frontiere.

---

## Points MINEURS

### m1. `localizePath` reimplemente trois fois

`src/utils/i18n.js` fournit `localizePath()` ; `Header.astro` (~l.30) et
`Footer.astro` (~l.21) reimplementent la meme logique inline. Risque de derive
sur la gestion des routes traduites.

**Correctif** : importer `localizePath` dans Header et Footer.

### m2. Logique d'horaires schema.org dupliquee

`buildOpeningHoursSchema()` (`schema.js`) et `toOpeningHoursSchema()`
(`hours.js`) sont deux transformations du meme objet — seul le rendu final
change (attribut vs liste). Centraliser dans `hours.js` et reutiliser.

### m3. `setFieldError` et coeur de formulaire dupliques

`ContactForm.astro` et `ReservationForm.astro` partagent la meme fonction
`setFieldError`, la meme gestion `aria-invalid`/erreur globale, le meme
patron honeypot/envoyee. ~120 lignes quasi identiques. L'extraction d'un
composant/base `BaseForm.astro` (ou hook partage) reduirait la surface de
maintenance — les deux formulaires doivent rester des wrappers distincts.

### m4. Code mort

| Emplacement | Detail |
| ----------- | ------ |
| `LanguageSwitcher.astro:14` | `const target = lang === 'en' ? '/fr' : '/en';` jamais utilise |
| `CookieBanner.astro` (2e bloc script) | `isAllowed` inutilise, listener `ds-consent-updated` vide |
| `src/utils/consent.js` | aucun import dans `src/` (aucun match) |
| `src/translations/fr.json`, `en.json` | non importes (voir M4) |
| `Header.astro:8` + `SkipLink.astro` | `import SkipLink` present mais le rendu est un `<a>` inline (l.46) — import et composant morts |

**Correctif** : suppression (ou branchement reel) — garder le 2e bloc
cookie s'il doit traiter le retrait de consentement (D-SEC-07), sinon le
retirer.

### m5. Chaines FR en dur sur pages EN

`OpeningHours.astro` (script : `'Ouvert'`/`'Ferme'`), `Gallery.astro:56`
(`aria-label="Fermer"`), `Breadcrumb.astro:17` (`aria-label="Fil d'Ariane"`),
`ReservationForm.astro:83` (`'personne'`/`'personnes'`), fallbacks
`'Reserver'`/`'La Carte'` des pages template. Memoriser `ui` dans ces
composants (deja prop) comme le fait `BackToTop`. La traduction `hours.open/
closed` et `form.partySize` existent deja dans `ui.json`.

### m6. SEO : patrons `seo_title` du template inutilises (confirme BUG-QA-04)

`template.yaml` definit des patrons riches (`[Nom] — Restaurant [Activite] a
[Ville]`) mais les pages construisent le `<title>` via `buildTitle({ title:
texts.title })` — le pattern ville/activite n'apparait dans aucun title.
Parallelement, 5 pages passent `description={title}` (confirme BUG-QA-05),
meta descriptions de 7-20 caracteres.

**Correctif** : utiliser `template.yaml pages[].seo_title` (deja rempli par
`generate-site.mjs`) comme source du title, et `buildDescription` avec
fallback `seo.meta_description` partout.

### m7. Script cookie toujours emis sans tiers (confirme BUG-QA-06)

`CookieBanner.astro` rend `null` sans tiers mais le `<script>` inline
(`querySelector('[data-cookie-banner]')`) est compile sur les 16 pages.
**Correctif** : conditionner l'emission du script au rendu effectif du
bandeau (rendu conditionnel SSG).

### m8. `contrast-check.mjs` : couverture partielle

Paire `white-on-secondary` absente ; regex `#[0-9A-Fa-f]{6}` ne matche pas
les 8 chiffres generes (`#B91C1CCC`) — les variantes `*-dark` ne sont donc
jamais verifiees alors que ce sont elles du hover/skip-link.

### m9. `CTA.astro:50` : `target` sans `external` -> `rel: undefined`

```astro
...(external || target ? { target: target || '_blank', rel: external ? 'noopener noreferrer' : undefined } : {}),
```

`target="_blank"` sans `rel="noopener"` expose a l'opener-reversal (risque
faible : aucun usage actuel ne passe `target` sans `external`). Rendre
le rel inconditionnel quand `target` est pose.

---

## Points INFO

### i1. Couverture des tests

30 tests unitaires de bonne qualite (validation, creneaux, formulaires).
Aucune couverture du **pipeline de generation** (`generate-site.mjs`) : les
bugs M1/M2/M3/M5 (dates SSG, template en dur, texts_en jamais lu, third_party
ignore) sont precisement du type qui echappe aux tests unitaires purs.
**Recommandation** : 2-3 tests d'integration legers (generer le site exemple
en memoire temporaire et verifier : `texts_en` consomme, `data-schedule`
pose, `third_party` client fusionne, aucun `$$LANG$$` residuel).

### i2. `src/sites/` gitignore (conforme ADR-002)

La version generee n'est pas versionnee ; `generate-site.mjs` regenere tout.
Bon point : pas de double source de verite. A conserver tel quel.

### i3. Regex de validation dupliquees frontiere

`FORMATS` (`validation-core.mjs`) et `utils/forms.js` portent chacun leur
copie des regex email/telephone. Elles sont alignees aujourd'hui ; un module
partage (`src/utils/formats.mjs`) les reunirait (D-BE-04 dit « une seule
source de verite » — le refactor s'impose des que le 2e consommateur arrive).

### i4. Tests `reservation.test.mjs` : dates 2026 correctes, rien a signaler.

---

## Validation des rapports Phase 4 (croisement code vs constats)

| Rapport | Constat | Verdict revue |
| ------- | ------- | ------------- |
| SECURITY : C-02 JSON-LD XSS | `set:html` non echappe | **CONFIRME** (B1) |
| SECURITY : C-03 fonts CDN | requete inconditionnelle | **CONFIRME** (B2) |
| SECURITY : C-06 retrait consentement absent | pas de lien « gerer les cookies » cote fichier | CONFIRME (aucun bouton de retrait dans CookieBanner) |
| A11Y : contraste secondary | non detecte par l'audit comme defaut de generation | **A COMPLETER** (M6 : piege latent + paires manquantes du checker) |
| A11Y : statut horaires injecte JS | observer le statut injecte | **A COMPLETER** (M1 : le badge n'est pas seulement non-accessible, il ne s'affiche jamais) |
| PERF : bundle CSS 404/500 | feuille dupliquee sur les etats speciaux | constat non infirme ; hors perimetre de cette revue (separateur CSS Astro) |
| QA : BUG-QA-01/03 multilingue | pages EN = contenu/nav FR | **CONFIRME** (M5), cause exacte identifiee (`data.texts` vs `data.texts_en`) |
| QA : BUG-QA-04/05 metadata | titles courts, description=title | **CONFIRME** (m6) |
| QA : BUG-QA-06 script cookie | script emis sans tiers | **CONFIRME** (m7) |
| QA : BUG-QA-07 template en dur | `templates/restaurant` hardcode | **CONFIRME** (cf. i1 ; `generate-site.mjs:77`) |
| QA : BUG-QA-08 meta 105 car. | en lien avec BUG-QA-01 | CONFIRME |

Points **non detectes** par la Phase 4 et decouverts par cette revue : M1
(statut horaires mort + jour fige), M2 (min date au build), M3 (third_party
client ignore), M6 (piege contraste du theme genere), M4 (trois fichiers de
traduction derives).

---

## Synthese par fichier

| Fichier | Points |
| ------- | ------ |
| `src/layouts/BaseLayout.astro` | B1 (set:html XSS), B2 (CDN fonts) |
| `src/components/OpeningHours.astro` | M1 (statut mort, jour fige), m5 (FR en dur), duplication jours (M7) |
| `src/components/ReservationForm.astro` | M2 (min au build), m3 (setFieldError), m5 (FR en dur) |
| `src/components/ContactForm.astro` | m3 (duplication coeur formulaire) |
| `src/components/Header.astro` | m1 (localize), m4 (import SkipLink mort) |
| `src/components/Footer.astro` | m1 (localize) |
| `src/components/Gallery.astro` | m5 (aria-label FR) |
| `src/components/Breadcrumb.astro` | m5 (aria-label FR) |
| `src/components/LanguageSwitcher.astro` | m4 (variable morte) |
| `src/components/CookieBanner.astro` | m4 (2e script mort), m7 (script inconditionnel) |
| `src/components/CTA.astro` | m9 (rel optionnel) |
| `src/utils/schema.js`, `hours.js`, `reservation.js`, `i18n.js`, `consent.js` | M7 (jours), m2 (horaires schema), m1 (localize), m4 (consent mort) |
| `src/translations/` (ui/fr/en.json) | M4 (triple source derivee) |
| `scripts/generate-site.mjs` | M3 (third_party ignore), M5 (texts_en genere mais non consomme par les pages), M6 (theme.css), i1 (aucun test pipeline) |
| `scripts/contrast-check.mjs` | m8 (paires manquantes) |
| `scripts/validation-core.mjs` | M7 (DAYS_FR), i3 (regex dupliquees) |
| `src/sites/exemple-restaurant/theme.css` | M6 (tokens on-secondary/hex+alpha) |
| `templates/restaurant/pages/*.astro` | M5 (data.texts au lieu de texts_en), m5 (fallbacks FR) |
| `templates/restaurant/template.yaml` | m6 (seo_title inutilises) |
| `tests/*` | Bonne qualite ; i1 (complements pipeline) |

---

## Trois priorites pour la Phase 6

1. **Securite et RGPD (B1, B2)** — XSS JSON-LD et fonts CDN sans consentement
   bloquent la Gate 4 ; correctifs de quelques lignes.
2. **Fonctionnalites mortes / pipeline (M1, M2, M3, M5)** — statut horaires,
   min de reservation, `third_party` client, multilingue EN : ce sont des
   promesses de l'offre (« config + contenu », D-PM-01/08) qui ne
   fonctionnent pas ; corrections ciblees dans les pages template, les
   composants et `generate-site.mjs`.
3. **Consolidation de la base reutilisable (M4, M6, M7, m1-m3)** —
   translations uniques, module jours unique, theme calcule par contraste,
   suppression du code mort : c'est ce qui rendra le 2e template (artisan)
   rapide a produire, objectif central du cahier des charges (sections 8-10).

---

## Points ouverts / dependances

- Les correctifs ci-dessus sont a realiser en **Phase 6 (corrections)** par
  frontend-engineer et backend-engineer ; cette revue ne modifie aucun code.
- Le template en dur `templates/restaurant` (BUG-QA-07) est un choix acte
  (D-PM-06) ; sa resolution (lecture de `clientData.template?.type`) est a
  planifier avec le 2e template — corriger l'ordre des jours (M7) **avant**
  ce 2e template.
- B1/B2 restent des conditions Gate 4 actees par le security-engineer
  (conditions C-02/C-03) : cette revue les confirme sans arbitrage nouveau.
- Aucun secret, aucune API key ni donnée personnelle trouvee dans le depot.
- Conventions de commit respectees sur les 10 commits existants.
