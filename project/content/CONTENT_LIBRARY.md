# CONTENT_LIBRARY.md — Bibliotheque de contenus reutilisables

Version : 0.1 (Phase 0 — Discovery)
Porteur : Content / SEO (AGENT 03)
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : SITEMAP_MASTER.md (structure de pages), UX.md (parcours, etats speciaux),
TEMPLATE_VISION.md (sections par template), REQUIREMENTS.md (FR-SEO, FR-FORM),
CLIENT_DATA_SCHEMA.md (placeholders)

---

## 1. Principe

Cette bibliotheque fournit des **templates de textes reutilisables** pour tous
les sites produits. Chaque texte contient des **placeholders** `[Nom]`,
`[Ville]`, `[Activite]`, etc. qui sont remplaces par les donnees du fichier
`client_data.yaml` au moment de l'assemblage.

**Aucun texte n'est definitif** : Noah personnalise et valide chaque contenu
avant publication.

---

## 2. Templates de texte par section

### 2.1 Hero — Accueil

#### Restaurant (template flagship)

```
[Nom]
[Description_courte]

[CTA: "Reserver maintenant"]
[CTA_secondaire: "Voir la carte"]
```

Exemple utilise :
```
Chez Marie
Cuisine lyonnaise traditionnelle, produits frais du Marche de la Croix-Rousse

Reserver maintenant
Voir la carte
```

#### Artisan

```
[Nom] — [Metier]
[Description_courte]

[CTA: "Demander un devis gratuit"]
[CTA_secondaire: "Voir nos realisations"]
```

Exemple :
```
Batisseau & Fils — Plombier a Lyon
Expert en plomberie et chauffage, 25 ans d'experience a Lyon

Demander un devis gratuit
Voir nos realisations
```

#### Commerce

```
[Nom]
[Description_courte]

[CTA: "Decouvrir nos produits"]
[CTA_secondaire: "Voir les promos"]
```

#### Independant

```
[Nom] — [Profession]
[Description_courte]

[CTA: "Prendre rendez-vous"]
[CTA_secondaire: "Voir les prestations"]
```

#### Association

```
[Nom]
[Mission_courte]

[CTA: "Nous rejoindre"]
[CTA_secondaire: "Voir nos actions"]
```

### 2.2 Section Presentation (Accueil)

```
Bienvenue a [Nom]

[Description_longue: 3-5 phrases sur l'histoire, les valeurs, ce qui rend unique]

[CTA: "En savoir plus"]
```

Exemple :
```
Bienvenue a Chez Marie

Depuis 1998, Marie et son equipe vous accueillent dans un cadre chaleureux
au coeur du 3e arrondissement de Lyon. Notre cuisine est inspiree des
traditions lyonnaises, avec des produits frais selectionnes chaque matin
a nos marches locaux. Que ce soit pour un dejeuner entre amis ou un
repas en famille, nous mettons tout en oeuvre pour que chaque visite
soit un moment de plaisir.
```

### 2.3 Section Services / Prestations

#### Template grille

```
Nos services

[Service_1_nom]
[Service_1_description]

[Service_2_nom]
[Service_2_description]

[Service_3_nom]
[Service_3_description]

[CTA: "Decouvrir tous nos services"]
```

#### Template cards

```
Ce que nous proposons

[Service_1] | [Service_2] | [Service_3] | [Service_4]
[Icone]     | [Icone]     | [Icone]     | [Icone]
[Titre]     | [Titre]     | [Titre]     | [Titre]
[Desc courte]| [Desc courte]| [Desc courte]| [Desc courte]
[Prix]      | [Prix]      | [Prix]      | [Prix]
```

### 2.4 Section Avis / Temoignages

```
Ce que nos clients disent

[Nom_client_1]
"[Texte_avis_1]"
— [Source_1] (Google)

[Nom_client_2]
"[Texte_avis_2]"
— [Source_2] (TripAdvisor)
```

**Regle** : les avis sont tires du fichier `reviews.items[]` du client_data.yaml.
Un minimum de 3 avis est recommande. Jamais de fabrication.

### 2.5 Section CTA Banner

#### Restaurant

```
Reservez votre table chez [Nom]

Une experience culinaire a [Ville] vous attend.
[CTA: "Reserver maintenant"]
```

#### Artisan

```
Un projet ? Parlons-en.

[CTA: "Demander un devis gratuit"]
```

#### Commerce

```
Venez nous decouvrir a [Ville]

[CTA: "Voir nos produits"]
```

#### Independant

```
Besoin d'un conseil ?

[CTA: "Prendre rendez-vous"]
```

#### Association

```
Ensemble, faisons la difference.

[CTA: "Nous rejoindre"]
```

### 2.6 Section Infos Pratiques

```
Nous trouver

[Adresse_complete]
[Telephone_cliquable]
[Email_cliquable]

Horaires :
[Horaires_format_liste]

[Composant Map]
```

### 2.7 Section FAQ (Accueil)

```
Questions frequentes

Q: [Question_1] ?
A: [Reponse_1 courte, 2-3 phrases]

Q: [Question_2] ?
A: [Reponse_2]

Q: [Question_3] ?
A: [Reponse_3]

Q: [Question_4] ?
A: [Reponse_4]

Q: [Question_5] ?
A: [Reponse_5]
```

---

## 3. Structure de page par template

### 3.1 Page Accueil (tous templates)

```
[Header]
[Hero]
[Presentation]
[Services abrege (3-4)]
[Avis clients]
[CTA Banner]
[Infos pratiques (horaires + map + coordonnees)]
[FAQ abregee (4-6 questions)]
[Footer]
```

### 3.2 Page Menu (Restaurant)

```
[Header]
[Breadcrumb: Accueil > La carte]
[Hero titre: "La carte de [Nom]"]
[Menu categories]
  [Entrees]
  [Plats]
  [Desserts]
  [Boissons]
[CTA Reservation]
[FAQ menu (3-4 questions)]
[Footer]
```

### 3.3 Page Reservation (Restaurant, Package 2+)

```
[Header]
[Breadcrumb: Accueil > Reservation]
[Hero titre: "Reservez votre table"]
[ReservationForm]
[Infos pratiques (horaires, adresse, telephone)]
[FAQ reservation (3-4 questions)]
[Footer]
```

### 3.4 Page Realisations (Artisan)

```
[Header]
[Breadcrumb: Accueil > Realisations]
[Hero titre: "Nos realisations"]
[Grille de projets (Photo + Titre + Description + Categorie)]
[Filtres par categorie]
[CTA Devis]
[Footer]
```

### 3.5 Page Devis (Artisan)

```
[Header]
[Breadcrumb: Accueil > Demande de devis]
[Hero titre: "Demandez votre devis gratuit"]
[DevisForm]
[Processus en 3 etapes (Contact -> Devis -> Travaux)]
[FAQ devis (3-4 questions)]
[Footer]
```

### 3.6 Page Catalogue (Commerce)

```
[Header]
[Breadcrumb: Accueil > Catalogue]
[Hero titre: "Nos produits"]
[Filtres par categorie]
[Grille de produits (Photo + Nom + Prix + Categorie)]
[CTA contact / achat]
[Footer]
```

### 3.7 Page Prestations (Independant)

```
[Header]
[Breadcrumb: Accueil > Prestations]
[Hero titre: "Nos prestations"]
[Liste des prestations (Nom + Description + Duree + Prix)]
[CTA RDV]
[FAQ prestations (3-4 questions)]
[Footer]
```

### 3.8 Page RDV (Independant, Package 2+)

```
[Header]
[Breadcrumb: Accueil > Prise de RDV]
[Hero titre: "Prenez rendez-vous"]
[RDVForm]
[Infos pratiques]
[FAQ RDV (3-4 questions)]
[Footer]
```

### 3.9 Page Actions (Association)

```
[Header]
[Breadcrumb: Accueil > Nos actions]
[Hero titre: "Nos actions"]
[Grille de projets (Photo + Titre + Description + Statut)]
[CTA Adhesion]
[Footer]
```

### 3.10 Page Adhesion (Association)

```
[Header]
[Breadcrumb: Accueil > Adhesion]
[Hero titre: "Rejoignez-nous"]
[AdhesionForm]
[Informations sur l'adhesion]
[FAQ adhesion (3-4 questions)]
[Footer]
```

### 3.11 Page A propos (tous templates)

```
[Header]
[Breadcrumb: Accueil > A propos]
[Hero titre: "A propos de [Nom]"]
[Historique / Mission]
[Valeurs]
[Equipe (si applicable)]
[CTA principal]
[Footer]
```

### 3.12 Page Contact (tous templates)

```
[Header]
[Breadcrumb: Accueil > Contact]
[Hero titre: "Nous contacter"]
[ContactForm (cote gauche)]
[Coordonnees + Horaires + Reseaux (cote droit)]
[Map pleine largeur]
[Footer]
```

### 3.13 Pages legales (tous templates)

```
[Header]
[Breadcrumb: Accueil > Mentions legales]
[Hero titre: "Mentions legales"]
[Contenu genrique a completer avec les donnees client]
[Derniere mise a jour]
[Footer]
```

---

## 4. Etats speciaux — Textes

### 4.1 Page 404

```
Titre : "Page introuvable"
Message : "Oups ! La page que vous cherchez n'existe pas ou a ete deplacee."
CTA : "Retour a l'accueil"
Lien secondaire : "Nous contacter" (optionnel)
```

**SEO** : status HTTP 404, pas de balise index.

### 4.2 Page erreur serveur (500)

```
Titre : "Erreur temporaire"
Message : "Notre site rencontre un probleme temporaire. Veuillez reessayer
dans quelques instants."
Contact : "Si le probleme persiste, contactez-nous a [telephone] ou [email]."
CTA_1 : "Reessayer"
CTA_2 : "Nous contacter"
```

**SEO** : status HTTP 500, pas de balise index.

### 4.3 Reservation — Aucun creneau disponible

```
Titre : "Aucun creneau disponible"
Message : "Desole, aucun creneau n'est disponible pour la date demandee."
CTA_1 : "Choisir une autre date"
CTA_2 : "Nous appeler : [telephone]"
```

**Regles** :
- Pas de dead-end (toujours au moins 2 options).
- Pas de blamer le visiteur.
- Le formulaire reste visible pour changer la date.

### 4.4 Formulaire — Erreur par champ

```
Message : "Veuillez renseigner [nom_du_champ]."
```

Exemples :
```
"Veuillez renseigner votre nom."
"Veuillez entrer un email valide (ex: jean@example.com)."
"Veuillez entrer un numero de telephone valide."
"Veuillez renseigner votre message."
```

**Regles** :
- Message sous le champ, pas dans une alerte globale.
- Icone + texte rouge.
- `aria-describedby` lie le message au champ.
- `aria-invalid="true"` sur le champ en erreur.

### 4.5 Formulaire — Erreur globale

```
Titre : "Le formulaire contient [N] erreur(s)."
Message : "Veuillez corriger les champs soulignes en rouge."
```

**Regles** :
- Message en haut du formulaire, `role="alert"`, `aria-live="assertive"`.
- Nombre d'erreurs precise.
- Lien ancres vers chaque champ en erreur.

### 4.6 Confirmation d'envoi (formulaire contact)

```
Titre : "Message envoye !"
Message : "Merci pour votre message. Nous vous repondrons sous 24h ouvrees."
Detail : "Vous recevrez une confirmation a [email] si vous l'avez renseigne."
CTA : "Retour a l'accueil"
```

**Regles** :
- Feedback immediat (pas de rechargement de page).
- Formulaire reinitialise.
- `role="status"`, `aria-live="polite"`.

### 4.7 Confirmation de reservation

```
Titre : "Reservation confirmee !"
Recapitulatif :
  - Date : [date]
  - Heure : [heure]
  - Nombre de personnes : [nombre]
  - Nom : [nom_client]
Message : "Un email de confirmation vous a ete envoye a [email]."
Modification : "En cas de modification, appelez-nous au [telephone]."
CTA : "Retour a l'accueil"
```

### 4.8 Cookie Banner

```
Titre : "Ce site utilise des cookies."
Message : "Nous utilisons des cookies pour ameliorer votre experience.
En savoir plus dans notre politique de confidentialite."
CTA_1 : "Tout accepter"
CTA_2 : "Tout refuser"
CTA_3 : "Personnaliser"
```

**Regles** :
- Le refus est **aussi facile** que l'acceptation (CNIL).
- Affiche uniquement si des tiers le necessitent.
- `role="dialog"`, focus trap.
- Choix stocke 6 mois.

### 4.9 Page en construction

```
Titre : "Page en cours de creation"
Message : "Revenez bientot, cette page sera disponible prochainement !"
CTA_1 : "Retour a l'accueil"
CTA_2 : "Nous contacter"
```

---

## 5. FAQ generique par secteur

### 5.1 Restaurant

| Question | Reponse type |
| -------- | ------------ |
| Proposez-vous un service de livraison ? | Non, nous ne proposons pas de livraison pour le moment. Vous pouvez commander a emporter en nous appelant au [telephone]. |
| Acceptez-vous les chiens ? | [Reponse a personnaliser selon le client] |
| Y a-t-il un parking a proximite ? | [Parking le plus proche + tarif + distance] |
| Pouvez-vous accueillir les groupes ? | Oui, nous pouvons accueillir des groupes jusqu'a [nombre] personnes. Contactez-nous pour organiser votre evenement. |
| Le menu est-il adapte aux regimes alimentaires ? | Nous proposons des options sans gluten et vegetariennes. N'hesitez pas a nous signaler vos restrictions au moment de la reservation. |
| Quels sont vos horaires ? | Nous sommes ouverts du [jour] au [jour], de [heure] a [heure]. Fermes le [jour]. |
| Faut-il reserver ? | La reservation est recommandee, especially le weekend. |

### 5.2 Artisan

| Question | Reponse type |
| -------- | ------------ |
| Intervenez-vous en dehors de Lyon ? | Oui, nous intervenons dans toute la region lyonnaise et [zone_precise]. |
| Quels sont vos delais d'intervention ? | [Delai type selon le type de travaux]. Contactez-nous pour un devis precis. |
| Proposez-vous des devis gratuits ? | Oui, tous nos devis sont gratuits et sans engagement. |
| Quelles sont vos garanties ? | Nos travaux sont garantis [duree] conformement a la loi. |
| Quels sont vos moyens de paiement ? | [Moyens de paiement acceptes]. |
| Intervenez-vous le week-end ? | [Reponse du client] |

### 5.3 Commerce

| Question | Reponse type |
| -------- | ------------ |
| Livrez-vous a domicile ? | [Reponse du client] |
| Acceptez-vous les cartes bancaires ? | Oui, nous acceptons toutes les cartes bancaires, sans minimum d'achat. |
| Proposez-vous des cartes cadeaux ? | Oui, des cartes cadeaux sont disponibles en magasin. |
| Y a-t-il des promos en cours ? | Consultez la page [promotions] pour decouvrir nos offres actuelles. |
| Vos produits sont-ils disponibles en ligne ? | [Reponse du client] |
| Quels horaires d'ouverture ? | Nous sommes ouverts du [jour] au [jour], de [heure] a [heure]. |

### 5.4 Independant / Profession liberale

| Question | Reponse type |
| -------- | ------------ |
| Quel est le tarif d'une consultation ? | Nos prestations commencent a [prix]. Consultez la page [prestations] pour le detail. |
| Combien dure une consultation ? | Une consultation dure en moyenne [duree]. |
| Proposez-vous des visites a domicile ? | [Reponse du client] |
| Acceptez-vous les mutuelles ? | [Reponse du client] |
| Comment prendre rendez-vous ? | Vous pouvez prendre rendez-vous en ligne via la page [RDV] ou en nous appelant au [telephone]. |
| Quels sont vos delais de prise en charge ? | [Reponse du client] |

### 5.5 Association

| Question | Reponse type |
| -------- | ------------ |
| Comment adherer a l'association ? | Rendez-vous sur la page [adhesion] pour remplir le formulaire d'inscription. |
| Quel est le montant de la cotisation ? | La cotisation annuelle est de [montant]. |
| Quelles sont vos missions principales ? | [Resume des missions de l'association] |
| Proposez-vous des benevolats ? | Oui, nous recherchons des benevoles. Contactez-nous pour en savoir plus. |
| Organisez-vous des evenements ? | Oui, consultez la page [evenements] pour decouvrir nos prochains evenements. |
| Comment faire un don ? | [Lien vers plateforme de don ou procedure] |

---

## 6. Contenus de pages legales (templates genriques)

### 6.1 Mentions legales

```markdown
# Mentions legales

Derniere mise a jour : [Date]

## Editeur du site
[Nom_commercial]
[Forme_juridique]
[Adresse_complete]
SIREN : [SIREN]
SIRET : [SIRET]
Telephone : [Telephone]
Email : [Email]
Directeur de la publication : [Nom_directeur]

## Hebergeur
[Nom_hebergeur]
[Adresse_hebergeur]

## Propriete intellectuelle
L'ensemble du contenu de ce site (textes, images, videos, logos) est la
propriete de [Nom] ou de ses partenaires. Toute reproduction est interdite
sans autorisation prealable ecrite.

## Donnees personnelles
Pour plus d'informations sur la gestion de vos donnees personnelles,
consultez notre [politique de confidentialite].
```

### 6.2 Politique de confidentialite

```markdown
# Politique de confidentialite

Derniere mise a jour : [Date]

## Donnees collectees
[Site] collecte les donnees suivantes via le formulaire de contact :
- Nom
- Adresse email
- Message

## Finalite
Ces donnees sont collectees pour repondre a votre demande de contact.

## Base legale
Le traitement est fonde sur votre consentement (article 6.1.a du RGPD).

## Destinataires
Les donnees sont uniquement accessee par [Nom] pour traitement de votre demande.

## Duree de conservation
Les donnees sont conservees pendant [duree] apres le dernier echange.

## Vos droits
Vous disposez d'un droit d'acces, de rectification, de suppression et
d'opposition au traitement de vos donnees. Pour exercer ces droits,
contactez-nous a [email].
```

**Note** : les contenus legaux sont des TEMPLATES. Les champs
`[Nom_commercial]`, `[SIRET]`, `[Adresse]`, etc. sont remplis avec les
donnees reelles du client. **Aucune donnee juridique n'est jamais inventee.**

---

## 7. Dependances

- **UX Designer** : composition des sections par page (SITEMAP_MASTER.md),
  etats speciaux (UX.md section 4), composants du design system.
- **PM** : user stories (US-V-01 a V-09, US-C-01 a C-08) pour s'assurer
  que chaque texte couvre le bon parcours.
- **Legal / Compliance** : contenu des pages legales, mentions CNIL sur les
  formulaires, conformite RGPD.
- **Solution Architect** : faisabilite technique du remplacement de placeholders.
- **Frontend Engineer** : integration des textes dans les composants.
- **Noah (Gate 2/3)** : validation de chaque contenu avant publication.

---

## 8. Points ouverts (Noah a arbitrer)

1. **Nombre de placeholders** : le schema actuel en a ~20. Trop, pas assez ?
2. **Templates EN** : faut-il prevoir des templates anglais en parallele ?
3. **Contenus longs** : la page "A propos" doit-elle avoir un template complet
   ou suffit-il d'un squelette avec guidelines ?
4. **Blog** : si active plus tard, quel type de templates d'articles ?
5. **Images placeholder** : faut-il un systeme de placeholders visuels
   (lorem picsum) ou des images sectorielles reelles ?
6. **FAQ dynamique** : la FAQ doit-elle etre editable par le client (CMS)
   ou reste-t-elle figee dans le code ?
7. **Tono de voix** : faut-il un guide de style par template secteur
   (chaleureux pour restaurant, pro pour artisan, etc.) ?