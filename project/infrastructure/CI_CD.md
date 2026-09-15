# CI_CD.md — Pipeline d'integration et de deploiement continus

Version : 0.1 (Phase 3 — Infrastructure)
Porteur : DevOps Engineer (AGENT 12)
Statut : ACTE — decisions applicables des que le depot est pousse sur GitHub.
Reference : ADR-005 (deploiement statique Cloudflare Pages), ADR-002 (generation
multi-clients), TECHNICAL_ARCHITECTURE.md §4 (pipeline valider->generer->build),
cahier des charges section 23/25 (Gates humaines, dont Gate 4).

---

## 1. Principe

Le pipeline est volontairement **simple** (budget 0 EUR, zero infra complexe) :

```text
Git (push / PR)
   -> CI : npm ci + tests unitaires + validation client exemple + build exemple
   -> Artefact : dist/<slug>/ recuperable identiquement en local et en CI
   -> GATE 4 humaine (approbation explicite Noah)
   -> Deploy : workflow manuel par client -> Cloudflare Pages (wrangler)
```

Ce qui est **automatique** (CI) : la qualite du systeme (tests, build de
reference) sur chaque push et PR.

Ce qui est **manuel** (CD) : le deploiement en production de CHAQUE site
client. Le cahier des charges (section 25) interdit le deploiement automatique
en production sans validation humaine — le workflow `deploy-site` ne se
déclenche que par `workflow_dispatch` (bouton « Run workflow »), action
explicitement humaine, qui joue le role de **Gate 4**.

## 2. Branches et stratégie git

### 2.1 Branche unique `main`

La strategie recommandee est la **plus simple possible** :

- Une seule branche de travail : `main`.
- Chaque site client vit dans `content/clients/<slug>/` (dossier, pas branche :
  ADR-002 — la separation est par donnees, pas par historique git).
- Les commits sont au nom de l'auteur (yugmerabtene), messages a la premiere
  personne, jamais de generation automatique mentionnee.
- **Protection de branche** (a activer dans GitHub) : `main` est protegee —
  pas de push direct, tout passe par PR (ou push direct autorise uniquement
  pour yugmerabtene si Noah le souhaite — decision Noah). Recommandation :
  push direct OK pour la phase pilote, protection stricte (PR obligatoire)
  des que l'activite passe a plusieurs mains.

### 2.2 Pourquoi pas une branche par client

- Une branche par client dupliquerait l'historique et compliquerait les
  mises a jour communes (design system, composants, templates).
- Le fichier client (client_data.yaml + assets) est suffisamment petit et
  isole pour vivre dans `main` sans risque de collision.
- Un changement de contenu client = un commit cible dans
  `content/clients/<slug>/`, reveu en PR, deploye par workflow manuel.

## 3. Workflows GitHub Actions

Deux workflows dans `.github/workflows/` :

| Workflow | Fichier | Declencheur | But |
| -------- | ------- | ----------- | --- |
| `ci.yml` | `.github/workflows/ci.yml` | push sur `main` + PR vers `main` | Qualite du systeme : tests, validation, build de reference |
| `deploy-site.yml` | `.github/workflows/deploy-site.yml` | **manuel** (`workflow_dispatch`, saisie du slug client) | Gate 4 : build + deploiement d'UN site client sur Cloudflare Pages |

### 3.1 `ci.yml` — integration continue du systeme

Sur **chaque push `main`** et **chaque PR vers `main`** :

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 20 LTS (compatible `engines` package.json)
3. `npm ci` (installation reproductible depuis package-lock.json)
4. `npm test` — 30 tests unitaires (validation, reservation, forms)
5. `npm run validate:example` — validation du client exemple (code 0 attendu)
6. `npm run build:example` — generation + build Astro du client exemple
   (sortie `dist/exemple-restaurant/`)
7. Upload de `dist/` en artefact (optionnel, conserve 7 jours) pour
   inspection/preview manuelle si besoin

La CI ne deploie **jamais** : elle verifie uniquement que le systeme est
sain. Le commit du client exemple bloque s'il est invalide.

### 3.2 `deploy-site.yml` — deploiement d'un site client (Gate 4)

Declenchement **exclusivement manuel** (`workflow_dispatch`) avec un champ
d'entree obligatoire : le `slug` du client (ex. `exemple-restaurant`).

Etapes :

1. Validation de l'entree (`slug` conforme regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`).
2. `npm ci` + `npm test` (le systeme doit etre sain avant tout deploy).
3. `npm run validate -- --client <slug>` — code 0 obligatoire (un client avec
   donnees invalides ne se deploie pas).
4. `npm run build:site -- --client <slug>` — generation + build -> `dist/<slug>/`.
5. Deploiement via Wrangler :

   ```bash
   npx wrangler pages deploy dist/<slug> --project-name=<slug> --branch=production
   ```

   Secrets GitHub requis (configures dans Settings -> Secrets and variables) :
   - `CLOUDFLARE_API_TOKEN` : token API Cloudflare avec permission
     `Cloudflare Pages: Edit` (cree dans le dashboard Cloudflare).
   - `CLOUDFLARE_ACCOUNT_ID` : identifiant du compte Cloudflare.

6. **Verification post-deploy** (job `verify`) : ping HTTPS sur l'URL
   produite (200 attendu sur `/`). Echec -> rollback guide (voir
   BACKUP_ROLLBACK.md).

Le deploiement est **par client** : chaque site a son projet Cloudflare
Pages dedie (`--project-name=<slug>`). Un client ne peut pas casser un autre
client (isolation des builds, ADR-002).

## 4. Pipeline local equivalent (sans GitHub)

Le meme pipeline est executable en local, sans GitHub :

```bash
npm ci
npm test                    # 30 tests
npm run validate:example    # code 0
npm run build:example       # dist/exemple-restaurant/
```

Pour un client reel :

```bash
npm run validate -- --client <slug>    # code 0 obligatoire
npm run build:site -- --client <slug>  # dist/<slug>/
npx astro preview                      # preview locale (Gate 3)
```

Puis deploiement manuel (une seule commande, apres Gate 4) :

```bash
npx wrangler pages deploy dist/<slug> --project-name=<slug> --branch=production
```

## 5. Quotas gratuits GitHub Actions (rappel budget 0 EUR)

- Les depots **publics** : minutes illimitees (gratuit).
- Les depots **prives** : 2 000 minutes/mois gratuites (suffisant pour ce
  volume : ~2-4 builds/jour x ~1,5 min).
- Recommandation : depot **prive** par defaut (les donnees clients sont
  sensibles, meme si non secretes), ou public si Noah prefere. Le workflow
  est identique dans les deux cas.
- Artefacts conserves 7 jours (gratuit, espace limite mais suffisant).

## 6. Alternatives de deploy documentees (ADR-005)

| Hebergeur | Deploy CI | Limites notables | Verdict |
| --------- | --------- | ---------------- | ------- |
| **Cloudflare Pages** (reference) | `wrangler pages deploy` | 500 builds/mois gratuits, bande passante illimitee, deploiements illimites | **CHOISI** |
| Netlify | `netlify deploy --prod` | 300 min build/mois gratuites, 100 GB bande passante | Alternative documentee |
| GitHub Pages | push sur branche `gh-pages` ou Actions | 1 site par depot (multi-clients : sous-chemins ou 1 depot par client), pas de redeploiement simple | Alternative |

Le workflow `deploy-site.yml` est concu pour Cloudflare Pages ; un portage
Netlify se resume au remplacement de l'etape wrangler par la CLI Netlify
(secret `NETLIFY_AUTH_TOKEN` en variable d'environnement).

## 7. Envoyer le depot sur GitHub (1ere fois, par Noah)

```bash
# Depuis /mnt/c/Users/Noahu/Desktop/OpenCode/noah-agency
git remote add origin https://github.com/<compte>/noah-agency.git
git push -u origin main
```

Puis, dans GitHub :

1. Creer le repo (prive recommande), ne pas l'initialiser (README, etc. —
   le depot local contient deja tout).
2. Settings -> Branches -> Add rule : proteger `main` (optionnel, cf. 2.1).
3. Settings -> Secrets and variables -> Actions :
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Requirements checks devant passer : le workflow `ci.yml` s'execute
   automatiquement au premier push.

## 8. Dependances et points bloquants

- **URL GitHub attendue** : le push ne peut pas etre fait par les agents
  (aucun remote configure). Noah fournit l'URL du depot -> `git remote add`
  + `git push -u origin main`.
- **Compte Cloudflare Pages** : a creer par Noah (gratuit) ; l'identite
  legale de l'hebergeur (Cloudflare, Inc.) est necessaire aux mentions
  legales des sites clients (voir DEPLOYMENT.md §7).
- **Service de formulaire** : le choix du prestataire (Web3Forms recommande,
  PO-BE-01/PO-DB-01) se fait avec le 1er client reel ; il n'impacte pas ce
  pipeline (endpoint = valeur du client_data.yaml, pas une env de CI).
- **`seo.domain`** (C-17, REQUIRED au build) : le deploy bloque tant que le
  client_data.yaml d'un client reel n'a pas son domaine. C'est voulu.