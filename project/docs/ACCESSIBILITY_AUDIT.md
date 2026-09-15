# Audit accessibilite — noah-agency

**Agent** : Accessibility Specialist (AGENT 11 — accessibilite numerique)
**Date** : 2026-09-15
**Version** : 1.0
**Perimetre** : Build de reference `dist/exemple-restaurant/` (16 pages HTML
generees par Astro, 13 FR + 3 EN) + composants sources (`src/components/`,
`src/layouts/`, `src/styles/`), confronte aux specs UX (`project/design/ux/UX.md`
§2.5, §4.4, §4.7, §5 ; DESIGN_SYSTEM_SPECS.md) et a WCAG 2.2 AA.
**Methodologie** : audit statique — lecture du code source, analyse du build
(parser HTML), calculs de contraste normalises (formule WCAG, `python3`).

> **Limites de cet audit** : `node` n'est pas disponible dans l'environnement
> d'execution ; les tests navigateur (axe-core, Lighthouse, navigation clavier
> reelle) n'ont pas pu etre executes. Les comportements dynamiques (focus trap,
> annonces lecteur d'ecran, scroll) sont verifies par lecture du code et a
> confirmer au navigateur en Phase 6/8 (voir §Points ouverts).

---

## Sommaire executoire

| Critere | Statut | Detail |
| ------- | ------ | ------ |
| Navigation clavier | **FAIL (majeur)** | 5 anomalies : libelle nav duplique, burger sans nom accessible, focus trap absent (menu mobile + cookie banner), back-to-top focusable masque |
| Contraste texte | **FAIL (majeur)** | 2 paires de tokens sous 4.5:1 (gray-400, success) ; 1 paire sous 3:1 (warning sur fond clair) |
| Focus visible / logique | **PASS** | focus-ring 3px + skip-link visible au focus + aria-current |
| Structure HTML / landmarks | **PASS** | h1 unique 16/16, main/header/footer/nav corrects, HTML valide (parser) |
| ARIA | **WARN** | usage globalement sobre et correct ; exceptions listees §3 (nav, burger, dialog) |
| Labels de formulaire | **PASS** | tous les controles ont un label `for` ; honeypot correctement masque |
| Alt text / images | **PASS** | aucune image dans l'exemple (galerie vide, hero sans image) ; composants prets (alt, w/h, lazy) |
| Lecteurs d'ecran | **WARN** | etats dynamiques non annonces : erreurs de formulaire non liees, « aucun creneau », statut horaires |
| Responsive | **PASS (static)** | breakpoints 768/1024 ; menu mobile plein ecran ; a confirmer au navigateur |
| Tailles de cibles | **WARN** | boutons >= 44px OK ; liens footer et selecteur langue < 24px (WCAG 2.5.8) |

**Verdict** : `CORRECTIONS REQUISES (Phase 6)` — rien de bloquant pour
l'architecture (`src/`), tout est corrigeable dans les composants et tokens.
7 constats a prioriser (4 bloquants pour le standard affiche, 3 majeurs).

---

## 1. Critere : Contraste (WCAG 1.4.3 AA, 4.5:1 ; 1.4.11, 3:1)

Calculs normalises (formule WCAG relative luminance). Tokens source :
`src/styles/tokens.css`.

### 1.1 FAIL — `--color-gray-400` #9CA3AF sur blanc : **2.54:1** (< 4.5:1)

**Contexte** : texte `.ds-opening__hours--closed` (« Ferme ») dans
OpeningHours.astro et `.ds-opening__closed` ; egalement utilise pour les
placeholders de formulaire (border-color `#E5E7EB` gray-200 — placeholders
souvent en gray-400).

**Statut WCAG** : echec 1.4.3 pour tout texte `< 18.66px` en gray-400.

**Recommandation (Phase 6)** : utiliser `--color-gray-500` #6B7280 (4.83:1)
pour le texte « Ferme ». Le token gray-400 doit etre **reserve aux elements
purement decoratifs** (icones inactives aria-hidden, bordures) — a documenter
dans DESIGN_SYSTEM_SPECS.md (charte d'usage des tokens).

### 1.2 FAIL — `--color-success` #059669 sur blanc : **3.77:1** (< 4.5:1)

**Contexte** : statut « Ouvert » (OpeningHours.astro) — texte normal 14-16px.

**Recommandation** : `--color-success-dark` #047857 (5.48:1) ou #065F46
(7.68:1) pour tout texte sur fond blanc. Garder #059669 pour les icones/badges
avec fond vert clair (1.4.11, 3:1).

### 1.3 FAIL — `--color-warning` #D97706 sur `--color-warning-light` #FEF3C7 : **2.86:1**

**Contexte** : etoiles de notation (Testimonials, FAQ) — **decoratives
(`aria-hidden="true"`, cf. §4.4) : non soumis a 1.4.3** mais reserve un piège
pour le prochain usage texte. Si une note chiffree est ajoutee en texte :
#92400E sur blanc = 7.09:1 (ou sur warning-light 6.37:1).

**Recommandation** : fixer la **regle d'usage** du token warning dans le design
system : warning-light = fonds et pictos >= 3:1 ; warning = texte uniquement
avec une variante `--color-warning-dark` #92400E.

### 1.4 PASS — les autres tokens

| Paire | Ratio | Verdict |
| ----- | ----- | ------- |
| primary #B91C1C / blanc | 6.47:1 | PASS |
| primary-dark #7F1D1D / blanc | 10.02:1 | PASS |
| accent #DC2626 / blanc | 4.83:1 | PASS |
| secondary #F59E0B / #1F2937 (on-secondary) | 6.83:1 | PASS |
| gray-500 #6B7280 / blanc | 4.83:1 | PASS (texte secondaire) |
| gray-900 #111827 / gray-100 (hero title) | 16.12:1 | PASS |
| gray-600 #4B5563 / gray-100 (hero subtitle) | 6.87:1 | PASS |
| focus-ring #3B82F6 / blanc | 3.68:1 | PASS (>= 3:1, indicateur de focus) |
| blanc / primary (skip-link) | 6.47:1 | PASS |
| error #DC2626 / blanc | 4.83:1 | PASS |
| error #DC2626 / error-light #FEE2E2 | 3.95:1 | PASS pour erreur (>= 3:1) |

Controleur automatise des paires : `scripts/contrast-check.mjs` (a executer
dans une etape npm quand `node` dispo — a integrer a la CI, cf. D-A11Y-07).

---

## 2. Critere : Navigation clavier (WCAG 2.1.1, 2.4.3, 2.4.7)

### 2.1 FAIL (bloquant) — Deux `<nav>` avec le meme aria-label trompeur

**Fichier** : `src/components/Header.astro` (desktop l.~42, mobile l.~86)
**Constats sur le build** : les 2 landmarks `<nav>` de chaque page portent le
meme `aria-label="Ouvrir le menu de navigation"` (heberge aussi l'etiquette du
burger — `ui.header.openMenu`). Pour un utilisateur de lecteur d'ecran :
2 landmarks identiques dans le menu Landmarks, dont un « Ouvrir le menu » qui
est en realite la navigation principale desktop (deja visible, rien a ouvrir).

**Recommandation** :
- Desktop (visible) : `aria-label="Navigation principale"` / EN
  « Main navigation » (nouvelle cle i18n `ui.header.navLabel`).
- Mobile (burger) : le label du bouton doit etre **dynamique**
  (openMenu/closeMenu — voir 2.2) ; laisser la nav mobile sans aria-label
  (unique landmark dans son contexte).

### 2.2 FAIL (bloquant) — Burger mobile : nom accessible ecrase

**Fichier** : `src/components/Header.astro` (script inline, swap `innerText`).
Le `<span class="sr-only">Ouvrir le menu de navigation</span>` est remplace
par le symbole `×` / `☰` via `innerText` : apres 1 clic, le nom accessible du
bouton devient un glyphe illisible (« × »), et `aria-expanded` n'est pas
maintenu.

**Recommandation** : ne jamais toucher au contenu sr-only :
- garder le span sr-only invariable ;
- mettre `aria-label` a jour via `aria-label` (pas `innerText`) avec
  `ui.header.openMenu` / `ui.header.closeMenu` (cles deja presentes dans
  `src/translations/ui.json` !) ;
- ajouter `aria-expanded="true|false"` + `aria-controls` (id de la nav mobile).

### 2.3 FAIL (bloquant) — Pas de focus trap ni de gestion de focus

**Menu mobile** (Header.astro) : ouvert, aucun `Échap` ne rend le focus au
burger, aucun piège : Tab continue vers le footer derriere. Non conforme UX.md
§2.5 (« focus trap + focus initial + retour »).

**Cookie banner** (`src/components/CookieBanner.astro`) : `role="dialog"` sans
`aria-modal`, **aucun deplacement de focus** vers le bandeau, aucun piège de
Tab. Non conforme UX.md §4.7 et UX.md §5.11. (Non rendu dans l'exemple —
`third_party.analytics: false` — mais vivra chez les vrais clients.)

**Recommandation (Phase 6)** : utilitaire `focusTrap(el, returnTo)` dans
`src/utils/` (module partage), applique des 2 cotes ; `Échap` = fermer et
rendre le focus ; au menu mobile : focus sur le 1er lien, retour au burger
a la fermeture ; au banner : focus sur le 1er bouton a l'ouverture.
Technique recommandee : `<dialog>` natif + `showModal()` (deja utilise avec
succes dans Gallery — coherence du codebase).

### 2.4 FAIL (majeur) — BackToTop masque mais focusable

**Fichier** : `src/components/BackToTop.astro` + `utilities.css`.
Le bouton est visible/hidden via `opacity:0` + `pointer-events:none` : il
**reste atteignable au Tab** alors qu'il est invisible (echec 2.4.3 focus
order) — l'utilisateur clavier peut Tabber sur un bouton invisible en fin de
page.

**Recommandation** : ajouter `visibility:hidden` (+ `visibility:visible` a
l'etat affiche) ou `[inert]` ; a la fermeture, remettre le focus si le bouton
le portait.

### 2.5 WARN (mineur) — scroll doux ignore prefers-reduced-motion

`html { scroll-behavior: smooth }` est respectueux (base.css l.18-24
desactive sous `prefers-reduced-motion`), mais `BackToTop` appelle
`scrollTo({ behavior: 'smooth' })` en JS : **desactiver** le smooth en JS
sous `matchMedia('(prefers-reduced-motion: reduce)')`. MAJORITE : `focus-ring`
ok, skip-link ok, bouton 44x44 ok.

---

## 3. Critere : ARIA (1.3.1, 4.1.2) — usage sobre et correct, sauf :

| Constat | Fichier | Statut |
| ------- | ------- | ------ |
| `role="dialog"` sans focus ni aria-modal (banner cookies) | CookieBanner.astro | **FAIL** (cf. 2.3) |
| `aria-describedby="form-contact-note"` vers une note OK ; mais les **erreurs champ ne sont PAS liees** (`aria-describedby` absent sur les inputs en erreur — le `<p id="cf-name-error">` existe mais n'est jamais reference) | ContactForm.astro, ReservationForm.astro | **FAIL** (cf. 4.2) |
| `aria-live` absent : statut « Ouvert/Ferme » injecte en JS (OpeningHours), « Aucun creneau » (ReservationForm), message d'erreur global | OpeninHours.astro, ReservationForm.astro | **WARN** (cf. 4.3) |
| honeypot `aria-hidden`+`tabindex=-1` | formulaires | PASS |
| `aria-current="page"` sur le lien actif | Header.astro | PASS |
| Icones decoratives `aria-hidden="true"` | Icon.astro, etoiles | PASS |
| Dialog galerie : natif `<dialog>` + `showModal()` (ARIA auto) | Gallery.astro | PASS |

---

## 4. Critere : Formulaires (1.3.1, 3.3.1, 3.3.3, 4.1.3)

### 4.1 PASS — labels et structure

Tous les controles ont un `<label for>` explicite (contact + reservation),
`required` + `aria-required`, selects groupes par label, honeypot masque
correctement, `novalidate` avec validation JS associee. `role="status"` sur
la zone d'envoi/succes. Confirmation dupliquee : rien a signaler.

### 4.2 FAIL (bloquant) — Erreurs de validation non annoncees

- `aria-invalid="true"` pose sur les champs en erreur, **mais** le message
  d'erreur (`<p id="cf-name-error">` / `<p id="rf-date-error">`) n'est jamais
  reference par `aria-describedby` sur l'input : un lecteur d'ecran n'annonce
  **pas** le contenu de l'erreur.
- Au submit invalide : **aucun focus** n'est deplace vers le premier champ en
  erreur (exige par UX.md §4.4) — l'erreur « Le formulaire contient N erreurs »
  est visible visuellement mais pas annoncee.

**Recommandation (Phase 6)** : au submit → `focus()` sur le 1er champ
invalide + `aria-describedby="<id>-error"` sur chaque champ (a l'etat
d'erreur uniquement) + `aria-live="polite"` sur le resume global.

### 4.3 WARN — etats dynamiques non annonces

- « Aucun creneau disponible » (ReservationForm) : bloc injecte en JS sans
  `role="status"`/`aria-live` -> non annonce.
- Statut « Ouvert/Ferme » (OpeningHours) : injecte en JS sans annonce (et
  surtout : texte en gray-400, cf. 1.1).
- Bouton submit desactive durant l'envoi : `disabled` OK (4.1.2) ; penser a
  un message `aria-live` « Envoi en cours... » (string `sending` deja en
  `data-json-form`).

### 4.4 WARN (mineur) — note chiffree non annoncee

Les etoiles sont `aria-hidden="true"` : si une note chiffree (ex. « 4.8/5 »)
est presente (data `reviews`), s'assurer qu'un texte alternatif accessible
existe (sr-only) ou que le nom du temoignage la porte.

---

## 5. Critere : Structure (1.3.1, 2.4.6) + HTML semantique

- **h1 unique** : verifie sur les 16 pages du build (y compris 404/500, FR/EN).
- **Landmarks** : `<header>`, `<footer>`, `<main id="contenu">`, `<nav>`,
  `<article>` (avis, FAQ), `<section>` avec titres : conformes.
- **Skip-link** : premier element focusable, `href="#contenu"`, visible au
  focus (base.css l.132-150) : PASS.
- **Hierarchie de titres** : h1 -> h2 -> h3 coherente (pages legales :
  LegalLayout h1 + h2/h3). Minor : Footer utilise un `h2` « Horaires » sans
  h3 dans sa section — tolerer ou passer l'horaire en `<p>` (info, non nav) :
  **WARN mineur**.
- **Langues** : `lang="fr"` / `lang="en"` corrects, hreflang fr/en/x-default :
  PASS.
- **HTML valide** : parser Python sur 5 pages representatives (index, contact,
  reservation, 404, en/) : balises equilibrees, aucun `<img>` mal ferme.
- 404/500 : `role="alert"` sur le message ; confirmation : `role="status"` :
  PASS.

---

## 6. Critere : Responsive & tailles de cibles

- Boutons et champs >= 44px (design system, `.ds-btn`, `.ds-form__input`) ;
  burger 44x44 ; back-to-top 44x44 : PASS (but D-UX-04).
- **WARN** : liens de pied de page (`ds-footer__link`, font 14px, ~20px de
  haut) et selecteur de langue (`ds-lang`, padding 4px 8px, ~22px) sous la
  cible 24x24 de **WCAG 2.5.8 (AA, 2.2)**. Recommandation : padding vertical
  >= 4px supplementaire ou `min-height: 24px` (mieux : 44px mobile per
  D-UX-04 — barre de pied alignee en colonne sur mobile).
- Menu mobile plein ecran : le contenu derriere peut defiler (pas de
  `overflow:hidden` sur `<body>`) : **WARN** (confort, UX.md §2.5) — ajouter
  le blocage du scroll quand le menu est ouvert.

---

## 7. Points forts a preserver (regression-testables)

0. `lang` + hreflang coherents (FR/EN).
1. Skip-link toujours present, focusable, cible `#contenu`.
2. Dialog natif pour la galerie : `showModal()` gere focus trap + Echap
   nativement ; `aria-haspopup="dialog"` sur les boutons.
3. Alt, `width`/`height` (anti-CLS) et lazy-load prets dans Hero/Gallery.
4. Contraste des tokens principaux (primary/accent/secondary/texte).
5. `prefers-reduced-motion` applique au scroll CSS global.
6. Rien de superflu en ARIA : les roles natifs dominent (bonne pratique).

---

## 8. Synthese des constats & priorites

| # | Severite | Constat | Fichier(s) | Cible Phase 6 | Critere WCAG |
| - | -------- | ------- | ---------- | ------------- | ------------ |
| 1 | **Bloquant** | aria-label duplique sur les 2 nav (« Ouvrir le menu ») | Header.astro | libeller « Navigation principale » ; burger dynamique | 1.3.1 / 4.1.2 |
| 2 | **Bloquant** | burger : nom accessible ecrase (`innerText` sur sr-only) | Header.astro | aria-label + aria-expanded ; sr-only invariable | 4.1.2 |
| 3 | **Bloquant** | focus trap absent (menu mobile + cookie banner) | Header.astro, CookieBanner.astro | utilitaire focusTrap partage ou `<dialog>` | 2.4.3 / 2.1.1 |
| 4 | **Bloquant** | back-to-top focusable alors qu'invisible | BackToTop.astro | visibility:hidden / [inert] | 2.4.3 |
| 5 | **Majeur** | contraste gray-400 (« Ferme ») 2.54:1 | tokens.css + OpeningHours.astro | gray-500 pour le texte ; regle d'usage du token | 1.4.3 |
| 6 | **Majeur** | contraste success (« Ouvert ») 3.77:1 | tokens.css + OpeningHours.astro | success-dark #047857 | 1.4.3 |
| 7 | **Majeur** | erreurs de formulaire non liees + pas de focus 1er champ | ContactForm.astro, ReservationForm.astro, forms.js | aria-describedby + focus + aria-live resume | 3.3.1 / 4.1.3 |
| 8 | Mineur | « Aucun creneau » / « Envoi en cours » non annonces | ReservationForm.astro, forms.js | role=status / aria-live | 4.1.3 |
| 9 | Mineur | scroll smooth JS ignore reduced-motion | BackToTop.astro | matchMedia guard | 2.3.3 |
| 10 | Mineur | cibles < 24px (footer, langue) | Footer.astro, LanguageSwitcher.astro | padding / min-height | 2.5.8 |
| 11 | Mineur | h2 « Horaires » dans footer sans h3 ; contenu derriere le menu mobile | Footer.astro, Header.astro | <p> ou h3 ; overflow body | 2.4.6 / 2.5.8 |

---

## 9. Points ouverts / limitations de l'audit statique

1. **Tests navigateur requis (Phase 6/8)** : axe-core + Lighthouse +
   navigation clavier manuelle (surtout menu mobile, cookie banner, 404/500,
   formulaires) — a la charge de qa-engineer avec `node`/npm dispo.
2. Le contraste a ete calcule sur les tokens ; a re-executer via
   `scripts/contrast-check.mjs` dans la CI (D-A11Y-07) pour eviter toute
   regression.
3. La 404/500 ne charge qu'un seul bundle CSS alors que les classes `.ds-btn`
   vivent dans l'autre bundle (constat transverse en performance — BUG a
   confirmer visuellement : rendu des boutons CTA non stylises sur 404/500,
   cf. PERFORMANCE_AUDIT.md §4).
4. Honeypot : bon pattern, a conserver (a ne pas noter comme « champ
   visible »).

---

## References

- WCAG 2.2 (W3C), niveaux A/AA.
- `project/design/ux/UX.md` — §2.5 (menu mobile), §4.4 (formulaires), §4.7
  (cookies), §5 (accessibilite).
- `project/design/ux/DESIGN_SYSTEM_SPECS.md` — tokens, tailles de cibles.
- `project/docs/SECURITY_AUDIT.md` (meme build, angles complementaires).
