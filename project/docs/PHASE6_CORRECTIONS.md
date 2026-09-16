# Phase 6 — Corrections issues de la revue de code Phase 5

Date : 2026-09-16
Auteur : AGENT 05 — Frontend Engineer
Base : `CODE_REVIEW.md` (AGENT 13, 2026-09-15) — codes B1/B2, M1-M7, m1-m9.
Perimetre : base de production Astro multi-clients (ADR-002) + template
flagship restaurant + scripts de pipeline.

---

## Resultats de verification

| Controle | Resultat |
| -------- | -------- |
| `npm test` | **30/30 PASS** |
| `npm run validate:example` | **exit 0** — 47/64 champs remplis, 6 recommandes (long_description, logo, favicon, google_business, district, zone) |
| `npm run build:example` | **16 pages** — build OK (0 erreur) |
| `npm run contrast` | **All checks passed** (m8) |
| Liens internes (285 verifies, script maison) | **0 casse** |
| Placeholders `[Nom]`/`[Ville]`/etc. residuels dans le HTML | 0 |
| `localize is not defined` dans le HTML genere | 0 |
| Double `<h1>` sur l'ensemble des pages | 0 |
| Script cookie + bandeau sur pages sans tiers | 0 (aucun script emis) |
| Nav EN traduite (`ui.nav`) | Home / Menu / Reservation / Contact |

---

## Corrections BLOCKER

### B1. XSS JSON-LD via `set:html` non echappe — `src/layouts/BaseLayout.astro`
**Deja corrige avant Phase 6** (working tree). Le `set:html` sur le JSON-LD
utilise desormais un echappement `\u003c`/`\u003e` pour neutraliser les
sequences dangereuses dans les donnees client injectees. **Verifie** : aucun
rapport de sortie suspect dans le HTML genere.

### B2. Google Fonts CDN charge sans consentement — `src/layouts/BaseLayout.astro`
**Deja corrige avant Phase 6**. Polices self-hosted (ADR-010) : `fonts.css`
charge les fichiers locaux (Playfair Display + Inter), aucun appel CDN.
**Verifie** : aucune requete externe fonts.googleapis / gstatic dans le HTML.

---

## Corrections MAJEURS

### M1. Badge « Ouvert/Ferme » inoperant — `src/components/OpeningHours.astro`
**Deja corrige avant Phase 6**. Le composant emet `data-schedule` (ISO 8601
descalades du jour courant, heures locales) cote client ; le calcul
ouvert/ferme s'execute au runtime et non au build. Tests 30/30 confirment.

### M2. Date minimale de reservation figee au build — `src/components/ReservationForm.astro`
**Deja corrige avant Phase 6**. `min` calcule a l'execution (jour J+1) dans le
script client ; aucune date de build injectee.

### M3. `third_party` du client ignore par le pipeline — `scripts/generate-site.mjs`
**Deja corrige avant Phase 6**. Le pipeline propage `data.third_party` et les
pages n'emettent ni bandeau ni script de consentement quand le client n'a
aucun tiers actif (verifie sur le site genere : 0 bandeau, 0 script).

### M4. Trois fichiers de traductions derives, un seul utilise — `src/translations/`
Corrige en Phase 6 : `src/translations/fr.json` et `en.json` supprimes
(git rm). Plus aucun import. Seul `src/translations/ui.json` (fr + en dans un
fichier-cle) subsiste. Grep de non-regression : 0 reference.

### M5. Multilingue EN inexploitable — pages du template
**Deja corrige avant Phase 6** (getPageTexts) et complete en Phase 6 pour la
navigation :
- `Header.astro` : labels de nav — en **FR** le label client (YAML) reste la
  source ; en **EN** on prefere `ui.nav[key]` (traduit) pour ne pas propager
  le contenu FR du YAML. Cle derivee du href : `/` → `index`, sinon slug.
- CTA du header : en EN, `ui.header.ctaLabel` ("Book a table") avec repli sur
  le label client.
- Fallbacks des pages `index.astro` et `menu.astro` passes par `ui`
  (`ui.header?.ctaLabel`, `ui.nav?.menu`) au lieu de chaines FR en dur.
- Page 404/500 et pages EN : verifiees sur le build.

### M6. Theme genere : tokens de contraste en contradiction — `scripts/generate-site.mjs`, `scripts/color-utils.mjs`
Corrige en Phase 6. Nouveau module partage `scripts/color-utils.mjs`
(hexToRgb, luminance, contrastRatio WCAG, darken HSL, pickOnColor,
darkTokenPair) :
- `--color-on-*` : choisis par contraste reel >= 4.5:1 (blanc ou
  #1f2937 selon la teinte de fond) — plus de blanc force sur l'ambre
  (#fff sur #F59E0B = 2.15:1).
- `--color-*-dark` : assombrissement reel (HSL, luminosite -0.12) avec
  boucle garantissant AA sur le texte, plus de valeurs alpha `...CC` ou
  de `#B91C1CCC` semi-transparent.
- Tokens emis en minuscules, valeurs de marque calculees :
  primary #B91C1C → dark #841414 (10.04:1), secondary #F59E0B → dark
  #935e06 (5.46:1), accent #DC2626 → dark #a91b1b (7.34:1).

### M7. Mapping des jours FR duplique six fois — `src/utils/days.mjs`
**Deja corrige avant Phase 6** (fichier cree, schema.js / hours.js /
reservation.js / OpeningHours.astro consomment le mapping partage).
```text
src/utils/days.mjs est un fichier UNTRACKED : a inclure dans le commit final.
```

---

## Corrections MINEURS

### m1. `localizePath` reimplemente trois fois
Corrige. `Header.astro` (ligne 66 : `localize is not defined`) et
`Footer.astro` importent `localizePath` depuis `@utils/i18n` ; plus aucune
reimplementation locale.

### m2. Logique d'horaires schema.org dupliquee
Corrige. `buildOpeningHoursSchema` est centralise dans `src/utils/hours.js`
(schema canonical, version qui skippe les entrees sans open/close) et
`src/utils/schema.js` l'importe. `toOpeningHoursSchema` (inutilise) supprime.

### m3. `setFieldError` et coeur de formulaire dupliques
**Deja corrige avant Phase 6** (forms.js partage consomme par
ContactForm/ReservationForm). Verifie par les tests.

### m4. Code mort
`fr.json`/`en.json` supprimes (cf. M4). `toOpeningHoursSchema` supprime (m2).
`src/utils/consent.js` deja retire avant Phase 6.

### m5. Chaines FR en dur sur pages EN
Corrige pour les composants listes :
- `Gallery.astro` : `aria-label` du dialogue et bouton Fermer traduits via
  `ui.gallery?.dialogAria` / `ui.gallery?.close`.
- `Breadcrumb.astro` : prop `ui` optionnelle, `aria-label` via
  `ui.breadcrumb?.ariaLabel` ("Fil d'Ariane" / "Breadcrumb") ; `PageLayout`
  transmet `ui`.
- `plan-du-site.astro` : `aria-label` de la nav via `ui.footer?.sitemap`
  ("Plan du site" / "Sitemap").
- Ajout des cles manquantes dans `src/translations/ui.json` (fr + en) :
  `header.ctaLabel`, `breadcrumb.ariaLabel`, `gallery.close`,
  `gallery.dialogAria`.

### m6. SEO : patrons `seo_title` du template inutilises
Corrige. `generate-site.mjs` exporte dans `data.json` :
- `seo_titles[route]` : `fillTemplate(p.seo_title, placeholders)` ;
- `seo_descriptions[route]` : `fillTemplate(p.seo_description, placeholders)`.
Pages mises a jour (`index`, `a-propos`, `menu`, `contact`, `reservation`,
`faq`, `galerie`, `temoignages`, `plan-du-site`) : `<title>` via
`data.seo_titles?.[route]` (avec repli sur les textes client) et
`description` via `buildDescription(data.seo_descriptions?.[route] ...)`
au lieu de `description={title}`. `plan-du-site` : repli supplementaire sur
`data.seo?.meta_description` (pas de patron YAML pour cette route).
```text
AJOURNE — pages legales : `mentions-legales.astro` et `confidentialite.astro`
conservent `description={title}` par contrainte explicite de la mission
(« ne pas modifier les templates legaux »). Impact limite : pages noindex
+ nofollow (LegalLayout). A traiter lors d'une prochaine passe.
Limite connue : les patrons seo_* du template.yaml sont monolingues (FR) ;
les pages EN heritent donc des titres/descriptions FR du patron. Les
meta_description EN fournies par le client existent (seo.meta_description_en)
mais ne sont consommees par aucune page — a finaliser avec content-seo.
```

### m7. Script cookie toujours emis sans tiers
Corrige. `CookieBanner.astro` : le `<script>` (JS vanilla, `is:inline`)
n'est rendu QUE dans le bloc conditionnel `hasThirdParty ? ... : null`.
Aucun tiers actif → aucune balise de bandeau, aucun script de consentement,
aucun cookie. Verifie sur le site exemple (0 occurrence).

### m8. `contrast-check.mjs` : couverture partielle
Corrige. Le script importe `contrastRatio` depuis `color-utils.mjs`, accepte
les hex 6 ET 8 chiffres, et verifie les paires token-based :
on-primary/primary, on-secondary/secondary, on-accent/accent +
on-primary-dark/primary-dark, on-accent-dark/accent-dark (les variantes
`-dark` sont consommees par `.skip-link` et les hovers ds-btn).
Note : `contrast-check` ne fait PAS partie de la CI (.github/workflows) —
recommande de l'ajouter au pipeline (cf. Recommandations).

### m9. `CTA.astro:50` : `target` sans `external` → `rel: undefined`
Corrige. `rel="noopener noreferrer"` applique inconditionnellement quand
`external || target` est vrai (plus d'ouverture de nouvel onglet sans
noopener).

---

## Decouverte Phase 6 — cascade CSS theme client vs design system

**Probleme** : `tokens.css` (design system, ADR-006) declare les tokens de
marque en `:root` avec la palette flagship en dur. Le `theme.css` genere par
client est inline par Astro DANS LE HEAD **AVANT** le bundle `tokens.css`
(link). Meme selecteur `:root`, meme specificite → le bundle (charge apres)
**primait** sur le theme client : toute personnalisation de marque
(branding.primary_color, etc.) etait silencieusement neutralisee.

Le commentaire d'en-tete de tokens.css enonce pourtant la regle ADR-006
("les tokens de marque sont surcharges par le theme.css genere par client").

**Correction** (`src/styles/tokens.css`) : les tokens de marque (couleurs
primary/secondary/accent + light/dark + on-* + familles de polices) sont
deplaces dans un bloc `@layer ds-brand`. En cascade CSS, les styles NON
layeres (theme.css du client) gagnent TOUJOURS sur les styles layeres, quel
que soit l'ordre de chargement dans le head genere. Les valeurs par defaut
du design system restent disponibles (flagship) si le theme client est
absent, et sont documentees comme fallback.

**Resultat** : les valeurs calculees par M6 (dark reels, on-* WCAG) sont
desormais les valeurs EFFECTIVEMENT appliquees par le site genere.

---

## Fichiers modifies en Phase 6

```text
scripts/color-utils.mjs        (NOUVEAU — utils couleurs WCAG)
scripts/contrast-check.mjs     (m8)
scripts/generate-site.mjs      (P3 theme.css, P4 seo_titles/seo_descriptions)
src/components/Header.astro    (B1-build fix, m1, m5)
src/components/Footer.astro    (m1)
src/components/CTA.astro       (m9)
src/components/Gallery.astro   (m5)
src/components/Breadcrumb.astro(m5)
src/layouts/PageLayout.astro   (passe ui au Breadcrumb)
src/styles/tokens.css          (@layer ds-brand — ADR-006 respecte)
src/translations/ui.json       (nouvelles cles fr/en)
src/translations/fr.json       (SUPPRIME — git rm)
src/translations/en.json       (SUPPRIME — git rm)
src/utils/hours.js             (m2 — buildOpeningHoursSchema centralise)
src/utils/schema.js            (m2 — importe depuis hours.js)
templates/restaurant/pages/*.astro (P4 SEO sur 9 pages ; P1 fallbacks index/menu)
```

Corrections deja presentes dans le working tree avant Phase 6 (remontees
Phase 5 / rapports precedents) : B1, B2, M1, M2, M3, M5 (getPageTexts),
M7 (days.mjs), m3 (forms.js), m4 (consent.js).

---

## Points ouverts

1. **Pages legales** : `description={title}` conserves par contrainte
   explicite (ne pas modifier les templates legaux). A lever avec le ruleur
   ou le legal-compliance-agent.
2. **Patrons seo_* monolingues** : les pages EN reprennent le patron FR ;
   `meta_description_en` du client non consommee. A coordonner avec
   content-seo.
3. **contrast-check hors CI** : recommande d'ajouter `npm run contrast` au
   workflow GitHub (une ligne, zero dependance).
4. **`src/utils/days.mjs` untracked** : a inclure dans le commit de la
   Phase 6 (utilise par 4 fichiers).
5. **Menu.astro** (composant) : dernier repli `'La Carte'` sans traduction
   EN — non couvert par la mission (composant sans prop ui). Peut etre traite
   dans une prochaine passe avec les autre composants.