# UX_REDESIGN_RESTAURANT.md — Direction artistique « Bistrot lyonnais »

Version : 1.0 — Direction artistique complète du template restaurant
Porteur : UX Designer (direction artistique)
Statut : PROPOSE — a valider par Noah en Gate 2, decisions a acter (section 9)
Cible : design system par defaut (tokens.css `@layer ds-brand`) + composants partages (src/components) + template flagship exemple-restaurant
Reference visuelle analysee (sans copie) : Bistrot & Co, Lyon (bistrot contemporain, chaleureux, authentique, convivial, local, elegant mais accessible)

> Ce document est une RECETTE REUTILISABLE, pas une retouche du client exemple :
> il definit la nouvelle identite par defaut du systeme, appliquable a tous les
> futurs clients restaurant, puis declinable aux autres secteurs.

---

## 1. DIAGNOSTIC VISUEL DE L'EXISTANT — ce qui donne l'effet « template IA »

Constat de fond : le systeme est techniquement sain mais visuellement
indifferencie. Chaque pave porte la signature « template genere par IA » :
carte blanche arrondie + ombre portee + fond gris froid + rouge sature + blocs
identiques empiles.

| # | Probleme | Symptome exact | Fichier / composant concerne |
| - | -------- | -------------- | ---------------------------- |
| P1 | **Cards arrondies partout** | `.ds-card` applique `border-radius: var(--radius-lg)` (12px) + `box-shadow: var(--shadow-sm)` + `padding: 24px` ; utilisee pour le menu (`MenuCard.astro`) et les avis (`Testimonials.astro`). Chaque plat et chaque avis devient une « boite ». | `src/styles/utilities.css` (.ds-card), `src/components/MenuCard.astro`, `Testimonials.astro` |
| P2 | **Ombres partout** | `shadow-sm` sur les cards, `shadow-md` sur la map, `shadow-lg` sur le cookie banner, `shadow-sm` permanent sur le header — meme sur une page sans contraste (header blanc sur fond blanc). | `utilities.css`, `Gallery.astro` (l.100-103), `Map.astro` (l.59), `CookieBanner.astro` (l.158), `Header.astro` (l.110) |
| P3 | **Rouge sature omnipresent** | `--color-primary: #B91C1C`, `--color-accent: #DC2626` dans `@layer ds-brand` (tokens.css) ET dans `theme.css` du client (branding YAML). Links, titre menu, boutons, hover : tout est rouge vif. L'effet « pizzeria chaine » domine l'effet « bistrot elegant ». | `src/styles/tokens.css` (l.131-139), `src/sites/exemple-restaurant/theme.css`, `MenuCard.astro` (titre categorie `--color-primary`), `buttons.css` (primary/accent) |
| P4 | **Hero centre titre+texte+boutons sur fond gris** | Le layout par defaut est `centered` (`index.astro` l.52) : titre serif 700 + texte gris + 2 boutons alignes au centre sur `background-color: var(--color-gray-100)`. Sans image (hero_image: null), c'est exactement le gabarit « IA generique ». | `src/components/Hero.astro` (l.59-109), `src/sites/exemple-restaurant/pages/index.astro` (l.46-54) |
| P5 | **Blocs identiques repetes** | Accueil = Hero centre, puis Intro centre (ds-prose), puis Menu en cards, puis Galerie en grille 3 uniformes, puis Horaires/Map, puis Avis en cards, puis FAQ en cards (bordure+radius+fond blanc). 5+ paquets visuels identiques (fond blanc, cards, radius 12, ombre). | `index.astro`, `Menu.astro`, `Gallery.astro`, `FAQ.astro`, `Testimonials.astro` |
| P6 | **Espacements incoherents** | `.ds-section` = 48px fixe partout ; hero = 40px/64px/80px de padding sans logique de rythme ; aucune distinction entre section standard, section d'ouverture, section finale. La page « respire » partout de la meme maniere, donc nulle part. | `utilities.css` (.ds-section), `Hero.astro` (l.64, 104, 107) |
| P7 | **Typo sans hierarchie** | Playfair 700 partout (hero, h1, h2, footer, menu) + titre `font-weight: 700` ; meme graisse pour le nom du resto (logo 24px), un titre de section et un titre de plat. Le « premium » Playfair 700 est la signature des sites AI 2023-2025. | `base.css` (h1-h3), `Hero.astro` (l.85), `MenuCard.astro` (l.38), `Footer.astro` (l.120) |
| P8 | **Gris froids systeme** | `--color-gray-50 #F9FAFB`, `--color-gray-900 #111827` : tons bleutes/neutres froids incompatibles avec l'univers chaleureux d'un bistrot. Footer noir pur `#111827` (l.109), body gris 800 `#1F2937`. | `tokens.css` (l.92-101), `base.css` (l.31), `Footer.astro` (l.109) |
| P9 | **Menu = cards au lieu d'une vraie carte** | Chaque categorie est une `.ds-card` avec fond, bordure, radius 12, padding 24 ; les plats sont des lignes serrees dans des boites ; les prix sont `font-weight:700` sans alignement de colonne. Une carte de restaurant ne ressemble pas a une grille de cartes produit. | `MenuCard.astro` (integration dans `.ds-card`), `Menu.astro` (grid 2 cols de cards) |
| P10 | **Galerie en grille uniforme** | `grid-template-columns: repeat(3, 1fr)` a 1024px, toutes les images 4:3 identiques, `border-radius: 12px` + `shadow-sm` : mur de vignettes, aucune mise en scene. | `Gallery.astro` (l.97-129) |
| P11 | **Etats speciaux cliniques** | 404/500 = icone ronde grise + titre centre + boutons, sur fond blanc — aucune coherence narrative avec l'univers. Cookie banner blanc pur + border top gris. Formulaire : champs avec bordure grise + radius 8 (administratif). | `StatePage.astro`, `CookieBanner.astro`, `ContactForm.astro`/`ReservationForm.astro` (inputs radius-md) |
| P12 | **Header « bureau blanc »** | Fond blanc + ombre permanente, liens gris-700, logo 20px Playfair 700 rouge. Aucune dialectique transparent/solide, aucun lien avec l'art direction hero. | `Header.astro` (l.105-140) |
| P13 | **Avis en boites** | `.ds-card` pour chaque avis : le temoignage perd sa valeur de parole ; la page devient un catalogue. | `Testimonials.astro` (l.31) |
| P14 | **Aucune presence d'images** | `hero_image: null`, `gallery: []` : le site est 100 % textuel sur fonds gris. | `content/clients/exemple-restaurant/client_data.yaml`, `index.astro` (l.49, 71) |

---

## 2. NOUVELLE PALETTE — « Crème, brun sombre chaud, terracotta »

Direction : surfaces ivoire/creme chaudes, textes brun sombre (jamais noir pur),
UNE accent terracotta utilisee avec parcimonie. Les gris froids systeme restent
disponibles (tokens fondationnels) mais ne sont PLUS utilises pour les surfaces,
textes et bordures du template restaurant.

### 2.1 Surfaces (creme / ivoire / beige chaud)

| Token | Hex | Role |
| ----- | --- | ---- |
| `--color-surface` | `#FBF7F0` | Fond principal du site (body) — remplace `--color-white` en usage de fond |
| `--color-surface-raised` | `#FFFDF9` | Fond des elements « eleves » : header scrolle, panels, lightbox, zone formulaire |
| `--color-surface-alt` | `#F3EBDF` | Fond de section alternative (beige sable) — remplace `--color-gray-50` |
| `--color-surface-dark` | `#2B2320` | Fond sombre chaud : hero typographique sans image, footer, bandeau CTA final |

### 2.2 Textes (sombres chauds — jamais de noir pur)

| Token | Hex | Contraste sur surface | Role |
| ----- | --- | --------------------- | ---- |
| `--color-ink` | `#2A211C` | 14.75:1 | Texte principal, titres (remplace gray-900/gray-800) |
| `--color-ink-soft` | `#5C5148` | 7.21:1 | Texte secondaire, descriptions, meta (remplace gray-600/gray-500) |

### 2.3 Accent — 3 options justifiees, 1 recommandee

**Option A — Terracotta `#B4542C` (RECOMMANDEE)**
Argile brulée, chaude et appétissante, sans saturation « alerte rouge ».
Evoque la terre cuite, le four a bois, l'art de la table provençal.
Blanc = 4.95:1, creme = 4.63:1 (AA ✓) — utilisable en fond de CTA et en texte grand.
0 risque de « rouge pizzeria ». Poids visuel fort mais discret : parfait pour UN
seul CTA, les liens, une regle de citation.

**Option B — Vert bouteille `#3E5C46`**
Elegance champêtre, « chef qui respecte le produit », tres distinctif (aucun
template IA ne l'utilise comme accent principal). Blanc = 8.9:1 (AAA).
Moins « appetissant » que le terracotta au sens strict, meilleur pour un
positionnement « table du marche » / « chef » / « végé ». A retenir comme
accent alternatif client, pas comme defaut.

**Option C — Cuivre / bronze `#A8643A`**
Chic industriel patiné, proche du terracotta mais plus brun et plus discret.
Risque : contraste blanc sur cuivre ≈ 3.6:1 (echec AA en texte petit) — il
faudrait toujours l'assombrir en `#8A4F2C` pour les textes. Interessant en
secondaire (ornements, filets), trop faible en accent unique.

**Decision : accent = `#B4542C` (terracotta), accent-dark `#8F3E1F` (liens, hover, textes accent), accent-light `#F2DCCF` (fonds de survol / erreurs douces).**

### 2.4 Couleurs fonctionnelles (conservees, compatibles)

| Token | Valeur | Usage sur la nouvelle palette |
| ----- | ------ | ----------------------------- |
| `--color-success` | `#059669` | Badge / fond success (conserve) |
| `--color-success-dark` | `#047857` | TEXTE « Ouvert » (5.14:1 sur surface ✓ – D-A11Y-05) |
| `--color-error` | `#DC2626` | Bordure d'erreur, fond `--color-error-light` (4.52:1, bordure OK) |
| `--color-error-dark` | `#991B1B` | TEXTE d'erreur (7.78:1 ✓) — les messages d'erreur utilisent TOUJOURS error-dark |
| `--color-warning` | `#D97706` | Etoiles decoratives uniquement |
| `--color-warning-dark` | `#92400E` | TEXTE d'avertissement (D-A11Y-05) |
| `--color-info` / `--color-info-light` | `#2563EB` / `#DBEAFE` | Page en construction, bandeaux info (conserve) |
| `--color-focus-ring` | `#3B82F6` | Focus clavier (3.44:1 sur surface, OK pour non-texte) |

Regle : les couleurs fonctionnelles ne changent PAS l'ambiance ; elles sont
utilisees ponctuellement et jamais sur les surfaces principales.

### 2.5 Bordures et lignes

| Token | Hex | Role | Contraste |
| ----- | --- | ---- | --------- |
| `--color-line` | `#E4D9C8` | Separeateurs decoratifs, hairlines (jamais porteur de texte) | 1.31:1 (decoratif assume) |
| `--color-line-strong` | `#9A7B5E` | Bordures de CHAMPS de formulaire, controles interactifs | 3.66:1 ✓ (WCAG 1.4.11) |

### 2.6 Bloc CSS complet — remplacement du bloc `@layer ds-brand` dans `src/styles/tokens.css`

```css
@layer ds-brand {
  :root {
    /* ---- Couleurs de marque — palette par defaut « Bistrot lyonnais »
       Surchargees par le theme.css du client (ADR-006). Les composants ne
       lisent QUE ces variables. */
    --color-primary: #3a2e27;        /* brun sombre chaud — identite, liens, boutons secondaires */
    --color-primary-light: #efe5d8;  /* variante claire (survol outline, fonds) */
    --color-primary-dark: #241b16;   /* variante foncee (hover, skip-link) */
    --color-secondary: #a67c52;      /* laiton — ornements et gros titres decoratifs UNIQUEMENT (jamais en texte courant : 3.50:1) */
    --color-secondary-light: #f0e4d3;
    --color-secondary-dark: #7d5a36; /* version TEXTE du laiton (5.80:1 ✓) */
    --color-accent: #b4542c;         /* terracotta — CTA principal, accents */
    --color-accent-light: #f2dccf;
    --color-accent-dark: #8f3e1f;    /* liens texte, hover, focus accent (6.84:1 ✓) */
    --color-on-primary: #fbf7f0;
    --color-on-primary-dark: #fbf7f0;
    --color-on-secondary: #241b16;
    --color-on-secondary-dark: #fbf7f0;
    --color-on-accent: #fbf7f0;
    --color-on-accent-dark: #fbf7f0;

    /* ---- Surfaces chaudes (nouveaux tokens consommes par les composants) */
    --color-surface: #fbf7f0;
    --color-surface-raised: #fffdf9;
    --color-surface-alt: #f3ebdf;
    --color-surface-dark: #2b2320;
    --color-ink: #2a211c;
    --color-ink-soft: #5c5148;
    --color-line: #e4d9c8;
    --color-line-strong: #9a7b5e;

    /* ---- Typographies */
    --font-heading: 'Fraunces', 'Playfair Display', Georgia, 'Times New Roman', serif;
    --font-body: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }
}
```

### 2.7 Synchronisation avec le YAML client (`client_data.yaml` → `theme.css`)

Le pipeline (ADR-006) genere `theme.css` depuis `branding`. Pour que le site
exemple SOIT la nouvelle DA (et pas un patchwork), recommander ces valeurs dans
`content/clients/exemple-restaurant/client_data.yaml` :

```yaml
branding:
  primary_color: "#3A2E27"
  secondary_color: "#A67C52"
  accent_color: "#B4542C"
  fonts:
    heading: "Fraunces"
    body: "Inter"
```

Les composants consomment `--color-surface*` (definis par defaut dans ds-brand) :
ils fonctionnent avec ou sans theme.css a jour, et restent surchargeables si un
client veut une autre ambiance.

---

## 3. TYPOGRAPHIE — « Fraunces + Inter », une vraie hierarchie editoriale

Le systeme conserve l'Inter pour le corps (lisible, performant) et REMPLACE
Playfair Display par **Fraunces** pour les titres : meme famille « oldstyle »
mais avec un vrai caractere (contrastes fins/epais, graisses optiques,
inclinaison pour chapeaux). Ce changement de filet de voix est le plus rentable
du redesign : Playfair 700 = signature IA, Fraunces 500 = facture humaine.

### 3.1 Fonts a charger (`src/styles/fonts.css`)

- **Inter** : statut conserve (var. latin variable 400..600, cyrillique activable).
- **Fraunces** : AJOUT — auto-souscription via `fonts.googleapis.com` interdite
  (RGPD/performance) : on embarque les fichiers woff2 en local
  (`/public/fonts/fraunces-*.woff2`) :
  - `fraunces-latin-wght.woff2` variable 100..900 (avec SOFT 0, WONK a activer)
  - `fraunces-latin-opsz.woff2` variable 9..144
  - `fraunces-italic-latin-wght.woff2` (slnt) — pour les chapeaux italiques
  - Poids utilises : 400 (hero, grands titres), 500 (titres de section),
    600 (surtitres, mots accentues), 700 (boutons secondaires texte uniquement,
    jamais en titre de paragraphe).
- Fallback (en local, identiques sur mobile/desktop) : `'Playfair Display', Georgia, 'Times New Roman', serif`.

### 3.2 Echelle — nouveaux tokens `--text-*` a ajouter dans `tokens.css`

| Token | Taille | Line-height | Usage |
| ----- | ------ | ----------- | ----- |
| `--text-7xl` | 120px | 1.0 | Numero 404, monogramme footer |
| `--text-6xl` | 64px | 1.05 | H1 hero (+ `clamp(2.5rem, 6vw, 4rem)` si applique en CSS) |
| `--text-4xl` | 40px | 1.15 | H2 de section / H1 de page interieure |
| `--text-3xl` | 30px | 1.2 | T2 intermediaire (conservation, utilite) |
| `--text-2xl` | 26px | 1.3 | H3 de bloc (plat, carte, avis) |
| `--text-lg` | 18px | 1.6 | Texte courant accentue, chapeau |
| `--text-base` | 16px | 1.6 | Corps principal |
| `--text-sm` | 14px | 1.5 | Meta, legendes, nav |
| `--text-xs` | 12px | 1.4 | Mentions legales, labels badges |

Modifies : `--text-6xl` (nouveau 64px), `--text-4xl` (40px au lieu de 36px),
`--text-2xl` (26px au lieu de 24px), `--text-7xl` (nouveau). Le reste de
l'echelle `--text-*` est conserve (pas de regression).

### 3.3 Graisses — regles de NON-usage

- Les TITRES ne sont **jamais** en 700. H1 : 400-500 (Fraunces, optical size
  auto). H2/H3 : 500. Le gras 700 est reserve au texte de bouton secondaire
  et aux badges (texte 12-14px).
- Les PRIX sont en 600, `font-variant-numeric: tabular-nums`, alignes a droite
  de la ligne de plat (pas de gras decoratif).
- Le LIEU/ADRESSE en footer : 400, jamais uppercase (sauf `--text-xs` pour le
  label « Adresse » en etiquettes).
- NAV : Inter 500, 15px, `letter-spacing: 0.01em` — jamais uppercase, jamais
  serif (la distinction logo/titres/nav donne la hierarchie).
- LOGO : Fraunces 600, 24px, `letter-spacing: -0.01em`, couleur `--color-ink`
  (le « accent » est reserve au CTA).

### 3.4 Effets de voix (a utiliser avec parcimonie)

- Chapeau editorial : `Fraunces italic 400-500`, 1.25rem, couleur
  `--color-ink-soft` — un seul par page, sous le H1 ou en tete de section.
- Mot accentue : un mot d'un titre (max 2) passe en Fraunces italic accent
  `#B4542C` (ex. « le bon *goût* de *simplement* ») — jamais plus, sinon c'est
  un candy shop.
- Surtitre d'eyebrow : Inter 600, 12px, `text-transform: uppercase`,
  `letter-spacing: 0.14em`, couleur `--color-accent-dark` — sur toutes les
  sections en alternance avec des surtitres « simples » (sans uppercase) toutes
  les 2 sections pour eviter la monotonie.

### 3.5 Hauteur de ligne et grille

- `line-height` de base `1.6` ; les titres entre 1.05 et 1.3 (voir tableau).
- `letter-spacing: 0` par defaut (Fraunces est condensee) — pas de tracking
  negatif surajoute.
- Un paragraphe ne depasse pas 68 caracteres (`--content-max: 680px`).

---

## 4. ESPACEMENT ET RYTHME — « respirer par sections, pas par padding »

### 4.1 Nouveaux tokens de spacing (`tokens.css`)

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--space-28` | 112px | Espace entre sections majeures (desktop) |
| `--space-32` | 128px | Ouverture hero typographique → premiere section ; section finale → footer |
| `--space-40` | 160px | CTA final seul (espace de pause avant footer) |

`--space-*` existants (4..24) conserves pour les elements internes.

### 4.2 Rythme des sections (remplace `.ds-section { padding: 48px }`)

| Type de section | Mobile | Tablet `>=768` | Desktop `>=1024` |
| --------------- | ------ | -------------- | ---------------- |
| Section standard | 64px | 72px | 96px |
| Section d'ouverture (apres hero) | 64px | 88px | 112px (`--space-28`) |
| Hero (padding interne) | 40px | 56px | 80px |
| Section avec surtitre + titre + texte | `gap: 24px` | `gap: 28px` | `gap: 32px` |
| CTA final | 96px | 128px | 160px (`--space-40`) |

Regles de rythme :
1. **Alternance de fonds** : section `surface` → `surface-alt` → `surface`...
   jamais deux sections consecutives sur le meme fond sans un element de
   separation visuelle (titre, image, vraie pause de 128px).
2. **Grille de 8** : tous les `padding` internes de section sont des multiples
   de 8 (64, 72, 80, 96, 112, 128, 160). Les espacements de composants internes
   restent en multiples de 4 (< 24px) et repassent en multiples de 8 au-dela.
3. **`--container-max: 1160px`** (au lieu de 1200px) : la colonne est plus
   etroite donc le site parait plus « fait main » ; `--content-max: 680px`
   pour les blocs de texte (Intro, A-propos, legal).
4. **Les hauts de section** sont plus generes que les bas : un H2 se sent
   « arrive », jamais « tombe ». `margin-top` de section = 1.5 x `margin-bottom`.

---

## 5. COMPOSITIONS PAR PAGE — « du hero au footer, piece par piece »

### 5.0 Header — transparent puis solide

- **Etat hero (haut de page)** : `background: transparent`, texte `--color-ink`,
  ombre AUCUNE. Le hero (toujours sombre ou avec image) porte le contraste lui-meme.
- **Etat scrolle (`> 40px`, JS existant a conserver)** : `background: var(--color-surface-raised)`,
  `border-bottom: 1px solid var(--color-line)`, ombre supprimee (P2) — la
  ligne suffit a separer. Transition `background-color .2s ease`.
- **Mobile** : menu burger en `--color-ink`, fond offcanvas `--color-surface-raised`.
- 404/500 : header dans l'etat scrolle par defaut (pas de hero).

### 5.1 Hero — 3 variantes, une seule regle : « un fond, une phrase, une action »

Regle commune aux 3 variantes : UN H1 (max 3 mots par ligne visuelle),
UN chapeau d'une phrase max, UN CTA principal (+ 1 lien texte de second plan
max). Fond jamais gris — l'univers chaleureux vient des fonds creme/sombre/image.

**Variante A — « Pleine hauteur, titre surplombant » (RECOMMANDEE si image)**
- Hauteur `min-height: 92svh` ; `overflow: hidden` ; pas de card.
- Image : `object-fit: cover` cadree centre-bas (les photos de restaurant se
  lisent de l'assiette vers la salle), filtre `brightness(0.8)` homogene —
  PAS de gradient en degrade vertical (sature, signature IA) — uniquement un
  voile `black 12%` pour la lisibilite.
- Contenu : colonne gauche, `align-self: flex-end`, padding bas 64px.
- Titre Fraunces 400-500, 44→64px, 2 lignes max, `color: #fff`.
- CTA : bouton accent plein (blanc/crème 4.63:1 ✓). Lien secondaire « Ver carte »
  en texte blanc souligne, `text-decoration-thickness 1px`.
- Badge « Ouvert actuellement / Ferme » place en haut a gauche, `surface-raised`.

**Variante B — « Split editorial » (quand l'image est partielle ou secondaire)**
- Grille 12 cols : `span 7` texte (Fond `--color-surface-alt`, padding
  `--space-28` vertical), `span 5` image (ratio 4:5, `object-position: center`).
- Le titre descend sur l'image ? NON : le texte reste sur fond creme, l'image
  est accolée a droite sans radius (bordure dure = artisanat).
- CTA principal sur fond `--color-surface-dark` (bouton creme), lien texte
  « Horaires et acces » en `--color-ink-soft`.

**Variante C — « Typographique sombre, sans image » (cas par defaut du systeme : hero_image: null)**
- Fond `--color-surface-dark` ; pas de card, pas d'illustration.
- Monogramme decoratif du nom du restaurant en Fraunces 200 (48px) en
  filigrane a droite, `opacity: 0.16`.
- Titre creme 44→64px + surtitre italic `#F2DCCF` (accent-light).
- Baseline `--color-surface-raised` 70% (crème pâle) — contraste >
  13:1 ✓.
- UN CTA accent + UN lien texte « Voir le menu » en accent-light.
- Le hero sombre impose le footer sombre ? NON : on coupe avec une section
  `surface-alt` pleine creme — le bas du hero est le seul endroit ou l'on
  autorise un raccord franc sombre/clair (pare que le hero est plein cadre).

### 5.2 Accueil — ordre des sections (10 paves max)

1. `Hero` (A/B/C selon image)
2. `Intro/Positioning` : surtitre « Bistrot du quartier » + H2 Fraunces 500 +
   chapeau italic + `--content-max` centré (petite respiration editoriale).
3. `Menu preview` : H2 + 3-4 plats SIGNATURES seulement (pas toute la carte) +
   bouton secondaire « Voir toute la carte » — texte aligne gauche.
4. `Gallery` : 1 image grand format (1200x900) + 2 petites (600x600) en
   composition asymetrique (voir 5.4).
5. `Testimonials` : 2-3 avis en citation, sans card (voir 5.5).
6. `OpeningHours + Map` en bi-colonne : horaires « table » a gauche, map
   silencieuse a droite (pas de carre gris).
7. `CTA final` : fond `--color-surface-dark`, phrase courte + bouton accent
   « Reserver une table » + numéro de téléphone en lien tel:.

Les sections 2-7 alternent `surface` / `surface-alt` : le site ne montre
jamais 3 paves blancs d'affilee.

### 5.3 Page Menu — vraie « carte de restaurant », 0 card

- H1 Fraunces 500 « La carte » + sous-titre `--content-max` (le mot « menu »
  est conserve dans la nav et le SEO ; le titre de page peut rester « Menu »,
  decision copywriting a verifier avec content-seo).
- Chaque categorie : surtitre Inter 600 uppercase `--color-accent-dark`,
  titre Fraunces 500 40px, 4-8 plats.
- Un plat = `grid: auto 1fr auto` : `nom (Fraunces 500, 26px)` —
  `ligne de points (border-bottom: 2px dotted var(--color-line-strong))` —
  `prix (Inter 600 tabular-nums, 22px, droite)`. Description 14px en
  `--color-ink-soft` dessous, jusqu'a 2 lignes.
- Indicateurs : `(v)` végé / `(p)` peut etre adapté / `(bio)` — en 12px
  accent-dark italic, jamais d'emoji.
- Categories ESPACEES de `--space-28`, pas de cards, pas de fond de bloc.
- Si aucune image normale : pas de vignettes de plats ; la carte typographique
  suffit (et coute moins cher a maintenir).

### 5.4 Page Galerie — grille 6 colonnes asymetrique, sans ombre

- Grille desktop : `repeat(6, 1fr)`, `gap: 12px`, `border-radius: 0` (angles
  vifs = facture artisanale ; le radius 12 reste reserve aux champs et CTA).
- `item 1` : `span 4`, ratio 16:10 (grand format).
- `item 2` : `span 2`, ratio 4:5.
- `items 3-4` : `span 2` chacun, ratio 4:3.
- `item 5` : `span 6`, ratio 21:9 (panoramique de la salle, ferme la serie).
- Lignes de 3 images alignees interdites (P10).
- Mobile : 2 cols, ratio 4:3, la grande image en `span 2`.
- Aucune ombre ; `object-fit: cover` ; `loading="lazy"` + `decoding="async"`
  (hors premier ecran).

### 5.5 Page Avis / Temoignages — citations, pas de cards

- Avis = blockquote : `quotes` custom `« »` en Fraunces italic 26px, auteur
  (nom + quartier) 14px `--color-ink-soft`, 0 fond, 0 bordure, 0 ombre.
- Colonne simple `--content-max`, 3-5 avis, separes par `--space-20` (80px).
- Etoiles : 5 x `★` couleur `--color-warning-dark` (voir WCAG, echec en warning
  pur sur fond clair) — texte d'aide « Note moyenne 4,8/5 » en 14px.

### 5.6 Responsive / mobile-first

- Base : nav burger pleine largeur (`surface-raised`), CTA fixe en bas de
  viewport (barre sticky « Reserver » + tel) sur mobile UNIQUEMENT
  (`display: none` >= 768px) — c'est LE pattern de conversion mobile restaurant.
- Tap targets >= 44px (grille de contact et plats : padding 12px 16px min).
- Hero A : `min-height: 88svh` mobile, titre 36px min, CTA pleine largeur
  (`width: 100%`) sur < 480px.
- Horaires : `white-space: nowrap` interdit ; colonne simple, jours en
  colonne de droite alignee.

### 5.7 Page Reservation — 2 colonnes, confirmation narrative

- Grille : gauche `span 7` formulaire (`surface-raised`, padding 32-40px,
  radius 16px UNIQUEMENT ici — c'est le seul bloc « carte » de la page),
  droite `span 5` : infos pratiques (horaires, adresse, tel, note « Sur
  réservation, nous confirmons par téléphone sous 2 h »).
- Champs : `border: 1.5px solid var(--color-line-strong)`, `radius: 8px`,
  fond `--color-surface-raised`, `padding: 12px 14px`, labels 14px
  `--color-ink-soft`.
- Erreur : bordure `--color-error`, message en `--color-error-dark` a cote du
  champ + `aria-describedby` ; erreur globale (ex. creneau pris) en bandeau
  haut de formulaire, fond `#FDF0EE`, bordure `#F4C6BC`.
- Succes : ecran plein de confirmation (voir EDGE_CASES) — « Reservation
  envoyee, nous vous rappelons pour confirmer » + bouton retour accueil.
- Empêche-creneaux : si aucune disponibilite, le select affiche `disabled`
  « Plus de creneau ce jour » et le bloc date intervient apres validation.

### 5.8 Boutons (`buttons.css`)

| Type | Fond | Texte | Radius | Hover | Note |
| ---- | ---- | ----- | ------ | ----- | ---- |
| `btn-primary` | `--color-accent` | `--color-on-accent` (creme) | 4px | `--color-accent-dark` | CTA principal : TOUJOURS accent terracotta |
| `btn-secondary` | `--color-primary` | `--color-on-primary` | 4px | `--color-primary-dark` | Action secondaire (voir carte, contact) |
| `btn-outline` | transparent | `--color-ink` | 4px | `border-color: var(--color-secondary-dark)` | Lien texte de second plan |
| `btn-ghost` | transparent | `--color-ink-soft` | 4px | texte `--color-ink` | Navigation, reset |

Radius 4px partout (l'arrondi discret = bouton fait main ; 12px = template IA).
`min-height: 44px`, `font-weight: 600`, padding 12px 24px.

### 5.9 Cartes (`.ds-card`) — REPENSÉES, moins frequentes

La `.ds-card` reste disponible (systeme multi-secteur) mais le template
restaurant l'utilise UNIQUEMENT pour : formulaire de reservation/contact,
badge ouvert/ferme, bloc infos horaires en bi-colonne. PLUS JAMAIS pour :
menu, avis, plats, FAQ. A chaque usage : `border-radius: 16px` (2 ecarts max
de la base), `box-shadow: none` (le fond `surface-raised` + `border: 1px solid
var(--color-line)` suffit), `padding: 28px`.

### 5.10 Footer — sombre chaud, jamais noir

- `background: var(--color-surface-dark)`, pas de `#111827`.
- Colonnes : 1) logo Fraunces 600 24px creme + baseline 14px `#C9BFAF`
  (contraste sur `#2B2320` ~ 8.9:1 ✓) ; 2) liens nav (creme 14px) ;
  3) coordonnees (creme + lien tel accent-light) ; 4) legal 12px `#A99F93`.
- Bas de page : `border-top: 1px solid rgba(255,255,255,.12)`, mentions
  legales + langue + « Site fait a Lyon » (touche artisanale, 12px).

### 5.11 Etats speciaux — alignes sur l'univers

- **404** : fond `--color-surface-alt`, monogramme du nom en Fraunces 7xl
  `--color-line` derriere, H1 « Cette page est partie goûter ailleurs » +
  texte + 2 CTA (accueil, contact) + lien « menu » en texte.
- **500** : meme mise en scene, message « Une erreur de cuisine » + CTA
  retour + un bouton « Reessayer » (reload) — jamais d'icon grise generique.
- **Formulaire (erreur)** : voir 5.7 — jaune/rouge doux, texte error-dark.
- **Confirmation** : plein ecran, icone success (inline SVG), H2 Fraunces,
  « que se passe-t-il ensuite » en 3 etapes numerotees.
- **CookieBanner** : `surface-dark`, radius 12px, boutons accent/blanc,
  `position: fixed bottom`, `max-width: 520px` — coherent avec footer.
- **Langues** : select `pill` (14px, radius 999px, border line-strong).

---

## 6. RECETTE D'IMAGES — « 10 fichiers, des vrais formats, zero effet template »

Les images sont DE LA DEMO (provenance : Picsum, IDs verifies existants —
262 et 224 retournent 404 et sont EXCLUS). Le pipeline frontend devra
remplacer le `client_data.yaml` complet par les photos reelles du client
(gate 2) ; ce bloc documente l'usage AUQUEL chaque image doit repondre.

| # | URL demo | Usage | Format / ratio | Alt (FR, descriptif) | Note |
| - | -------- | ----- | -------------- | -------------------- | ---- |
| 1 | `https://picsum.photos/id/292/1920/1080` | Hero variante A | 1920x1080, 16:9 | « La salle du restaurant, tables en bois et lumieres chaudes » | photo de facade/salle, filtre brightness 0.85 |
| 2 | `https://picsum.photos/id/1081/1200/900` | Intro / image d'ambiance | 1200x900, 4:3 | « Le comptoir et les etageres de vins » | premiere section, cote texte |
| 3 | `https://picsum.photos/id/575/1200/900` | Menu preview | 1200x900, 4:3 | « Plat de saison servi a l'assiette » | ratatouille/plat du jour |
| 4 | `https://picsum.photos/id/429/1200/900` | Gallery grand format | 1200x900, 16:10 | « Table dresse pour le service du soir » | item span 4 |
| 5 | `https://picsum.photos/id/425/600/750` | Gallery portrait | 600x750, 4:5 | « Detail d'un dessert au chocolat » | item span 2 |
| 6 | `https://picsum.photos/id/1084/600/450` | Gallery carre | 600x450, 4:3 | « Le chef en cuisine » | item span 2 |
| 7 | `https://picsum.photos/id/119/600/450` | Gallery carre | 600x450, 4:3 | « Verres et carafe d'eau a table » | item span 2 |
| 8 | `https://picsum.photos/id/96/1920/820` | Gallery panoramique | 1920x820, 21:9 | « Vue panoramique de la salle animée » | item span 6, ferme la serie |
| 9 | `https://picsum.photos/id/390/800/450` | CTA final / A-propos | 800x450, 16:9 | « Le chef et son equipe en salle » | optionnel : peut rester textuel |
| 10 | `https://picsum.photos/id/1076/1200/800` | Page A-propos | 1200x800, 3:2 | « La devanture du restaurant le soir » | reservee a la page a-propos |

Regles images (livrable au frontend dans la spec composant) :
- `alt` TOUJOURS descriptif, jamais vide ni « image » (a11y). Une image
  purement decorative (filigrane, bandeau) passe en `alt=""` + `aria-hidden`.
- Mention legale si demo : `<!-- image de demo : a remplacer par les photos
  reelles du client avant mise en production -->` dans le template, PAS dans
  le alt.
- `width`/`height` explicites, `loading="lazy"` hors premier ecran,
  `decoding="async"`, WebP/jpeg 80q, `object-fit: cover` avec `object-position`
  par ratio (centre-bas pour hero, centre pour carres).
- Aucune photo ne porte de filtre ou de cadrage qui simule une « banque
  d'images premium » (HDR, vignettage, blur) — on cherche l'SNAPSHOT honnete.

---

## 7. RUBRIC ANTI-TEMPLATE (self-check a chaque page livree)

| C | Criteres | Defaut du template IA a eviter | Cible Bistrot lyonnais |
| - | -------- | ------------------------------ | ---------------------- |
| C1 | Fond de hero | Gris 100 + titre centre | Sombre, image, ou split creme ; jamais gris neutre |
| C2 | Boites | Card + radius 12 + ombre sur chaque element | 0 card pour menu/avis ; carte typographique ; radius 16 uniquement formulaires |
| C3 | Accent | Rouge pur / couleur neon | Terracotta, utilisee sur < 10% de la surface |
| C4 | Titres | Serif 700 partout (Playfair) | Fraunces 400/500, un seul effet italic par page |
| C5 | Rythme | 48px partout | Alternance de fonds + `--space-28/32/40` |
| C6 | Galerie | Grille uniforme 3xN | Grille 6 cols asymetrique, 0 ombre |
| C7 | Etats | Icones grises + blanc | 404/500 narratifs, confirme chaleureux, footer surface-dark |

Score cible : chaque page du template exemple doit passer les 7 criteres
sans exception — c'est la porte de sortie du « look LLM ».

---

## 8. FICHIERS A MODIFIER (avant-projet, hors scope de ce document)

Ordre d'implementation conseille (le frontend implementera via la spec UI) :

1. `src/styles/tokens.css` — remplacer le bloc `@layer ds-brand` (voir 2.6) ;
   ajouter `--text-6xl/7xl`, `--space-28/32/40`, `--container-max: 1160px`,
   `--content-max: 680px` ; retirer l'usage de `--color-white` comme fond.
2. `src/styles/fonts.css` — ajouter Fraunces (cf. 3.1).
3. `src/styles/base.css` — body `background: var(--color-surface)` /
   `color: var(--color-ink)` ; h1-h3 en Fraunces 400/500 ; `--content-max`
   applique a `.ds-prose` et aux pages legales.
4. `src/styles/buttons.css` — radius 4px, palette 5.8.
5. `src/styles/utilities.css` — `.ds-section` rythme (4.2), `.ds-card` restreint.
6. `src/components/Header.astro` — transparent→solide (5.0), footer lie.
7. `src/components/Hero.astro` — variantes A/B/C + voile 12% + CTA.
8. `src/components/Menu.astro` / `MenuCard.astro` — carte typographique (5.3).
9. `src/components/Gallery.astro` — grille 6 cols asymetrique (5.4).
10. `src/components/Testimonials.astro` — citations (5.5).
11. `src/components/Footer.astro` — surface-dark (5.10).
12. `src/components/StatePage.astro` — 404/500 narratifs (5.11).
13. `src/components/CookieBanner.astro` — surface-dark, radius 12 (5.11).
14. `src/components/Map.astro` / `OpeningHours.astro` — bi-colonne (5.2-6).
15. `src/components/ContactForm.astro` / `ReservationForm.astro` — champs
    line-strong, bandeau erreur, confirmation (5.7).
16. `src/sites/exemple-restaurant/pages/*` + `theme.css` + 
    `content/clients/exemple-restaurant/client_data.yaml` — valeurs 2.7.
17. `src/components/MenuCard.astro` — supprimable si 5.3 conserve le
    composant `MenuRow` (decision frontend).

---

## 9. DECISIONS A ACTER (a reporter dans projet/DECISIONS.md au nom de l'ux-designer)

| # | Decision | Preparer par | Statut |
| - | -------- | ------------ | ------ |
| D-UX-06 | Palette par defaut = creme/brun/terracotta (`#FBF7F0 / #2A211C / #B4542C`) ; gris froids retires des fonds/textes du template restaurant | ux-designer | A VALIDER (Gate 2) |
| D-UX-07 | Typo titres = Fraunces (embarque local, woff2 variable) ; Inter conserve en corps ; plus de Playfair ni de serif 700 en titres | ux-designer | A VALIDER |
| D-UX-08 | Rythme de sections : `--space-28/32/40` + `--container-max: 1160px`, alternance de fonds, sections >= 96px desktop | ux-designer | A VALIDER |
| D-UX-09 | Menu du restaurant = carte typographique (liste, pointilles, prix alignes) ; gallery = grille 6 cols asymetrique ; avis = citations ; footer = surface-dark | ux-designer | A VALIDER |
| D-UX-10 | Etats speciaux narratifs (404 « partie gouter ailleurs », 500 « erreur de cuisine ») + cookie banner surface-dark | ux-designer | A VALIDER |
| D-UX-11 | Images : 10 Picsum demos (IDs verifies) a remplacer par photos client AVANT production ; le bloc `hero_image: null` affiche la variante C par defaut | ux-designer | A VALIDER |
| D-DEP-XX | Adresse au frontend-engineer : implementer les 17 points de la section 8, sources uniques = ce document + DESIGN_SYSTEM_SPECS.md | ux-designer | ENVOYE LE MESSAGE CI-DESSOUS |

Blocages signales :
- Les avatars/visages des temoignages ne doivent PAS etre inventes (regle
  transversale) : les noms/quartiers viendront du client (champ
  `testimonials` du YAML) ou seront omis en mode demo — demander a Noah.
- Les images de cuisine reelles du client sont requises au plus tard a la Gate 2.

<!-- FIN -->