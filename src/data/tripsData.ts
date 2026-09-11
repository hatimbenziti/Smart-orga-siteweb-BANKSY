import { Trip, Review, FAQItem, TripThematique } from '../types';

export const VALID_THEMATIQUES: TripThematique[] = [
  'Nature & Randonnée',
  'Désert & Aventure',
  'Plage & Détente',
  'Montagne & Trekking',
  'Camping & Bivouac',
  'Culture & Patrimoine'
];

export interface CmsTripRaw {
  id?: string;
  title?: string;
  destination?: string;
  region?: TripThematique | string;
  thematique?: TripThematique | string;
  duration?: string;
  days?: number | string;
  nights?: number | string;
  price?: number | string;
  priceMAD?: number | string;
  originalPriceMAD?: number | string;
  rating?: number | string;
  reviewCount?: number | string;
  image?: string;
  imageUrl?: string;
  gallery?: string[];
  departureCities?: string[] | string;
  nextDate?: string;
  category?: 'popular' | 'weekly' | 'upcoming' | 'all';
  popular?: boolean;
  isPopular?: boolean;
  isWeekly?: boolean;
  isUpcoming?: boolean;
  highlights?: string[];
  points_forts?: string[];
  order?: number | string;
  priority?: number | string;
  program?: string;
  body?: string;
  itinerary?: {
    day: number;
    title: string;
    description: string;
  }[];
  included?: string[];
  excluded?: string[];
  notIncluded?: string[];
  cancellation_policy?: string;
  cancellationPolicy?: string;
  groupSize?: string;
  weather?: {
    temp: string;
    condition: string;
    conditionAr?: string;
    conditionEn?: string;
    dailyForecast?: {
      day: number;
      temp: string;
      condition: string;
      conditionAr?: string;
      conditionEn?: string;
    }[];
  };
}

/**
 * Parses simple YAML frontmatter from raw Markdown files created by Decap CMS
 */
function parseFrontmatter(raw: string): Record<string, any> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yamlContent = match[1];
  const result: Record<string, any> = {};

  yamlContent.split(/\r?\n/).forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (val === 'true') result[key] = true;
      else if (val === 'false') result[key] = false;
      else if (!isNaN(Number(val)) && val !== '') result[key] = Number(val);
      else result[key] = val;
    }
  });

  return result;
}

/**
 * Normalizes a raw CMS trip object into a fully-typed Trip
 */
function normalizeTrip(data: CmsTripRaw, slug: string, defaultOrder: number): (Trip & { order: number }) | null {
  if (!data || (!data.title && !data.destination)) return null;

  const title = data.title || 'Séjour Découverte au Maroc';
  const destination = data.destination || 'Maroc';
  
  // Validate and map region / thematique to one of the 6 canonical themes
  let region: TripThematique = 'Nature & Randonnée';
  const rawRegion = (data.region || data.thematique || '').trim();
  if (rawRegion) {
    if (VALID_THEMATIQUES.includes(rawRegion as TripThematique)) {
      region = rawRegion as TripThematique;
    } else {
      const regLower = rawRegion.toLowerCase();
      if (regLower.includes('bivouac') || regLower.includes('camp')) {
        region = 'Camping & Bivouac';
      } else if (regLower.includes('montagne') || regLower.includes('trek') || regLower.includes('toubkal') || regLower.includes('sommet')) {
        region = 'Montagne & Trekking';
      } else if (regLower.includes('plage') || regLower.includes('surf') || regLower.includes('détente') || regLower.includes('mer') || regLower.includes('côte')) {
        region = 'Plage & Détente';
      } else if (regLower.includes('ville') || regLower.includes('impérial') || regLower.includes('culture') || regLower.includes('patrimoine') || regLower.includes('médina')) {
        region = 'Culture & Patrimoine';
      } else if (regLower.includes('désert') || regLower.includes('desert') || regLower.includes('dune') || regLower.includes('erg') || regLower.includes('aventure')) {
        region = 'Désert & Aventure';
      } else if (regLower.includes('nature') || regLower.includes('rando') || regLower.includes('cascade') || regLower.includes('vallée')) {
        region = 'Nature & Randonnée';
      } else {
        region = 'Nature & Randonnée';
      }
    }
  }

  const duration = data.duration || '3 jours / 2 nuits';
  const days = Number(data.days) || (duration.match(/(\d+)\s*j/i) ? parseInt(duration.match(/(\d+)\s*j/i)![1], 10) : 3);
  const nights = Number(data.nights) || (duration.match(/(\d+)\s*n/i) ? parseInt(duration.match(/(\d+)\s*n/i)![1], 10) : 2);
  const priceMAD = Number(data.priceMAD || data.price) || 990;
  const originalPriceMAD = data.originalPriceMAD ? Number(data.originalPriceMAD) : undefined;
  const image = data.image || data.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
  const rawGallery = Array.isArray(data.gallery)
    ? data.gallery
        .map((item: any) => {
          if (typeof item === 'string') return item.trim();
          if (item && typeof item === 'object') return (item.image || item.photo || item.url || '').trim();
          return '';
        })
        .filter(Boolean)
    : [];
  const gallery = rawGallery.length > 0 ? rawGallery : [image];

  const highlights = Array.isArray(data.highlights) && data.highlights.length > 0
    ? data.highlights
    : (Array.isArray(data.points_forts) && data.points_forts.length > 0
        ? data.points_forts
        : ['Transport touristique climatisé grand confort', 'Hébergement de charme avec petit-déjeuner', 'Accompagnement professionnel Smart Orga']);

  const isPopular = data.popular !== undefined
    ? Boolean(data.popular)
    : (data.isPopular !== undefined ? Boolean(data.isPopular) : (data.category === 'popular'));

  const isWeekly = data.isWeekly !== undefined
    ? Boolean(data.isWeekly)
    : (data.category === 'weekly');

  const isUpcoming = data.isUpcoming !== undefined
    ? Boolean(data.isUpcoming)
    : (data.category === 'upcoming');

  const category = (data.category as 'popular' | 'weekly' | 'upcoming' | 'all') || (isPopular ? 'popular' : 'all');

  const order = typeof data.order === 'number'
    ? data.order
    : (typeof data.priority === 'number'
        ? data.priority
        : (Number(data.order || data.priority) || defaultOrder));

  const rating = Number(data.rating) || 4.9;
  const reviewCount = Number(data.reviewCount) || 120;

  const departureCities = Array.isArray(data.departureCities)
    ? data.departureCities.map((c) => String(c).trim()).filter(Boolean)
    : (typeof data.departureCities === 'string'
        ? data.departureCities.split(',').map((c) => c.trim()).filter(Boolean)
        : ['Casablanca', 'Rabat']);

  const nextDate = data.nextDate || 'Départs réguliers';

  const itinerary = Array.isArray(data.itinerary) && data.itinerary.length > 0
    ? data.itinerary
    : [
        {
          day: 1,
          title: 'Départ & Première Immersion',
          description: data.body || 'Accueil des voyageurs, départ tout confort et première journée d\'exploration.'
        },
        {
          day: 2,
          title: 'Aventures & Découvertes',
          description: 'Activités encadrées, paysages emblématiques et soirée conviviale.'
        },
        {
          day: 3,
          title: 'Derniers Instants & Voyage Retour',
          description: 'Matinée libre pour photos et souvenirs, puis route retour vers les villes de départ.'
        }
      ];

  const defaultIncluded = [
    'Transport touristique tout confort climatisé A/R',
    'Hébergement en demi-pension ou formule adaptée',
    'Accompagnateur dédié & assistance 24h/24 Smart Orga'
  ];

  const included = Array.isArray(data.included) && data.included.length > 0
    ? data.included
    : defaultIncluded;

  const defaultExcluded = [
    'Déjeuners libres en cours de route',
    'Boissons et dépenses personnelles'
  ];

  const excluded = Array.isArray(data.excluded) && data.excluded.length > 0
    ? data.excluded
    : (Array.isArray(data.notIncluded) && data.notIncluded.length > 0
        ? data.notIncluded
        : defaultExcluded);

  const notIncluded = excluded;

  const defaultCancellationPolicy = `Politique d'annulation
Pour toute annulation effectuée plus de 15 jours avant la date du départ, le remboursement est total (100 %).

Pour toute annulation effectuée entre 7 et 15 jours avant le départ, un remboursement de 50 % du montant versé sera effectué.

Pour toute annulation ou réservation effectuée moins de 7 jours avant le départ, aucun remboursement ne sera possible.

En cas d’annulation par l’organisateur, le montant total sera remboursé au participant.`;

  const cancellation_policy = (data.cancellation_policy || data.cancellationPolicy || '').trim() || defaultCancellationPolicy;
  const cancellationPolicy = cancellation_policy;

  const groupSize = data.groupSize || '14 à 22 personnes';
  const program = data.program || data.body || '';
  const body = data.body || data.program || '';

  const weather = data.weather || {
    temp: '25°C',
    condition: 'Ensoleillé & Ciel pur',
    conditionAr: 'مشمس وسماء صافية',
    conditionEn: 'Sunny & Clear Sky'
  };

  return {
    id: data.id || slug,
    title,
    destination,
    region,
    duration,
    days,
    nights,
    priceMAD,
    originalPriceMAD,
    rating,
    reviewCount,
    image,
    gallery,
    departureCities,
    nextDate,
    category,
    isPopular,
    isWeekly,
    isUpcoming,
    highlights,
    program,
    body,
    itinerary,
    included,
    excluded,
    notIncluded,
    cancellation_policy,
    cancellationPolicy,
    groupSize,
    weather,
    order
  };
}

/**
 * Dynamically loads all voyages from Decap CMS content/voyages/*.{json,md}
 */
export function loadCmsTrips(): Trip[] {
  const loadedList: (Trip & { order: number })[] = [];

  // 1. Dynamic import of all JSON files in content/voyages
  const jsonModules = import.meta.glob<Record<string, any>>('/content/voyages/*.json', { eager: true });
  Object.entries(jsonModules).forEach(([path, mod], idx) => {
    const data = ((mod as { default?: CmsTripRaw }).default || mod) as CmsTripRaw;
    const slug = path.split('/').pop()?.replace(/\.json$/, '') || `trip-${idx}`;
    const trip = normalizeTrip(data, slug, idx + 1);
    if (trip) {
      loadedList.push(trip);
    }
  });

  // 2. Dynamic import of any Markdown files in content/voyages
  const mdModules = import.meta.glob<string>('/content/voyages/*.md', { eager: true, query: '?raw', import: 'default' });
  Object.entries(mdModules).forEach(([path, rawContent], idx) => {
    const data = parseFrontmatter(rawContent) as CmsTripRaw;
    const slug = path.split('/').pop()?.replace(/\.md$/, '') || `trip-md-${idx}`;
    const trip = normalizeTrip(data, slug, idx + 100);
    if (trip) {
      loadedList.push(trip);
    }
  });

  // Sort strictly by the order/priority defined in Decap CMS
  if (loadedList.length > 0) {
    loadedList.sort((a, b) => a.order - b.order);
    return loadedList.map(({ order, ...rest }) => rest as Trip);
  }

  return [];
}

/**
 * TRIPS_DATA is dynamically loaded from Decap CMS content/voyages
 */
export const TRIPS_DATA: Trip[] = loadCmsTrips();

export const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    title: 'Merzouga & Erg Chebbi',
    tag: 'Désert Magique',
    subtitle: 'Bivouac étoilé & balade en dromadaire'
  },
  {
    image: 'https://images.unsplash.com/photo-1558252277-246a06eb5535?auto=format&fit=crop&w=1200&q=80',
    title: 'Chefchaouen & Le Rif',
    tag: 'Perle Bleue',
    subtitle: 'Ruelles féeriques & coucher de soleil panoramique'
  },
  {
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    title: 'Dakhla & La Dune Blanche',
    tag: 'Sahara Océanique',
    subtitle: 'Lagon turquoise & aventure 4x4 sauvage'
  },
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    title: 'Taghazout & Paradise Valley',
    tag: 'Plage & Nature',
    subtitle: 'Surf vibes, piscines naturelles & soleil infini'
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: 'rev-1',
    name: 'Youssef El Amrani',
    city: 'Casablanca',
    tripTitle: 'Désert de Merzouga VIP',
    rating: 5,
    date: 'Il y a 2 semaines',
    comment: 'Une organisation millimétrée ! Les chauffeurs étaient très prudents, le bivouac à Merzouga était digne d\'un hôtel 5 étoiles avec eau chaude et douches privées. L\'ambiance au coin du feu avec le groupe restera gravée dans ma mémoire. Merci Smart Orga !',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-2',
    name: 'Sara Benkirane',
    city: 'Rabat',
    tripTitle: 'Chefchaouen & Tanger',
    rating: 5,
    date: 'Il y a 3 semaines',
    comment: 'C\'était mon premier voyage en solo avec un groupe organisé et j\'avais quelques appréhensions. Dès la première heure, l\'équipe nous a mis à l\'aise. J\'ai rencontré des amis géniaux et les photos de Chefchaouen sont magnifiques !',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-3',
    name: 'Mehdi & Salma Tazi',
    city: 'Marrakech',
    tripTitle: 'Échappée Dakhla',
    rating: 5,
    date: 'Le mois dernier',
    comment: 'La Dune Blanche et les huîtres fraîches face au lagon : un pur bonheur. Le rapport qualité/prix est imbattable et la communication sur WhatsApp était instantanée avant et pendant le séjour. On repart avec vous à Ouzoud bientôt.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

/**
 * Dynamically loads all FAQ items from Decap CMS content/faq/*.{json,md}
 */
export function loadCmsFaq(): FAQItem[] {
  const list: (FAQItem & { order: number })[] = [];

  // 1. Dynamic import of all JSON files in content/faq
  const jsonModules = import.meta.glob<Record<string, any>>('/content/faq/*.json', { eager: true });
  Object.entries(jsonModules).forEach(([path, mod], idx) => {
    const data = ((mod as { default?: Record<string, any> }).default || mod) as Record<string, any>;
    const slug = path.split('/').pop()?.replace(/\.json$/, '') || `faq-${idx}`;
    if (data && (data.question || data.q)) {
      list.push({
        id: slug,
        question: data.question || data.q || '',
        answer: data.answer || data.a || data.body || '',
        questionAr: data.questionAr || data.qAr,
        answerAr: data.answerAr || data.aAr,
        questionEn: data.questionEn || data.qEn,
        answerEn: data.answerEn || data.aEn,
        category: data.category || 'Réservation',
        order: typeof data.order === 'number' ? data.order : idx + 1
      });
    }
  });

  // 2. Dynamic import of any Markdown files in content/faq
  const mdModules = import.meta.glob<string>('/content/faq/*.md', { eager: true, query: '?raw', import: 'default' });
  Object.entries(mdModules).forEach(([path, rawContent], idx) => {
    const data = parseFrontmatter(rawContent);
    const slug = path.split('/').pop()?.replace(/\.md$/, '') || `faq-md-${idx}`;
    if (data && (data.question || data.title)) {
      list.push({
        id: slug,
        question: data.question || data.title || '',
        answer: data.body || data.answer || '',
        questionAr: data.questionAr,
        answerAr: data.answerAr,
        questionEn: data.questionEn,
        answerEn: data.answerEn,
        category: data.category || 'Réservation',
        order: typeof data.order === 'number' ? data.order : 100 + idx
      });
    }
  });

  list.sort((a, b) => a.order - b.order);
  return list.map(({ order: _ord, ...item }) => item);
}

/**
 * FAQ_DATA is dynamically loaded from Decap CMS content/faq
 */
export const FAQ_DATA: FAQItem[] = loadCmsFaq();

export const WHATSAPP_NUMBER = '212690060366'; // Format international marocain (+212 690-060366)
export const WHATSAPP_DISPLAY = '+212 690-060366';
export const AGENCY_EMAIL = 'smartorga.travel@gmail.com';
export const AGENCY_ADDRESS = 'Casablanca / Rabat, Maroc';
