# Re-DESIGN « Bistrot lyonnais » — Implementation frontend (ETAPE 4-7)

Reference : `project/design/UX_REDESIGN_RESTAURANT.md` (decisions D-UX-15 a 21).
Date : 2026-09-16 — Frontend Engineer.

## Perimetre realise

### Etape 4 — Composants (bibliotheque partagee `src/components/`)
Recrits/alignes sur la nouvelle direction artistique (aucune nouvelle
dependance, fonts self-hosted, zero cookie) :

- **Header** : transparent sur hero puis `ds-header--solid` au scroll > 40px
  (JS, passive). Theme sombre (`ds-header--dark`) uniquement quand la variante
  hero le permet (`[data-hero-dark]` : A pleine + C typographique), encre sur
  la variante B split — ecart DA documente (WCAG 1.4.3, D-FE-RE-01). Burger
  offcanvas avec focus-trap / Escape / aria-expanded. Logo Fraunces 600 24px.
- **LanguageSwitcher** : pill DA (14px, radius-full, border line-strong).
- **Hero** : variantes `full | split | type | compact` (+ alias `centered`),
  fallback defensif full sans image -> type, `data-hero-full` + `data-hero-dark`
  (lus par Header), badge Ouvert/Ferme inline `[data-hero-status]` (client-side,
  jours = `utils/days.mjs` source unique), pleine hauteur 92svh, voile 12%,
  monogramme Fraunces en filigrane (variante C), compact = surface-alt.
- **MenuCard (carte typographique) / Menu** : 0 card ; nom Fraunces 26/500 +
  ligne de points + prix Inter 600 tabular-nums ; prop `preview` = 3 categories
  x 1 plat + lien « Voir toute la carte ».
- **Gallery** : grille 6 colonnes asymetrique (patron 5 images), lightbox
  `<dialog>` natif, placeholder damier, lazy + decoding async.
- **Testimonials** : blockquote Fraunces italic 26px sans fond/ombre.
- **Footer** : `surface-dark` 4 colonnes (baseline, plan du site depuis
  `navItems`, coordonnees, legal 12px), lien « Gerer les cookies » conditionne
  par `third_party` (C-06).
- **StatePage** : monogramme Fraunces 120px = le code d'etat (404/500),
  messages narratifs DA dans `ui.json` (fr/en).
- **MobileStickyCTA** (nouveau) : < 768px, cache sur /reservation et /contact ;
  telephone parcouru `data.footer.phone || data.contact_form.phone` (la base
  passait `data.components` sans `phone` top-level : barre jamais rendue —
  corrige, D-FE-RE-04).
- Couleurs alignees : OpeningHours, FAQ, BackToTop, Breadcrumb, Map,
  SocialLinks, CookieBanner (tokens DA, 0 ombre sur Map).

### Etape 5 — Pages
- **index.astro** : Hero (A si `hero_image`, sinon C) + badge status + CTA
  reserver + lien « Voir la carte » + monogramme initiales business ; Intro
  centree (eyebrow + H2 + chapeau italic + CTA) ; Menu preview ; Gallery ;
  Testimonials ; OpeningHours+Map en grille ; CTA final `ds-section--cta`
  surface-dark (phrase italic + CTA accent + tel outline on-dark).
- **reservation.astro / contact.astro** : grille `.ds-layout-form` 7fr/5fr
  (>= 1024px), formulaire dans `.ds-form-card` (ReservationForm prop `card`),
  colonne `.ds-form-side` (OpeningHours + adresse/tel/email + note « >8
  personnes » via `ui.reservation.note`) ; carte standalone sur /contact
  (forms styles deplaces dans `utilities.css` — bug preexistant D-FE-RE-03).
- PageLayout : Hero `layout="compact"` (fini `centered`/`overlay`).

### Etape 6 — Donnees client
- `client_data.yaml` : full skyline DA 2.7 (tokens explicites + Fraunces/Inter),
  `hero_image` (hero.jpg demo), `gallery.images` 8 photos demo avec alt.
- `template.yaml` : defauts DA (palette + Fraunces/Inter).

### Etape 7 — Scripts (coordination backend/data)
- `generate-site.mjs` : fallbacks DA 2.6 + variantes explicites de marque
  (`primary_light`, `accent_dark`, `on_*`...) utilisees telles quelles sinon
  calculees (darkTokenPair WCAG) — D-FE-RE-02.
- `validation-core.mjs` : `Fraunces` ajoutee a l'enum FONTS — D-FE-RE-05.
- `contrast-check.mjs` : fallbacks alignes DA 2.6.

## Verification
- `npm test` : 30/30 PASS.
- `validate:example` : code 0 (47 champs valides ; SHOULD non bloquantes :
  google_business, district, zone).
- `build:example` : 16 pages (13 FR + 3 EN) OK.
- `contrast` : 11/11 PASS (dont white on accent #B4542C = 4.95:1, on-accent
  #FBF7F0 = 4.63:1, on-secondary #241B16 sur #A67C52 = 4.53:1).
- Routes preview : /, /menu, /reservation, /contact, /galerie, /a-propos,
  /404, /en/ = 200.
- Build : 0 occurrence des anciens hex (B91C1C/F59E0B/DC2626) ; hero/gallery
  images servies ; Fraunces dans le CSS ; Playfair uniquement en fallback de
  la pile `--font-heading` (intentionnel).
- Header `ds-header--dark` sur l'accueil, `ds-btn` header CTA + hero CTA
  « Reserver » ; sticky CTA present (home + EN), absent sur /reservation et
  /contact ; tel link 04 72 00 00 01.

## Points pour le Tech Lead / coordination
1. **Doublet « cuisine cuisine » (a-propos)** : reliquat de contenu dans
   `client_data.yaml` (business.description) — c'est un probleme de DONNEES,
   pas de code ; le correctif appartient au contenu/SEO (XML « cuisine »).
2. **`deploy-site.yml`** : node-version 20 vs Astro 7 (Node >= 22) — deja note
   D-FE-G4-01, hors perimetre frontend.
3. **Ecart DA Header** : sombre uniquement sur heros A/C (pas B) — WCAG —
   a valider par Noah en Gate 2 (D-FE-RE-01).
4. **Images demo** : a remplacer par les vraies photos client en Gate 2
   (D-UX-21) ; `hero_image` et `gallery.images` coupent automatiquement vers
   les variantes Hero A et la galerie.
5. `ui.form.honeypot` absent de ui.json (label vide rendu) — mineur, a ajouter
   si un libelle visible est souhaite.