# MAINTENANCE_PLAN.md — Plan de maintenance post-lancement (application operationnelle)

Version : 0.1 (Phase 3 — Infrastructure)
Porteur : DevOps Engineer (AGENT 12) — applique et complete
`project/architecture/MAINTENANCE_PLAN.md` (architecte, v0.1).
Reference : cahier des charges sections 26-27, D-ARC-11, REGISTRE_DONNEES.md,
MONITORING.md, BACKUP_ROLLBACK.md.

---

## 1. Portee de ce document

Le plan de maintenance de l'architecte (project/architecture/MAINTENANCE_PLAN.md)
definit le cadre : trois piliers (technique / contenu / SEO), frequence
mensuelle, procedure d'incident avec validation Noah obligatoire.

Ce document **applique ce cadre au niveau operationnel** : qui fait quoi,
avec quels outils, quelles commandes, et la checklist mensuelle concrete.
Les deux documents sont complementaires ; en cas de contradiction, le plan
de l'architecte fait reference (c'est la source definie en Phase 1).

## 2. Responsabilites post-lancement

| Responsabilite | Qui | Frequence | Outil / Methode |
| -------------- | --- | --------- | --------------- |
| Mise a jour du contenu (horaires, menu, photos) | Noah (agence), agents preparent | A la demande du client | Edition client_data.yaml + regeneration (ADR-002) |
| Mises a jour de securite (dependances) | DevOps + agents dev | Mensuel + alerte `npm audit` | `npm audit`, contribut GitHub (Dependabot), test CI |
| Renouvellement du nom de domaine | Noah | Annuel (alerte 60 j avant expiration) | Registrar (OVH/Gandi/Google) ; alerte email |
| Surveillance monitoring / logs | Noah (agent prep. a la demande) | A chaque alerte / mensuel | UptimeRobot (MONITORING.md), GitHub Actions |
| Procedure d'incident | DevOps prepare brouillon -> Noah valide | Incident | MAINTENANCE_PLAN.md architecte §6 |
| Verifications mensuelles | Noah | Mensuel | Checklist section 6 ci-dessous |
| Revue securite RGPD / prestataires | Legal + DevOps | Trimestriel | Registre des prestataires (section 18 cahier des charges) |
| Veille reglementaire (TVA, CNIL) | Legal | Annuel | — |

## 3. Mises a jour de securite — procedure concrete

### 3.1 Audit mensuel

```bash
# Depuis la racine du depot
npm audit --omit=dev     # dependances de production (astro, yaml)
npm audit                # tout (y compris dev)
npm outdated             # versions disponibles
```

### 3.2 Application d'une mise a jour

```bash
npm update               # patchs/minor dans les limites du package.json
# OU
npm install <package>@<version>   # upgrade cible (major : decider)
npm test                 # 30 tests
npm run build:example    # build de reference
git add package*.json && git commit -m "Maj dependances : ..."
git push                 # CI verifie
# Gate 4 : redeploiement des sites clients impactes (le cas echeant)
```

### 3.3 Versions majeures (astro 6, node 22)

Une version majeure n'est appliquee qu'apres :
1. Test complet (CI + build exemple + preview).
2. Validation Noah (Gate 2/3 sur le systeme).
3. Meme procedure que ci-dessus avec `npm install <package>@next` (ou la
   version stable ciblee) apres lecture du changelog.

### 3.4 Dependabot (optionnel, recommande)

Activer Dependabot sur GitHub (Security -> Dependabot -> Enable) :

- Watch npm ecosystem, weekly, dev dependencies incluses.
- Il cree des PR automatiquement -> la CI les verifie -> Noah/agent les
  merge apres validation.

**Delai contractuel** : CVE critique traitee sous 7 jours (MAINTENANCE_PLAN
architecte §2).

## 4. Renouvellement du domaine — procedure concrete

| Action | Qui | Quand | Comment |
| ------ | --- | ----- | ------- |
| Surveiller la date d'expiration du domaine du client | Noah | Continu (alerte registrar) | Alerte email OVH/Gandi 90/60/30 j avant expiration |
| Renouveler le domaine | Noah a la charge du client | Au moins 30 j avant expiration | Paiement client (facture separee, 10-15 EUR/an) |
| Verifier l'enregistrement (WHOIS) | Noah | Annuel | `whois <domaine>` (ou outil en ligne) |
| Verifier le DNS + HTTPS | Noah | Annuel | UptimeRobot + https://latabledessai.fr |

> Regle : **jamais laisser expirer un domaine**. L'alerte email du
> registrar est le filet de securite ; Noah ajoute un rappel calendrier
> (Google Calendar, mensuel) 6 mois avant l'expiration.

## 5. Monitoring continu

Cf. MONITORING.md. En resume :

- UptimeRobot : 1 monitor par site client (email Noah en cas de panne).
- GitHub Actions : deploiements verts/rouges (historique conservé 90 j).
- Cloudflare Pages : dashboard du projet (bande passante, erreurs 5xx).
- Performance : audit mensuel PageSpeed/Lighthouse.

## 6. Checklist mensuelle concrete (a executer par Noah le 1er du mois)

### 6.1 Systeme

- [ ] `git status` : depot propre, derniers changements pousses (`git push`)
- [ ] `npm audit` : aucune vulnerabilite critique ; dossier de mise a jour
      si CVE
- [ ] `npm test` : 30 tests OK en local (la CI le fait deja, double-verif
      rapide)
- [ ] CI GitHub : dernier run `ci.yml` vert
- [ ] Pas de PR ouverte stagnante > 7 jours

### 6.2 Sites clients (a repeter par client)

- [ ] UptimeRobot : aucun monitor en alerte (ou verifier la cause)
- [ ] Ping manuel : `curl -s -o /dev/null -w '%{http_code}' https://<domaine>/`
      -> 200
- [ ] Page d'accueil : charge correctement sur mobile (apercu rapide)
- [ ] Formulaire : envoyer un test de contact (si configuré) — recevoir
      l'email (ou le flux du prestataire)
- [ ] Liens internes : scan `npx lychee dist/<slug>/**/*.html` (ou l'agent
      QA le fait en Phase 4)
- [ ] Pages legales a jour (mentions legales, confidentialite) : date +
      donnees encore exactes
- [ ] Horaires/menu : aucun changement a faire ce mois-ci ? (sinon mise a
      jour YAML a la demande du client)
- [ ] Performance : PageSpeed Insights >= 90 (si regression, ticket)

### 6.3 Domaine

- [ ] Expiration des domaines clients : noter la prochaine date dans le
      calendrier (≤ 6 mois avant expiration -> alerte Noah)

### 6.4 Comptes et secrets

- [ ] Secrets GitHub : aucun token expiré (CLOUDFLARE_API_TOKEN)
- [ ] Recuperer le mail de UptimeRobot : les notifications arrivent bien

### 6.5 Revue mensuelle (hors checklist technique)

- [ ] Revue des KPIs systeme (PM + Tech Lead) — KPIS.md
- [ ] Revue du registre des prestataires (Legal + DevOps) — trimestrielle

## 7. Procedure d'incident (rappelle MAINTENANCE_PLAN architecte §6)

```text
Detection (UptimeRobot / Noah / client)
   -> Diagnostic (agent, brouillon de ticket)
   -> Ticket (impact, cause probable, solution proposee)
   -> Correction en test (jamais en production — FR-MAINT-04)
   -> Tests (QA : regression, accessibilite si UI, performance)
   -> VALIDATION NOAH (obligatoire)
   -> Deploiement (Gate 4 : action humaine)
   -> Verification post-deploy (ping OK, page critique 200)
   -> Retour au client (si demande)
```

| Niveau | Definition | Delai |
| ------ | ---------- | ----- |
| Critique | Site indisponible, defacement, fuite donnees | < 24 h ouvrées |
| Majeur | Page cassee, formulaire en panne | < 72 h |
| Mineur | Lien mort, texte, perf | Cycle mensuel |

**Pour un incident critique la nuit/week-end** : la priorite est de
**restaurer le service** (rollback Cloudflare 1-clic, BACKUP_ROLLBACK.md
§4.2), puis de documenter la cause dans la procedure normale. Le rollback
ne necessite pas d'attendre un agent : Noah peut le faire seul en 1 minute ;
la correction durable suit ensuite la procedure d'incident avec validation.

## 8. Contenu — flux de mise a jour (rappelle architecte §3)

Un changement de contenu (menu, horaires, photos) suit toujours :

```text
Client -> Noah (email/telephone)
   -> Agent/Noah : edition client_data.yaml + assets
   -> npm run validate -- --client <slug>   (code 0)
   -> npm run build:site -- --client <slug> (preview locale Gate 3)
   -> VALIDATION NOAH (le contenu publié est toujours valide — FR-SEO-05)
   -> Gate 4 : deploiement (workflow_dispatch)
```

Frequences contractuelles : `maintenance.frequency` = mensuel par defaut
(ajustable bimensuel/trimestriel). Contenus limites par le forfait (ex. 2
maj/mois incluses) ; au-dela -> devis (MAINTENANCE_PLAN architecte §5).

## 9. Cout de la maintenance (rappel budget)

| Poste | Cout |
| ----- | ---- |
| Renouvellement domaine client | 10-15 EUR/an (facture client, hors maintenance) |
| UptimeRobot | 0 EUR (plan gratuit) |
| GitHub (depot prive) | 0 EUR (plan gratuit, 2000 min/mois) |
| Cloudflare Pages | 0 EUR (plan gratuit) |
| npm/astro/yaml | 0 EUR (open-source) |
| **Total systeme** | **0 EUR/mois** |

> Tout cout payant futur (service formulaire depassant le quota, analytics
> Plausible, domaine supplementaire) est documente dans DECISIONS.md avant
> engagement (D-PM-10).

## 10. Dependances et points ouverts

- Les **delais d'intervention contractuels** (forfait maintenance) sont des
  donnees commerciales a fixer par Noah par contrat client (MAINTENANCE_PLAN
  architecte §5, fourchettes 40-100 EUR/mois).
- Le **service de formulaire** choisi avec le 1er client determine le quota
  mensuel et la surveillance des envois (dashboard du prestataire).
- La **revue du registre des prestataires** (trimestrielle) depend de la
  liste reelle des services actifs (a completer au 1er client reel).