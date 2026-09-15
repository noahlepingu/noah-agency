# REGISTRE_DONNEES.md — Registre des donnees manipulees par le systeme

Version : 0.1 (Phase 2 — Developpement)
Porteur : Database Engineer (AGENT 07)
Statut : **PROPOSE** — registre pratique RGPD, manuellement tenu a jour
Reference : PRIVACY_REQUIREMENTS_TEMPLATE.md, RGPD (reglement UE 2016/679),
CNIL (recommandations cookies et formulaires), ADR-003, ADR-009

> **BUT** : identifier, pour chaque donnee traverse par le systeme, sa nature,
> son origine, sa finalite, sa base legale, sa duree de conservation et les
> droits afferents. Ce registre concerne le **systeme de production** (l'agence
> Noah). Chaque site client produit a son propre registre detaille via
> `PRIVACY_REQUIREMENTS_TEMPLATE.md` (responsable du traitement = le client).

---

## 1. Vue d'ensemble des flux de donnees

```text
                           SYSTEME NOAH-AGENCY
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│   DONNEES DU SITE (client_data.yaml)                                  │
│   - donnees d'entreprise, coordonnees, horaires, avis, menu           │
│   - stockage : FICHIER YAML DANS GIT (depot noah-agency)              │
│   - usage : generation du site statique (build)                       │
│                                                                       │
│   DONNEES DE FORMULAIRE (site en production)                          │
│   - nom, email, telephone, message, reservation                       │
│   - stockage : SERVICE TIERS (Formspree/Web3Forms)                    │
│   - zero stockage cote systeme                                        │
│                                                                       │
│   DONNEES NAVIGATEUR (site en production)                             │
│   - langue preferee, consentement cookies                             │
│   - stockage : localStorage du visiteur                               │
│                                                                       │
│   DONNEES TECHNIQUES                                                  │
│   - logs build, git history, metrics                                  │
│   - stockage : machine de Noah / hebergeur depot                      │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Registre detaille

### 2.1 Donnees de chaque site (client_data.yaml)

| Donnee | Exemples | Origine | Usage | Ou ca vit | Duree |
| ------ | -------- | ------- | ----- | --------- | ----- |
| Identite de l'activite | nom, description, slogan, categorie | Noah / client (brief discovery) | Contenu du site, meta SEO | Git (`content/clients/<slug>/`) | Duree du projet client + archive git |
| Identite visuelle | couleurs hex, polices, logo | Noah / client (brief design) | Generation theme.css, header/footer | Git | Duree du projet client + archive git |
| Horaires & fermetures | schedule, closed_periods | Client | Affichage horaires, JSON-LD, validation reservation | Git | Duree du projet client + archive git |
| Reseaux sociaux | URLs facebook, instagram... | Client | Footer, SocialLinks, SEO | Git | Duree du projet client + archive git |
| SEO local | city, district, keywords, domain | Client + content-seo | meta, sitemap, og, JSON-LD | Git | Duree du projet client + archive git |
| Services / menu | services[], menu.categories[] | Client | Pages services / menu | Git | Duree du projet client + archive git |
| Contact | adresse, tel, email, lat/lng | Client | Footer, contact, map | Git | Duree du projet client + archive git |
| Legal | SIREN, SIRET, hebergeur, mediateur | Client (jamais invente) | Mentions legales, JSON-LD | Git | Duree du projet client + archive git |
| Avis | reviews.items[], source, min_count | Client / source externe reelle | Section temoignages, JSON-LD | Git | Duree du projet client + archive git |
| Reservation | enabled, method, slots | Client / Noah | Page reservation, validation creneaux | Git | Duree du projet client + archive git |
| Template & maintenance | type, package, multilingual, plan | Noah (package vende) | Generation, config build | Git | Duree du projet client + archive git |

**Analyse** : ces donnees ne sont **pas des donnees personnelles de visiteurs**
mais des donnees **professionnelles du client** (entreprise). Elles ne sont ni
collectees sur le formulaire ni publiees hors du site du client lui-meme.

**Responsable** : Noah (systeme) / le client (donnees de son entreprise).

### 2.2 Donnees de formulaires (site en production)

| Donnee | Formulaire | Finalite | Base legale | Duree max. recommendation | Ou ca vit |
| ------ | ---------- | -------- | ----------- | ------------------------- | --------- |
| Nom | contact, reservation, devis | Identification de l'expediteur | Interet legitime (6.1.f) / mesure precontractuelle (6.1.b) | 6 mois (contact), 3 mois (devis), duree du service (reservation) | Service tiers (Formspree/Web3Forms) + email client |
| Email | tous | Reponse, confirmation | Idem | Idem | Service tiers + email client |
| Telephone | contact, reservation, devis | Contact rapide | Interet legitime (6.1.f) | Idem | Service tiers |
| Message | contact, devis | Contenu de la demande | Interet legitime (6.1.f) / 6.1.b | Idem | Service tiers |
| Date / heure / nb personnes | reservation | Gestion du creneau | Mesure precontractuelle (6.1.b) | Jour de la reservation + 48h | Service tiers + email client |
| Description du projet | devis | Preparation devis | 6.1.b | 3 mois | Service tiers |

**Regle systeme** : l'agence ne stocke **aucune** de ces donnees. Le systeme
n'a pas de serveur, pas de base, pas de log de formulaires. Toute la collecte
est deligee au service tiers, declare sous-traitant.

### 2.3 Sous-traitant : service de formulaire

| Sous-traitant | Role | Donnees | Localisation | Transfert hors UE | Garantie |
| ------------- | ---- | ------- | ------------ | ----------------- | -------- |
| Formspree (reference possible) | Reception + notification des envois | Donnees des formulaires | USA | OUI (USA) | CCT a verifier avant utilisation |
| Web3Forms (alternative possible) | Reception + notification des envois | Donnees des formulaires | UE (Allemagne) | NON | RGPD UE |

> **Recommandation AGENT 07** : preferer Web3Forms (UE, pas de transfert hors UE)
> ou documenter les CCT de Formspree dans la politique de confidentialite du
> site client. Decision avec le 1er client (point ouvert PO-DB-01).

### 2.4 Donnees navigateur (site en production)

| Donnee | Type | Finalite | Base legale | Duree | Ou ca vit |
| ------ | ---- | -------- | ----------- | ----- | --------- |
| Langue preferee | localStorage | Affichage de la langue choisie | Interet legitime (fonctionnel) | Jusqu'a effacement navigateur | Navigateur du visiteur |
| Consentement cookies | localStorage | Enregistrement du choix (si tiers actives) | Obligation legale (CNIL) | 6 mois | Navigateur du visiteur |

> **Aucun cookie propre** n'est pose par les sites produits (ADR-004, ADR-007,
> ADR-008, D-LG-05). Pas de bandeau cookies sauf si le client exige un tiers.

### 2.5 Donnees techniques du systeme

| Donnee | Origine | Usage | Ou ca vit | Duree |
| ------ | ------- | ----- | --------- | ----- |
| Logs de build | CI / machine locale | Diagnostic | Machine Noah / CI | Non conserve |
| Historique git | Commits | Versionnement, trace des modifications | Hebergeur de depot (a nommer) | Historique complet |
| Metrics systeme (KPIs) | Suivi projets (PM) | Mesure du systeme | Fichiers PM / outils documentes | Selon politique PM |

---

## 3. Conservation des donnees personnelles — synthese recommandee

| Categorie | Duree max. | Base | Action automatique ? |
| --------- | ---------- | ---- | -------------------- |
| Messages contact | 6 mois apres dernier echange | Interet legitime | NON (action manuelle client via interface tiers) |
| Demandes devis | 3 mois | Mesure precontractuelle | NON |
| Reservations | Jour du service + 48h | Execution contrat | NON |
| Adhesions | Duree de l'adhesion + delais comptables | Contrat / obligation legale | NON |
| Consentement cookies | 6 mois (CNIL) | Obligation legale | OUI (ledit dans le navigateur) |
| Logs (si un jour) | 12 mois max. | Securite | NON |

> **Note** : ces durees sont des **maxima recommandés** (coherents avec
> PRIVACY_REQUIREMENTS_TEMPLATE.md section 9). Le systeme n'applique aucune
> suppression automatique cote serveur puisqu'il ne stocke rien. La suppression
> est a la main du client (responsable du traitement), via l'interface du
> service tiers — documentee dans la politique de confidentialite du site.

---

## 4. Droits des personnes

Chaque site produit doit permettre au visiteur d'exercer ses droits RGPD
(art. 15-22) :

| Droit | Modalite sur les sites produits |
| ----- | ------------------------------- |
| Acces | Email du client (responsable du traitement) — dans la politique de confidentialite |
| Rectification | Idem |
| Effacement | Email au client **+ action manuelle dans l'interface du service tiers** |
| Limitation | Email au client |
| Portabilite | Export depuis l'interface du service tiers (si propose) |
| Opposition | Email au client |
| Retrait du consentement | Idem (si consentement requis — tiers uniquement) |

**Procedure recommandee** (reprise du template legal) :
1. Le visiteur envoie sa demande a l'email du client.
2. Le client traite sous 30 jours.
3. En cas de difficulte, contact CNIL.

---

## 5. Comment ce registre reste a jour

| Evénement | Action | Responsable |
| --------- | ------ | ----------- |
| Nouveau projet client | Remplir `PRIVACY_REQUIREMENTS_TEMPLATE.md` du projet | Legal / Noah |
| Nouveau sous-traitant (formulaire, hebergeur, analytics) | Mettre a jour ce registre + template legal | Database / Legal |
| Nouveau flux de donnees (newsletter, e-commerce, comptes) | **REEVALUER** la decision DB (DATA_DECISION.md section 4) + mettre a jour le registre | Database / Security / Legal |
| Modification de duree de conservation (service tiers) | Verifier et ajuster les politiques des sites concernes | Legal / Noah |
| Tiers actives chez un client (Google Maps, analytics) | Mettre a jour la politique du site + banner cookies (ADR-007/008) | Security / Legal |
| Revue annuelle | Audit du registre (au moins 1x/an, ou a chaque changement notable) | Database / Legal |

> Le registre est un **document vivant**, pas un artefact statique : il est
> revise a chaque evolution du systeme ou de ses sous-traitants.

---

## 6. Conclusion

| Point | Etat |
| ----- | ---- |
| Donnees stockees par le systeme | Aucune donnee personnelle (client_data.yaml = donnees pro du client) |
| Donnees collectees sur les sites | Via service tiers uniquement (sous-traitant declare) |
| Base de donnees | **AUCUNE** (conforme ADR-009) |
| Migrations | **AUCUNE** (pas de schema serveur) |
| Sauvegardes | Git (source) + interfaces des services tiers (formulaires) |

---

## 7. Dependances

- **Legal / Compliance** : PRIVACY_REQUIREMENTS_TEMPLATE.md (durees, base
  legale, droits), politique de confidentialite des sites.
- **Security (AGENT 08)** : validation des sous-traitants (donnees,
  transferts hors UE), zero-cookie par defaut.
- **DevOps** : hebergeur du depot (sauvegardes git), hebergeur des sites
  (identite pour mentions legales).
- **Backend Engineer** : implementation des formulaires (endpoint tiers,
  mentions CNIL sur les formulaires).
- **Noah / PM** : choix du service tier (PO-DB-01), politique B2C (mediateur).