# noah-agency — Systeme de production de sites web multi-agents

Systeme de production de sites web professionnels pour une activite freelance
de creation de sites web a Lyon. Reference fonctionnelle :
`Cahier des charges — Système de production de sites web multi-agents pour une
activité freelance à Lyon.md` (a la racine du dossier OpenCode).

## Source de verite commune

```text
/project                      (= project/ dans le depot git)
├── README.md                 <- ce fichier
├── PROJECT_STATUS.md         <- etat d'avancement, phase en cours, prochaine etape
├── DECISIONS.md              <- decisions actees (offre, design, technique, budget, legal)
├── product/                  <- PM : offre, business process, user stories, roadmap, KPIs
├── design/                   <- UX + UI : design system master, wireframes, templates
├── content/                  <- contenu, SEO, metadata, legal (brouillons)
├── architecture/             <- stack, ADR, maintenance, strategie templates
├── frontend/                 <- code client master (composants, layouts, templates)
├── backend/                  <- code serveur / API / functions / schemas
├── infrastructure/           <- deploiement, CI/CD, monitoring
├── tests/                    <- plan de tests, resultats, bugs
└── docs/                     <- audits, reviews, rapports
```

## Mode de fonctionnement

- Chaque agent lit les decisions existantes avant de travailler.
- Chaque agent produit son livrable dans son dossier et documente ses
  decisions importantes dans `DECISIONS.md`.
- Chaque agent signale ses dependances et problemes bloquants dans
  `PROJECT_STATUS.md` (via le Tech Lead).
- Personne ne modifie le travail d'un autre domaine sans coordination.
- Aucune donnee client reelle n'est inventee : les champs manquants sont
  identifies et demandes.
- Les gates de validation humaine (brief, design, livraison, production) sont
  obligatoires avant engagement commercial ou deploiement reel.
- Definition of Done : specifie, fonctionnel, teste, sans regression,
  conforme a l'architecture, documente, revu.

## Acces au dossier

> Note : les agents disposent du chemin reel
> `/mnt/c/Users/Noahu/Desktop/OpenCode/noah-agency/project/...`
> (le chemin `/project` n'etant pas accessible en ecriture dans cet environnement).