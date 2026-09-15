# SEO_SYSTEM.md — Systeme SEO integre a tous les sites produits

Version : 0.1 (Phase 0 — Discovery)
Porteur : Content / SEO (AGENT 03)
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : REQUIREMENTS.md (FR-SEO-01 a 05), SITEMAP_MASTER.md (section 8),
TEMPLATE_VISION.md (ambiance visuelle par template), UX.md (navigation)

---

## 1. Principe

Le SEO local est une **fonctionnalite du produit**, pas une tache de fin de
projet. Chaque site produit embarque des la conception :

- donnees structurees (schema.org) ;
- metadata optimisees (title, description, canonical, OG) ;
- structure de contenus SEO-friendly (h1, hiérarchie, URLs lisibles) ;
- SEO local (Google Business, avis, carte, zone de chalandise) ;
- conformite technique (sitemap.xml, robots.txt, performance).

**Aucun contenu SEO n'est publie sans validation Noah** (FR-SEO-05).

---

## 2. SEO local

### 2.1 Google Business Profile

Chaque client doit posseder un profil Google Business. Le systeme :

1. **Identifie** si le client a un profil existant (champ `seo.google_business_id`).
2. **Fournit un guide** pour creer ou completer le profil si absent.
3. **Synchronise** les donnees du `client_data.yaml` avec le site (nom, adresse,
   telephone, horaires, categorie).

### 2.2 Coordonnees geographiques

Le systeme exige les coordonnees GPS (`contact.map.lat`, `contact.map.lng`)
pour chaque projet. Si manquantes :

1. Le systeme tente un geocodage depuis l'adresse fournie.
2. Si echec, le champ est signale comme REQUIS.
3. Les coordonnees sont utilisees pour :
   - le composant Map ;
   - les donnees structurees (GeoCoordinates) ;
   - la meta `geo.position` ;
   - le lien vers Google Maps / OpenStreetMap.

### 2.3 Zone de chalandise

Le champ `seo.zone` definit la zone geographique couverte. Il est utilise dans :

- les contenus texte ("a [Ville]", "dans le quartier de [Quartier]",
  "pres de [Quartier/Ville]").
- les meta descriptions (ancrage geographique).
- les donnees structurees (`areaServed`).

---

## 3. Donnees structurees (Schema.org)

### 3.1 Types par template

| Template | Schema.org principal | Schema.org secondaires |
| -------- | -------------------- | ---------------------- |
| Restaurant | `Restaurant` | `Menu`, `OpeningHoursSpecification`, `GeoCoordinates`, `AggregateRating`, `Review` |
| Artisan | `LocalBusiness` | `Service`, `GeoCoordinates`, `AggregateRating`, `Review` |
| Commerce | `LocalBusiness` | `Product`, `AggregateRating`, `Review` |
| Independant | `LocalBusiness` | `Service`, `Person`, `AggregateRating`, `Review` |
| Association | `NGO` | `Event`, `GeoCoordinates` |

### 3.2 Template JSON-LD — LocalBusiness (base commune)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Nom]",
  "description": "[Description]",
  "image": "[URL_logo_ou_hero]",
  "url": "[URL_du_site]",
  "telephone": "[Telephone_intl]",
  "email": "[Email]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Adresse_rue]",
    "addressLocality": "[Ville]",
    "postalCode": "[Code_postal]",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Lat]",
    "longitude": "[Lng]"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday"],
      "opens": "11:30",
      "closes": "14:30"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday"],
      "opens": "18:30",
      "closes": "23:00"
    }
  ],
  "priceRange": "[Fourchette de prix]",
  "areaServed": {
    "@type": "City",
    "name": "[Ville]"
  },
  "hasMap": "[URL_Google_Maps]",
  "sameAs": [
    "[URL_Facebook]",
    "[URL_Instagram]"
  ]
}
```

### 3.3 Template JSON-LD — Restaurant (extension)

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "[Nom]",
  "servesCuisine": "[Type_cuisine]",
  "menu": "[URL_page_menu]",
  "acceptsReservations": "true",
  "hasMenu": {
    "@type": "Menu",
    "name": "La Carte",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Plats",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "[Nom_plat]",
            "description": "[Description_plat]",
            "offers": {
              "@type": "Offer",
              "price": "[Prix]",
              "priceCurrency": "EUR"
            }
          }
        ]
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[Note_moyenne]",
    "reviewCount": "[Nombre_avis]",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

### 3.4 Template JSON-LD — AggregateRating + Review

```json
{
  "@type": "AggregateRating",
  "ratingValue": "4.8",
  "reviewCount": "127",
  "bestRating": "5",
  "worstRating": "1"
}
```

```json
{
  "@type": "Review",
  "author": {
    "@type": "Person",
    "name": "[Nom_client]"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "[Texte_avis]"
}
```

**Regle** : les avis (`Review`) ne sont integres que si reels et verifies.
Aucun avis fictif ne doit etre genere.

### 3.5 Template JSON-LD — OpeningHoursSpecification

```json
{
  "@type": "OpeningHoursSpecification",
  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  "opens": "09:00",
  "closes": "18:00"
}
```

**Mapping jours :**
| Jour FR | Schema.org |
| ------- | ---------- |
| Lundi | Monday |
| Mardi | Tuesday |
| Mercredi | Wednesday |
| Jeudi | Thursday |
| Vendredi | Friday |
| Samedi | Saturday |
| Dimanche | Sunday |

### 3.6 Template JSON-LD — FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question_1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Reponse_1]"
      }
    }
  ]
}
```

### 3.7 Template JSON-LD — BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "[URL_accueil]"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Nom_page]",
      "item": "[URL_page]"
    }
  ]
}
```

### 3.8 Template JSON-LD — ContactPoint

```json
{
  "@type": "ContactPoint",
  "contactType": "customer service",
  "telephone": "[Telephone_intl]",
  "email": "[Email]",
  "availableLanguage": ["French"]
}
```

---

## 4. Metadata par page

### 4.1 Pattern de title

| Page | Pattern | Exemple |
| ---- | ------- | ------- |
| Accueil | `[Nom] — [Activite] a [Ville]` | `Chez Marie — Restaurant lyonnais a Lyon` |
| Menu | `La carte — [Nom] | [Activite] a [Ville]` | `La carte — Chez Marie | Restaurant a Lyon` |
| Reservation | `Reservation — [Nom] | [Activite] a [Ville]` | `Reservation — Chez Marie | Restaurant a Lyon` |
| Contact | `Contact — [Nom] | [Activite] a [Ville]` | `Contact — Chez Marie | Restaurant a Lyon` |
| A propos | `A propos — [Nom] | [Activite] a [Ville]` | `A propos — Chez Marie | Restaurant a Lyon` |
| Realisations | `Nos realisations — [Nom] | [Activite] a Lyon` | — |
| Prestations | `Nos prestations — [Nom] | [Activite] a Lyon` | — |
| FAQ | `Questions frequentes — [Nom]` | — |
| Mentions legales | `Mentions legales — [Nom]` | — |
| Confidentialite | `Politique de confidentialite — [Nom]` | — |

**Regles :**
- Longueur max : 60 caracteres (title), sinon troncature avec `...`.
- Le nom du site est toujours present.
- La ville est incluse pour le SEO local.

### 4.2 Pattern de meta description

| Page | Pattern | Longueur |
| ---- | ------- | -------- |
| Accueil | `[Nom] — [Activite] a [Ville]. [Description_courte]. [CTA + ville]. [Horaires si pertinent].` | 120-160 car. |
| Menu | `Decouvrez la carte de [Nom] a [Ville]. [2-3 mots-cles plats].` | 120-160 car. |
| Reservation | `Reservez votre table chez [Nom] a [Ville]. [Nombre places max si pertinent].` | 120-160 car. |
| Contact | `Contactez [Nom] a [Ville]. [Telephone]. [Adresse]. [Horaires].` | 120-160 car. |

**Regles :**
- Inclure au moins 1 mot-cle principal + la ville.
- Terminer par un CTA implicite ou explicite.
- Pas de guillemets doubles (casse les SERPs).

### 4.3 Balise canonical

- Chaque page possede une balise `canonical` pointant vers l'URL officielle.
- Pas de slash final inutile (coherence).
- Format : `https://[domaine]/[chemin]`

### 4.4 Robots

| Page | Robots | Index |
| ---- | ------ | ----- |
| Toutes les pages | `index, follow` | Oui |
| 404 | `noindex` | Non |
| 500 | `noindex` | Non |
| Page en construction (503) | `noindex` | Non |
| Pages legales | `index, follow` | Oui (recherche juridique) |

---

## 5. Open Graph et Twitter Cards

### 5.1 Balises Open Graph

```html
<meta property="og:title" content="[Title_meme_que_balise_title]">
<meta property="og:description" content="[Meta_description]">
<meta property="og:image" content="[URL_image_hero_ou_logo_1200x630]">
<meta property="og:type" content="website">
<meta property="og:url" content="[URL_canonical]">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="[Nom]">
```

### 5.2 Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Title]">
<meta name="twitter:description" content="[Meta_description]">
<meta name="twitter:image" content="[URL_image_1200x630]">
```

### 5.3 Regles images OG

- Dimensions recommandees : **1200 x 630 px**.
- Format : JPG ou PNG.
- Poids max : 300 Ko.
- Pas de texte dans l'image (accessibilite).
- Fallback : logo du client si pas d'image hero disponible.

---

## 6. Structure de contenu SEO

### 6.1 Hiérarchie de titres

| Element | HTML | Regles |
| ------- | ---- | ------ |
| Titre principal de page | `<h1>` | **Un seul par page**. Decrit le contenu principal. Inclut la ville si pertinent. |
| Section principale | `<h2>` | 2-5 par page. Decrit une section. |
| Sous-section | `<h3>` | Sous-categories, details. |
| Sous-sous-section | `<h4>` | Rarement utilise. |

**Pas de saut de niveaux** : H1 -> H3 est interdit (WCAG + SEO).

### 6.2 URLs lisibles

| Règle | Exemple bon | Exemple mauvais |
| ----- | ----------- | ----------------- |
| Minuscules, sans accents | `/a-propos` | `/A-Propos` ou `/a_propos` |
| Mots tires-bas | `/demande-de-devis` | `/demandeDeDevis` |
| Pas de parametres inutiles | `/menu` | `/page?id=3` |
| Hierarchie logique | `/realisations/projet-1` | `/projets?cat=realisations` |
| Pas de mots vides | `/menu` | `/notre-menu` |

### 6.3 Maillage interne

- Chaque page lie vers les pages les plus importantes.
- Le footer contient les liens vers toutes les pages.
- Le breadcrumb (BreadcrumbList) aide la navigation et le SEO.
- Les CTA pointent vers les pages d'action (reservation, contact, devis).
- **Textes de liens descriptifs** : "Voir le menu" (pas "Cliquez ici").

### 6.4 sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://[domaine]/</loc>
    <lastmod>[date_derniere_modification]</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://[domaine]/menu</loc>
    <lastmod>[date]</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Regles :**
- Inclure toutes les pages indexables.
- Exclure 404, 500, pages en construction.
- `changefreq` : `weekly` (accueil), `monthly` (contenu), `yearly` (legales).
- `priority` : `1.0` (accueil), `0.8` (pages importantes), `0.5` (secondaires), `0.3` (legales).
- Date de derniere modification reelle (pas de date future).

### 6.5 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /*.json$

Sitemap: https://[domaine]/sitemap.xml
```

---

## 7. FAQ SEO

### 7.1 Principe

Chaque site produit inclut une section FAQ (composant `FAQ`) sur l'accueil
et/ou une page dediee. La FAQ est :

- generee a partir du template de FAQ secteur (CONTENT_LIBRARY.md) ;
- personnalisee avec les donnees client ;
- structuree en `FAQPage` schema.org ;
- presentee en accordion (UX.md section 4.9).

### 7.2 Implementation

- L'accueil contient les 4-6 questions les plus courantes.
- Une page `/faq` peut etre ajoutee si > 8 questions.
- Chaque question est unique, concise, et repondue en 2-3 phrases.
- Les questions incluent la ville/quartier si pertinent ("Est-ce que vous livrez a [Quartier] ?").

---

## 8. Avis clients — Integration SEO

### 8.1 Source des avis

| Source | Method | Consentement |
| ------ | ------ | ------------ |
| Google Business | Extraction manuelle ou API (si disponible) | Non necessaire (donnees publiques) |
| TripAdvisor | Extraction manuelle | Non necessaire |
| Facebook | Extraction manuelle | Non necessaire |
| Temoignages custom | Saisie par Noah | Non necessaire (nom + texte) |

### 8.2 Regles

- **Avis reels uniquement** : jamais de fabrication automatique.
- **Attribution** : nom ou prenom + source (Google, TripAdvisor).
- **Notes** : note moyenne et nombre d'avis dans `AggregateRating`.
- **Presentation** : composant `Testimonials` du design system.
- **Pas d'iframe Google Reviews** (cookies + dependance externe).

---

## 9. Multilingue (si activee)

### 9.1 hreflang

```html
<link rel="alternate" hreflang="fr" href="https://[domaine]/[page]">
<link rel="alternate" hreflang="en" href="https://[domaine]/en/[page]">
<link rel="alternate" hreflang="x-default" href="https://[domaine]/[page]">
```

### 9.2 Regles

- La page FR est toujours la page canonique.
- La version EN est une traduction reduite (pages cles : accueil, contact).
- Le `x-default` pointe vers la version FR.
- Le selecteur de langue est dans le header (UX.md section 2.1).

---

## 10. Performance SEO

### 10.1 Core Web Vitals

| Metrique | Cible | Impact SEO |
| -------- | ----- |----------- |
| LCP (Largest Contentful Paint) | < 2,5 s | Direct — facteur de classement |
| CLS (Cumulative Layout Shift) | < 0,1 | Direct — stabilite visuelle |
| INP (Interaction to Next Paint) | < 200 ms | Direct — interactivite |

### 10.2 Bonnes pratiques

- Images optimisees (WebP, lazy loading, dimensions declarees).
- Fonts optimisees (preconnect, subset, `font-display: swap`).
- CSS minimal (pas de framework lourd).
- JS minimal (pas de jQuery, vanilla ou framework leger).
- HTTPS par defaut.
- Header `Cache-Control` sur les assets statiques.

---

## 11. Dependances

- **UX Designer** : sitemap parametrable (SITEMAP_MASTER.md section 8),
  composants Map et Testimonials, schema de pages.
- **Solution Architect** : implementation sitemap.xml, robots.txt, performance,
  choix map provider (impact cookies).
- **Frontend Engine** : integration des donnees structurees dans le HTML,
  generation des balises meta, Open Graph, hreflang.
- **Legal / Compliance** : mentions legales indexables, conformite RGPD
  (pas de tracking sans consentement).
- **Security Engineer** : evaluation cookies map provider, impact Google Analytics.
- **Noah (Gate 1/2)** : validation des patterns de metadata, des contenus SEO,
  des avis.

---

## 12. Points ouverts (Noah a arbitrer)

1. **Map provider** : OpenStreetMap (pas de cookie, gratuit) ou Google Maps
   (cookie requis, populaire) ? Decision technique avec solution-architect.
2. **Google Analytics** : integrer par defaut (necessite consentement) ou
   optionnel ? Si oui, laquelle (GA4, plausible, umami) ?
3. **Avis Google Reviews** : iframe (cookies, dependance) ou extraction
   statique (recommande) ?
4. **Blog** : hors perimetre v1. Si active plus tard : statique (11ty, hugo)
   ou integre ?
5. **Schema.org dynamique** : le JSON-LD est-il genere statiquement (build)
   ou dynamiquement (SSR) ? Depend de la stack.
6. **Multilingue** : pages EN en v1 ou reporte au premier client ?
7. **Keywords research** : outil gratuit recommande pour la recherche de
   mots-cles locaux ? (Google Keyword Planner, Ubersuggest, AnswerThePublic)
