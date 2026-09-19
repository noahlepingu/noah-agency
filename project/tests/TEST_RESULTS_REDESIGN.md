# Test Results — Refonte visuelle « Bistrot lyonnais » (templates/restaurant)

- **Objet teste** : refonte visuelle du template restaurant flagship (commit be42a43)
  + corrections multilingue (bug QA-01/Q-03/Q-04/Q-05/Q-06/Q-08 traitees dans la refonte).
- **Site genere** : `dist/exemple-restaurant/` (La Table d'Essai, Lyon 69001)
- **Date** : 2026-09-18
- **Tester** : QA Engineer (agent 10)
- **Methode** : tests automatises (`npm test`, validate, build, contrast) +
  preview server Astro (`http://127.0.0.1:4321`, build correct) + audits HTML
  (curl/python) + scan liens internes (359 liens) + regression BUGS.md.

## 1. Tests automatises

| Test | Commande | Resultat |
| ---- | -------- | -------- |
| Unitaire | `npm test` | **30/30 PASS** (3.45 s, 0 fail) |
| Validation donnees client | `npm run validate:example` | **exit 0** — 47/65 champs remplis, 6 recommandations non bloquantes |
| Build exemple | `npm run build:example` | **16 pages OK** (4.77 s) |
| Contraste | `npm run contrast` | **tout PASS** (11 checks) |

Aucune regression des tests unitaires Phase 2/3 (reservation.js, forms.js,
i18n.js, seo.js) apres la refonte des composants.

## 2. Pages generees et routes

16 pages OK : `/404.html`, `/500.html`, `/a-propos`, `/confidentialite`,
`/contact`, `/en/a-propos`, `/en/contact`, `/en/index`, `/faq`, `/galerie`,
`/mentions-legales`, `/menu`, `/plan-du-site`, `/reservation`, `/temoignages`,
`/index.html`.

### Routes servies par le preview

| Route | Statut | Note |
| ----- | ------ | ---- |
| `/`, `/menu`, `/reservation`, `/contact`, `/galerie`, `/a-propos`, `/faq`, `/temoignages` | 200 | ok |
| `/404`, `/500` | 200 | etats speciaux |
| `/robots.txt`, `/sitemap.xml` | 200 | sitemap : 14 URLs, toutes 200 |
| `/.well-known/security.txt` | 200 | placeholders `[CONTACT-EMAIL]`/`[SECURITY-TXT-URL]` documentes (a completer par Noah) |
| `/_headers` | 200 | ok |
| `/en/`, `/en` (sans slash) | 200 | hreflang fr/x-default/en coherents |
| `/reservation/confirmation`, `/contact/confirmation` | 404 | **attendu** : confirmation inline (JS), pas de page SSG — conforme UX.md §4.5/4.6 |
| `/en/menu` | 404 | **attendu** par D-FE-04 (seules index/a-propos/contact traduites) — MAIS lien EN cassé, voir BUG-QA-09 |

### Audit commun par page

- 1 `<h1>` unique partout ✓
- `<title>` non vide et ≠ meta description ✓ (5 pages de BUG-QA-05 corrigees : 128-146 car.)
- Meta descriptions 120-160 car. sur les pages de contenu ✓ (404/500 : courtes mais `noindex,nofollow`)
- `alt` vide uniquement sur le template lightbox (`ds-lightbox__img`, decore rempli par JS) ✓
- Pages legales en `noindex, nofollow` ✓
- `lang` attribute cohérent (`fr`/`en`) ✓ ; skip-link `#contenu` present ✓

### JSON-LD

| Page | @type | Notes |
| ---- | ----- | ----- |
| `/` FR + EN | `Restaurant` | complet : name, url, telephone, email, address, geo, openingHoursSpecification, areaServed, sameAs, acceptsReservations |
| `/a-propos`, `/contact` | `LocalBusiness` | ok |
| `/faq` | `FAQPage` | ok |

→ Description JSON-LD EN non localisee : **BUG-QA-11**.

## 3. Tests fonctionnels

### Reservation (formulaire complet)

- 9 creneaux via `data-slots` (12:00–13:30, 19:00–21:00) ✓
- 8 options convives (1–8) ✓ ; champs date/heure/convives/nom/email/tel/message ✓
- Honeypot `phone_confirm` ✓ ; `data-json-form` avec messages d'erreur champ + globaux ✓
- Etat `data-no-slot` (titre/message/2 CTA) ✓ ; confirmation inline `role="status"` ✓
- `form action=""` + fallback mailto (`emailAddress`) ✓ ; aria-required/aria-describedby ✓

### Bandeau cookies

**Absent sur toutes les pages** (0 occurrence `ds-consent`/`data-cookie-banner`) —
conforme ADR-008 zero-cookie (`third_party: false` dans le YAML exemple).
BUG-QA-06 corrige : plus aucun script cookie charge a vide.

### Badge Ouvert/Ferme

`data-hero-status` + `data-schedule` + `data-ui-open/closed` + `role="status"`
present sur l'accueil (variante A) ; JS `OpeningHours...CfTcjRFl.js` + `Hero...LaDU8nlV.js`
references. ✓

### Header

- Burger mobile : `aria-expanded="false"` + `aria-controls="ds-menu-mobile"` ✓
- JS : focus trap (Tab/shift+Tab), fermeture Escape, `scrollY>40` → `ds-header--solid`,
  `ds-header--dark` si `data-hero-dark` ✓
- Back-to-top `scroll>300` ✓

### MobileStickyCTA

Present sur `/` et `/en/` (boutons reservation + tel), **absent** sur `/reservation`
et `/contact` (pas de doublon d'action) ✓. Tel : `+33 4 72 00 00 01` (CTA) / `04 72 00 00 01` (footer).

### Liens internes

359 liens scannes (python) : **1 casse** :

- `/en/index.html` → `/en/menu` (bouton « See the full menu », preview Menu) → **404** — **BUG-QA-09**.

### Etats speciaux

- 404 : H1 « Cette page est partie gouter ailleurs » (narratif DA), CTA « Retour a l'accueil » + « Nous contacter » en `.ds-btn` ✓
- 500 : present, noindex ✓

## 4. Regression visuelle (design system)

Source : `UX_REDESIGN_RESTAURANT.md`, bundle `_astro/seo.B6BUGasF.css` + `_astro/Hero.BJ4duwdb.css`.

| Spec DA | Preuve | Statut |
| ------- | ------ | ------ |
| Palette creme/encre/brique (FBF7F0 / 2B2320 / B4542C) | tokens presents dans le bundle (avec fffdf9, f3ebdf, 2a211c, 5c5148, e4d9c8, 9a7b5e) | ✓ |
| Anciens `#F1F5F9`, `#DC2626` etc. retires du fond | `#B91C1C`/`#F59E0B` **absents** ; `#DC2626` = token `--color-error` (volontaire, DA §2.4) ; `#111827` = token fondationnel `--color-gray-900` (pas un fond) | ✓ |
| Typo Fraunces (headings) + Inter (body) self-hosted | `@font-face` + `--font-heading`/`--font-body` ; 6 woff2 presents | ✓ |
| Hero pleine hauteur (A) avec image | `min-height:92svh` ; `data-hero-full data-hero-dark` ; `hero.jpg` (176 Ko) ; variante A conforme | ✓ |
| Menu typographique (carte, pas de cards) | ligne de points `ds-menucat__dots` (`border-bottom:2px dotted var(--color-line-strong)`) ENTRE nom et prix (grid auto 1fr auto) ; **0 `.ds-card`** sur /menu ; categories `ds-menucat__item/__row` ; prix `9,50 €` via `formatPrice()` | ✓ |
| Galerie asymetrique 6 colonnes | `grid-template-columns:repeat(6,1fr)` ; items span 4/2/2/2/6 | ✓ |
| Footer sur fond encre chaud | `.ds-footer{background-color:var(--color-surface-dark)}` (pas `#111827`) | ✓ |
| Boutons radius 4 px | `--radius-sm:4px` sur `.ds-btn` | ✓ |
| Alternance des sections | 9 sections : hero (sombre) → intro (surface) → menu (surface) → galerie (alt) → avis (alt) → horaires (alt) → map → CTA final (surface-dark) — rythme conforme (bloc alt volontaire gallery/avis/horaires, DA §4.2) | ✓ |
| Intro centree (surtitre/H2/chapeau) | `ds-intro__eyebrow` + `ds-intro__chapeau` rendus ; H2 (`intro_subtitle`) **absent** car non fourni dans les donnees d'exemple → observation contenu (non bloquant, cf. BUG-QA-13) | ⚠ |

## 5. Regression des bugs Phase 4 (BUGS.md)

| Bug | Severite | Verif. | Statut apres refonte |
| --- | -------- | ------ | -------------------- |
| BUG-QA-01 — pages EN contenu FR | MAJEUR | corps traduit (hero, intro « Welcome », nav, CTA) ; metadata SEO EN encore FR | **PARTIELLEMENT CORRIGE** — reliquat → BUG-QA-10/11 |
| BUG-QA-02 — « cuisine cuisine » (a-propos) | MINEUR | 0 occurrence | **CORRIGE** |
| BUG-QA-03 — nav EN labels FR | MAJEUR | « Home/Menu/Reservation/Contact » + « Book a table » | **CORRIGE** (reliquat footer → BUG-QA-12) |
| BUG-QA-04 — patterns seo_title inutilises | MINEUR | titles suivent les patterns (« La Carte — La Table d'Essai », « Contact — ... ») | **CORRIGE** |
| BUG-QA-05 — meta desc = titre (5 pages) | MINEUR | descriptions 128-146 car. ≠ titres | **CORRIGE** |
| BUG-QA-06 — script cookies charge a vide | MINEUR | 0 `ds-consent` sur toutes pages | **CORRIGE** |
| BUG-QA-07 — generation monotype | OBSERVATION | `templates/restaurant` toujours en dur dans generate-site.mjs §3 | **INCHANGE** (decision archi Roadmap v1, hors perimetre refonte) |
| BUG-QA-08 — index desc 105 car. + EN=FR | MINEUR | desc FR = 140 car. ✓ ; EN toujours = FR | **PARTIELLEMENT CORRIGE** — reliquat → BUG-QA-10 |

Corrections du FINAL_REVIEW toujours en place : contraste 11/11 (Q2), boutons `.ds-btn` 404/500 (Q3), JSON-LD Restaurant (Q4), og:image sur toutes pages (Q6).

## 6. Nouveaux bugs decouverts (voir BUGS.md)

| Bug | Severite | Resume |
| --- | -------- | ------ |
| BUG-QA-09 | MINEUR | Lien « See the full menu » des pages EN → `/en/menu` → 404 (Menu.astro l.46 prefixe `/en/` inconditionnel) |
| BUG-QA-10 | MINEUR | Metadata SEO EN non localisees : `<title>` + meta description des 3 pages EN = francais |
| BUG-QA-11 | MINEUR | Description JSON-LD des pages EN en francais (description_en du YAML non routee) |
| BUG-QA-12 | MINEUR | Footer EN : « Site fait a Lyon » non traduit (« Made in Lyon » absent) |
| BUG-QA-13 | OBSERVATION | Intro accueil : H2 (`intro_subtitle`) absent des donnees d'exemple — section sans titre |

## 7. Bilan

| Verdict | **PEUT-ETRE-LIVRE** (reserves multilingues documentees) |
| ------- | ------------------------------------------------------- |
| Bloquant | Aucun |
| MAJEUR ouvert | 0 |
| MINEUR ouvert (nouveaux) | 4 (BUG-QA-09 a 12) — tous cotes EN, pages FR non impactees |
| OBSERVATION | 2 (BUG-QA-07 existant, BUG-QA-13) |

Le site FR (usage principal) est complet, conforme a la DA « Bistrot lyonnais »
et sans regression. Les reserves portent toutes sur la localisation EN :
1 lien casse (menu EN), metadata/JSON-LD non traduites, footer partiellement FR.
Les 3 pages EN restent utilisables et comprehensibles (corps traduit, nav traduite).
Recommandation : corriger BUG-QA-09 (lien 404, 1 ligne dans Menu.astro) avant
livraison commerciale multilingue ; BUG-QA-10/11/12 a traiter en Phase 6
Corrections (routing `seo_titles`/`seo_descriptions` par langue + `description_en`).

Ressources utilisees : page `data.json` = `src/sites/exemple-restaurant/data.json`
(`seo_titles` monolingues FR — cause racine BUG-QA-10 ; `description_en`,
`meta_description_en` presents dans `content/clients/exemple-restaurant/client_data.yaml` —
non routes par le template — cause BUG-QA-11).

Fichier : `/tmp/opencode/qa/` (copies HTML des 14 pages pour re-verifications).