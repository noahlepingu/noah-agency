# REQUIREMENTS.md — Systeme de production de sites web (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Statut : PROPOSE — a valider par Noah (Gate 1, cahier des charges section 23)
Reference : `Cahier des charges — Systeme de production de sites web multi-agents pour une activite freelance a Lyon.md` (sections 1 a 32)

---

## 1. Objet et portee

Ce document decrit les besoins du **systeme de production** lui-meme, pas d'un site
client particulier. Le systeme doit permettre de produire des sites web
professionnels pour de petites structures lyonnaises (restaurants, commerces,
artisans, independants, professions liberales, associations, petites entreprises
locales) de maniere rapide, reproductible, rentable, personnalisable, maintenable
et conforme au droit francais.

Principe fondamental (cahier des charges section 8) :

> SYSTEME = configuration + contenu + design + personnalisation
> Nouveau developpement complet = a eviter

## 2. Utilisateurs du systeme

| Utilisateur | Role |
| ----------- | ---- |
| Noah | Producteur commercial : prospecte, decouvre, vend, valide (gates 1-4), livre, facture, maintient |
| Equipe d'agents (14) | Production : product, UX, content/SEO, architecture, dev, QA, securite, legal, ops |
| Client acheteur | Petit professionnel lyonnais (B2B par defaut ; B2C possible) qui commande un site |
| Visiteur final | Client de commerce du site produit (restaure, achete, prend RDV, contacte) |

## 3. Exigences fonctionnelles (FR)

Priorisation : **MUST** = indispensable au perimetre v1 ; **SHOULD** = fortement
souhaite, planifie ; **COULD** = optionnel / futur documente.

### 3.1 Base de production (cahier des charges sections 8-10)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-BASE-01 | Le systeme possede un **design system master** (couleurs, typographies, grille, espacements, tons, etats) reutilisable sur tous les sites produits | MUST |
| FR-BASE-02 | Le systeme possede une **bibliotheque de composants reutilisables** : Header, Footer, Hero, CTA, ContactForm, Gallery, Testimonials, Pricing, FAQ, Map, Menu, OpeningHours, SocialLinks, CookieBanner | MUST |
| FR-BASE-03 | Le systeme possede des **templates par secteur** : restaurant, artisan, commerce, independant, association ; le template restaurant est le template de reference livrable en v1 | MUST (restaurant) / SHOULD (autres secteurs) |
| FR-BASE-04 | Chaque composant et layout est **responsive mobile-first** | MUST |
| FR-BASE-05 | Le systeme possede des **layouts types** (accueil, page contenu, page contact, page legale, page liste, page fiche) | MUST |
| FR-BASE-06 | Un site client est assemble a partir de la base (composants + template + config) **sans redevelopper** ; tout ecart est justifie et documente | MUST |

### 3.2 Donnees client structurees (cahier des charges section 11)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-DATA-01 | Chaque projet client demarre par un **fichier de donnees structure** (business, branding, horaires, socials, SEO, services, contact, legal, maintenance) | MUST |
| FR-DATA-02 | Le systeme **detecte les champs manquants** et les demande ; il n'invente jamais SIRET, adresse, identite, TVA, mediateur, coordonnees, mentions juridiques | MUST |
| FR-DATA-03 | Le fichier de donnees est la **source unique** du contenu du site (textes, coordonnees, horaires, avis) | MUST |

### 3.3 Processus commercial (cahier des charges sections 13, 21, 25)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-COM-01 | Le systeme documente le **pipeline commercial** complet : prospect -> discovery -> devis -> CGV/contrat -> acceptation -> acompte -> production -> validation -> livraison -> facturation -> maintenance | MUST (documentation) |
| FR-COM-02 | Le systeme genere les documents commerciaux (devis, proposition, contrat, CGV, facture, brief) **en brouillon**, jamais expediables sans validation Noah | MUST |
| FR-COM-03 | Le systeme demande **CLIENT_TYPE (B2B/B2C)** avant toute generation de document commercial ou facture | MUST |
| FR-COM-04 | Le systeme gere une **numerotation de factures** coherente et sequentielle | SHOULD |
| FR-COM-05 | Le systeme fournit des **fiches prospect** et des **questions de discovery** preparees (brouillons) | SHOULD |
| FR-COM-06 | **Aucun prix, aucun delai, aucune promesse technique** n'est genere sans validation Noah (règle d'engagement) | MUST |

### 3.4 Legal & RGPD (cahier des charges sections 14-20)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-LEGAL-01 | Chaque projet possede un **PRIVACY_REQUIREMENTS.md** (donnees collectees, finalite, base legale, destinataires, duree de conservation, sous-traitants, transferts, droits, procedure) | MUST |
| FR-LEGAL-02 | Tout site produit fonctionne **sans cookies non necessaires par defaut** ; le CookieBanner apparait uniquement si des tiers exigent le consentement | MUST |
| FR-LEGAL-03 | Les integrations tierces (maps, analytics, video, reservation, pubs) sont **inventoriees** et leur besoin de consentement evalue | MUST |
| FR-LEGAL-04 | La **TVA est configurable** (franchise en base / assujetti) et jamais hardcodee a 0 % | MUST |
| FR-LEGAL-05 | Chaque site produit comporte **mentions legales + politique de confidentialite** avec identification du responsable et de l'hebergeur (informations reelles uniquement) | MUST |
| FR-LEGAL-06 | Les formulaires comportent les **mentions CNIL** (finalite, base legale, destinataires, duree, droits) et un moyen d'exercer ses droits | MUST |
| FR-LEGAL-07 | Les templates contractuels distinguent **B2B et B2C** (droit de retractation 14 jours le cas echeant, mediateur de la consommation, etc.) | MUST (legal) |
| FR-LEGAL-08 | Le systeme documente les **prestataires utilises** (hebergement, analytics, email, forms, reservation...) avec donnees transmises et localisation | MUST |

### 3.5 SEO local comme fonctionnalite produit (AGENT 03)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-SEO-01 | Le SEO local est **integre des la conception** d'un site, pas ajoute a la fin | MUST |
| FR-SEO-02 | Chaque site produit possede des **donnees structurees** (LocalBusiness / Restaurant selon secteur), **metadata** (title, description, canonical, robots) et **Open Graph** | MUST |
| FR-SEO-03 | Le systeme fournit des gabarits de **FAQ secteur** et d'**avis clients** (schema Review/AggregateRating si avis reels) | SHOULD |
| FR-SEO-04 | Le systeme integre **map et rayonnement local** (zone geographique, ville/quartier Lyon) dans les contenus | SHOULD |
| FR-SEO-05 | Les contenus SEO sont **valides par Noah avant publication** (jamais de contenu engageant genere seul) | MUST |

### 3.6 Maintenance (cahier des charges sections 26-27)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-MAINT-01 | L'offre inclut des le depart un **MAINTENANCE_PLAN** par projet : technique + contenu + SEO | MUST |
| FR-MAINT-02 | Le MAINTENANCE_PLAN precise perimetre, frequence, canaux, delais d'intervention, exclusions, tarification | MUST |
| FR-MAINT-03 | Le systeme documente le **flux de maintenance** : monitoring -> erreur -> diagnostic -> ticket -> correction -> tests -> validation Noah -> deploy | SHOULD |
| FR-MAINT-04 | **Aucune correction automatique en production** sans validation humaine (problemes critiques inclus) | MUST |

### 3.7 Validation humaine (cahier des charges sections 23)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-VALID-01 | Les **4 gates de validation Noah** existent comme etapes obligatoires : G1 perimetre/prix/brief, G2 design/structure/contenu, G3 site final, G4 mise en production | MUST |
| FR-VALID-02 | Le systeme **bloque** la poursuite du pipeline tant que la gate n'est pas franchie | MUST |
| FR-VALID-03 | Les gates s'appliquent **au systeme lui-meme et a chaque projet client** | MUST |

### 3.8 Formulaires et interactions (produits des sites)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-FORM-01 | Composant ContactForm : envoi email/securise, protection anti-spam, confirmation utilisateur, mentions CNIL | MUST |
| FR-FORM-02 | Reservation : **formulaire simple en v1** ; systeme en ligne / service externe a arbitrer avec le premier client | SHOULD |
| FR-FORM-03 | Les formulaires sont **accesibles** (labels, erreurs, focus, confirmation) | MUST |
| FR-FORM-04 | Aucune donnee de formulaire n'est stockee inutilement ; duree de conservation definie dans PRIVACY_REQUIREMENTS | MUST |

### 3.9 Automatisations documentees comme futur (cahier des charges section 24)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-AUTO-01 | Les automatisations **Niveau 1** (generation de projet, dependances, pages, tests, lint, build) sont documentees comme feuille de route | SHOULD (documente) / COULD (implemente) |
| FR-AUTO-02 | Les automatisations **Niveau 2** (generation SEO, contenus, metadata, images, audits) sont documentees comme feuille de route | COULD |
| FR-AUTO-03 | Les automatisations **Niveaux 3-4** (projet auto depuis formulaire, deploy auto, monitoring, tickets) sont **hors perimetre v1** et documentees | COULD (documente uniquement) |
| FR-AUTO-04 | L'automatisation ne porte **jamais** sur les decisions engageantes (envoi devis, negociation, contrat, juridique, remboursement, suppression de donnees, migration, deploy) | MUST |

### 3.10 Multilingue (decision phase 0)

| ID | Exigence | Priorite |
| -- | -------- | -------- |
| FR-I18N-01 | Langue par defaut : **francais** ; l'architecture n'interdit pas une version EN basique sur les pages cles | COULD (a decider avec le premier client en ayant besoin) |

## 4. Exigences non fonctionnelles (NFR)

| ID | Exigence | Cible |
| -- | -------- | ----- |
| NFR-PERF-01 | Core Web Vitals **verts sur mobile** pour les sites produits | LCP < 2,5 s ; CLS < 0,1 ; INP < 200 ms |
| NFR-PERF-02 | Images, fonts, CSS, JS optimises (cache, formats, poids) | poids page < 500 Ko (hors media) |
| NFR-ACC-01 | Accessibilite **WCAG 2.2 AA** : contraste, clavier, focus, structure HTML, alt, formulaires, navigation | AA |
| NFR-SEC-01 | HTTPS par defaut, secrets hors repo, dependances auditees, headers securise | aucun secret expose |
| NFR-SEC-02 | Aucune donnee personnelle collectee sans finalite documentee (CNIL) | conforme |
| NFR-BUDGET-01 | Solutions **gratuites ou low-cost** ; tout cout payant documente dans DECISIONS avant engagement | couts maîtrises |
| NFR-REUSE-01 | Tout composant du design system est **immediatement reutilisable** dans le prochain site | 100 % de la base |
| NFR-DOC-01 | Toute decision importante actee dans DECISIONS.md | DoD |
| NFR-INTEG-01 | **Aucune donnee client inventee** ; champs manquants identifies et demandes | tolerance zero |
| NFR-MAINT-01 | Code sobre, conventions partagees, dette technique minimale | revue par code-reviewer |
| NFR-LEGAL-01 | Identification du responsable et de l'hebergeur sur tout site produit | obligatoire |
| NFR-OPS-01 | Deploiement reproductible et documente (rollback possible) | documente |
| NFR-PM-01 | Les KPIs du systeme (section 30) sont mesurables des le premier projet pilote | voir KPIS.md |

## 5. Criteres d'acceptation transverses

1. Un nouveau projet client demarre par un fichier de donnees structure + choix de template + config design, **sans developpement ad hoc**.
2. Les 4 gates bloquent le pipeline tant que Noah n'a pas valide.
3. Aucun document commercial, aucun prix, aucun delai ne quitte le systeme sans validation Noah.
4. Aucun site produit ne contient de donnees inventees (SIRET, adresse, TVA, mediateur...).
5. Chaque site produit est conforme RGPD (PRIVACY_REQUIREMENTS + mentions + cookies) des la conception.
6. Le SEO local (structure, metadata, Open Graph, map) est present des la v1 d'un site.
7. Chaque projet livre possede un MAINTENANCE_PLAN acte.
8. Definition of Done du projet : specifie, fonctionnel, teste, sans regression, conforme a l'architecture, documente, revu (CONTEXT.md).