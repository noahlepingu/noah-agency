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

## Decisions Phase 0 — Legal / Compliance (2026-09-15)

Statut : **PROPOSEES** — a valider par Noah en **Gate 1** (conformite business,
TVA, CLIENT_TYPE, documents contractuels).

| ID | Decision | Porteur | Detail | A valider par Noah ? |
| -- | -------- | ------- | ------ | --------------------- |
| D-LG-01 | **Statut juridique recommande : EI** (Entreprise Individuelle) | Legal | Demarche via le guichet des formalites des entreprises ; code APE a determiner lors de l'immatriculation (6201Z, 6202A ou 7022A selon l'activite declaree) ; assurance RC Pro a evaluer ; compte bancaire dedie recommande des le depart | OUI (decision formelle) |
| D-LG-02 | **Configuration TVA : franchise en base recommandee** | Legal | Seuils 2026 : 37 500 EUR (franchise) / 41 250 EUR (tolerance) pour prestations de services ; jamais hardcode TVA=0% sans verification du statut reel ; mentions sur factures : « TVA non applicable, article 293 B du CGI » ; a reverifier regulierement | OUI (selon CA previsionnel reel) |
| D-LG-03 | **CLIENT_TYPE : B2B recommande** (professionnels acheteurs) | Legal | B2C possible et documente ; determination avant tout document commercial ; consequence majeure : retractation 14 jours B2C, mediation obligatoire, CGV dediees | OUI (decision formelle) |
| D-LG-04 | **Structure des documents : BROUILLONS avec placeholders** | Legal | Tous les documents (devis, contrat, CGV, facture) sont des brouillons valides par Noah ; champs placeholder visibles [SIRET], [Adresse], etc. ; verification professionnelle recommandee avant premiere utilisation commerciale | — (principe transversal) |
| D-LG-05 | **Cookies : pas de traceur non necessaire par defaut** | Legal | Le bandeau cookies n'apparait QUE si des tiers le necessitent ; 3 options (Accepter/Refuser/Personnaliser) ; refus aussi facile que l'acceptation (CNIL) ; consentement avant chargement des scripts tiers | — (principe transversal) |
| D-LG-06 | **PRIVACY_REQUIREMENTS par projet** | Legal | Fiche RGPD remplie pour CHAQUE projet client ; donnees collectees, finalite, base legale, destinataires, duree, sous-traitants, transferts hors UE, droits des personnes | — (processus transversal) |
| D-LG-07 | **Pages legales obligatoires** | Legal | Mentions legales (loi 2004-575) + politique de confidentialite (RGPD) + plan du site ; gestion cookies si traceurs tiers ; integrées dans le footer et le sitemap de chaque site | — (exigence legale) |
| D-LG-08 | **Facturation : sequence numerotation coherente** | Legal | Numerotation des factures sequentielle et ininterrompue ; mentions obligatoires selon CLIENT_TYPE ; TVA configurable (franchise ou assujetti) | — (processus transversal) |

## Points ouverts — arbitrage Noah (Gate 1) — Legal

21. **Statut juridique reel** (D-LG-01) : EI confirmee ? Autre forme ? A determiner
    avant toute immatriculation.
22. **CA previsionnel reel** (D-LG-02) : seuil TVA (franchise en base ou assujetti).
    A determiner avant choix du regime de TVA.
23. **CLIENT_TYPE formel** (D-LG-03) : B2B prioritaire confirme ? Politique du cas
    B2C (retractation, mediation).
24. **Donnees d'identite de Noah** (D-LG-04) : nom complet, adresse, SIREN/SIRET,
    email, telephone. A fournir avant production des templates contractuels.
25. **Verification professionnelle** (D-LG-04) : avocat ou expert-comptable pour
    les CGV/contrats B2C ? Fortement recommandee avant premiere utilisation.
26. **Service de mediateur** (B2C) : identite et coordonnees du mediateur de la
    consommation si activite B2C avec CA >= 5 000 EUR.
27. **Hebergeur du systeme** : identite et localisation de l'hebergeur pour les
    mentions legales des sites produits.

## Decisions Phase 0 — Content / SEO (2026-09-15)

Statut : **PROPOSEES** — a valider par Noah en **Gate 1/2** (schema donnees
client, systeme SEO, bibliotheque de contenus).

| ID | Decision | Porteur | Detail | A valider par Noah ? |
| -- | -------- | ------- | ------ | --------------------- |
| D-CS-01 | **Fichier client_data.yaml unique** — un seul fichier YAML par projet client contenant les 13 sections (business, branding, opening_hours, socials, seo, services, contact, legal, reviews, menu, reservation, template, maintenance). Format YAML pour lisibilite et commentaires. | Content/SEO | CLIENT_DATA_SCHEMA.md | OUI (format et structure) |
| D-CS-02 | **Niveaux de champs REQUIRED/SHOULD/COULD** — les champs REQUIRED bloquent la generation du site si vides. Les SHOULD generent une alerte. Les COULD sont informatifs. Detection automatique des manques avec rapport structure. | Content/SEO | CLIENT_DATA_SCHEMA.md section 3 | — (principe transversal) |
| D-CS-03 | **Donnees structurees sectorielles** — Restaurant utilise le schema `Restaurant` (avec Menu/MenuItem). Les 4 autres templates utilisent `LocalBusiness` avec extensions (Service, Person, NGO). Template JSON-LD fourni pour chaque cas. | Content/SEO | SEO_SYSTEM.md section 3 | OUI (types schema.org) |
| D-CS-04 | **SEO local integre des la conception** — chaque site embarque : données structurees, metadata optimisees, Open Graph, sitemap.xml, robots.txt, FAQPage schema, BreadcrumbList. Le SEO n'est jamais ajoute en fin de projet. | Content/SEO | SEO_SYSTEM.md | — (principe transversal) |
| D-CS-05 | **Pattern de metadata par page** — title 30-60 car. (nom + activite + ville), meta description 120-160 car. (ville + mot-cle + CTA), canonical systématique, Open Graph (og:title, og:description, og:image 1200x630). | Content/SEO | SEO_SYSTEM.md sections 4-5 | OUI (patterns) |
| D-CS-06 | **Avis reels uniquement** — pas de fabrication d'avis. Les avis sont tires du client_data.yaml (source Google/TripAdvisor/custom). AggregateRating incluse dans les donnees structurees uniquement si avis reels verifies. | Content/SEO | SEO_SYSTEM.md section 8 | — (regle transversale) |
| D-CS-07 | **Bibliotheque de contenus template** — textes reutilisables par section (hero, presentation, services, CTA, FAQ, etats speciaux) avec placeholders [Nom], [Ville], [Activite]. Templates par template secteur. Pas de contenu definitif sans validation Noah. | Content/SEO | CONTENT_LIBRARY.md | OUI (templates de texte) |
| D-CS-08 | **FAQ generique par secteur** — 5-7 questions pre-remplies par template (restaurant: reservation, horaires, parking ; artisan: devis, delais, zone ; commerce: livraison, paiement, promos ; etc.). Personnalisables. | Content/SEO | CONTENT_LIBRARY.md section 5 | OUI (questions par template) |
| D-CS-09 | **Etats speciaux avec textes** — 404, 500, aucun creneau, erreur formulaire (par champ + globale), confirmation envoi, confirmation reservation, cookie banner, page en construction. Textes coherents avec UX.md section 4. | Content/SEO | CONTENT_LIBRARY.md section 4, CONTENT_GUIDELINES.md | — (aligne sur UX) |
| D-CS-10 | **Content Guidelines** — ton par template secteur, longueur des textes par composant, regles CTA, consistance typographique, checklist de validation avant livraison (contenu, SEO, accessibilite, CTA, legal, images, performance). | Content/SEO | CONTENT_GUIDELINES.md | OUI (ton, limites, checklist) |

## Points ouverts — arbitrage Noah (Gate 1/2) — Content / SEO

28. **Format du fichier client** : YAML confirme ? Ou JSON (plus technique) ?
29. **Map provider** : OpenStreetMap (pas de cookie) ou Google Maps (cookie requis) ?
    Impact sur les donnees structurees (hasMap) et les cookies (D-LG-05).
30. **Google Analytics** : integrer GA4 par defaut (consentement requis) ou
    outil sans cookie (Plausible, Umami) ? Decision a trancher.
31. **Multilingue EN** : templates anglais en parallele ou reporte au 1er client ?
32. **FAQ dynamique** : editable par le client (CMS) ou figee dans le code ?
33. **Blog** : hors perimetre v1. Si activation future : statique (11ty/hugo)
    ou integre au template ?
34. **Images placeholder** : systeme de placeholders visuels (lorem picsum)
    ou images sectorielles reelles ?
35. **Tono de voix** : guide de style par template secteur (chaleureux/pro/
    moderne/engage) ou ton unique adapte au brief client ?
36. **Keywords research** : outil recommande pour la recherche de mots-cles
    locaux ? (Google Keyword Planner, Ubersuggest, AnswerThePublic)

## Gate 1/2 — Validation Noah (2026-09-15)

Statut : **VALIDEES « pour l'instant »** — Noah confirme les recommandations
des agents comme hypotheses de travail pour la Phase 2. Toute decision reste
reversible avant livraison (Gate 3) et avant production (Gate 4).

| ID | Decision validee | Condition |
| -- | ---------------- | --------- |
| D-PM-02 + D-PM-06 + D-PM-07 | **Offre & prix** : fourchettes PM (vitrine 1 200-2 000 €, +reservation 1 800-2 800 €, +e-commerce leger 2 500-4 000 €, maintenance 40-100 €/mois) | Prix finaux fixes par Noah avant tout devis |
| D-PM-03 + D-LG-03 | **CLIENT_TYPE : B2B prioritaire**, cas B2C documente | Confirmation finale avant documents contractuels |
| D-PM-06 + D-UX-12 | **Template v1 : restaurant** (flagship) ; artisan + autres en SHOULD | — |
| D-PM-10 + D-ARC-01..11 | **Budget 0 € et stack Astro valides comme hypotheses** de developpement | Tout cout payant documente avant engagement |

> Rappel Gate 1 du cahier des charges : la validation « pour l'instant » permet
> de demarrer le developpement ; les decisions engageantes (prix, delais,
> contrats) restent 100 % Noah jusqu'a la Gate 3.

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
| **Statut juridique** | **EI ou autre forme ? Immatriculation, code APE (D-LG-01)** |
| **CA previsionnel** | **Seuil TVA, regime fiscal (D-LG-02)** |
| **CLIENT_TYPE formel** | **B2B/B2C, politique retractation (D-LG-03)** |
| **Donnees identite Noah** | **Nom, adresse, SIREN/SIRET (D-LG-04)** |
| **Verification CGV** | **Professionnel pour premiere utilisation (D-LG-04)** |
| **Mediateur (B2C)** | **Identite, coordonnees si CA >= 5 000 EUR** |
| **Hebergeur systeme** | **Nom, localisation pour mentions legales** |
| **Fichier client** | **Format YAML/JSON, structure du client_data.yaml (D-CS-01)** |
| **Map provider** | **OpenStreetMap ou Google Maps (D-CS-03, cookies D-LG-05)** |
| **Analytics** | **GA4 / Plausible / Umami / aucun (cookies, consentement)** |

## Decisions Phase 1 — Solution Architect (2026-09-15)

Statut : **PROPOSEES** — decisions techniques a valider par Noah (Gate 1/2) ;
details dans architecture/STACK.md, TECHNICAL_ARCHITECTURE.md, ADR.md,
MAINTENANCE_PLAN.md.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-ARC-01 | **Stack : Astro en SSG statique** — sortie 100 % statique, zero JS par defaut (islands), aucun framework UI, Node LTS ; pas de DB/API/Docker/CMS (ADR-001, ADR-009) | STACK.md | OUI (approche technique) |
| D-ARC-02 | **Generation multi-clients** : base unique + template + client_data.yaml -> `validate -> generate (src/sites/<slug>) -> build -> dist/<slug> -> deploy` ; un build Astro par client ; fichier client = source unique (ADR-002) | TECHNICAL_ARCHITECTURE.md §4 | OUI |
| D-ARC-03 | **Formulaires : endpoint tiers gratuit configurable** (contact/reservation/devis POST vers service de forme, reference Formspree/Web3Forms) ; progressive enhancement ; honeypot, pas de reCAPTCHA par defaut ; fallback serverless documente ; reservation v1 = formulaire + validation statique des creneaux (ADR-003) | TECHNICAL_ARCHITECTURE.md §8 | OUI (service concret avec le 1er client) |
| D-ARC-04 | **i18n : FR racine, EN /en sur pages cles (option)** — hreflang, canonical FR, LanguageSwitcher header, persistance localStorage (pas de cookie) (ADR-004) | TECHNICAL_ARCHITECTURE.md §9 | OUI (si EN activee) |
| D-ARC-05 | **Deploiement : statique, hebergeur gratuit** — Cloudflare Pages en reference (Netlify/GitHub Pages documentes) ; Gate 4 humaine obligatoire ; rollback = redeploiement build precedent (ADR-005) | TECHNICAL_ARCHITECTURE.md §13 | OUI (hebergeur final avec devops) |
| D-ARC-06 | **Theming : tokens CSS custom properties** — tokens fondationnels fixes (tokens.css), tokens de marque generes par client (theme.css depuis branding), composants inchanges (ADR-006) | TECHNICAL_ARCHITECTURE.md §6 | — |
| D-ARC-07 | **Map : OpenStreetMap par defaut (pas de cookie)** (iframe/Leaflet + fallback coordonnees texte) ; Google Maps uniquement sur demande client explicite (consentement cookies) — arbitre les points ouverts UX n°14 / Content n°29 | ADR-007 | OUI (Google Maps le cas echeant) |
| D-ARC-08 | **Analytics : aucun par defaut** ; outil sans cookie (Plausible/Umami) uniquement si un client le demande, avec validation Noah — arbitre le point ouvert n°30 | ADR-008 | OUI (le cas echeant) |
| D-ARC-09 | **Pas de base de donnees en v1** (ADR-009) — a confirmer par AGENT 07 (database-engineer) | ADR-009 | — (validation AGENT 07) |
| D-ARC-10 | **Polices self-hosted + icones SVG inline** (zero requete tiers, zero dependance) — tranche les points ouverts UX n°12/19, support performance/RGPD | ADR-010 | OUI (familles finales Gate 2) |
| D-ARC-11 | **Plan de maintenance v1** — technique/contenu/SEO, frequence mensuelle par defaut, flux incident avec validation Noah obligatoire (FR-MAINT-04) | MAINTENANCE_PLAN.md | OUI (perimetre offre maintenance) |

## Points ouverts — arbitrage Noah / autres agents (Phase 1, Architect)

37. **Ajout `seo.domain` au client_data.yaml** : necessaire pour canonical,
    sitemap.xml et Open Graph (proposition a content-seo, D-CS-01).
    Traite en spec par l'AGENT 07 : regle C-17, REQUIRED au build tant que
    content-seo n'a pas valide son niveau (CLIENT_DATA_VALIDATION.md section 7).
38. **Service de formulaire concret** : choix du prestataire (Formspree/Web3Forms)
    avec le 1er client ; RGPD du prestataire a verifier (sous-traitant).
    Recommandation AGENT 07 : preferer Web3Forms (UE, zero transfert hors UE).
39. **Hebergeur final des sites clients** : decision devops (Cloudflare Pages
    reference, ADR-005) ; identite de l'hebergeur pour les mentions legales.
40. **Validation AGENT 07** : confirmation « pas de base de donnees » (D-ARC-09).
    **FAIT — voir D-DB-01 a 04 (Decisions Phase 2, Database Engineer).**
41. **Polices definitives** : validation Gate 2 (Inter + Playfair Display
    recommandes, implementation self-hosted).
42. **Google Maps / Analytics** : ne sont actives que si un client le demande et
    Noah le valide (D-ARC-07/08) — sinon OSM + aucun analytics par defaut.

## Decisions Phase 2 — Database Engineer (2026-09-15)

Statut : **ACTEES** — decisions validees par le Tech Lead (hypotheses de
travail Phase 2, reversibles avant Gate 3/4).
Reference : ADR-009 (D-ARC-09), CLIENT_DATA_SCHEMA.md (D-CS-01/02),
TECHNICAL_ARCHITECTURE.md, PRIVACY_REQUIREMENTS_TEMPLATE.md (D-LG-06).
Livrables : project/database/DATA_DECISION.md, CLIENT_DATA_VALIDATION.md,
REGISTRE_DONNEES.md.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-DB-01 | **Pas de base de donnees en v1 — VALIDATION FORMELLE** | La decision ADR-009 / D-ARC-09 est confirmee : aucun besoin fonctionnel ne requiert de stockage serveur (contenu statique + YAML unique + formulaires tiers + localStorage). Une DB ajouterait cout, complexite et risque sans benefice. Reversibilite preservee si besoin reel (DATA_DECISION.md section 4) | — (validation AGENT 07 demandee par D-ARC-09) |
| D-DB-02 | **Strategie de donnees : YAML source unique, sauvegardes = git** | `client_data.yaml` (content/clients/<slug>/) est l'unique source de verite ; versionne dans le depot (historique complet = sauvegarde). Aucun stockage cote systeme des donnees de formulaires (endpoint tiers uniquement) | — |
| D-DB-03 | **Validation du client_data.yaml : REQUIRED bloquent** | Specs de validation livrees (CLIENT_DATA_VALIDATION.md) : types, formats (email, phone FR, hex, time, lat/lng, siren/siret), 18 contraintes croisees (C-01 a C-18), rapport structure pour Noah (bloquants/recommandes/optionnels/regles). Codes de sortie scripts (0-4) | OUI (spec de validation) |
| D-DB-04 | **Registre des donnees (RGPD pratique)** | Registre des flux de donnees du systeme : donnees des sites (professionnelles, git), donnees de formulaires (tier, durees max. recommendees : contact 6 mois, devis 3 mois, reservation = duree du service), donnees navigateur (localStorage). Aucune table, aucune migration. Sous-traitant formulaire declare (Web3Forms recommande : UE) | — |
| D-DB-05 | **Conditions limites de reevaluation** | 5 situations imposent un nouvel ADR + validation Noah avant d'introduire une DB ou un stockage serveur : e-commerce complet, comptes utilisateurs, CMS/en ligne, reservation temps reel, newsletter > 500 contacts (cette derniere via service tiers, sans DB maison) | OUI (conditions de reevaluation) |

## Points ouverts — arbitrage Noah / autres agents (Phase 2, Database)

43. **Service de formulaire concret** (PO-DB-01) : Formspree (USA, CCT a verifier)
    vs Web3Forms (UE, preferable RGPD). Decision avec le 1er client — backend +
    legal + Noah.
44. **Durees de conservation exactes** (PO-DB-02) : les durees du registre sont
    des maxima recommendes ; a ajuster selon le service tiers choisi.
45. **`seo.domain` au schema** : REQUIRED au build en attendant la decision de
    niveau de content-seo (CLIENT_DATA_VALIDATION.md section 7).