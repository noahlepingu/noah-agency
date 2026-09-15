# SCOPE.md — Perimetre du systeme de production (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Statut : PROPOSE — perimetre v1 a valider par Noah (Gate 1).

---

## 1. Positionnement

Le systeme est une **petite agence web virtuelle** (cahier des charges section 2) :
Noah garde le business (prospection, vente, relation, validation, responsabilite) ;
les 14 agents produisent. Le livrable final du projet v1 est un **systeme de
production documente + base de production exploitable (design system, composants,
templates) + premier template pret a l'emploi** (CONTEXT.md).

## 2. Perimetre IN (v1)

### Base de production
- Design system master (couleurs, typographies, grille, tons, etats).
- Bibliotheque de composants (Header, Footer, Hero, CTA, ContactForm, Gallery,
  Testimonials, Pricing, FAQ, Map, Menu, OpeningHours, SocialLinks, CookieBanner).
- Layouts types responsive (accueil, contenu, contact, legale, liste, fiche).
- Template secteur complet : **restaurant** (reference) ; autres secteurs
  (artisan, commerce, independant, association) en SHOULD dans la phase dev.

### Systeme d'assemblage
- Fichier de donnees client structure (cahier des charges section 11) avec
  validation des champs manquants (jamais inventes).
- Generation d'un site = config + contenu + design, sans developpement ad hoc.

### Couche commerciale
- Pipeline commercial complet documente (BUSINESS_PROCESS.md).
- Generation de **brouillons** (devis, proposition, contrat, CGV, facture, brief,
  fiches prospect) — validation Noah obligatoire avant envoi.
- CLIENT_TYPE (B2B/B2C) demande avant tout document commercial.
- TVA configurable (franchise en base / assujetti), jamais hardcodee.

### Couche legal / RGPD
- PRIVACY_REQUIREMENTS.md par projet client.
- Pages legales generiques a completer (mentions, politique de confidentialite).
- Cookie system sans traceurs non necessaires par defaut.
- Inventaire des prestataires (hebergement, forms, analytics, reservation...).
- Cadres contractuels B2B / B2C (templates — traites par legal-compliance).

### Couche SEO local (fonctionnalite produit)
- Donnees structurees par secteur (LocalBusiness/Restaurant...), metadata,
  Open Graph, map, FAQ, ancrage geographique Lyon.
- Contenus SEO valides par Noah avant publication.

### Couche maintenance
- MAINTENANCE_PLAN par projet (technique + contenu + SEO).
- Flux de maintenance documente (monitoring -> ticket -> correction -> tests ->
  validation -> deploy), aucune correction auto en production.

### Qualite et deploiement
- Test, accessibilite (WCAG 2.2 AA), performance (Core Web Vitals), securite.
- Deploiement reproductible et documente, gates 1-4 obligatoires.

### Documentation
- Toutes les decision actees dans DECISIONS.md ; DoD applique.

## 3. Perimetre OUT (hors v1)

- **E-commerce complet** (catalogue, panier, paiement, commandes) : hors perimetre.
  Un « e-commerce leger » (ex. bons cadeaux via solution externe) reste a arbitrer
  (COULD, jamais un developpement sur mesure en v1).
- **CMS libre-service** : les clients ne gerent pas eux-memes leur contenu au
  depart ; la maintenance contenu est assuree par l'agence. Un acces contenu
  simple pourra etre etudie plus tard.
- **Reservation en ligne temps reel avec paiement** : v1 = formulaire simple ;
  l'integration d'un service externe (ex. booking) est a arbitrer avec le premier
  client qui en a besoin.
- **Multilingue complet** : FR par defaut ; une version EN basique sur les pages
  cles est COULD (decision avec le premier client concerne).
- **Paiement en ligne des factures** : la facturation suit le process Noah ;
  le virement reste le canal par defaut.
- **Newsletter / automation email** : futur (COULD).
- **CRM complet type SaaS** : le pipeline simple (fiches clients, etapes) suffit.
- **Automatisations Niveaux 3-4** (cahier des charges section 24) : projet auto
  depuis formulaire, deploy auto, monitoring auto, tickets auto, rapports auto.
- **Application mobile / PWA avancee** : non.
- **Notifications/chatbot IA** : non.

## 4. Offre recommandee (a valider par Noah — Gate 1)

Fourchettes indicatives du marche lyonnais 2026 (sources publiees : freenlances
900-5 000 €, agences 1 500-8 000 €, maintenance 50-200 €/mois). **Prix decises
uniquement par Noah** — ceci est une recommandation de positionnement.

| Package | Contenu propose | Fourchette indicative | Positionnement |
| ------- | --------------- | ---------------------- | -------------- |
| Vitrine | 5-7 pages, template secteur, SEO local, formulaire de contact, pages legales, 1 an de maintenance contenu/technique | 1 200 - 2 000 € | freelance senior / agence bas de gamme |
| Vitrine + Reservation | + formulaire de reservation (ou service externe simple), horaires, map avancee | 1 800 - 2 800 € | intermediaire |
| Vitrine + Reservation + E-commerce leger | + module ventes simples via solution existante (bons cadeaux, produits), jamais de dev sur mesure | 2 500 - 4 000 € | sous le marche e-commerce (4 000-20 000 €) |
| Maintenance mensuelle (option ou incluse an 1) | MAINTENANCE_PLAN : mises a jour, contenu, SEO, support | 40 - 100 €/mois | sous le marche agence |

Delai de production cible (pour information, non engageant) : **2-4 semaines**
par site standard (marche freelance : 2-6 semaines).
Positionnement de Noah : **qualite d'agence, prix freelance, delai court
(production assistee par l'IA)**. Prix fixes par package pour simplifier la
decision client (transparence = argument commercial).

## 5. Hypotheses

1. Noah gere seul le commercial et la relation client ; les agents preparent mais
   n'engagent jamais (sections 3-5, 25 du cahier des charges).
2. La cible principale est **B2B** : des professionnels qui achentent un site pour
   leur entreprise. Le cas **B2C** (particulier acheteur) est possible et detecte
   avant tout document.
3. Les sites produits sont des **vitrines + contact (+ reservation)** : pas de
   compte utilisateur, pas de donnees sensibles, peu de donnees personnelles.
4. La maintenance est assuree par l'agence (offre recurrente), pas par le client.
5. Premier client pilote : **un restaurant lyonnais** (le template reference).
6. Budget systeme : solutions gratuites ou low-cost ; tout payant documente avant
   engagement (D).
7. Aucune donnee client reelle n'existe encore : tout sera identifie comme manque
   et demande (jamais invente).
8. Les templates contractuels B2B/B2C sont valides par legal-compliance et
   verifies par un professionnel avant premiere utilisation commerciale.

## 6. Contraintes

- **Budget** : gratuit/low-cost ; couts payants documentes dans DECISIONS.md.
- **Delai** : aucune contrainte imposee ; cible indicative 2-4 semaines/site en aval.
- **Reglementaire** : RGPD/CNIL des la conception ; identification responsable +
  hebergeur obligatoire ; TVA configuree (jamais hardcodee) ; CLIENT_TYPE demande
  avant tout document.
- **Data integrity** : aucune donnee commerciale, juridique ou client inventee ;
  les champs manquants sont identifies et demandes (tolerance zero).
- **Independance** : le systeme doit rester reutilisable pour le prochain secteur
  sans refactorisation lourde (section 8).

## 7. Risques et mitigations

| Risque | Impact | Mitigation |
| ------ | ------ | ---------- |
| Perimetre trop large pour v1 | delai glissant, systeme inacheve | phases 0-9 + gates ; v1 = base + template restaurant ; le reste documente |
| Template restaurant peu representatif des autres secteurs | reusabilite faible | valider un 2e secteur tot (artisan ou commerce) ; composants independants du secteur |
| Couche business/documentaire sous-estimee (devis, contrats, RGPD) | systeme technique ok mais inutilisable commercialement | traiter legal/contrats des la Phase 0-1, pas a la fin |
| Services gratuits devenant payants (maps, forms, hosting) | couts recurrents imprevus | inventaire prestataires (section 18) ; alternatives documentees ; tarifs figes dans le MAINTENANCE_PLAN |
| Integrations tierces = cookies/consentement | non-conformite RGPD | cookie system par defaut sans traceurs ; chaque tiers evalue avant ajout |
| Confusion B2B/B2C dans les documents | contestation, retractation mal traitee | CLIENT_TYPE bloque ; templates legaux distincts valides par legal-compliance |
| Contenu genere (SEO, textes) sans validation | engagement involontaire, erreurs factuelles | FR-SEO-05 : tout contenu valide par Noah avant publication |
| KPIs non mesures des le pilote | impossible d'ameliorer | fiche de mesure par projet des le pilote (KPIS.md) |

## 8. Critere de sortie du perimetre

Toute fonctionnalite NON decrite dans ce document (ou dans REQUIREMENTS.md) doit
etre : (1) documentee comme COULD/futur, ou (2) faire l'objet d'un arbitrage
explicite Noah (Gate 1) avant tout developpement. Aucune demande client ne peut
etendre le perimetre sans passer par le pipeline commercial (devis -> validation).