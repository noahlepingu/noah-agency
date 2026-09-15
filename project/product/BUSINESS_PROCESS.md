# BUSINESS_PROCESS.md — Pipeline commercial complet (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Reference : cahier des charges sections 4, 5, 13, 21, 22, 25.

Regle d'or :
> **Automatiser la production, pas automatiser la responsabilite.**
> Ce qui peut porter engagement (prix, delai, contrat, juridique, deploy) reste
> sous controle humain Noah. Les agents preparent (brouillons) ; Noah decide.

---

## 1. Pipeline general

```
Prospect -> Discovery -> Devis/Proposition -> CGV/Contrat -> Acceptation
-> Acompte (si prevu) -> Production -> Validation -> Livraison -> Facturation
-> Maintenance
```

## 2. Detail des etapes

Legende : **[A]** = automatise / assiste par les agents — **[H]** = humain Noah.

### Etape 1 — Prospect **[H + A]**
- **Noah** : choix des cibles, prospection, rendez-vous, relation (section 25).
- **Agents (brouillons)** : fiches prospect, qualification, questions de discovery,
  preparation de relances. Envoi des relances soumis a validation Noah.
- Sortie : prospect qualifie + fiche.

### Etape 2 — Discovery **[H]**
- **Noah uniquement** (section 4 — discovery client) : activite, objectifs,
  clientele, concurrents, positionnement, attentes, budget, fonctionnalites.
- **Agents** : preparent le **BRIEF CLIENT** (brouillon) a partir de la fiche
  prospect et du fichier de donnees client structure (section 11).
- Gate : Noah valide le brief (Gate 1 client).

### Etape 3 — Devis / Proposition **[A -> H]**
- **Agents** : generent un **brouillon** de devis depuis l'offre validee
  (packages SCOPE.md) ; demandent **CLIENT_TYPE (B2B/B2C)** ; TVA configurable.
- **Noah** : verifie, ajuste, **valide, envoie**. Aucun envoi automatique.

### Etape 4 — CGV / Contrat **[A -> H]**
- **Agents** : brouillon CGV/contrat selon CLIENT_TYPE (B2B par defaut ; B2C :
  retractation 14 jours, mediateur le cas echeant).
- **Legal-compliance** : templates valides (assistant de conformite, pas avocat) ;
  verification professionnelle recommandee avant premiere utilisation.
- **Noah** : valide et presente.

### Etape 5 — Acceptation **[H]**
- Signature par le client ; confirmation Noah. Pas de demarrage avant acceptation
  formalisee (section 13 : ne pas demarrer sur un simple echange WhatsApp/Instagram).

### Etape 6 — Acompte (si prevu) **[H]**
- **Noah** : regle le montant, la date, le canal (decision commerciale, section 25).
- Le systeme rappelle l'acompte attendu dans la fiche client.

### Etape 7 — Production **[A avec gates H]**
- Pipeline de production (cahier des charges section 22 et ROADMAP.md) :
  Product -> UX -> Design -> Contenu/SEO -> Tech (config/archi) -> Dev
  (assemblage) -> QA/Sec/A11y/Perf.
- **Gates Noah obligatoires** :
  - Gate 1 : perimetre, prix, brief, fonctionnalites (deja passe en etape 2-3).
  - Gate 2 : design, structure, contenu principal (validation Noah + client).
  - Gate 3 : site final (Noah + client avant livraison).
- Le systeme **bloque** le pipeline entre chaque gate.

### Etape 8 — Validation **[H]**
- Noah valide le site final avec le client (fonctionnel, conforme, contenu).
- Aucune donnee invente e : tout champ manquant demande au client.

### Etape 9 — Livraison **[H (+A pour la technique)]**
- **Noah autorise explicitement** : mise en ligne (Gate 4), remise des acces,
  propriete du code et des contenus (contrat).
- DevOps execute le deploiement documente (DNS, HTTPS, rollback).

### Etape 10 — Facturation **[A -> H]**
- **Agents** : brouillon facture (mentions, numero sequentiel, TVA configuree,
  CLIENT_TYPE deja enregistre) — section 19.
- **Noah** : verifie et envoie. Suivi de paiement (relances assistees, envoi manuel).

### Etape 11 — Maintenance **[A + H]** (sections 26-27)
- **Par defaut dans l'offre** (MAINTENANCE_PLAN par projet) :
  - Technique : mises a jour, securite, sauvegardes, monitoring, corrections.
  - Contenu : horaires, tarifs, photos, textes, evenements.
  - SEO : suivi, optimisation, visibilite locale.
- **Flux** : monitoring -> erreur -> diagnostic -> ticket -> correction -> tests
  -> validation Noah -> deploy. **Aucune correction auto en production.**
- Canal : email/support defini au contrat ; delais d'intervention contractuels.

## 3. Tableau automatise vs humain

| Etape | Automatise / assiste (agents) | Humain (Noah) | Livrable | Gate |
| ----- | ----------------------------- | ------------- | -------- | ---- |
| Prospect | fiches, qualification, questions (brouillons) | cibles, RDV, relation, envois | fiche prospect | — |
| Discovery | brief brouillon | conduire le discovery | BRIEF | G1 (brief) |
| Devis | brouillon (CLIENT_TYPE, TVA) | valider + envoyer | devis | G1 (prix) |
| Contrat | brouillon CGV/contrat (B2B/B2C) | valider ; verification pro 1re fois | contrat/CGV | — |
| Acceptation | suivi etape | accepter formellement | acceptation | — |
| Acompte | rappel | fixer montant/date/canal | acompte | — |
| Production | assemble, teste, documente | gates 2-3 | site | G2, G3 |
| Validation | rapports | valider avec le client | validation | G3 |
| Livraison | deploy technique | autoriser (Gate 4) | site en ligne | G4 |
| Facturation | brouillon facture | verifier + envoyer | facture | — |
| Maintenance | monitoring, rapport, tiquetage | valider chaque correction | MAINTENANCE_PLAN | — |

## 4. Ce qui ne doit JAMAIS etre automatise (section 25)

- l'envoi des devis ;
- les negociations ;
- les contrats et decisions juridiques ;
- les remboursements ;
- les suppressions de donnees ;
- les changements de domaine ;
- les migrations ;
- la mise en production (Gate 4) ;
- les communications sensibles avec le client.

## 5. CLIENT_TYPE — point de controle

Le systeme demande **explicitement** :

```text
CLIENT_TYPE = B2B  |  B2C
```

- Recommande : **B2B** (professionnel acheteur pour son entreprise).
- B2C : possible (acheteur particulier) — documente par legal-compliance.
- Toute generation de document commercial ou facture est bloquee tant que
  CLIENT_TYPE n'est pas renseigne.

## 6. Rules d'engagement des agents

- Les agents ne prennent jamais d'engagement envers un client (prix, delai,
  modification de contrat, promesse technique, responsabilite juridique).
- Tout document genere par un agent est un **brouillon** valide par Noah.
- Tout contenu (SEO, copy, FAQ) est valide par Noah avant publication.

## 7. Cycle de production par client (rappel)

Detail dans ROADMAP.md section 13 : chaque client repasse par le mini-cycle
discovery -> gates 1-4 -> livraison -> maintenance, avec fiche de mesures KPI.