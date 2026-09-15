# CONTRACT_TEMPLATES.md — Modeles de documents commerciaux (brouillons)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Legal / Compliance Assistant
Statut : PROPOSE — BROUILLONS a valider par Noah

> **REGLE** : chaque modele est un BROUILLON. Noah valide, ajuste et envoie.
> Verification professionnelle recommandee avant premiere utilisation commerciale.
> Aucune donnee reel n'est invente : les champs placeholder sont saisis par Noah.

---

## 1. DEVIS / PROPOSITION COMMERCIALE

### Mentions obligatoires B2B

```text
DEVIS N° [NUMERO_DEVIS]

Date : [DATE]
Validite : 30 jours

PRESTATAIRE :
  [Nom complet de Noah]
  [Adresse]
  [SIRET : XXX XXX XXX XXXXX]
  [Email]
  [Telephone]

CLIENT :
  [Nom du client / raison sociale]
  [Adresse]
  [SIRET du client (si B2B)]
  [Email]
  [Telephone]

Objet : Creation d'un site web — Package [PACKAGE]

DESCRIPTION DES PRESTATIONS :
  - Template secteur : [SECTEUR]
  - Pages incluses : [NOMBRE] pages ([LISTE])
  - Formulaire de contact
  - SEO local (Google Business, metadata, schema.org)
  - Pages legales (mentions legales, politique de confidentialite)
  - 1 an de maintenance contenu/technique
  - [OPTIONS SUPPLEMENTAIRES si applicable]

DELAI DE PRODUCTION : [X] semaines apres validation du brief

PRIX :
  - Package [PACKAGE] : [MONTANT] EUR HT
  - [Options supplementaires] : [MONTANT] EUR HT
  - Total HT : [TOTAL] EUR HT
  - TVA : [NON APPLICABLE — article 293 B du CGI] OU [TVA a [TAUX] %]

  Total TTC : [TOTAL_TTC] EUR TTC

ACOMPTE : [MONTANT] EUR ([POURCENTAGE] %) a la signature
REGLEMENT : Solde a la livraison, par virement bancaire.

CONDITIONS :
  - Ce devis est valable 30 jours.
  - Le delai de production court apres reception du brief valide et de l'acompte.
  - Les contenus (textes, images) sont fournis par le client. Leur absence retarde la livraison.
  - Une revision majeure au-dela du forfait fait l'objet d'un devis complementaire.

Fait a [VILLE], le [DATE]

Signature du prestataire :
[Signature]

Signature du client (pour acceptation) :
[Signature]
```

### Mentions obligatoires B2C (ajouts)

En plus des mentions B2B, ajouter :

```text
INFORMATIONS PRECONTRACTUELLES :
  - Droit de retractation : vous disposez d'un delai de 14 jours pour vous
    retracter sans motif. Ce delai court a compter de la signature du present
    contrat. Pour exercer ce droit, envoyez un email a [EMAIL] ou un courrier
    a [ADRESSE].
  - Execution avant la fin du delai de retractation : si vous souhaitez que
    l'execution commence avant la fin du delai de 14 jours, vous devez nous
    adresser une demande ecrite specifique. Vous perdez alors votre droit de
    retractation pour les prestations executees.
  - Prix total : [MONTANT] EUR TTC.
  - Modalites de paiement : [MODALITES].
  - Delai de livraison : [X] semaines.
  - Service apres-vente : [COORDONNEES].
  - Mode de reglement des litiges : [MEDIATEUR NOM] — [COORDONNEES].
```

---

## 2. CONTRAT DE PRESTATION

```text
CONTRAT DE PRESTATION DE SERVICES

Entre les soussignes :

LE PRESTATAIRE :
  [Nom complet de Noah]
  [Adresse]
  [SIRET : XXX XXX XXX XXXXX]
  [Email]
  [Telephone]

ET

LE CLIENT :
  [Nom du client / raison sociale]
  [Adresse]
  [SIRET du client si B2B]
  [Email]
  [Telephone]

(Chris les parties ci-dessus sont ci-apres designees « les Parties »)

ARTICLE 1 — OBJET
  Le present contrat a pour objet la creation d'un site web professionnel
  pour le compte du Client, selon les termes decrits ci-apres.

ARTICLE 2 — DESCRIPTION DES PRESTATIONS
  2.1 Le Prestataire realise :
    - Creation du site web : template [SECTEUR], [NOMBRE] pages
    - Integration du contenu fourni par le Client
    - Optimisation SEO locale
    - Formulaire de contact
    - Pages legales (mentions legales, politique de confidentialite)
    - Mise en ligne sur l'hebergement du Client
    - Formation a l'utilisation basique (si prevu)
    - 1 an de maintenance contenu/technique

  2.2 Le Prestataire ne realize PAS :
    - La fourniture des contenus textuels et photographiques (sauf forfait
      redaction/photographie specifique)
    - L'achat du nom de domaine et de l'hebergement (sauf forfait dedie)
    - Les fonctionnalites non decrites dans le present contrat

ARTICLE 3 — PRIX ET MODALITES DE PAIEMENT
  3.1 Prix : [MONTANT] EUR HT / TTC (preciser)

  3.2 Acompte : [MONTANT] EUR ([POURCENTAGE] %) a la signature du contrat.
      Le demarrage de la production est conditionne par la reception de
      l'acompte.

  3.3 Solde : [MONTANT] EUR a la livraison, par virement bancaire.
      Delai de paiement : [X] jours apres la facturation.

  3.4 Retard de paiement : penalites de [TAUX] % par mois de retard,
      plus indemnite forfaitaire de 40 EUR (article L.441-10 du Code de
      commerce).

ARTICLE 4 — DELAI DE REALISATION
  4.1 Le delai de production est de [X] semaines a compter de :
    - La reception du brief valide par le Client
    - La reception de l'acompte
    - La mise a disposition des contenus par le Client

  4.2 Tout retard dans la fourniture des contenus retarde la livraison
      a due concurrence.

  4.3 Le Prestataire s'engage a respecter le delai sauf force majeure
      ou manquement du Client a ses obligations.

ARTICLE 5 — PROPRIETE INTELLECTUELLE
  5.1 Le code source et les contenus livres sont remis au Client apres
      paiement integrale.

  5.2 Le Prestataire conserve le droit de presenter le site dans son
      portfolio, sauf opposition ecrite du Client.

  5.3 Les elements du design system maitre (composants, tokens, layouts)
      restent la propriete du Prestataire et ne sont pas transferes.

ARTICLE 6 — OBLIGATIONS DU CLIENT
  6.1 Fournir les contenus (textes, images, logo) dans les delais convenus.
  6.2 Designer un interlocuteur unique pour les validations.
  6.3 Valider les maquettes et le site final dans les delais convenus.
  6.4 Payer selon les modalites du present contrat.

ARTICLE 7 — MAINTENANCE
  7.1 La maintenance est incluse pendant 1 an apres la livraison.
  7.2 Elle couvre : mises a jour de securite, corrections de bugs,
      modifications de contenu (horaires, coordonnees, textes courts).
  7.3 Apres 1 an, la maintenance est renouvelable par tacite reconduction
      annuelle, avec preavis de 30 jours. Tarif : [MONTANT] EUR/mois.

ARTICLE 8 — RESPONSABILITE
  8.1 Le Prestataire s'engage a livrer un site fonctionnel et conforme
      aux specifications du present contrat.
  8.2 La responsabilite du Prestataire est limitee au montant du contrat.
  8.3 Le Prestataire ne saurait etre tenu responsable des pertes de
      chiffre d'affaires ou des dommages indirects.

ARTICLE 9 — CONFIDENTIALITE
  Les Parties s'engagent a maintenir la confidentialite des informations
  echangeees dans le cadre du present contrat.

ARTICLE 10 — RESILIATION
  10.1 Chaque partie peut resilier le contrat avec un preavis de 30 jours
       par lettre recommandee ou email.
  10.2 En cas de resiliation par le Client, les prestations deja realisees
       restent dues et les acomptes versés ne sont pas rembourses.
  10.3 En cas de resiliation par le Prestataire, les prestations livrees
       sont facturees et les acomptes rembourses au prorata.

ARTICLE 11 — DROIT APPLICABLE ET LITIGES
  Le present contrat est soumis au droit francais. En cas de litige,
  les Parties s'efforceront de trouver une solution amiable. A defaut,
  le litige sera soumis aux tribunaux competents de [VILLE].

ARTICLE 12 — ACCEPTATION
  Le Client declare avoir pris connaissance du present contrat et l'accepter
  sans reserve.

Fait a [VILLE], le [DATE], en deux exemplaires.

Signature du Prestataire :
[Signature]

Signature du Client :
[Signature]
```

---

## 3. CONDITIONS GENERALES DE VENTE (CGV)

### 3.1 CGV — B2B

```text
CONDITIONS GENERALES DE VENTE — B2B

Entre les soussignes :

LE PRESTATAIRE :
  [Nom complet de Noah]
  [Adresse]
  [SIRET : XXX XXX XXX XXXXX]
  [Email]
  [Telephone]

ET

LE CLIENT PROFESSIONNEL :
  [Nom du client / raison sociale]
  [Adresse]
  [SIRET du client]

ARTICLE 1 — OBJET
  Les presentes conditions generales de vente regissent les relations
  entre le Prestataire et le Client pour la fourniture de prestations
  de creation de sites web.

ARTICLE 2 — PRIX
  2.1 Les prix sont exprimes en euros, hors taxes (HT).
  2.2 La TVA est applicable selon le statut du Prestataire (franchise en
      base ou assujetti — a preciser sur chaque facture).
  2.3 Les prix sont ceux en vigueur au jour de la signature du devis/contrat.
  2.4 Tout devis est valable 30 jours.

ARTICLE 3 — COMMANDES
  3.1 Toute commande est validee par la signature du devis ou du contrat
      et le versement de l'acompte prevu.
  3.2 Aucune commande n'est engagee sans signature formelle du Client.

ARTICLE 4 — DELAI DE LIVRAISON
  4.1 Le delai de livraison est indique a titre indicatif.
  4.2 Le Prestataire s'engage a respecter le delai sauf force majeure.
  4.3 Tout retard ne saurait donner lieu a des dommages et interets,
      penalties ou annulation de commande, sauf accord ecrit.

ARTICLE 5 — PAIEMENT
  5.1 Modalites : virement bancaire.
  5.2 Echeancier : acompte a la signature, solde a la livraison.
  5.3 Delai de paiement : [X] jours (net a [X] jours).
  5.4 Retard : penalites de retard de [TAUX] % par mois, plus indemnite
      forfaitaire de 40 EUR (art. L.441-10 Code de commerce).

ARTICLE 6 — PROPRIETE INTELLECTUELLE
  6.1 Le transfert des droits de proprieté intervient a compter du
      paiement integral des prestations.
  6.2 Le code source livré est la propriete du Client.
  6.3 Les composants du design system maitre restent la propriete
      du Prestataire.

ARTICLE 7 — RESPONSABILITE
  7.1 Le Prestataire est responsable de la bonne realisation des
      prestations conformement au contrat.
  7.2 La responsabilite est limitee au montant des prestations.
  7.3 Aucune responsabilite pour les dommages indirects.

ARTICLE 8 — GARANTIE
  8.1 Le Prestataire garantit que le site est fonctionnel a la livraison.
  8.2 Un delai de 30 jours est prevu pour signaler les anomalies
      (bugs, erreurs de conformite).

ARTICLE 9 — CONFIDENTIALITE
  Les informations echangeees dans le cadre de la relation commerciale
  sont confidentielles.

ARTICLE 10 — DROIT APPLICABLE
  Droit francais. Tribunaux competents de [VILLE].

ARTICLE 11 — VALIDITE
  Ces conditions sont valables a compter de [DATE].

[DATE]

Signature du Prestataire :
[Signature]

Signature du Client :
[Signature]
```

### 3.2 CGV — B2C

```text
CONDITIONS GENERALES DE VENTE — B2C

ARTICLE 1 — OBJET
  Les presentes CGV regissent les ventes de prestations de creation
  de sites web entre le Prestataire et le Consommateur (client
  particulier non professionnel).

ARTICLE 2 — IDENTIFICATION DU PRESTATAIRE
  [Nom complet de Noah]
  [Adresse]
  [SIRET : XXX XXX XXX XXXXX]
  [Email]
  [Telephone]

ARTICLE 3 — CARACTERISTIQUES ESSENTIELLES DES PRESTATIONS
  Creation d'un site web professionnel selon le package choisi :
  [DESCRIPTION DU PACKAGE]

ARTICLE 4 — PRIX
  4.1 Prix exprimes en euros, toutes taxes comprises (TTC).
  4.2 Prix total : [MONTANT] EUR TTC.
  4.3 Acompte : [MONTANT] EUR ([POURCENTAGE] %).

ARTICLE 5 — DROIT DE RETRACTATION
  5.1 Conformement aux articles L.221-18 et suivants du Code de la
      consommation, le Consommateur dispose d'un delai de 14 jours pour
      se retracter sans motif, a compter de la signature du contrat.

  5.2 Pour exercer ce droit, le Consommateur doit adresser au
      Prestataire une declaration ecrite (email ou courrier) indiquant
      sa volonte de se retracter.

  5.3 Le Prestataire rembourse les sommes versees dans un delai de
      14 jours apres la reception de la demande de retractation, par
      le meme moyen de paiement que celui utilise lors de la commande.

  5.4 Droit de retractation et execution anticipee :
      Conformement a l'article L.221-25 du Code de la consommation,
      si le Consommateur souhaite que l'execution de la prestation
      commence avant la fin du delai de retractation, il doit adresser
      une demande specifique et ecrite au Prestataire.
      En executant la prestation avant la fin du delai, le Consommateur
      reconnaît perdre son droit de retractation pour les prestations
      deja realisees.

  5.5 Le droit de retractation ne peut etre exercé si la prestation
      a ete entierement executee avant la fin du delai de 14 jours,
      avec l'accord exprès du Consommateur.

ARTICLE 6 — MODALITES DE PAIEMENT
  Virement bancaire. Delai de paiement : a la signature (acompte)
  et a la livraison (solde).

ARTICLE 7 — DELAI DE LIVRAISON
  [X] semaines apres reception du brief valide, de l'acompte et
  des contenus du Client.

ARTICLE 8 — SERVICE APRES-VENTE
  [Coordonnees du service apres-vente].

ARTICLE 9 — MEDIATION DE LA CONSUMMATION
  Conformement aux articles L.616-1 et R.616-1 du Code de la
  consommation, le Consommateur peut recourir gratuitement a un
  mediateur de la consommation en cas de litige.

  [Nom du mediateur]
  [Coordonnees du mediateur]
  [Site web du mediateur]

  Le mediateur sera saisi si le Consommateur n'a pu obtenir
  satisfaction aupres du Prestataire dans un delai raisonnable.

ARTICLE 10 — DONNEES PERSONNELLES
  Le traitement des donnees personnelles est regi par la politique
  de confidentialite du site.

ARTICLE 11 — DROIT APPLICABLE
  Droit francais. En cas de litige, le Consommateur peut saisir
  le tribunal judiciaire competent ou le mediateur de la consommation.

ARTICLE 12 — ACCEPTATION
  Le Consommateur declare avoir pris connaissance des presentes CGV
  et les accepter.

[DATE]

Signature du Prestataire :
[Signature]

Signature du Consommateur :
[Signature]
```

---

## 4. FACTURE

```text
FACTURE N° [NUMERO_FACTURE]

Date : [DATE]
Echeance : [DATE_ECHEANCE]

PRESTATAIRE :
  [Nom complet de Noah]
  [Adresse]
  [SIRET : XXX XXX XXX XXXXX]
  [Numero TVA intracommunautaire si applicable : FR XX XXX XXX XXXXX]
  [Email]
  [Telephone]

CLIENT :
  [Nom du client / raison sociale]
  [Adresse]
  [SIRET du client si B2B]
  [Email]

DESCRIPTION DES PRESTATIONS :
  | Designation | Quantite | Prix unitaire HT | Montant HT |
  | ----------- | -------- | ----------------- | ----------- |
  | [Package Vitrine] | 1 | [PRIX] EUR | [MONTANT] EUR |
  | [Options] | [QTE] | [PRIX] EUR | [MONTANT] EUR |
  | Total HT | | | [TOTAL_HT] EUR |
  | TVA | [TAUX] % | | [MONTANT_TVA] EUR |
  | Total TTC | | | [TOTAL_TTC] EUR |

  OU (si franchise en base) :
  | TVA non applicable — article 293 B du CGI | |

Conditions de paiement :
  - Acompte verse : [MONTANT] EUR le [DATE_ACOMPTE]
  - Solde a payer : [MONTANT] EUR — echeance [DATE_ECHEANCE]
  - Modalite : virement bancaire (RIB ci-joint ou sur demande)

RIB :
  IBAN : [IBAN]
  BIC : [BIC]
  Titulaire : [Nom complet de Noah]

Retard de paiement : penalites de [TAUX] % par mois + indemnite
forfaitaire de 40 EUR (art. L.441-10 Code de commerce).

Numero de facture : [NUMERO_FACTURE] (sequence : [XXXX])
```

---

## 5. BRIEF CLIENT

```text
BRIEF CLIENT — [NOM DU CLIENT]

Date : [DATE]
Valide par Noah : [DATE]

1. IDENTIFICATION DU CLIENT
   Nom : [NOM]
   Activite : [ACTIVITE]
   Adresse : [ADRESSE]
   Telephone : [TELEPHONE]
   Email : [EMAIL]
   CLIENT_TYPE : [B2B / B2C]

2. BESOIN EXPRESSE
   [Description du besoin exprime par le client]

3. OBJECTIFS DU SITE
   - [Objectif 1]
   - [Objectif 2]
   - [Objectif 3]

4. PUBLIC CIBLE
   [Description de la cible]

5. CONCURRENTS
   - [Concurrent 1] : [URL]
   - [Concurrent 2] : [URL]

6. FONCTIONNALITES DEMANDEES
   - [ ] Formulaire de contact
   - [ ] Reservation
   - [ ] Galerie photos
   - [ ] E-commerce leger
   - [ ] Blog
   - [ ] Multilingue
   - [ ] Autre : [DETAIL]

7. CONTENUS FOURNIS PAR LE CLIENT
   - Textes : [oui/non — delai]
   - Photos : [oui/non — delai]
   - Logo : [oui/non — delai]
   - Autres : [DETAIL]

8. PACKAGE CHOISI
   [Package selectionne avec reference au devis]

9. DELAI SOUHAITE
   [Delai]

10. BUDGET
    [Budget confirme ou fourchette]

11. NOTES COMPLEMENTAIRES
    [Informations additionnelles]

Brouillon genere par le systeme — a valider et completer par Noah.
```

---

## 6. COMPTE-RENDU DE REUNION

```text
COMPTE-RENDU DE REUNION — [NOM DU CLIENT]

Date : [DATE]
Participants : [NOMS]

1. OBJET DE LA REUNION
   [Objet]

2. POINTS ABORDES
   - [Point 1]
   - [Point 2]
   - [Point 3]

3. DECISIONS PRISES
   - [Decision 1]
   - [Decision 2]

4. ACTIONS A MENER
   | Action | Responsable | Echeance |
   | ------ | ----------- | -------- |
   | [Action 1] | [Qui] | [Quand] |
   | [Action 2] | [Qui] | [Quand] |

5. PROCHAINE REUNION
   [Date/heure]

Brouillon genere par le systeme — a valider par Noah.
```

---

## 7. Notes

- Tous les placeholders `[...]]` sont a remplir par Noah avec les donnees reelles.
- Les mentions legales (article 293 B du CGI, art. L.441-10, art. L.221-18) sont des references du droit en vigueur en 2026. A verifier regulierement.
- Les CGV B2C et le droit de retractation benefiticient d'une verification professionnelle avant premiere utilisation.
- Le numerotation des factures doit etre sequentielle et ininterrompue.
- Ces modeles sont concus pour des prestations de services (creation de sites web). Pour de l'e-commerce (vente de biens), des mentions supplementaires sont necessaires.
