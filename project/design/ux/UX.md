# UX.md — Experience utilisateur du systeme de production

Version : 0.1 (Phase 0 — Discovery)
Porteur : UX Designer
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : USER_STORIES.md (parcours A/B/C), REQUIREMENTS.md, SITEMAP_MASTER.md

---

## 1. Parcours utilisateurs prioritaires

### 1.1 Parcours B — Visiteur final du site produit (US-V-01 a V-09)

C'est le parcours **le plus critique** : c'est lui qui genere la valeur pour le client acheteur.

```
ARRIVEE (Google, QR code, reseau social, bouche a oreille)
    │
    ▼
[1] COMPRENDRE EN 3 SECONDES (US-V-01)
    │   Hero : nom + activite + localisation + CTA
    │   Question du visiteur : "C'est quoi ? C'est pour moi ? C'est ou ?"
    │
    ▼
[2] EXPLORER L'OFFRE (US-V-05)
    │   Menu / Prestations / Catalogue / Galerie
    │   Question : "Est-ce que ca correspond a ce que je cherche ?"
    │
    ▼
    ├── [3a] VOIR LES PREUVES (US-V-09)
    │       Avis clients, photos, mentions
    │       Question : "C'est fiable ? Ca vaut le coup ?"
    │
    ├── [3b] TROUVER LES INFOS PRATIQUES (US-V-02)
    │       Adresse, horaires, tel, email, map
    │       Question : "Comment j'y vais ? Quand j'y vais ?"
    │
    ▼
[4] AGIR (CTA)
    │   ├── Reserver / Prendre RDV (US-V-04) -> Formulaire reservation
    │   ├── Contacter (US-V-03) -> Formulaire contact
    │   ├── Demander un devis -> Formulaire devis
    │   └── Appeler -> Lien tel:
    │
    ▼
[5] CONFIRMATION
    │   Message de confirmation clair
    │   Prochaine etape expliquee
    │   (ex: "Merci ! Nous vous recontacterons sous 24h")
    │
    ▼
[6] SORTIE CONFIANTE
    │   Le visiteur sait quoi faire apres
    │   Il connait le delai de reponse
```

**Criteres de reussite (DoD parcours B) :**
- Le visiteur comprend l'offre en < 5 secondes (US-V-01).
- Le CTA principal est visible sans scroll (above the fold) sur toutes les pages.
- Le formulaire est remplissable en < 2 minutes.
- La confirmation est immediate et rassurante.
- Le site est lisible et utilisable sur mobile (US-V-06).

---

### 1.2 Parcours A — Noah configure un nouveau site client (US-N-01 a N-13)

```
DEMARRAGE PROJET (brief client valide)
    │
    ▼
[1] REMPLIR LE FICHIER DE DONNEES CLIENT (US-N-01)
    │   business: nom, description, categorie
    │   branding: couleurs, fonts
    │   opening_hours, socials, seo, services, contact, legal
    │   -> Les champs manquants sont LISTES (jamais inventes)
    │
    ▼
[2] CHOISIR LE TEMPLATE SECTEUR (US-N-02)
    │   Restaurant / Artisan / Commerce / Independant / Association
    │   -> Le template determine les pages specifiques et les composants
    │
    ▼
[3] CONFIGURER LE DESIGN (US-N-03)
    │   Palette de couleurs (primary, secondary, accent)
    │   Typographies (heading, body)
    │   Images (hero, gallery)
    │   -> Toute la config est Appliquee SANS modifier les composants
    │
    ▼
[4] COMPOSER LES PAGES (US-N-02)
    │   Activer / desactiver les slots de sections
    │   Ordre des sections par page
    │   Contenu texte et images
    │
    ▼
[5] GATE 1 : Brief / Perimetre / Prix
    │   Noah valide avant de continuer
    │
    ▼
[6] GATE 2 : Design / Structure / Contenu
    │   Noah + client valident
    │
    ▼
[7] GENERER LES PAGES
    │   Assemblage automatique : template + config + contenu
    │   Verification : aucune donnee inventee
    │
    ▼
[8] GATE 3 : Site final
    │   Noah + client valident le resultat
    │
    ▼
[9] GATE 4 : Mise en production
    │   Noah autorise explicitement
    │
    ▼
[10] MAINTENANCE (US-N-11)
     MAINTENANCE_PLAN actif
     Flux : monitoring -> ticket -> correction -> validation Noah -> deploy
```

**Criteres de reussite (DoD parcours A) :**
- Un site v1 est assemble sans developpement ad hoc (US-N-02).
- Tout ecart est identifie et chiffre avant engagement.
- Aucune donnee n'est inventee (US-N-01).
- Les 4 gates bloquent le pipeline.

---

### 1.3 Parcours C — Client acheteur (US-C-01 a C-08)

```
DEMANDE CLIENT (contact ou RDV commercial)
    │
    ▼
[1] RECEPTION DU DEVIS (US-C-01)
    │   Devis comprehensible (perimetre, prix, delais)
    │   CLIENT_TYPE demande (B2B/B2C)
    │
    ▼
[2] COMPREHENSION DE L'OFFRE (US-C-02)
    │   Packages Vitrine / +Reservation / +E-commerce
    │   Choix en connaissance de cause
    │
    ▼
[3] SIGNATURE (US-C-03)
    │   Contrat + CGV adaptes (B2B/B2C)
    │   Verification legal
    │
    ▼
[4] SUIVI DE PRODUCTION (US-C-04, C-05)
    │   Gates 2 et 3 presentees au client
    │   Revisions cadrees
    │
    ▼
[5] LIVRAISON (US-C-05)
    │   Site en ligne, acces remis
    │   Propriete du code / contenus claire
    │
    ▼
[6] FACTURATION (US-C-06)
    │   Facture conforme (mentions, TVA)
    │
    ▼
[7] MAINTENANCE (US-C-07)
    │   MAINTENANCE_PLAN remis
    │   Support, mises a jour, contenu
```

---

## 2. Navigation

### 2.1 Header — Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo]          [Accueil]  [Menu]  [Contact]  [A propos]    [CTA] │
└─────────────────────────────────────────────────────────────────────┘
```

- **Position** : fixe en haut de l'ecran, z-index le plus eleve.
- **Logo** : a gauche, lien vers l'accueil. Hauteur max 48px, padding vertical 16px.
- **Navigation** : centre ou droite, max 5-6 items.
- **CTA** : a droite, bouton plein fond avec contraste eleve. Texte depend du template (Reserver / Devis / Prendre RDV).
- **Fond** : blanc ou transparent au scroll, devient blanc avec ombre apres 50px de scroll.
- **Accessibilite** : focus visible sur tous les liens, aria-label sur le logo, role="navigation" sur le menu.

### 2.2 Header — Tablet (768px - 1024px)

- Meme disposition que desktop, navigation compacte.
- Si depassement : menu burger.

### 2.3 Header — Mobile (< 768px)

```
┌───────────────────────────────┐
│  [Logo]              [CTA]   │
│  (ou [Logo]        [☰] [CTA])│
└───────────────────────────────┘
```

- **Logo** a gauche.
- **CTA** toujours visible (bouton compact : "Reserver" ou icone tel).
- **Menu burger** : a droite, ouvre un panneau plein ecran ou un menu deroulant.
- **Panneau menu mobile** :
  - Plein ecran avec fond sombre ou blanc.
  - Liste verticale des liens, police >= 18px.
  - Close (X) accessible en haut a droite.
  - Fermeture au tap sur un lien OU sur le X.
  - Focus piege dans le panneau (accessibilite).
  - Le body ne scroll pas quand le menu est ouvert.

### 2.4 Footer

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo + Nom]                                                        │
│  [Adresse complete]           [Horaires]        [Reseaux sociaux]   │
│  [Telephone cliquable]        [Lundi-Vendredi]  [FB] [IG] [Trip]    │
│  [Email cliquable]            [11h-14h]                             │
│                               [18h-23h]                             │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  [Mentions legales]  [Confidentialite]  [Plan du site]   (c) 2026  │
└─────────────────────────────────────────────────────────────────────┘
```

- **Structure** : 3 colonnes desktop, 1 colonne mobile.
- **Colonne 1** : identite + coordonnees (adresse, tel, email).
- **Colonne 2** : horaires (si pertinent, sinon deplace dans contact).
- **Colonne 3** : reseaux sociaux (icones uniquement, pas de tracking).
- **Ligne basse** : liens legaux obligatoires + copyright.
- **Accessibilite** : navigation role="contentinfo", liens sociaux avec aria-label ("Facebook", "Instagram").

### 2.5 Navigation mobile — Menu burger

- **Declencheur** : bouton 44x44px minimum, aria-label="Menu", aria-expanded="true/false".
- **Panneau** : role="dialog", aria-label="Menu de navigation".
- **Fermeture** : touche Echap, tap sur X, tap sur un lien, tap hors du panneau.
- **Focus trap** : Tab cycle uniquement dans le panneau ouvert.
- **Z-index** : au-dessus de tout (header, cookie banner, modales).

---

## 3. Mobile UX (mobile-first)

### 3.1 Principes

1. **Mobile-first** : chaque composant est concu d'abord pour mobile, puis adapte pour tablette et desktop.
2. **Zones tactiles >= 44x44px** (WCAG 2.2, cible Google).
3. **Contenus concis** : textes courts, titres clairs, pas de murs de texte.
4. **Scroll vertical** : pas de scroll horizontal, pas de carrousel obligatoire.
5. **CTA toujours accessible** : sticky bottom sur mobile pour les actions principales.

### 3.2 Layout mobile

- **Largeur** : 100% de l'ecran, padding horizontal 16-24px.
- **Grille** : 4 colonnes (16px de gutter).
- **Sections** : pleine largeur, espace vertical 48-64px entre sections.
- **Images** : pleine largeur avec object-fit: cover, hauteur adaptee.

### 3.3 Composants mobile specifiques

| Comportement | Desktop | Mobile |
| ------------ | ------- | ------ |
| Header | Fixe, navigation visible | Fixe, logo + CTA + burger |
| Hero | Image + texte cote a cote | Image au-dessus, texte en dessous |
| Galerie | Grille 2-3 colonnes | Carousel horizontal OU grille 2 colonnes |
| Formulaire | Grille 2 colonnes | 1 colonne, champs pleine largeur |
| CTA sticky | Non necessaire | Bouton en bas d'ecran, visible en permanence |
| Map | Cote a cote avec coordonnees | Pleine largeur, hauteur 300px |
| FAQ | Grille ou colonne | Accordion, 1 question a la fois |
| Horaires | Colonne dans footer/sidebar | Section dediee ou dans footer |

### 3.4 CTA sticky mobile

- **Position** : fixe en bas de l'ecran, hauteur 56px.
- **Contenu** : texte du CTA + icone (ex: "Reserver maintenant" + icone calendrier).
- **Fond** : couleur primaire, texte blanc, contraste >= 4.5:1.
- **Z-index** : au-dessus du contenu, en-dessous du menu burger.
- **Dismiss** : visible uniquement quand le visiteur a scroll vers le bas (apres 300px).
- **Accessibilite** : role="complementary", aria-label.

### 3.5 Interactions tactiles

| Interaction | Zone min. | Feedback |
| ------------ | --------- | -------- |
| Tap sur lien | 44x44px | Changement de couleur (< 100ms) |
| Tap sur bouton | 44x44px | Changement de fond + ombre |
| Scroll | natif | Momentum natif |
| Swipe galerie | 44px hauteur | Indicateur de position (dots) |
| Long press | non utilise | non utilise |
| Double tap | non utilise | non utilise |

---

## 4. Etats speciaux a concevoir SYSTEMATIQUEMENT

Chaque etat special doit etre concu pour CHAQUE site produit. Le design system doit fournir les composants et les guidelines.

### 4.1 Page 404 (page introuvable)

```
┌─────────────────────────────────────────────┐
│                  [Header]                    │
│                                              │
│           😕                                 │
│     Oups ! Cette page n'existe pas.         │
│                                              │
│     La page que vous cherchez a ete         │
│     deplacee ou n'existe pas.               │
│                                              │
│     [Retour a l'accueil]                    │
│                                              │
│                  [Footer]                    │
└─────────────────────────────────────────────┘
```

- **Titre** : "404 — Page introuvable" ou message clair.
- **Message** : explication simple, pas de jargon technique.
- **CTA** : "Retour a l'accueil" (lien vers /).
- **Secondary** : lien vers contact (optionnel).
- **Design** : meme header/footer que le reste du site. Pas de page blanche.
- **SEO** : status HTTP 404, pas de index.

### 4.2 Page erreur serveur (500)

```
┌─────────────────────────────────────────────┐
│                  [Header]                    │
│                                              │
│           ⚠️                                 │
│     Oups ! Quelque chose ne va pas.         │
│                                              │
│     Notre site rencontre un probleme        │
│     temporaire. Veuillez reessayer          │
│     dans quelques instants.                 │
│                                              │
│     Si le probleme persiste, contactez-nous │
│     a [email/telephone].                    │
│                                              │
│     [Reessayer]  [Nous contacter]           │
│                                              │
│                  [Footer]                    │
└─────────────────────────────────────────────┘
```

- **Titre** : message d'erreur simple.
- **Explication** : probleme temporaire, pas de detail technique.
- **Actions** : "Reessayer" (lien vers la page precedente ou /) + "Nous contacter".
- **Contact** : toujours accessible (email/telephone visible).
- **Design** : meme header/footer.

### 4.3 Reservation — Aucun creneau disponible

```
┌─────────────────────────────────────────────┐
│           [Formulaire de reservation]        │
│                                              │
│     📅 Aucun creneau disponible              │
│     pour la date demandee.                  │
│                                              │
│     Essaie une autre date ou                │
│     contacte-nous directement.              │
│                                              │
│     [Choisir une autre date]                │
│     [Nous appeler : 04 XX XX XX XX]         │
│                                              │
└─────────────────────────────────────────────┘
```

- **Message** : clair, sans blamer le visiteur.
- **Actions** : reessayer (changer la date) + alternative (appeler).
- **Pas de dead-end** : toujours au moins 2 options.
- **Design** : inline dans le formulaire, pas de page separee.

### 4.4 Formulaire — Erreurs de validation

#### Erreur par champ

```
┌─────────────────────────────────────────────┐
│  Nom *                                      │
│  ┌─────────────────────────────────────┐    │
│  │ (vide ou invalide)                  │    │
│  └─────────────────────────────────────┘    │
│  ⚠️ Veuillez renseigner votre nom.          │
│                                              │
│  Email *                                     │
│  ┌─────────────────────────────────────┐    │
│  │ pas-un-email                        │    │
│  └─────────────────────────────────────┘    │
│  ⚠️ Veuillez entrer un email valide.         │
│  (ex: jean@example.com)                     │
└─────────────────────────────────────────────┘
```

- **Label** : toujours visible (pas de placeholder comme seul label).
- **Erreur** : sous le champ, icone + texte rouge, contraste >= 4.5:1.
- **Bordure** : champ passe en rouge (pas uniquement la couleur).
- **aria-describedby** : lie le message d'erreur au champ.
- **aria-invalid="true"** : sur le champ en erreur.
- **Focus** : le focus va au premier champ en erreur (apres soumission).

#### Erreur globale (soumission)

```
┌─────────────────────────────────────────────┐
│  ⚠️ Le formulaire contient 2 erreurs.        │
│  Veuillez corriger les champs soulignes.    │
│                                              │
│  [Formulaire avec erreurs detaillees]        │
│                                              │
└─────────────────────────────────────────────┘
```

- **Message global** : en haut du formulaire, role="alert", aria-live="assertive".
- **Nombre d'erreurs** : precise.
- **Lien ancres** : chaque erreur dans le message global est un lien vers le champ concerne.
- **Pas de soumission silencieuse** : le formulaire ne part jamais avec des erreurs.

### 4.5 Formulaire — Confirmation d'envoi

```
┌─────────────────────────────────────────────┐
│                                              │
│           ✅ Message envoye !                │
│                                              │
│     Merci pour votre message.               │
│     Nous vous repondrons sous 24h           │
│     ouvrées.                                │
│                                              │
│     Vous recevrez une confirmation          │
│     a [email] si vous l'avez renseigne.     │
│                                              │
│     [Retour a l'accueil]                    │
│                                              │
└─────────────────────────────────────────────┘
```

- **Feedback immediat** : pas de rechargement de page, message inline.
- **Contenu** : remerciement + delai de reponse + confirmation email.
- **Action** : "Retour a l'accueil" ou "Envoyer un autre message".
- **Reset** : le formulaire est reinitialise apres envoi.
- **Accessibilite** : role="status", aria-live="polite".

### 4.6 Reservation — Confirmation

```
┌─────────────────────────────────────────────┐
│                                              │
│           🎉 Reservation confirmee !        │
│                                              │
│     Votre reservation :                     │
│     📅 [Date] a [Heure]                     │
│     👥 [Nombre] personnes                   │
│     📝 [Nom]                                │
│                                              │
│     Un email de confirmation vous a ete     │
│     envoye a [email].                       │
│                                              │
│     En cas de modification, appelez-nous   │
│     au [telephone].                         │
│                                              │
│     [Retour a l'accueil]                    │
│                                              │
└─────────────────────────────────────────────┘
```

- **Recapitulatif** : toutes les infos de la reservation.
- **Email** : confirmation envoyee si email fourni.
- **Modification** : canal clair pour modifier (appel).
- **Delai** : si pas de confirmation immediate (file d'attente), preciser.

### 4.7 Cookie Banner

```
┌─────────────────────────────────────────────┐
│  🍪 Ce site utilise des cookies.            │
│                                              │
│  Nous utilisons des cookies pour ameliorer  │
│  votre experience et mesurer l'audience.    │
│  En savoir plus dans notre politique de     │
│  confidentialite.                          │
│                                              │
│  [Tout accepter]  [Tout refuser]  [Personnaliser] │
└─────────────────────────────────────────────┘
```

- **Position** : bas d'ecran (desktop) ou panneau complet (mobile).
- **Options** : "Tout accepter", "Tout refuser", "Personnaliser".
- **Refus** : aussi facile que l'acceptation (CNIL).
- **Personnalisation** : categorie par categorie (analytics, maps, video).
- **Pas de traceur non necessaire par defaut** : banner uniquement si des tiers le necessitent.
- **Accessibilite** : role="dialog", aria-label="Gestion des cookies", focus trap.
- **Persistance** : choix stocke (cookie necessaire uniquement) pendant 6 mois.
- **Z-index** : au-dessus de tout sauf modale d'erreur critique.

### 4.8 Page en construction

```
┌─────────────────────────────────────────────┐
│                  [Header]                    │
│                                              │
│           🔧                                 │
│     Cette page est en cours de creation.    │
│                                              │
│     Revenez bientot, elle sera disponible   │
│     prochainement !                         │
│                                              │
│     [Retour a l'accueil]  [Nous contacter]  │
│                                              │
│                  [Footer]                    │
└─────────────────────────────────────────────┘
```

- **Usage** : pages non encore livrees, maintenance planifiee.
- **SEO** : status HTTP 200 (indexable mais sans contenu duplicate) ou 503 (temporaire).
- **Contact** : toujours accessible.

---

## 5. Accessibilite UX (WCAG 2.2 AA)

### 5.1 Focus visible

- **Contour** : 2px solid, couleur contrastee (pas uniquement la couleur : ajouter un outline ou une ombre).
- **Tabindex** : l'ordre de tabulation suit l'ordre visuel (pas de tabindex positif).
- **Skip link** : "Aller au contenu principal" en premier element focusable (sr-only, visible au focus).
- **Focus ring** : desactive uniquement si l'utilisateur a active `prefers-reduced-motion` OU si le focus est gere par le style du composant (ex: bouton avec bordure visible au focus).

### 5.2 Hierarchie de titres

- **H1** : un seul par page, decrit le contenu principal.
- **H2** : sections principales.
- **H3** : sous-sections.
- **Pas de saut de niveaux** : H1 -> H3 est interdit.
- **Tailles visuelles** : la hierarchie visuelle suit la hierarchie HTML.
- **Screen readers** : la structure de titres permet de naviguer par titre.

### 5.3 Labels de formulaires

- **Label visible** : toujours associe au champ (for/id ou wrapper).
- **Placeholder** : jamais le seul label (il disparait a la saisie).
- **Asterisque** : les champs obligatoires sont signales (aria-required="true" + asterisque visible avec explication en haut du formulaire).
- **Instructions** : description sous le label si necessaire (aria-describedby).
- **Groupes** : fieldset + legend pour les groupes de champs (radio, checkbox).

### 5.4 Contraste

- **Texte normal** : >= 4.5:1 (AA).
- **Texte grand** (>= 24px ou >= 18.5px bold) : >= 3:1.
- **Elements non-texte** (bordures, icones) : >= 3:1.
- **Etat hover/focus** : le contraste est maintenu ou ameliore.
- **Couleurs du design system** : chaque combinaison est teste avec un outil de contraste.

### 5.5 Images et medias

- **Alt text** : toutes les images ont un alt descriptif (pas "image" ou "photo").
- **Images decoratives** : alt="" et role="presentation".
- **Videos** : sous-titres si applicables, pas de lecture auto.
- **Cartes** : fallback texte pour les cartes Google (coordonnees en texte).

### 5.6 Navigation

- **Clavier** : tous les elements interactifs sont accessibles au clavier.
- **Ordonnance** : l'ordre de tabulation est logique (header -> main -> footer).
- **Liens** : le texte du lien est descriptif (pas "cliquez ici").
- **Breadcrumbs** : accessibles au clavier, aria-label="Fil d'Ariane".
- **Menu burger** : focus trap, fermeture a Echap.

### 5.7 ARIA

- **Roles** : utilise uniquement quand le role HTML natif n'existe pas.
- **aria-label** : sur les boutons sans texte visible (burger, reseaux sociaux).
- **aria-expanded** : sur les boutons qui ouvrent/ferment des panneaux.
- **aria-live** : sur les messages dynamiques (confirmation, erreur, notification).
- **aria-describedby** : sur les champs de formulaire avec description ou erreur.
- **aria-invalid** : sur les champs en erreur.

---

## 6. Wireframes — Layouts de base

### 6.1 Layout Accueil

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
├─────────────────────────────────────────────┤
│                                              │
│                   HERO                       │
│  [Image pleine largeur]                      │
│  [Titre] [Sous-titre] [CTA]                │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│              PRESENTATION                    │
│  [Texte + Image]                             │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│               OFFRE / SERVICES               │
│  [Grille de 3-4 elements]                    │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│            PREUVE SOCIALE                    │
│  [Avis clients / Galerie / Logos]           │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│               CTA BANNER                     │
│  [Message + Bouton]                          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│            INFOS PRATIQUES                   │
│  [Horaires | Map | Coordonnees]             │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│                FAQ                           │
│  [Accordion 5-6 questions]                   │
│                                              │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

### 6.2 Layout Page contenu (A propos, Services, etc.)

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
├─────────────────────────────────────────────┤
│              TITRE DE PAGE                   │
│  [Breadcrumb]                               │
│  [Titre H1] [Sous-titre]                   │
├─────────────────────────────────────────────┤
│                                              │
│              CONTENU PRINCIPAL               │
│  [Texte + Images]                            │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│            PREUVE SOCIALE                    │
│  [Avis / Galerie]                           │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│               CTA                            │
│  [Bouton + Message]                          │
│                                              │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

### 6.3 Layout Contact

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
├─────────────────────────────────────────────┤
│                                              │
│           NOUS CONTACTER                     │
│  [Titre] [Sous-titre]                       │
│                                              │
├──────────────────┬──────────────────────────┤
│                  │                           │
│   FORMULAIRE     │   COORDONNEES            │
│   [Nom]          │   [Adresse]              │
│   [Email]        │   [Telephone]            │
│   [Telephone]    │   [Email]                │
│   [Message]      │   [Horaires]             │
│   [CNIL mention] │   [Reseaux sociaux]      │
│   [Envoyer]      │   [Map]                  │
│                  │                           │
├──────────────────┴──────────────────────────┤
│                                              │
│                    MAP                       │
│  [Carte pleine largeur]                      │
│                                              │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

### 6.4 Layout Page legale

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │
├─────────────────────────────────────────────┤
│              TITRE DE PAGE                   │
│  [Breadcrumb]                               │
│  [Titre H1]                                 │
├─────────────────────────────────────────────┤
│                                              │
│              CONTENU LEGAL                   │
│  [Texte structuré avec titres]               │
│  [Derniere mise a jour]                     │
│                                              │
├─────────────────────────────────────────────┤
│                  FOOTER                      │
└─────────────────────────────────────────────┘
```

---

## 7. Etats de composants (detail dans DESIGN_SYSTEM_SPECS.md)

Chaque composant du design system possede les etats suivants :

| Etat | Description |
| ---- | ----------- |
| Default | Etat initial, non interacte |
| Hover | Souris au-dessus (desktop uniquement) |
| Focus | Element selectionne au clavier |
| Active / Pressed | En cours de clic/tap |
| Disabled | Inactif, grise, non cliquable |
| Loading | En cours de chargement (formulaire) |
| Error | En erreur (champ de formulaire) |
| Success | Validation reussie |
| Empty | Aucun contenu (liste vide, galerie vide) |

---

## 8. Dependances

- **content-seo** : contenus texte, images, metadata, SEO local, FAQ.
- **solution-architect** : faisabilite technique des formulaires, de la reservation, du multilingue.
- **frontend-engineer** : implementation des layouts, composants, interactions, responsive.
- **backend-engineer** : envoi des formulaires, traitement reservation, protection anti-spam.
- **security-engineer** : protection CSRF, anti-spam, stockage des donnees.
- **legal-compliance** : contenu mentions legales, politique de confidentialite, mentions CNIL formulaires.
- **accessibility-specialist** : audit WCAG 2.2 AA, testing clavier, screen readers.
- **Noah (Gate 1/2)** : validation des parcours, de la navigation, des etats speciaux.

---

## 9. Points ouverts (Gate 2)

1. **CTA sticky mobile** : confirmer que c'est systematique ou optionnel par template.
2. **Cookie banner** : confirmer qu'il n'apparait que si des tiers le necessitent (pas de cookies propres de navigation).
3. **Multilingue** : le selecteur de langue va-t-il dans le header ou le footer ? Quel comportement mobile ?
4. **Galerie** : carousel horizontal OU grille ? Les deux options sont concues, a trancher par template.
5. **Map** : Google Maps (cookie) ou OpenStreetMap (pas de cookie) ? Decision technique a trancher.
6. **Reservation v1** : le formulaire envoie un email ou stocke en base ? A definir avec le backend.
7. **Avis clients** : integre au site ou iframe Google Reviews ? Impact sur les cookies.
8. **Horaires dynamiques** : affichage conditionnel (ouvert/ferme) ou statique ? A definir.
