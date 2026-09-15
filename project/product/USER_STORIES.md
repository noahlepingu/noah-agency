# USER_STORIES.md — Systeme de production de sites web (noah-agency)

Version : 0.1 (Phase 0 — Discovery)
Porteur : Product Manager
Format : « En tant que..., je veux..., afin de... » + criteres d'acceptation.
Priorites : MUST (v1) / SHOULD / COULD — coherence avec REQUIREMENTS.md.

Trois parcours :
- **A. Noah** (producteur) : il cree les sites clients via le systeme.
- **B. Visiteur final** : l'utilisateur du site produit.
- **C. Client acheteur** : le professionnel lyonnais qui commande un site.

---

## PARCOURS A — NOAH, producteur de sites via le systeme

### US-N-01 — Demarrer un projet client proprement
**En tant que** Noah, **je veux** demarrer chaque projet client par un fichier de donnees structure (activite, coordonnees, horaires, branding, SEO, legal), **afin de** ne jamais construire un site sans informations fiables et completes.
- AC : le modele YAML/section 11 existe dans le systeme.
- AC : les champs manquants sont listes explicitement ; le systeme refuse d'inventer une valeur.
- AC : le fichier valide est la source unique du contenu du site. (MUST)

### US-N-02 — Assembler un site sans developper
**En tant que** Noah, **je veux** choisir un template secteur + des composants + une configuration (couleurs, fonts, images, textes), **afin de** livrer un site professionnel sans reecriture de code.
- AC : un site v1 est assemble depuis la base de production ; aucun developpement ad hoc requis pour un besoin standard.
- AC : tout ecart au perimetre standard est identifie et chiffre avant engagement. (MUST)

### US-N-03 — Personnaliser le design par configuration
**En tant que** Noah, **je veux** adapter le design d'un site client (identite, palette, typographies) via configuration, **afin de** livrer un site qui ressemble au client sans partir de zero.
- AC : la configuration design est appliquee sans modifier les composants de la base. (MUST)

### US-N-04 — Generer les documents commerciaux en brouillon
**En tant que** Noah, **je veux** generer devis, proposition, contrat, CGV, facture et brief **en brouillon** depuis une offre validee, **afin de** ne pas partir d'une page blanche et de controler chaque document avant envoi.
- AC : chaque document est marque « BROUILLON » tant que Noah ne l'a pas valide.
- AC : CLIENT_TYPE (B2B/B2C) est demande avant toute generation de document commercial.
- AC : aucun document ne part sans validation humaine. (MUST)

### US-N-05 — Respecter le pipeline commercial
**En tant que** Noah, **je veux** que le systeme m'indique l'etape du pipeline (prospect -> discovery -> devis -> contrat -> acceptation -> acompte -> production -> validation -> livraison -> facturation -> maintenance), **afin de** savoir ou en est chaque client et ce qui bloque.
- AC : une fiche par client retrace l'etape courante et l'historique.
- AC : les gates non franchies sont signalees comme bloquantes. (MUST)

### US-N-06 — Ne jamais engager sans validation
**En tant que** Noah, **je veux** que rien (prix, delai, promesse technique, document) ne soit expediable sans ma validation, **afin de** rester seul responsable des engagements commerciaux.
- AC : le systeme n'a aucune voie d'envoi automatique de document commercial en v1.
- AC : le systeme signale explicitement ce qui reste de ma responsabilite. (MUST)

### US-N-07 — Garantir la conformite RGPD d'un site
**En tant que** Noah, **je veux** qu'un projet genere son PRIVACY_REQUIREMENTS + pages legales + bandeau cookies coherents, **afin de** livrer des sites conformes sans expertise juridique a chaque fois.
- AC : le systeme genere un PRIVACY_REQUIREMENTS par projet (donnees, finalite, base legale, destinataires, duree, droits).
- AC : aucune integration tierce (maps, analytics...) sans evaluation de son besoin de consentement.
- AC : aucun SIRET/adresse/TVA/mediateur invente : les champs manquants sont demandes. (MUST)

### US-N-08 — Gerer la TVA proprement
**En tant que** Noah, **je veux** configurer mon statut TVA (franchise en base / assujetti) une fois pour toutes, **afin de** que les documents et factures soient toujours conformes sans hardcoder 0 %.
- AC : la TVA est une configuration ; aucune valeur n'est inscrite en dur dans les templates. (MUST)

### US-N-09 — Valider aux 4 gates
**En tant que** Noah, **je veux** que le systeme me soumette les 4 gates (brief/perimetre/prix ; design/structure/contenu ; site final ; mise en production), **afin de** controler chaque etape engageante.
- AC : le systeme bloque la suite du pipeline tant que la gate n'est pas validee. (MUST)

### US-N-10 — Livrer un site SEO-local-ready
**En tant que** Noah, **je veux** que chaque site produit embarque des la conception le SEO local (donnees structurees, metadata, Open Graph, map, ancrage geographique), **afin de** que le client soit visible sur Google/Lyon sans surcoût de fin de projet.
- AC : template SEO par secteur (LocalBusiness/Restaurant...). (MUST)

### US-N-11 — Assurer la maintenance
**En tant que** Noah, **je veux** que chaque projet livre possede un MAINTENANCE_PLAN (technique + contenu + SEO), **afin de** delivrer un service suivi et recurrent.
- AC : le plan precise perimetre, frequence, canaux, delais, exclusions, tarif.
- AC : le flux maintenance (monitoring -> ticket -> correction -> tests -> validation -> deploy) est documente. (MUST)

### US-N-12 — Mesurer la performance du systeme
**En tant que** Noah, **je veux** que le systeme collecte les indicateurs definis dans KPIS.md (temps de creation, temps humain, cout, bugs, corrections, marge, maintenance, conversion, satisfaction), **afin de** ameliorer le ratio valeur produite / temps humain.
- AC : chaque projet pilote produit sa fiche de mesure. (SHOULD)

### US-N-13 — Deployer en production en toute securite
**En tant que** Noah, **je veux** qu'aucun deploiement reel n'ait lieu sans mon autorisation explicite (Gate 4), **afin de** garder la main sur la mise en ligne.
- AC : le processus de deploiement est documente (domaine, DNS, HTTPS, rollback).
- AC : la Gate 4 est une action humaine explicite. (MUST)

---

## PARCOURS B — VISITEUR FINAL du site produit

### US-V-01 — Comprendre immediatement
**En tant que** visiteur, **je veux** comprendre en quelques secondes de quoi parle le site, qui le tient et ou il se trouve, **afin de** decider de rester ou de partir.
- AC : hero clair (activite, nom, localisation), CTA visible, pas de doute sur l'offre. (MUST)

### US-V-02 — Trouver les informations pratiques
**En tant que** visiteur, **je veux** trouver adresse, horaires, telephone, email et map en un coup d'oeil, **afin de** pouvoir venir ou contacter facilement.
- AC : bloc infos pratiques visible sur la page d'accueil et la page contact.
- AC : les horaires sont a jour (source = fichier de donnees client). (MUST)

### US-V-03 — Contacter le commerce
**En tant que** visiteur, **je veux** envoyer un message via un formulaire simple, **afin de** poser une question sans decrocher le telephone.
- AC : formulaire avec mentions CNIL (finalite, droits), confirmation d'envoi, anti-spam, accessibilite.
- AC : aucune donnee stockee inutilement. (MUST)

### US-V-04 — Reserver / prendre RDV
**En tant que** visiteur, **je veux** faire une reservation simple en ligne, **afin de** reserver en dehors des heures d'ouverture.
- AC : v1 = formulaire de reservation avec recapitulatif et confirmation.
- AC : la demande arrive chez le professionnel (email) sans stockage inutile. (SHOULD)

### US-V-05 — Decouvrir l'offre (menu, prestations, galerie)
**En tant que** visiteur, **je veux** consulter le menu / les prestations / la galerie, **afin de** choisir ce que le commerce propose.
- AC : presentation claire, images optimisees, tarifs verifiables si fournis par le client. (MUST)

### US-V-06 — Naviguer sur mobile
**En tant que** visiteur, **je veux** naviguer confortablement sur smartphone, **afin de** consulter le site en deplacement.
- AC : mobile-first, cliquable, lisible, Core Web Vitals verts. (MUST)

### US-V-07 — Lire les pages legales
**En tant que** visiteur, **je veux** acceder aux mentions legales et a la politique de confidentialite, **afin de** identifier qui gere ce site et quelles donnees sont collectees.
- AC : pied de page avec liens legaux, responsable et hebergeur identifies (informations reelles). (MUST)

### US-V-08 — Gerer les cookies
**En tant que** visiteur, **je veux** pouvoir refuser les traceurs eventuels, **afin de** controler mes donnees.
- AC : pas de traceur non necessaire par defaut ; bandeau de consentement uniquement si tiers.
- AC : le refus est aussi facile que l'acceptation. (MUST)

### US-V-09 — Faire confiance (avis/SEO)
**En tant que** visiteur, **je veux** voir des preuves de qualite (avis clients, mention geographique), **afin de** me rassurer avant de me deplacer.
- AC : avis reels uniquement (jamais fabriques), presentation coherente. (SHOULD)

---

## PARCOURS C — CLIENT ACHETEUR (petit professionnel lyonnais)

### US-C-01 — Recevoir un devis clair
**En tant que** professionnel, **je veux** recevoir un devis comprehensible (perimetre, prix, delais, options), **afin de** decider en connaissance de cause.
- AC : devis structure par packages/options, TVA visible selon le statut de Noah, delai estime. (MUST)

### US-C-02 — Comprendre l'offre et les tarifs
**En tant que** professionnel, **je veux** comprendre les packages proposes (vitrine / + reservation / + e-commerce leger) et leur prix, **afin de** choisir ce qui correspond a mon budget.
- AC : offres documentees et presentees simplement (voir SCOPE/offre). (MUST)

### US-C-03 — Signer un contrat adapte (B2B / B2C)
**En tant que** professionnel, **je veux** un contrat et des CGV adaptes a ma situation (professionnel B2B par defaut, particulier B2C le cas echeant), **afin de** proteger mes droits.
- AC : le systeme distingue B2B et B2C (retractation 14 jours le cas echeant, mediateur...).
- AC : documents valides par Noah, verifies par legal-compliance avant premiere utilisation. (MUST)

### US-C-04 — Suivre l'avancement du projet
**En tant que** professionnel, **je veux** savoir ou en est mon site (production, tests, livraison), **afin de** preparer ma communication.
- AC : jalons visibles (gates) et communication tenue par Noah. (SHOULD)

### US-C-05 — Valider les jalons
**En tant que** professionnel, **je veux** valider le design et le contenu avant finalisation et avant mise en ligne, **afin de** ne pas decouvrir un site que je n'attendais pas.
- AC : gates 2 et 3 presentees au client ; revisions cadrees. (MUST)

### US-C-06 — Recevoir une facture conforme
**En tant que** professionnel, **je veux** recevoir une facture conforme (mentions, numero, TVA), **afin de** comptabiliser correctement.
- AC : facture generee en brouillon puis envoyee par Noah (numerotation coherente, TVA configuree). (MUST)

### US-C-07 — Beneficier de la maintenance
**En tant que** professionnel, **je veux** un contrat de maintenance clair (mises a jour, contenu, SEO, support), **afin de** garder mon site performant dans la duree.
- AC : MAINTENANCE_PLAN remis et joint au contrat ; perimetre, frequence, tarif explicites. (MUST)

### US-C-08 — Rester proprietaire de mon site
**En tant que** professionnel, **je veux** savoir ce que j'achete (site, code, domaines, contenus), **afin de** ne pas etre captif de mon prestataire.
- AC : le contrat precise la propriete du code, des contenus et des acces. (MUST — a formaliser par legal)

---

## Couverture fonctionnelle (rappels REQUIREMENTS.md)

| Parcours | Stories | Exigences couvertes |
| -------- | ------- | ------------------- |
| A. Noah | N-01 a N-13 | FR-BASE, FR-DATA, FR-COM, FR-LEGAL, FR-SEO, FR-MAINT, FR-VALID, FR-FORM |
| B. Visiteur | V-01 a V-09 | FR-BASE-04, FR-SEO, FR-FORM, FR-LEGAL-02/05/06 |
| C. Acheteur | C-01 a C-08 | FR-COM, FR-LEGAL-07, FR-MAINT, FR-VALID |