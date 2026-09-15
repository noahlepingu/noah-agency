# CONTENT_GUIDELINES.md — Bonnes pratiques de redaction

Version : 0.1 (Phase 0 — Discovery)
Porteur : Content / SEO (AGENT 03)
Statut : PROPOSE — a valider avec Noah (Gate 1/2)
Reference : CONTENT_LIBRARY.md, SEO_SYSTEM.md, UX.md (parcours B),
CLIENT_DATA_SCHEMA.md, REQUIREMENTS.md (FR-SEO, NFR-ACC)

---

## 1. Principes directeurs

1. **Clarte** : le visiteur comprend en 3 secondes. Pas de jargon, pas de
   phrases complexes.
2. **Concision** : dire le plus en moins de mots. Respecter les limites de
   caracteres par composant.
3. **Action** : chaque page a un objectif (reserver, contacter, decouvrir).
   Le CTA est toujours present et clair.
4. **Cohrence** : meme ton sur tout le site. Un site qui parle comme un
   formulaire ne vende pas.
5. **Local** : ancrer le contenu dans la ville et le quartier. Le visiteur
   doit savoir que le commerce est proche.

---

## 2. Ton par template secteur

| Template | Ton | Regles |
| -------- | --- | ------ |
| Restaurant | Chaleureux, appetissant, convivial | Utiliser le "vous" ou le "tu" selon le client. Eviter les mots trop formels. |
| Artisan | Fiable, professionnel, accessible | Ton rassurant. Mettre en avant l'experience et la competence. |
| Commerce | Moderne, attrayant, direct | Ton dynamique. Mettre en avant les produits et les promotions. |
| Independant | Expert, proche, confiant | Ton confidentiel. Mettre en avant l'expertise et la proximite. |
| Association | Engage, chaleureux, inclusif | Ton collectif ("nous"). Mettre en avant les valeurs et les missions. |

**Regle universelle** : le ton doit correspondre a la personnalite du client
telle que decouverte lors du brief. Noah adapte.

---

## 3. Longueur des textes

### 3.1 Par composant

| Composant | Longueur cible | Maximum | Notes |
| --------- | -------------- | ------- | ----- |
| Hero titre | 3-6 mots | 10 mots | Phrase courte, percutante. Pas de point. |
| Hero sous-titre | 10-20 mots | 30 mots | Description courte de l'activite + ville. |
| Presentation (bloc) | 50-100 mots | 150 mots | 2-3 paragraphes maximum. |
| Service (description) | 15-30 mots | 50 mots | Une phrase ou deux. |
| Avis client | 20-50 mots | 100 mots | Temoignage reel, authentique. |
| FAQ (reponse) | 30-60 mots | 100 mots | Directe, sans detour. |
| Meta description | 120-160 caracteres | 160 caracteres | Inclure la ville + 1 mot-cle. |
| Title tag | 30-60 caracteres | 60 caracteres | Nom + activite + ville. |

### 3.2 Par page

| Page | Nombre de mots recommande | Maximum |
| ---- | ------------------------- | ------- |
| Accueil | 300-500 mots | 700 mots |
| A propos | 200-400 mots | 500 mots |
| Menu / Services | Variable (selon le nombre) | — |
| Contact | 100-200 mots | 300 mots |
| FAQ | 200-400 mots | 600 mots |
| Mentions legales | 300-500 mots | — |
| Confidentialite | 300-500 mots | — |

---

## 4. CTA (Call to Action)

### 4.1 Formulation

| Template | CTA principal | CTA secondaire |
| -------- | ------------- | -------------- |
| Restaurant | "Reserver maintenant" / "Reserver" | "Voir la carte" / "Decouvrir nos menus" |
| Artisan | "Demander un devis gratuit" | "Voir nos realisations" |
| Commerce | "Decouvrir nos produits" / "Voir le catalogue" | "Voir les promos" |
| Independant | "Prendre rendez-vous" | "Voir les prestations" |
| Association | "Nous rejoindre" / "Devenir membre" | "Voir nos actions" |

### 4.2 Regles

- **Verbe a l'infinitif ou a l'imperatif** (pas de conditionnel).
- **Clairement visible** : au moins un CTA above the fold sur chaque page.
- **Cohrent** : le meme CTA principal sur toutes les pages du meme site.
- **Accessible** : texte descriptif dans le bouton (pas "Cliquez ici").
- **Mobile** : CTA sticky en bas d'ecran sur mobile pour l'action principale.

### 4.3 CTA alternatifs

| Action | Texte | Lien |
| ------ | ------ | ---- |
| Appeler | "Nous appeler" | `tel:+334XXXXXXXX` |
| Email | "Nous ecrire" | `mailto:[email]` |
| Horaires | "Voir les horaires" | Ancrage vers section horaires |
| Avis | "Lire les avis" | Ancrage vers section avis |
| Reseau social | "Suivez-nous sur [Instagram]" | Lien externe |

---

## 5. SEO local — Consignes de redaction

### 5.1 Integration naturelle des mots-cles

**Faire** :
```
"Restaurant traditionnel au coeur du 3e arrondissement de Lyon"
"Plombier intervenant a Lyon et Villeurbanne"
"Votre coiffeur a Lyon Part-Dieu"
```

**Ne pas faire** :
```
"Restaurant Lyon meilleur restaurant Lyon prix restaurant Lyon"
"Plombier plomberie plomberie Lyon plombier Lyon"
```

### 5.2 Ancrage geographique

Inclure dans les contenus :
- Le nom de la ville (Lyon).
- Le quartier ou l'arrondissement.
- Les villes voisines couvertes (zone de chalandise).
- Les points de repere proches (metro, marche, place).

### 5.3 Meta descriptions

- 120-160 caracteres.
- Inclure la ville et au moins 1 mot-cle principal.
- Terminer par un CTA implicite ("Reservez", "Decouvrez", "Contactez").
- Eviter les guillemets doubles.

---

## 6. Consistance du contenu

### 6.1 Regles transversales

- **Orthographe et grammaire** : aucune erreur. Relecture systematique.
- **Typographie** : espace insécable avant les deux-points, points d'interrogation
  et d'exclamation. Pas d'espace avant le point.
- **Nombres** : en toutes lettres pour 1-9, en chiffres pour >= 10 (sauf
  pour les prix : toujours en chiffres).
- **Prix** : "A partir de 45 EUR" ou "45 EUR" — pas "45.00 EUR". Euro
  apres le chiffre (usage francais).
- **Horaires** : format "11h30" (pas "11:30" dans le texte, OK dans le code).
- **Telephone** : "04 XX XX XX XX" dans le texte, "+33 4 XX XX XX XX" dans
  les liens tel:.
- **Adresse** : format complet (numero + rue + code postal + ville).
- **Dates** : "15 septembre 2026" (pas "15/09/2026" dans le texte).

### 6.2 Cohrence visuelle

- Pas de tout-en-majuscules (sauf logo).
- Pas de gras excessif (1-2 mots maximum par paragraphe).
- Listes a puces pour les services/prestations (pas de paragraphes en bloc).
- Espacement entre sections (composant gap du design system).

---

## 7. Checklist de validation avant livraison

Chaque contenu est valide par Noah (Gate 2 et Gate 3) a l'aide de cette
checklist.

### 7.1 Contenu general

- [ ] Tous les textes sont en francais correct (orthographe, grammaire, syntaxe)
- [ ] Le ton est coherent sur tout le site (1 seule personnalite)
- [ ] Aucun placeholder `[...]` n'est present dans le contenu publie
- [ ] Aucune donnee client inventee (SIRET, adresse, telephone, prix)
- [ ] Toutes les images ont un alt text descriptif
- [ ] Les prix et tarifs correspondent aux informations du client
- [ ] Les horaires correspondent aux donnees du client_data.yaml

### 7.2 SEO

- [ ] Chaque page a un H1 unique et descriptif
- [ ] La hiérarchie de titres est respectee (H1 > H2 > H3, pas de saut)
- [ ] Le title tag fait 30-60 caracteres et inclut la ville
- [ ] La meta description fait 120-160 caracteres et inclut la ville
- [ ] Les URLs sont lisibles et coherentes (slugs)
- [ ] Le canonical est defini pour chaque page
- [ ] Le sitemap.xml est a jour et inclut toutes les pages indexables
- [ ] Les donnees structurees JSON-LD sont presentes et valides
- [ ] Open Graph est defini (title, description, image)
- [ ] Les liens internes sont descriptifs (pas "cliquez ici")
- [ ] La FAQ est structuree en FAQPage schema.org

### 7.3 Accessibilite

- [ ] Le contraste du texte est >= 4.5:1 (AA)
- [ ] Les images ont un alt texte (ou alt="" si decoratives)
- [ ] Les formulaires ont des labels visibles
- [ ] Les erreurs de formulaire sont accessibles (aria-describedby, aria-invalid)
- [ ] Les messages de confirmation sont accessibles (role="status")
- [ ] La navigation au clavier fonctionne
- [ ] Le focus est visible sur tous les elements interactifs

### 7.4 CTA et parcours

- [ ] Le CTA principal est visible above the fold sur chaque page
- [ ] Le CTA mene vers la bonne page / le bon formulaire
- [ ] Chaque formulaire a un message de confirmation
- [ ] Chaque formulaire a un message d'erreur clair
- [ ] Le CTA sticky mobile est present sur les pages d'action
- [ ] Le lien telephone est fonctionnel (format tel:+33...)
- [ ] Le lien email est fonctionnel (format mailto:)

### 7.5 Pages legales

- [ ] Les mentions legales identifient le responsable (nom, SIRET, adresse)
- [ ] Les mentions legales identifient l'hebergeur
- [ ] La politique de confidentialite decrit les donnees collectees
- [ ] La politique de confidentialite indique les droits des personnes
- [ ] Les mentions CNIL sont presentes sur chaque formulaire
- [ ] Le lien vers la politique de confidentialite est present dans le footer
- [ ] Le lien vers les mentions legales est present dans le footer

### 7.6 Images

- [ ] Toutes les images sont optimisees (WebP, poids < 200 Ko pour les carte)
- [ ] Les dimensions sont declarees (width/height pour CLS)
- [ ] Le lazy loading est active sur les images hors-screen
- [ ] Les images hero sont a la bonne resolution (1920x1080 min)
- [ ] Les images OG font 1200x630

### 7.7 Performance

- [ ] La page accueil fait < 500 Ko hors media
- [ ] Les fonts sont optimisees (preconnect, font-display: swap)
- [ ] Le CSS est minimal (pas de framework inutile)
- [ ] Le JS est minimal (pas de jQuery, vanilla ou leger)
- [ ] Le lazy loading est active

---

## 8. Processus de production du contenu

```
[1] Assemblage initial
    │   Remplacement des placeholders dans les templates
    │   Verifications automatiques (longueur, format)
    │
    ▼
[2] Personnalisation
    │   Noah adapte le ton, les textes, les details
    │   Integration des donnees client reelles
    │
    ▼
[3] Relecture SEO
    │   Verification des titles, meta, H1, donnees structurees
    │   Validation des contrastes
    │
    ▼
[4] Relecture accessibilite
    │   Verification des alt, labels, ARIA
    │
    ▼
[5] Validation Noah (Gate 2)
    │   Checklist complete
    │   Corrections si necessaire
    │
    ▼
[6] Validation client (Gate 3)
    │   Le client valide le contenu final
    │
    ▼
[7] Publication
    │   Contenu live sur le site
    │
    ▼
[8] Maintenance contenu
    │   Mises a jour periodiques (horaires, tarifs, photos)
```

---

## 9. Dependances

- **UX Designer** : limites de caracteres par composant, etats speciaux,
  structure des pages.
- **PM** : user stories pour s'assurer que chaque contenu couvre le bon
  objectif utilisateur.
- **Legal / Compliance** : contenu des mentions legales et de la politique
  de confidentialite. Mentions CNIL sur les formulaires.
- **Frontend Engineer** : integration des textes, limites de caracteres
  dans le CSS/HTML.
- **QA Engineer** : verification de la coherence des contenus en phase de test.
- **Accessibility Specialist** : validation des contenus accessibles.

---

## 10. Points ouverts (Noah a arbitrer)

1. **Tutoiement vs vouvoiement** : par defaut le vouvoiement ? Choisir
   pour chaque client au moment du brief ?
2. **Emoji dans les textes** : interdits dans le contenu, ou utilises avec
   parcimonie (FAQ, etats speciaux) ?
3. **Style guide sectoriel** : faut-il creer un mini guide de style par
   template (restaurant chaleureux, artisan pro, etc.) ?
4. **Limite de mots par page** : les limites proposees sont-elles adaptees ?
5. **Contenu EN** : si multilingue, quelles regles de traduction
   (traduction directe ou adaptation culturelle) ?
6. **Date de mise a jour** : afficher "Derniere mise a jour : [date]" sur
   quelles pages ? (Legales oui, autres ?)
