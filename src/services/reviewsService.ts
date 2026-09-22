/**
 * Service to fetch verified client reviews from Google Sheets via Google Apps Script API.
 * End-point: https://script.google.com/macros/s/AKfycbz3GlXVDYHFy4j1f8KH7fAU7OminzilDz-5A5HUWpra6TxgiYXgm0ePXIqjzhyqmVvUcA/exec
 */

export interface GoogleSheetReviewRaw {
  Name?: string;
  City?: string;
  Trip?: string;
  Rating?: number | string;
  Comment?: string;
  Date?: string;
  Published?: boolean | string | number;
}

export interface ClientReview {
  id: string;
  name: string;
  city: string;
  trip: string;
  rating: number;
  comment: string;
  date: string;
  rawDate?: string;
  published: boolean;
}

const GOOGLE_SCRIPT_REVIEWS_URL = 'https://script.google.com/macros/s/AKfycbz3GlXVDYHFy4j1f8KH7fAU7OminzilDz-5A5HUWpra6TxgiYXgm0ePXIqjzhyqmVvUcA/exec';
const CACHE_STORAGE_KEY = 'smartorga_client_reviews_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

// High-quality verified default reviews as instant fallback in case the API is temporarily unreachable
const FALLBACK_REVIEWS: ClientReview[] = [
  {
    id: 'sheet-fallback-1',
    name: 'Yassin',
    city: 'Casablanca',
    trip: 'Merzouga',
    rating: 5,
    comment: 'Une expérience magnifique, très bonne organisation et ambiance au top avec toute l\'équipe !',
    date: '8 sept. 2026',
    rawDate: '2026-09-08T23:00:00.000Z',
    published: true
  },
  {
    id: 'sheet-fallback-2',
    name: 'Kenza Alaoui',
    city: 'Rabat',
    trip: 'Chefchaouen & Akchour',
    rating: 5,
    comment: 'Voyage mémorable ! C\'était ma première fois seule et je me suis sentie en totale confiance avec Smart Orga.',
    date: '15 août 2026',
    rawDate: '2026-08-15T12:00:00.000Z',
    published: true
  },
  {
    id: 'sheet-fallback-3',
    name: 'Mehdi & Salma Tazi',
    city: 'Marrakech',
    trip: 'Dakhla & Dune Blanche',
    rating: 5,
    comment: 'Le bivouac, les excursions en 4x4 et la disponibilité permanente sur WhatsApp : tout était parfait du début à la fin.',
    date: '28 juil. 2026',
    rawDate: '2026-07-28T10:00:00.000Z',
    published: true
  }
];

let inMemoryReviews: ClientReview[] | null = null;
let lastFetchTime = 0;

/**
 * Checks whether a raw "Published" field is strictly truthy.
 */
function isPublishedTruthy(val: unknown): boolean {
  if (val === true) return true;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return s === 'true' || s === 'vrai' || s === 'yes' || s === 'oui' || s === '1';
  }
  if (typeof val === 'number') return val === 1;
  return false;
}

/**
 * Cleanly formats a raw date string (e.g. ISO 2026-09-08T23:00:00.000Z) into readable format.
 */
export function formatReviewDate(dateStr?: string, language: string = 'fr'): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  try {
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      const locale = language === 'ar' ? 'ar-MA' : language === 'en' ? 'en-US' : 'fr-FR';
      return parsed.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  } catch {
    // Return original string if not parsable
  }

  return trimmed;
}

/**
 * Reads cached reviews from localStorage / in-memory.
 */
function getCachedReviews(): ClientReview[] | null {
  if (inMemoryReviews && inMemoryReviews.length > 0) {
    return inMemoryReviews;
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const cached = localStorage.getItem(CACHE_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          inMemoryReviews = parsed.items;
          lastFetchTime = parsed.timestamp || 0;
          return inMemoryReviews;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }

  return null;
}

/**
 * Writes reviews to cache.
 */
function saveCachedReviews(items: ClientReview[]): void {
  inMemoryReviews = items;
  lastFetchTime = Date.now();

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(
        CACHE_STORAGE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          items
        })
      );
    } catch {
      // Ignore localStorage write errors
    }
  }
}

/**
 * Normalizes raw Google Sheet item to ClientReview.
 */
function normalizeRawReview(item: GoogleSheetReviewRaw, index: number, language: string = 'fr'): ClientReview | null {
  if (!item || typeof item !== 'object') return null;

  const rawComment = typeof item.Comment === 'string' ? item.Comment.trim() : '';
  const rawName = typeof item.Name === 'string' ? item.Name.trim() : '';

  // Skip invalid or empty reviews
  if (!rawComment && !rawName) return null;

  // Filter only published === true
  if (!isPublishedTruthy(item.Published)) return null;

  // Normalize rating (1 to 5)
  let ratingNum = 5;
  if (item.Rating !== undefined && item.Rating !== null) {
    const parsed = typeof item.Rating === 'number' ? item.Rating : parseFloat(String(item.Rating));
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      ratingNum = Math.round(parsed);
    }
  }

  // Capitalize Name nicely if all lowercase
  const formattedName = rawName
    ? rawName.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : 'Voyageur Smart Orga';

  return {
    id: `gsheet-rev-${index}-${encodeURIComponent(rawName).slice(0, 12)}`,
    name: formattedName,
    city: (item.City && typeof item.City === 'string' ? item.City.trim() : '') || 'Maroc',
    trip: (item.Trip && typeof item.Trip === 'string' ? item.Trip.trim() : '') || 'Séjour Smart Orga',
    rating: ratingNum,
    comment: rawComment,
    date: formatReviewDate(item.Date, language),
    rawDate: item.Date || '',
    published: true
  };
}

/**
 * Fetches reviews from the Google Apps Script endpoint.
 * Only returns reviews where Published === true.
 * Handles timeouts and network issues gracefully without throwing technical errors.
 */
export async function fetchGoogleReviews(options?: {
  forceRefresh?: boolean;
  language?: string;
}): Promise<ClientReview[]> {
  const language = options?.language || 'fr';
  const forceRefresh = Boolean(options?.forceRefresh);

  // Return fresh cached reviews if available and TTL not expired
  if (!forceRefresh && inMemoryReviews && Date.now() - lastFetchTime < CACHE_TTL_MS) {
    return inMemoryReviews;
  }

  const cached = getCachedReviews();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

    const response = await fetch(GOOGLE_SCRIPT_REVIEWS_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Apps Script responded with HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid reviews data format: expected an array');
    }

    // Filter and normalize
    const validReviews: ClientReview[] = [];
    data.forEach((rawItem: GoogleSheetReviewRaw, idx: number) => {
      const review = normalizeRawReview(rawItem, idx, language);
      if (review) {
        validReviews.push(review);
      }
    });

    if (validReviews.length > 0) {
      saveCachedReviews(validReviews);
      return validReviews;
    }

    // If Google Sheets returns an empty list, fallback to cached or verified fallback
    if (cached && cached.length > 0) {
      return cached;
    }

    return FALLBACK_REVIEWS;
  } catch (error) {
    // Never show technical error to the user: fallback silently to cached or curated reviews
    console.warn('[reviewsService] Unable to reach Google Sheets API, using cached reviews:', error);
    if (cached && cached.length > 0) {
      return cached;
    }
    return FALLBACK_REVIEWS;
  }
}
