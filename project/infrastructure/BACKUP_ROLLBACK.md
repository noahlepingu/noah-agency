# BACKUP_ROLLBACK.md — Sauvegardes et procedure de retour en arriere

Version : 0.1 (Phase 3 — Infrastructure)
Porteur : DevOps Engineer (AGENT 12)
Statut : ACTE — strategie applicable des que le depot est pousse sur GitHub.
Reference : ADR-002 (source unique = YAML), ADR-005 (rollback = redeploiement),
ADR-009 (pas de DB), DATA_DECISION.md (strategie de donnees), DB-02.

---

## 1. Principes

1. **Le depot git EST la sauvegarde** (ADR-009, D-DB-02) : toute donnee du
   systeme et des clients vit dans le depot (client_data.yaml, assets,
   templates, composants). Aucun autre stockage n'existe.
2. **Le site deploye n'a pas besoin de sauvegarde separee** : il est
   integrablement regenere depuis la source (commande `build:site`).
   Sauvegarder dist/ serait dupliquer du code regeneree et creerait un point
   de confusion (dist/ est gitignore).
3. **Le rollback = redeploiement d'un build precedent** (ADR-005) : retour a
   un commit/tag, puis redeploiement.
4. **Budget 0 EUR** : aucun outil de backup payant. Git + GitHub suffisent.

## 2. Stratégie de sauvegarde

### 2.1 Ce qui est sauvegarde (le depot git)

| Element | Chemin | Versionne ? |
| ------- | ------ | ----------- |
| Donnees clients (YAML) | `content/clients/<slug>/client_data.yaml` | OUI |
| Assets clients (images, logos, OG) | `content/clients/<slug>/assets/` | OUI |
| Base de production (composants, layouts, styles, utils) | `src/` | OUI |
| Templates secteurs | `templates/` | OUI |
| Configuration (astro.config, scripts, package.json) | racine | OUI |
| Documentation | `project/` | OUI |

Cela couvre **100 % des donnees necessaires** pour regenerer le systeme et
chaque site client.

### 2.2 Ce qui n'est PAS sauvegarde (et pourquoi)

| Element | Pourquoi pas |
| ------- | ------------ |
| `dist/` (builds) | Regeneres a la demande (`npm run build:site -- --client <slug>`) |
| `src/sites/` | Materialises par generate-site.mjs (ADR-002) ; gitignore |
| `node_modules/` | Reinstalles par `npm ci` (package-lock.json versionne) |
| Donnees de formulaires | Stockees chez le service tiers (Formspree/Web3Forms), duree = la leur ; pas de donnees cote agence (REGISTRE_DONNEES.md) |
| Logs serveur / monitoring | Pas de serveur (statique) ; UptimeRobot ne stocke que des URLs |

> Justification : `dist/<slug>/` est derive de `content/clients/<slug>/` +
> `src/` + `templates/`. Sauvegarder le derive sans la source serait inutile ;
> il suffit de rejouer la source (ADR-002). C'est la **propriete reproductible**
> du systeme qui rend la sauvegarde legere.

### 2.3 Procedure de sauvegarde

| Action | Frequence | Qui | Comment |
| ------ | --------- | --- | ------- |
| Commit des modifications (contenu, code) | Chaque changement | Noah / agents | Commit cible + message clair |
| Push vers GitHub | Chaque changement | Noah | `git push origin main` |
| Tag de version (releases) | A chaque livraison (Gate 3/4) | Noah | `git tag v1.0.0 && git push --tags` |
| Verifier que le repo est sain | Mensuel | Noah / DevOps | `git status` propre, remote configuré |
| Export hors-ligne (archive) | Trimestriel (optionnel) | Noah | `git bundle create backup-yyyy-mm.bundle --all` + copie sur disque externe |

> Nota : un `git bundle` mensuel/trimestriel sur un stockage externe (cle USB,
> disque) est une **protection complementaire** recommandee en cas de perte
> du compte GitHub. C'est gratuit et suffisant pour ce volume.

## 3. Tags de release (nomenclature)

| Type | Exemple | Quand |
| ---- | ------- | ----- |
| Version systeme | `v0.1.0` | A chaque evolution de la base (Phase 2 a 9) |
| Livraison client | `client-<slug>-v1` | A la 1ere mise en production d'un client, puis `v2`, `v3`... |

Un tag permet de **retrouver un etat connu** du systeme ou d'un site
client pour un rollback cible.

## 4. Procedure de rollback (integre au deploiement)

### 4.1 Principe

Rollback = revenir a un etat connu du code + redeployer.

```
SITUATION : le site deploye ne fonctionne pas correctement (page cassee,
            formulaire en panne, defacement, erreur 500, etc.)
     |
     v
1. IDENTIFIER le dernier etat connu bon (tag, commit, deploy precedente)
     |
     v
2. DECIDER : rollback complet (code) ou rollback deploy (build precedent)
     |
     v
3. APPLIQUER (section 4.2 ou 4.3)
     |
     v
4. VERIFIER (ping, pages critiques)
     |
     v
5. ANALYSER la cause (ticket, correction en test — MAINTENANCE_PLAN.md §6)
```

### 4.2 Rollback via Cloudflare Pages (le plus rapide — 1 clic)

Le build precedent est un **deploiement** dans l'historique du projet Pages
(chaque deploiement est conserve par Cloudflare).

1. Ouvrir https://dash.cloudflare.com -> Pages -> [projet du client].
2. Onglet **Deployments**.
3. Identifier le deploiement d'avant (celui qui fonctionnait).
4. Cliquer sur les « ... » de cette ligne -> **Retry deployment** (ou le
   bouton de re-deploiement).
5. Cloudflare redeploie exactement ce build (les fichiers sont conserves).
6. Verifier : `curl -s -o /dev/null -w '%{http_code}' https://<domaine>/`
   -> 200 attendu.

Avantages : no git, no rebuild, 1 minute. **C'est la procedure reference
pour un rollback rapide.**

### 4.3 Rollback complet (code source)

Utilise quand le probleme vient du **code** (template, composants, config)
et pas seulement du build deploye.

```bash
# 1. Lister les tags/commits disponibles
git tag --list
git log --oneline -10

# 2. Revenir a un etat connu (ex. client-<slug>-v1)
git checkout client-<slug>-v1   # detache HEAD

# 3. (Optionnel) creer une branche de rollback pour travailler
git switch -c rollback-<slug>-<date>

# 4. Regenerer le site client depuis l'etat ancien
npm ci
npm run build:site -- --client <slug>

# 5. Tester localement (preview) avant deploy
npx astro preview

# 6. Gate 4 : Noah déclenche le deploiement (workflow_dispatch avec le slug)
#    Remarque : le workflow deploie depuis main — si on deploy depuis une
#    branche, adapter la ref du workflow. Alternative : merge rapide de la
#    correction la plus simple.
```

> Simplification recommandee : plutot qu'un rollback complet de branche, la
> vraie correction (bug) est faite sur `main` puis relevee via le flux
> normal (incident -> correction en test -> validation Noah -> Gate 4).
> Le rollback ne sert qu'a **restaurer le service vite** ; la correction
> durable suit la procedure d'incident.

### 4.4 Rollback via GitHub Actions (redeploiement d'un build)

Le workflow `deploy-site.yml` deploye `dist/<slug>` construit depuis le
commit checkout. Pour redeployer un commit ancien :

1. Dans GitHub -> Actions -> Deploy site client.
2. Cliquer sur « Run workflow ».
3. Au lieu du slug, pointer le workflow sur une branche/tag ancien
   (l'interface workflow_dispatch affiche la branche par defaut ; modifier
   l'entree `ref` si le workflow l'expose).
4. Valider. La CI rebuild + redeploie l'etat ancien.

> Alternative sans changer de branche : regenerer depuis `main` puis
> redeployer via Cloudflare Dashboard (4.2) — plus rapide et sans risque
> de divergence de branches.

## 5. Procedure de recouvrement complet (reconstruction depuis zero)

Si le depot git local est perdu et que seul GitHub existe :

```bash
git clone https://github.com/<compte>/noah-agency.git
cd noah-agency
npm ci
npm run build:example          # verifier que tout compile
npm run build:site -- --client <slug>   # chaque client
```

Si GitHub aussi est perdu (mais qu'un `git bundle` existe) :

```bash
git clone /chemin/vers/backup-yyyy-mm.bundle noah-agency
```

C'est tout. Aucune base de donnees a restaurer, aucun serveur a reconfigurer.

## 6. Protection de branche et prevention

| Mesure | Effet | Quand |
| ------ | ----- | ----- |
| Protection de branche `main` (PR requise) | Evite les pushs accidentels | Recommande apres la phase pilote |
| CI sur chaque PR (ci.yml) | Un code casse ne merge pas | Des le 1er push GitHub |
| Validation client (code 0) | Un YAML invalide ne se deploie pas | Des le 1er push |
| Tags avant livraison | Point de retour connu | A chaque Gate 3 |
| Revue humaine (Gate 4) | Rien ne part en prod sans validation Noah | Obligatoire |

## 7. Dependances et points ouverts

- **Depot GitHub** : la strategie suppose que le depot est pousse sur
  GitHub (backup hors ligne + protection). En attendant : le depot local
  git est LA sauvegarde (chaque commit). Noah fournit l'URL GitHub.
- **Gestionnaire de secrets** : aucun necessaire en v1 (pas d'acces
  serveur, pas de DB, pas de donnees sensibles au build). Les tokens
  Cloudflare vivent dans les GitHub Secrets uniquement.
- **Archive hors-ligne** : optionnelle mais recommandee ; Noah decide si
  il met en place un `git bundle` trimestriel.