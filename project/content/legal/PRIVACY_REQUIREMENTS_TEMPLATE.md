# PRIVACY_REQUIREMENTS_TEMPLATE.md — Fiche RGPD par projet client

Version : 0.1 (Phase 0 — Discovery)
Porteur : Legal / Compliance Assistant
Statut : PROPOSE — template a completer pour CHAQUE projet client

> **REGLE** : cette fiche est remplie pour CHAQUE nouveau projet client.
> Aucune donnee reel n'est invente : les champs sont saisis par Noah avec
> les informations du client et du systeme technique.

---

## 1. Identification du projet

| Champ | Valeur |
| ----- | ------ |
| Nom du client | [NOM_DU_CLIENT] |
| Activite | [ACTIVITE] |
| URL du site | [URL] |
| Date de creation | [DATE] |
| Derniere mise a jour | [DATE] |
| Responsable du traitement | [NOM_DU_CLIENT] ([SIRET]) |
| DPO / contact RGPD | [EMAIL_OU_NOM] |

---

## 2. Donnees collectees par le site

### 2.1 Formulaires

| Formulaire | Donnees collectees | Finalite | Base legale |
| ---------- | ------------------ | -------- | ----------- |
| Contact | Nom, email, telephone, message | Prise de contact, reponse a une demande | Interet legitime (art. 6.1.f RGPD) |
| Reservation | Nom, email, date, heure, nombre de personnes | Gestion d'une reservation | Execution d'une mesure prealable a un contrat (art. 6.1.b) |
| Devis | Nom, email, telephone, description du projet | Preparation d'un devis | Execution d'une mesure prealable a un contrat (art. 6.1.b) |
| Adhesion (association) | Nom, prenom, email, coordonnees | Gestion de l'adhésion | Execution d'un contrat (art. 6.1.b) |

### 2.2 Cookies et traceurs

| categorie | Traceur | Finalite | Base legale | Duree |
| --------- | ------- | -------- | ----------- | ----- |
| Necessaires | Cookie de session | Maintien de la session utilisateur | Interet legitimate (technique) | Session |
| Necessaires | Cookie de consentement | Enregistrement du choix cookies | Obligation legale (RGPD/CNIL) | 6 mois |
| [A CONFIGURER] | [Google Analytics] | [Mesure d'audience] | [Consentement] | [13 mois] |
| [A CONFIGURER] | [Google Maps] | [Affichage d'une carte] | [Consentement] | [6 mois] |

> **PRINCIPE** : pas de traceur non necessaire par defaut. Les traceurs tiers
> (analytics, maps, video) sont ajoutés SEULEMENT si le client le souhaite
> ET si le consentement est collecté.

### 2.3 Donnees stockees

| Donnee | Localisation | Duree de conservation | Base legale |
| ------ | ------------ | --------------------- | ----------- |
| Messages du formulaire | [Serveur / email] | [Duree] | Interet legitime |
| Donnees de reservation | [Serveur / base] | [Duree] | Execution d'une mesure prealable |
| Logs de connexion | [Hebergeur] | [Duree] | Obligation legale |

---

## 3. Destinataires des donnees

| Destinataire | Role | Localisation | Donnees accessibles |
| ------------ | ---- | ------------ | ------------------- |
| Noah (prestataire) | Maintenance technique | Lyon, France | Code source, logs techniques |
| [Nom du client] | Responsable du traitement | [VILLE] | Donnees des formulaires |
| [Hebergeur] | Hebergement du site | [PAYS] | Donnees techniques, logs |
| [Service email] | Envoi d'emails (notifications) | [PAYS] | Email du destinataire |
| [Google Analytics] | Mesure d'audience | USA ( transfert hors UE) | Donnees de navigation (si consenti) |

---

## 4. Transferts hors UE

| Service | Pays | Garanties | Necessite |
| ------- | ---- | --------- | --------- |
| [Google Analytics] | [USA] | [Clauses contractuelles types (CCT)] | [Si analytics active] |
| [Google Maps] | [USA] | [CCT] | [Si carte Google activee] |
| [Pas de transfert] | — | — | [Par defaut, aucun transfert] |

> **Principe** : minimiser les transferts hors UE. OpenStreetMap (pas de cookie,
> pas de transfert) est recommandé par defaut pour les cartes.

---

## 5. Droits des personnes

Les visiteurs du site disposent des droits suivants (art. 15 a 22 RGPD) :

| Droit | Description | Modalite d'exercice |
| ----- | ----------- | ------------------- |
| Droit d'acces | Connaitre les donnees traitees | Email a [EMAIL_DU_CLIENT] |
| Droit de rectification | Corriger les donnees inexactes | Email a [EMAIL_DU_CLIENT] |
| Droit a l'effacement | Supprimer les donnees | Email a [EMAIL_DU_CLIENT] |
| Droit a la limitation | Limiter le traitement | Email a [EMAIL_DU_CLIENT] |
| Droit a la portabilite | Recuperer les donnees | Email a [EMAIL_DU_CLIENT] |
| Droit d'opposition | S'opposer au traitement | Email a [EMAIL_DU_CLIENT] |
| Droit de retirer le consentement | Retirer le consentement a tout moment | Email a [EMAIL_DU_CLIENT] |

**Procedure d'exercice des droits** :

1. Le visiteur envoie sa demande a [EMAIL_DU_CLIENT].
2. Le client (responsable du traitement) traite la demande dans un delai de 30 jours.
3. En cas de difficulte, le client peut contacter la CNIL.
4. La reponse est envoyee par email ou courrier, selon la demande.

---

## 6. Sous-traitants

| Sous-traitant | Service | Donnees traitees | Localisation | Accord de traitement |
| ------------- | ------- | ----------------- | ------------ | -------------------- |
| [Hebergeur] | Hebergement web | Code, logs, donnees de formulaire | [VILLE, PAYS] | Oui / A prevoir |
| [Service email] | Envoi d'emails | Email du destinataire | [PAYS] | Oui / A prevoir |
| [Google Analytics] | Mesure d'audience | Donnees de navigation | USA | Oui (CCT) |

---

## 7. Securite des donnees

| Mesure | Statut | Detail |
| ------ | ------ | ------ |
| HTTPS | Obligatoire | Certificat SSL/TLS actif sur tout le site |
| Mots de passe | Obligatoire | Authentification securisee pour l'admin |
| Sauvegardes | Recommande | Plan de sauvegarde documente |
| Mise a jour | Obligatoire | Dependencies et CMS a jour |
| Protection CSRF | Obligatoire | Sur tous les formulaires |
| Anti-spam | Recommande | Honeypot ou reCAPTCHA (si consenti) |

---

## 8. Mentions obligatoires sur le site

Chaque site produit doit comporter :

- **Mentions legales** : identite du responsable, hebergeur, SIRET (si applicable).
- **Politique de confidentialite** : donnees collectees, finalite, base legale, droits, contact.
- **Bandeau cookies** : si des traceurs tiers sont utilises, avec options Accepter/Refuser/Personnaliser.
- **Formulaire CNIL** : mention de la finalite et du caractere facultatif des champs sur chaque formulaire.

---

## 9. Duree de conservation

| Type de donnee | Duree | Justification |
| -------------- | ----- | ------------- |
| Messages de contact | [6 mois / 1 an] | Interet legitime, delai de traitement |
| Donnees de reservation | [Duree du service] | Execution du contrat |
| Cookies de consentement | 6 mois | Recommandation CNIL |
| Cookies de session | Session | Technique |
| Logs de connexion | [12 mois] | Securite |

---

## 10. Points ouverts par projet

| Question | Reponse | Statut |
| -------- | ------- | ------ |
| Le client utilise-t-il Google Analytics ? | [OUI/NON] | A determiner |
| Le client utilise-t-il Google Maps ? | [OUI/NON] | A determiner |
| Le client collecte-t-il des donnees sensibles ? | [OUI/NON] | A determiner |
| Le client a-t-il un DPO ? | [OUI/NON] | A determiner |
| Le client est-il assure RGPD ? | [OUI/NON] | A determiner |

---

## 11. Notes

- Cette fiche est un **template**. Elle est remplie pour CHAQUE projet client.
- Le responsable du traitement est le CLIENT (Noah est sous-traitant, pas responsable).
- En cas de doute sur la conformite RGPD, le client doit consulter un professionnel.
- La CNIL recommande d'informer les personnes sur la finalite, la base legale, les destinataires, la duree de conservation et leurs droits sur chaque formulaire.
- Pour des details sur la conformite RGPD, consulter : https://www.cnil.fr/fr/les-rgles-pour-les-cookies-et-autres-traceurs
