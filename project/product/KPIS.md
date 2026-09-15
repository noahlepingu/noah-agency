# KPIS.md — Indicateurs du systeme (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Reference : cahier des charges section 30 + section 29 (ratio valeur/temps humain).

Objectif general : **augmenter le ratio valeur produite / temps humain** et
detecter les etapes du pipeline qui coutent du temps ou produisent des defauts.

---

## 1. Les 9 KPIs du cahier des charges

| # | KPI | Definition / formule | Cible indicative v1 | Cadence | Qui mesure | Pourquoi |
| - | --- | -------------------- | ------------------- | ------- | ---------- | -------- |
| 1 | Temps moyen de creation d'un site | delai calendaire entre (devis accepte) et (livraison Gate 4) | **2-4 semaines** (marche : 2-6 sem. freelance) | par projet | PM | credibilite commerciale, planification |
| 2 | Temps humain par site | heures Noah consacrees au projet (commercial + production + suivi) | **< 20 h** a terme (decroissant a chaque projet) | par projet | Noah (time tracking) | section 29 : objectif №1 du systeme |
| 3 | Cout moyen par site | couts monétaires directs (services payants, prestataires) hors temps Noah | **< 150 €** / site standard | par projet | PM | permettre des prix bas sans marge negative |
| 4 | Bugs par livraison | nb de bugs trouves en QA phase 4-6 sur un site/client | **0 critique, < 3 majeurs** | par livraison | QA | qualite de la base de production |
| 5 | Corrections post-livraison | nb de corrections demande es apres Gate 4 (30 jours) | **< 2 / projet / mois** | mensuel | PM/QA | mesure reelle de la qualite livree |
| 6 | Marge par projet | (prix de vente - couts directs - temps Noah valorise) | marge > **70 %** du prix HT | par projet | Noah | viabilite de l'activite |
| 7 | Temps de maintenance | heures Noah/agents par projet et par mois (technique + contenu + SEO) | **< 2 h / mois / projet** | mensuel | PM/DevOps | calibrer le tarif de maintenance |
| 8 | Taux de conversion prospect -> client | nb clients / nb prospects qualifies (etape discovery) | **> 30 %** a terme | trimestriel | Noah | efficacite commerciale et prix |
| 9 | Taux de satisfaction | note client /5 a J+30 (questionnaire) ; NPS en option | **> 4,5 / 5** | par livraison + J+30 | PM | qualite percue, referencement local |

## 2. KPIs complementaires (produit / systeme)

| KPI | Definition | Cible | Cadence |
| --- | ---------- | ----- | ------- |
| Taux de reutilisation | % de pages/composants reutilises sans modification (base de production) | **> 90 %** | par projet |
| Temps de mise a jour de la base | temps entre 2 sites clients (retour d'experience capitalise) | decroissant | semestriel |
| Nombre de champs manquants detectes | % de donnees client absentes a la livraison (doit tendre vers 0) | **0** | par projet |
| Visibilite locale des sites produits | impressions/positions Google Business et recherche locale (si acces client) | stable ou croissante | trimestriel |
| Respect des gates | % de gates franchies dans des delais convenus | **100 %** | par projet |
| Cout de maintenance unitaire | (cout maintenance total / nb projets maintenus) | decroissant | mensuel |

## 3. Methode de mesure

### Collecte
- **Fiche projet** standardisée (product/) : devis accepte, dates de gates,
  temps Noah (declaratif), couts payants, bugs trouves, corrections, satisfaction.
- **QA** : les bugs sont enregistres dans les plan de tests (tests/) avec severite.
- **DevOps** : monitoring (uptime, erreurs) alimente le temps de maintenance et
  les corrections.
- **Satisfaction** : questionnaire court (J+30) — 5 questions, note globale /5.
- **Temps Noah** : saisie legere par etape du pipeline (outils simples : tableur
  ou CRM leger ; pas de surcharge).

### Aggregation et revue
- Rapport mensuel genere par les agents (brouillon) + validation Noah.
- Revue trimestrielle : tendances, etapes couteuses, actions correctives.
- Les KPIs alimentent la decision d'offre (prix, packages, perimetre maintenance).

### Regle de transparence
- Aucun KPI ne doit etre fabrique ou arrondi pour embellir : les chiffres viennent
  de la fiche projet reelle et des outils. En cas de doute, la valeur est marquee
  « non mesuree ».

## 4. Cibles de progression (section 30)

| Variable | Etat initial (pilote) | Cible apres 5 projets |
| -------- | --------------------- | --------------------- |
| Temps humain / site | constate au pilote | -50 % |
| Temps de creation | constate au pilote | < 3 semaines |
| Bugs / livraison | constate au pilote | < 2 majeurs |
| Cout moyen / site | constate au pilote | < 150 € |
| Marge / projet | constate au pilote | > 70 % |
| Taux de conversion | constate au pilote | > 30 % |
| Satisfaction | constate au pilote | > 4,5/5 |

> Les cibles v1 sont indicatives : Noah fixe les objectifs finaux en Gate 1.

## 5. Alimentation du systeme

- Chaque projet client produit sa fiche KPI (ROADMAP J8).
- Les resultats nourrissent la base de production : composants, templates,
  contenus, processus.
- L'amelioration du systeme = objectif economique principal (section 29).