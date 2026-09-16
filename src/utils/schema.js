/**
 * utils/schema.js — Generateurs JSON-LD schema.org
 * Reference : project/content/SEO_SYSTEM.md §3
 */
import { buildOpeningHoursSchema } from './hours.js';

/**
 * Schema LocalBusiness (base commune pour tous les templates).
 * @param {object} client - data.client complet
 * @param {string} siteUrl
 * @returns {object}
 */
export function localBusiness(client, siteUrl) {
  const b = client.business || {};
  const c = client.contact || {};
  const s = client.seo || {};
  const socials = client.socials || {};

  const sameAs = [
    socials.facebook,
    socials.instagram,
    socials.tripadvisor,
    socials.google_business,
    socials.linkedin,
    socials.youtube,
    socials.tiktok,
  ].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: b.name || '',
    description: b.description || '',
    url: siteUrl || '',
    telephone: c.phone_intl || c.phone || '',
    email: c.email || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.address?.street || '',
      addressLocality: c.address?.city || '',
      postalCode: c.address?.postal_code || '',
      addressCountry: 'FR',
    },
  };

  if (c.map?.lat && c.map?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(c.map.lat),
      longitude: parseFloat(c.map.lng),
    };
  }

  if (client.opening_hours?.enabled && client.opening_hours?.schedule) {
    schema.openingHoursSpecification = buildOpeningHoursSchema(client.opening_hours.schedule);
  }

  if (s.city) {
    schema.areaServed = { '@type': 'City', name: s.city };
  }

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

/**
 * Schema Restaurant (extension de LocalBusiness, SEO_SYSTEM.md §3.3).
 */
export function restaurant(client, siteUrl) {
  const base = localBusiness(client, siteUrl);
  base['@type'] = 'Restaurant';
  base.acceptsReservations = client.reservation?.enabled ? 'true' : 'false';

  if (client.menu?.enabled && client.menu?.categories) {
    base.hasMenu = buildMenuSchema(client.menu.categories);
  }

  // AggregateRating (avis reels uniquement, D-CS-06)
  if (client.reviews?.enabled && client.reviews?.aggregate_rating) {
    base.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: client.reviews.aggregate_rating.value,
      reviewCount: client.reviews.aggregate_rating.count,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return base;
}

/**
 * Schema Menu (Restaurant).
 */
export function buildMenuSchema(categories) {
  return {
    '@type': 'Menu',
    name: 'La Carte',
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.name || '',
      hasMenuItem: (cat.items || []).map((item) => ({
        '@type': 'MenuItem',
        name: item.name || '',
        description: item.description || '',
        offers: item.price
          ? {
              '@type': 'Offer',
              price: item.price,
              priceCurrency: 'EUR',
            }
          : undefined,
      })),
    })),
  };
}

/**
 * Schema FAQPage (SEO_SYSTEM.md §3.6).
 */
export function faqSchema(questions) {
  if (!questions || questions.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.q || q.question || '',
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.a || q.answer || '',
      },
    })),
  };
}

/**
 * Schema BreadcrumbList (SEO_SYSTEM.md §3.7).
 */
export function breadcrumbSchema(items, siteUrl) {
  if (!items || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label || '',
      item: `${siteUrl}${item.path}`,
    })),
  };
}

/**
 * Schema ContactPoint (SEO_SYSTEM.md §3.8).
 */
export function contactPoint(client) {
  const c = client.contact || {};
  return {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: c.phone_intl || c.phone || '',
    email: c.email || '',
    availableLanguage: ['French'],
  };
}