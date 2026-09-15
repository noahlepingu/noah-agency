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
## Decisions Phase 2 — Frontend Engineer (2026-09-15)

Statut : **ACTEES** — decisions validees par le Tech Lead (hypotheses de
travail Phase 2, reversibles avant Gate 3/4).
Reference : ADR-002 (pipeline valider->generer->build), STACK.md, DESIGN_SYSTEM_SPECS.md,
SITEMAP_MASTER.md, UX.md (etats speciaux), CLIENT_DATA_SCHEMA.md, SEO_SYSTEM.md.
Livrables : src/ (components, layouts, utils, translations, styles), templates/restaurant/,
scripts/ (generate-site, validate-client, dev-site, preview-site, contrast-check, fetch-fonts),
content/clients/exemple-restaurant/, README.md.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-FE-01 | **Base Astro 5 multi-clients (ADR-002 confirme)** | Une seule base `src/` (components/layouts/utils) + template flagship restaurant ; chaque client est genere dans `src/sites/<slug>` (gitignore) puis build via `CLIENT` env (astro.config.mjs : srcDir/publicDir/outDir dynamiques). Dependances : astro + yaml uniquement (budget 0 EUR, D3) | — |
| D-FE-02 | **Template restaurant = 3 sources** | `template.yaml` (config : pages/translate/schema/components/third_party/branding) + `content/fr.json|en.json` (textes avec placeholders) + `pages/*.astro` avec marqueurs `$$LANG$$`, `$$THEME_CSS_PATH$$`, `$$DATA_PATH$$` remplaces par generate-site.mjs (FR a la racine, EN sous pages/en/ uniquement si `translate: true`) | — |
| D-FE-03 | **Placeholders remplis partout** | `fillObject()` applique aux texts FR/EN, aux **components** (logo_text, footer address/phone/email — bug corrige : non remplis au 1er build) et aux labels `site_pages` extraits des seo_title ; placeholder `Adresse` ajoute au mapping (en plus de `Adresse_complete`). Aucun `[Placeholder]` restant dans le HTML build (verifie) | — |
| D-FE-04 | **Liens internes i18n : pas de 404 EN** | Les pages **non traduites restent liees en FR** depuis les pages EN (Header nav, CTA header, Footer legal, plan-du-site, Hero CTAs) : `localizePath()` + `data.translated_routes` (routes `translate: true`). Le prefixe `/en` n'est applique qu'aux pages dotees d'une version EN. Pages traduites : index, a-propos, contact | — |
| D-FE-05 | **Selecteur de langue : pages traduites uniquement** | `langSwitchHref` passe par les pages traduites (sinon masque) ; persistance `ds_lang` (localStorage) ; hreflang croisees (fr/en + x-default FR) ; fallback FR systematique (detectLanguage) | — |
| D-FE-06 | **Astro 5 : children via `<slot />`** | Bug decouvert : `Astro.props.children` rend VIDE en Astro 5 — le CTA rendait des `<a>` sans libelle. Corrige dans CTA.astro (`<slot />` + support `fullWidth`). Verifie empiriquement (mini-repro build) ; aucun autre composant n'utilisait le pattern | — |
| D-FE-07 | **Etats speciaux centralises (StatePage)** | Un composant `StatePage` (types 404/500/construction/confirmation/noSlot) : titre + message + CTA + telephone. Pages 404/500 dediees (routes statiques) ; « aucun creneau » gere par ReservationForm (info + CTA « Choisir une autre date » + telephone) — conforme EDGE_CASES (D2 : pas de creneaux temps reel) | — |
| D-FE-08 | **Comment des donnees page = 0 h1 duplique** | LegalLayout ne rend plus de hero secondaire (retrait heroTitle) : les pages legales n'ont qu'un h1 (contenu), les pages internes un h1 (hero). Verifie sur les 16 pages build | — |
| D-FE-09 | **Cookies : zero traceur tiers par defaut** | Bandeau CookieBanner maison (aucune dependance) : localStorage `ds_consent`, boutons accepter/refuser/personnaliser, event `ds-consent-updated` ; Map = OpenStreetMap (iframe sans cookie) ; `third_party.analytics=false|maps=false` active le bandeau si un tiers existe (config template.yaml) | — (voir Security en Phase 4) |
| D-FE-10 | **SEO technique genere (fichiers statiques, 0 dependance)** | `robots.txt` (Allow all + Sitemap) et `sitemap.xml` generes par generate-site.mjs (14 URLs indexables, sans 404/500, EN incluses) ; JSON-LD via utils/schema.js (Restaurant, LocalBusiness, Menu, FAQPage, ContactPoint — pas d'aggregateRating : avis fictifs) ; title/description/canonical/hreflang/OG/Twitter par page via utils/seo.js ; trailing slash canonique | — |
| D-FE-11 | **Accessibilite de base appliquee** | skip-link, `main id="contenu"`, lang sur html, aria-current nav, focus-visible 3px, prefers-reduced-motion, details/summary FAQ natif, lightbox galerie `<dialog>` natif, etoiles avis rendues accessibles (role=img + aria-label « n/5 »), contraste tokens (contrast-check.mjs) | — (validation dediee Phase 4) |
| D-FE-12 | **Validation client : scripts autonomes** | `validate-client.mjs` (specs D-DB-03, codes sortie 0/2/3) ; `generate-site.mjs --build` (pipeline complet) ; `dev-site.mjs`/`preview-site.mjs` (CLIENT env) ; `contrast-check.mjs` (paires tokens) ; `fetch-fonts.mjs` (self-host optionnel — Google Fonts CDN par defaut, budget 0 EUR) | — |

### Point de coherence frontend/backend (contrat @schemas)

La validation des formulaires (ReservationForm, ContactForm) est actuellement
**cote client uniquement** (regex + contraintes simples, contrat
`{ ok, message?, errors?:[{field,message}] }` documente dans les composants).
Le partage `@schemas` (decision Architecture STACK) sera branche en Phase 2
backend (endpoints tiers configurables) — les types de champs et messages
d'erreur des composants sont concus pour consommer la reponse serveur sans
changement de contrat frontend.

### Points ouverts — arbitrage Noah / autres agents (Phase 2, Frontend)

46. **Polices self-hosted optionnelles** (PO-FE-01) : fallback actuel = Google
    Fonts CDN (preconnect + stylesheet). `npm run setup` telecharge les woff2
    dans fonts-cache/ et generate-site.mjs les copie dans public/fonts.
    A trancher au deploiement reel (performance + RGPD : aucune requete tierce
    si self-hosted).
47. **Composants non crees volontairement** (PO-FE-02) : Pricing, StickyCTA,
    DevisForm, layouts Error/Confirmation dedies — non requis par le template
    flagship restaurant (StatePage couvre les etats ; pas de page tarifs dans
    le perimetre restaurant). A creer si un template commerce/independant les
    requiert (Phase 2b multil-template).
48. **Images/hero** (PO-FE-03) : hero_image et gallery.images attendent le
    chemin d'images reelles du client (placeholders vides actuellement) ;
    optimisation astro:assets avec le performance-engineer au 1er client reel.

## Decisions Phase 2 — Backend Engineer (2026-09-15)

Statut : **ACTEES** — decisions validees par le Tech Lead (hypotheses de
travail Phase 2, reversibles avant Gate 3/4).
Reference : ADR-003 (formulaires), D-DB-03 (specs validation),
CLIENT_DATA_VALIDATION.md, CLIENT_DATA_SCHEMA.md, UX.md §4.3,
TECHNICAL_ARCHITECTURE.md §8, REGISTRE_DONNEES.md.
Livrables : scripts/validation-core.mjs, scripts/validate-client.mjs (CLI),
scripts/generate-site.mjs (pipeline valider->generer->build),
src/utils/forms.js (etendu), src/utils/reservation.js (nouveau),
composants ContactForm/ReservationForm (i18n + creneaux reels),
content/clients/exemple-restaurant/client_data.yaml (conforme),
tests/ (node:test), project/backend/FORMS_ARCHITECTURE.md.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-BE-01 | **Validation native, pas d'ajv** | Le moteur de validation (`validation-core.mjs`) est implemente **sans dependance** : les besoins (niveaux REQUIRED/SHOULD/COULD, derivations, regles croisees C-01..C-18, rapport markdown) depassent un JSON Schema ; zero dependance ajoutee (budget 0 EUR, D3). ajv reste l'alternative documentee (STACK.md) si le besoin grandit | — |
| D-BE-02 | **CLI validate-client conforme au contrat** | `npm run validate -- --client <slug>` : codes de sortie **0/1/2/3/4** conformes a CLIENT_DATA_VALIDATION.md §2.2 (le stub frontend 3=warnings est corrige) ; priorite **FORMAT (3) > REQUIRED (2)** ; SHOULD/COULD ne changent jamais le code ; rapport ecrit dans `dist/<slug>/validation-report.md` (console + fichier, meme en echec) | — |
| D-BE-03 | **Generation refuse si validation != 0** | `generate-site.mjs` execute la validation en **etape bloquante** (etape 2 du pipeline ADR-002) : un client_data.yaml avec champ bloquant ne genere pas le site ; rapport de validation cree dans `dist/<slug>/` avant refus. Donnees derivees (`deriveClientData`) appliquees (address.full, phone_intl C-18, seo.region/country, map.zoom, package defaut, EI capital) | — |
| D-BE-04 | **Partage de validation : utils plutot que package @schemas** | Le point de coherence frontend/backend (« @schemas sera branche Phase 2 ») est resolu par **modules JS partages** : `src/utils/forms.js` (regex email/tel FR/intl, validateField/Form, honeypot, buildFormEndpoint, submitForm) et `src/utils/reservation.js` (creneaux statiques purs) importes par les composants Astro ; les regex restent alignees sur FORMATS de validation-core.mjs (une seule source de verite). Le contrat de reponse serveur `{ ok, message?, errors? }` est documente dans FORMS_ARCHITECTURE.md §2 — aucun changement de contrat frontend requis | — |
| D-BE-05 | **Reservation : logique statique reelle (plus de simulateur)** | ReservationForm remplace le simulateur frontend : creneaux = `reservation.slots` filtres par les plages d'ouverture du jour, sinon generation 30 min depuis `opening_hours.schedule` ; etat « aucun creneau » dedie (UX.md §4.3 : jour ferme / periode de fermeture / no_slot / aucune source C-05) avec CTA « Choisir une autre date » + « Nous appeler » ; validation de l'heure par rapport aux creneaux calcules de la date choisie | — |
| D-BE-06 | **Formulaires : endpoints configurables + fallback mailto** | `contact.form_endpoint` / `reservation.form_endpoint` (limite au fichier client) surchargent les defauts template.json ; `buildFormEndpoint()` : endpoint tiers (POST urlencoded) sinon mailto (email du client) sinon aucun ; honeypot (website / phone_confirm) sans reCAPTCHA par defaut (ADR-003) ; correction i18n ContactForm (data-json-form) : plus de messages en dur | OUI (service de formulaire concret avec le 1er client) |
| D-BE-07 | **Tests unitaires node:test** | `npm test` : 3 fichiers (validation : codes 0/2/3/4 + C-01/C-04/C-06 + derivations + rapport ; reservation : fermetures/filtrage/generation/C-05 ; forms : validators/honeypot/endpoints). 30 tests, aucune dependance | — |

### Points ouverts — arbitrage Noah / autres agents (Phase 2, Backend)

49. **Service de formulaire concret** (PO-BE-01 = PO-DB-01) : Web3Forms (UE,
    recommande) vs Formspree (USA) — decision avec le 1er client reel
    (backend + legal + Noah).
50. **Confirmation email cote serveur** (PO-BE-03) : impossible en statique
    v1 ; a traiter via un service externe si le 1er client le demande
    (meme arbitrage que PO-BE-01).
51. **Niveau de `seo.domain`** (PO-DB-02 = PO-46) : REQUIRED au build en
    attendant la decision de niveau de content-seo (C-17).
52. **coordination content/database** : l'exemple `client_data.yaml` utilise
    `services`, `template`, `reviews.items`, `reservation.slots` conformes a
    CLIENT_DATA_SCHEMA.md (le legacy `reviews.reviews` / `time_slots` reste
    lu en compatibilite par les scripts) — a entériner par content-seo.

## Decisions Phase 3 — DevOps Engineer (2026-09-15)

Statut : **ACTEES** — decisions validees par le Tech Lead (hypotheses de
travail Phase 3, reversibles avant Gate 3/4).
Reference : ADR-002 (generation multi-clients), ADR-005 (deploiement statique,
Gate 4), ADR-009 (pas de DB), MAINTENANCE_PLAN.md (architecte, v0.1),
cahier des charges sections 17-18/23/25-27.
Livrables : project/infrastructure/ (CI_CD.md, DEPLOYMENT.md, MONITORING.md,
BACKUP_ROLLBACK.md, MAINTENANCE_PLAN.md, TODO_PRODUCTION.md),
.github/workflows/ (ci.yml, deploy-site.yml), .env.example.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-DEVOPS-01 | **CI : GitHub Actions, gratuit, sur push main + PR** | Workflow `ci.yml` : checkout -> Node 20 LTS -> `npm ci` -> `npm test` (30 tests) -> `validate:example` (code 0) -> `build:example` (16 pages) -> artefact `dist/` (7 j). **La CI ne deploie jamais** : elle garantit la sante du systeme. Depot prive recommande (2 000 min/mois gratuites, suffisant) | — |
| D-DEVOPS-02 | **CD : deploiement manuel par client (Gate 4) sur Cloudflare Pages** | Workflow `deploy-site.yml` : declenchement **uniquement manuel** (`workflow_dispatch`, saisie du slug) — le declenchement humain est la **Gate 4** (cahier des charges sections 23/25). Etapes : test -> validation client (code 0) -> `build:site` -> `wrangler pages deploy dist/<slug> --project-name=<slug>` -> ping HTTPS. Environnement « production » avec reviewer Noah = couche supplementaire optionnelle | OUI (hebergeur final) |
| D-DEVOPS-03 | **Hebergeur de reference : Cloudflare Pages** (ADR-005 applique) | Gratuit, HTTPS automatique (Let's Encrypt gere), domaine custom, rollback 1-clic (dashboard), deploiement CLI (wrangler) adapte au multi-clients (un projet Pages par slug). Identite legale : Cloudflare, Inc. — 101 Townsend Street, San Francisco, CA 94107, USA (a integrer dans les mentions legales des sites clients — LEGAL_SITE_TEMPLATES.md §1). Netlify / GitHub Pages documentes en alternatives (DEPLOYMENT.md §8). | OUI (identite hebergeur pour mentions legales) |
| D-DEVOPS-04 | **Strategie multi-clients : dossiers, pas de branches** | Un seul depot, une seule branche `main` ; chaque client vit dans `content/clients/<slug>/` (client_data.yaml + assets). Le build d'un client est isole (`dist/<slug>/`, ADR-002 — un client casse n'affecte pas les autres). Pas de branche par client (duplication historique, mises a jour communes compliquees). Deploy par workflow manuel par slug | — |
| D-DEVOPS-05 | **Monitoring : UptimeRobot (reference), zero serveur** | Statique sans serveur = pas de logs serveur ni de processus a surveiller. UptimeRobot (plan gratuit, 50 monitors, checks 5 min, alertes email) sur l'URL de chaque site client ; alternative Better Stack (5 monitors) documentee. Statut des deploiements via GitHub Actions + dashboard Cloudflare. Analytics/404 : aucun traceur par defaut (ADR-008) ; scan de liens periodique (`npx lychee`) + Google Search Console optionnelle | — |
| D-DEVOPS-06 | **Sauvegardes : le depot git EST la sauvegarde** (ADR-009 applique) | Aucune sauvegarde de `dist/` (regenerable — propriete reproductible) ni de site deploye. Sauvegarde = commits + push regulier + tags (`v0.x.y` systeme, `client-<slug>-v1` livraison) + `git bundle` trimestriel optionnel hors-ligne. `npm ci` regenere tout depuis package-lock.json | — |
| D-DEVOPS-07 | **Rollback = redeploiement d'un build precedent** (ADR-005 applique) | Reference : rollback 1-clic depuis le dashboard Cloudflare Pages (Deployments -> Retry) = restauration rapide du service. Rollback complet git (checkout d'un tag + rebuild) documente. Simplification : restaurer le service vite (rollback), corriger durablement via la procedure d'incident (validation Noah) | — |
| D-DEVOPS-08 | **Variables d'environnement minimales ; endpoints formulaire dans le YAML** | Aucun secret au build : les endpoints de formulaires (contact.form_endpoint, reservation.form_endpoint) sont des URL publiques dans client_data.yaml (ADR-003), pas des variables. Secrets reels = `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (GitHub Secrets uniquement). `.env.example` a la racine documente ; `.env` gitignore | — |
| D-DEVOPS-09 | **Maintenance operee : plan architecte applique** | MAINTENANCE_PLAN.md (infrastructure) reprend le plan de l'architecte : mises a jour mensuelles (`npm audit`), renouvellement domaine (alerte 60 j), monitoring continu, checklist mensuelle concrete (section 6), flux d'incident (Critique < 24 h / Majeur < 72 h / Mineur mensuel), rollback nocturne possible seul par Noah (1-clic) avant correction validee | — |

### Points ouverts — arbitrage Noah / autres agents (Phase 3, DevOps)

53. **URL GitHub du depot** (PO-DEVOPS-01) : le push initial est impossible
    sans remote (aucun configure). Noah cree le repo GitHub (prive
    recommande) et fournit l'URL -> `git remote add origin <url>` +
    `git push -u origin main`. Bloquant uniquement pour l'activation du
    CI/CD reelle (le travail local est complet).
54. **Compte Cloudflare + token** (PO-DEVOPS-02) : Noah cree le compte
    Cloudflare Pages (gratuit), le token API (`CLOUDFLARE_API_TOKEN`) et
    recupere `CLOUDFLARE_ACCOUNT_ID` -> secrets GitHub. Non bloquant pour
    la Phase 3 (documentation complete).
55. **Identite de l'hebergeur dans les mentions legales** (PO-DEVOPS-03) :
    Cloudflare, Inc. documente (D-DEVOPS-03) ; legal-compliance l'integre
    dans les templates (dependance legal). A confirmer lors du 1er client.
56. **Compte UptimeRobot** (PO-DEVOPS-04) : a creer par Noah (gratuit) ;
    email de notification a definir. Non bloquant.
57. **Service de formulaire concret** (PO-DEVOPS-05 = PO-BE-01/PO-DB-01) :
    Web3Forms (UE, recommande) vs Formspree (USA) — decision avec le
    1er client reel (backend + legal + Noah). Impacte le registre RGPD,
    pas le pipeline.

## Decisions Phase 4 — Security Engineer (2026-09-15)

Statut : **ACTEES** — decisions de securite basees sur la revue du code source,
npm audit, verification des flux de donnees RGPD et conformite aux ADR.
Reference : ADR-003 (formulaires), ADR-008 (cookies), ADR-009 (pas de DB),
ADR-010 (polices), D-DB-04 (registre), REGISTRE_DONNEES.md,
PRIVACY_REQUIREMENTS_TEMPLATE.md, LEGAL_SITE_TEMPLATES.md.
Livrables : project/docs/SECURITY_AUDIT.md, project/docs/VERDICT.md,
project/docs/RECOMMENDATIONS.md.

| ID | Decision | Detail | A valider par Noah ? |
| -- | -------- | ------ | --------------------- |
| D-SEC-01 | **Verdict : OK SOUS CONDITIONS** | Le deploiement reel (Gate 4) est conditionne a 6 correctifs (C-01 a C-06). La base systeme peut continuer a etre developpee/testee sans bloquer. | OUI (validateur final Gate 4) |
| D-SEC-02 | **Dependances critiques** | `npm audit` identifie astro@5.18.2 comme aggregate critique (RCE AVIF, SSRF Host, XSS define:vars). Correctif = astro >= 7.3.2 (breaking change). Le code genere (statique) n'expose pas les chemins critiques en production, mais le build est vulnerable si images AVIF malveillantes fournies. Condition C-01. | — |
| D-SEC-03 | **JSON-LD : injection XSS via set:html** | `BaseLayout.astro:83` — `JSON.stringify(schema)` n'echappe pas `<` → possible injection `</script>` dans les champs texte du YAML (description, reviews, FAQ). Meme classe que GHSA-j687-52p2-xcff. Condition C-02 : echapper `<` vers `\u003c`. | — |
| D-SEC-04 | **Google Fonts CDN sans consentement** | `BaseLayout.astro:79-81` charge inconditionnellement les polices Google (IP → Google/USA, precedent CNIL SAN-2022-004). Les polices self-hebergees existent (ADR-010, fetch-fonts.mjs) mais le CDN est encore present. Condition C-03 : retirer les liens CDN. | OUI (self-host par defaut ou consentement) |
| D-SEC-05 | **Headers HTTP non configures** | Aucun fichier `_headers` Cloudflare Pages ni documentation HSTS/CSP/X-Frame-Options. Condition C-04 : configurer via `public/_headers` (CSP, HSTS, nosniff, DENY). security.txt absent (condition C-07). | OUI (config deploiement) |
| D-SEC-06 | **Sous-traitant formulaire non declare** | Le choix Web3Forms (UE recommandee) vs Formspree (USA) conditionne les transferts hors UE. Le registre des traitements (D-DB-04) le signale comme « a determiner ». Condition C-05. | OUI (avec 1er client) |
| D-SEC-07 | **Bouton de retrait consentement absent** | Le consentement cookie (localStorage `ds_consent`) ne peut pas etre modifie apres choix. La CNIL exige un mecanisme de retrait. Le lien « Gerer les cookies » est dans les templates legaux mais pas implemente frontend. Condition C-06. | — |
| D-SEC-08 | **Registre des traitements : coherant** | `REGISTRE_DONNEES.md` est conforme au RGPD (finalites, bases legales, durees, sous-traitant). Les 4 points de vigilance pour le 1er client sont documentes dans SECURITY_AUDIT.md §14 (sous-traitant formulaire, herbergeur, polices CDN, durees conservation). | — |
| D-SEC-09 | **Formulaires : conformes, sans protection anti-spam serveur** | Honeypot (2 champs), validation client, endpoints tiers, fallback mailto. Pas de reCAPTCHA (decision ADR-003, budget 0). Spam = risque documente, depend du service tiers. Le mailto utilise encodeURIComponent → pas d'injection mailto. | OUI (service de formulaire concret) |
| D-SEC-10 | **Secrets : aucun secret expose** | Grep systematique = zero secret dans le depot. GitHub Secrets uniquement pour CLOUDFLARE_*. `.env.example` = placeholders. Historique git propre (8 commits). | — |

### Points ouverts — arbitrage Noah / autres agents (Phase 4, Security)

58. **Conditions C-01 a C-06** : a resoudre en Phase 6 (corrections) avant
    Gate 4 du 1er client reel. Les correctifs sont detailles dans
    `RECOMMENDATIONS.md`.
59. **Upgrade Astro 5 → 7** (C-01 / D-SEC-02) : breaking change majeur.
    Le frontend-engineer doit planifier la migration, corriger les
    deprecations, et valider les 30 tests + build. Estimation : 1-2 jours.
60. **Polices definitives** : si Noah choisit des polices hors Google
    (ex : System-ui uniquement), les CDN peuvent etre retires definitivement.
    Sinon, le self-host (ADR-010) est la voie par defaut.
61. **Compte Cloudflare** : la configuration `_headers` depend du compte
    Cloudflare (PO-DEVOPS-02). Le fichier `public/_headers` peut etre
    ajoute sans compte, mais les headers ne seront effectifs qu'apres
    deploiement.

## Decisions Phase 4 — Accessibility + Performance Engineer (2026-09-15)

Audit complet : `project/docs/ACCESSIBILITY_AUDIT.md`, `project/docs/PERFORMANCE_AUDIT.md`.
Perimetre : build `dist/exemple-restaurant/` (16 pages) + composants sources.
Toutes les corrections ci-dessous sont a realiser en **Phase 6 (frontend)** ;
aucune ne remet en cause l'architecture (ADR-001..008). Critere cible : WCAG 2.2 AA.

| ID | Decision | Justification | Statut |
| -- | -------- | ------------- | ------ |
| D-A11Y-01 | **Libeller distinctement les 2 landmarks nav** : desktop `aria-label="Navigation principale"` (nouvelle cle i18n `ui.header.navLabel` FR/EN) ; burger mobile `aria-label` **dynamique** openMenu/closeMenu + `aria-expanded` + `aria-controls` | Les 2 `<nav>` portent aujourd'hui `aria-label="Ouvrir le menu de navigation"` (duplique + trompeur) ; le nom accessible du burger est ecrase en `×`/`☰` apres 1 clic (innerText sur le span sr-only) — echec WCAG 1.3.1/4.1.2 | A faire (Phase 6) |
| D-A11Y-02 | **Focus trap + gestion de focus sur tous les overlays** (menu mobile, cookie banner) : utilitaire `focusTrap(el, returnFocus)` partage dans `src/utils/` ou `<dialog>` natif + `showModal()` (coherence : deja utilise dans Gallery) ; Echap = fermer + rendre le focus ; focus initial sur le 1er lien/bouton ; fermeture = retour au declencheur | Absence de piege de focus actuel : Tab sort de l'overlay (menu mobile, banner cookies) — non conforme UX.md §2.5/§4.7 et WCAG 2.1.1/2.4.3 | A faire (Phase 6) |
| D-A11Y-03 | **BackToTop** : rendre non focusable quand cache (`visibility:hidden` ou `[inert]` a la place d'`opacity:0` seul) ; le scroll `smooth` JS doit respecter `prefers-reduced-motion` (`matchMedia`) | Le bouton cache reste atteignable au Tab (focus invisible) — WCAG 2.4.3 ; smooth JS ignore le media query (2.3.3) | A faire (Phase 6) |
| D-A11Y-04 | **Formulaires** : lier chaque erreur a son champ (`aria-describedby="<id>-error"` positionne a l'etat d'erreur), focus sur le 1er champ invalide au submit, `role=status`/`aria-live` pour le resume global, le message « Envoi en cours... » et l'etat « Aucun creneau » | Erreurs posees (`aria-invalid`) mais non annoncees ; UX.md §4.4 exige le focus sur le premier champ en erreur — WCAG 3.3.1/4.1.3 | A faire (Phase 6) |
| D-A11Y-05 | **Tokens contraste** : `--color-gray-400` reserve aux elements decoratifs uniquement (texte « Ferme » -> gray-500 #6B7280) ; nouvelle paire `--color-success-dark` #047857 (5.48:1) pour le statut « Ouvert » ; `--color-warning` accompagne d'une regle d'usage + `--color-warning-dark` #92400E pour tout texte | gray-400 2.54:1 et success 3.77:1 sous 4.5:1 (texte) ; warning sur warning-light 2.86:1 (etoiles decoratives : non soumis, mais piege a venir) — WCAG 1.4.3 | A faire (Phase 6) |
| D-A11Y-06 | **Cibles tactiles** : min-height 24px (WCAG 2.5.8) a defaut, 44px mobile (D-UX-04) pour les liens footer (`ds-footer__link`) et le selecteur de langue (`ds-lang`) ; bloquer le scroll du body quand le menu mobile est ouvert | Liens 14px ~20px de haut < 24px ; contenu derriere le menu plein ecran defile — WCAG 2.5.8 / UX.md §2.5 | A faire (Phase 6) |
| D-A11Y-07 | **Controle continu** : integrer `scripts/contrast-check.mjs` a la CI (workflow `ci.yml`) et ajouter un grep de regression « pages 404/500 chargent un bundle contenant `ds-btn` » | Eviter toute regression de contraste/du BUG bundle CSS (D-PERF-02) entre phases | A faire (Phase 6/CI) |
| D-PERF-01 | **Fonts self-host obligatoires avant le 1er client reel** : utiliser `scripts/fetch-fonts.mjs` (deja livre, D-FE-07), sortir le lien render-blocking Google Fonts de `BaseLayout.astro`, aligner les graisses self-host avec le CDN (Inter 400/600/700 + Playfair 700 — retirer Inter 500 non utilise), `font-display: swap` conserve, preload des 2 fonts critiques | Google Fonts CDN = 1 requete render-blocking tierce + ~170 Ko woff2 + IP visiteurs transmise a Google (RGPD : a mentionner sinon) ; `/fonts/` declare dans fonts.css mais absent du dist (incoherence) | A faire (Phase 6) |
| D-PERF-02 | **BUG bundle CSS 404/500** : les pages 404/500 ne chargent que le bundle global (15 Ko) ; le bundle hero/boutons `CPazk4Lc.css` (4 Ko, contient `.ds-btn`) n'est pas charge -> CTA/header non styles sur ces 2 pages. Correctif : styles partages importes via BaseLayout + test de regression CI (D-A11Y-07). Priorite : avant mise en service | Constat statique (regression visuelle probable sur 404/500) — a confirmer au navigateur par QA | A faire (Phase 6) |
| D-PERF-03 | **Regles images production (PO-FE-03)** : 3 tailles (640w/1024w/1600w) en AVIF/WebP (80-90% de gain), `srcset`+`sizes`, hero seul en eager/fetchpriority/high (plafond 250 Ko), galerie lazy (plafond 120 Ko/photo), toujours `width`/`height` ; noter la dependance sharp >= 0.35 (SECURITY_AUDIT §1.1 : upgrade Astro requise) | L'exemple n'a aucune image ; le risque CWV principal (LCP/CLS) arrive avec les vraies photos client | A faire (Phase 6) |
| D-PERF-04 | **Verification deploiement (Phase 8)** : `curl -I` des headers Cloudflare Pages (br/gzip + `immutable` sur `_astro/`, `no-cache` sur HTML) + `npx lighthouse` sur l'URL publique + scan `npx lychee` (deja au programme CI) | Estimations CWV statiques (LCP < 1.5 s, INP < 100 ms, CLS < 0.02 attendus) a confirmer en production reelle | A faire (Phase 8, DevOps/QA) |

### Points ouverts — arbitrage Noah / autres agents (Phase 4, A11y/Perf)

58. **Inter 500** (PO-A11YPERF-01) : graisse chargee par le CDN mais non
    utilisee dans les styles ni declaree en self-host — a confirmer avec
    ui-art-director (design system) avant le self-host definitif.
59. **Rendus 404/500** (PO-A11YPERF-02 = QA) : confirmer visuellement au
    navigateur le BUG bundle CSS (D-PERF-02) avant correction — le constat
    statique est fort mais non rendu.
60. **Note chiffree des avis** (PO-A11YPERF-03) : les etoiles sont
    `aria-hidden` (decoratives) — si une note « 4.8/5 » est affichee en texte
    chez un client, la faire porter par un texte sr-only (a acter avec
    content-seo-legal).
61. **Mention Google Fonts** (PO-A11YPERF-04 = legal) : tant que le CDN Google
    est actif, mentionner le service tiers (adresse IP transmise) dans la
    politique de confidentialite ; le self-host (D-PERF-01) supprime ce besoin.
