/**
 * ───────────────────────────────────────────────────────────────
 *  PALACE LIQUOR — SITE SETTINGS
 *  Change a value here and it updates everywhere on the website.
 *
 *  • Anything written like "[PLACEHOLDER: ...]" still needs real info.
 *    Placeholders show on the site with a dashed underline so they're easy to spot.
 *  • Leave a link as "" (empty) to hide it completely.
 * ───────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Palace Liquor',
  legalName: 'Palace Liquor & Deli Shop',
  url: 'https://www.palaceliquorclawson.com',
  tagline: 'Fine wine, craft beer, allocated bourbon and cigars in Clawson, Michigan.',

  phone: '(248) 435-4888',
  /** Phone number in international format, used for tap-to-call links. */
  phoneE164: '+12484354888',
  email: 'palaceliquorclawson@gmail.com',

  address: {
    street: '650 W 14 Mile Rd',
    city: 'Clawson',
    state: 'MI',
    zip: '48017',
  },

  /**
   * Store hours, in 24-hour time ("21:00" = 9 PM). Michigan (Eastern) time.
   * Set closed: true for a day you're closed.
   */
  hours: [
    { day: 'Monday', open: '09:30', close: '22:00' },
    { day: 'Tuesday', open: '09:30', close: '22:00' },
    { day: 'Wednesday', open: '09:30', close: '22:00' },
    { day: 'Thursday', open: '09:30', close: '22:00' },
    { day: 'Friday', open: '09:30', close: '23:00' },
    { day: 'Saturday', open: '09:30', close: '23:00' },
    { day: 'Sunday', open: '11:00', close: '21:00' },
  ] as Hours[],
  /** Optional one-line note under the hours, e.g. "Holiday hours may vary." Leave "" to hide. */
  hoursNote: 'Holiday hours may vary. Call ahead to confirm.',

  doordashUrl: 'https://www.doordash.com/store/palace-liquor-&-deli-shop-2302588/',
  instagramUrl: 'https://www.instagram.com/palaceliquor_clawson/',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61576395013693',

  /** Opens straight to the "write a review" box on Google. */
  googleReviewUrl: 'https://g.page/r/CRHmJOZOCFw3EBM/review',

  /**
   * Formspree form addresses (see README → "Connecting the forms").
   * Replace the placeholder with the URL Formspree gives you, e.g. https://formspree.io/f/abcdwxyz
   */
  forms: {
    eventInquiry: 'https://formspree.io/f/[PLACEHOLDER-EVENT-FORM-ID]',
    rentalRequest: 'https://formspree.io/f/[PLACEHOLDER-RENTAL-FORM-ID]',
  },

  /** Show the "Now on the Shelf" section on the home page (items live in src/data/now-on-the-shelf.json). */
  showNowOnTheShelf: false,

  /** Free-ice offer on catering orders. */
  cateringOffer: {
    minimum: 250,
    text: 'Free 16 lb bag of Palace Ice with any catering order over $250.',
    mention: 'Mention this website when you order.',
  },
} as const;

export type Hours = { day: string; open: string; close: string; closed?: boolean };

// ─── Helpers (no need to edit below this line) ─────────────────

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;
export const telHref = `tel:${site.phoneE164}`;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.legalName}, ${fullAddress}`)}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${site.legalName}, ${fullAddress}`)}&output=embed`;

/** True for empty values and "[PLACEHOLDER ...]" text. */
export const isPlaceholder = (value?: string | null) => !value || value.includes('[PLACEHOLDER');

export const socialLinks = [
  { name: 'Instagram', icon: 'instagram', url: site.instagramUrl },
  { name: 'Facebook', icon: 'facebook', url: site.facebookUrl },
].filter((s) => !isPlaceholder(s.url));
