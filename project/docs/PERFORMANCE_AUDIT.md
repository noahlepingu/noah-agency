# Audit performance & poids — noah-agency

**Agent** : Accessibility + Performance Engineer (AGENT 11 — volet performance)
**Date** : 2026-09-15
**Version** : 1.0
**Perimetre** : build de reference `dist/exemple-restaurant/` (16 pages),
comparaison aux budgets systeme (HTML < 100 Ko, CSS < 30 Ko, JS < 10 Ko/page ;
Core Web Vitals : LCP < 2.5 s, INP < 100 ms, CLS < 0.1) et aux decisions
ADR-001..008 (zero JS par defaut, pas de traceur).
**Methodologie** : mesure des tailles reelles du dist, decomposition des
requetes par page, analyse des bundles CSS/JS et des dependances tierces.

> **Limites** : pas de navigateur ni de `node` dans l'environnement : pas de
> mesure Lighthouse/TTFB/WebPageTest reelle. Les estimations CWV sont des
> bornes statiques a confirmer au deploiement (Phase 8) + CI (lychee, axe).

---

## Sommaire executoire

| Domaine | Statut | Detail |
| ------- | ------ | ------ |
| Budgets globaux | **PASS** | HTML max 41.7 Ko (< 100), CSS 19.3 Ko (< 30), JS max 5.5 Ko (< 10) |
| Zero JS par defaut | **PASS** | 0 Ko JS sur 14/16 pages ; islands uniquement contact/reservation |
| Images | **PASS (exemple)** | 0 image dans l'exemple ; composants prets (hero eager + fetchpriority, galerie lazy + w/h) — regles a verifier avec un vrai client (PO-FE-03) |
| Fonts | **WARN** | Google Fonts CDN render-blocking (CDN tierce : latence + RGPD/IP) ; `@font-face` self-host declares mais **/fonts/ absent du dist** ; Inter 500 charge par le CDN mais non declare en self-host — incoherence |
| Requetes / cache | **WARN** | 5-7 requetes/pages + 5 fichiers woff2 ; compression/cache a verifier a la mise en service (headers Cloudflare Pages) |
| CWV estimes (statique) | **PASS estime** | LCP ~ texte hero (aucune image) ; CLS faible hors FOUT ; INP tres faible (aucun JS) — confirmer au deploiement |

**Verdict** : `OK SOUS RESERVE` — architecture conforme aux budgets avec une
marge confortable ; 2 points a traiter avant le 1er client reel (fonts
self-host + regles d'images) et 1 BUG transverse 404/500 a confirmer.

---

## 1. Budgets — poids par page (HTML)

| Page | Taille HTML | CSS | JS | Verdict |
| ---- | ----------- | --- | -- | ------- |
| index (FR + EN) | 41 724 / 41 687 o | 19 268 | 0 | OK |
| temoignages | 24 416 o | 19 268 | 0 | OK |
| contact (FR/EN) | 23 725 / 23 555 o | 19 268 | 1 756 (+ forms 984) | OK |
| reservation | 22 040 o | 19 268 | 4 504 (+ forms 984) | OK |
| menu | 17 581 o | 19 268 | 0 | OK |
| faq | 15 946 o | 19 268 | 0 | OK |
| galerie | 15 324 o | 19 268 | 0 | OK |
| a-propos (FR/EN) | 13 638 / 13 602 o | 19 268 | 0 | OK |
| 500 | 11 955 o | 15 072* | 0 | OK |
| 404 | 11 914 o | 15 072* | 0 | OK |
| mentions-legales / confidentialite / plan | 11 447 / 11 820 / 11 816 o | 19 268 | 0 | OK |

`* 404/500 ne chargent que confidentialite.bmKD1etB.css (15 072 o) — le bundle hero/boutons CPazk4Lc.css (4 196 o) n'est pas charge : voir BUG §4.`

**Total distribue** : 376 Ko pour le site complet (16 pages + assets), soit
~23 Ko/page en moyenne — excellent pour un site vitrine.

## 2. Composition des assets

### 2.1 CSS — 2 bundles par page

- `_astro/confidentialite.bmKD1etB.css` — **15 072 o** : styles globaux
  (base, tokens, utilities, header, footer, menu, skip-link). Charge partout.
- `_astro/confidentialite.CPazk4Lc.css` — **4 196 o** : hero + boutons
  (`ds-btn`). Charge partout **sauf** 404/500 (BUG, §4).
- Total : **19 268 o** de CSS par page < budget 30 Ko. Scoping Astro
  (`data-astro-cid`) : pas de fuite entre pages — verifie en surface.

### 2.2 JS — islands uniquement (PASS, ADR-001/ADR-008 appliques)

| Page | Script | Poids |
| ---- | ------ | ----- |
| contact | `ContactForm.astro_...oXCsRGuz.js` | 1 756 o |
| reservation | `ReservationForm.astro_...B37nRKEX.js` | 4 504 o |
| les 2 | chunk partage `forms` (bundle B37nRKEX contenant forms.js) | 984 o |
| 14 autres pages | — | **0 o** |

Charge JS max : ~5.5 Ko sur reservation : conformite budget < 10 Ko.

### 2.3 Fonts (WARN majeur)

**BaseLayout.astro** charge Google Fonts CDN dans le `<head>` :
`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap`

- **Render-blocking** externe : la requete part avant le CSS local, depend de
  la latence Google (meme depuis la France : geostalite OK mais hors controle).
- **~170 Ko de woff2** (5 fichiers : Inter 400/500/600/700 + Playfair 700) —
  c'est le **principal poids tiers** du site (174 Ko vs 61 Ko d'assets locaux).
- **Privacy** : l'IP du visiteur est transmise a Google (sans cookie, mais
  mention « service tiers » requise dans la politique de confidentialite).
- **Incoherence :** `src/styles/fonts.css` declare des `@font-face` self-host
  (`/fonts/*.woff2`) et `scripts/fetch-fonts.mjs` existe (D-FE-07), mais
  **aucun `/fonts/` n'est present dans le dist** : le build utilise le CDN,
  pas le self-host.

**Recommandation (Phase 6, avant 1er client reel)** :
1. Basculer sur le **self-host** (fetch-fonts.mjs — deja prevu, budget 0 EUR,
   licence OFL) : 2 requetes de moins, zero dependance tierce, gestion cache
   immutable `_astro/`.
2. **Reduire les graisses** : Inter 400/600/700 suffisent pour le rendu
   (le 500 n'est utilise nulle part avec sa graisse — verifier design system) ;
   Playfair 700 plus `font-display: swap` (deja le cas : FOUT acceptable).
3. `preload` des 2 fichiers de fonts critiques (300 ms plus tot ~ au premier
   rendu) ou `font-display: optional` si le branding l'autorise.

### 2.4 Autres

- `favicon.svg` : 290 o.
- `robots.txt` 85 o, `sitemap.xml` 1 150 o.
- Theme : ~1.5 Ko de `<style>` inline dans le `<head>` (tokens dynamiques
  par client) — acceptable (critique au 1er rendu, evite un fetch).

## 3. Requetes & cache par page

| Page | Requetes statiques | Fonts CDN | Woff2 (1er rendu) | Total estime |
| ---- | ------------------ | --------- | ----------------- | ------------ |
| index | 2 CSS + 2 preconnect + theme inline | 1 (css2) | 2-4 (Inter latin, Playfair) | ~8 |
| contact | idem + 1 JS | 1 | 2-4 | ~9 |
| reservation | idem + 1 JS | 1 | 2-4 | ~9 |
| 404/500 | 1 CSS | 1 | 2 | ~4-5 |

- **Cache** : Cloudflare Pages sert les assets hashes `_astro/` avec
  `cache-control: immutable, max-age=31536000` et HTML revalide au max
  (`no-cache`) ; **a verifier avec `curl -I`** au deploiement (Phase 8) —
  checklist TODO_PRODUCTION.md.
- **Compression** : br/gzip automatique Cloudflare ; a verifier (`Accept-Encoding`).
- **Preconnect** `fonts.gstatic.com` : deja present — OK.

## 4. BUG transverse 404/500 — bundle CSS manquant

Constats statiques (confirmes par les deux audits) :

- `404.html` et `500.html` ne chargent **qu'un seul** bundle CSS
  (bmKD1etB.css, 15 072 o).
- Les classes `.ds-btn --primary --outline` et `.ds-header__cta` **appartiennent
  a l'autre bundle** (CPazk4Lc.css) qui n'est **pas** charge sur ces pages
  (0 occurrence `ds-btn` dans bmKD1etB.css).
- Resultat probable : **CTA/header et boutons d'action non stylises sur 404/500**
  (liens executeurs). La qualite visuelle et la coherence de marque en patissent
  (et le header CTA devient un lien invisible).

Hypothese : Astro a rejete les styles du CTA hors du chunk charge par les
pages d'erreur conditionnelles.

**Recommandation (Phase 6 — frontend-engineer)** :
- Inclure explicitement les styles partages (CTAs) dans les pages 404/500
  (import commun via `BaseLayout` — les 2 pages passent par `BaseLayout`),
  ou verifier le chunking avec Astro (`astro: assets`) ;
- Ajouter un **test de regression** : presence de `ds-btn` dans les 2 CSS
  charges par 404/500 dans la CI (grep sur le dist) ;
- QA : visualiser 404/500 au navigateur (rendu du header + boutons).

## 5. Images — regles pour le 1er client reel (PO-FE-03)

L'exemple ne contient aucune image (`hero_image` null, `gallery.images` vide) :
les composants sont deja conformes :

| Composant | Comportement | Verdict |
| --------- | ------------ | ------- |
| Hero.astro | `loading="eager"` + `fetchpriority="high"` + `width=1600 height=800` (anti-CLS) | PASS |
| Gallery.astro | `loading="lazy"` + `width=800 height=600` | PASS |
| Alt text | `alt` requis a la source (hero_image.alt, gallery.images[].alt) | PASS |

**Regles de production a appliquer chez le 1er client (a acter D-PERF-02)** :
- Generer 3 tailles (mobile 640w, tablette 1024w, desktop 1600w) en
  **WebP/AVIF** (90% de gain vs JPEG brut sur photos de restaurant) ;
- `srcset` + `sizes` (Hero ou `astro:assets` — note: sharp >= 0.35 requis,
  cf. SECURITY_AUDIT.md §1.1 : l'upgrade Astro corrige libvips) ;
- Plafond : hero <= 250 Ko (1600w), galerie <= 120 Ko/photo ;
- Ne jamais envoyer plus de 2 images LCP (hero seul),
  toutes les autres en lazy.

## 6. Estimation Core Web Vitals (statique, borne basse)

| Metrique | Estimation | Justification |
| -------- | ---------- | ------------- |
| LCP | **< 1.5 s** (4G) | LCP = titre hero (texte, sans image) : 1 HTML ~41 Ko + 2 CSS 19 Ko + font CSS + 2 woff2 critiques ; ~120 Ko transfere au 1er rendu |
| INP | **< 100 ms** | 0 JS sur la majorite des pages ; formulaires islandiques (~5 Ko) sans travail lourd |
| CLS | **< 0.02** | aucune image sans dimensions ; w/h explicites ; FOUT Playfair vs fallback (delta meta serif) = risque < 0.01 |

Confirmer au deploiement (Phase 8) : `npx lighthouse` sur l'URL publique
+ RUM optionnel (Search Console). Si le 1er client a de vraies photos :
reverifier LCP/CLS (risque principal = hero image).

## 7. Synthese & priorites

| # | Severite | Constat | Fichier(s) | Cible | Acteur |
| - | -------- | ------- | ---------- | ----- | ------ |
| 1 | **Majeur** | Fonts CDN render-blocking + /fonts/ absent du dist + Inter 500 non self-host | BaseLayout.astro, fonts.css, fetch-fonts.mjs | Phase 6 | frontend |
| 2 | **Majeur** | BUG 404/500 : bundle `ds-btn` non charge (boutons non stylises) | pages 404/500, chunking Astro | Phase 6 | frontend |
| 3 | Moyen | Verification headers cache/compression + Lighthouse au deploiement | TODO_PRODUCTION.md / CI | Phase 8 | DevOps |
| 4 | Moyen | Regles images production (srcset, AVIF, limites de poids) | generate-site.mjs + docs | Phase 6 | frontend (PO-FE-03) |
| 5 | Note | Zero JS par defaut : a conserver (ADR-001/008) — regress-testable en CI (grep dist : pages sans island n'ont aucun script) | CI | continu | QA |

## References

- `project/architecture/STACK.md` (ADR-001..008), `project/architecture/TECHNICAL_ARCHITECTURE.md`,
  `project/infrastructure/DEPLOYMENT.md`, `project/infrastructure/CI_CD.md`,
  `project/infrastructure/TODO_PRODUCTION.md`.
- Budgets : `project/DECISIONS.md` (D-PM-10 budgets), performances cibles
  Core Web Vitals.
- `scripts/fetch-fonts.mjs` (self-host fonts, licence OFL).
