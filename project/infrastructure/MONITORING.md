# MONITORING.md — Surveillance et suivi des sites clients

Version : 0.2 (Phase 7 — Sprint Gate 4 Infrastructure securite)
Porteur : DevOps Engineer (AGENT 12)
Statut : ACTE — recommandation applicables des le 1er deploiement.
Reference : ADR-008 (aucun analytics par defaut), MAINTENANCE_PLAN.md §2/§4,
TECHNICAL_ARCHITECTURE.md §14 (dependances), DEPLOYMENT.md §12 (en-tetes
de securite, security.txt).

---

## 1. Principe

Le systeme est **statique sans serveur** (ADR-009) : il n'y a pas de logs
serveurs a consulter ni de processus a surveiller. Le monitoring se limite a :

1. **Verifier que le site est accessible** (uptime / ping HTTPS).
2. **Verifier que les deploiements reussissent** (GitHub Actions + Cloudflare).
3. **Detecter les erreurs cote visiteur** (optionnel — analytiques sans cookie).

Le monitoring est concu pour etre **gratuit** et **simple a operer**.

## 2. Uptime (disponibilite)

### 2.1 Outil recommande : UptimeRobot (reference)

**UptimeRobot** (https://uptimerobot.com/) — plan gratuit :

- 50 moniteurs inclus (un par site client + 1 pour le systeme).
- Frequence de check : 5 minutes (plan gratuit).
- Checks HTTP(S) sur l'URL de la page d'accueil.
- Alertes email en cas de panne (< 2 min).
- Badge de statut public (optionnel, pour montrer la disponibilite au client).
- Tableau de bord simple, mobile-friendly.

Configuration :

1. Creer un compte UptimeRobot (gratuit, email de Noah).
2. Ajouter un monitor par site client :
   - Type : HTTP(S)
   - URL : `https://<domaine-du-client>/`
   - Intervalle : 5 minutes
   - Contacts email : Noah
3. Optionnel : creer un monitor pour le systeme (URL du depot GitHub ou
   d'un site exemple si visible).
4. Options : alerter sur 2 echecs consecutifs (eviter les faux positifs).

### 2.2 Alternative : Better Stack (Uptime)

**Better Stack** (https://betterstack.com/) — plan gratuit :

- 5 moniteurs inclus (suffisant pour debuter).
- Frequence de check : 3 minutes.
- Dashboard plus moderne que UptimeRobot.
- Integre les logs et le monitoring application.
- Limite de 5 moniteurs en gratuit (inferieur a UptimeRobot).

**Verdict** : UptimeRobot pour le volume (50 moniteurs), Better Stack si
l'interface moderne est preferee. Les deux sont adaptes au budget 0 EUR.

### 2.3 Comparaison rapide

| Critere | UptimeRobot | Better Stack |
| ------- | ----------- | ------------ |
| Moniteurs gratuits | 50 | 5 |
| Frequence | 5 min | 3 min |
| Alertes email | Oui | Oui |
| Badge statut | Oui | Oui |
| Dashboard | Classique | Moderne |
| Logs | Non | Oui (basique) |
| API | Oui | Oui |

### 2.4 Alternatives documentees

- **Freshping** (Freshworks) : 50 checks gratuits, 1-min frequence.
- **Hetrix Tools** : 15 moniteurs gratuits, 5-min frequence.
- **Checkly** : 50 checks gratuits, role plus technique (scripts).

Recommandation : **UptimeRobot** (reference D-DEVOPS-03).

### 2.5 Verification des en-tetes de securite et security.txt (mensuel)

Les en-tetes de securite (C-04) et le security.txt (C-07) sont appliques par
Cloudflare Pages via `_headers` (cf. DEPLOYMENT.md §12) : ils ne sont **pas**
visibles en local (Astro preview ne les sert pas). Verification sur le site
deploye :

```bash
# HSTS + CSP presents (reponse du edge Cloudflare)
curl -sI https://<domaine-client>/ | grep -i 'strict-transport-security\|content-security-policy'

# security.txt accessible et non expire (RFC 9116, Expires < 1 an)
curl -s https://<domaine-client>/.well-known/security.txt | grep -i '^expires'
```

Un en-tete manquant ou une expiration proche (< 2 mois) declenche le cycle
MAINTENANCE_PLAN.md §6.2 (checklist mensuelle) — et non necessairement un
incident UptimeRobot.

## 3. Erreurs et 404

### 3.1 Principe : zero analytics par defaut (ADR-008)

Le systeme n'integre **aucun outil d'analyse par defaut**. La detection
des erreurs 404 (pages cassees, liens morts) se fait par :

1. **Audit QA** : scan periodique des liens (Phase 4 : QA Engineer, et
   Phase 5 : code reviewer). Outil recommande : `lychee` (CLI gratuit,
   open-source, scan de liens statiques — `npx lychee dist/<slug>/**/*.html`).
2. **Google Search Console** (si le client l'active) : fournit la liste
   des erreurs d'indexation, pages non trouvees.
3. **Reponse humaine** : un client qui signale un lien mort via contact.

### 3.2 Analytics optionnels (si un client le demande)

Si un client souhaite des statistiques (seulement avec la validation Noah) :

| Option | Cookie ? | Budget | Garantie RGPD |
| ------ | -------- | ------ | -------------- |
| **Plausible** (recommande) | Non | 9 EUR/mois (ou auto-heberge) | Oui (EU, pas de transfert hors UE) |
| **Umami** | Non | Gratuit (auto-heberge) | Oui (self-host) |
| **Google Analytics 4** | Oui (consentement) | Gratuit | Complexite (transfert USA, consentement CNIL) |

L'outil est ajoute via `template.yaml` (`third_party.analytics = true`) +
mise a jour `PRIVACY_REQUIREMENTS` du client + bandeau cookies active.

## 4. Performance (Core Web Vitals)

### 4.1 Controle periodique

| Qui | Quand | Outil | Cible |
| --- | --- | --- | --- |
| DevOps / Performance Engineer | Mensuel (ou apres changement) | Lighthouse CI ou `npx lighthouse <url> --output=json` | LCP < 2,5 s, CLS < 0,1, INP < 200 ms (NFR-PERF-01) |
| Noah (verification rapide) | Mensuel | PageSpeed Insights (https://pagespeed.web.dev/) | Scores Performance et Accessibilite >= 90 |
| Cloudflare (passif) | Continu | Cloudflare Pages dashboard -> Analytics | Bande passante, requetes, erreurs 5xx |

### 4.2 Alarmes de regression

Aucune alarme automatique de performance (budget 0, pas de serveur).
La verification est humaine (mensuelle). Si LCP ou CLS se deteriore :
- chercher les images non optimisees (assets du client > 500 Ko) ;
- chercher les polices non preloaded ;
- reverifier les composants avec JS (islands).

## 5. Statut des deploiements

### 5.1 Dashboard GitHub Actions

Dans le depot GitHub -> Actions :

- Historique de tous les deploiements (CI et deploy).
- Statut de chaque build (succes/echec, logs).
- Conserves 90 jours (gratuit, GitHub).
- Aucun configure pour alerte email par defaut (possible dans GitHub).

### 5.2 Cloudflare Pages

Dans le dashboard Cloudflare -> Pages -> [projet] :

- Historique des deploys (date, commit, statut).
- Optionnel : webhook Slack/Discord (pour les notifications de deploy).

## 6. Alerte en cas d'incident

### 6.1 Canaux d'alerte

| Canal | Declencheur | Destinataire |
| ----- | ----------- | ------------ |
| **Email UptimeRobot** | Site indisponible (ping echoue) | Noah |
| **GitHub Actions** | Echec du workflow deploy (rouge) | Noah (notification GitHub) |
| **Email Cloudflare** | Atteinte de quota (rare) | Noah |
| **Contact client** | Le client signale un probleme | Noah (support) |

### 6.2 Niveaux de gravite (cohrent MAINTENANCE_PLAN.md §6)

| Niveau | Definition | Delai d'intervention |
| ------ | ---------- | --------------------- |
| Critique | Site indisponible, defacement, fuite donnees | < 24 h ouvrées |
| Majeur | Page cassee, formulaire en panne | < 72 h |
| Mineur | Lien mort, texte, performance | Cycle mensuel |

## 7. Quoi NE PAS monitorer (et pourquoi)

| Element | Pourquoi pas |
| ------- | ------------ |
| Logs serveur | Pas de serveur (statique) |
| Espace disque | Pas de stockage cote agence |
| RAM / CPU serveur | Pas de serveur |
| Connexions DB | Pas de base de donnees (ADR-009) |
| Taux de conversion | Hors perimetre technique (cote business/KPIs) |
| Comportement utilisateur | Aucun analytics par defaut (ADR-008) |

## 8. Qui fait quoi — frequence de verification

| Tache | Qui | Frequence | Comment |
| ----- | --- | --------- | ------- |
| Verifier UptimeRobot | Noah | A la reception d'alerte email | UptimeRobot envoie un email automatique ; Noah verifie et suit la procedure d'incident (MAINTENANCE_PLAN.md §6) |
| Consulter les deploiements GitHub | Noah | Mensuel ou apres incident | GitHub -> Actions -> historique |
| Audit de performance (Lighthouse) | Noah ou agent QA/performance | Mensuel | PageSpeed Insights ou `npx lighthouse` |
| Audit des liens (404) | Agent QA | Mensuel | `npx lychee dist/<slug>/**/*.html` |
| En-tetes de securite (HSTS/CSP/nosniff) | DevOps | Mensuel | `curl -sI https://<domaine> ...` (MONITORING.md §2.5) |
| Expiration security.txt | Noah | Mensuel | `curl -s .../.well-known/security.txt \| grep ^expires` (RFC 9116) |
| Revue mensuelle globale | Noah | Mensuel | Checklist MAINTENANCE_PLAN.md (section 11) |

## 9. Dependances et points ouverts

- **Compte UptimeRobot** : a creer par Noah (gratuit). Identifie l'adresse
  email de notification (a documenter dans le registre RGPD si applicable).
- **Service de formulaire** : les logs d'envoi sont chez le prestataire
  (Formspree/Web3Forms) — a consulter depuis le dashboard du prestataire
  si besoin (pas cote agence).
- **Google Search Console** : a configurer par Noah pour chaque domaine
  client (recommande, mais optionnel — pas de serveur gere).
- **Donnees de monitoring** : aucune donnee personnelle n'est stockee dans
  UptimeRobot (seules des URLs sont enregistrees).