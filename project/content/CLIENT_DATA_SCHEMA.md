# CLIENT_DATA_SCHEMA.md — Fichier de donnees client structure

Version : 0.1 (Phase 0 — Discovery)
Porteur : Content / SEO (AGENT 03)
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : Cahier des charges section 11, REQUIREMENTS.md (FR-DATA-01 a 03),
UX.md (parcours A etape 1), SITEMAP_MASTER.md, DESIGN_SYSTEM_SPECS.md

---

## 1. Principe

Chaque projet client demarre par un **fichier YAML unique** : `client_data.yaml`.
Ce fichier est la **source unique** de toutes les donnees affichees sur le site
(textes, coordonnees, horaires, avis, services, legal). Il alimente directement
les composants du design system via des placeholders.

**Regle fondamentale (cahier des charges section 11) :**
L'IA ne doit **jamais inventer** les donnees du client. Toute information
manquante est identifiee et demandee. Les champs marques `REQUIRED` bloquent
la generation du site s'ils sont vides.

---

## 2. Structure du fichier `client_data.yaml`

```yaml
# =============================================================
# FICHIER DE DONNEES CLIENT STRUCTURE
# Fichier : client_data.yaml
# Projet : [nom-du-projet]
# Date creation : [YYYY-MM-DD]
# Derniere mise a jour : [YYYY-MM-DD]
# =============================================================

# -------------------------------------------------------
# SECTION 1 : BUSINESS — Identite de l'activite
# -------------------------------------------------------
business:
  name: ""                    # REQUIRED — Nom commercial / enseigne
  description: ""             # REQUIRED — Description courte (1-2 phrases, <= 160 car.)
  long_description: ""        # SHOULD — Description longue pour la page A propos
  category: ""                # REQUIRED — restaurant | artisan | commerce | independant | association
  slogan: ""                  # COULD — Slogan ou accroche (<= 60 car.)

# -------------------------------------------------------
# SECTION 2 : BRANDING — Identite visuelle
# -------------------------------------------------------
branding:
  primary_color: ""           # REQUIRED — Couleur primaire (hex, ex: #B91C1C)
  secondary_color: ""         # REQUIRED — Couleur secondaire (hex)
  accent_color: ""            # COULD — Couleur d'accent CTA (hex)
  fonts:
    heading: ""               # REQUIRED — Police de titres (defaut template)
    body: ""                  # REQUIRED — Police de corps (defaut template)
  logo: ""                    # SHOULD — Chemin vers le logo (image)
  favicon: ""                 # SHOULD — Chemin vers le favicon

# -------------------------------------------------------
# SECTION 3 : OPENING_HOURS — Horaires d'ouverture
# -------------------------------------------------------
opening_hours:
  enabled: true               # REQUIRED (restaurant, commerce) / SHOULD (artisan) / COULD (independant, association)
  display_status: true        # Afficher l'indicateur Ouvert/Ferme en temps reel
  schedule:                   # REQUIRED si enabled = true
    - day: "Lundi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Mardi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Mardi"
      open: "18:30"
      close: "23:00"
      closed: false
    - day: "Mercredi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Mercredi"
      open: "18:30"
      close: "23:00"
      closed: false
    - day: "Jeudi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Jeudi"
      open: "18:30"
      close: "23:00"
      closed: false
    - day: "Vendredi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Vendredi"
      open: "18:30"
      close: "23:30"
      closed: false
    - day: "Samedi"
      open: "11:30"
      close: "14:30"
      closed: false
    - day: "Samedi"
      open: "18:30"
      close: "23:30"
      closed: false
    - day: "Dimanche"
      closed: true
  closed_periods:             # COULD — Fermetures exceptionnelles (conges, fetes)
    - start: "2026-08-01"
      end: "2026-08-15"
      reason: "Fermeture annuelle"
  special_hours: []           # COULD — Horaires speciaux (jours feries, etc.)

# -------------------------------------------------------
# SECTION 4 : SOCIALS — Reseaux sociaux
# -------------------------------------------------------
socials:
  facebook: ""                # COULD — URL complete (ex: https://facebook.com/nom)
  instagram: ""               # COULD — URL complete
  tripadvisor: ""             # COULD (restaurant) — URL complete
  google_business: ""         # SHOULD — URL Google Business Profile
  tiktok: ""                  # COULD — URL complete
  linkedin: ""                # COULD — URL complete
  youtube: ""                 # COULD — URL complete
  whatsapp: ""                # COULD — Numero de telephone WhatsApp (format intl)

# -------------------------------------------------------
# SECTION 5 : SEO — Referencement local
# -------------------------------------------------------
seo:
  city: ""                    # REQUIRED — Ville principale (defaut: Lyon)
  district: ""                # SHOULD — Quartier / arrondissement
  region: "Auvergne-Rhone-Alpes"  # Defaut
  country: "FR"               # Defaut
  zone: ""                    # SHOULD — Zone de chalandise (ex: "Lyon 3e, Villeurbanne, Caluire")
  meta_description: ""        # REQUIRED — Meta description (< 160 car.)
  keywords: []                # SHOULD — Mots-cles principaux (5-10)
  google_business_id: ""      # COULD — ID du profil Google Business

# -------------------------------------------------------
# SECTION 6 : SERVICES — Prestations / produits proposes
# -------------------------------------------------------
services:                     # REQUIRED — au moins 1 service
  - name: ""                  # REQUIRED — Nom du service
    description: ""           # SHOULD — Description courte
    price: ""                 # COULD — Prix indicatif (ex: "A partir de 45 EUR" ou "Gratuit")
    duration: ""              # COULD — Duree (ex: "1h30")
    category: ""              # COULD — Categorie (ex: "Plat principal")
    featured: false           # Mettre en avant sur l'accueil

# -------------------------------------------------------
# SECTION 7 : CONTACT — Coordonnees
# -------------------------------------------------------
contact:
  address:
    street: ""                # REQUIRED — Adresse complete
    city: ""                  # REQUIRED — Ville
    postal_code: ""           # REQUIRED — Code postal
    full: ""                  # Genere automatiquement si non fourni
  phone: ""                   # REQUIRED — Telephone (format: 04 XX XX XX XX)
  phone_intl: ""              # Genere: +33 4 XX XX XX XX (lien tel:)
  email: ""                   # REQUIRED — Email de contact
  website: ""                 # COULD — Site web actuel si migration
  map:
    lat: ""                   # REQUIRED — Latitude Google Maps
    lng: ""                   # REQUIRED — Longitude Google Maps
    zoom: 15                  # Defaut

# -------------------------------------------------------
# SECTION 8 : LEGAL — Mentions legales et conformite
# -------------------------------------------------------
legal:
  legal_name: ""              # REQUIRED — Raison sociale / nom du responsable
  legal_form: ""              # REQUIRED — Forme juridique (EI, SARL, SAS, etc.)
  siren: ""                   # REQUIRED — Numero SIREN (9 chiffres)
  siret: ""                   # REQUIRED — Numero SIRET (14 chiffres)
  capital: ""                 # SHOULD — Capital social (si applicable)
  phone_pro: ""               # REQUIRED — Telephone professionnel
  email_pro: ""               # REQUIRED — Email professionnel (pour mentions legales)
  host_name: ""               # REQUIRED — Nom de l'hebergeur
  host_address: ""            # REQUIRED — Adresse de l'hebergeur
  mediator_name: ""           # SHOULD (B2C) — Nom du mediateur
  mediator_address: ""        # SHOULD (B2C) — Adresse du mediateur
  director: ""                # SHOULD — Nom du directeur de la publication
  registration_number: ""     # SHOULD — Numero d'immatriculation (RCS/Registre metier)

# -------------------------------------------------------
# SECTION 9 : REVIEWS — Avis clients
# -------------------------------------------------------
reviews:
  enabled: false              # Activer l'affichage des avis
  source: ""                  # google | tripadvisor | facebook | custom
  min_count: 3                # Nombre minimum d'avis a afficher
  items: []                   # Liste des avis (si source = custom)

# -------------------------------------------------------
# SECTION 10 : MENU — Donnees du menu (restaurant uniquement)
# -------------------------------------------------------
menu:
  enabled: false              # Activable uniquement si category = restaurant
  categories:                 # REQUIRED si enabled = true
    - name: "Entrees"
      items:
        - name: ""
          description: ""
          price: ""
          photo: ""
    - name: "Plats"
      items: []
    - name: "Desserts"
      items: []
    - name: "Boissons"
      items: []

# -------------------------------------------------------
# SECTION 11 : RESERVATION — Configuration reservation
# -------------------------------------------------------
reservation:
  enabled: false              # Activable avec package 2+
  method: "form"              # form | external_link | phone_only
  max_party_size: 8
  slots: []                   # Creneaux disponibles (si gere localement)
  confirmation_message: ""    # Message personnalise apres reservation

# -------------------------------------------------------
# SECTION 12 : TEMPLATE — Configuration du template
# -------------------------------------------------------
template:
  type: ""                    # REQUIRED — restaurant | artisan | commerce | independant | association
  package: "vitrine"          # REQUIRED — vitrine | vitrine_reservation | vitrine_ecommerce
  multilingual: false         # COULD — Activer la version EN

# -------------------------------------------------------
# SECTION 13 : MAINTENANCE — Suivi post-livraison
# -------------------------------------------------------
maintenance:
  plan_active: false          # Actif apres validation du MAINTENANCE_PLAN
  start_date: ""              # Date de debut
  frequency: ""               # mensuel | bimensuel | trimestriel
  last_audit: ""              # Dernier audit
```

---

## 3. Types de champs et validation

### 3.1 Niveaux d'obligation

| Niveau | Definition | Comportement si vide |
| ------ | ---------- | -------------------- |
| **REQUIRED** | Indispensable au fonctionnement du site | **Bloque** la generation du site. Le champ est liste dans le rapport de champs manquants. |
| **SHOULD** | Fortement recommande, ameliore la qualite | **Alerte** dans le rapport. Le site fonctionne sans, mais la qualite est reduite. |
| **COULD** | Optionnel, benefique si present | **Information** dans le rapport. Le site fonctionne sans. |

### 3.2 Regles de validation

| Champ | Format | Regex / Regle |
| ----- | ------ | -------------- |
| `business.name` | Texte, 2-80 car. | `^[A-Za-z0-9À-ÿ\s\-'\.]+$` |
| `business.category` | Enum | `restaurant\|artisan\|commerce\|independant\|association` |
| `branding.primary_color` | Hex | `^#[0-9A-Fa-f]{6}$` |
| `branding.fonts.heading` | Police Google Fonts | Doit exister dans Google Fonts |
| `contact.phone` | Telephone FR | `^0[1-9]([ .-]?\d{2}){4}$` |
| `contact.email` | Email | `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| `contact.map.lat` | Latitude | `-90` a `90` |
| `contact.map.lng` | Longitude | `-180` a `180` |
| `legal.siren` | 9 chiffres | `^\d{9}$` |
| `legal.siret` | 14 chiffres | `^\d{14}$` |
| `seo.meta_description` | Texte, 120-160 car. | `^.{120,160}$` |
| `opening_hours.schedule[].day` | Jour | `Lundi\|Mardi\|Mercredi\|Jeudi\|Vendredi\|Samedi\|Dimanche` |
| `opening_hours.schedule[].open` | Heure HH:MM | `^([01]\d|2[0-3]):[0-5]\d$` |
| `services[].name` | Texte, 2-60 car. | Non vide |

---

## 4. Detection automatique des champs manquants

### 4.1 Processus

```
client_data.yaml soumis
    │
    ▼
[1] Validation structurelle
    │   Chaque champ REQUIRED verifie
    │   Chaque format valide (regex)
    │
    ▼
[2] Validation contextuelle
    │   Si category = restaurant → menu.REQUIRED + opening_hours.REQUIRED
    │   Si package = vitrine_reservation → reservation.REQUIRED
    │   Si B2C → legal.mediator.REQUIRED
    │   Si reviews.enabled = true → reviews.items (min_count)
    │
    ▼
[3] Rapport de champs manquants
    │
    │   CHAMPS BLOQUANTS (REQUIRED) :
    │   - business.name : manquant
    │   - contact.phone : manquant
    │   ...
    │
    │   CHAMPS RECOMMANDES (SHOULD) :
    │   - legal.mediator_name : manquant (B2C)
    │   ...
    │
    │   CHAMPS OPTIONNELS (COULD) :
    │   - socials.instagram : manquant
    │   ...
    │
    ▼
[4] Site non genere tant que les champs REQUIRED sont absents
```

### 4.2 Exemple de rapport

```markdown
# Rapport de validation — client_data.yaml
# Projet : restaurant-chez-marie
# Date : 2026-09-15

## RESULTAT : EN ATTENTE DE DONNEES

### Champs bloquants (3)
| Champ | Valeur actuelle | Action requise |
| ----- | --------------- | -------------- |
| business.name | (vide) | Fournir le nom commercial |
| contact.phone | (vide) | Fournir le telephone |
| legal.siren | (vide) | Fournir le numero SIREN |

### Champs recommandes (5)
| Champ | Valeur actuelle | Action |
| ----- | --------------- | ------ |
| seo.meta_description | (vide) | Rediger une description 120-160 car. |
| socials.google_business | (vide) | Fournir l'URL Google Business |
| opening_hours.schedule | (vide) | Remplir les horaires |
| menu.categories | (vide) | Remplir le menu |
| reviews.items | (vide) | Fournir au moins 3 avis |

### Champs optionnels (4)
| Champ | Valeur actuelle |
| ----- | --------------- |
| socials.instagram | (vide) |
| socials.tripadvisor | (vide) |
| business.slogan | (vide) |
| maintenance.start_date | (vide) |

## PROCHAINE ETAPE
Remplir les champs bloquants puis relancer la validation.
```

---

## 5. Processus de remplissage par Noah

### 5.1 Depuis le brief client

1. Noah recueille les informations lors du rendez-vous discovery.
2. Noah remplit le fichier `client_data.yaml` (ou un agent prepare un brouillon).
3. Le systeme valide le fichier et retourne le rapport.
4. Noah complete les champs manquants avec le client.
5. Le fichier valide est commite dans le dossier du projet.

### 5.2 Depuis une source existante

Si le client possede deja un site, une fiche Google Business ou des documents :
- Extraction automatique des donnees (adresse, telephone, horaires, description).
- Les donnees extraites sont placees dans le fichier YAML en brouillon.
- Noah valide chaque donnee extraite avant utilisation.

### 5.3 Mise a jour

Le fichier peut etre mis a jour a tout moment (horaires de vacances, nouveau
service, changement de telephone). Le systeme regenere les pages concernees.

---

## 6. Placeholders — Mapping avec les composants

Chaque champ du fichier de donnees alimente des placeholders dans les templates.
Le mapping est defini par template (voir CONTENT_LIBRARY.md).

| Placeholder | Source YAML | Usage |
| ----------- | ----------- | ----- |
| `[Nom]` | `business.name` | Titres, mentions, meta |
| `[Activite]` | `business.category` | Descriptions, SEO |
| `[Ville]` | `seo.city` | SEO local, contenus |
| `[Description]` | `business.description` | Hero, meta, presentations |
| `[Adresse]` | `contact.address.full` | Footer, contact, SEO |
| `[Telephone]` | `contact.phone_intl` | Contact, CTA tel |
| `[Email]` | `contact.email` | Contact, footer |
| `[Horaires]` | `opening_hours.schedule` | Footer, contact, SEO |
| `[Logo]` | `branding.logo` | Header, footer |
| `[CouleurPrimaire]` | `branding.primary_color` | Tokens CSS |
| `[PoliceTitre]` | `branding.fonts.heading` | Tokens CSS |
| `[Services]` | `services[]` | Pages services, accueil |
| `[Menu]` | `menu.categories[]` | Page menu (restaurant) |
| `[Avis]` | `reviews.items[]` | Section temoignages |
| `[CoordonneesMap]` | `contact.map.lat/lng` | Composant Map |
| `[ReseauxSociaux]` | `socials.*` | Footer, SocialLinks |

---

## 7. Dependances

- **UX Designer** : nomenclature des sections, design system tokens (polices,
  couleurs) — le schema de branding doit etre coherent avec DESIGN_SYSTEM_SPECS.md
  section 7 (fichier de configuration client).
- **PM** : client_data.yaml est le point d'entree de US-N-01 (demarrer un projet
  proprement). Coherence avec BUSINESS_PROCESS.md.
- **Legal / Compliance** : champs legal (SIRET, hebergeur, mediateur) — ne jamais
  inventer, toujours demander au client.
- **Solution Architect** : faisabilite technique des placeholders et de la
  generation automatique de contenu.
- **Frontend Engineer** : implementation du mapping placeholders -> composants.

---

## 8. Points ouverts (Noah a arbitrer)

1. **Champs additionnels** : faut-il ajouter des champs pour des besoins futurs
   (blog, e-commerce leger, newsletter) ?
2. **Format YAML ou JSON** : YAML recommande (lisible, comments). Confirmer ?
3. **Fichier unique ou separes** : un seul `client_data.yaml` ou un fichier par
   section (business.yaml, seo.yaml, etc.) ?
4. **Import depuis Google Business** : outil d'extraction automatique prioritaire ?
5. **Multilingual** : faut-il prevoir des champs bilingues (nom_FR, nom_EN) dans
   le schema ?
6. **Versioning** : historique des modifications du fichier client — necessaire
   pour la maintenance ?
