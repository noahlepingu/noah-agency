# TODOPRODUCTION.md — Checklist pre-production

Version : 0.1 (Phase 3 — Infrastructure)
Porteur : DevOps Engineer (AGENT 12)
Statut : ACTE — todo a executer avant la Gate 4 (deploiement en production)
et avant chaque livraison client.

---

## 1. Usage

- **Checklist SYSTEME** : a executer **une seule fois** avant de deployer le
  systeme lui-meme (avant la 1re utilisation en client reel).
- **Checklist CLIENT** : a executer **pour chaque projet client** avant la
  mise en production (Gate 4).
- Tout element non coche bloque la mise en production (par principe, Noah
  valide la checklist avant de declencher le deploy).

---

## 2. Checklist SYSTEME (une fois — debut d'activite)

### 2.1 Depot et CI/CD

- [ ] Depot GitHub cree (prive recommande) et remote ajoute
      (`git remote add origin <url>`)
- [ ] Premier push effectue (`git push -u origin main`)
- [ ] CI `ci.yml` verte sur `main` (tests + build exemple)
- [ ] Secrets GitHub configures :
  - [ ] `CLOUDFLARE_API_TOKEN`
  - [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] Workflow `deploy-site.yml` visible dans Actions (declencheur manuel)
- [ ] (Recommande) Protection de branche `main` : PR requise
- [ ] (Recommande) Environnement « production » avec reviewer « Noah »
- [ ] (Optionnel) Dependabot active

### 2.2 Hebergeur et domaine du systeme

- [ ] Compte Cloudflare cree (Noah) ; identite clienthebergeur recuperee :
      Cloudflare, Inc. / 101 Townsend Street / San Francisco, CA 94107, USA
- [ ] Les mentions legales **du systeme** (site de presentation de l'agence,
      si ce site est produit par le systeme) mentionnent l'hebergeur, Noah
      comme editeur, et ses donnees d'identite (SIREN/SIRET reels — point
      ouvert legal n°24)
- [ ] PRIVACY_REQUIREMENTS du systeme rempli (REGISTRE_DONNEES.md)

### 2.3 Environnement et secrets

- [ ] `.env.example` a la racine (deja fourni) — aucun secret commite
- [ ] Aucun fichier `.env` dans le depot (verif git : `git ls-files | grep .env`)
- [ ] UptimeRobot cree (1 monitor pour chaque site futur)

### 2.4 Tests finaux du systeme

- [ ] `npm ci` depuis zero fonctionne
- [ ] `npm test` : 30 tests OK
- [ ] `npm run validate:example` : code 0
- [ ] `npm run build:example` : 16 pages OK, pas de placeholder residuel
- [ ] Preview locale conforme (Gate 3)

---

## 3. Checklist CLIENT (avant chaque mise en production)

### 3.1 Donnees client (client_data.yaml)

- [ ] `content/clients/<slug>/client_data.yaml` complet
- [ ] `npm run validate -- --client <slug>` : **code 0** (aucun champ REQUIRED
      manquant, aucune erreur de format)
- [ ] Rapport `dist/<slug>/validation-report.md` relu : champs SHOULD
      examines (non bloquants)
- [ ] `seo.domain` present et valide (regle C-17 — requis au build)
- [ ] Aucune donnee inventee : tout provient du client (regle d'or)
- [ ] Le nom, l'adresse, le telephone, le SIRET du client sont reels

### 3.2 Contenu et legal

- [ ] Mentions legales generees avec :
  - [ ] Editeur : nom, forme juridique, adresse, SIREN/SIRET **reels**
  - [ ] Hebergeur : Cloudflare, Inc. (ou hebergeur reel choisi)
  - [ ] Directeur de la publication renseigne
- [ ] Politique de confidentialite complete et à jour
- [ ] PRIVACY_REQUIREMENTS.md du projet rempli (finalite, base legale,
      destinataires, duree, droits, sous-traitants)
- [ ] Bandeau cookies actif **uniquement** si des tiers sont declares
      (`third_party` non vide) ; sinon absent (zero traceur par defaut)
- [ ] Consentement cookies en place AVANT tout script tiers (si tier actif)
- [ ] Formulaire(s) : mention d'information CNIL (finalite, destinataire,
      duree, droits) affichee sous le formulaire
- [ ] Le service de formulaire est declare comme **sous-traitant** dans le
      registre RGPD du projet ; ses conditions/quotas documentes

### 3.3 Domaine, DNS, HTTPS

- [ ] Domaine achete (ex. `latabledessai.fr`), expiration >= 1 an
- [ ] DNS bascule chez Cloudflare (NS change) OU records CNAME/A crees
- [ ] Domaine ajoute dans Cloudflare Pages -> Custom Domains
- [ ] HTTPS actif et renouvelable automatiquement (verif :
      `curl -I https://<domaine>/` -> HTTP 200, certificat valide)
- [ ] UptimeRobot monitor cree pour `https://<domaine>/`

### 3.4 Deploiement (Gate 3 -> Gate 4)

- [ ] **Gate 3 NOAH** : preview locale validee (design, contenu, fonctionne)
      — et validation client si contrat (cahier des charges section 23)
- [ ] Preview : navigation complete, pas de lien casse (agent QA Phase 4 ou
      `npx lychee`)
- [ ] Test formulaire : envoi de test reussi (reception cote client/email)
- [ ] Test mobile + desktop (responsive)
- [ ] Performance : PageSpeed >= 90 sur mobile (l'objectif NFR-PERF-01)
- [ ] **GATE 4 NOAH** : deploiement declenche manuellement
      (workflow_dispatch avec le slug)
- [ ] Verification post-deploy : `https://<domaine>/` = 200, pages critiques
      OK (accueil, contact, menu, mentions legales)
- [ ] Test formulaire post-deploy (1 envoi reel)
- [ ] Search Console (Google) optionnelle : sitemap.xml soumis
- [ ] git tag cree : `client-<slug>-v1` (point de rollback)

---

## 4. Ordre recommandé d'execution

```text
[SYSTEME : 2.1 -> 2.2 -> 2.3 -> 2.4]      (une fois)
     |
     v
[CLIENT 1 : 3.1 -> 3.2 -> 3.3 -> 3.4]     (a repeter par client)
     |
     v
Gate 4 DOMANDE : deploiement
     |
     v
Post-deploy : surveillance + maintenance mensuelle (MAINTENANCE_PLAN.md)
```

---

## 5. Rappels transverses

- **Budget 0 EUR** : aucun outil payant dans cette checklist (D-PM-10).
  Tout cout (domaine, service formulaire depassant le quota) documente dans
  DECISIONS.md avant engagement.
- **Gate 4 humaine** : le deploiement n'est jamais automatique ; il est
  declenche par Noah (workflow manuel + reviewer environnement si active).
- **Aucune donnee inventee** : l'identite de Noah (SIRET, adresse) et celle
  du client sont des donnees reelles fournies par Noah — jamais fabriquees.
- **Zero traceur par defaut** (ADR-008) : analytics/cartes tierces
  uniquement si demande client + validation Noah + consentement cookies.