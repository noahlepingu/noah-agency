# Audit Accessibilite — Refonte visuelle « Bistrot lyonnais » (commit be42a43)

- **Date** : 2026-09-18
- **Perimetre** : refonte DA (UX_REDESIGN_RESTAURANT.md + DESIGN_SYSTEM_SPECS.md §8), template exemple-restaurant, 16 pages build (`npm run build:example`), preview `http://localhost:4321`
- **Methode** : lecture code source (`src/components/*.astro`, `src/styles/*.css`, `theme.css`, `ui.json`) + analyse HTML genere (dist/exemple-restaurant) + calculs de contraste (WCAG 2.2 AA). Pas de tests navigateur automatises (axe-core) — verifications par analyse statique, meme methode que l'audit v1.
- **Non regression** : compare a `ACCESSIBILITY_AUDIT.md` (v1) : B1-B4, M5-M7, note etoiles, m10-lang.

## 1. Synthèse

| Verdict | Conforme WCAG 2.2 AA sur le perimetre verifiable statiquement, **avec reserves mineures** |
|---|---|
| Bloquants | Aucun |
| Majeurs | Aucun |
| Mineurs | 8 (dont 3 de l'audit v1 non corriges : m8, m9, m10 partiel) |
| A verifier au navigateur | 1 (contraste titre hero variante A sur photo) |

## 2. Correctifs v1 confirmes (non-regression)

| Ref v1 | Constat | Etat |
|---|---|---|
| B1 | Nav dupliquee (deux landmarks non nommes) | CORRIGE — labels distincts FR/EN : « Navigation principale » (desktop), « Menu mobile », « Plan du site » (footer). Nav mobile `display:none` desktop => pas de doublon visible |
| B2 | Burger sans nom accessible | CORRIGE — `aria-label` « Ouvrir/Fermer le menu de navigation » (bascule dynamique), span `.sr-only`, `aria-expanded` + `aria-controls="ds-menu-mobile"` |
| B3 | Absence de focus trap (menu mobile, cookie banner) | CORRIGE — menu mobile : Tab wrap, Escape, focus initial 1er lien, retour focus au burger a la fermeture. Cookie banner : trap present dans le code (non rendu dans l'exemple, pas de tiers) |
| B4 | Back-to-top focusable invisible | CORRIGE — `visibility:hidden` + class `.ds-back2top--show` a l'apparition (scroll > 300px) |
| M5 | « Ferme » en gray-400 (contraste 2.89:1) | CORRIGE — `ink-soft` : **7.21:1** |
| M6 | Texte succes contraste insuffisant | CORRIGE — `success-dark` #047857 : **5.40:1** (surface-raised), **5.14:1** (surface) |
| M7 | Erreurs formulaire non annoncees | CORRIGE — `aria-describedby` par champ + `aria-invalid`, `role="alert"` global, focus deplace sur le 1er champ invalide, `novalidate`, honeypot `aria-hidden` + tabindex=-1 |
| note v1 | Etoiles Testimonials sans nom | CORRIGE — `role="img" aria-label="X/5"` |
| m10 (lang) | Switcher < 44px | CORRIGE (cible reduite) — hauteur 28px OK en tant que lien secondaire |

## 3. Contraste (toutes paires => PASS)

Regle : >= 4.5:1 texte normal, >= 3:1 texte grand / non-texte.

| Paire | Ratio | Verdict |
|---|---|---|
| ink #2A211C / surface #FBF7F0 | 14.75:1 | PASS |
| ink-soft #5C5148 / surface | 7.21:1 | PASS |
| ink-soft / surface-alt #F3EBDF | 6.52:1 | PASS |
| blanc / accent #B4542C (bouton primaire) | 4.95:1 | PASS |
| creme #FBF7F0 / accent (on-accent) | 4.63:1 | PASS |
| accent-dark #8F3E1F / surface | 6.84:1 | PASS |
| accent-dark / surface-alt | 6.17:1 | PASS |
| accent-dark / surface-raised | 7.19:1 | PASS |
| ink / surface-raised | 15.51:1 | PASS |
| success-dark #047857 / surface-raised | 5.40:1 | PASS |
| success-dark / surface | 5.14:1 | PASS |
| surface-raised / surface-dark #2B2320 (CTA final) | 15.15:1 | PASS |
| surface-dark-text #C9BFAF / surface-dark | 8.47:1 | PASS |
| surface-dark-muted #A99F93 / surface-dark (legal 12px) | 5.91:1 | PASS |
| accent-light #F2DCCF / surface-dark (tel footer) | 11.67:1 | PASS |
| warning-dark #92400E / surface (etoiles deco) | 6.64:1 | PASS |
| error-dark #991B1B / surface | 7.78:1 | PASS |
| error-dark / error-soft #FDF0EE | 7.47:1 | PASS |
| bordure error #DC2626 (non-texte) | 4.75:1 | PASS |
| focus-ring #3B82F6 / surface (3px outline) | 3.44:1 | PASS (>= 3:1) |
| line-strong #9A7B5E / surface (pointilles menu, non-texte) | 3.66:1 | PASS |
| secondary-dark #7D5A36 / surface | 5.80:1 | PASS |
| gray-500 #6B7280 / surface (texte secondaire) | 4.53:1 | PASS |

## 4. Conformites structure / navigation / clavier (HTML genere)

- 1 h1 unique par page ; aucun saut de niveau de titre.
- `lang="fr"` / `lang="en"` corrects (pages /en/).
- Skip-link « Aller au contenu principal » toujours 1er focusable, cible `#contenu`.
- Aucun `<img>` informatif sans alt ; unique alt vide = placeholder lightbox (`src=""`, remplit par JS dans un `<dialog>` ferme => OK).
- Boutons sans aria-label = nommes par texte visible (Exemple : « Reserver », « Envoyer »).
- 404/500 : `role="alert"`, monogramme decoratif `aria-hidden="true"`, h1 narratif (« Cette page est partie gouter ailleurs », « Une erreur de cuisine »).
- Gallerie : 8 boutons `aria-label` (alt reel de l'image) + `aria-haspopup="dialog"` ; `<dialog aria-label="Galerie">` natif, fermeture => retour focus natif sur l'ouvreur, `decoding="async"` + `loading="lazy"` (width/height presents).
- Carte : iframe `title` + `loading="lazy"` + fallback lien OpenStreetMap avec `rel="noopener noreferrer nofollow"`.
- Formulaires : labels visibles associes, messages d'erreur lies par `aria-describedby`, `aria-invalid`, honeypots `aria-hidden` + `tabindex="-1"` (retenus par robots, ignores par lecteurs d'ecran).
- Ouverture : `<div id="ds-status" role="status" aria-live="polite" data-status ...>` — « Ouvert » / « Ferme » lu par AT ; badge hero `role="status"` ; mention « (aujourd'hui) » `hidden` sinon.
- Header : logo `aria-label` (monogramme texte), liens `aria-current="page"`, CTA « Reserver » 44px min (ds-btn).
- Focus `:focus-visible` 3px `focus-ring` (3.44:1) sur tout le site ; skip-link visible au focus.
- `prefers-reduced-motion` global CSS (`scroll-behavior: auto`, animations reduites) dans base.css.
- Sticky CTA : masque (media query < 768px) sur /reservation et /contact ; lien tel avec `aria-label="Appeler 04 72 00 00 01"`.
- Menu : ordre DOM nom -> tags -> prix -> description (prix lisible apres le nom pour AT) ; categories H3 sous H2 ; tags `(v)/(p)/(bio)` visibles.
- Taille minimale : `.ds-btn` = min-height 44px, radius 4px.

## 5. Problemes restants (par priorite)

| ID | Severite | Critere | Page / composant | Constat |
|---|---|---|---|---|
| A-RES-01 | A VERIFIER (navigateur) | WCAG 1.4.3 | Home, hero variante A | Titre blanc sur photo (brightness 0.8 + voile 12%) : ratio non calculable statiquement. A confirmer visuellement au Gate 3. Variante B (split) : header transparent ink au-dessus de colonne image => risque contraste (cf. D-FE-RE-01), a corriger dans le template |
| A-MIN-01 | Mineur | 4.1.3 (statut) | /reservation, ReservationForm | Message « aucun creneau » (`data-no-slot`) sans `role="status"`/`aria-live` => jamais annonce. Non corrige depuis v1 (m8) |
| A-MIN-02 | Mineur | 2.3.3 (motion) | Toutes pages, BackToTop | `scrollTo({behavior:'smooth'})` non protege par `prefers-reduced-motion` (JS). Les CSS globaux le sont, pas ce script. Non corrige depuis v1 (m9) |
| A-MIN-03 | Mineur | 2.5.8 (taille cible AA) | Footer | Liens 14px (~22px de haut), liens legal 12px (~19px) : < 24px recommande. LanguageSwitcher corrige (28px), pas le footer. Non corrige depuis v1 (m10, partiel) |
| A-MIN-04 | Mineur | 4.1.2 (nom) | /menu, MenuCard | Tags `aria-label="Tags: v, p"` sur `<span>` generique non interactif : libelle concatene les cles brutes (v/p/bio), support AT faible pour aria-label sur span non interactif. Preférer un texte `.sr-only` |
| A-MIN-05 | Mineur | 2.4.6 (titres) | /menu et /galerie | H1 identique au H2 de section (« La Carte » / « En images ») : redondance editoriale quand le composant section est rendu sur sa page dediee |
| A-MIN-06 | Mineur | 1.3.1 / editorial | Accueil, section Intro | H2 d'intro absent : `texts.index.intro_subtitle` manquant dans data.json => seul un `<p>` surtitre « Bienvenue » + chapeau ; la DA §5.2 prevoit « surtitre + H2 + chapeau ». Section sans titre pour les AT |
| A-MIN-07 | Mineur | 2.1.2 (clavier) | CookieBanner (code) | Fermeture : focus non restitue au declencheur ; Escape ne ferme que le panneau (acceptable). Non rendu dans l'exemple (pas de tiers) |
| A-MIN-08 | Mineur | 1.3.1 | Menu | `SkipLink.astro` inutilise (composant mort) : le Header inline son propre skip-link => aucune incidence, a supprimer pour hygiene |

## 6. Actions recommandees (relayees aux developpeurs — l'audit ne modifie pas le code)

1. **Frontend (ReservationForm)** — ajouter `role="status"` (ou `aria-live="polite"`) sur le bloc `data-no-slot`. *(A-MIN-01)*
2. **Frontend (BackToTop)** — garder `scrollTo({behavior:'smooth'})` uniquement si `matchMedia('(prefers-reduced-motion: reduce)')` est faux. *(A-MIN-02)*
3. **Frontend (Footer)** — passer les liens secondaires/legal a `min-height: 24px` (padding vertical) ou `font-size: 14px`. *(A-MIN-03)*
4. **Frontend (MenuCard)** — remplacer l'aria-label sur span par un texte visuellement masque (`span.sr-only`) « Vegetarien, Poisson, Bio » ; sinon retirer l'attribut (information deja visible). *(A-MIN-04)*
5. **Contenu/Page** — sur /menu et /galerie, laisser le titre de page distinct du titre de section (ex. H2 de section masque via sr-only, ou titre H1 different). *(A-MIN-05)*
6. **Contenu (data.json)** — renseigner `texts.index.intro_subtitle` (le H2 est deja branche dans index.astro). *(A-MIN-06)*
7. **Frontend (CookieBanner)** — restituer le focus au bouton « Gerer les cookies » a la fermeture. *(A-MIN-07)*
8. **Frontend (Hero variante B)** — header `--dark`/transparent uniquement sur les variantes a fond plein ; verifier contraste titre sur photo a la souris ET au clavier (focus). *(A-RES-01)*
9. **Hygiene** — supprimer `SkipLink.astro` ou documenter son usage. *(A-MIN-08)*

## 7. Verifications complementaires (au navigateur, avant Gate 3)

- axe-core sur les 9 pages (home, menu, reservation, contact, galerie, a-propos, 404, 500, en) ;
- parcours clavier complet (menu mobile, lightbox, formulaires, retour focus) ;
- contraste titre hero variante A (photo), et variante B (split) ;
- agrandissement 200 % et 320px de large (pas de perte de contenu).

## 8. Budgets / dependances

- Aucune dependance JS tierce ajoutee par la refonte (zero JS externe, scripts inline Astro uniquement).
- Les images hero/galerie restent en JPEG demo (optimisation AVIF/WebP traitee par l'audit performance separe).
- Aucun impact architectural ; pas de decision DECISIONS.md requise. Le point A-RES-01 (variante B) est a suivre avec le D frontend (ecart D-FE-RE-01).
