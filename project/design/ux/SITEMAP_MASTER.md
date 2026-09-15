# SITEMAP_MASTER.md — Architecture d'information parametrable

Version : 0.1 (Phase 0 — Discovery)
Porteur : UX Designer
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : USER_STORIES.md (parcours A/B/C), REQUIREMENTS.md (FR-BASE, FR-FORM, FR-SEO, FR-LEGAL)

---

## 1. Principe

Le sitemap n'est **pas fige**. Il est **modulaire et parametrable** :

- **Pages communes** : presentes sur TOUS les templates (vitrine de base).
- **Pages specifiques** : activees selon le template secteur et les packages.
- **Pages conditionnelles** : dependantes des options choisies (reservation, e-commerce leger, multilingue).

Chaque page est un **slot** qui peut etre active/inactive, et chaque slot contient des **sections composable** (composants du design system).

---

## 2. Pages communes (tous templates)

Ces pages sont le **socle minimum** de tout site produit.

| Page | Route | Description | Stories couvertes |
| ---- | ----- | ----------- | ----------------- |
| **Accueil** | `/` | Hero + presentation + offre + CTA + avis + FAQ abregee + map | US-V-01, US-V-02, US-V-05, US-V-09 |
| **A propos** | `/a-propos` | Histoire, equipe, valeurs, engage | US-V-01 |
| **Contact** | `/contact` | Formulaire + coordonnees + map + horaires | US-V-02, US-V-03 |
| **Mentions legales** | `/mentions-legales` | Responsable, hebergeur, SIRET, hébergeur | US-V-07 |
| **Politique de confidentialite** | `/confidentialite` | Donnees collectees, finalite, droits, cookies | US-V-07, US-V-08 |
| **Plan du site** | `/plan-du-site` | Liste de toutes les pages (SEO + accessibilite) | — |

---

## 3. Pages specifiques par template

### 3.1 Restaurant (template flagship)

| Page | Route | Package requis | Description | Stories |
| ---- | ----- | -------------- | ----------- | ------- |
| **Le Menu** | `/menu` | Tous | Carte / formules / boissons / desserts, photos, prix | US-V-05 |
| **Reservation** | `/reservation` | Vitrine+Reservation | Formulaire date/nombre/personnes/creneau + confirmation | US-V-04 |
| **La Carte des vins** | `/vins` | Optionnel | Liste des references (configurable : section du menu ou page dediee) | US-V-05 |
| **Galerie** | `/galerie` | Tous | Photos du restaurant, plats, salle, terrasse | US-V-05 |
| **Evenements / Traiteur** | `/evenements` | Optionnel | Evenements prives, traiteur, fetes | US-V-05 |

### 3.2 Artisan

| Page | Route | Package requis | Description | Stories |
| ---- | ----- | -------------- | ----------- | ------- |
| **Realisations** | `/realisations` | Tous | Portfolio de travaux, avant/apres, detail par projet | US-V-05 |
| **Demande de devis** | `/devis` | Tous | Formulaire detaille (type de travaux, surface, delai) + confirmation | US-V-03 |
| **Services** | `/services` | Tous | Liste des metiers/prestations proposees | US-V-05 |
| **Galerie** | `/galerie` | Optionnel | Photos chantiers, finitions | US-V-05 |

### 3.3 Commerce

| Page | Route | Package requis | Description | Stories |
| ---- | ----- | -------------- | ----------- | ------- |
| **Boutique / Catalogue** | `/catalogue` | Tous | Produits/Services proposes, categories, prix | US-V-05 |
| **Promotions** | `/promotions` | Optionnel | Offres en cours, bons plans | US-V-05 |
| **Marques** | `/marques` | Optionnel | Marques distribuees | US-V-05 |
| **Galerie** | `/galerie` | Optionnel | Photos du magasin, produits | US-V-05 |

### 3.4 Independant / Profession liberale

| Page | Route | Package requis | Description | Stories |
| ---- | ----- | -------------- | ----------- | ------- |
| **Prestations** | `/prestations` | Tous | Services proposes, tarifs indicatifs, durees | US-V-05 |
| **Prise de RDV** | `/rdv` | Vitrine+Reservation | Formulaire date/heure/motif + confirmation | US-V-04 |
| **Blog / Conseils** | `/blog` | Optionnel (futur) | Articles, conseils, actualites | US-V-05 |
| **Galerie** | `/galerie` | Optionnel | Realisations, bureau, equipements | US-V-05 |

### 3.5 Association

| Page | Route | Package requis | Description | Stories |
| ---- | ----- | -------------- | ----------- | ------- |
| **Nos actions** | `/actions` | Tous | Projets, evenements, missions | US-V-05 |
| **Adhesion** | `/adhesion` | Tous | Formulaire d'inscription + informations | US-V-03 |
| **Evenements** | `/evenements` | Tous | Calendrier, inscriptions | US-V-05 |
| **Galerie** | `/galerie` | Optionnel | Photos d'evenements | US-V-05 |
| **Donation** | `/donation` | Optionnel (futur) | Lien vers plateforme de don existante | US-V-05 |

---

## 4. Pages conditionnelles (options)

| Page | Condition | Description |
| ---- | --------- | ----------- |
| **Version EN** | Option multilingue activee | `/en/home`, `/en/about`, etc. — pages cles uniquement |
| **E-commerce leger** | Package 3 | Lien vers solution externe (bon cadeau, produit simple) — jamais de dev sur mesure |
| **Espace presse** | Optionnel | `/presse` — pour les clients avec communique |

---

## 5. Structure d'une page (modele de contenu)

Chaque page suit un **modele de contenu**Compose de sections empilables :

```
PAGE
├── Header (commun, sticky)
├── Hero / Titre de page
├── Section 1 : Contenu principal
├── Section 2 : Details / Presentation
├── Section 3 : Preuve sociale (avis, galerie)
├── Section 4 : CTA / Action
├── Section 5 : Informations pratiques (si pertinent)
├── Section 6 : FAQ
└── Footer (commun)
```

**Slots de sections disponibles** (composants du design system) :

| Slot | Composants possibles | Obligatoire |
| ---- | -------------------- | ----------- |
| Hero | Hero (image + texte + CTA) | OUI |
| Contenu | Texte, Liste, Image+texte, Video embed | OUI |
| Preuve sociale | Testimonials, Galerie, Avis, Logos | NON |
| CTA | CTA banner, Bouton email/tel | OUI |
| Infos pratiques | OpeningHours, Map, ContactCard | Selon page |
| FAQ | FAQ accordion | NON |
| Form | ContactForm, ReservationForm, DevisForm | Selon page |

---

## 6. Navigation et architecture de l'information

### 6.1 Header (navigation principale)

```
[Logo]                    [Accueil] [Menu] [Reservation] [Contact]    [CTA: "Reserver"]
                                                  Burger (mobile)
```

- **Max 5-6 items** de navigation (règle des 7 +/- 2).
- Le CTA principal est toujours visible (desktop : bouton ; mobile : dans le burger ou sticky bottom).
- **Persistance langue** : si multilingue, selecteur dans le header (drapeau ou texte FR/EN).

### 6.2 Footer (navigation secondaire)

```
[Logo] [Adresse] [Telephone] [Email]
[Horaires]
[Reseaux sociaux]
[Mentions legales] [Confidentialite] [Plan du site]
```

- Liens legaux **obligatoires** (US-V-07).
- Coordonnees **cliquables** (tel : lien tel:, email : lien mailto:).
- Reseaux sociaux : icones seulement (pas de tracking sans consentement).

### 6.3 Breadcrumb (fil d'Ariane)

- Present sur toutes les pages sauf l'accueil.
- Structure : `Accueil > Nom de la page`.
- Donnees structurees : BreadcrumbList schema.org.

---

## 7. Hiérarchie d'URL

```
/
├── /a-propos
├── /menu                    (restaurant)
├── /reservation             (restaurant, package 2+)
├── /vins                    (restaurant, optionnel)
├── /galerie
├── /evenements              (restaurant, optionnel)
├── /realisations            (artisan)
├── /devis                   (artisan)
├── /services                (artisan, commerce, independant)
├── /catalogue               (commerce)
├── /promotions              (commerce, optionnel)
├── /marques                 (commerce, optionnel)
├── /prestations             (independant)
├── /rdv                     (independant, package 2+)
├── /blog                    (optionnel, futur)
├── /actions                 (association)
├── /adhesion                (association)
├── /donation                (association, optionnel)
├── /contact
├── /mentions-legales
├── /confidentialite
├── /plan-du-site
└── /en/...                  (multilingue, optionnel)
```

---

## 8. SEO et donnees structurees par page

| Page | Schema.org recommande | Metadata specifiques |
| ---- | --------------------- | --------------------- |
| Accueil | LocalBusiness (+ type specifique) | title: "[Nom] — [Activite] a [Ville]" |
| Menu | Menu / MenuSection | title: "Notre carte — [Nom]" |
| Reservation | ReserveAction | title: "Reservation — [Nom]" |
| Contact | LocalBusiness + ContactPoint | title: "Contact — [Nom]" |
| A propos | Organization / Person | — |
| Realisations | CreativeWork | — |
| FAQ | FAQPage | — |
| Toutes les pages | BreadcrumbList | canonical, robots, OG image |

---

## 9. Regles de personnalisation par template

| Parametre | Template restaurant | Template artisan | Template commerce | Template independant | Template association |
| --------- | ------------------- | ---------------- | ----------------- | -------------------- | -------------------- |
| Hero image | Plats / salle | Realisations | Boutique / produits | Portrait / bureau | Evenements |
| CTA principal | "Reserver" | "Demander un devis" | "Decouvrir nos produits" | "Prendre RDV" | "Nous rejoindre" |
| CTA secondaire | "Voir le menu" | "Voir nos realisations" | "Voir les promos" | "Voir les prestations" | "Voir nos actions" |
| Section hero activite | "Restaurant" | "Artisan [metier]" | "Commerce" | "[Profession]" | "Association" |
| Pages specifiques | Menu, Reservation, Vins | Realisations, Devis | Catalogue, Promos | Prestations, RDV | Actions, Adhesion |
| Horaires | Obligatoires | Recommandees | Obligatoires | Optionnelles | Selon activite |
| Map | Obligatoire | Obligatoire | Obligatoire | Recommandee | Recommandee |
| Avis clients | Fortement recommande | Recommande | Fortement recommande | Recommande | Selon activite |

---

## 10. Dependances

- **content-seo** : contenus des pages (textes, photos, metadata), SEO local, donnees structurees.
- **solution-architect** : faisabilite technique des routes, des formulaires, du multilingue.
- **frontend-engineer** : implementation des routes, du routing, du layout par page.
- **legal-compliance** : contenu des mentions legales et de la politique de confidentialite.
- **Noah (Gate 1/2)** : validation du sitemap et des pages specifiques par template.

---

## 11. Points ouverts (Gate 2)

1. **Nombre max de pages** : quel est le plafond raisonnable par package ? (ex: Vitrine = 5-7 pages, Vitrine+Reservation = 7-9 pages).
2. **Pages optionnelles** : lesquelles sont incluses dans chaque package ou en surcout ?
3. **Blog** : souhaite-t-on l'activer des la v1 pour un type de template (association, independant) ?
4. **E-commerce leger** : quelle page dedicate ? Simple lien externe ou catalogue with redirection ?
5. **Multilingue** : quelles pages en v1 ? (Accueil + Contact minimum ?)
