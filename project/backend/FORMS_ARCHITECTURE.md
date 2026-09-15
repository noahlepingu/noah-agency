# Architecture des formulaires (contact + reservation)

Reference : TECHNICAL_ARCHITECTURE.md §8 (ADR-003), REGISTRE_DONNEES.md
(D-DB-04), CLIENT_DATA_VALIDATION.md (C-05), UX.md §4 (etats speciaux),
CLIENT_DATA_SCHEMA.md (reservation, contact).
Statut : **ACTE** (Phase 2 — Backend Engineer).

## 1. Principe

**Aucun backend serveur** (ADR-003, ADR-009, D-DB-01, budget 0 EUR) :

```text
Utilisateur -> Frontend (validation cote client) -> Endpoint tiers (si configure)
                                              `-> fallback mailto (sans backend)
```

- Le site est 100 % statique (Astro SSG) : pas de serveur Node, pas de base
  de donnees, pas de fonction serverless en v1.
- L'envoi d'un formulaire passe par un **service tiers gratuit** (rendu de
  formulaire/webhook) OU par un **fallback mailto** quand aucun endpoint
  n'est configure.
- La **validation est toujours active cote client** (exigence UX §4.4) et
  reutilise les memes regex que la validation du fichier client
  (`scripts/validation-core.mjs` -> `src/utils/forms.js`) : une seule source
  de verite pour les formats (email, tel FR/intl).

## 2. Flux

```text
Formulaire (ContactForm / ReservationForm)
  1. Validation par champ (nom, email, tel, date, creneau, etc.)
  2. Honeypot anti-spam (abandon silencieux si rempli)
  3. buildFormEndpoint() :
       - endpoint configure (Formspree/Web3Forms) -> POST urlencoded
       - sinon email -> mailto (subject + body pre-remplis, navigation)
       - sinon aucun -> formulaire bloque (cas rare, informe dans le rapport)
  4. Etats : erreur par champ (aria-invalid) / erreur globale (role=alert) /
     loading (bouton desactive) / confirmation (role=status)
```

### Contrat de reponse cote serveur (endpoint tiers)

Les services tiers ne repondent pas au format noah-agency : le frontend
consomme donc une **convention documentee** pour la suite (aucun changement
de contrat frontend, cf. point de coherence frontend/backend) :

```jsonc
// Reponse attendue d'un endpoint noah-agency (calque au besoin)
{ "ok": true }                        // ou
{ "ok": false, "message": "...",     // message utilisateur global
  "errors": [{ "field": "email", "message": "..." }] }
```

En v1 avec un service tiers, seul `res.ok` (HTTP) est verifie ; les erreurs
de champ restent la responsabilite de la validation cote client. Si un
prochain client impose une validation serveur supplementaire, ce contrat
permet de brancher un endpoint sans modifier les composants.

## 3. Configuration par client

Dans `content/clients/<slug>/client_data.yaml` (sur 1er client reel) :

```yaml
contact:
  form_endpoint: "https://formspree.io/f/xxxx"   # "" = fallback mailto
reservation:
  form_endpoint: "https://api.web3forms.com/submit"  # "" = fallback mailto
```

`generate-site.mjs` surcharge les defauts du template (`templates/restaurant/
template.yaml` -> `components.contact_form.action`, `reservation_form.action`)
par ces valeurs. Sans endpoint, le fallback **mailto** utilise l'email de
contact du client_data.yaml.

## 4. Formulaire de contact (`ContactForm.astro`)

- Champs : nom (>= 2 car.), email (regex), message (non vide).
- Honeypot : `website` (masque, abandon silencieux).
- i18n : les messages sont passes au script via `data-json-form`
  (plus de texte en dur — correction apportee en Phase 2 backend).
- Envoi : `submitForm()` depuis `../utils/forms` — POST urlencoded vers
  l'endpoint, sinon mailto.
- CNIL : mention d'information sous le formulaire (`ui.form.privacyNote`).

## 5. Formulaire de reservation (`ReservationForm.astro`)

### 5.1 Creneaux statiques (v1, pas de temps reel)

Sources de creneaux (regle C-05) :

1. `reservation.slots` (ou legacy `time_slots`) : horaires explicites ;
2. sinon generation depuis `opening_hours.schedule` du jour (pas de 30 min).

La logique est **pure et statique** (`src/utils/reservation.js`) :

```text
date choisie -> ranges du jour (schedule) -> filtrage des slots explicites
              -> sinon generation 30 min -> tri -> select des heures
```

### 5.2 Etat « aucun creneau » (UX.md §4.3)

Renvoie un etat clair quand :

- le jour est ferme (`day_closed`) : Dimanche sans plage dans l'exemple ;
- une periode de fermeture exceptionnelle couvre la date (`closed_period`) ;
- aucun slot explicite ne tombe dans les plages du jour (`no_slot`) ;
- aucune source de creneaux n'existe (C-05 : cas a eviter, designe a la
  validation comme SHOULD).

Affichage : titre « Aucun creneau disponible », message, CTA « Choisir une
autre date » (reinitialise) et « Nous appeler : [telephone] ». Le select des
heures est desactive tant que la condition persiste.

### 5.3 Validation a l'envoi

Date requise, heure **appartenant aux creneaux calcules de la date** (pas
uniquement dans la liste statique), nombre de personnes requis, nom >= 2,
email valide (utils/forms), telephone FR valide si rempli. Honeypot :
`phone_confirm`.

## 6. Anti-spam

- **Honeypot** champ invisible (contact : `website` ; reservation :
  `phone_confirm`) : si rempli, abandon silencieux (pas de reCAPTCHA par
  defaut, ADR-003).
- Rate-limit / captcha : hors v1 ; re-evaluer au 1er client reel si spam
  constate (decision avec security-engineer).

## 7. Services tiers (sous-traitants)

| Service | Localisation | Donnees transmises | Note RGPD |
| ------- | ------------ | ------------------ | --------- |
| Web3Forms (reference) | UE (recommandation PO-DB-01) | Nom, email, tel, message / reservation | Sous-traitant a declarer dans PRIVACY_REQUIREMENTS ; zero transfert hors UE |
| Formspree | USA (CCT a verifier) | idem | Transfert hors UE a documenter |

Le choix du prestataire se fait **avec le 1er client reel** (PO-DB-01
DECISIONS.md) — backend + legal + Noah. Aucun service tiers n'est actif
sans endpoint configure (`form_endpoint: ""` par defaut = fallback mailto).

## 8. RGPD (coherent avec REGISTRE_DONNEES.md)

- Donnees collectees : uniquement celles des formulaires (finalite : traiter
  la demande / la reservation).
- Durees de conservation **maximales recommandees** : contact 6 mois,
  reservation = duree du service (REGISTRE_DONNEES.md §3).
- Aucune donnee stockee par le systeme : le site est statique, le YAML est
  la seule source de donnees du site (D-DB-02).
- Mention d'information CNIL sous chaque formulaire + lien politique de
  confidentialite (D-LG-06/07).
- Pas de cookie ajoute par les formulaires (localStorage seul pour le choix
  de langue, ADR-004).

## 9. Tests

`npm test` — `node --test tests/*.test.mjs` :

- `tests/forms.test.mjs` : validators (email, tel FR/intl), honeypot,
  `buildFormEndpoint` (http/mailto/none), envoi sans cible.
- `tests/reservation.test.mjs` : jours fermes, periodes de fermeture,
  filtrage/generation des creneaux, aucune source (C-05), prochaine date.
- `tests/validate-client.test.mjs` : codes de sortie 0/2/3/4, regles C-01,
  C-04, C-06, derivations, rapport markdown.

## 10. Points ouverts

- PO-BE-01 : service de formulaire concret (Web3Forms vs Formspree) — avec le
  1er client (PO-DB-01).
- PO-BE-02 : validation serveur supplementaire (contrat `{ ok, errors }`)
  si un client l'exige — endpoints compatibles, composants inchanges.
- PO-BE-03 : envoi de la confirmation par email cote serveur — impossible
  en statique v1 ; a traiter avec un service externe si le 1er client le
  demande (meme arbitrage que PO-BE-01).