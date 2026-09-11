import { Trip, Review, FAQItem } from '../types';

export interface CmsTripRaw {
  id?: string;
  title?: string;
  destination?: string;
  region?: 'Désert & Dunes' | 'Villes Impériales' | 'Nature & Randonnée' | 'Plages & Surf' | string;
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
  
  // Validate and map region
  let region: 'Désert & Dunes' | 'Villes Impériales' | 'Nature & Randonnée' | 'Plages & Surf' = 'Désert & Dunes';
  if (data.region) {
    const regLower = data.region.toLowerCase();
    if (regLower.includes('plage') || regLower.includes('surf')) region = 'Plages & Surf';
    else if (regLower.includes('ville') || regLower.includes('impérial')) region = 'Villes Impériales';
    else if (regLower.includes('nature') || regLower.includes('rando') || regLower.includes('montagne')) region = 'Nature & Randonnée';
    else if (regLower.includes('désert') || regLower.includes('desert') || regLower.includes('dune')) region = 'Désert & Dunes';
  }

  const duration = data.duration || '3 jours / 2 nuits';
  const days = Number(data.days) || (duration.match(/(\d+)\s*j/i) ? parseInt(duration.match(/(\d+)\s*j/i)![1], 10) : 3);
  const nights = Number(data.nights) || (duration.match(/(\d+)\s*n/i) ? parseInt(duration.match(/(\d+)\s*n/i)![1], 10) : 2);
  const priceMAD = Number(data.priceMAD || data.price) || 990;
  const originalPriceMAD = data.originalPriceMAD ? Number(data.originalPriceMAD) : undefined;
  const image = data.image || data.imageUrl || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
  const gallery = Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery : [image];

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

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Comment réserver un séjour avec Smart Orga ?',
    answer: 'C\'est très simple et rapide ! Il vous suffit de cliquer sur le bouton "Réserver sur WhatsApp" de votre voyage favori. Un message pré-rempli avec les détails du voyage sera envoyé à nos conseillers qui vérifieront la disponibilité et finaliseront votre réservation instantanément.',
    category: 'Réservation'
  },
  {
    question: 'Quelles sont les modalités de paiement des arrhes ?',
    answer: 'Pour garantir votre place dans le groupe, un acompte de 30% à 50% est demandé par virement bancaire sécurisé (Attijariwafa, CIH Bank, BCP) ou versement en agence. Le reliquat est réglé en espèces ou virement le jour du départ.',
    category: 'Réservation'
  },
  {
    question: 'Quelles sont les villes de départ disponibles ?',
    answer: 'Nos principaux points de départ sont Casablanca (gare Casa Voyageurs) et Rabat (gare Rabat Ville). Pour certains séjours comme le désert ou le nord, nous effectuons également des ramassages à Marrakech, Kénitra, Tanger ou Meknès.',
    category: 'Transport & Hébergement'
  },
  {
    question: 'Le transport touristique et le logement sont-ils inclus ?',
    answer: 'Absolument ! Tous nos séjours comprennent le transport en autocars ou minibus touristiques récents, tout confort et climatisés, ainsi que les nuitées en hôtels de charme ou bivouacs confortablement équipés.',
    category: 'Transport & Hébergement'
  },
  {
    question: 'Puis-je voyager seul(e) et intégrer un groupe ?',
    answer: 'Tout à fait ! Près de 45% de nos participants voyagent seuls pour faire de nouvelles rencontres dans une ambiance saine, chaleureuse et sécurisée. Vous partagerez une chambre twin avec un voyageur du même sexe, ou opterez pour une chambre single en supplément.',
    category: 'Sur place'
  },
  {
    question: 'Que se passe-t-il en cas d\'imprévu ou d\'annulation ?',
    answer: 'Si vous nous prévenez au moins 7 jours avant la date du départ, votre acompte est soit remboursé intégralement (hors frais bancaires), soit reporté sans aucuns frais sur un voyage ultérieur de votre choix valable pendant 12 mois.',
    category: 'Réservation'
  }
];

export const WHATSAPP_NUMBER = '212690060366'; // Format international marocain (+212 690-060366)
export const WHATSAPP_DISPLAY = '+212 690-060366';
export const AGENCY_EMAIL = 'smartorga.travel@gmail.com';
export const AGENCY_ADDRESS = 'Casablanca / Rabat, Maroc';
