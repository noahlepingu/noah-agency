# DESIGN_SYSTEM_SPECS.md — Specifications UX du design system master

Version : 0.1 (Phase 0 — Discovery)
Porteur : UX Designer (direction artistique fondation)
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : REQUIREMENTS.md (FR-BASE-01, FR-BASE-02, NFR-ACC-01, NFR-REUSE-01), UX.md, SITEMAP_MASTER.md

---

## 1. Principes directeurs

| Principe | Definition | Application |
| -------- | ---------- |-------------|
| **Simplicite** | Chaque element a une raison d'etre. Pas de decoratif inutile. | Moins c'est mieux. Chaque composant justifie sa presence. |
| **Coherence** | Un meme element se comporte de la meme facon partout. | Meme style, meme espace, meme interaction, meme feedback. |
| **Accessibilite** | Tout le monde peut utiliser le site, quel que soit l'equipement ou le handicap. | WCAG 2.2 AA minimal. Focus, contraste, labels, ARIA. |
| **Adaptabilite** | Le design system s'adapte a chaque secteur et chaque client sans etre reelu. | Variables de marque (couleurs, fonts, images), pas de code specifique par template. |
| **Independance technique** | Pas de dependance a un framework CSS impose. | Tokens CSS custom properties, composants decouples de l'implementation. |
| **Performance** | Le design system produit des sites rapides. | Pas de lourdeurs, images optimisees, CSS minimal, pas de JS inutile. |

---

## 2. Tokens fondationnels

Les tokens sont les **variables de base** du design system. Ils sont definis en CSS custom properties et adaptables par client via le fichier de configuration.

### 2.1 Espacements

Base : **4px**. Tous les espacements sont des multiples de 4.

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--space-0` | 0 | Aucun espace |
| `--space-1` | 4px | Micro-espace (entre elements lies) |
| `--space-2` | 8px | Petit espace (padding interne d'un badge) |
| `--space-3` | 12px | Espace entre elements proches |
| `--space-4` | 16px | Espace standard (padding d'un bouton) |
| `--space-5` | 20px | Espace entre groupes |
| `--space-6` | 24px | Espace entre sections proches |
| `--space-8` | 32px | Espace entre sous-sections |
| `--space-10` | 40px | Espace entre sections |
| `--space-12` | 48px | Espace entre grandes sections |
| `--space-16` | 64px | Espace entre parties majeures |
| `--space-20` | 80px | Espace de respiration maximum |
| `--space-24` | 96px | Espace hero (desktop) |

### 2.2 Border radius

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--radius-none` | 0 | Pas d'arrondi |
| `--radius-sm` | 4px | Petits elements (badges, tags) |
| `--radius-md` | 8px | Elements moyens (cartes, inputs) |
| `--radius-lg` | 12px | Grandes cartes, modales |
| `--radius-xl` | 16px | Hero, sections en fond |
| `--radius-2xl` | 24px | Elements premium (si besoin) |
| `--radius-full` | 9999px | Ronds (avatars, boutons circulaires) |

### 2.3 Ombres

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--shadow-none` | none | Pas d'ombre |
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtil (cartes au repos) |
| `--shadow-md` | 0 4px 6px -1px rgba(0,0,0,0.1) | Standard (cartes, popups) |
| `--shadow-lg` | 0 10px 15px -3px rgba(0,0,0,0.1) | Fort (modales, dropdown) |
| `--shadow-xl` | 0 20px 25px -5px rgba(0,0,0,0.1) | Tres fort (hero, elements en avant) |
| `--shadow-focus` | 0 0 0 3px var(--color-focus-ring) | Focus clavier (accessibilite) |

### 2.4 Z-index

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--z-base` | 0 | Contenu normal |
| `--z-raised` | 10 | Elements legerement au-dessus (cartes) |
| `--z-dropdown` | 100 | Menus deroulants, autocomplete |
| `--z-sticky` | 200 | Header fixe, CTA sticky |
| `--z-modal` | 300 | Modales, overlays |
| `--z-toast` | 400 | Notifications temporaires |
| `--z-cookie` | 500 | Cookie banner |
| `--z-menu-mobile` | 600 | Menu burger mobile (le plus haut) |

### 2.5 Breakpoints

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--bp-sm` | 640px | Petit mobile / grand mobile |
| `--bp-md` | 768px | Tablette (paysage) |
| `--bp-lg` | 1024px | Desktop (tablette paysage / petit desktop) |
| `--bp-xl` | 1280px | Desktop standard |
| `--bp-2xl` | 1536px | Grand desktop |

**Approche** : mobile-first. Les media queries commencent par `min-width`.

### 2.6 Grille

| Contexte | Colonnes | Gutter | Margin |
| -------- | -------- | ------ | ------ |
| Mobile (< 768px) | 4 | 16px | 16px |
| Tablette (768px - 1024px) | 8 | 24px | 24px |
| Desktop (> 1024px) | 12 | 24px | auto (centrage, max-width) |
| Contenu (texte) | max 12 colonnes, max-width 720-800px | — | — |

### 2.7 Transitions

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--transition-fast` | 150ms ease | Hover, focus, micro-interactions |
| `--transition-normal` | 250ms ease | Changements d'etat standard |
| `--transition-slow` | 350ms ease | Animations d'ouverture (menu, modale) |
| `--transition-none` | 0ms | Prefers-reduced-motion : desactive toutes les transitions |

---

## 3. Typographies

### 3.1 Recommandation : familles de polices

Le design system recommande des **familles** adaptables, pas des choix finaux imposes. Chaque client peut choisir dans les familles recommandees.

#### Police de titres (heading)

| Famille | Style | Avantages | Recommandation |
| ------- | ----- | --------- | -------------- |
| **Inter** | Sans-serif, geometrique | Lisible, professionnelle, gratuite (Google Fonts), nombreuses variantes | Par defaut pour tous les templates |
| **Playfair Display** | Serif, elegant | Chaleureuse, premium, bucolique | Restaurant, artisan |
| **DM Sans** | Sans-serif, moderne | Claire, legere, moderne | Commerce, independant |
| **Libre Baskerville** | Serif, classique | Fiable, intemporelle | Association, profession liberale |

#### Police de corps (body)

| Famille | Style | Avantages | Recommandation |
| ------- | ----- | --------- | -------------- |
| **Inter** | Sans-serif | Excellente lisibilite ecran, gratuite, multilingue | Par defaut |
| **Source Sans 3** | Sans-serif | Claire, professionnelle, Google Fonts | Alternative |
| **Lora** | Serif | Chaleureuse, lisible,Articles | Restaurant (corps) |

### 3.2 Echelle de tailles

| Token | Taille mobile | Taille desktop | Usage |
| ----- | ------------- | -------------- | ----- |
| `--text-xs` | 12px | 12px | Caption, mentions, legal |
| `--text-sm` | 14px | 14px | Small, labels, meta |
| `--text-base` | 16px | 16px | Corps de texte, paragraphs |
| `--text-lg` | 18px | 18px | Corps large, intros |
| `--text-xl` | 20px | 20px | Sous-titres |
| `--text-2xl` | 24px | 24px | Titres de section (H3) |
| `--text-3xl` | 28px | 30px | Titres importants (H2) |
| `--text-4xl` | 32px | 36px | Titres majeurs (H1 desktop) |
| `--text-5xl` | 40px | 48px | Hero title (desktop) |

### 3.3 Poids et line-height

| Element | Poids | Line-height | Letter-spacing |
| ------- | ----- | ----------- | -------------- |
| Hero title | 700 (Bold) | 1.1 | -0.02em |
| H1 | 700 (Bold) | 1.2 | -0.01em |
| H2 | 600 (SemiBold) | 1.3 | 0 |
| H3 | 600 (SemiBold) | 1.3 | 0 |
| Body | 400 (Regular) | 1.6 | 0 |
| Caption | 400 (Regular) | 1.4 | 0.01em |

---

## 4. Palettes de couleurs

### 4.1 Systeme de couleurs

Le design system utilise un systeme de **couleurs parametrables**. Chaque client definit sa palette via le fichier de configuration.

#### Couleurs fondationnelles (non modifiables par client)

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--color-white` | #FFFFFF | Fond principal, texte sur fond sombre |
| `--color-black` | #000000 | Texte principal (si pas de customisation) |
| `--color-gray-50` | #F9FAFB | Fond de section alternatif |
| `--color-gray-100` | #F3F4F6 | Fond de carte, separations legeres |
| `--color-gray-200` | #E5E7EB | Bordures, separateurs |
| `--color-gray-300` | #D1D5DB | Bordures hover, icons secondaires |
| `--color-gray-400` | #9CA3AF | Texte secondaire, placeholders |
| `--color-gray-500` | #6B7280 | Texte secondaire, icons |
| `--color-gray-600` | #4B5563 | Texte secondaire fonce |
| `--color-gray-700` | #374151 | Texte principal sur fond clair |
| `--color-gray-800` | #1F2937 | Texte principal, titres |
| `--color-gray-900` | #111827 | Texte principal, fond sombre |

#### Couleurs fonctionnelles

| Token | Valeur | Usage |
| ----- | ------ | ----- |
| `--color-success` | #059669 | Confirmation, succes |
| `--color-success-light` | #D1FAE5 | Fond de confirmation |
| `--color-error` | #DC2626 | Erreur, alerte |
| `--color-error-light` | #FEE2E2 | Fond d'erreur |
| `--color-warning` | #D97706 | Attention |
| `--color-warning-light` | #FEF3C7 | Fond d'attention |
| `--color-info` | #2563EB | Information |
| `--color-info-light` | #DBEAFE | Fond d'information |
| `--color-focus-ring` | #3B82F6 | Contour de focus clavier |

#### Couleurs de marque (configurables par client)

| Token | Description | Exemple restaurant | Exemple artisan |
| ----- | ----------- | ------------------- | --------------- |
| `--color-primary` | Couleur principale du client | #B91C1C (rouge) | #1D4ED8 (bleu) |
| `--color-primary-light` | Variante claire | #FEE2E2 | #DBEAFE |
| `--color-primary-dark` | Variante foncee | #7F1D1D | #1E3A8A |
| `--color-secondary` | Couleur secondaire | #F59E0B (dore) | #059669 (vert) |
| `--color-secondary-light` | Variante claire | #FEF3C7 | #D1FAE5 |
| `--color-secondary-dark` | Variante foncee | #B45309 | #047857 |
| `--color-accent` | Couleur d'accent (CTA) | #DC2626 | #2563EB |
| `--color-accent-light` | Variante claire | #FEE2E2 | #DBEAFE |

### 4.2 Contrastes obligatoires

| Combinaison | Contraste min. | Verification |
| ----------- | -------------- | -------------- |
| Texte principal sur fond blanc | >= 4.5:1 | Obligatoire (AA) |
| Texte secondaire sur fond blanc | >= 4.5:1 | Obligatoire (AA) |
| Texte blanc sur `--color-primary` | >= 4.5:1 | Obligatoire (AA) |
| Texte blanc sur `--color-accent` | >= 4.5:1 | Obligatoire (AA) |
| Icone sur fond blanc | >= 3:1 | Obligatoire (AA, non-texte) |
| Bordure sur fond blanc | >= 3:1 | Obligatoire (AA, non-texte) |

**Obligation** : chaque palette client est validee avec un outil de contraste avant validation.

### 4.3 Palettes pre-definies par template

Ces palettes sont les **recommandations de depart** pour chaque template. Le client peut les personnaliser.

| Template | Primary | Secondary | Accent | Ambiance |
| -------- | ------- | --------- | ------ | -------- |
| Restaurant | #B91C1C (rouge) | #F59E0B (dore) | #DC2626 (rouge vif) | Chaleureux, appetissant |
| Artisan | #1D4ED8 (bleu) | #059669 (vert) | #2563EB (bleu vif) | Fiable, professionnel |
| Commerce | #7C3AED (violet) | #F59E0B (orange) | #7C3AED (violet vif) | Moderne, attractif |
| Independant | #0891B2 (cyan) | #059669 (vert) | #0891B2 (cyan vif) | Pro, accessible |
| Association | #059669 (vert) | #D97706 (ambre) | #059669 (vert vif) | Chaleureux, engage |

---

## 5. Composants UI — Catalogue

Chaque composant est decrit avec :
- **Description** : a quoi il sert.
- **Props/Configuration** : ce qui est parametrable.
- **Etats** : default, hover, focus, disabled, error, loading, empty.
- **Responsive** : comportement mobile/tablette/desktop.
- **Accessibilite** : roles ARIA, focus, labels.

### 5.1 Header

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `logo` | image + texte | Logo du client |
| `navItems` | array | Liens de navigation (max 6) |
| `cta` | object | Texte + lien + couleur du bouton CTA |
| `sticky` | boolean | Fixe en haut au scroll |
| `transparent` | boolean | Transparent au depart, opaque apres scroll |

**Etats** :
- Default : fond blanc, texte gris-800.
- Scrolled : fond blanc + ombre (shadow-sm).
- Transparent (option) : fond transparent, texte blanc, devient blanc au scroll.

**Responsive** :
- Desktop : navigation horizontale + CTA bouton.
- Mobile : logo + CTA compact + burger.

### 5.2 Footer

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `logo` | image + texte | Logo du client |
| `address` | string | Adresse complete |
| `phone` | string | Telephone (lien tel:) |
| `email` | string | Email (lien mailto:) |
| `hours` | array | Horaires |
| `socials` | array | Liens reseaux sociaux |
| `legalLinks` | array | Liens mentions legales, confidentialite |
| `copyright` | string | Texte copyright |

**Responsive** :
- Desktop : 3 colonnes.
- Mobile : 1 colonne, empilee.

### 5.3 Hero

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `title` | string | Titre principal (H1) |
| `subtitle` | string | Sous-titre |
| `image` | string | Image de fond ou image cote |
| `cta` | object | Bouton CTA (texte + lien) |
| `ctaSecondary` | object | Bouton secondaire (optionnel) |
| `layout` | enum | `centered` / `left` / `right` / `split` |
| `overlay` | boolean | Overlay sombre sur l'image |

**Etats** :
- Default : image + texte + CTA.
- CTA : hover (legerement plus sombre), focus (outline), active (plus sombre).

**Responsive** :
- Desktop : layout split ou center, hauteur 400-600px.
- Mobile : layout centered, hauteur 300-400px, image reduite.

### 5.4 CTA (Call to Action)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `text` | string | Texte du bouton |
| `href` | string | Lien |
| `variant` | enum | `primary` / `secondary` / `outline` / `ghost` |
| `size` | enum | `sm` / `md` / `lg` |
| `icon` | string | Icone optionnelle (position gauche ou droite) |
| `fullWidth` | boolean | Pleine largeur (mobile) |

**Etats** :
- Default : fond `--color-accent`, texte blanc, radius `--radius-md`.
- Hover : fond +10% sombre, ombre `--shadow-md`.
- Focus : outline `--shadow-focus`.
- Active : fond +20% sombre.
- Disabled : grise (`--color-gray-300`), pas de hover, cursor: not-allowed.

### 5.5 ContactForm

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `fields` | array | Champs du formulaire (nom, email, tel, message, etc.) |
| `submitText` | string | Texte du bouton |
| `cnilText` | string | Mentions CNIL |
| `recaptcha` | boolean | Protection anti-spam |
| `successMessage` | string | Message de confirmation |
| `errorMessage` | string | Message d'erreur globale |

**Etats** :
- Default : champs vides, bouton desactive (si validation active).
- Focus : champ souligne avec `--color-focus-ring`.
- Error : bordure rouge, message sous le champ, aria-invalid.
- Loading : bouton avec spinner, champs desactives.
- Success : message de confirmation, formulaire reinitialise.

**Responsive** :
- Desktop : grille 2 colonnes (nom/email en ligne, message pleine largeur).
- Mobile : 1 colonne, tous les champs pleine largeur.

### 5.6 Gallery (Galerie)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `images` | array | Liste des images (src, alt, caption) |
| `layout` | enum | `grid` / `masonry` / `carousel` |
| `columns` | number | Nombre de colonnes (grid) |
| `lightbox` | boolean | Ouvrir en plein ecran au clic |

**Etats** :
- Default : grille ou carousel.
- Hover : leger zoom (scale 1.02), overlay avec titre.
- Focus : outline sur l'image cliquable.
- Empty : message "Aucune photo pour le moment."

**Responsive** :
- Desktop : grille 2-3 colonnes.
- Tablet : grille 2 colonnes.
- Mobile : grille 1-2 colonnes OU carousel.

### 5.7 Testimonials (Avis)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `testimonials` | array | Liste des avis (nom, texte, note, source) |
| `layout` | enum | `carousel` / `grid` / `list` |
| `showSource` | boolean | Afficher la source (Google, TripAdvisor) |
| `showRating` | boolean | Afficher les etoiles |

**Etats** :
- Default : avis visibles.
- Carousel : navigation fleches + dots.
- Focus : sur les boutons de navigation.

**Note** : avis reels uniquement, jamais fabriques.

### 5.8 Pricing (Tarifs)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `plans` | array | Listes des formules/prix |
| `layout` | enum | `cards` / `table` / `list` |
| `highlight` | number | Index de la formule mise en avant |
| `cta` | object | Bouton par formule |

**Etats** :
- Default : cartes avec prix.
- Hover : la carte mise en avant leve (ombre).
- Focus : sur les boutons.

### 5.9 FAQ

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `questions` | array | Liste Q/R |
| `layout` | enum | `accordion` / `grid` |
| `defaultOpen` | number | Index de la question ouverte par defaut |

**Etats** :
- Default : toutes fermees (ou une ouverte).
- Open : le contenu apparait avec animation (max-height transition).
- Focus : sur le bouton de chaque question, outline visible.
- ARIA : aria-expanded, aria-controls.

**Responsive** :
- Desktop : accordion ou grille 2 colonnes.
- Mobile : accordion, 1 question a la fois.

### 5.10 Map (Carte)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `address` | string | Adresse a afficher |
| `lat` | number | Latitude |
| `lng` | number | Longitude |
| `zoom` | number | Niveau de zoom |
| `markerLabel` | string | Texte du marqueur |
| `provider` | enum | `openstreetmap` / `google` (a definir) |

**Etats** :
- Default : carte avec marqueur.
- Fallback : image statique + lien vers Google Maps (si JS desactive).
- Loading : skeleton ou placeholder.

**Note** : impact cookies a determiner avec security-engineer.

### 5.11 Menu (Restaurant)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `categories` | array | Categories (Entrees, Plats, Desserts, Boissons) |
| `items` | array | Articles (nom, description, prix, photo) |
| `layout` | enum | `list` / `grid` / `magazine` |
| `showPrices` | boolean | Afficher les prix |
| `showPhotos` | boolean | Afficher les photos |

**Responsive** :
- Desktop : grille 2 colonnes ou magazine.
- Mobile : liste 1 colonne, photos reduites.

### 5.12 OpeningHours (Horaires)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `hours` | array | Jours + horaires |
| `layout` | enum | `list` / `compact` / `table` |
| `showStatus` | boolean | Afficher "Ouvert" / "Ferme" en temps reel |

**Etats** :
- Default : liste des horaires.
- Open : indicateur vert "Ouvert" (si showStatus).
- Closed : indicateur rouge "Ferme".

### 5.13 SocialLinks

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `links` | array | Liens reseaux sociaux |
| `style` | enum | `icons` / `buttons` / `text` |
| `size` | enum | `sm` / `md` / `lg` |

**Accessibilite** : aria-label sur chaque lien ("Facebook", "Instagram", etc.).

### 5.14 CookieBanner

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `show` | boolean | Afficher le bandeau (si tiers detectes) |
| `acceptText` | string | Texte bouton accepter |
| `rejectText` | string | Texte bouton refuser |
| `customizeText` | string | Texte bouton personnaliser |
| `categories` | array | Categories de cookies (analytics, maps, etc.) |
| `privacyLink` | string | Lien politique de confidentialite |

**Etats** :
- Default : bandeau visible en bas.
- Hidden : apres choix, le bandeau disparait.
- Customize : panneau avec checkboxes par categorie.

### 5.15 LanguageSwitcher (Multilingue — optionnel)

| Prop | Type | Description |
| ---- | ---- | ----------- |
| `languages` | array | Langues disponibles |
| `current` | string | Langue courante |

**Position** : header, a cote du CTA ou dans le menu burger (mobile).
**Comportement** : clic = rechargement sur la page equivalent dans l'autre langue.
**Persistance** : choix stocke dans un cookie necessaire (langue) ou localStorage.

---

## 6. Etats speciaux visuels (recapitulatif)

Ces etats sont designes dans UX.md (section 4) et implementes comme composants du design system.

| Etat | Composant requis | Priorite |
| ---- | ---------------- | -------- |
| Page 404 | Layout + contenu + CTA | MUST |
| Page 500 | Layout + contenu + CTA + contact | MUST |
| Aucun creneau (reservation) | Message inline + actions | MUST |
| Erreur formulaire (par champ) | Bordure + message + aria | MUST |
| Erreur formulaire (globale) | Message role="alert" + liens | MUST |
| Confirmation envoi | Message role="status" + actions | MUST |
| Confirmation reservation | Recap + confirmation + actions | MUST |
| Cookie banner | Bandeau + personnalisation | MUST |
| Page en construction | Layout + message + CTA | SHOULD |
| Etat vide (liste, galerie) | Message + CTA | SHOULD |
| Loading (formulaire) | Spinner + disabled | MUST |

---

## 7. Design tokens — Fichier de configuration client

Chaque site client est configure via un fichier YAML qui alimente les tokens :

```yaml
branding:
  primary_color: "#B91C1C"
  secondary_color: "#F59E0B"
  accent_color: "#DC2626"
  fonts:
    heading: "Playfair Display"
    body: "Inter"

colors:
  # Fondationnelles (rarement modifies)
  white: "#FFFFFF"
  black: "#000000"
  gray-50: "#F9FAFB"
  gray-900: "#111827"
  # Fonctionnelles (jamais modifies)
  success: "#059669"
  error: "#DC2626"
```

---

## 8. Dependances

- **solution-architect** : faisabilite technique des tokens CSS, du systeme de variables, de l'implementation framework-agnostic.
- **frontend-engineer** : implementation des tokens, des composants, du systeme de configuration.
- **accessibility-specialist** : validation des contrastes, du focus, des ARIA, du clavier.
- **security-engineer** : evaluation de l'impact cookies (maps, analytics).
- **content-seo** : contenus des composants (textes, images, avis).
- **Noah (Gate 1/2)** : validation des palettes, des familles de polices, des principes.

---

## 9. Points ouverts (Gate 2)

1. **Familles de polices** : confirmer les 2-3 familles de depart (Inter + Playfair Display ?).
2. **Palette par defaut** : confirmer les couleurs recommandees par template.
3. **Map provider** : OpenStreetMap (sans cookie) ou Google Maps (cookie requis) ? Decision technique.
4. **Carousel** : les carrousels sont-ils acceptes (impact mobile) ? Ou grille systématique ?
5. **Animation** : confirmer le niveau d'animation (transitions simples uniquement ou animations plus poussees ?).
6. **Dark mode** : hors perimetre v1 ? A documenter comme COULD.
7. **Icons** : quelle librairie d'icons ? (Heroicons, Lucide, Phosphor — gratuites).
8. **Images placeholder** : les composants ont-ils un etat "pas encore d'image" ?
