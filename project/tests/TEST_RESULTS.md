# Resultats des tests — Phase 4 QA (systeme + site exemple)

Date : 2026-09-15
Executant : QA Engineer (AGENT 10)
Build teste : `dist/exemple-restaurant/` (La Table d'Essai — donnees fictives)
Environnement : Node 20.20.2 (nvm), Linux/WSL, Astro 5.18.2

## 1. Synthese

| Categorie | Resultat |
| --------- | -------- |
| Tests unitaires (`npm test`) | **30/30 PASS** (0 fail) — 2.4 s |
| Validation client exemple | **exit 0** (47 champs valides / 64 + regles ; SHOULD restants documentes) |
| Build exemple | **16 pages OK** (13 FR + 3 EN) en 8.6 s |
| Audit statique du build | **13 PASS, 0 FAIL reel, 8 WARN/observations** (2 FAIL initiaux = faux positifs, voir §4) |
| Bugs ouverts | **8** (2 majeurs, 5 mineurs, 1 observation) — voir BUGS.md |

## 2. Tests unitaires — detail (30 tests)

| Fichier | Couverture | Resultat |
| ------- | ---------- | -------- |
| tests/validate-client.test.mjs (11) | codes 0/2/3/4 ordre format>required ; C-01, C-04, C-06 ; derivations (address.full, phone_intl, zoom, EI, package) ; rapport markdown ; exemple = OK | PASS |
| tests/reservation.test.mjs (10) | getDayName, isClosedPeriod (inclusif), isDayOpen, getSlotsForDate (filtrage/generation 30 min/jour ferme/periode fermeture/no_slot), C-05, findNextAvailableDate | PASS |
| tests/forms.test.mjs (9) | email, tel FR/intl, required/optionnel, honeypot, buildFormEndpoint (http/mailto/none), submitForm sans endpoint | PASS |

Regressions : aucune (30/30 apres re-run sur branches frontend/backend/devops).

## 3. Pipeline — execution

```
$ npm test            -> # tests 30 | # pass 30 | # fail 0
$ npm run validate:example -> Validation OK (47 champs valides) — exit 0
$ npm run build:example    -> 16 page(s) built in 8.62s — Complete!
```

### Validation exemple — recommandations restantes (SHOULD, non bloquantes)
- socials.google_business, seo.district, seo.zone (SEO local a completer avec
  les donnees reelles du 1er client) ;
- legal.mediator_name (C-16, B2C potentiel — arbitrage Noah) ;
- maintenance.plan_active (offre maintenance a activer au contrat).

## 4. Audit statique du build — detail

### PASS (13)
- T-PAGES : 16 pages (13 FR + 3 EN) attendues et presentes.
- T-H1 : 1 seul h1 par page (16/16).
- T-LANG : attribut lang correct sur toutes les pages.
- T-LINKS : aucun lien interne casse. Les 4 occurrences `/_astro/*.(css|js)`
  signalees par l'audit initial existent dans `dist/.../_astro/` (assets
  buildés) — **faux positif**, verifie fichier par fichier.
- T-SITEMAP : 14 URLs (11 FR + 3 EN), chacune resolue vers une page existante.
- T-ROBOTS : `User-agent: *` + ligne Sitemap presente.
- T-JSONLD : 5 blocs JSON-LD valides (parses sans erreur).
- T-FORMS : contact = 5 champs ; reservation = 10 champs ; pas d'action HTTP
  backend (fallback mailto/JS, conforme ADR-003 en attendant le service tiers).
- T-STATES : pages 404 et 500 avec header/footer/CTA et 1 h1.
- T-SKIPLINK : 16/16 pages avec lien d'evitement `#contenu` + `<main id="contenu">`.
- T-COOKIE : bandeau cookies **non affiche** quand `third_party` est tout false
  (comportement conforme) ; script inclus mais inoffensif (voir BUG-QA-06).
- T-PLACEHOLDERS : aucun placeholder `[Nom]`/`[Activite]`/`[Ville]`... residuel.
  Les matches `[open]` initiaux sont des selecteurs CSS `.ds-faq__item[open]`,
  pas des placeholders — **faux positif**, verifie par grep cible.
- T-HREFLANG : pages traduites (index, a-propos, contact) = fr + x-default + en
  sur les 2 versions ; pages noindex sans hreflang = conforme.

### WARN / observations (8)
1. `en/*` : contenu FR affiche (BUG-QA-01, majeur).
2. Nav et CTA des pages EN en francais (BUG-QA-03, majeur).
3. A-propos : description meta « cuisine cuisine francaise » (BUG-QA-02, mineur).
4. Pattern `seo_title` du template inutilise (BUG-QA-04, mineur).
5. 5 pages = meta description = titre (BUG-QA-05, mineur).
6. Script bandeau cookies charge sur les 16 pages sans tiers actifs (BUG-QA-06, mineur).
7. Generation monotype : `templates/restaurant` dur dans generate-site.mjs —
   aucune categorie artisan/commerce/... ne peut generer aujourd'hui,
   alors que la validation les accepte (BUG-QA-07, observation architecture).
8. Index : meta description 105 car. (< 120-160) et identique EN/FR (BUG-QA-08, mineur).

### Faux positifs ecartes (detail)
- `T-PLACEHOLDERS` : `[open]` = selecteur CSS des FAQ (details), pas un placeholder.
- `T-LINKS-INTERNES` : `/ _astro/*` = assets reallement produits par le build,
  listes dans `dist/exemple-restaurant/_astro/`.

## 5. Cas multi-template (artisan)

Fixture temporaire : `content/clients/qa-artisan-test/client_data.yaml`
(category: artisan, template: artisan, package: vitrine — champs minimaux).
Verdict de la validation : **code 3 (ERREUR FORMAT)** — 24 champs bloquants
detectes (REQUIRED manquants + erreurs de format) ; le FORMAT prend le pas sur
les REQUIRED, conformement a CLIENT_DATA_VALIDATION.md §2.2. 12 SHOULD listes.
La validation fonctionne pour toute categorie declaree (CATEGORIES =
restaurant, artisan, commerce, independant, association).
En revanche le pipeline de generation ne lit jamais `template.type` :
`generate-site.mjs` construit `templates/restaurant` en dur (§3 etape 3).
Conséquence : un client artisan valide produirait un site restaurant.
Documente en BUG-QA-07 ; la fixture a ete supprimee apres test (pas de
pollution de `content/clients/`).

## 6. Verification supplementaire (contrat generation)

- `dist/exemple-restaurant/validation-report.md` produit et conforme
  (RESULTAT, champs bloquants/recommandes/optionnels, regles).
- `data.json` du site : `texts_en` rempli (traduction EN complete des textes)
  mais **jamais consomme** par les composants — source du BUG-QA-01.

## 7. Conclusion

Le systeme est **FONCTIONNEL et reproductible** : pipeline de validation et de
generation conforme aux specs, build stable, liens sains, SEO/hreflang/JSON-LD
vérifies, etats speciaux couverts, 30 tests unitaires verts.

La **localisation EN reelle** (contenu + navigation) est le point de blocage
qualite majeur avant toute version EN exploitable (BUG-QA-01 et BUG-QA-03).
Les autres bugs sont mineurs (metadata SEO) ou a traiter en Phase 6
(corrections) avant Gate 4 d'un client reel.

Prochaine etape : accessibility-specialist (WCAG) puis performance-engineer ;
corrections Phase 6 sur BUGS.md.