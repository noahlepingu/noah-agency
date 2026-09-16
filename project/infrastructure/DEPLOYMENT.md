# DEPLOYMENT.md — Procedures operationnelles de deploiement

Version : 0.2 (Phase 7 — Sprint Gate 4 : security headers, security.txt, dependabot)
Porteur : DevOps Engineer (AGENT 12)
Statut : ACTE — procedures applicables des que le depot GitHub est accessible.
Reference : ADR-005 (Cloudflare Pages reference, Gate 4), CI_CD.md (pipeline),
TECHNICAL_ARCHITECTURE.md §4 (pipeline de generation),
FINAL_REVIEW.md (conditions C-04, C-07, C-08, C-09).

---

## 1. Vue d'ensemble

```text
                    PRE-PRODUCTION (par client)
                    - client_data.yaml complet + valide
                    - domaine achete (ou existant)
                    - DNS configure
                    - PRIVACY_REQUIREMENTS rempli
                    - mentions legales avec hebergeur = Cloudflare
                    - TODO_PRODUCTION.md cochee
                            |
                            v
                    GATE 3 : Noah valide la preview locale
                            |
                            v
                    GATE 4 : Noah deploie (action humaine)
                            |
              ┌─────────────┴─────────────┐
              │                           │
        Via GitHub Actions          Via ligne de commande
        (recommande)                (fallback)
              │                           │
    workflow_dispatch                 wrangler CLI
    saisie slug                      deploie dist/<slug>
              │                           │
              └─────────────┬─────────────┘
                            v
                    Cloudflare Pages
                    HTTPS auto, CDN, domaine custom
```

---

## 2. Hébergeur de reference : Cloudflare Pages

### 2.1 Pourquoi Cloudflare Pages

- **Gratuit** (budget 0 EUR, D-PM-10) : builds illimites (500/mois en realite),
  bande passante illimitee, HTTPS automatique.
- **HTTPS** inclus avec certificat Let's Encrypt gere automatiquement.
- **Domaine personnalise** : on ajoute le domaine du client (apex ou sous-domaine).
- **Rollback simple** : re-deploy d'un build precedent depuis le dashboard
  Cloudflare Pages -> Deployments -> «Retry deployment».
- **Pas de lock-in** : sortie 100% statique, deployable sur n'importe quel
  hebergeur statique (ADR-005).
- **Identite legale** : Cloudflare, Inc. — 101 Townsend Street, San Francisco,
  CA 94107, USA (a mentionner dans les mentions legales des sites clients,
  LEGAL_SITE_TEMPLATES.md §1).

### 2.2 Creation du compte Cloudflare (1ere fois, par Noah)

1. Aller sur https://dash.cloudflare.com/sign-up et creer un compte.
2. (Sans grille payante — le plan "Free" suffit.)
3. Recuperer les informations pour le `PRIVACY_REQUIREMENTS` :
   - Nom : `Cloudflare, Inc.`
   - Adresse : `101 Townsend Street, San Francisco, CA 94107, USA`
   - Telephone : `+1 (888) 993-5273` (verifie au site cloudflare.com)
   - Site : `https://www.cloudflare.com`

### 2.3 Creation d'un projet Cloudflare Pages par client

**Methode recommandee : deploiement par Wrangler (CI/CD)**

A la 1ere fois d'un client, Wrangler cree automatiquement le projet
`--project-name=<slug>` sur Cloudflare Pages.

**Methode alternative : deploiement local Wrangler**

```bash
# Installer wrangler si necessaire (une seule fois)
npm install -g wrangler

# Deployer
CLOUDFLARE_API_TOKEN=<token> CLOUDFLARE_ACCOUNT_ID=<account_id> \
  npx wrangler pages deploy dist/<slug> --project-name=<slug> --branch=production
```

---

## 3. Configuration DNS et HTTPS

### 3.1 Domaine du client

Noah achete le domaine du client aupres du registrar de son choix (OVH,
Gandi, Google Domains — ~10-15 EUR/an, a la charge du client).

### 3.2 Ajouter le domaine a Cloudflare Pages

Dans le dashboard Cloudflare, pour le projet Pages du client :

1. Pages -> [slug du projet] -> Custom domains -> Set up a custom domain.
2. Saisir le domaine (ex. `latabledessai.fr`).
3. Cloudflare recommande de passer le DNS chez Cloudflare (changement de NS).
   C'est le cas ideal : certificats TLS automatiques, protection DDoS, DNS
   rapides.

Si le domaine reste chez un autre registrar (DNS externe) :

1. Cloudflare Pages indique les records a creer chez le registrar :
   - Record `A` ou `CNAME` pointant vers le projet Pages.
   - Voir le dashboard Pages pour les valeurs exactes.
2. DNS externe = HTTPS gere par Cloudflare quand le domaine est en mode proxied,
   sinon certificat non delivre. Recommandation : transferer le NS chez
   Cloudflare (gratuit, sans surcout).

### 3.3 Formats de domaines supportes

| Cas | Domaine | Sous-domaine |
| --- | ------- | ------------ |
| Domaine principal | `latabledessai.fr` | — |
| Avec www | `www.latabledessai.fr` | CNAME vers le domaine Pages |
| Sous-domaine | `site.latabledessai.fr` | — |
| Multi-langues FR | `latabledessai.fr` | — |
| Multi-langues EN | — | `/en/` (AROBASETE-004, pas de domaine separe) |

### 3.4 HTTPS

HTTPS est **automatique** avec Cloudflare Pages :
- Certificat TLS gere par Cloudflare (Let's Encrypt, renouvellement auto).
- Active des l'ajout du domaine custom.
- Le site est toujours accessible en HTTPS ; le HTTP redirige en HTTPS
  par defaut.

### 3.5 Exemple avec le domaine du premier client

Supposons le 1er client : `la-table-d-essai`, domaine `latabledessai.fr`.

```text
1. Noah achete latabledessai.fr (OVH, 12 EUR/an)
2. Noah cree le compte Cloudflare, ajoute le domaine
3. Noah change les NS chez OVH pour pointer vers Cloudflare (24-48h)
4. Noah cree le projet Pages "la-table-d-essai" sur Cloudflare
5. Noah ajoute le domaine custom dans Pages -> Custom Domains
6. HTTPS actif automatiquement
7. Noah configure le workflow GitHub Actions (CLOUDFLARE_API_TOKEN)
8. Noah declenche deploy-site.yml avec slug "la-table-d-essai"
9. Verifier : https://latabledessai.fr retourne 200
```

---

## 4. Variables d'environnement (secrets)

### 4.1 Principe

Aucun secret n'est commite dans le depot (`.env` est dans `.gitignore`).
Les secrets vivent dans :
- **GitHub Secrets** : pour le CI/CD (Settings -> Secrets and variables ->
  Actions).
- **Cloudflare Dashboard** : pour Cloudflare Pages (Variables d'env du projet
  Pages si besoin futur).
- **`.env` local** : pour le developpement en local (jamais pousse).

### 4.2 Secrets GitHub pour Cloudflare Pages

| Secret | Description | Comment l'obtenir |
| ------ | ----------- | ----------------- |
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare (permissions Pages:Edit + DNS:Edit) | Cloudflare Dashboard -> My Profile -> API Tokens -> Create Token -> model "Edit Cloudflare Workers" + perimetre DNS:Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte Cloudflare | Cloudflare Dashboard -> URL (visible dans la barre d'adresse ou dans Workers & Pages -> Overview) |

### 4.3 Secrets Cloudflare (futur, optionnel)

Si des variables d'environnement sont necessaires au futur (ex. endpoint API,
analytics sans cookie), elles se configurent dans Cloudflare Pages :
Pages -> [projet] -> Settings -> Environment variables.

**Pour l'instant, aucune variable n'est requise en prod** : les endpoints de
formulaire sont dans `client_data.yaml` (dans le HTML genere, pas des secrets
— ADR-003, pas de server-side).

### 4.4 Endpoints de formulaires (decision)

Les endpoints de formulaires (contact.form_endpoint, reservation.form_endpoint)
sont des **URL publiques** stockees dans le `client_data.yaml`. Ils ne sont
**pas** des secrets. Ils apparaissent dans le HTML genere (cote client,
progressive enhancement). Le service de formulaire (Formspree, Web3Forms, etc.)
gere l'anti-spam et le rate-limiting.

Aucune variable d'environnement n'est necessaire pour les formulaires.

---

## 5. Deployer le systeme (premiere fois)

### 5.1 Pouser le depot sur GitHub

```bash
cd /mnt/c/Users/Noahu/Desktop/OpenCode/noah-agency
git remote add origin https://github.com/<compte>/noah-agency.git
git push -u origin main
```

### 5.2 Configurer les secrets GitHub

Dans le dashboard GitHub :

1. Settings -> Secrets and variables -> Actions -> New repository secret
2. Ajouter `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID`
3. (Facultatif) Settings -> Environments -> New environment -> "production"
   + "Required reviewers = Noah" : ajout d'une couche de validation
   humaine avant tout deploiement

### 5.3 Verifier que la CI passe

Le workflow `ci.yml` s'execute automatiquement au premier push. Verifier
qu'il est vert (les tests passent, le build exemple fonctionne).

---

## 6. Deployer un site client (procedure pas a pas)

### 6.1 Pre-requis

- [ ] `content/clients/<slug>/client_data.yaml` complet et valide
      (`npm run validate -- --client <slug>` = code 0)
- [ ] Domaine achete et DNS configure (section 3)
- [ ] Validation Noah de la preview locale (Gate 3)
- [ ] `TODO_PRODUCTION.md` cochee (toutes les etapes)
- [ ] `security.txt` du client complete (**§12.4** : contact + canonical + expires)
- [ ] Endpoints de formulaire (si tiers actives) declares dans la CSP
      (**§12.3** : connect-src + form-action)

### 6.2 Deploiement via GitHub Actions (recommande)

1. Noah va dans GitHub -> Actions -> Deploy site client (Gate 4).
2. Noah clique sur « Run workflow ».
3. Noah saisit le slug du client (ex. `la-table-d-essai`).
4. Noah clique « Run workflow » (action Gate 4 : geste explicite).
5. Le workflow se lance (tests -> validation -> build -> deploy -> ping).
6. Verifier l'URL : `https://<slug>.pages.dev` (domaine par defaut)
   puis `https://<domaine-custom>` si domaine configure.

### 6.3 Deploiement en local (fallback)

```bash
# Depuis la racine du depot
npm run validate -- --client <slug>    # code 0 requis
npm run build:site -- --client <slug>  # -> dist/<slug>/
npx wrangler pages deploy dist/<slug> --project-name=<slug> --branch=production
# Saisir le token Cloudflare si demande
```

### 6.4 Verification post-deploy

1. Acceder a `https://<slug>.pages.dev` : la page d'accueil se charge.
2. Tester les liens critiques (contact, menu, mentions legales).
3. Tester le formulaire (si configuré) : envoyer un test.
4. Tester sur mobile (responsive).
5. Tester les liens internes (pas de 404).
6. Google Rich Results Test (optionnel) : verifier le JSON-LD.
7. **Verifier les en-tetes de securite (§12.2)** :
   `curl -sI https://<domaine>/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security-policy'`.
8. **Verifier `security.txt`** : `curl -s https://<domaine>/.well-known/security.txt`
   retourne le fichier complete (aucun placeholder `[CONTACT-EMAIL]` restant).

---

## 7. Gate 4 : deploiement humain obligatoire

Conformement au cahier des charges (sections 23/25) :

> Le deploiement en production n'est JAMAIS automatique. Noah doit
> declencher explicitement le deploiement.

Dans le workflow GitHub Actions :

- Le `workflow_dispatch` est par nature une action humaine (bouton « Run
  workflow » dans l'interface GitHub). C'est la **Gate 4**.
- Si l'environnement « production » est protege par des reviewers, Noah
  doit en plus approuver dans l'interface GitHub (notifications email).

La seule exception Acceptee : un re-deploiement d'urgence (site casse,
defacement) peut etre declenche par Noah sur un commit connu — c'est un
deploiement manuel, pas automatique.

---

## 8. Alternatives de deploiement documentees (ADR-005)

### 8.1 Netlify (reference secondaire)

- Compte gratuit suffit (300 min build/mois).
- Deploy : `npx netlify deploy --prod --dir=dist/<slug>`.
- Secret GitHub requis : `NETLIFY_AUTH_TOKEN` + `NETLIFY_SITE_ID`.
- Domaine custom : meme principe (DNS + HTTPS auto).
- Limitation : un site par deploiement (sinon deploiement avec racine
  differente — complexe en multi-clients).

### 8.2 GitHub Pages

- Depot public = depot public, ou 1 depot par client.
- Deploy : push sur branche `gh-pages` (ou branche speciale).
- Limite : pas de deploiement Wrangler-equivalent (le deploiement doit
  modifier le contenu de la branche `gh-pages`).
- HTTPS : auto pour les depots publics.
- Multi-clients : possible avec sous-dossiers (`/client-slug/`) mais
  complexe (URL non custom par client).
- **Recommande uniquement si le depot est deja public et que Cloudflare
  n'est pas disponible.**

### 8.3 Comparaison rapide

| Critere | Cloudflare Pages | Netlify | GitHub Pages |
| ------- | ---------------- | ------- | ------------ |
| Gratuit | Oui (illimite) | Oui (300 min/mois) | Oui (public) |
| HTTPS auto | Oui | Oui | Oui (public) |
| Domaine custom | Oui | Oui | Oui |
| Deploy CLI | `wrangler pages deploy` | `netlify deploy` | git push gh-pages |
| Rollback | Dashboard (1 clic) | Dashboard | Re-push commit |
| Multi-client | Un projet par slug | Un site par deploy | Sous-dossiers |
| Bande passante | Illimitee | 100 GB/mois | 100 GB/mois |

---

## 9. Identite de l'hebergeur pour les mentions legales

Conformement a LEGAL_SITE_TEMPLATES.md §1, chaque site client doit
mentionner son hebergeur dans les mentions legales.

**Pour les sites deployes sur Cloudflare Pages** (reference D-DEVOPS-02) :

```text
HEBERGEUR
  Cloudflare, Inc.
  101 Townsend Street
  San Francisco, CA 94107, USA
  Telephone : +1 (888) 993-5273
  Site web : https://www.cloudflare.com
```

**Pour les deploys sur d'autres hebergeurs** : remplacer les informations
par celles du prestataire reel. Le schema `legal.host_*` du
`client_data.yaml` permet de stocker ces informations par client (si
l'hebergeur differe de celui du systeme, ex. cas futur avec migration).

**Action Noah** : valider que Cloudflare Inc. est l'hebergeur adequat
pour les mentions legales, et ajouter cette identite dans les templates
legaux du 1er client (LEGAL_SITE_TEMPLATES.md §1). En cas de doute
juridique, consulter un professionnel (D-LG-04).

---

## 10. Rollback (procedure complete)

Le rollback consiste a redeployer le build precedent d'un site client.
Voir BACKUP_ROLLBACK.md pour la procedure detaillee.

En resume rapide :

- **Via GitHub Actions** : declencher `deploy-site.yml` avec le meme slug
  et un checkout du commit/tag precedent (modifier `ref` dans le workflow
  ou `git checkout <tag>` avant trigger).
- **Via Cloudflare Dashboard** : Pages -> Deployments -> selectionner le
  build precedent -> «Retry deployment».
- **Via Wrangler** : `npx wrangler pages deployment list --project-name=<slug>`
  puis `npx wrangler pages deployment rollback <deployment-id>`.

---

## 11. Dependances et points ouverts

- **URL GitHub** : le push initial ne peut pas etre fait par les agents.
  Noah fournit l'URL du depot GitHub apres creation.
- **Compte Cloudflare** : a creer par Noah (gratuit). L'identite de
  l'hebergeur est documentee ci-dessus.
- **Identite Noah pour les mentions legales** : le nom, SIREN/SIRET de
  Noah (editeur du site) sont des donnees personnelles qui doivent etre
  fournies par Noah (point ouvert LEGAL n°24) — pas de les inventer.
- **Service de formulaire** : a choisir avec le 1er client (point ouvert
  n°38/49). Le deploiement n'en depend pas (endpoint dans le YAML).

---

## 12. Securite HTTP et divulgation responsable (Sprint Gate 4)

Ajoute en Phase 7 — Sprint Gate 4 (FINAL_REVIEW Phase 7, conditions
C-04 / C-07 / C-08 / C-09). Justification complete de chaque en-tete et
chaque champ : `project/docs/FINAL_REVIEW.md` (section « Sprint Gate 4 —
Infrastructure securite »).

### 12.1 En-tetes de securite — fichier `_headers` (format Cloudflare Pages)

Le fichier `_headers` (format Cloudflare Pages : chemin puis directives
indentees, commentaires `#` supportes) est applique a TOUTES les reponses
statiques du site (HTTPS automatique). Il defense : clickjacking
(X-Frame-Options + frame-ancestors), MIME sniffing (nosniff), downgrade
HTTP (HSTS), fuite de Referer, activations de features navigateur non
necessaires (Permissions-Policy), et restreint les sources de contenu
(CSP).

**Ou vivent les fichiers (attention au pipeline)** :

- **Location canonique (deployee)** : `templates/<template>/public/_headers` —
  copiee par `scripts/generate-site.mjs` §9 dans `src/sites/<slug>/public/`
  puis dans `dist/<slug>/` par Astro. Chaque site client genere la recoit.
- **Miroir documentaire** : `public/_headers` a la racine. Ce pipeline (v1)
  ne copie que le favicon depuis la racine `public/` ; le miroir sert de
  reference et evite une regression silencieuse si le pipeline evolue.
  **Ne pas desynchroniser les deux copies.**

**Verification dans le build** :

```bash
npm run build:example
ls dist/exemple-restaurant/_headers          # fichier copie par Astro
grep -c 'Strict-Transport-Security' dist/exemple-restaurant/_headers
```

### 12.2 Headers appliques et commande de verification

| Header | Valeur | Effet |
| ------ | ------ | ----- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS (1 an) — Cloudflare Pages est HTTPS par defaut, le HTTP redirige deja |
| `X-Content-Type-Options` | `nosniff` | Interdit le MIME sniffing |
| `X-Frame-Options` | `DENY` | Interdit l'encapsulation iframe (clickjacking) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Referer : origine seule en cross-origin, complet en same-origin |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), fullscreen=(self), document-domain=()` | Desactive les features non utilisees ; fullscreen autorise sur le site (galerie) ; document-domain bloque |
| `Content-Security-Policy` | voir §12.3 | Restreint les sources de scripts, styles, images, polices, connexions, iframes |

**Verification post-deploy** :

```bash
curl -sI https://<domaine>/ | grep -iE 'strict-transport|x-content-type|x-frame|referrer-policy|permissions-policy|content-security-policy'
```

Les 6 en-tetes doivent etre presents et conformes au tableau ci-dessus.

### 12.3 Content-Security-Policy — directives et regle operationnelle

CSP appliquee (minimum viabilite pour un site statique Astro, zero tiers par
defaut — ADR-008) :

```text
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-src https://www.openstreetmap.org; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

| Directive | Valeur | Pourquoi (prouve par grep sur le build exemple) |
| --------- | ------ | ----------------------------------------------- |
| `default-src 'self'` | meme-origine par defaut | Aucun tiers par defaut ; toute ressource externe doit etre explicitement listee |
| `script-src 'self' 'unsafe-inline'` | bundles `/_astro/*.js` + blocs inline | `'self'` : 3 bundles (ContactForm, ReservationForm, OpeningHours). `'unsafe-inline'` : 39 blocs `<script type="module">` inline generes par Astro (lang-switcher 178 o, burger menu 1 111 o, back-to-top 253 o). Compromis v1 documente : hashs/nonces = amelioration future (cf. SECURITY_AUDIT.md §6). Le JSON-LD (`application/ld+json`) n'est pas executable : non bloque par la CSP |
| `style-src 'self' 'unsafe-inline'` | bundle CSS `/_astro/*.css` + `<style>` inline | Astro inline les styles : 2 blocs `<style>` par page (16/16 pages) + 24 attributs `style=""` dans le build |
| `img-src 'self' data:` | images du site + data URIs | Images client (hero/gallery) servies en same-origin ; data: pour icones inline eventuelles |
| `font-src 'self' data:` | polices self-hosted `/fonts/*.woff2` | ADR-010 (self-host) ; data: pour @font-face data-URI |
| `connect-src 'self'` | fetch/XHR same-origin | Defaut = formulaire mailto (navigation, pas fetch) : OK. **Des qu'un endpoint formulaire tiers est configure (Web3Forms/Formspree), ajouter son origine ici** |
| `frame-src https://www.openstreetmap.org` | iframe carte | Map OpenStreetMap (ADR-007) : 4 occurrences `embed.html` dans le build |
| `base-uri 'self'` | anti injection `<base>` | Defense en profondeur |
| `form-action 'self'` | cibles de soumission natives | **Des qu'un endpoint formulaire tiers est configure, ajouter son origine ici** (la soumission JS passe par fetch/connect-src, la soumission native sans JS par form-action) |
| `frame-ancestors 'none'` | anti clickjacking | Plus fort que X-Frame-Options ; les deux sont poses (compatibilite navigateurs) |

**Regle operationnelle (formulaire tiers)** : le jour ou un client active un
endpoint externe (ex. `https://api.web3forms.com`), Noah met a jour
`_headers` (canonique template) :

```text
connect-src 'self' https://api.web3forms.com; form-action 'self' https://api.web3forms.com
```

Puis redeploiement (Gate 4) et verification curl (le formulaire envoie bien).

### 12.4 security.txt (RFC 9116)

`/.well-known/security.txt` permet a quiconque de signaler une vulnerabilite.
Format RFC 9116, servi en `text/plain` (automatique).

| Champ | Valeur (modèle) | A remplir par Noah AVANT production reelle |
| ----- | --------------- | ------------------------------------------- |
| `Contact` | `mailto:[CONTACT-EMAIL]` | Email de contact securite du site client (jamais invente) |
| `Expires` | `2027-09-16T00:00:00.000Z` | A renouveler chaque annee (RFC 9116 : max 1 an) — voir MAINTENANCE_PLAN.md §6.2 |
| `Preferred-Languages` | `fr, en` | Ne change pas |
| `Canonical` | `[SECURITY-TXT-URL]` | URL absolue du fichier sur le domaine du client (`https://<domaine>/.well-known/security.txt`) |
| `Policy` | `tbd` | URL d'une politique de divulgation si Noah en publie une (sinon `tbd`) |

**Ou vivent les fichiers** : `templates/<template>/public/.well-known/security.txt`
(canonique, copie dans chaque build) + miroir `public/.well-known/`.
Aucun placeholder ne doit rester dans le build deploie :

```bash
grep -c 'CONTACT-EMAIL' dist/<slug>/.well-known/security.txt   # doit retourner 0
```

### 12.5 Dependabot et npm audit (CI)

- `.github/dependabot.yml` : ecosystem `npm`, directory `/`, **weekly**
  (CVE npm traitees rapidement ; avec 2 dependances + dev-deps, le volume
  de PR reste faible), `open-pull-requests-limit: 3`, reviewer Noah a
  activer (ligne commentee dans le fichier).
- CI (`ci.yml`) : etape `npm audit --audit-level=high` — **la CI echoue si
  une vulnerabilite >= high apparait** (moderees et basses tolerees,
  documentees dans FINAL_REVIEW.md). Completee par `npm run contrast`
  (WCAG 1.4.3) apres les tests.
- Alerte supplementaire : GitHub Security Advisories + Dependabot alerts
  (Settings -> Code security du depot).