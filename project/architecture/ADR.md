# ADR.md — Architecture Decision Records

Version : 0.1 (Phase 1 — Design & Architecture)
Porteur : Solution Architect (AGENT 04)
Format : Contexte / Decision / Consequences (court).
Statut : PROPOSE — decisions techniques a valider par Noah (Gate 1/2) et a
acter dans DECISIONS.md (D-ARC-xx) apres validation.

---

## ADR-001 — Stack : Astro en SSG statique

**Contexte** : le systeme produit des sites vitrine statiques, themables,
rapides, gratuits a heberger, sans base de donnees. Le cahier des charges
(Agent 04) impose la simplicite : pas de Next.js/API/DB par defaut.
Comparatif : Astro / Eleventy / Next.js / Vite+vanilla / Hugo (STACK.md §3).

**Decision** : Astro, mode `output: 'static'`, sans framework UI dans les
composants (HTML + CSS purs, islands JS uniquement pour les interactions).
Node.js LTS comme runtime de build. Eleventy documente comme fallback.

**Consequences** :
- (+) HTML statique, zero JS par defaut, Core Web Vitals faciles a tenir ;
  composants .astro alignes sur le catalogue UX ; i18n et sitemap integres ;
  images optimisees ; cout 0 EUR ; hebergeur interchangeable.
- (-) Build Node requis (standard) ; dependance a un SSG (versionnee, auditee).
- Sortie de secours : portage des gabarits .astro vers Nunjucks/Eleventy sans
  toucher aux CSS/JS/donnees (risque faible, documente).

## ADR-002 — Generation multi-clients : une base, un build par client

**Contexte** : plusieurs sites clients doivent etre produits depuis la meme
base sans developpement ad hoc ; chaque site = template + client_data.yaml +
design (cahier des charges section 8).

**Decision** : mecanisme
`valider -> generer (src/sites/<slug>) -> astro build -> dist/<slug> -> deploy`.
Le fichier `client_data.yaml` est la source unique ; un script materialise les
pages du template dans un dossier par client (gitignore), injecte les donnees
et le theme, puis execute un build Astro isole par client.

**Consequences** :
- (+) Multi-clients sans duplication du code partage ; isolation des builds
  (un client casse n'affecte pas les autres) ; regeneration a chaque mise a
  jour du fichier client ; pas de base de donnees.
- (-) Un build/cible = temps de build proportionnel ; necessite une commande
  `build:site` (script) — a automatiser (N1) en Phase 2.

## ADR-003 — Formulaires : endpoint tiers gratuit configurable

**Contexte** : contact + reservation + devis sur site statique ; besoin simple ;
budget zero ; RGPD (mentions CNIL, aucune donnee stockee inutilement) ;
anti-spam sans cookie tiers.

**Decision** : contrat unique POST vers un endpoint HTTPS defini dans la config
du site (`contact.form_endpoint`, `reservation.form_endpoint`). Reference v1 :
service de formulaire gratuit (Formspree / Web3Forms). Progressive enhancement
(POST natif -> page de confirmation ; fetch -> confirmation inline). Honeypot +
validation client. Pas de reCAPTCHA par defaut. Fallback documente : fonction
serverless Cloudflare Pages Functions sur le meme endpoint si quotas depasses.

**Consequences** :
- (+) Zero code serveur a maintenir ; portable sur tout hebergeur ; le service
  est un sous-traitant documente dans PRIVACY_REQUIREMENTS ; le composant ne
  change pas si le backend change.
- (-) Donnees transitant par un tiers (a declarer RGPD) ; quotas des plans
  gratuits (documentes dans MAINTENANCE_PLAN).
- Reservation v1 : validation statique des creneaux (jours fermes, fermetures,
  slots) cote client -> etat « aucun creneau » (UX.md §4.3). Reservation temps
  reel = service externe, hors v1 (D-PM-07).

## ADR-004 — Multilingue : FR racine, EN /en, hreflang, localStorage

**Contexte** : FR par defaut ; EN basique sur les pages cles = option COULD
(FR-I18N-01), decidee avec le 1er client concerne.

**Decision** : i18n Astro (locales fr/en, fr par defaut) ; pages FR a la racine ;
pages EN sous `/en/...` (pages cles uniquement) ; `src/translations/fr.json` et
`en.json` (chaines UI + etats speciaux) ; textes section traduits par defaut dans
les templates ; hreflang (fr, en, x-default -> fr) ; canonical vers la page FR ;
LanguageSwitcher dans le header, persistance **localStorage** (pas de cookie).

**Consequences** :
- (+) Pas de cookie de langue -> aucun consentement requis ; SEO hreflang
  correct ; mecanisme natif Astro.
- (-) Doublement partiel des contenus (niveau page cle seulement) ; champs EN du
  client a documenter comme COULD dans le schema (point ouvert content-seo).

## ADR-005 — Deploiement : statique, hebergeur gratuit, Gate 4

**Contexte** : deploiement reproductible, gratuit/low-cost, HTTPS, rollback,
Gate 4 humaine obligatoire (US-N-13), identite de l'hebergeur pour les mentions
legales (FR-LEGAL-05).

**Decision** : sortie statique -> n'importe quel hebergeur statique gratuit.
Reference : **Cloudflare Pages** (gratuit, HTTPS, domaine personnalise,
deploiement par git ou wrangler, rollback simple) ; alternatives documentees :
Netlify, GitHub Pages. `scripts/deploy-site.mjs` execute uniquement apres la
Gate 4 (action humaine explicite). Rollback = redeploiement d'un build precedent.

**Consequences** :
- (+) Zero cout ; hebergeur interchangeable (pas de lock-in) ; Gate 4 preserve.
- (-) L'hebergeur reel doit etre nomme dans les mentions legales et le registre
  RGPD (dependance devops/legal) ; domaines clients ~10-15 EUR/an (facture client).

## ADR-006 — Theming : tokens CSS custom properties, pilote par config

**Contexte** : design system framework-agnostic (D-UX-07) ; personnalisation par
client sans modifier les composants (US-N-03) ; palettes/fonts par template.

**Decision** : tokens fondationnels/fonctionnels fixes dans `tokens.css` ;
tokens de marque (`--color-primary|secondary|accent` + variantes, polices)
generees dans un `theme.css` par client depuis la section `branding` du
fichier YAML. Les composants ne lisent que des variables CSS.

**Consequences** :
- (+) Un seul code de composants pour tous les clients ; palettes validees en
  contraste (4.5:1) ; changement de design = regeneration du theme, pas de code.
- (-) Discipline de nommage obligatoire (pointeur `ds-` + tokens) ; les valeurs
  hex/polices invalides sont bloquees a la validation (schema).

## ADR-007 — Carte : OpenStreetMap par defaut (pas de cookie)

**Contexte** : point ouvert n°14/29 (UX/Content) : OpenStreetMap (sans cookie)
vs Google Maps (cookie requis). Impact RGPD (D-LG-05), budget, performance.

**Decision** : **OpenStreetMap** en reference — integration par iframe OSM (la
plus simple, zero dependance JS) ou Leaflet vanilla si rendu enrichi demande ;
fallback accessible coordonnees + lien « Voir sur la carte » ; `hasMap` JSON-LD
construit depuis lat/lng. **Google Maps uniquement si le client le demande
explicitement** : cookie banner + consentement, hebergement du script
conditionnel (utils/consent.js).

**Consequences** :
- (+) Zero cookie, zero cout, conforme D-LG-05 ; SEO conserve (hasMap,
  GeoCoordinates, coordonnees texte).
- (-) Rendu moins « familier » que Google Maps pour certains clients ; couverture
  tiles OSM a surveiller (usage raisonnable) ; une demande client Google Maps
  active le consentement cookies (PRIVACY_REQUIREMENTS a mettre a jour).

## ADR-008 — Analytics : aucun par defaut, cookie-less si requis

**Contexte** : point ouvert n°30 : GA4 (consentement requis) vs Plausible/Umami.
Principes : zero traceur par defaut (D-LG-05), budget zero.

**Decision** : **aucun analytics embarque par defaut** dans les sites v1. Si un
client demande une mesure d'audience : outil **sans cookie** (Plausible ou Umami,
auto-heberge ou proxy de domaine) avec validation explicite Noah ; jamais
d'outil a consentement (GA4) sans passer par le banner + PRIVACY_REQUIREMENTS.

**Consequences** :
- (+) Conforme CNIL par construction ; zero script tiers dans le site standard.
- (-) Pas de statistiques par defaut (acceptable en v1 ; la mesure du systeme se
  fait cote agence via KPIs, pas cote site client).

## ADR-009 — Pas de base de donnees en v1

**Contexte** : rien dans les besoins ne requiert de stockage serveur : contenu
statique, formulaires via endpoint tiers, reservation v1 = formulaire simple.

**Decision** : **aucune base de donnees** dans la base de production v1. Les
donnees vivent dans `client_data.yaml` (source unique) et les envois de
formulaires chez le service tiers (duree de conservation = la sienne). Si un
besoin dynamique reel apparait (reservation temps reel, comptes, catalogue
volumineux) : arbitrage explicite (service externe ou serverless, ADR-003 avant
toute base).

**Consequences** :
- (+) Simplicite maximale, cout zero, sauvegardes = git, aucun meme a operer.
- (-) Aucune donnee collectee localement : chaque donnee supplementaire a
  collecter devra etre re-arbitree (RGPD, AGENT 07/08).

## ADR-010 — Polices self-hosted et icones SVG inline

**Contexte** : performance (NFR-PERF), RGPD (aucun appel tiers), points ouverts
UX (polices n°12, icones n°19).

**Decision** : polices (Inter + Playfair Display, famille par template)
telechargees une fois et servies en woff2 depuis le site (`font-display: swap`,
preload) ; **icones SVG inline** dans les composants (aria-hidden), pas de
librairie d'icones ni d'icon font.

**Consequences** :
- (+) Zero requete tiers (RGPD + LCP) ; pas de dependance de plus ; icones
  accessibles et themables par CSS.
- (-) Choix d'icones limite au jeu defini dans la base (extensible par ajout de
  fichier SVG, pas de package).