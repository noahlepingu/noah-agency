# TEMPLATE_VISION.md — Vision UX par template secteur

Version : 0.1 (Phase 0 — Discovery)
Porteur : UX Designer
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : SITEMAP_MASTER.md, UX.md, DESIGN_SYSTEM_SPECS.md, USER_STORIES.md

---

## 1. Principe

Chaque template est un **depart configure**, pas un developpement neuf. Il definit :

- Les **pages specifiques** (activees/inactivees selon le package).
- Les **sections prioritaires** (ordre et contenu type).
- Le **parcours utilisateur** principal.
- Les **composants** utilises et leur configuration par defaut.
- L'**ambiance visuelle** (palette, typographies, images).

Le template est **personnalisable** via le fichier de configuration client.

---

## 2. Template Restaurant (flagship)

### 2.1 Vision

Le template restaurant doit transmettre : **chaleur, appetence, confiance, accessibilite**. Le visiteur doit avoir envie de manger en 3 secondes.

### 2.2 Pages

| Page | Package Vitrine | Package Reservation | Priorite |
| ---- | --------------- | ------------------- | -------- |
| Accueil | Oui | Oui | MUST |
| Le Menu | Oui | Oui | MUST |
| A propos | Oui | Oui | MUST |
| Galerie | Oui | Oui | MUST |
| Reservation | Non | **Oui** | MUST (package 2+) |
| La Carte des vins | Optionnel | Optionnel | COULD |
| Evenements / Traiteur | Optionnel | Optionnel | COULD |
| Contact | Oui | Oui | MUST |
| Mentions legales | Oui | Oui | MUST |
| Confidentialite | Oui | Oui | MUST |

### 2.3 Parcours type (visiteur)

```
Accueil (hero plats + "Reserver")
    │
    ├──> Le Menu (decouvrir la carte)
    │       │
    │       ├──> Reservation (action principale)
    │       │       │
    │       │       └──> Confirmation
    │       │
    │       └──> Contact (alternative)
    │
    ├──> Galerie (se rassurer)
    │
    ├──> A propos (histoire, equipe)
    │
    └──> Contact (infos pratiques + map)
```

**CTA principal** : "Reserver" (ou "Reserver maintenant").
**CTA secondaire** : "Voir le menu".

### 2.4 Sections de l'accueil

| Ordre | Section | Composant | Contenu type |
| ----- | ------- | --------- | -------------- |
| 1 | Hero | Hero (split) | Photo plats + nom du restaurant + "Reserver" |
| 2 | Presentation | Texte + Image | "Bienvenue a [Nom]" + description courte + photo salle |
| 3 | Le Menu abrege | Menu (3-4 items) | 3-4 plats signatures avec prix |
| 4 | Avis clients | Testimonials (carousel) | 3-4 avis Google/TripAdvisor |
| 5 | CTA Reservation | CTA Banner | "Reservez votre table" + bouton |
| 6 | Galerie abregee | Gallery (3-4 images) | Photos plats + salle + terrasse |
| 7 | Infos pratiques | OpeningHours + Map + ContactCard | Horaires + adresse + carte |
| 8 | FAQ | FAQ (accordion) | "Avez-vous un parking ?" "Acceptez-vous les chiens ?" etc. |

### 2.5 Ambiance visuelle

| Element | Recommandation |
| ------- | -------------- |
| Palette | Rouge chaleureux (#B91C1C) + Dore (#F59E0B) + Blanc cassé |
| Typo heading | Playfair Display (serif, elegant) |
| Typo body | Inter (lisible) |
| Images | Plats en gros plan, salle chaleureuse, equipe, details (assiette, verre) |
| Ambiance | Chaleureuse, appetissante, intime |
| Icones | Minimalistes, discrètes |

### 2.6 composants specifiques restaurant

| Composant | Description | Etats |
| --------- | ----------- | ----- |
| **MenuCard** | Categorie + liste des plats (nom, description, prix) | Default, Hover (photo si disponible) |
| **ReservationForm** | Date, heure, nombre de personnes, nom, email, telephone, message | Default, Error (creneau non disponible), Success (confirmation) |
| **WineList** | Liste des vins (nom, millésime, prix, description) | Default, Category filter |
| **HoursBlock** | Horaires avec indicateur Ouvert/Ferme | Open, Closed |

---

## 3. Template Artisan

### 3.1 Vision

Le template artisan doit transmettre : **savoir-faire, fiabilite, proximite**. Le visiteur doit avoir confiance en la competence de l'artisan.

### 3.2 Pages

| Page | Package Vitrine | Priorite |
| ---- | --------------- | -------- |
| Accueil | Oui | MUST |
| Realisations | Oui | MUST |
| Services | Oui | MUST |
| Demande de devis | Oui | MUST |
| Galerie | Optionnel | SHOULD |
| A propos | Oui | MUST |
| Contact | Oui | MUST |
| Mentions legales | Oui | MUST |
| Confidentialite | Oui | MUST |

### 3.3 Parcours type (visiteur)

```
Accueil (hero realisations + "Demander un devis")
    │
    ├──> Realisations (voir le travail)
    │       │
    │       ├──> Demander un devis (action principale)
    │       │       │
    │       │       └──> Confirmation
    │       │
    │       └──> Contact (alternative)
    │
    ├──> Services (comprendre l'offre)
    │
    ├──> A propos (histoire, competences)
    │
    └──> Contact (coordonnees + map)
```

**CTA principal** : "Demander un devis" (ou "Devis gratuit").
**CTA secondaire** : "Voir nos realisations".

### 3.4 Sections de l'accueil

| Ordre | Section | Composant | Contenu type |
| ----- | ------- | --------- | -------------- |
| 1 | Hero | Hero (split) | Photo realisations + nom + metier + "Devis gratuit" |
| 2 | Presentation | Texte + Image | "Artisan [metier] a Lyon" + experience + valeurs |
| 3 | Services | Grille (3-4 items) | Metiers proposes (plomberie, electricite, etc.) |
| 4 | Realisations abregees | Gallery (4-6 images) | Avant/apres, chantiers, finitions |
| 5 | Avis clients | Testimonials | 3-4 avis |
| 6 | CTA Devis | CTA Banner | "Demandez votre devis gratuit" + bouton |
| 7 | Infos pratiques | Map + ContactCard | Adresse + zone d'intervention |
| 8 | FAQ | FAQ | "Intervenez-vous le week-end ?" "Zone d'intervention ?" |

### 3.5 Ambiance visuelle

| Element | Recommandation |
| ------- | -------------- |
| Palette | Bleu fiable (#1D4ED8) + Vert (#059669) + Blanc |
| Typo heading | Inter ou DM Sans (moderne, pro) |
| Typo body | Inter |
| Images | Realisations, chantiers, outils, equipe au travail |
| Ambiance | Professionnelle, fiable, accessible |
| Icones | Metier (outil, maison, check) |

### 3.6 Composants specifiques artisan

| Composant | Description | Etats |
| --------- | ----------- | ----- |
| **DevisForm** | Type de travaux, description, surface, delai souhaite, nom, email, tel | Default, Error, Success |
| **RealisationCard** | Photo + titre + description + categorie | Default, Hover (overlay) |
| **ServiceCard** | Icone + titre + description courte | Default |

---

## 4. Template Commerce

### 4.1 Vision

Le template commerce doit transmettre : **modernite, diversite, envie d'acheter**. Le visiteur doit decouvrir les produits et etre attire.

### 4.2 Pages

| Page | Package Vitrine | Priorite |
| ---- | --------------- | -------- |
| Accueil | Oui | MUST |
| Catalogue / Boutique | Oui | MUST |
| Services | Oui | MUST |
| Promotions | Optionnel | SHOULD |
| Marques | Optionnel | COULD |
| Galerie | Optionnel | SHOULD |
| A propos | Oui | MUST |
| Contact | Oui | MUST |
| Mentions legales | Oui | MUST |
| Confidentialite | Oui | MUST |

### 4.3 Parcours type (visiteur)

```
Accueil (hero boutique + "Decouvrir nos produits")
    │
    ├──> Catalogue (explorer l'offre)
    │       │
    │       ├──> Contact / Appel (action : commander, renseigner)
    │       │
    │       └──> Promotions (bons plans)
    │
    ├──> Services (ce que le magasin propose en plus)
    │
    ├──> A propos (histoire du magasin)
    │
    └──> Contact (adresse + horaires + map)
```

**CTA principal** : "Decouvrir nos produits" (ou "Voir le catalogue").
**CTA secondaire** : "Voir les promos".

### 4.4 Sections de l'accueil

| Ordre | Section | Composant | Contenu type |
| ----- | ------- | --------- | -------------- |
| 1 | Hero | Hero (centered) | Photo boutique + nom + "Decouvrir" |
| 2 | Presentation | Texte + Image | "Votre [type] a Lyon" + specialites |
| 3 | Categories | Grille (3-4 items) | Categories de produits/services |
| 4 | Promotions | Pricing / Cards | Offres en cours (si disponibles) |
| 5 | Avis clients | Testimonials | 3-4 avis |
| 6 | CTA | CTA Banner | "Venez nous decouvrir" + bouton |
| 7 | Galerie abregee | Gallery | Photos boutique, produits |
| 8 | Infos pratiques | OpeningHours + Map + ContactCard | Horaires + adresse |
| 9 | FAQ | FAQ | "Livrez-vous ?" "Acceptez-vous les cartes ?" |

### 4.5 Ambiance visuelle

| Element | Recommandation |
| ------- | -------------- |
| Palette | Violet moderne (#7C3AED) + Orange (#F59E0B) + Blanc |
| Typo heading | DM Sans (moderne, propre) |
| Typo body | Inter |
| Images | Boutique, produits en detail, ambiance magasin |
| Ambiance | Moderne, attrayante, professionnelle |
| Icones | Shopping, categories, promo |

### 4.6 Composants specifiques commerce

| Composant | Description | Etats |
| --------- | ----------- | ----- |
| **ProductCard** | Photo + nom + prix + categorie | Default, Hover (overlay), Empty |
| **CategoryFilter** | Filtres par categorie | Active, Inactive |
| **PromoBanner** | Bandeau promotionnel | Visible, Hidden |

---

## 5. Template Independant / Profession liberale

### 5.1 Vision

Le template independant doit transmettre : **expertise, proximite, confiance**. Le visiteur doit avoir envie de prendre RDV ou de contacter le professionel.

### 5.2 Pages

| Page | Package Vitrine | Package Reservation | Priorite |
| ---- | --------------- | ------------------- | -------- |
| Accueil | Oui | Oui | MUST |
| Prestations | Oui | Oui | MUST |
| Prise de RDV | Non | **Oui** | MUST (package 2+) |
| Blog / Conseils | Optionnel | Optionnel | COULD (futur) |
| Galerie | Optionnel | Optionnel | SHOULD |
| A propos | Oui | Oui | MUST |
| Contact | Oui | Oui | MUST |
| Mentions legales | Oui | Oui | MUST |
| Confidentialite | Oui | Oui | MUST |

### 5.3 Parcours type (visiteur)

```
Accueil (hero portrait + "Prendre RDV")
    │
    ├──> Prestations (decouvrir l'offre + tarifs)
    │       │
    │       ├──> Prise de RDV (action principale)
    │       │       │
    │       │       └──> Confirmation
    │       │
    │       └──> Contact (alternative)
    │
    ├──> A propos (parcours, competences, valeurs)
    │
    ├──> Galerie (si pertinent)
    │
    └──> Contact (coordonnees + map)
```

**CTA principal** : "Prendre RDV" (ou "Consulter").
**CTA secondaire** : "Voir les prestations".

### 5.4 Sections de l'accueil

| Ordre | Section | Composant | Contenu type |
| ----- | ------- | --------- | -------------- |
| 1 | Hero | Hero (split) | Photo portrait + nom + profession + "Prendre RDV" |
| 2 | Presentation | Texte + Image | Parcours, diplomes, experience |
| 3 | Prestations | Pricing / Cards | Services + tarifs indicatifs + durees |
| 4 | Avis clients | Testimonials | 3-4 avis |
| 5 | CTA RDV | CTA Banner | "Prenez rendez-vous" + bouton |
| 6 | Galerie abregee | Gallery | Bureau, equipements, realisations |
| 7 | FAQ | FAQ | "Combien dure une consultation ?" "Remboursement ?" |

### 5.5 Ambiance visuelle

| Element | Recommandation |
| ------- | -------------- |
| Palette | Cyan pro (#0891B2) + Vert (#059669) + Blanc |
| Typo heading | Inter (pro, accessible) |
| Typo body | Inter |
| Images | Portrait professionnel, bureau, interactions clients |
| Ambiance | Professionnelle, accessible, rassurante |
| Icones | Metier, RDV, contact |

### 5.6 Composants specifiques independant

| Composant | Description | Etats |
| --------- | ----------- | ----- |
| **RDVForm** | Date, heure, motif, nom, email, telephone | Default, Error (aucun creneau), Success |
| **PrestationCard** | Nom + description + duree + prix | Default, Hover |
| **TarifBlock** | Liste des tarifs par service | Default |

---

## 6. Template Association

### 6.1 Vision

Le template association doit transmettre : **engagement, proximite, confiance**. Le visiteur doit avoir envie de rejoindre, de participer, de soutenir.

### 6.2 Pages

| Page | Package Vitrine | Priorite |
| ---- | --------------- | -------- |
| Accueil | Oui | MUST |
| Nos actions | Oui | MUST |
| Adhesion | Oui | MUST |
| Evenements | Oui | MUST |
| Galerie | Optionnel | SHOULD |
| Donation | Optionnel | COULD (futur) |
| A propos | Oui | MUST |
| Contact | Oui | MUST |
| Mentions legales | Oui | MUST |
| Confidentialite | Oui | MUST |

### 6.3 Parcours type (visiteur)

```
Accueil (hero engagement + "Nous rejoindre")
    │
    ├──> Nos actions (decouvrir les missions)
    │       │
    │       ├──> Adhesion (action principale)
    │       │       │
    │       │       └──> Confirmation
    │       │
    │       └──> Evenements (participer)
    │
    ├──> A propos (mission, histoire, equipe)
    │
    ├──> Galerie (temps forts)
    │
    └──> Contact (coordonnees + map)
```

**CTA principal** : "Nous rejoindre" (ou "Devenir membre").
**CTA secondaire** : "Voir nos actions".

### 6.4 Sections de l'accueil

| Ordre | Section | Composant | Contenu type |
| ----- | ------- | --------- | -------------- |
| 1 | Hero | Hero (centered) | Photo evenement + nom association + mission |
| 2 | Mission | Texte + Image | "Notre mission" + valeurs + objectifs |
| 3 | Actions | Grille (3-4 items) | Projets en cours, actions cles |
| 4 | Evenements a venir | Cards | 2-3 prochains evenements |
| 5 | Temoignages | Testimonials | Membres, beneficiaires |
| 6 | CTA Adhesion | CTA Banner | "Rejoignez-nous" + bouton |
| 7 | Galerie abregee | Gallery | Photos d'evenements |
| 8 | FAQ | FAQ | "Comment adhérer ?" "C'est quoi le cotisation ?" |

### 6.5 Ambiance visuelle

| Element | Recommandation |
| ------- | -------------- |
| Palette | Vert engagé (#059669) + Ambre (#D97706) + Blanc |
| Typo heading | Libre Baskerville (serif, intemporelle) ou Inter |
| Typo body | Inter |
| Images | Evenements, benevoles, actions, moments forts |
| Ambiance | Chaleureuse, engageante, inclusive |
| Icones | Coeur, main, calendrier, groupe |

### 6.6 Composants specifiques association

| Composant | Description | Etats |
| --------- | ----------- | ----- |
| **AdhesionForm** | Nom, prenom, email, telephone, motif d'adhesion | Default, Error, Success |
| **EventCard** | Date + titre + lieu + description + inscription | Default, Past (grisé), Full |
| **ActionCard** | Photo + titre + description + statut | Default |

---

## 7. Matrice de personnalisation

| Parametre | Restaurant | Artisan | Commerce | Independant | Association |
| --------- | ----------- |---------|----------|-------------|-------------|
| **CTA principal** | Reserver | Devis gratuit | Decouvrir | Prendre RDV | Nous rejoindre |
| **CTA secondaire** | Voir le menu | Voir les realisations | Voir les promos | Voir les prestations | Voir nos actions |
| **Hero type** | Plats / salle | Realisations | Boutique | Portrait | Evenement |
| **Pages specifiques** | Menu, Reservation, Vins | Realisations, Devis | Catalogue, Promos | Prestations, RDV | Actions, Adhesion |
| **Horaires** | Obligatoires | Recommandees | Obligatoires | Optionnelles | Selon activite |
| **Map** | Obligatoire | Obligatoire | Obligatoire | Recommandee | Recommandee |
| **Avis** | Fortement recommande | Recommande | Fortement recommande | Recommande | Selon activite |
| **Gallery** | Plats + salle | Realisations | Boutique + produits | Bureau + equipements | Evenements |
| **FAQ type** | Parking, chiens, reservation | Zone intervention, delais | Livraison, paiement | Tarifs, duree, remboursement | Adhesion, cotisation |

---

## 8. Dependances

- **content-seo** : contenus specifiques par template (textes, images, metadata).
- **frontend-engineer** : implementation des composants specifiques (Menu, DevisForm, Catalogue, etc.).
- **solution-architect** : faisabilite technique des formulaires specifiques.
- **Noah (Gate 1/2)** : validation des templates et de leurs sections.

---

## 9. Points ouverts (Gate 2)

1. **Template restaurant** : est-ce bien le template flagship confirme ?
2. **Nombre de templates en v1** : restaurant seul, ou restaurant + artisan des le depart ?
3. **Composants specifiques** : lesquels sont MUST vs SHOULD pour le premier template ?
4. **E-commerce leger** : quelle page et quel composant pour le template commerce ?
5. **Donation** : simple lien externe (Tipeee, HelloAsso) ou formulaire integre ?
6. **Blog** : hors perimetre v1 ou documente comme COULD ?
