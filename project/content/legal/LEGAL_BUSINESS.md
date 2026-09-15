# LEGAL_BUSINESS.md — Conformite de l'activite de Noah

Version : 0.1 (Phase 0 — Discovery)
Porteur : Legal / Compliance Assistant
Statut : PROPOSE — a valider par Noah (decisions D-LG-01 a D-LG-05)

---

## 1. Statut juridique recommande

### 1.1 Forme : Entreprise Individuelle (EI)

**Recommandation** : demarrer par une **EI** (Entreprise Individuelle).

- Demarche simplifiee : creation en ligne via le guichet des formalites des entreprises.
- Pas de capital social a constituer.
- Regime fiscal et social adapte a un debut d'activité freelance.
- Possibilite d'opter pour le regime de la micro-entreprise (auto-entrepreneur) si le CA le permet.
- Passeport possible vers une SARL/SAS si l'activité se développe.

### 1.2 Immatriculation

- **Guichet des formalites des entreprises** : https://formalites.entreprises.gouv.fr
- Immatriculation obligatoire avant le debut de l'activité.
- Numero SIREN/SIRET attribue par l'INSEE a l'immatriculation.

### 1.3 Code APE/NAF

Le code APE (Activite Principale Exercee) sera attribue a l'immatriculation. Pour la creation de sites web, les codes les plus pertinents sont :

- **6201Z** — Programmation informatique (developpement sur mesure).
- **6202A** — Conseil en systèmes et logiciels informatiques.
- **7022A** — Conseil pour les affaires et autres conseils de gestion.
- **7311Z** — Agences de publicite.

> **POINT POUR NOAH** : le code definitif sera attribue lors de l'immatriculation. Verifier que l'activite de « creation de sites web » correspond bien au code propose par le guichet. En cas de doute, contacter l'URSSAF ou un expert-comptable.

### 1.4 Compte bancaire

- **Obligatoire** pour l'EI si CA depasse 10 000 EUR sur 2 annees consecutives (seuil 2026).
- **Recommande des le depart** : separer les flux persos/professionnels.
- Possibilite d'ouvrir un compte bancaire dedie (compte pro ou compte courant avec distinction).

### 1.5 Assurance Responsabilité Civile Professionnelle (RC Pro)

- **Recommandee** pour toute prestation de services.
- Couvre les dommages causes aux clients (erreur de developpement, perte de données, etc.).
- **A evaluer** : cotisation annuelle variable selon l'activité et le chiffre d'affaires.
- Vérifier que la police couvre explicitement l'activité de creation de sites web.

### 1.6 Obligations fiscales

| Element | Detail |
| ------- | ------ |
| Impot sur le revenu | Bénéfices non commerciaux (BNC) ou micro-BNC si seuils respectes |
| Cotisations sociales | URSSAF (debut en 2026 : 21,1 % du CA net en micro-entreprise, hors CFP) |
| CFP (Formation Professionnelle) | 0,2 % du CA en micro-entreprise |
| CFE (Cotisation Fonciere des Entreprises) | Exoneree la premiere annee ; apres, variable selon la commune |
| Contribution a l'audiovisuel public | Si CA depasse un seuil (a verifier, non applicable en debut d'activité) |

### 1.7 Obligations sociales

| Element | Detail |
| ------- | ------ |
| Declaration de creation | Via le guichet unique |
| Declaration trimestrielle des recettes | Si micro-entreprise |
| Livre des recettes | Obligatoire (format libre ou logiciel de compta) |
| Assurance | RC Pro recommandee |

---

## 2. TVA — Configuration fiscale (SEPARATEE)

> **RÈGLE ABSOLUE** : ne jamais hardcoder TVA = 0% sans vérifier le statut réel de Noah.

### 2.1 Franchise en base de TVA (par défaut recommande)

Le regime de franchise en base dispense de la collecte et de la déclaration de TVA. Pas de TVA sur les factures.

**Seuils 2026 pour les prestations de services** :

| Seuil | Montant |
| ----- | ------- |
| Seuil de franchise | **37 500 EUR** de CA annuel |
| Seuil majoré (tolérance) | **41 250 EUR** de CA annuel |

- Si CA < 37 500 EUR : pas de TVA, factures HT.
- Si 37 500 EUR < CA < 41 250 EUR : franchise maintenue mais a surveiller.
- Si CA > 41 250 EUR : franchise perdue, assujettissement obligatoire l'annee suivante.

**Mentions sur les factures** en franchise : « TVA non applicable, article 293 B du CGI ».

### 2.2 Assujettissement a la TVA

Si Noah dépasse les seuils ou opte pour l'assujettissement :

| Element | Detail |
| ------- | ------ |
| Taux normal | **20 %** |
| Taux reduit | **10 %** (hébergement, restauration — si applicable) |
| Numero TVA intracommunautaire | A demander a l'administration |
| Declarations | CA12 (annuel) ou CA12E (trimestriel) |
| Liquidation de la TVA | Reverse charge possible pour les prestations intra-UE |

### 2.3 Points de vigilance

- Les seuils sont révisés régulièrement (dernière révision : 1er janvier 2025, prochaine date a surveiller).
- Le depot d'une demande de franchise est possible avant le debut de l'activité.
- En cas de depassement du seuil majoré, l'assujettissement prend effet le 1er janvier de l'annee suivante.

> **POINT POUR NOAH** : determiner le CA previsionnel reel avant de choisir le regime TVA. Si le CA depasse 37 500 EUR des le depart, l'assujettissement est inévitable. Consulter un expert-comptable pour confirmer.

---

## 3. CLIENT_TYPE — B2B vs B2C

> **POINT DE CONTROLE OBLIGATOIRE** : toute generation de document commercial ou facture est bloquee tant que CLIENT_TYPE n'est pas renseigne.

### 3.1 Configuration du systeme

Le systeme demande explicitement :

```text
CLIENT_TYPE = B2B  |  B2C
```

### 3.2 B2B (recommande)

Un professionnel achète un site pour son entreprise (restaurant, artisan, etc.).

| Aspect | B2B |
| ------ | --- |
| Droit applicable | Code civil, droit commercial |
| Droit de retractation | **PAS de droit de retractation** (sauf clause contractuelle) |
| Facturation | Mentions B2B (pas de mentions relatives au consommateur) |
| CGV | Dediees B2B, negotiation possible |
| Litige | Arbitrage ou tribunal de commerce |
| TVA | Recuperable par le client professionnel |

### 3.3 B2C

Un consommateur particulier achète un site pour usage personnel ou non-professionnel.

| Aspect | B2C |
| ------ | --- |
| Droit applicable | Code de la consommation |
| Droit de retractation | **14 jours** (contrat a distance ou hors établissement) |
| Facturation | Mentions B2C + informations precontractuelles |
| CGV | Dediees B2C, clauses standardisees |
| Litige | Tribunal judiciaire ; médiation obligatoire (>= 5 000 EUR de CA) |
| TVA | Non récupérable par le consommateur |

### 3.4 Conditions particulieres B2C — retractation

Le droit de retractation de 14 jours peut etre aménagé si :

- L'execution commence avant la fin du delai (avec accord écrit du consommateur).
- Le consommateur est informé qu'il perd son droit de retractation apres execution partielle.
- **IMPORTANT** : la prestation de creation de site web est un service — la CNIL et le code de la consommation prévoient des règles spécifiques. Verifier avec un professionnel.

### 3.5 Determination du CLIENT_TYPE

Le systeme doit poser la question au debut du processus commercial (BUSINESS_PROCESS.md etape 3) :

- Le client est-il un professionnel (SIRET, entreprise, auto-entrepreneur) ?
- Le client est-il un consommateur particulier (pas de statut professionnel) ?

En cas de doute : **considérer comme B2C** (plus protecteur).

---

## 4. Documents commerciaux — Principes

### 4.1 BroUILLONS uniquement

Tous les documents generés par les agents (devis, contrat, CGV, facture, brief) sont des **brouillons**. Noah les valide, ajuste et envoie.

### 4.2 Verification professionnelle recommandee

Avant la premiere utilisation commerciale des templates, une verification par un professionnel (avocat, expert-comptable) est recommandée.

### 4.3 Format des placeholders

Chaque document contient des **champs placeholder** visibles entre crochets :

```text
[SIRET du prestataire]
[Nom du client]
[Adresse du client]
[Numero de TVA]
[Date]
[Montant]
```

Ces champs ne sont JAMAIS remplis automatiquement. Ils sont saisis par Noah ou le client.

### 4.4 Dependances

- **Donnees du client** : le systeme ne peut pas generer un document complet sans les donnees reelles du client (nom, adresse, SIRET, etc.).
- **Consultation juridique** : les CGV et contrats B2C beneficient d'une verification professionnelle avant premiere utilisation.
- **content-seo** : les contenus des sites (mentions legales, politique de confidentialite) dependent des données reelles du client.

---

## 5. Points ouverts — Decisions Noah

| ID | Question | Impact | Recommandation |
| ---- | -------- | ------ | -------------- |
| D-LG-01 | **Statut juridique reel** : EI confirmée ? | Forme juridique, obligations fiscales et sociales | EI recommandee pour demarrer |
| D-LG-02 | **CA previsionnel reel** | Seuil TVA (franchise en base ou assujettissement) | A determiner avant choix TVA |
| D-LG-03 | **CLIENT_TYPE formel** : B2B prioritaire, B2C possible ? | Templates contractuels, retractation, CGV | B2B recommande (professionnels acheteurs) |
| D-LG-04 | **Donnees d'identite de Noah** : nom complet, adresse, SIREN/SIRET | Tous les documents commerciaux | A fournir avant production des templates |
| D-LG-05 | **Verification professionnelle** : avocat ou expert-comptable pour les CGV/contrats | Conformite legale, protection juridique | Fortement recommandee avant premiere utilisation |

---

## 6. Dependances vers d'autres agents

| Agent | Dependance | Direction |
| ------ | ---------- | --------- |
| product-manager | BUSINESS_PROCESS.md, SCOPE.md (CLIENT_TYPE, TVA, packages) | Legal <- PM |
| content-seo | Donnees reelles du client (fichier de donnees structure section 11) | Legal <- Content |
| security-engineer | Evaluation cookies (maps, analytics) pour conformite RGPD | Legal <- Security |
| ux-designer | Pages legales (mentions, confidentialite) dans le sitemap | Legal <- UX |
| solution-architect | Faisabilite technique des formulaires et du stockage de donnees | Legal <- Architect |

---

## 7. Notes

- Ce document est un **brouillon de conformite**. Il ne constitue pas un avis juridique.
- Les seuils TVA (37 500 EUR / 41 250 EUR) sont indicatifs pour 2026 et doivent être vérifiés régulierement.
- La conformite de l'activité de Noah est la premiere condition avant de vendre ou de produire des documents commerciaux.
