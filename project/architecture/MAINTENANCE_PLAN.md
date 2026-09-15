# MAINTENANCE_PLAN.md — Plan de maintenance post-lancement

Version : 0.1 (Phase 1 — Design & Architecture)
Porteur : Solution Architect (AGENT 04) — reprise du cahier des charges section 26.
Reference : REQUIREMENTS.md (FR-MAINT-01 a 04), SCOPE.md (maintenance 40-100 EUR/mois),
BUSINESS_PROCESS.md (etape maintenance), ADR-005 (deploiement statique).

---

## 1. Principe

La maintenance est un **service de l'agence** (pas du client) : Noah reste
l'interlocuteur, les agents preparent et executent apres validation humaine
(FR-MAINT-04 : **aucune correction automatique en production** — y compris pour
les problemes critiques). Chaque projet client livre possede un
**MAINTENANCE_PLAN** rempli (section `maintenance` du client_data.yaml) : perimetre,
frequence, canaux, delais d'intervention, exclusions, tarif.

Le systeme etant **statique sans base de donnees** (ADR-009), les trois piliers
sont : (1) mises a jour + securite, (2) contenu, (3) SEO. La sauvegarde = le
depot git ; le rollback = redeploiement d'un build precedent.

## 2. Maintenance technique

| Tache | Qui | Quand | Comment |
| ----- | --- | ----- | ------- |
| Mises a jour dependances (astro, plugins, Node) | DevOps + agents dev | Mensuel (et apres alerte `npm audit`) | `npm audit` + montage de version en test, validation, deploy |
| Audit securite dependances | Security | Mensuel | `npm audit` / dependabot ; CVE critiques traitees sous 7 jours |
| Sauvegardes | Git (automatique) + DevOps | Continue (chaque commit) | Depot git = source unique ; pas de DB a sauvegarder ; assets clients dans le repo |
| Monitoring disponibilite | DevOps | Automatique | Service gratuit de type ping HTTPS (ex. UptimeRobot) sur l'URL du site ; alerte email Noah |
| Rollback | DevOps | A la demande | Redeploiement du dernier build valide (ADR-005) ; les anciens `dist/<slug>` conserves |
| Corrections | Devs (brouillon) -> Noah (validation) | Incident | Flux section 6 ci-dessous |

Cibles : disponibilite 99 %+ (hebergeur statique CDN), deploiement reproductible
documente, aucun secret dans le repo (NFR-SEC-01).

## 3. Maintenance contenu

Le contenu vit dans `content/clients/<slug>/client_data.yaml` + `assets/`. Une
mise a jour = modifier le fichier -> `build:site` -> preview -> Gate Noah ->
`deploy`.

| Type de contenu | Exemple | Qui met a jour | Comment | Frequence |
| --------------- | ------- | -------------- | ------- | --------- |
| Horaires / fermetures | conges, jours feries, `closed_periods` | Agence (Noah) | Edition YAML + regeneration | A la demande du client (minimum annuel : fermeture estivale) |
| Tarifs / menu | prix, plats, `menu.categories` | Agence (Noah) | Edition YAML + regeneration | A la demande / saisonnier |
| Photos | hero, galerie, og-image | Agence (Noah) | Ajout assets + references YAML, optimisation `astro:assets` | A la demande |
| Textes / evenements | services, FAQ, evenements | Agence (Noah) | Edition YAML (textes valides par Noah avant publication, FR-SEO-05) | A la demande |
| Avis clients | `reviews.items` | Agence (Noah) | Ajout uniquement d'avis reels verifies (D-CS-06) | Mensuel (controle) |

Regles : aucune donnee inventee ; tout contenu publie est valide par Noah
(FR-SEO-05) ; le client transmet par email/telephone, l'agence applique. Un acces
client libre-service reste hors perimetre v1 (SCOPE.md OUT).

## 4. Maintenance SEO

| Tache | Qui | Quand | Comment |
| ----- | --- | ----- | ------- |
| Controle Core Web Vitals | Performance | Mensuel | Lighthouse (mobile) sur la page d'accueil ; cibles NFR-PERF-01 ; alerte si regression |
| Controle indexation | SEO | Mensuel | Google Search Console (le cas echeant) : pages indexees, erreurs sitemap, core web vitals |
| Contenu SEO | SEO (brouillon) -> Noah (validation) | Trimestriel | FAQ, zone locale, textes sur mesure ; jamais de contenu publie sans validation |
| Alignement Google Business | SEO + Noah | Trimestriel | Nom/adresse/tel/horaires coherents site <-> fiche (SEO_SYSTEM §2.1) ; reponses avis le cas echeant |
| Contre-exemples : liens casses, 404 | QA | Mensuel | Scan du site (lien valides, 404, redirections) ; correction -> validation -> deploy |
| Veille metadonnees / SERP | SEO | Trimestriel | Positionnement local (ville + activite) ; ajustements de contenus valides |

## 5. Charges, canaux et exclusions (a personnaliser par contrat)

- **Inclus** (forfait mensuel 40-100 EUR indicatif, SCOPE.md) : mises a jour
  securite/dependances, monitoring, sauvegardes (git), corrections techniques
  mineures, mises a jour de contenu dans la limite convenue (ex. 2 par mois),
  controle de disponibilite.
- **Hors forfait** (facturable, devis avant) : refonte de page/structure, nouveau
  template secteur, ajout de fonctionnalite (blog, e-commerce), gros volumes de
  contenu/fonds d'images, integration d'un service tiers nouveau, travaux
  d'urgence hors heures ouvrées.
- **Canaux** : email Noah (support) ; delai d'intervention : incidents critiques
  < 24 h ouvrées, demandes normales < 72 h, contenu < 5 jours ouvrés.
- **Exclusions** : pannes du hebergeur (alerte + relance, pas de garantie sur un
  tiers), contenus fournis par le client non conformes/infirmes, volumes
  anormaux de spam sur le formulaire (redirection vers le service de forme avec
  quota, facturable si depassement).

## 6. Procedure d'incident

```text
Detection (monitoring / Noah / client)
   -> Diagnostic (agent, brouillon de ticket)
   -> Ticket (documente : impact, cause probable, solution proposee)
   -> Correction en test (jamais en production)
   -> Tests (QA : regression, accessibilite si UI, performance)
   -> VALIDATION NOAH (obligatoire — FR-MAINT-04)
   -> Deploiement (Gate 4 : action humaine explicite)
   -> Verification post-deploy (ping OK, page critique 200)
   -> Retour au client (si demande)
```

Niveaux : **Critique** (site indisponible, defacement, fuite de donnees) -> alerte
immediate, correction sous 24 h apres validation ; **Majeur** (page cassee,
formulaire en panne) -> sous 72 h ; **Mineur** (lien mort, texte, perf) -> passe
dans le cycle mensuel.

## 7. Plan de maintenance du systeme lui-meme (premiere annee)

| Action | Frequence | Responsable |
| ------ | --------- | ----------- |
| Mise a jour Astro/plugins/Node | Mensuel | DevOps + devs |
| Audit de securite + dependances | Mensuel | Security |
| Revue des KPIs systeme (KPIS.md) | Mensuel (apres le pilote) | PM + Tech Lead |
| Revue des templates/composants reutilises | Trimestriel | Tech Lead + devs |
| Mise a jour du registre prestataires (section 18 cahier des charges) | Trimestriel | Legal + DevOps |
| Veille reglementaire (TVA, CNIL, hebergeur) | Annuel | Legal |

Frequence par defaut du service client : **mensuelle**, ajustable par contrat
(bimensuel / trimestriel — champ `maintenance.frequency`).