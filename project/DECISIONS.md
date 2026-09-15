# Decisions

Registre des decisions actees au fil du projet. Chaque decision importante est
documentee ici (produit, offre, design, technique, budget, legal) par
l'agent qui la porte, puis validee par le Tech Lead / PM quand requis.

## Historique

| Date | Decision | Porteur | Detail |
| ---- | -------- | ------- | ------ |
| 2026-09-15 | Initialisation du projet noah-agency | Tech Lead | Nouveau systeme de production de sites web (cahier des charges dedie). L'ancien projet restaurant (thrash/) est abandonne. Equipe de 14 agents conforme aux AGENT 01-14. |

## Decisions Phase 0 — Product Manager (2026-09-15)

Statut : **PROPOSEES** — a valider par Noah en **Gate 1** (cahier des charges
section 23 : perimetre, prix, brief, fonctionnalites).

| ID | Decision | Porteur | Detail | A valider par Noah ? |
| -- | -------- | ------- | ------ | --------------------- |
| D-PM-01 | **Perimetre v1 : base de production proprietaire** — design system + composants reutilisables + templates secteurs + SEO/forms/cookie/accessibility/analytics/deploy utilities ; chaque site client = config + contenu + design, sans developpement ad hoc | PM | REQUIREMENTS.md, SCOPE.md | OUI (perimetre final) |
| D-PM-02 | **Offre : 3 packages** — Vitrine (1 200-2 000 € ttc indicatif), Vitrine + Reservation (1 800-2 800 €), Vitrine + Reservation + E-commerce leger (2 500-4 000 €) + maintenance 40-100 €/mois ; prix fixes par package ; delai cible 2-4 semaines | PM | SCOPE.md section 4 ; fourchettes du marche lyonnais 2026 | **OUI — prix decides uniquement par Noah** |
| D-PM-03 | **CLIENT_TYPE : B2B par defaut** (professionnels acheteurs) ; cas B2C documente et detecte avant tout document commercial | PM | BUSINESS_PROCESS.md section 5 ; traite par legal-compliance | OUI (decision formelle) |
| D-PM-04 | **KPIs systeme** : les 9 KPIs de la section 30 + complementaires ; cibles indicatives v1 ; mesure des le projet pilote | PM | KPIS.md | OUI (objectifs finaux) |
| D-PM-05 | **Gates 1-4 obligatoires** sur le systeme ET sur chaque projet client ; le pipeline bloque sans gate validee | PM | ROADMAP.md, REQUIREMENTS FR-VALID | — (regle transversale) |
| D-PM-06 | **Template flagship : restaurant** en v1 (secteur reference) ; autres secteurs en SHOULD | PM | SCOPE.md section 2 | OUI (choix du 1er template) |
| D-PM-07 | **Reservation : formulaire simple en v1** ; service externe a arbitrer avec le 1er client ayant le besoin | PM | REQUIREMENTS FR-FORM-02 | OUI (selon 1er client) |
| D-PM-08 | **Multilingue : FR par defaut** ; EN basique sur pages cles = COULD, decidee avec le 1er client concerne | PM | REQUIREMENTS FR-I18N | OUI (le cas echeant) |
| D-PM-09 | **Automatisations N1-N2 documentees comme futur** (ROADMAP) ; N3-N4 hors perimetre v1 ; jamais d'automatisation des actes engageants | PM | REQUIREMENTS FR-AUTO | — |
| D-PM-10 | **Budget : gratuit / low-cost** ; tout cout payant documente dans DECISIONS avant engagement | PM | SCOPE.md section 6 | OUI (validation budget) |

## Points ouverts — arbitrage Noah (Gate 1)

1. **Perimetre v1** du systeme (D-PM-01) : base + template restaurant, ou des le
   depart 2-3 templates secteurs ?
2. **Prix des packages et de la maintenance** (D-PM-02) : niveau, prix fixes ou
   devis libre, acompte (montant/%). **Decision 100 % Noah.**
3. **CLIENT_TYPE formel** (D-PM-03) : confirmation B2B prioritaire, politique du
   cas B2C.
4. **Cibles KPI** (D-PM-04) : objectifs finaux (ou validation des cibles v1).
5. **Template flagship** (D-PM-06) : restaurant ou un autre secteur prioritaire ?
6. **Reservation** (D-PM-07) : confirmer formulaire v1 / evaluer un service externe
   des le depart.
7. **Budget systeme** (D-PM-10) : plafond de depenses accepte (hosting, domaine,
   outils) et liste des services acceptables.
8. **TVA** : confirmer le statut (franchise en base / assujetti) — traite avec
   legal-compliance ; seuils 2026 a reverifier.
9. **Delai global** : aucune contrainte par defaut ; Noah fixe les jalons.

> Rappel : les agents ne prennent aucun engagement commercial (prix/delai).
> Ces recommandations n'engagent Noah que lorsqu'il les valide explicitement.

## Decisions a venir (Phase 0)

| Point | Attendu |
| ----- | ------- |
| Perimetre du systeme | Base de production (DS + composants + templates) |
| Offre et prix | Packages, perimetre minimal d'un site livrable |
| Client cible | B2B / B2C (a trancher formellement avant documents contractuels) |
| TVA | Franchise en base / assujetti (seuils 2026 a reverifier) |
| Budget | Gratuit / low-cost (D) |
| Delai | Aucune contrainte par defaut |
| Strategie multilingue | FR par defaut, EN basique sur les pages cles (reco) |
| Reservation | A definir (formulaire / service externe) — selon premier client |