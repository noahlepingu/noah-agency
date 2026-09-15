# Verdict de production — noah-agency

**Agent** : Security Engineer (AGENT 08)
**Date** : 2026-09-15
**Version** : 1.0
**Reference** : `SECURITY_AUDIT.md` (constats), `RECOMMENDATIONS.md` (correctifs)

---

## Statut : `OK SOUS CONDITIONS`

La base systeme noah-agency peut continuer a etre developpee, testee et
generee en environnement local/CI. **Son deploiement reel (Gate 4) sur un
site client reel est BLOQUE jusqu'a resolution des conditions listees ci-dessous.**

Le systeme ne peut pas etre considere « pret pour la production » dans son
etat actuel. Les constats critiques de `SECURITY_AUDIT.md` constituent des
**conditions bloquantes** pour toute mise en production reelle.

---

## Conditions bloquantes (Gate 4) — a resoudre AVANT le deploiement du 1er client

| # | Condition | Severite | Reference | Responsable |
| - | --------- | -------- | --------- | ----------- |
| **C-01** | **Mettre a jour Astro** vers une version sans advisory critique (>= 7.3.2 recommandee) ; execution des 30 tests + build de reference apres migration. | Critique | `SECURITY_AUDIT.md` §1 | frontend-engineer + code-reviewer |
| **C-02** | **Securiser le JSON-LD** dans `BaseLayout.astro:83` : echapper `<` vers `\u003c` dans le schema avant injection (`set:html`). | Critique | `SECURITY_AUDIT.md` §2 | frontend-engineer |
| **C-03** | **Retirer les liens Google Fonts CDN** de `BaseLayout.astro` (ou conditionner au consentement). Le site doit fonctionner en self-hosted uniquement (ADR-010). | Majeur (RGPD) | `SECURITY_AUDIT.md` §3 | frontend-engineer |
| **C-04** | **Configurer les headers de securite** chez l'hebergeur (Cloudflare Pages `_headers`) : HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP. Documenter dans `DEPLOYMENT.md`. | Majeur | `SECURITY_AUDIT.md` §6 | devops-engineer |
| **C-05** | **Choisir + documenter le sous-traitant formulaire** (Web3Forms/Formspree) et completer la politique de confidentialite reelle du 1er client (finalites, sous-traitants, transferts, droits). | Majeur (RGPD) | `SECURITY_AUDIT.md` §8, §11 | backend-engineer + legal |
| **C-06** | **Ajouter un mecanisme de retrait/modification du consentement cookie** (bouton « Gerer les cookies » dans le footer, reouverture du bandeau). | Majeur (RGPD) | `SECURITY_AUDIT.md` §7.2 | frontend-engineer |

---

## Conditions non bloquantes (recommandees avant Gate 4 mais ne bloquant pas)

| # | Condition | Severite | Reference | Responsable |
| - | --------- | -------- | --------- | ----------- |
| C-07 | Ajouter `/.well-known/security.txt` (contact + politique de divulgation) | Mineur | `SECURITY_AUDIT.md` §6 | devops-engineer |
| C-08 | Configurer Dependabot (`.github/dependabot.yml`) | Amelioration | `SECURITY_AUDIT.md` §12 | devops-engineer |
| C-09 | Ajouter `npm audit --audit-level=high` dans le workflow CI (`ci.yml`) | Amelioration | `SECURITY_AUDIT.md` §12 | devops-engineer |

---

## Justification du verdict

Le statut `OK SOUS CONDITIONS` se justifie par les elements suivants :

1. **L'architecture statique est intrinsequement securisee** : pas de serveur,
   pas de BDD, pas de session, pas de cookies propres. La surface d'attaque
   est minimale par conception.

2. **Les chemins critiques des advisories Astro ne sont pas exercises en
   production** : pas de `define:vars`, pas de `transition:*`, pas de server
   islands, pas de slots dynamiques dans le code genere. Le risque reel se
   situe au **build** (RCE via AVIF — condition C-01) et dans le pattern
   `set:html` JSON-LD (condition C-02).

3. **La conformite RGPD est structuree** : le registre des traitements existe
   (D-DB-04), la politique de confidentialite template est prete
   (PRIVACY_REQUIREMENTS_TEMPLATE.md), le bandeau cookie est conforme (3
   boutons, localStorage, refus facile). Les lacunes identifiees
   (Google Fonts CDN, absence de bouton de retrait) sont resolubles sans
   refonte.

4. **Les conditions sont toutes resolvables** : aucune n'implique de
   re-architecture majeure. L'upgrade Astro (C-01) est le plus consequent
   (1-2 jours de travail pour un developpeur frontend familier du framework).

5. **Les correctifs sont documentes** : chaque condition pointe vers une
   entree precise dans `RECOMMENDATIONS.md` avec le fichier, la ligne,
   le correctif exact et la priorite.

---

## Conditions de depassement

Le statut `OK SOUS CONDITIONS` est leve (devient `OK`) lorsque les
conditions C-01, C-02, C-03, C-04, C-05 sont verifiees et validees par le
Tech Lead / Noah. La verification peut etre faite par le security-engineer
ou le code-reviewer lors de la Phase 6 (corrections).

La condition C-06 (retrait consentement) peut etre depassee si le 1er client
n'utilise aucun traceur tiers (bandeau non affiche = pas de consentement a
gerer). Elle redevient obligatoire des que des tiers sont actives.

---

## Relation avec les Gates

| Gate | Statut actuel | Commentaire |
| ---- | ------------- | ----------- |
| Gate 1 (perimetre/prix/brief) | Validee (hypotheses) | OK |
| Gate 2 (design/structure/contenu) | Validee (hypotheses) | OK |
| Gate 3 (site/contenu/fonctionnement) | **A VENIR** | Les conditions C-01..C-06 doivent etre verifiees au plus tard ici |
| Gate 4 (deploiement final) | **BLOQUEE** | Conditions C-01..C-05 obligatoires ; aucune exception |

---

## Engagement de l'agent

En tant que Security Engineer, je m'engage a :
- relire le code apres chaque correctif (Phase 6) ;
- valider que les conditions sont effectivement resolues ;
- elever les risques residuels au Tech Lead en cas de decouverte
  ulterieure.

Ce verdict ne constitue pas un refus de livraison : la base systeme est
livree (Phase 2-3) et fonctionnelle. Il constitue un **verrou de production**
qui protege Noah et ses futurs clients.
