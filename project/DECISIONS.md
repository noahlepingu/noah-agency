# Decisions

Registre des decisions actees au fil du projet. Chaque decision importante est
documentee ici (produit, offre, design, technique, budget, legal) par
l'agent qui la porte, puis validee par le Tech Lead / PM quand requis.

## Historique

| Date | Decision | Porteur | Detail |
| ---- | -------- | ------- | ------ |
| 2026-09-15 | Initialisation du projet noah-agency | Tech Lead | Nouveau systeme de production de sites web (cahier des charges dedie). L'ancien projet restaurant (thrash/) est abandonne. Equipe de 14 agents conforme aux AGENT 01-14. |

## Decisions Phase 0 — Product Manager (2026-09-15)

Statut : **PROPOSEES** — a valider par Noah en **Gate 1** (cahier des charges
section 23 : perimetre, prix, brief, fonctionnalites).

| ID | Decision | Porteur | Detail | A valider par Noah ? |
| -- | -------- | ------- | ------ | --------------------- |
| D-PM-01 | **Perimetre v1 : base de production proprietaire** — design system + composants reutilisables + templates secteurs + SEO/forms/cookie/accessibility/analytics/deploy utilities ; chaque site client = config + contenu + design, sans developpement ad hoc | PM | REQUIREMENTS.md, SCOPE.md | OUI (perimetre final) |
| D-PM-02 | **Offre : 3 packages** — Vitrine (1 200-2 000 € ttc indicatif), Vitrine + Reservation (1 800-2 800 €), Vitrine + Reservation + E-commerce leger (2 500-4 000 €) + maintenance 40-100 €/mois ; prix fixes par package ; delai cible 2-4 semaines | PM | SCOPE.md section 4 ; fourchettes du marche lyonnais 2026 | **OUI — prix decides uniquement par Noah** |
| D-PM-03 | **CLIENT_TYPE : B2B par defaut** (professionnels acheteurs) ; cas B2C documente et detecte avant tout document commercial | PM | BUSINESS_PROCESS.md section 5 ; traite par legal-compliance | OUI (decision formelle) |
| D-PM-04 | **KPIs systeme** : les 9 KPIs de la section 30 + complementaires ; cibles indicatives v1 ; mesure des le projet pilote | PM | KPIS.md | OUI (objectifs finaux) |
| D-PM-05 | **Gates 1-4 obligatoires** sur le systeme ET sur chaque projet client ; le pipeline bloque sans gate validee | PM | ROADMAP.md, REQUIREMENTS FR-VALID | — (regle transversale) |
| D-PM-06 | **Template flagship : restaurant** en v1 (secteur reference) ; autres secteurs en SHOULD | PM | SCOPE.md section 2 | OUI (choix du 1er template) |
| D-PM-07 | **Reservation : formulaire simple en v1** ; service externe a arbitrer avec le 1er client ayant le besoin | PM | REQUIREMENTS FR-FORM-02 | OUI (selon 1er client) |
| D-PM-08 | **Multilingue : FR par defaut** ; EN basique sur pages cles = COULD, decidee avec le 1er client concerne | PM | REQUIREMENTS FR-I18N | OUI (le cas echeant) |
| D-PM-09 | **Automatisations N1-N2 documentees comme futur** (ROADMAP) ; N3-N4 hors perimetre v1 ; jamais d'automatisation des actes engageants | PM | REQUIREMENTS FR-AUTO | — |
| D-PM-10 | **Budget : gratuit / low-cost** ; tout cout payant documente dans DECISIONS avant engagement | PM | SCOPE.md section 6 | OUI (validation budget) |

## Points ouverts — arbitrage Noah (Gate 1)

1. **Perimetre v1** du systeme (D-PM-01) : base + template restaurant, ou des le
   depart 2-3 templates secteurs ?
2. **Prix des packages et de la maintenance** (D-PM-02) : niveau, prix fixes ou
   devis libre, acompte (montant/%). **Decision 100 % Noah.**
3. **CLIENT_TYPE formel** (D-PM-03) : confirmation B2B prioritaire, politique du
   cas B2C.
4. **Cibles KPI** (D-PM-04) : objectifs finaux (ou validation des cibles v1).
5. **Template flagship** (D-PM-06) : restaurant ou un autre secteur prioritaire ?
6. **Reservation** (D-PM-07) : confirmer formulaire v1 / evaluer un service externe
   des le depart.
7. **Budget systeme** (D-PM-10) : plafond de depenses accepte (hosting, domaine,
   outils) et liste des services acceptables.
8. **TVA** : confirmer le statut (franchise en base / assujetti) — traite avec
   legal-compliance ; seuils 2026 a reverifier.
9. **Delai global** : aucune contrainte par defaut ; Noah fixe les jalons.

> Rappel : les agents ne prennent aucun engagement commercial (prix/delai).
> Ces recommandations n'engagent Noah que lorsqu'il les valide explicitement.

## Decisions Phase 0 — UX Designer (2026-09-15)

Statut : **PROPOSEES** — a valider par Noah en **Gate 1/2** (cahier des charges
section 23 : design, structure, direction artistique).

| ID | Decision | Porteur | Detail | A valider par Noah ? |
| -- | -------- | ------- | ------ | --------------------- |
| D-UX-01 | **Sitemap modulaire et parametrable** — pages communes (accueil, contact, A propos, mentions legales, confidentialite, plan du site) + pages specifiques par template (restaurant: menu/reservation/vins ; artisan: realisations/devis ; commerce: catalogue/promos ; independant: prestations/RDV ; association: actions/adhesion/evenements) ; le sitemap est configure par template, pas fige | UX | SITEMAP_MASTER.md | OUI (pages specifiques) |
| D-UX-02 | **Parcours visiteur (B) comme priorite UX** — decouvrir en 3s -> explorer l'offre -> preuves sociales -> agir (CTA) ; le CTA principal est toujours visible above the fold ; confirmation immediate apres action | UX | UX.md section 1.1 | — (principe transversal) |
| D-UX-03 | **Navigation** : header sticky + logo + max 5-6 items + CTA visible ; footer 3 colonnes (coordonnees + horaires + reseaux sociaux + liens legaux) ; menu burger mobile plein ecran avec focus trap | UX | UX.md section 2 | — (principe transversal) |
| D-UX-04 | **Mobile-first systematique** — zones tactiles >= 44px ; CTA sticky bas d'ecran sur mobile ; contenus concis ; pas de scroll horizontal ; pas de carrousel obligatoire | UX | UX.md section 3 | — (principe transversal) |
| D-UX-05 | **Etats speciaux obligatoires** — 404, 500, aucun creneau disponible (reservation), erreur formulaire (par champ + globale), confirmation (envoi/reservation), cookie banner, page en construction ; chaque etat est concu dans le design system | UX | UX.md section 4 | — (principe transversal) |
| D-UX-06 | **Accessibilite WCAG 2.2 AA** — focus visible, hierarchie de titres (H1 unique, pas de saut), labels de formulaires, contraste >= 4.5:1, navigation clavier, ARIA (aria-expanded, aria-invalid, aria-live, role="alert"), skip link | UX | UX.md section 5, DESIGN_SYSTEM_SPECS.md section 8 | — (exigence transversale) |
| D-UX-07 | **Design system framework-agnostic** — tokens CSS custom properties, pas de dependance a un framework CSS impose ; les composants sont decouples de l'implementation ; configuration par fichier YAML client | UX | DESIGN_SYSTEM_SPECS.md section 1 | OUI (approche technique) |
| D-UX-08 | **Tokens fondationnels** — espacements base 4px, radii 6 niveaux, ombres 5 niveaux + focus, z-index 8 niveaux, breakpoints 5 niveaux (min-width mobile-first), grille 4/8/12 colonnes, transitions 3 niveaux | UX | DESIGN_SYSTEM_SPECS.md section 2 | — |
| D-UX-09 | **Typographies recommandees** — families Inter (par defaut, tous templates), Playfair Display (restaurant, artisan), DM Sans (commerce, independant), Libre Baskerville (association) ; echelle de tailles 10 niveilles (12-48px) ; poids et line-height standardises | UX | DESIGN_SYSTEM_SPECS.md section 3 | OUI (familles de polices) |
| D-UX-10 | **Palettes parametrables** — couleurs fondationnelles (grayscale) + fonctionnelles (success/error/warning/info) + marque (primary/secondary/accent, 3 variantes chacune) ; palettes pre-definies par template (restaurant: rouge/dore ; artisan: bleu/vert ; commerce: violet/orange ; independant: cyan/vert ; association: vert/ambre) ; validation contraste obligatoire | UX | DESIGN_SYSTEM_SPECS.md section 4 | OUI (palettes) |
| D-UX-11 | **15 composants UI catalogues** — Header, Footer, Hero, CTA, ContactForm, Gallery, Testimonials, Pricing, FAQ, Map, Menu (restaurant), OpeningHours, SocialLinks, CookieBanner, LanguageSwitcher ; chacun avec props, etats (default/hover/focus/disabled/error/loading/empty), responsive, accessibilite | UX | DESIGN_SYSTEM_SPECS.md section 5 | — |
| D-UX-12 | **Templates par secteur** — restaurant (flagship) : menu/reservation/vins/evenements ; artisan : realisations/devis/services ; commerce : catalogue/promos/marques ; independant : prestations/RDV/blog ; association : actions/adhesion/evenements/donation ; chaque template definit pages, parcours, sections, ambiance, composants specifiques | UX | TEMPLATE_VISION.md | OUI (templates et sections) |
| D-UX-13 | **Cookie banner** — uniquement si des tiers le necessitent (pas de cookies propres de navigation) ; 3 options (accepter/refuser/personnaliser) ; refus aussi facile que l'acceptation (CNIL) ; focus trap ; z-index 500 | UX | UX.md section 4.7, DESIGN_SYSTEM_SPECS.md section 5.14 | — |
| D-UX-14 | **Multilingue : selecteur dans le header** — persistance du choix (cookie necessaire) ; rechargement sur la page equivalent ; optionnel (COULD), decide avec le 1er client | UX | UX.md section 2.1, SITEMAP_MASTER.md section 4 | OUI (si active) |

## Points ouverts — arbitrage Noah (Gate 1/2) — UX

10. **Sitemap** : nombre max de pages par package ? Pages optionnelles incluses ou en surcout ?
11. **CTA sticky mobile** : systematique ou optionnel par template ?
12. **Familles de polices** : confirmer Inter + Playfair Display comme base ?
13. **Palettes** : confirmer les couleurs recommandees par template ?
14. **Map provider** : OpenStreetMap (sans cookie) ou Google Maps (cookie requis) ?
15. **Carousel** : accepte ou grille systematique (impact mobile) ?
16. **Avis clients** : integre au site ou iframe Google Reviews (cookies) ?
17. **Template(s) en v1** : restaurant seul ou restaurant + artisan ?
18. **Blog** : hors perimetre v1 ou documente comme COULD ?
19. **Icons** : quelle librairie ? (Heroicons, Lucide, Phosphor — gratuites)
20. **Animation** : transitions simples uniquement ou animations poussees ?

## Decisions a venir (Phase 0)

| Point | Attendu |
| ----- | ------- |
| Perimetre du systeme | Base de production (DS + composants + templates) |
| Offre et prix | Packages, perimetre minimal d'un site livrable |
| Client cible | B2B / B2C (a trancher formellement avant documents contractuels) |
| TVA | Franchise en base / assujetti (seuils 2026 a reverifier) |
| Budget | Gratuit / low-cost (D) |
| Delai | Aucune contrainte par defaut |
| Strategie multilingue | FR par defaut, EN basique sur les pages cles (reco) |
| Reservation | A definir (formulaire / service externe) — selon premier client |
| **Design system** | **Familles de polices, palettes, composants, templates (Gate 2)** |
| **Architecture info** | **Sitemap, navigation, parcours (Gate 2)** |