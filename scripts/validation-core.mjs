#!/usr/bin/env node
/**
 * validation-core.mjs — Moteur de validation du fichier client_data.yaml
 * Reference : project/database/CLIENT_DATA_VALIDATION.md (regles C-01..C-18,
 *             sections 2 a 6) et project/content/CLIENT_DATA_SCHEMA.md.
 *
 * Ce module est volontairement sans dependance externe (pas de ajv) :
 * les besoins (niveaux REQUIRED/SHOULD/COULD, champs a derivation,
 * contraintes croisees C-xx, rapport markdown) depassent ce qu'un JSON
 * Schema exprime naturellement ; une validation native est plus simple a
 * maintenir et a tester, et ne rajoute aucune dependance au budget 0 EUR.
 * (Decision D-BE-01 — voir project/DECISIONS.md.)
 *
 * Codes de sortie (CLIENT_DATA_VALIDATION.md §2.2) :
 *   0 = VALIDATION OK          (aucun champ bloquant)
 *   1 = ERREUR YAML            (parse)
 *   2 = EN ATTENTE DE DONNEES  (champs REQUIRED manquants)
 *   3 = ERREUR FORMAT          (regex / enum / type invalide)
 *   4 = FICHIER INTROUVABLE    (geré par le CLI)
 *
 * Les niveaux SHOULD / COULD ne modifient jamais le code de sortie.
 */

export const EXIT_OK = 0;
export const EXIT_YAML = 1;
export const EXIT_REQUIRED = 2;
export const EXIT_FORMAT = 3;
export const EXIT_NOT_FOUND = 4;

export const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
export const CATEGORIES = ['restaurant', 'artisan', 'commerce', 'independant', 'association'];
export const PACKAGES = ['vitrine', 'vitrine_reservation', 'vitrine_ecommerce'];
export const RESERVATION_METHODS = ['form', 'external_link', 'phone_only'];
export const REVIEW_SOURCES = ['google', 'tripadvisor', 'facebook', 'custom'];
export const MAINTENANCE_FREQUENCIES = ['mensuel', 'bimensuel', 'trimestriel'];
export const FONTS = ['Inter', 'Playfair Display', 'DM Sans', 'Libre Baskerville', 'Fraunces'];

/** Regex de reference (CLIENT_DATA_VALIDATION.md §3.2) */
export const FORMATS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  'phone-fr': /^0[1-9]([ .-]?\d{2}){4}$/,
  'phone-intl': /^\+[1-9]\d{1,14}$/,
  'hex-color': /^#[0-9A-Fa-f]{6}$/,
  time: /^([01]\d|2[0-3]):[0-5]\d$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  siren: /^\d{9}$/,
  siret: /^\d{14}$/,
  lat: /^-?([0-8]?\d(\.\d+)?|90(\.0+)?)$/,
  lng: /^-?((1[0-7]\d|[0-9]?\d)(\.\d+)?|180(\.0+)?)$/,
  domain: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'name-chars': /^[A-Za-z0-9À-ÿ\s\-'\.]+$/,
};

/* ---------------------------------------------------------------- */
/* Helpers                                                           */
/* ---------------------------------------------------------------- */

export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function isEmptyValue(v) {
  if (v === undefined || v === null) return true;
  if (typeof v === 'string') return v.trim() === '';
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

/* ---------------------------------------------------------------- */
/* Definition declarative des champs du schema                       */
/* Niveau : REQUIRED (bloque) / SHOULD (alerte) / COULD (info)       */
/* ---------------------------------------------------------------- */

function str(v) {
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : '';
}

const FIELDS = [
  // --- BUSINESS ---
  { path: 'business.name', level: 'REQUIRED', label: 'Nom commercial', action: 'Fournir le nom commercial', type: 'string', format: 'name-chars', min: 2, max: 80 },
  { path: 'business.description', level: 'REQUIRED', label: 'Description courte', action: 'Rediger une description de 10 a 160 caracteres', type: 'string', min: 10, max: 160 },
  { path: 'business.long_description', level: 'SHOULD', label: 'Description longue', action: 'Rediger la description longue de la page A propos', type: 'string', min: 20 },
  { path: 'business.category', level: 'REQUIRED', label: 'Categorie d activite', action: 'Choisir une categorie (restaurant, artisan, commerce, independant, association)', type: 'string', enum: CATEGORIES },
  { path: 'business.slogan', level: 'COULD', label: 'Slogan', type: 'string', max: 60 },

  // --- BRANDING ---
  { path: 'branding.primary_color', level: 'REQUIRED', label: 'Couleur primaire', action: 'Fournir la couleur primaire (hex, ex: #B91C1C)', type: 'string', format: 'hex-color' },
  { path: 'branding.secondary_color', level: 'REQUIRED', label: 'Couleur secondaire', action: 'Fournir la couleur secondaire (hex)', type: 'string', format: 'hex-color' },
  { path: 'branding.accent_color', level: 'COULD', label: 'Couleur d accent', type: 'string', format: 'hex-color' },
  { path: 'branding.fonts.heading', level: 'REQUIRED', label: 'Police de titres', action: 'Choisir une police de titres (Inter, Playfair Display, DM Sans, Libre Baskerville)', type: 'string', enum: FONTS },
  { path: 'branding.fonts.body', level: 'REQUIRED', label: 'Police de corps', action: 'Choisir une police de corps', type: 'string', enum: FONTS },
  { path: 'branding.logo', level: 'SHOULD', label: 'Logo', action: 'Fournir le chemin du logo (dossier assets du client)', type: 'string' },
  { path: 'branding.favicon', level: 'SHOULD', label: 'Favicon', action: 'Fournir le chemin du favicon', type: 'string' },

  // --- OPENING HOURS ---
  { path: 'opening_hours.enabled', level: 'REQUIRED', label: 'Horaires actives', action: 'Indiquer si les horaires sont actives (true/false)', type: 'boolean' },

  // --- SOCIALS ---
  { path: 'socials.google_business', level: 'SHOULD', label: 'Profil Google Business', action: 'Fournir l URL Google Business Profile', type: 'string', format: 'url' },
  { path: 'socials.facebook', level: 'COULD', label: 'Facebook', type: 'string', format: 'url' },
  { path: 'socials.instagram', level: 'COULD', label: 'Instagram', type: 'string', format: 'url' },
  { path: 'socials.tripadvisor', level: 'COULD', label: 'TripAdvisor', type: 'string', format: 'url' },
  { path: 'socials.tiktok', level: 'COULD', label: 'TikTok', type: 'string', format: 'url' },
  { path: 'socials.linkedin', level: 'COULD', label: 'LinkedIn', type: 'string', format: 'url' },
  { path: 'socials.youtube', level: 'COULD', label: 'YouTube', type: 'string', format: 'url' },
  { path: 'socials.whatsapp', level: 'COULD', label: 'WhatsApp', type: 'string', format: 'phone-intl' },

  // --- SEO ---
  { path: 'seo.city', level: 'REQUIRED', label: 'Ville principale', action: 'Fournir la ville principale (ex: Lyon)', type: 'string', min: 2 },
  { path: 'seo.district', level: 'SHOULD', label: 'Quartier / arrondissement', action: 'Indiquer le quartier ou arrondissement', type: 'string' },
  { path: 'seo.zone', level: 'SHOULD', label: 'Zone de chalandise', action: 'Decrire la zone desservie', type: 'string' },
  { path: 'seo.meta_description', level: 'REQUIRED', label: 'Meta description', action: 'Rediger une meta description de 120 a 160 caracteres', type: 'string', min: 120, max: 160 },
  { path: 'seo.keywords', level: 'SHOULD', label: 'Mots-cles', action: 'Lister 5 a 10 mots-cles principaux', type: 'array', min: 1 },
  { path: 'seo.domain', level: 'REQUIRED', label: 'Domaine du site', action: 'Fournir le nom de domaine (canonical, sitemap, Open Graph) — regle C-17', type: 'string', format: 'domain' },
  { path: 'seo.google_business_id', level: 'COULD', label: 'ID Google Business', type: 'string' },
  { path: 'seo.price_range', level: 'COULD', label: 'Fourchette de prix', action: 'Indiquer la fourchette de prix (schema.org priceRange, ex: "€€") — emise dans le JSON-LD Restaurant', type: 'string', min: 1, max: 12 },

  // --- SERVICES ---
  { path: 'services', level: 'REQUIRED', label: 'Services / prestations', action: 'Ajouter au moins un service', type: 'array', min: 1 },

  // --- CONTACT ---
  { path: 'contact.address.street', level: 'REQUIRED', label: 'Adresse (rue)', action: 'Fournir l adresse complete (numero et rue)', type: 'string', min: 4 },
  { path: 'contact.address.city', level: 'REQUIRED', label: 'Adresse (ville)', action: 'Fournir la ville', type: 'string', min: 2 },
  { path: 'contact.address.postal_code', level: 'REQUIRED', label: 'Code postal', action: 'Fournir le code postal', type: 'string', min: 5 },
  { path: 'contact.phone', level: 'REQUIRED', label: 'Telephone', action: 'Fournir le telephone au format FR (ex: 04 78 12 34 56)', type: 'string', format: 'phone-fr' },
  { path: 'contact.email', level: 'REQUIRED', label: 'Email de contact', action: 'Fournir l email de contact', type: 'string', format: 'email' },
  { path: 'contact.website', level: 'COULD', label: 'Site web existant', type: 'string', format: 'url' },
  { path: 'contact.map.lat', level: 'REQUIRED', label: 'Latitude', action: 'Fournir la latitude (avec la longitude, regle C-10)', type: 'string', format: 'lat' },
  { path: 'contact.map.lng', level: 'REQUIRED', label: 'Longitude', action: 'Fournir la longitude (avec la latitude, regle C-10)', type: 'string', format: 'lng' },

  // --- LEGAL ---
  { path: 'legal.legal_name', level: 'REQUIRED', label: 'Raison sociale / responsable', action: 'Fournir la raison sociale ou le nom du responsable', type: 'string', min: 2 },
  { path: 'legal.legal_form', level: 'REQUIRED', label: 'Forme juridique', action: 'Fournir la forme juridique (EI, SARL, SAS...)', type: 'string', min: 2 },
  { path: 'legal.siren', level: 'REQUIRED', label: 'SIREN', action: 'Fournir le numero SIREN (9 chiffres)', type: 'string', format: 'siren' },
  { path: 'legal.siret', level: 'REQUIRED', label: 'SIRET', action: 'Fournir le numero SIRET (14 chiffres)', type: 'string', format: 'siret' },
  { path: 'legal.capital', level: 'SHOULD', label: 'Capital social', action: 'Fournir le capital social si applicable (optionnel pour EI, regle C-11)', type: 'string' },
  { path: 'legal.phone_pro', level: 'REQUIRED', label: 'Telephone professionnel', action: 'Fournir le telephone professionnel (mentions legales)', type: 'string', format: 'phone-fr' },
  { path: 'legal.email_pro', level: 'REQUIRED', label: 'Email professionnel', action: 'Fournir l email professionnel (mentions legales)', type: 'string', format: 'email' },
  { path: 'legal.host_name', level: 'REQUIRED', label: 'Nom de l hebergeur', action: 'Fournir le nom de l hebergeur', type: 'string', min: 2 },
  { path: 'legal.host_address', level: 'REQUIRED', label: 'Adresse de l hebergeur', action: 'Fournir l adresse de l hebergeur', type: 'string', min: 4 },
  { path: 'legal.mediator_name', level: 'SHOULD', label: 'Mediateur de la consommation', action: 'Fournir le nom du mediateur (activite B2C — regle C-16)', type: 'string' },
  { path: 'legal.mediator_address', level: 'SHOULD', label: 'Adresse du mediateur', action: 'Fournir l adresse du mediateur (B2C)', type: 'string' },
  { path: 'legal.director', level: 'SHOULD', label: 'Directeur de la publication', action: 'Fournir le nom du directeur de la publication', type: 'string' },
  { path: 'legal.registration_number', level: 'SHOULD', label: "Numero d'immatriculation", action: 'Fournir le numero RCS / registre metier', type: 'string' },

  // --- REVIEWS ---
  { path: 'reviews.enabled', level: 'COULD', label: 'Avis actives', type: 'boolean' },
  { path: 'reviews.source', level: 'COULD', label: 'Source des avis', type: 'string', enum: REVIEW_SOURCES },
  { path: 'reviews.min_count', level: 'COULD', label: 'Nombre minimum d avis', type: 'number' },

  // --- MENU ---
  { path: 'menu.enabled', level: 'COULD', label: 'Menu actif', type: 'boolean' },

  // --- RESERVATION ---
  { path: 'reservation.enabled', level: 'COULD', label: 'Reservation active', type: 'boolean' },
  { path: 'reservation.method', level: 'COULD', label: 'Methode de reservation', type: 'string', enum: RESERVATION_METHODS },
  { path: 'reservation.max_party_size', level: 'COULD', label: 'Capacite maximale', type: 'number' },
  { path: 'reservation.form_endpoint', level: 'COULD', label: 'Endpoint du formulaire de reservation', type: 'string', format: 'url' },

  // --- TEMPLATE ---
  { path: 'template.type', level: 'REQUIRED', label: 'Type de template', action: 'Choisir le type de template (doit correspondre a la categorie, regle C-01)', type: 'string', enum: CATEGORIES },
  { path: 'template.package', level: 'REQUIRED', label: 'Package', action: 'Choisir le package (vitrine, vitrine_reservation, vitrine_ecommerce)', type: 'string', enum: PACKAGES },
  { path: 'template.multilingual', level: 'COULD', label: 'Multilingue EN', type: 'boolean' },

  // --- MAINTENANCE ---
  { path: 'maintenance.plan_active', level: 'COULD', label: 'Plan de maintenance actif', type: 'boolean' },
  { path: 'maintenance.start_date', level: 'COULD', label: 'Date de debut de maintenance', type: 'string', format: 'date' },
  { path: 'maintenance.frequency', level: 'COULD', label: 'Frequence de maintenance', type: 'string', enum: MAINTENANCE_FREQUENCIES },
];

/* ---------------------------------------------------------------- */
/* Validation structurelle                                           */
/* ---------------------------------------------------------------- */

function validateTypesAndFormats(data) {
  const issues = [];
  let validCount = 0;

  for (const field of FIELDS) {
    const value = getPath(data, field.path);
    if (isEmptyValue(value)) continue; // presence traitee au niveau evaluation

    const expected = field.type;
    const actual = typeOf(value);
    if (expected === 'number') {
      if (typeof value !== 'number' || Number.isNaN(value)) {
        issues.push({ path: field.path, detail: `Type attendu : nombre, recu : ${actual}` });
        continue;
      }
    } else if (expected === 'boolean') {
      if (typeof value !== 'boolean') {
        issues.push({ path: field.path, detail: `Type attendu : booleen, recu : ${actual}` });
        continue;
      }
    } else if (expected === 'array') {
      if (!Array.isArray(value)) {
        issues.push({ path: field.path, detail: `Type attendu : liste, recu : ${actual}` });
        continue;
      }
    } else if (typeof value !== 'string') {
      // lat/lng acceptent les nombres (JSON-LD natif) ; stringifie pour le format
      const numericFormat = field.format === 'lat' || field.format === 'lng';
      if (!(typeof value === 'number' && !Number.isNaN(value) && numericFormat)) {
        issues.push({ path: field.path, detail: `Type attendu : texte, recu : ${actual}` });
        continue;
      }
    }

    // Format regex (numbers : test sur la valeur stringifiee)
    if (field.format && FORMATS[field.format]) {
      const candidate = typeof value === 'number' ? String(value) : value;
      if (typeof candidate === 'string' && !FORMATS[field.format].test(candidate.trim())) {
        issues.push({ path: field.path, detail: `Format invalide (${field.format})` });
        continue;
      }
    }

    // Enum
    if (field.enum && typeof value === 'string' && !field.enum.includes(value)) {
      issues.push({ path: field.path, detail: `Valeur invalide : "${value}" (autorise : ${field.enum.join(', ')})` });
      continue;
    }

    // Longueurs (string) / taille (array)
    if (typeof value === 'string' || Array.isArray(value)) {
      const len = value.length;
      if (field.min != null && len < field.min) {
        issues.push({ path: field.path, detail: `Trop court (min ${field.min}, actuel ${len})` });
        continue;
      }
      if (field.max != null && len > field.max) {
        issues.push({ path: field.path, detail: `Trop long (max ${field.max}, actuel ${len})` });
        continue;
      }
    }

    validCount += 1;
  }

  return { issues, validCount };
}

/* ---------------------------------------------------------------- */
/* Contraintes croisees C-01..C-18                                   */
/* ---------------------------------------------------------------- */

function scheduleOf(data) {
  return data.opening_hours?.schedule || [];
}
function closedPeriodsOf(data) {
  return data.opening_hours?.closed_periods || [];
}
function slotsOf(data) {
  return data.reservation?.slots || data.reservation?.time_slots || [];
}

function crossFieldRules(data) {
  const rules = [];
  const add = (rule, level, detail) => rules.push({ rule, level, detail });
  const b = data.business || {};
  const t = data.template || {};
  const r = data.reservation || {};
  const oh = data.opening_hours || {};
  const menu = data.menu || {};
  const reviews = data.reviews || {};
  const s = data.seo || {};
  const l = data.legal || {};
  const map = data.contact?.map || {};

  // C-01 — categorie == type de template (BLOQUANT)
  if (str(b.category) && str(t.type) && b.category !== t.type) {
    add('C-01', 'BLOQUANT', `business.category ("${b.category}") != template.type ("${t.type}")`);
  }

  // C-02 — horaires actives sans schedule (BLOQUANT)
  if (oh.enabled && (!Array.isArray(oh.schedule) || oh.schedule.length === 0)) {
    add('C-02', 'BLOQUANT', 'opening_hours.enabled: true sans opening_hours.schedule');
  }

  // C-03 — menu actif sans categories/items (BLOQUANT)
  if (menu.enabled) {
    const cats = Array.isArray(menu.categories) ? menu.categories : [];
    const empty = cats.length === 0 || cats.some((c) => !Array.isArray(c?.items) || c.items.length === 0);
    if (empty) {
      add('C-03', 'BLOQUANT', 'menu.enabled: true sans categories (ou categorie sans item)');
    }
  }

  // C-04 — package reservation sans reservation.enabled (BLOQUANT)
  if ((t.package === 'vitrine_reservation' || t.package === 'vitrine_ecommerce') && !r.enabled) {
    add('C-04', 'BLOQUANT', `Package ${t.package} sans reservation.enabled: true`);
  }

  // C-05 — reservation form sans source de creneaux (SHOULD)
  if (r.enabled && r.method !== 'external_link' && r.method !== 'phone_only') {
    const hasSchedule = Array.isArray(oh.schedule) && oh.schedule.length > 0;
    const hasSlots = slotsOf(data).length > 0;
    if (!hasSlots && !hasSchedule) {
      add('C-05', 'SHOULD', 'Reservation active sans reservation.slots ni opening_hours.schedule : le formulaire affichera toujours « aucun creneau »');
    }
  }

  // C-06 — avis custom actives sans items (BLOQUANT)
  if (reviews.enabled && reviews.source === 'custom') {
    const min = typeof reviews.min_count === 'number' ? reviews.min_count : 3;
    const items = Array.isArray(reviews.items) ? reviews.items : [];
    if (items.length < min) {
      add('C-06', 'BLOQUANT', `reviews.source: custom mais seulement ${items.length} avis (min_count: ${min})`);
    }
  }

  // C-07 — source externe sans URL (SHOULD)
  if (reviews.enabled && reviews.source && reviews.source !== 'custom') {
    const hasUrl = str(data.socials?.google_business) || str(data.socials?.tripadvisor);
    if (!hasUrl) {
      add('C-07', 'SHOULD', `Source d avis "${reviews.source}" sans URL Google Business / TripAdvisor dans socials`);
    }
  }

  // C-08 — fermetures exceptionnelles invalides (BLOQUANT)
  for (const period of closedPeriodsOf(data)) {
    if (period && str(period.start) && str(period.end) && period.start > period.end) {
      add('C-08', 'BLOQUANT', `closed_periods invalide : start (${period.start}) > end (${period.end})`);
    }
  }

  // C-09 — multilingual sans champs EN (SHOULD)
  if (t.multilingual) {
    if (!str(b.description_en) || !str(s.meta_description_en)) {
      add('C-09', 'SHOULD', 'Multilingue active : fournir business.description_en et seo.meta_description_en (sinon fallback FR)');
    }
  }

  // C-10 — coordonnees incompletes (BLOQUANT)
  if ((str(map.lat) && !str(map.lng)) || (!str(map.lat) && str(map.lng))) {
    add('C-10', 'BLOQUANT', 'contact.map.lat et contact.map.lng doivent etre renseignes ensemble');
  }

  // C-11 — capital optionnel pour EI (SHOULD sinon)
  if (str(l.legal_form) && l.legal_form !== 'EI' && !str(l.capital)) {
    add('C-11', 'SHOULD', 'Forme juridique differente de EI sans legal.capital');
  }

  // C-12 — whatsapp au format international (BLOQUANT)
  if (str(data.socials?.whatsapp) && !FORMATS['phone-intl'].test(data.socials.whatsapp.replace(/[\s.-]/g, ''))) {
    add('C-12', 'BLOQUANT', `socials.whatsapp invalide : "${data.socials.whatsapp}" (format international +33... requis)`);
  }

  // C-13 — doublons de jours / plages contradictoires (SHOULD)
  const byDay = {};
  for (const entry of scheduleOf(data)) {
    if (!entry?.day) continue;
    const key = `${entry.day}|${entry.open || ''}|${entry.close || ''}`;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(entry);
    if (byDay[key].length > 2) {
      add('C-13', 'SHOULD', `Plus de 2 plages horaires pour ${entry.day} ${entry.open}-${entry.close}`);
    }
  }

  // C-14 — restaurant sans menu (COULD)
  if (b.category === 'restaurant' && !menu.enabled) {
    add('C-14', 'COULD', 'Un restaurant presente generalement son menu (menu.enabled suggere)');
  }

  // C-15 — plan de maintenance actif sans configuration (BLOQUANT)
  if (data.maintenance?.plan_active) {
    if (!str(data.maintenance.start_date) || !str(data.maintenance.frequency)) {
      add('C-15', 'BLOQUANT', 'maintenance.plan_active: true sans maintenance.start_date ni maintenance.frequency');
    }
  }

  // C-16 — mediateur B2C (SHOULD, verification manuelle Noah)
  if (!str(l.mediator_name)) {
    add('C-16', 'SHOULD', 'Activite potentiellement B2C : legal.mediator_name recommande (obligation mediation) — verification manuelle Noah');
  }

  // C-17 — domaine requis au build (BLOQUANT)
  if (!str(s.domain) || !FORMATS.domain.test(s.domain)) {
    add('C-17', 'BLOQUANT', 'seo.domain absent ou invalide (canonical, sitemap.xml, Open Graph)');
  }

  // C-18 — derivation phone_intl (jamais une erreur)
  // (implementee dans deriveClientData)

  return rules;
}

/* ---------------------------------------------------------------- */
/* Evaluation REQUIRED / SHOULD / COULD                              */
/* ---------------------------------------------------------------- */

function evaluateLevels(data) {
  const blocking = [];
  const recommended = [];
  const optional = [];
  let validCount = 0;
  let total = 0;

  for (const field of FIELDS) {
    total += 1;
    const value = getPath(data, field.path);

    if (isEmptyValue(value)) {
      const entry = { path: field.path, label: field.label, current: '(vide)', action: field.action };
      if (field.level === 'REQUIRED') blocking.push({ ...entry, kind: 'REQUIRED' });
      else if (field.level === 'SHOULD') recommended.push(entry);
      else optional.push(entry);
      continue;
    }

    // Valeur presente : la valider (type/format/enum/length)
    const { issues } = validateOneField(field, value);
    if (issues.length > 0) {
      blocking.push({ path: field.path, label: field.label, current: JSON.stringify(value).slice(0, 60), action: issues[0], kind: 'FORMAT' });
      continue;
    }
    validCount += 1;
  }

  return { blocking, recommended, optional, validCount, total };
}

function validateOneField(field, value) {
  const issues = [];
  const expected = field.type;
  const actual = typeOf(value);
  if (expected === 'number') {
    if (typeof value !== 'number' || Number.isNaN(value)) issues.push(`Type attendu : nombre, recu : ${actual}`);
  } else if (expected === 'boolean') {
    if (typeof value !== 'boolean') issues.push(`Type attendu : booleen, recu : ${actual}`);
  } else if (expected === 'array') {
    if (!Array.isArray(value)) issues.push(`Type attendu : liste, recu : ${actual}`);
  } else if (typeof value !== 'string') {
    // lat/lng acceptent les nombres (JSON-LD natif) ; stringifie pour le format
    const numericFormat = field.format === 'lat' || field.format === 'lng';
    if (!(typeof value === 'number' && !Number.isNaN(value) && numericFormat)) {
      issues.push(`Type attendu : texte, recu : ${actual}`);
    }
  }
  if (field.format && FORMATS[field.format]) {
    const candidate = typeof value === 'number' ? String(value) : value;
    if (typeof candidate === 'string' && !FORMATS[field.format].test(candidate.trim())) {
      issues.push(`Format invalide (${field.format})`);
    }
  }
  if (field.enum && typeof value === 'string' && !field.enum.includes(value)) {
    issues.push(`Valeur invalide : "${value}" (autorise : ${field.enum.join(', ')})`);
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    const len = value.length;
    if (field.min != null && len < field.min) issues.push(`Trop court (min ${field.min}, actuel ${len})`);
    if (field.max != null && len > field.max) issues.push(`Trop long (max ${field.max}, actuel ${len})`);
  }
  return { issues };
}

/** Verifications supplementaires sur les items de listes (services, menu, reviews). */
function validateArrayItems(data, blocking, recommended) {
  const services = Array.isArray(data.services) ? data.services : [];
  services.forEach((srv, i) => {
    if (!srv || typeof srv !== 'object') {
      blocking.push({ path: `services[${i}]`, label: 'Service', current: '(invalide)', action: 'Entree de service structuree attendue', kind: 'FORMAT' });
      return;
    }
    const name = str(srv.name);
    if (!name) {
      blocking.push({ path: `services[${i}].name`, label: 'Nom du service', current: '(vide)', action: 'Fournir le nom du service (2-60 caracteres)', kind: 'REQUIRED' });
    } else if (name.length < 2 || name.length > 60) {
      blocking.push({ path: `services[${i}].name`, label: 'Nom du service', current: name, action: `Longueur invalide (${name.length} caracteres, attendu 2-60)`, kind: 'FORMAT' });
    }
  });

  const items = Array.isArray(data.reviews?.items) ? data.reviews.items : [];
  items.forEach((item, i) => {
    if (!item || typeof item !== 'object') {
      blocking.push({ path: `reviews.items[${i}]`, label: 'Avis', current: '(invalide)', action: 'Entree d avis structuree attendue', kind: 'FORMAT' });
      return;
    }
    if (!str(item.text) || !str(item.name)) {
      blocking.push({ path: `reviews.items[${i}]`, label: 'Avis', current: '(incomplet)', action: 'Avis avec texte et nom requis', kind: 'REQUIRED' });
    }
  });
}

/* ---------------------------------------------------------------- */
/* Derivation (CLIENT_DATA_VALIDATION.md §5.1)                       */
/* ---------------------------------------------------------------- */

export function deriveClientData(data) {
  const out = JSON.parse(JSON.stringify(data || {}));
  const contact = (out.contact ||= {});
  const address = (contact.address ||= {});
  const map = (contact.map ||= {});
  const seo = (out.seo ||= {});
  const legal = (out.legal ||= {});

  if (!str(address.full) && str(address.street) && str(address.postal_code) && str(address.city)) {
    address.full = `${address.street}, ${address.postal_code} ${address.city}`;
  }
  if (!str(contact.phone_intl) && str(contact.phone)) {
    // C-18 : "0X..." -> "+33 X XX XX XX XX" (suppression des separateurs)
    const digits = contact.phone.replace(/[\s.-]/g, '');
    if (/^0[1-9]\d{8}$/.test(digits)) {
      contact.phone_intl = `+33 ${digits.slice(1, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
    }
  }
  if (!str(seo.region)) seo.region = 'Auvergne-Rhone-Alpes';
  if (!str(seo.country)) seo.country = 'FR';
  if (map.zoom == null) map.zoom = 15;
  if (!str(out.template?.package)) {
    out.template ||= {};
    out.template.package = 'vitrine';
  }
  if (out.reviews && typeof out.reviews.enabled !== 'boolean') out.reviews.enabled = false;
  if (out.menu && typeof out.menu.enabled !== 'boolean') out.menu.enabled = false;
  if (out.reservation && typeof out.reservation.enabled !== 'boolean') out.reservation.enabled = false;
  if (out.maintenance && typeof out.maintenance.plan_active !== 'boolean') out.maintenance.plan_active = false;
  if (legal.legal_form === 'EI' && !str(legal.capital)) legal.capital = 'Sans objet (EI)';
  return out;
}

/* ---------------------------------------------------------------- */
/* Point d entree principal                                          */
/* ---------------------------------------------------------------- */

/**
 * Valide un objet client data (deja parse depuis le YAML).
 * @returns {{ code: number, result: object, data: object }}
 */
export function validateClientData(rawData) {
  const data = deriveClientData(rawData || {});

  const { blocking, recommended, optional, validCount, total } = evaluateLevels(data);
  validateArrayItems(data, blocking, recommended);
  const rules = crossFieldRules(data);

  for (const rule of rules) {
    if (rule.level === 'BLOQUANT') {
      blocking.push({ path: rule.rule, label: `Regle ${rule.rule}`, current: '(contrainte non satisfaite)', action: rule.detail, kind: 'RULE' });
    } else if (rule.level === 'SHOULD') {
      recommended.push({ path: rule.rule, label: `Regle ${rule.rule}`, current: '(a verifier)', action: rule.detail });
    } else {
      optional.push({ path: rule.rule, label: `Regle ${rule.rule}`, current: '(info)', action: rule.detail });
    }
  }

  const formatIssues = blocking.filter((b) => b.kind === 'FORMAT');
  const missingRequired = blocking.filter((b) => b.kind === 'REQUIRED' || b.kind === 'RULE');
  const hasFormatError = formatIssues.length > 0;
  const hasMissingRequired = missingRequired.length > 0;

  let code = EXIT_OK;
  let status = 'OK';
  if (hasFormatError) {
    code = EXIT_FORMAT;
    status = 'ERREUR FORMAT';
  } else if (hasMissingRequired) {
    code = EXIT_REQUIRED;
    status = 'EN ATTENTE DE DONNEES';
  }

  const result = {
    status,
    code,
    blocking,
    recommended,
    optional,
    rules,
    validCount,
    total: total + rules.length,
    category: str(data.business?.category) || '—',
    package: str(data.template?.package) || '—',
  };

  return { code, result, data };
}

/* ---------------------------------------------------------------- */
/* Rapport markdown (CLIENT_DATA_VALIDATION.md §6.1)                 */
/* ---------------------------------------------------------------- */

function table(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`);
  return [head, sep, ...body].join('\n');
}

export function buildValidationReport({ slug, result, date }) {
  const d = date || new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push(`# Rapport de validation — client_data.yaml`);
  lines.push(`# Projet : ${slug}`);
  lines.push(`# Date : ${d}`);
  lines.push('');
  lines.push(`## RESULTAT : ${result.status}`);
  lines.push('');

  lines.push(`### Champs bloquants (${result.blocking.length})`);
  if (result.blocking.length) {
    lines.push(table(
      ['Champ', 'Valeur actuelle', 'Action requise'],
      result.blocking.map((b) => ['`' + b.path + '`', b.current || '(vide)', b.action]),
    ));
  } else {
    lines.push('_Aucun champ bloquant._');
  }
  lines.push('');

  lines.push(`### Champs recommandes (${result.recommended.length})`);
  if (result.recommended.length) {
    lines.push(table(
      ['Champ', 'Valeur actuelle', 'Action'],
      result.recommended.map((r) => ['`' + r.path + '`', r.current || '(vide)', r.action]),
    ));
  } else {
    lines.push('_Aucun champ recommande manquant._');
  }
  lines.push('');

  lines.push(`### Champs optionnels (${result.optional.length})`);
  if (result.optional.length) {
    lines.push(table(
      ['Champ', 'Valeur actuelle'],
      result.optional.map((o) => ['`' + o.path + '`', o.current || '(vide)']),
    ));
  } else {
    lines.push('_Aucun champ optionnel manquant._');
  }
  lines.push('');

  const rules = result.rules.filter((r) => r.level !== 'COULD');
  lines.push(`### Regles contextuelles (${rules.length})`);
  if (rules.length) {
    lines.push(table(
      ['Regle', 'Detail', 'Niveau'],
      rules.map((r) => [r.rule, r.detail, r.level]),
    ));
  } else {
    lines.push('_Aucune regle contextuelle violee._');
  }
  lines.push('');

  lines.push('### Resume');
  lines.push(`- NOMBRE DE CHAMPS VALIDES : ${result.validCount} / ${result.total}`);
  lines.push(`- SECTEUR : ${result.category}`);
  lines.push(`- PACKAGE : ${result.package}`);
  lines.push('');
  lines.push('## PROCHAINE ETAPE');
  lines.push('Remplir les champs bloquants puis relancer `npm run validate -- --client <slug>`.');
  return lines.join('\n');
}