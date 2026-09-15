# Audit de securite et RGPD — noah-agency

**Agent** : Security Engineer (AGENT 08)
**Date** : 2026-09-15
**Version** : 1.0
**Perimetre** : Code source complet (`src/`, `scripts/`, `.github/workflows/`),
configuration, dependances, processus RGPD, headers, secrets, deploiement.
**Methodologie** : revue statique du code, `npm audit`, verification grep
secrets, analyse des flux de donnees, confrontation aux decisions (ADR-003,
ADR-005, ADR-008, ADR-010) et aux prescriptions RGPD (CNIL).

---

## Sommaire executoire

| Severite | Nombre | Verrouille production ? |
| -------- | ------ | ----------------------- |
| Critique | 2      | **OUI — conditions bloquantes Gate 4** |
| Majeur   | 2      | OUI si formulaires tiers actives |
| Mineur   | 2      | Non — ameliorations recommandees |
| Note     | 3      | Informatif / compliance |

**Verdict** : `OK SOUS CONDITIONS` — voir `VERDICT.md`.

---

## 1. Dependances — Critique

### 1.1 npm audit : astro@5.18.2 — severite CRITIQUE

**Fichier** : `package.json` (astro `^5.0.0`, installe `5.18.2`)
**Reproductible** : `npm audit` sur le depot = aggregate criticite `critical`.

**Advisories impactantes** :

| ID | Severite | Titre | Version corrigee |
| -- | -------- | ----- | ---------------- |
| GHSA-26w7-cxv4-gfx2 | Critique | **RCE via optimisation d'image AVIF** (build) | >= 7.3.2 |
| GHSA-2pvr-wf23-7pc7 | Critique | **SSRF via header Host** dans page d'erreur pre-rendue | >= 7.3.2 |
| GHSA-j687-52p2-xcff | Moderee | **XSS via `define:vars`** (incomplet `</script>` sanitization) | >= 6.1.6 |
| GHSA-jrpj-wcv7-9fh9 | Moderee | **XSS via spread props** (`...props` dans attributs HTML) | >= 6.4.6 |
| GHSA-7pw4-f3q4-r2p2 | Moderee | XSS via noms de props non echappes dans `renderHTMLElement` | >= 7.0.6 |
| GHSA-79g7-6rrf-jcm5 | Moderee | XSS via noms de slots non echappes | >= 7.0.4 |
| GHSA-f48w-9m4c-m7f5 | Moderee | XSS via `transition:*` directives | >= 7.0.4 |
| GHSA-9fc5-rg75-6gj2 | Basse | XSS via proprietes animation View Transitions | >= 3.5.0 |
| GHSA-g7r4-m6w7-qqqr | Moderee | Lecture fichier arbitraire via dev server esbuild (Windows) | esbuild >= 0.28.1 |
| GHSA-48gk-2988-f3m7 | Haute | libvips : multiple CVE (sharp <= 0.34.x-0.35.x) | sharp >= 0.35 |

**Correctif propose** : `npm audit fix --force` → `astro@7.3.2` (breaking
change : Astro 5 → 7, migration necessaire). Le correctif minimum sans
upgrade majeure n'existe pas (le seuil critique est `<=7.2.7`).

**Impact sur la base actuelle** :

- Chemins critiques **non exposes en production** (sites statiques sans server
  islands, sans `define:vars`, sans `transition:*`, sans slots dynamiques, sans
  serveur de developpement).
- **Exposition reel** : RCE via AVIF au **build** (`astro build` genere les
  pages) — si un `client_data.yaml` contient des images AVIF malveillantes
  (dossier `gallery.images`, hero), le build peut executer du code dans
  l'environnement CI/CD ou la machine locale.
- **Equivalence de code** : le pattern `set:html={JSON.stringify(objet)}` dans
  `BaseLayout.astro` (ligne 83) est la **meme classe de vulnérabilite** que
  GHSA-j687-52p2-xcff (injection de script via pas d'echappement dans le
  contenu d'un bloc script).

**Reference** : https://github.com/withastro/security/advisories (maj 2026).

### 1.2 esbuild — dev server Windows

**Gravite** : moderee
**Correctif** : `esbuild >= 0.28.1` (inclus dans astro@7.3.2)
**Impact** : uniquement en mode `astro dev` sous Windows. Pas d'impact sur le
build ni sur les sites deployes. Le developpement local s'effectue sous Linux
(WSL) dans l'environnement actuel. A monitorer.

### 1.3 sharp / libvips — high severity

**Gravite** : haute
**CVE** : multiple (heap buffer overflow, out-of-bounds read/write dans libvips)
**Impact** : traitement d'images lors du build (`astro:assets` ou
`fetch-fonts.mjs` — le script ne telecharge que des polices, pas d'images
directement via sharp). Impact reel faible tant que la v1 n'utilise pas
`astro:assets` pour les images client (hero/images vides). A prevoir au 1er
client reel.

**Recommandation** : traitement en Phase 6 (correctifs developpeurs).
Voir `RECOMMANDATIONS.md` (REC-01).

---

## 2. Injection XSS — set:html (JSON-LD) — Critique

**Fichier** : `src/layouts/BaseLayout.astro`, ligne 83
**Code** :
```astro
<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Vulnerabilite** : `JSON.stringify()` n'echappe pas les caractères `<` ni `>`.
Si un champ texte du `client_data.yaml` (ex : `business.description`,
`reviews.text`, `faq.items[].answer`, `menu.items[].description`) contient
`</script><script>alert(1)</script>`, la balise injectee sort du bloc
`application/ld+json` et le navigateur execute le code en JavaScript sur
toutes les pages du site client.

**Mode d'attaque** : attaquant insere `</script><script>malicious()</script>`
dans un champ libre du YAML. Le YAML est genere par Noah/le systeme (pas par
un visiteur), mais la validation `CLIENT_DATA_VALIDATION.md` ne verifie pas les
caracteres speciaux (regles de longueur uniquement : REQUIRED → 1-300 pour
`business.description`).

**Exploitabilite** :
- Site vitrine statique, pas de CMS publique → l'attaque necessite un YAML
  compromis ou malicieux.
- Si un champ passe de maniere indirecte (copier-coller d'un texte contenant
  des balises HTML par un operateur non technique), l'injection est possible.
- L'equivalence technique avec GHSA-j687-52p2-xcff (define:vars + `</script>`)
  est formelle.

**Gravite** : critique (XSS stockee sur toutes les pages du site)
**Correctif** : echapper `<` vers `\u003c` avant `JSON.stringify()`, ou
utiliser une fonction `escapeHtml()` sur le schema avant injection.

Voir `RECOMMANDATIONS.md` (REC-02).

---

## 3. Google Fonts CDN — Maj. RGPD

**Fichiers** :
- `src/layouts/BaseLayout.astro`, lignes ~79-81
- `src/styles/fonts.css` (polices self-hosted en parallele)
- `scripts/fetch-fonts.mjs` (telechargement fonts-cache/)

**Constat** : `BaseLayout.astro` charge **inconditionnellement** les feuilles
de style Google Fonts (`fonts.googleapis.com` + `fonts.gstatic.com`) via
preconnect + stylesheet. L'ADR-010 specifie le self-host par defaut, et le
script `fetch-fonts.mjs` + `fonts-cache/` fournit les fichiers woff2
auto-heberges. La generation (`generate-site.mjs` ligne ~70) copie les
polices dans `public/fonts/` et declare les `@font-face` dans `fonts.css`.
Le fallback system-font de `fonts.css` est la valeur par defaut.

**Mais** : le lien CDN dans `BaseLayout.astro` est present a chaque page,
quelle que soit la presence de `fonts-cache/`. Le fallback CSS
(`system-ui, -apple-system, sans-serif`) ne remplace le CDN que si la
requete CSS externe echoue, pas si elle est retiree du HTML.

**Probleme RGPD** : chaque page transmet l'adresse IP du visiteur a Google
(USA) **sans consentement prealable**. Le precedent CNIL SAN-2022-004
(IFTTT, janvier 2022) concerne exactement cette pratique : transfert de
l'adresse IP vers Google Fonts = donnee personnelle,base legale requise
(consentement). Amende de 60 000 EUR.

**Impact** : toutes les pages du site visitent envoyent des requetes vers
Google (polices CSS) sans que le visiteur en soit informe. Le fait que les
polices soient EGALEMENT self-hosted ne resout pas le probleme : la requete
CDN est encore envoyee.

**Gravite** : majeur (RGPD, precedent CNIL, amende possible)
**Correctif** : retirer les liens CDN de `BaseLayout.astro` et reposer
uniquement sur `fonts.css` (self-hosted). Assurer que `npm run setup`
est execute au build CI (ou documenter dans TODO_PRODUCTION).

Voir `RECOMMANDATIONS.md` (REC-03).

---

## 4. StatePage.astro — set:html (phone/email) — Mineur

**Fichier** : `src/components/StatePage.astro`, ligne 45
**Code** :
```astro
<div set:html={ state.contact
  .replace('{phone}', `<a href="tel:${phone}">${phone}</a>`)
  .replace('{email}', `<a href="mailto:${email}">${email}</a>`)
} />
```

**Analyse** :
- `phone` provient de `data.contact.phone` (client_data.yaml), valide par
  la regex `PHONE_FR_RE` ou `PHONE_INTL_RE` dans `forms.js`
  (caractères autorises : chiffres, `+`, espaces, tirets, points, parentheses).
  Les guillemets ne sont pas dans l'alphabet → pas d'injection d'attribut.
- `email` valide par `EMAIL_RE` (`[^\s@]+@[^\s@]+\.[^\s@]+`) → pas
  d'espace ni de guillemet → pas d'injection d'attribut.
- Le template `state.contact` provient des traductions (`fr.json`,
  `en.json`) → contenu operateur, pas visiteur.

**Residu de risque** : aucun en l'etat. Le pattern `set:html` est cependant
un vecteur potentiel si des changements futurs modifient les sources.
Recommendation : documenter le fait que ces valeurs sont validatees
avant insertion, et preferer un composant Astro plutt que `set:html`
pour l'insertion de liens (cleanup Phase 6).

**Gravite** : mineur (defense en profondeur)
**Reference** : `RECOMMANDATIONS.md` (REC-04).

---

## 5. Map.astro — referrerpolicy — Mineur

**Fichier** : `src/components/Map.astro`, ligne 39
**Code** :
```html
<iframe ... referrerpolicy="no-referrer-when-downgrade" ... />
```

**Constat** : en HTTPS (production Cloudflare Pages), le referer complet
(domaine + chemin de la page) est transmis a OpenStreetMap. Cela revele
a un tiers l'URL exacte de la page contenant la carte.

**Correction** : `no-referrer` (aucun referer) ou
`strict-origin-when-cross-origin` (uniquement l'origine). Compte tenu
de l'ADR-008 (zero tiers par defaut, tracking sans consentement interdit),
`no-referrer` est le choix coherent.

**Gravite** : mineur (privacy by design)
**Reference** : `RECOMMANDATIONS.md` (REC-05).

---

## 6. Headers HTTP de securite — Non renseignes

**Constat** : aucun fichier `_headers` (Cloudflare Pages) ni configuration
de headers dans le code ou dans `DEPLOYMENT.md`.

**Headers recommandes pour chaque site client** :

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: <a valider avec les composants Astro>
X-Robots-Tag: <selon robots.txt>
```

**CSP** : pour un site statique Astro avec composants islands, les scripts
sont bundles en fichiers externes. Les styles inline (`<style>`) sont
necessaires (Astro les genere). CSP recommande (a valider avec build reels) :

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self' data:;
connect-src 'self';
frame-src https://www.openstreetmap.org;
form-action 'self';
base-uri 'self';
frame-ancestors 'none'
```

Note : `unsafe-inline` pour les scripts est necessaire en v1 (les scripts
d'astro islands et la petite portion inline d'hydratation). Un hash CSP
ou nonce pourra etre genere au build dans les versions ulterieures.

**security.txt** : absent. Recommandation : ajouter
`/.well-known/security.txt` avec contact Noah (email) + politique
de divulgation.

**Gravite** : majeur (si non configure → attaques clickjacking, sniffing,
MIME confusion). Peut etre resolu par le DevOps au deploiement (pas un bug
de code, une configuration infrastructure).

Voir `RECOMMANDATIONS.md` (REC-06).

---

## 7. Cookies et consentement — Conforme (avec reserves)

### 7.1 Mecanisme cookie — Verifie OK

| Critere | Statut | Reference |
| ------- | ------ | ----------- |
| Bandeau n'apparait que si tiers | OK | `CookieBanner.astro` — `third_party.length > 0` |
| 3 boutons (Accepter/Refuser/Personnaliser) | OK | `CookieBanner.astro` |
| Refus aussi facile que l'acceptation | OK | Boutons de meme taille/visibilite |
| Persistance choix | OK | `localStorage` clé `ds_consent`, 6 mois |
| Scripts tiers conditionnes par consentement | OK | `consent.js` → `isAllowed()` + inline check |
| Focus trap | PARTIEL | Escape pour fermer personnalisation, pas de tab cycling (a ameliorer) |
| Aucun cookie par defaut | OK | Aucun `document.cookie`, ADR-008 |
| Analytics sans tiers | OK | Aucun script analytics par defaut (ADR-008) |

### 7.2 Gap : pas de mecanisme de retrait du consentement

**Constat** : le consentement est stocke dans `localStorage` (`ds_consent`).
Il n'y a aucun bouton « Gerer les cookies » dans le footer (template
`LEGAL_SITE_TEMPLATES.md` le mentionne, mais le frontend ne l'implemente pas).
La CNIL exige que le consentement puisse etre retire aussi facilement
qu'il est donne, et que l'utilisateur puisse modifier son choix a tout moment.

**Gravite** : majeur si des tiers sont actives (aujourd'hui, aucun tiers →
inapplicable). A implementer avant l'ajout de tout traceur tiers.

Voir `RECOMMANDATIONS.md` (REC-07).

---

## 8. Formulaires — Conforme (design suppose)

| Critere | Statut | Detail |
| ------- | ------ | ------ |
| Validation entrees | OK | `forms.js` : email, telephone FR/intl, messages, required |
| Honeypot anti-spam | OK | `website` (ContactForm), `phone_confirm` (ReservationForm) |
| Anti-CSRF | N/A | Formulaire statique → pas de session/cookie d'auth. CSRF impossible |
| ReCAPTCHA | NON | Decision ADR-003 (budget 0, gratuit). Spam = risque documente. |
| Reponse serveur | N/A | Endpoint tiers (Web3Forms/Formspree) ou mailto. Pas de serveur. |
| Notification RGPD sur formulaire | OK | `form.privacyNote` affiche sous chaque formulaire |
| Donnees transmises | Documentees | `FORMS_ARCHITECTURE.md` §6 (sous-traitant a declarer) |

**Note** : les formulaires envoient des donnees personnelles (nom, email,
telephone, message) a un tiers (Formspree/Web3Forms) — sous-traitant au
sens RGPD. Le choix du service (Web3Forms UE recommande vs Formspree USA)
conditionne les transferts hors UE et doit etre documente au 1er client reel
(PO-DB-01, point ouvert n°49).

---

## 9. Secrets et API keys — Conforme

| Verification | Statut | Detail |
| ------------ | ------ | ------ |
| Pas de secrets en dur | OK | Grep systematique : aucun token, cle, mot de passe dans le code |
| Variables d'environnement | OK | `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` uniquement dans GitHub Secrets (deploy-site.yml) |
| `.env.example` | OK | Placeholders `xxxxx`, pas de valeurs reelles |
| `.env` absent du depot | OK | Present dans `.gitignore`, aucun fichier `.env` dans le repo |
| `.npmrc` absent | OK | Aucun token npm dans le depot |
| Historique git | OK | 8 commits, aucun secret dans l'historique |
| Endpoints formulaire | OK | URL publiques (non secrets), dans client_data.yaml (decision ADR-003) |

---

## 10. Injection — Parcours complet

| Vecteur | Statut | Detail |
| ------- | ------ | ------ |
| SQL injection | N/A | Pas de base de donnees (ADR-009) |
| Command injection | N/A | Pas d'execution de commandes serveur en production |
| XSS reflechie | OK | Pas de parametres d'URL injectes en HTML (Astro echappe les placeholders) |
| XSS stockee (JSON-LD) | **VULNERABLE** | Voir Finding 2 (critique) |
| XSS stockee (StatePage) | OK (conditionne) | Voir Finding 4 (mineur) |
| Path traversal | OK | Slug valide regex dans deploy-site.yml, astro.config.mjs, generate-site.mjs |
| Template injection | N/A | Placeholders `$$LANG$$` remplis par generate-site.mjs (pas de templates utilisateur) |

---

## 11. RGPD — Verifications transverses

### 11.1 Registre des traitements

**Fichier** : `project/database/REGISTRE_DONNEES.md`
**Statut** : EXISTE, coherant.
**Constat** :
- Formulaire contact : finalite = traitement demande, base legale = consentement
  (art. 6.1.a), duree = 3 ans, sous-traitant = service de formulaire
- Formulaire reservation : idem
- Cookie consentement : localStorage, 6 mois
- Aucun stockage serveur : conforme ADR-009
- Note : le registre signale le sous-traitant comme « A determiner avec le
  1er client » — conforme au realisme du projet (pas encore de client reel)

### 11.2 Politique de confidentialite

**Templates** : `project/content/legal/PRIVACY_REQUIREMENTS_TEMPLATE.md` (fiche
par projet) + `LEGAL_SITE_TEMPLATES.md` (page legale genrique des sites)
**Constat** : templates coherents, mentions d'information conformes (art. 13/14
RGPD), durees, droits, procedure d'exercice.
**GAP** : le contenu genere par defaut (`fr.json` confidentialite) est un
brouillon simplifie — il mentionne « aucune donnee personnelle a des fins
commerciales » sans traiter les sous-traitants tiers (Formspree/Web3Forms)
ni les polices Google (CDN). Le template a completer pour chaque client est
present (PRIVACY_REQUIREMENTS_TEMPLATE.md) — c'est un processus, pas un bug.

### 11.3 Donnees de reservation

**Donnees collectees** : nom, email, telephone, date, heure, nombre de
personnes
**Stockage** : aucun (envoi direct au service tiers, pas de BDD)
**Finalite** : traitement de la demande de reservation (art. 6.1.b : mesure
preliminaire a un contrat)
**Duree** : non conservee par le systeme (le tiers la conserve selon sa
propre politique — a documenter au 1er client)

**Signalisation PM** : les donnees de reservation constituent un traitement
au sens RGPD. Le registre est documente (D-DB-04). Le point est signale
au PM dans le cadre de la Gate 4.

---

## 12. Dependabot et suivi des dependances

**Constat** : aucune configuration Dependabot (fichier
`.github/dependabot.yml` absent). Le `npm audit` est execute en local mais
n'est pas automatise dans le CI (le workflow `ci.yml` n'inclut pas
`npm audit`).

**Impact** : pas de surveillance automatique des nouvelles CVE dans les
dependances.

**Gravite** : amelioration
**Reference** : `RECOMMENDATIONS.md` (REC-08).

---

## 13. Registre des traitements — signalisation au PM

Conformement a ma mission, je signale au PM / Tech Lead que le registre
des traitements (`REGISTRE_DONNEES.md`) identifie les elements suivants
qui necessitent une attention lors du 1er client reel :

1. Le sous-traitant formulaire (Web3Forms/Formspree) doit etre declare
   dans la politique de confidentialite du site client et dans le registre.
2. Le herbergeur (Cloudflare, Inc.) doit apparaitre dans les mentions
   legales (deja documente, D-DEVOPS-03).
3. Les polices Google Fonts CDN (si non retirees) constituent un
   sous-traitant supplementaire a declarer.
4. La duree de conservation des donnees formulaire (3 ans) est une
   estimation : le client reel peut exiger une duree differente.

---

## 14. Points positifs

L'audit releve egalement les points de securite bien mis en oeuvre :

| Domaine | Constat positif |
| ------- | --------------- |
| Architecture | Site 100% statique : aucun serveur = surface d'attaque minimale |
| Secrets | Zero secret dans le depot, GitHub Secrets pour CI/CD |
| Cookies | Zero cookie par defaut, bandeau 3 options, consentement stocke |
| Slug validation | Regex anti path-traversal sur 3 points d'entree (deploy, astro, generate) |
| Formulaires | Honeypot, validation client, pas de XSS dans les templates |
| i18n | Placeholders `$$LANG$$` sans risque d'injection |
| ADR | Decisions documentees (ADR-003/005/008/009/010) coherentes avec l'audit |
| Registre | RGPD documente des la Phase 2 (REGISTRE_DONNEES.md) |
| SocialLinks | `rel="noopener noreferrer nofollow"` sur les liens externes |
| LegalLayout | `robots="noindex, nofollow"` sur les pages legales |
| CI/CD | Tests automatiques (30 tests), validation bloquante avant build |

---

## Notes methodologiques

- Les findings sont classes par severite (critique > majeur > mineur > note).
- Un finding « critique » signifie une vulnerabilite exploitable avec impact
  direct sur la securite ou la conformite RGPD.
- Le statut de production est traite dans `VERDICT.md` separement.
- Les correctifs propres sont documentes dans `RECOMMENDATIONS.md`.
- Les constats affectant l'architecture sont signalles dans `DECISIONS.md`.
