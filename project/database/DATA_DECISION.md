# DATA_DECISION.md — Decision : absence de base de donnees

Version : 0.1 (Phase 2 — Developpement)
Porteur : Database Engineer (AGENT 07)
Statut : **CONFIRME** — decision argumentee, alignee sur ADR-009 / D-ARC-09
Reference : ADR-009, CLIENT_DATA_SCHEMA.md, PRIVACY_REQUIREMENTS_TEMPLATE.md,
TECHNICAL_ARCHITECTURE.md (sections 2, 4, 8)

---

## 1. Objet

Ce document confirme formellement la decision **« pas de base de donnees en v1 »**
(ADR-009, D-ARC-09) et documente la strategie de donnees du systeme de
production de sites web statiques.

---

## 2. Analyse des donnees du systeme

### 2.1 Quelles donnees existent ?

| Donnee | Origine | Nature | Stockage |
| ------ | ------- | ------ | -------- |
| `client_data.yaml` (13 sections) | Noah / client | Configuration + contenu | Fichier YAML versionne dans git |
| Templates de pages (textes par defaut) | content-seo | Contenu reutilisable | Fichiers statiques dans `templates/` |
| Tokens CSS (theme.css) | Generation depuis `branding` | Derivee des donnees client | Fichier genere au build (`src/sites/`) |
| Donnees structurees JSON-LD | Generation depuis YAML | Derivee | Fichier genere au build (HTML) |
| Metadata SEO (title, OG, etc.) | Generation depuis YAML | Derivee | Fichier genere au build (HTML) |
| Donnees de formulaires (contact, reservation) | Visiteurs du site | Donnees personnelles | Service tiers (Formspree/Web3Forms) |
| Preference de langue | Visiteurs du site | Donnee technique | localStorage (navigateur) |
| Cookie de consentement | Visiteurs du site | Consentement | localStorage (navigateur, 6 mois) |

### 2.2 Ou vivent ces donnees ?

```text
SOURCE UNIQUE : client_data.yaml (git)
        |
        v
  [Build statique Astro]
        |
        +---> HTML (pages, JSON-LD, meta) ----> Hebergeur statique
        +---> CSS (tokens.css + theme.css) ---> Hebergeur statique
        +---> JS (islands, formulaires) ------> Hebergeur statique
        +---> Images optimisees -------------> Hebergeur statique

FORMULAIRES : POST vers endpoint tiers
        |
        +---> Service de formulaire (sous-traitant) --> Email/client
```

### 2.3 Besoins fonctionnels — verdict

| Besoin | Solution | Base de donnees necessaire ? |
| ------ | -------- | ---------------------------- |
| Contenu des pages | `client_data.yaml` + generation statique | NON |
| Design / theming | Tokens CSS derives du YAML | NON |
| SEO (meta, JSON-LD, sitemap) | Generation statique au build | NON |
| Formulaire de contact | Endpoint tiers (Formspree/Web3Forms) | NON |
| Reservation v1 | Formulaire + validation statique creneaux | NON |
| Multilingue (FR/EN) | Fichiers YAML + generation statique | NON |
| Analytics | Aucun par defaut (ADR-008) | NON |
| Preference langue | localStorage (navigateur) | NON |
| Consentement cookies | localStorage (navigateur) | NON |
| E-commerce / panier | Hors perimetre v1 | A REVOIR (condition limite) |
| Comptes utilisateurs | Hors perimetre v1 | A REVOIR (condition limite) |
| CMS / edition en ligne | Hors perimetre v1 | A REVOIR (condition limite) |
| Reservation temps reel | Hors perimetre v1 (D-PM-07) | A REVOIR (condition limite) |

---

## 3. Decision

**CONFIRMATION : aucune base de donnees en v1.**

### Justification

1. **Aucun besoin fonctionnel ne le requiert.** Le systeme produit des sites
   statiques. Les donnees de configuration vivent dans un fichier YAML versionne.
   Les formulaires sont delieges a un service tiers. Il n'existe aucune donnee
   dynamique stockee en serveur.

2. **Le cahier des charges l'impose.** L'AGENT 07 est explicitement charge de
   determiner si une DB est necessaire, et le cahier des charges stipule :
   > « Pour un simple site vitrine tres simple, aucune base de donnees peut etre
   > la bonne decision. »

3. **Simplicite = valeur.** La philosophie du systeme (cahier des charges
   sections 8, 24-25) est de ne pas ajouter de technologie sans besoin reel.
   Une DB ajouterait : cout d'hebergement, maintenance, sauvegardes, risque
   de securite, complexite de deploiement — tout cela sans benefice fonctionnel
   en v1.

4. **Conformite RGPD par construction.** Sans DB cote systeme, aucune donnee
   personnelle n'est stockee localement. Le site ne collecte rien en dur. Les
   formulaires transitent par un sous-traitant declare. La minimisation des
   donnees (principe RGPD) est respectee par l'architecture meme.

5. **Reversibilite preservee.** La decision n'est pas figee. Si un besoin reel
   apparait (voir section 4), un ADR nouveau sera cree et une DB pourra etre
   introduite de maniere controlee.

---

## 4. Conditions limites — quand reevaluer

La decision « pas de DB » est liee au perimetre v1. Les situations suivantes
necessitent un **arbitrage explicite** (nouveau ADR + validation Noah) :

| Condition | Impact | Solution envisageable | ADR requis ? |
| --------- | ------ | --------------------- | ------------ |
| **E-commerce complet** (catalogue > 20 produits, stock, paiement) | Stock de produits, commandes, stockage paiement | Service externe (Stripe + webhook) ou CMS headless | OUI |
| **Comptes utilisateurs** (espace client, historique, favoris) | Authentification, sessions, donnees persistantes | Service d'auth externe (Auth0/Clerk) ou DB minimale | OUI |
| **CMS / edition en ligne** (le client modifie son contenu) | Donnees dynamiques, edition en temps reel | CMS headless (Decap/Strapi) ou DB + admin | OUI |
| **Reservation temps reel** (creneaux dynamiques, confirmation auto) | Stockage des creneaux, disponibilite en temps reel | Service externe (TheFork/Cal.com) ou DB minimale | OUI |
| **Newsletter / email marketing** (> 500 contacts) | Stockage de contacts, gestion consentement | Service externe (Brevo/Mailchimp) — pas de DB maison | NON (service tiers) |
| **Multi-utilisateurs admin** (plusieurs personnes modifient le site) | Gestion droits, audit trail | CMS headless ou DB + auth | OUI |

**Regle** : toute reintroduction de DB ou de stockage serveur passe par un
nouveau ADR documente, une evaluation RGPD (AGENT 08), et une validation Noah
(Gate 1/2).

---

## 5. Strategie de donnees et sauvegardes

### 5.1 Fichier `client_data.yaml` — source unique

| Aspect | Strategie |
| ------ | --------- |
| **Stockage** | Fichier YAML dans `content/clients/<slug>/client_data.yaml` |
| **Versionnement** | Git (depot noah-agency) — historique complet des modifications |
| **Sauvegarde** | Le depot git est la sauvegarde. Pas de backup externe necessaire en v1 (donnees reproductibles depuis le client) |
| **Acces** | Noah (proprietaire du depot) ; pas d'acces externe |
| **Integrite** | Validation JSON Schema au build (`schemas/client_data.schema.json`) — champs REQUIRED bloquants |
| **Modification** | Manuelle (Noah edite le YAML) ou via script d'extraction (futur) |

### 5.2 Donnees des formulaires — service tiers

| Aspect | Strategie |
| ------ | --------- |
| **Stockage** | Chez le service de formulaire (Formspree/Web3Forms) — pas de stockage local |
| **Duree de conservation** | Determinee par le service tiers (Formspree : 30 jours par defaut, configurable ; Web3Forms : 30 jours) |
| **Droit d'effacement** | Le visiteur contacte le client (responsable du traitement) ; le client supprime via l'interface du service tiers |
| **Sauvegarde** | Pas de sauvegarde cote systeme. Le client peut exporter depuis l'interface du service tiers |
| **Notification** | Le client recoit un email a chaque envoi de formulaire (configurable) |

### 5.3 Donnees en localStorage — navigateur

| Donnee | Duree | Suppression |
| ------ | ----- | ----------- |
| Preference de langue | Indefinie (localStorage) | Effacee si l'utilisateur vide ses donnees de navigation |
| Consentement cookies | 6 mois (recommandation CNIL) | Gere par `utils/consent.js` |

---

## 6. Politique de conservation des donnees personnelles

En coherence avec `PRIVACY_REQUIREMENTS_TEMPLATE.md` (legal-compliance) et les
recommandations de la CNIL :

### 6.1 Donnees collectees via les formulaires

| Formulaire | Donnees | Finalite | Base legale | Duree de conservation max. |
| ---------- | ------- | -------- | ----------- | -------------------------- |
| Contact | Nom, email, telephone, message | Prise de contact, reponse | Interet legitime (art. 6.1.f) | **6 mois** apres dernier echange |
| Reservation | Nom, email, date, heure, nb personnes | Gestion reservation | Mesure prealable a un contrat (art. 6.1.b) | **Duree du service** (jour de la reservation + 48h) |
| Devis | Nom, email, telephone, description | Preparation devis | Mesure prealable a un contrat (art. 6.1.b) | **3 mois** apres envoi du devis |
| Adhesion | Nom, prenom, email, coordonnees | Gestion adhesion | Execution d'un contrat (art. 6.1.b) | **Duree de l'adhesion** |

### 6.2 Droits des personnes

Chaque site produit inclut dans sa politique de confidentialite :
- Mention de la finalite et du caractere facultatif des champs sur chaque formulaire
- Lien vers le service tiers (sous-traitant declare)
- Email de contact du client (responsable du traitement) pour exercer les droits
- Procedure d'exercice des droits (delai de 30 jours)

### 6.3 Sous-traitant (service de formulaire)

| Sous-traitant | Service | Donnees | Localisation | A noter |
| ------------- | ------- | ------- | ------------ | ------- |
| Formspree (ou equivalent) | Envoi de formulaires | Donnees des formulaires | USA (serveurs) | Transfert hors UE ; clauses contractuelles types (CCT) a verifier avec le 1er client |
| Web3Forms (alternative) | Envoi de formulaires | Donnees des formulaires | UE (Allemagne) | Pas de transfert hors UE ; preferable RGPD |

> **Recommandation** : privilégier un service UE (Web3Forms) ou documenter les
> CCT pour un service hors UE (Formspree). Decision concrete avec le 1er client.

---

## 7. Conclusion

| Point | Statut |
| ----- | ------ |
| Base de donnees necessaire ? | **NON** |
| ADR-009 / D-ARC-09 confirme ? | **OUI** |
| Strategie de donnees documentee ? | **OUI** |
| Conservation RGPD documentee ? | **OUI** |
| Conditions limites identifiees ? | **OUI** (5 conditions) |
| Points ouverts | Service de formulaire concret (Formspree vs Web3Forms) — a trancher avec le 1er client |

---

## 8. Dependances

- **Solution Architect** : ADR-009, TECHNICAL_ARCHITECTURE.md sections 2, 4, 8
  — alignement architectural confirme.
- **Legal / Compliance** : PRIVACY_REQUIREMENTS_TEMPLATE.md — durees de
  conservation et sous-traitants coherents.
- **Content / SEO** : CLIENT_DATA_SCHEMA.md — schema de validation du YAML
  (complete par CLIENT_DATA_VALIDATION.md ci-joint).
- **Backend Engineer** : implementation des formulaires (endpoint tiers,
  progressive enhancement, fallback).
- **DevOps** : hebergeur statique (pas de DB a heberger), sauvegardes = git.

---

## 9. Points ouverts

| ID | Point | Dependance | Statut |
| ---- | ----- | ---------- | ------ |
| PO-DB-01 | **Service de formulaire concret** : Formspree (USA) ou Web3Forms (UE) ? Impact RGPD (transfert hors UE vs non) | Backend + Legal + Noah (1er client) | OUVERT |
| PO-DB-02 | **Durees de conservation exactes** : a adapter selon le service choisi (les durees ci-dessus sont les max recommendees) | Legal + Noah | OUVERT |
| PO-DB-03 | **Export des donnees formulaire** : le client a-t-il besoin d'exporter les donnees du service tiers ? (fonctionnalite du service, pas du systeme) | Noah | OUVERT |
