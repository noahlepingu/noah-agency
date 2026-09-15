# Contexte du projet

Equipe multi-agents construisant de zero le **systeme de production de sites
web** pour une activite freelance de creation de sites web a Lyon. Le projet
livre est ce systeme lui-meme (et non un site client unique) : base de
production reutilisable (design system, composants, templates), couche
metier/documentaire, outils et processus industrialises.

Reference fonctionnelle : `CAHIER_DES_CHARGES_v2.md` (a lire obligatoirement
en debut de session). Le fichier reel se trouve a la racine de
`Desktop/OpenCode/` sous le nom
`Cahier des charges — Système de production de sites web multi-agents pour une
activité freelance à Lyon.md`.

## Vision

`SYSTEME = config + contenu + design + personnalisation` le plus possible,
`nouveau developpement complet` le moins possible. Chaque site client doit
etre assemble a partir de la base proprietaire : templates, composants,
utilities SEO/RGPD/forms/deploy.

## Architecture de l'equipe

Un Tech Lead / Project Orchestrator coordonne 14 agents specialises (conformes
aux AGENT 01 a 14 du cahier des charges) :

1. product-manager
2. ux-designer
3. content-seo
4. solution-architect
5. frontend-engineer
6. backend-engineer
7. database-engineer
8. security-engineer
9. legal-compliance
10. qa-engineer
11. accessibility-specialist
12. devops-engineer
13. code-reviewer
14. final-product-reviewer

Mappings avec les anciens agents restaurant (fusionnes) :
- ux-designer + ui-art-director -> ux-designer
- backend-engineer + integration-engineer -> backend-engineer
- accessibility-specialist + performance-engineer -> accessibility-specialist
- content-seo-legal (partie legal) -> legal-compliance

## Source de verite commune

Tout le travail est livre sous `/project` :

```
/project
├── README.md
├── PROJECT_STATUS.md
├── DECISIONS.md
├── product/          (PM : offres, perimetre du systeme, user stories, roadmap, business layer)
├── design/           (UX + design system master, UI specs, components)
├── content/          (bibliotheque de contenus, SEO, templates metadata, legal)
├── architecture/     (stack, ADR, plan de maintenance)
├── frontend/         (code client master : composants, layouts, templates)
├── backend/          (code serveur : forms, API, fonctions)
├── infrastructure/   (deploiement, CI/CD, monitoring)
├── tests/            (plan de tests, resultats, bugs)
└── docs/             (audits, reviews, rapports)
```

## Decisions a trancher en Phase 0

| Point                    | Recommandation par defaut                                   |
| ------------------------ | ----------------------------------------------------------- |
| Perimetre du systeme     | Base de production (DS + composants + templates) d'abord    |
| Type de clients cibles   | B2B (petits professionnels) ; B2C a documenter              |
| Budget                   | Solutions gratuites ou low-cost ; tout payant documente     |
| Delai                    | Aucune contrainte par defaut                                |
| Livrable final           | Systeme documente + premier template pret a l'emploi        |

## Regles transverses

- Un agent ne modifie pas le travail d'un autre domaine sans coordination.
- Toute decision importante est actee dans `DECISIONS.md`.
- Definition of Done : specifie, fonctionnel, teste, sans regression,
  conforme a l'architecture, documente, revu.
- Aucune donnee ni information client reelle ne doit etre inventee ;
  les champs manquants sont identifies et demandes (jamais fabriques).
- Les gateways de validation humaine (4 gates du cahier des charges) sont
  obligatoires avant engagement commercial ou deploiement reel.

## Conventions

- Modele utilise exclusivement : opencode/big-pickle.
- Commits et pushes apres chaque tache livree, au nom de l'auteur
  (yugmerabtene), messages a la premiere personne, sans mention
  de generation automatique. Jamais de secrets ni de fichier .env.