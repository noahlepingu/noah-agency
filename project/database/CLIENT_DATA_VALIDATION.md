# CLIENT_DATA_VALIDATION.md — Specs de validation du fichier client_data.yaml

Version : 0.1 (Phase 2 — Developpement)
Porteur : Database Engineer (AGENT 07)
Statut : **PROPOSE** — spec pour le backend-engineer (implementation) et
content-seo (complement schema)
Reference : CLIENT_DATA_SCHEMA.md (schema, niveaux REQUIRED/SHOULD/COULD),
ADR-002 (pipeline validate -> generate -> build),
TECHNICAL_ARCHITECTURE.md (section 4, pipeline de generation)

> Ce document specifie le moteur de validation du fichier `client_data.yaml`.
> Il est le **contrat** entre la donnee (schema content-seo) et le generateur
> (script `scripts/validate-client.mjs` implemente par backend-engineer).

---

## 1. Principes

1. **Le schema de reference est `content/CLIENT_DATA_SCHEMA.md`** (structure,
   sections, champs). Ce document n'ajoute que les regles d'implementation :
   types, formats, contraintes croisees, comportement du generateur.
2. **Trois niveaux d'obligation** (D-CS-02) :
   - `REQUIRED` : **bloque** la generation. Le champ est liste dans le rapport
     avec une action requise.
   - `SHOULD` : **alerte**. Le site se genere, mais le rapport demande une
     action.
   - `COULD` : **information**. Le site se genere ; le champ manquant est
     notifie sans action requise.
3. **La regle d'or (cahier des charges section 11) est preservee** : l'IA ne
   fabrique jamais une donnee client. Un champ vide reste vide jusqu'a saisie
   par Noah.

---

## 2. Comportement du generateur

### 2.1 Pipeline

```text
client_data.yaml soumis
        |
        v
[1] Parse YAML (erreur syntaxe -> STOP)
        |
        v
[2] Validation structurelle (types, formats, enums)
        |   Erreurs bloqueuses -> STOP + rapport
        |   Erreurs simples -> liste + continuation
        v
[3] Validation contextuelle (contraintes croisees)
        |   Bloquante si REQUIRED contextuel manquant
        v
[4] Evaluation REQUIRED / SHOULD / COULD
        v
[5] Rapport de validation (format specifie section 6)
        |
        +---> EXPORT : rapport OK ? -> generation autorisee
                   rapport avec REQUIRED manquants -> generation BLOQUEE
```

### 2.2 Code de sortie (pour scripts)

| Situation | Code de sortie | Message |
| --------- | -------------- | ------- |
| Validation OK (aucun REQUIRED manquant) | 0 | `VALIDATION OK` |
| Erreur YAML (parse) | 1 | `ERREUR YAML : <detail>` |
| Champs REQUIRED manquants | 2 | `EN ATTENTE DE DONNEES : <N> champ(s) bloquant(s)` |
| Erreur de format bloquante (regex/enum invalide) | 3 | `ERREUR FORMAT : <champ>` |
| Fichier introuvable | 4 | `FICHIER INTROUVABLE : <chemin>` |

> Le script `validate-client.mjs` doit retourner ces codes pour permettre
> l'enchainement dans le pipeline (build refuse si code != 0, cf. 2.3).

### 2.3 Regle de blocage

- Le build **refuse de continuer** si :
  - un champ `REQUIRED` est vide (regle D-CS-02),
  - une erreur de format **bloquante** est detectee (regex/enum/type invalide),
  - une contrainte croisee `REQUIRED` est non satisfaite,
  - `seo.domain` est absent ou invalide (ajout propose par l'architect,
    requis pour canonical/sitemap/OG — tant que content-seo ne l'a pas ajoute
    au schema, la validation le traite comme REQUIRED au build, cf. section 7).
- Les erreurs SHOULD/COULD ne bloquent jamais.

---

## 3. Types de champs et formats

### 3.1 Types primitifs

| Type | Controle | Exemple(s) |
| ---- | -------- | ---------- |
| `string` | Texte libre (encodage UTF-8) | `"Chez Marie"` |
| `string-limited` | Texte libre avec longueur min/max | voir table 3.3 |
| `email` | Regex email standard | `contact@chezmarie.fr` |
| `url` | Regex URL (http/https) | `https://example.com` |
| `phone-fr` | Format telephone FR (fixe ou mobile) | `04 78 12 34 56` |
| `phone-intl` | Format international | `+33 4 78 12 34 56` |
| `hex-color` | Couleur hexadecimale 6 chiffres | `#B91C1C` |
| `time` | Heure HH:MM (24h) | `11:30` |
| `date` | Date ISO YYYY-MM-DD | `2026-08-01` |
| `lat` | Latitude decimale | `45.7578` |
| `lng` | Longitude decimale | `4.8355` |
| `integer` | Nombre entier | `8` |
| `boolean` | Booleen | `true` / `false` |
| `enum` | Valeur dans une liste fermee | `restaurant` |
| `array` | Liste (vide autorisee selon contexte) | `[]` |
| `object` | Objet imbrique | voir schema |
| `yaml-date-comment` | Date de creation/maj (commentaire en-tete) | `2026-09-15` |

### 3.2 Regex de reference

| Format | Regex | Champs concernes |
| ------ | ----- | ---------------- |
| email | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `contact.email`, `legal.email_pro`, `contact.email` |
| url | `^https?:\/\/[^\s/$.?#].[^\s]*$` | `socials.*`, `contact.website`, `legal.host_*` |
| phone-fr | `^0[1-9]([ .-]?\d{2}){4}$` | `contact.phone`, `legal.phone_pro` |
| hex-color | `^#[0-9A-Fa-f]{6}$` | `branding.primary_color`, `secondary_color`, `accent_color` |
| time | `^([01]\d|2[0-3]):[0-5]\d$` | `opening_hours.schedule[].open/close` |
| date | `^\d{4}-\d{2}-\d{2}$` | `closed_periods.start/end`, `maintenance.*` |
| siren | `^\d{9}$` | `legal.siren` |
| siret | `^\d{14}$` | `legal.siret` |
| lat | `^-?([0-8]?\d(\.\d+)?\|90(\.0+)?)$` | `contact.map.lat` |
| lng | `^-?((1[0-7]\d\|[0-9]?\d)(\.\d+)?\|180(\.0+)?)$` | `contact.map.lng` |
| domain | `^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$` | `seo.domain` (ajout propose) |
| slug | `^[a-z0-9]+(?:-[a-z0-9]+)*$` | nom du dossier projet |

### 3.3 Longueurs et contraintes de texte

| Champ | Min | Max | Remarque |
| ----- | --- | --- | -------- |
| `business.name` | 2 | 80 | Regex caractere autorise : `^[A-Za-z0-9À-ÿ\s\-'\.]+$` |
| `business.description` | 10 | 160 | 1-2 phrases |
| `business.slogan` | — | 60 | Optionnel |
| `seo.meta_description` | 120 | 160 | Recommandation SEO (D-CS-05) |
| `services[].name` | 2 | 60 | Non vide |
| `legal.siren` | 9 | 9 | Chiffres uniquement |
| `legal.siret` | 14 | 14 | Chiffres uniquement |

### 3.4 Enums

| Champ | Valeurs autorisees |
| ----- | ------------------ |
| `business.category` | `restaurant` \| `artisan` \| `commerce` \| `independant` \| `association` |
| `template.type` | `restaurant` \| `artisan` \| `commerce` \| `independant` \| `association` |
| `template.package` | `vitrine` \| `vitrine_reservation` \| `vitrine_ecommerce` |
| `reservation.method` | `form` \| `external_link` \| `phone_only` |
| `reviews.source` | `google` \| `tripadvisor` \| `facebook` \| `custom` |
| `maintenance.frequency` | `mensuel` \| `bimensuel` \| `trimestriel` |
| `opening_hours.schedule[].day` | `Lundi` \| `Mardi` \| `Mercredi` \| `Jeudi` \| `Vendredi` \| `Samedi` \| `Dimanche` |
| `branding.fonts.heading/body` | Familles autorisees : `Inter` \| `Playfair Display` \| `DM Sans` \| `Libre Baskerville` |

> **Contrainte** : `business.category` et `template.type` doivent etre
> coherents entre eux (sinon erreur bloquante, cf. section 4).

---

## 4. Contraintes croisees

La validation contextuelle verifie les dependances entre champs. Une
contrainte violee est traitee selon son niveau :

| # | Regle | Niveau si violee | Explication |
| - | ----- | ---------------- | ----------- |
| C-01 | `business.category` == `template.type` | **BLOQUANT** | Le template doit correspondre au secteur |
| C-02 | Si `opening_hours.enabled: true` -> `opening_hours.schedule` non vide | **BLOQUANT** | On ne peut pas afficher des horaires vides |
| C-03 | Si `business.category == restaurant` -> `menu.enabled` peut etre `false`, mais si `menu.enabled: true` -> `menu.categories` non vide et chaque categorie a >= 1 item | **BLOQUANT** | Menu active sans donnees = page vide |
| C-04 | Si `template.package == vitrine_reservation` (ou +) -> `reservation.enabled: true` | **BLOQUANT** | Le package reserve doit exposer la configuration reservation |
| C-05 | Si `reservation.enabled: true` et `reservation.method == form` -> soit `reservation.slots` non vide, soit `opening_hours.enabled: true` (au moins une source de creneaux) | **SHOULD** | Sans creneaux ni horaires, la reservation affichera toujours « aucun creneau » |
| C-06 | Si `reviews.enabled: true` et `reviews.source == custom` -> `reviews.items` avec >= `reviews.min_count` elements | **BLOQUANT** | Avis custom actives sans avis = page vide |
| C-07 | Si `reviews.enabled: true` et source != custom -> `reviews.source` valide OU `socials.google_business` / `socials.tripadvisor` renseigne | **SHOULD** | Source externe sans URL = lien introuvable |
| C-08 | Si `opening_hours.closed_periods` non vide -> chaque entree a `start <= end` | **BLOQUANT** | Periode de fermeture invalide |
| C-09 | Si `template.multilingual: true` -> champs EN recommandes presents (`business.description_en`, `seo.meta_description_en`) | **SHOULD** | Les pages EN sans texte client retomberont sur le FR |
| C-10 | Si `contact.map.lat` et `contact.map.lng` : les deux renseignes ou les deux absents | **BLOQUANT** (si un seul) | Coordonnees incompletes = carte cassée |
| C-11 | Si `legal.legal_form == EI` -> `legal.capital` optionnel (pas d'obligation de capital) ; sinon capital SHOULD | SHOULD | Coherence juridique |
| C-12 | Si un `socials.whatsapp` est renseigne -> format `phone-intl` (obligatoire `+33...`) | **BLOQUANT** | Format WhatsApp international requis |
| C-13 | `opening_hours.schedule` : aucun doublon de jour + plage horaire sur un meme jour interdit (sauf 2 creneaux max : dejeuner/diner) | SHOULD | Horaires illisibles/contradictoires |
| C-14 | Si `business.category == restaurant` -> `menu.enabled` suggere `true` | COULD (info) | Un restaurant presente generalement son menu |
| C-15 | `maintenance.plan_active: true` -> `maintenance.start_date` et `maintenance.frequency` requis | **BLOQUANT** | Plan de maintenance active sans config |
| C-16 | `legal.mediator_name` requis si le client vise une activite B2C (CLIENT_TYPE non determine dans le YAML — verification manuelle Noah) | SHOULD | Obligation mediation B2C (D-LG-03) |
| C-17 | `seo.domain` obligatoire au build (canonical, sitemap, OG) | **BLOQUANT** (au build) | Ajout propose par solution-architect, cf. section 7 |
| C-18 | `contact.phone_intl` : si absent, derive de `contact.phone` (conversion `0X` -> `+33 X`) | Derivation, pas une erreur | Champ genere |

---

## 5. Cas particuliers

### 5.1 Champs a derivation (generes, pas saisis)

| Champ genere | Source | Regle |
| ------------ | ------ | ----- |
| `contact.address.full` | `street` + `postal_code` + `city` | `"<street>, <postal_code> <city>"` |
| `contact.phone_intl` | `contact.phone` | `0X...` -> `+33 X...` |
| `seo.region` | Defaut | `"Auvergne-Rhone-Alpes"` si absent |
| `seo.country` | Defaut | `"FR"` si absent |
| `contact.map.zoom` | Defaut | `15` si absent |

Les champs a derivation ne sont **jamais** bloquants : ils se calculent ou
utilisent leur defaut.

### 5.2 Champs « en attente » (explicitement inconnus)

Noah peut marquer un champ comme « a completer » avec une valeur vide `""`.
Le generateur le traite comme champ manquant (selon son niveau).

### 5.3 Donnees EN (multilingue)

Quand `template.multilingual: true` :
- Les champs `*_en` (par ex. `business.description_en`,
  `seo.meta_description_en`) sont `SHOULD`.
- Le site se genere avec les textes FR en fallback (les champs EN manquants
  sont listes dans le rapport).

---

## 6. Format du rapport de validation

Le generateur produit un rapport structure, utilisable tel quel par Noah pour
completer le fichier. Deux sorties : **console** (mode interactif) et
**fichier** (`dist/<slug>/validation-report.md`, cree a chaque build).

### 6.1 Contenu du rapport

```markdown
# Rapport de validation — client_data.yaml
# Projet : <slug>
# Date : <YYYY-MM-DD>

## RESULTAT : OK | EN ATTENTE DE DONNEES | ERREUR FORMAT

### Champs bloquants (N)          <- niveau REQUIRED manquant / format invalide
| Champ | Valeur actuelle | Action requise |
| ----- | --------------- | -------------- |
| `business.name` | (vide) | Fournir le nom commercial |

### Champs recommandes (N)        <- niveau SHOULD
| Champ | Valeur actuelle | Action |
| ----- | --------------- | ------ |
| `seo.meta_description` | (vide) | Rediger une description 120-160 car. |

### Champs optionnels (N)         <- niveau COULD
| Champ | Valeur actuelle |
| ----- | --------------- |
| `socials.instagram` | (vide) |

### Regles contextuelles (N)      <- contraintes C-xx violees
| Regle | Detail | Niveau |
| ----- | ------ | ------ |
| C-05 | Reservation active sans creneaux ni horaires | SHOULD |

### Resume
- NOMBRE DE CHAMPS VALIDES : X / Y
- SECTEUR : restaurant | artisan | ...
- PACKAGE : vitrine | vitrine_reservation | vitrine_ecommerce

## PROCHAINE ETAPE
Remplir les champs bloquants puis relancer `npm run validate -- --client <slug>`.
```

### 6.2 Regles du rapport

- Les champs sont listes par ordre de section du schema (business -> maintenance).
- Chaque champ a son chemin complet YAML (ex. `legal.siren`) pour une
  localisation immediate dans le fichier.
- Le rapport ne contient **aucune valeur inventee** : uniquement les valeurs
  reelles saisies (ou « (vide) »).
- Le nombre total de champs (`X / Y`) couvre tous les champs du schema, pas
  seulement les manquants — Noah voit l'avancement global du fichier.

### 6.3 Exemple complet

```markdown
# Rapport de validation — client_data.yaml
# Projet : chez-marie
# Date : 2026-09-15

## RESULTAT : EN ATTENTE DE DONNEES

### Champs bloquants (4)
| Champ | Valeur actuelle | Action requise |
| ----- | --------------- | -------------- |
| `business.name` | (vide) | Fournir le nom commercial |
| `contact.phone` | (vide) | Fournir le telephone (ex: 04 78 12 34 56) |
| `legal.siren` | (vide) | Fournir le numero SIREN (9 chiffres) |
| `seo.domain` | (vide) | Fournir le nom de domaine du site |

### Champs recommandes (3)
| Champ | Valeur actuelle | Action |
| ----- | --------------- | ------ |
| `seo.meta_description` | (vide) | Rediger une description 120-160 car. |
| `opening_hours.schedule` | (vide) | Remplir les horaires d'ouverture |
| `socials.google_business` | (vide) | Fournir l'URL Google Business |

### Champs optionnels (3)
| Champ | Valeur actuelle |
| ----- | --------------- |
| `socials.instagram` | (vide) |
| `business.slogan` | (vide) |
| `maintenance.start_date` | (vide) |

### Regles contextuelles (1)
| Regle | Detail | Niveau |
| ----- | ------ | ------ |
| C-04 | Package vitrine_reservation sans reservation.enabled | BLOQUANT |

### Resume
- NOMBRE DE CHAMPS VALIDES : 5 / 12
- SECTEUR : restaurant
- PACKAGE : vitrine_reservation

## PROCHAINE ETAPE
Remplir les champs bloquants puis relancer `npm run validate -- --client chez-marie`.
```

---

## 7. Point en attente : `seo.domain`

L'architect (point ouvert n°37) propose d'ajouter `seo.domain` au schema
(necessaire pour canonical, sitemap.xml et Open Graph — SEO_SYSTEM.md §6.4-6.5).

**Position de l'AGENT 07** : le champ est necessaire **au build** (canonical et
sitemap invalides sans lui). En attendant la validation de content-seo, la
spec de validation le traite comme `REQUIRED` au build (regle C-17). Il sera
aligne sur le niveau definitif decide par content-seo (probablement REQUIRED).

---

## 8. Dependances

- **Content / SEO** : schema source `CLIENT_DATA_SCHEMA.md` — ajout `seo.domain`
  (point ouvert), validation des enums et des longueurs.
- **Solution Architect** : pipeline automate (ADR-002), contrat du generateur
  (TECHNICAL_ARCHITECTURE.md §4).
- **Backend Engineer** : implementation `scripts/validate-client.mjs`
  (parse YAML + validation JSON Schema ajv + regles contextuelles + rapport).
- **Frontend Engineer** : le rapport de validation alimente la page
  « en construction » (etat special UX) si le build est bloque.
- **Legal / Compliance** : regle C-16 (mediateur B2C) coherente avec
  D-LG-03 et PRIVACY_REQUIREMENTS_TEMPLATE.md.