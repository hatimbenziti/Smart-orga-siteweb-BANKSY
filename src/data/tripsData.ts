import { Trip, Review, FAQItem, TripThematique } from '../types';
import voyagesMeta from './voyagesMeta.json';
import orderConfig from '@/content/settings/order.json';

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
  ville_destination?: string;
  villeDestination?: string;
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
  date_type?: string;
  dateType?: string;
  exact_date?: string;
  exactDate?: string;
  fixedDate?: string;
  date_fixe?: string;
  recurring_day?: string;
  recurringDay?: string;
  dateText?: string;
  date_text?: string;
  displayDate?: string;
  display_date?: string;
  customDate?: string;
  custom_date?: string;
  nextDate?: string;
  categories?: any;
  category?: string;
  popular?: boolean;
  isPopular?: boolean;
  isWeekly?: boolean;
  isUpcoming?: boolean;
  archived?: boolean;
  highlights?: string[];
  points_forts?: string[];
  ordre?: number | string;
  order?: number | string;
  priority?: number | string;
  date?: string;
  createdAt?: string;
  created_at?: string;
  date_created?: string;
  updatedAt?: string;
  updated_at?: string;
  _mtime?: number;
  _fileDate?: string;
  program?: string;
  body?: string;
  itinerary?: {
    day: number;
    title: string;
    description: string;
  }[];
  included?: any;
  prix_comprend?: any;
  inclus?: any;
  excluded?: any;
  notIncluded?: any;
  prix_ne_comprend_pas?: any;
  non_inclus?: any;
  cancellation_policy?: string;
  cancellationPolicy?: string;
  groupSize?: string;
  seo_title?: string;
  seo_description?: string;
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

function inferSingleDestinationCity(data: CmsTripRaw, slug: string): string {
  const explicit = (data.ville_destination || data.villeDestination || '').trim();
  if (explicit) return explicit;

  const text = `${slug} ${data.id || ''} ${data.destination || ''} ${data.title || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (text.includes('taghazout')) return 'Taghazout';
  if (text.includes('dakhla')) return 'Dakhla';
  if (text.includes('merzouga') || text.includes('desert') || text.includes('erg chebbi')) return 'Merzouga';
  if (text.includes('chefchaouen') || text.includes('chaouen')) return 'Chefchaouen';
  if (text.includes('imlil') || text.includes('toubkal')) return 'Imlil';
  if (text.includes('ouzoud') || text.includes('bin el ouidane')) return 'Ouzoud';
  if (text.includes('ouarzazate') || text.includes('zagora') || text.includes('draa')) return 'Ouarzazate';
  if (text.includes('agafay')) return 'Agafay';
  if (text.includes('marrakech')) return 'Marrakech';
  if (text.includes('agadir')) return 'Agadir';
  if (text.includes('tanger')) return 'Tanger';
  if (text.includes('essaouira')) return 'Essaouira';
  if (text.includes('fes')) return 'Fès';

  return (data.destination || 'Taghazout').split('&')[0].split('-')[0].trim();
}

/**
 * Normalizes a raw CMS trip object into a fully-typed Trip
 */
function normalizeTrip(data: CmsTripRaw, slug: string, defaultOrder: number): (Trip & { order: number }) | null {
  if (!data || (!data.title && !data.destination)) return null;

  const title = data.title || 'Séjour Découverte au Maroc';
  const destination = data.destination || 'Maroc';
  const ville_destination = inferSingleDestinationCity(data, slug);
  
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

  // Parse categories with retrocompatibility
  const rawCategories = data.categories !== undefined
    ? data.categories
    : (data.category !== undefined ? data.category : []);

  const parsedCategories: string[] = [];
  const addCategory = (val: any) => {
    if (!val) return;
    if (typeof val === 'string') {
      const clean = val.trim().toLowerCase();
      if (clean && !parsedCategories.includes(clean)) {
        parsedCategories.push(clean);
      }
    } else if (typeof val === 'object') {
      // Decap CMS widget: list with field: { name: 'category' }
      const itemVal = val.category || val.name || val.value || val.item || val.label;
      if (itemVal && typeof itemVal === 'string') {
        const clean = itemVal.trim().toLowerCase();
        if (clean && !parsedCategories.includes(clean)) {
          parsedCategories.push(clean);
        }
      }
    }
  };

  if (Array.isArray(rawCategories)) {
    rawCategories.forEach(addCategory);
  } else if (typeof rawCategories === 'string') {
    rawCategories.split(',').forEach(addCategory);
  }

  // Retrocompatibility if single category string was provided
  if (data.category && typeof data.category === 'string') {
    addCategory(data.category);
  }

  // If popular boolean flag is set, ensure 'populaire' is in categories
  if (data.popular === true || data.isPopular === true) {
    if (!parsedCategories.includes('populaire')) {
      parsedCategories.push('populaire');
    }
  }

  const isPopular = data.popular !== undefined
    ? Boolean(data.popular)
    : (data.isPopular !== undefined ? Boolean(data.isPopular) : (parsedCategories.includes('populaire') || parsedCategories.includes('popular')));

  const isWeekly = data.isWeekly !== undefined
    ? Boolean(data.isWeekly)
    : (parsedCategories.includes('weekly'));

  const isUpcoming = data.isUpcoming !== undefined
    ? Boolean(data.isUpcoming)
    : (parsedCategories.includes('upcoming'));

  const category = parsedCategories[0] || (isPopular ? 'populaire' : 'all');
  const categories = parsedCategories;

  const rawOrdre = data.order !== undefined ? data.order : data.ordre;
  const rawPriority = data.priority;
  const parsedNum = rawOrdre !== undefined && rawOrdre !== null && String(rawOrdre).trim() !== ''
    ? Number(rawOrdre)
    : (rawPriority !== undefined && rawPriority !== null && String(rawPriority).trim() !== ''
        ? Number(rawPriority)
        : defaultOrder);
  const order = Number.isFinite(parsedNum) ? parsedNum : (defaultOrder ?? 1);

  const rating = Number(data.rating) || 4.9;
  const reviewCount = Number(data.reviewCount) || 120;

  const departureCities = Array.isArray(data.departureCities)
    ? data.departureCities.map((c) => String(c).trim()).filter(Boolean)
    : (typeof data.departureCities === 'string'
        ? data.departureCities.split(',').map((c) => c.trim()).filter(Boolean)
        : ['Casablanca', 'Rabat']);

  // Extract dateText directly from CMS (champ unique 'Date du voyage (Texte libre)')
  // Saved directly and rendered word-for-word on the site without any automatic date calculations.
  const rawDateText = (data.dateText || data.date_text || data.displayDate || data.display_date || data.customDate || data.custom_date || data.nextDate || data.recurring_day || data.recurringDay || '').trim();
  const rawRecurringDay = (data.recurring_day || data.recurringDay || '').trim();
  const dateText = rawDateText || undefined;
  const displayDate = rawDateText || undefined;
  const customDate = rawDateText || undefined;
  const nextDate = rawDateText || 'Départs réguliers';

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

  const rawIncluded = data.included !== undefined
    ? data.included
    : (data.prix_comprend !== undefined
        ? data.prix_comprend
        : (data.inclus !== undefined ? data.inclus : undefined));

  // Convert rawIncluded / rawExcluded into clean string[]
  const parseRawItems = (val: any): string[] => {
    if (!val) return [];
    const list = Array.isArray(val) ? val : [val];
    const result: string[] = [];
    for (const item of list) {
      if (!item) continue;
      // If Decap CMS stored an object like { item: "..." } or { name: "..." }
      const text = typeof item === 'object'
        ? (item.item || item.name || item.title || item.text || item.value || '')
        : String(item);
      const lines = String(text).split(/\r?\n/);
      for (const line of lines) {
        const cleaned = line.replace(/^[\s•\-\*⁃◦_—–~:;.]+/u, '').trim();
        if (cleaned && !/^[\-_—–.\s•*~;:,]+$/.test(cleaned)) {
          result.push(cleaned);
        }
      }
    }
    return result;
  };

  const parsedRawIncluded = parseRawItems(rawIncluded);
  const included = parsedRawIncluded.length > 0 ? parsedRawIncluded : defaultIncluded;

  // For excluded / notIncluded:
  // If the field is empty, null or undefined, do NOT show any default fallback text.
  const rawExcluded = data.excluded !== undefined
    ? data.excluded
    : (data.notIncluded !== undefined
        ? data.notIncluded
        : (data.prix_ne_comprend_pas !== undefined
            ? data.prix_ne_comprend_pas
            : (data.non_inclus !== undefined ? data.non_inclus : undefined)));

  const parsedRawExcluded = parseRawItems(rawExcluded);
  const excluded = parsedRawExcluded;
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

  return {
    id: data.id || slug,
    title,
    destination,
    ville_destination,
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
    dateText,
    date_type: data.date_type || data.dateType,
    exact_date: data.exact_date || data.exactDate || data.fixedDate || data.date_fixe,
    recurring_day: rawRecurringDay || undefined,
    displayDate,
    customDate,
    nextDate,
    category,
    categories,
    isPopular,
    isWeekly,
    isUpcoming,
    archived: Boolean(data.archived),
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
    order,
    ordre: order,
    slug,
    date: data.date || data.createdAt || data.date_created || data.created_at || data.updatedAt || undefined,
    createdAt: data.createdAt || data.created_at || undefined,
    updatedAt: data.updatedAt || data.updated_at || undefined,
    _mtime: typeof data._mtime === 'number' ? data._mtime : undefined,
    seo_title: data.seo_title || undefined,
    seo_description: data.seo_description || undefined
  };
}

/**
 * Extrait le timestamp de date/modification d'un voyage pour départager les égalités.
 * Vérifie dans l'ordre :
 * 1. Le champ 'date' / 'createdAt' / 'updatedAt' du voyage
 * 2. La propriété _mtime injectée par Vite
 * 3. La date de modification réelle enregistrée dans voyagesMeta.json
 */
export function getVoyageTimestamp(voyage: Trip): number {
  if (voyage.date) {
    const p = Date.parse(voyage.date);
    if (!isNaN(p) && p > 0) return p;
  }
  if (voyage.createdAt) {
    const p = Date.parse(voyage.createdAt);
    if (!isNaN(p) && p > 0) return p;
  }
  if (voyage.updatedAt) {
    const p = Date.parse(voyage.updatedAt);
    if (!isNaN(p) && p > 0) return p;
  }
  if (typeof voyage._mtime === 'number' && voyage._mtime > 0) {
    return voyage._mtime;
  }

  const slug = voyage.slug || voyage.id;
  if (slug && (voyagesMeta as Record<string, any>)[slug]) {
    const entry = (voyagesMeta as Record<string, any>)[slug];
    if (typeof entry.mtime === 'number') return entry.mtime;
    if (typeof entry.birthtime === 'number') return entry.birthtime;
  }

  return 0;
}

/**
 * Dynamically loads the ordered list of trips from content/settings/order.json
 */
export function getOrderItems(): string[] {
  const items = (orderConfig as { items?: any[] })?.items;
  if (Array.isArray(items)) {
    return items
      .map((item: any) => {
        if (typeof item === 'string') return item.trim();
        if (item && typeof item === 'object') return (item.voyage || item.slug || item.trip || '').trim();
        return '';
      })
      .filter(Boolean);
  }
  return [];
}

export const getOrderSettings = getOrderItems;

/**
 * Tri centralisé basé strictement sur le fichier de configuration content/settings/order.json :
 * 1. Filtre strictement les voyages actifs (archived === false).
 * 2. Remplace le tri actuel par une correspondance exacte avec l'index du tableau orderConfig.items
 * 3. SYNCHRONISATION AUTOMATIQUE : Si un voyage actif présent dans content/voyages n'apparaît PAS encore
 *    dans order.json, il est automatiquement ajouté à la fin de la liste d'affichage (pos = 999).
 *    Aucun voyage créé dans le CMS ne risque ainsi d'être ignoré ou oublié sur le site public.
 */
export function sortVoyagesSmart(voyages: Trip[]): Trip[] {
  // 1. Filtrer les voyages actifs (les archivés restent masqués)
  const activeVoyages = voyages.filter((v) => !v.archived);

  // 2. Liste ordonnée depuis orderConfig
  const orderedSlugs: string[] = getOrderItems();

  // 3. Algorithme de tri des voyages
  return activeVoyages.sort((a, b) => {
    // Récupère la position du voyage dans le tableau order.json
    const keyA = a.slug || a.title;
    const keyB = b.slug || b.title;

    let indexA = orderedSlugs.indexOf(keyA);
    let indexB = orderedSlugs.indexOf(keyB);

    // Recherche insensible à la casse si correspondance exacte non trouvée
    if (indexA === -1) {
      indexA = orderedSlugs.findIndex((s) => s.toLowerCase() === keyA.toLowerCase());
    }
    if (indexB === -1) {
      indexB = orderedSlugs.findIndex((s) => s.toLowerCase() === keyB.toLowerCase());
    }

    // Si un voyage n'est pas encore dans order.json, le placer à la fin
    const posA = indexA === -1 ? 999 : indexA;
    const posB = indexB === -1 ? 999 : indexB;

    if (posA !== posB) {
      return posA - posB;
    }

    // En cas d'égalité sur les voyages non encore ordonnés (pos 999),
    // afficher le plus récent en premier
    const timeA = getVoyageTimestamp(a);
    const timeB = getVoyageTimestamp(b);
    return timeB - timeA;
  });
}

/**
 * Backwards compatible aliases
 */
export const sortVoyagesByOrder = sortVoyagesSmart;
export const sortTripsByOrderSettings = sortVoyagesSmart;

/**
 * Dynamically loads all voyages from Decap CMS content/voyages/*.{json,md}
 */
export function loadCmsTrips(): Trip[] {
  const loadedList: (Trip & { order: number; _fileIndex: number; slug: string })[] = [];

  // 1. Dynamic import of all JSON files in content/voyages
  const jsonModules = import.meta.glob<Record<string, any>>('/content/voyages/*.json', { eager: true });
  Object.entries(jsonModules).forEach(([path, mod], idx) => {
    const data = ((mod as { default?: CmsTripRaw }).default || mod) as CmsTripRaw;
    const slug = path.split('/').pop()?.replace(/\.json$/, '') || `trip-${idx}`;
    const trip = normalizeTrip(data, slug, 99);
    if (trip) {
      loadedList.push({ ...trip, slug, _fileIndex: idx });
    }
  });

  // 2. Dynamic import of any Markdown files in content/voyages
  const mdModules = import.meta.glob<string>('/content/voyages/*.md', { eager: true, query: '?raw', import: 'default' });
  Object.entries(mdModules).forEach(([path, rawContent], idx) => {
    const data = parseFrontmatter(rawContent) as CmsTripRaw;
    const slug = path.split('/').pop()?.replace(/\.md$/, '') || `trip-md-${idx}`;
    const trip = normalizeTrip(data, slug, 99);
    if (trip) {
      loadedList.push({ ...trip, slug, _fileIndex: idx + 1000 });
    }
  });

  if (loadedList.length === 0) {
    return [];
  }

  // 3. Use sortVoyagesSmart to filter active and sort by order with automatic shift
  const rawTrips = loadedList.map(({ _fileIndex, ...rest }) => rest as Trip);
  return sortVoyagesSmart(rawTrips);
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

export const WHATSAPP_NUMBER = '212663400968'; // Numéro pour réservations & fiches voyages (+212 663-400968)
export const WHATSAPP_DISPLAY = '+212 663-400968';
export const WHATSAPP_FLOATING_NUMBER = '212690060366'; // Numéro dédié au bouton flottant en bas à droite (+212 690-060366)
export const WHATSAPP_FLOATING_DISPLAY = '+212 690-060366';
export const WHATSAPP_NUMBER_2 = '212690060366'; // Second numéro d'assistance
export const WHATSAPP_DISPLAY_2 = '+212 690-060366';
export const AGENCY_EMAIL = 'smartorga.travel@gmail.com';
export const AGENCY_ADDRESS = 'Casablanca / Rabat, Maroc';
