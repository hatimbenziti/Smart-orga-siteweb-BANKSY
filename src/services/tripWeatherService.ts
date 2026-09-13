import { Trip } from '../types';

export interface DailyWeatherForecast {
  day: number;
  date: Date;
  dateFormatted: string;
  dateFormattedExact: string;
  dateFormattedExactAr?: string;
  dateFormattedExactEn?: string;
  dateFormattedAr?: string;
  dateFormattedEn?: string;
  location?: string;
  locationAr?: string;
  locationEn?: string;
  cityName?: string;
  cityNameAr?: string;
  cityNameEn?: string;
  temp: string;
  tempMax: string;
  tempMin?: string;
  condition: string;
  conditionAr: string;
  conditionEn: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'cloud-lightning';
}

export interface TripWeatherReport {
  temp: string;
  condition: string;
  conditionAr: string;
  conditionEn: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'cloud-lightning';
  dailyForecast: DailyWeatherForecast[];
  cityName?: string;
  cityNameAr?: string;
  cityNameEn?: string;
  isLive?: boolean;
  source?: 'open-meteo' | 'fallback';
}

export const FRENCH_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
export const ARABIC_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
export const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const FRENCH_MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const ARABIC_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
  'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'
];

export const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const FRENCH_MONTHS_SHORT = [
  'Janv', 'Févr', 'Mars', 'Avr', 'Mai', 'Juin',
  'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'
];

export const ENGLISH_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Formats a day date concisely (e.g. "Vendredi 18 Sept", "الجمعة 18 شتنبر", "Friday, Sep 18")
 */
export function formatDayDateExact(date: Date, lang: string = 'fr'): string {
  const dayOfWeek = date.getDay();
  const dayNum = date.getDate();
  const monthIdx = date.getMonth();

  if (lang === 'ar') {
    return `${ARABIC_DAYS[dayOfWeek]} ${dayNum} ${ARABIC_MONTHS[monthIdx]}`;
  }
  if (lang === 'en') {
    return `${ENGLISH_DAYS[dayOfWeek]}, ${ENGLISH_MONTHS_SHORT[monthIdx]} ${dayNum}`;
  }
  return `${FRENCH_DAYS[dayOfWeek]} ${dayNum} ${FRENCH_MONTHS_SHORT[monthIdx]}`;
}

/**
 * Maps a recurring day label or text string to the JS day-of-week index (0 = Sunday ... 6 = Saturday)
 */
export function parseRecurringDayToDayNumber(recurringDay?: string, fallbackText?: string): number {
  const query = `${recurringDay || ''} ${fallbackText || ''}`.toLowerCase().trim();

  if (query.includes('lundi') || query.includes('monday')) return 1;
  if (query.includes('mardi') || query.includes('tuesday')) return 2;
  if (query.includes('mercredi') || query.includes('wednesday')) return 3;
  if (query.includes('jeudi') || query.includes('thursday')) return 4;
  if (query.includes('vendredi') || query.includes('friday')) return 5;
  if (query.includes('samedi') || query.includes('saturday')) return 6;
  if (query.includes('dimanche') || query.includes('sunday')) return 0;

  // Default to Friday (5) for weekend excursions in Morocco
  return 5;
}

/**
 * Parses an exact date string (e.g., "YYYY-MM-DD" or full ISO date) into a local Date object set to midday
 */
export function parseExactDate(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Match ISO YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day, 12, 0, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }

  // General Date parse fallback
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    parsed.setHours(12, 0, 0, 0);
    return parsed;
  }

  return null;
}

/**
 * Computes the very next upcoming occurrence of a specific day of week (0..6).
 * If today is the target day and the hour is already past morning, rolls over to next week (+7 days)
 * to ensure users always see a future bookable departure date.
 */
export function getNextUpcomingDayOfWeek(targetDay: number, from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  const currentDay = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  let diff = (targetDay - currentDay + 7) % 7;
  // If target day is today, schedule for next week
  if (diff === 0) {
    diff = 7;
  }

  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Backward compatibility alias: calculates the next upcoming Friday
 */
export function getNextUpcomingFriday(from: Date = new Date()): Date {
  return getNextUpcomingDayOfWeek(5, from);
}

/**
 * Checks if a trip is configured with recurring departure or has dynamic date calculation
 */
export function isRecurringDeparture(trip: Trip): boolean {
  if (trip.date_type === 'Départ récurrent') return true;
  if (trip.date_type === 'Date fixe') return false;
  if (trip.exact_date) return false;
  if (trip.recurring_day) return true;
  if (trip.isWeekly) return true;

  const raw = (trip.nextDate || '').toLowerCase().trim();
  if (!raw) return true;

  // If string contains explicit day name or recurring keywords
  if (
    raw.includes('chaque') ||
    raw.includes('tous les') ||
    raw.includes('hebdo') ||
    raw.includes('régulier') ||
    raw.includes('weekend') ||
    raw.includes('week-end') ||
    raw.includes('prochain') ||
    raw.includes('vendredi') ||
    raw.includes('samedi') ||
    raw.includes('jeudi') ||
    raw.includes('dimanche')
  ) {
    return true;
  }

  return true;
}

/**
 * Returns the resolved departure Date object for a trip.
 * Respects 'Date fixe' with exact_date, or computes the upcoming day for 'Départ récurrent'.
 */
export function getComputedTripDepartureDate(trip: Trip): { date: Date; isDynamic: boolean } {
  // 1. If explicit 'Date fixe' or exact_date provided
  if (trip.date_type === 'Date fixe' || trip.exact_date) {
    const parsed = parseExactDate(trip.exact_date || trip.nextDate);
    if (parsed) {
      return { date: parsed, isDynamic: false };
    }
  }

  // 2. Otherwise handle 'Départ récurrent' (or default)
  const targetDay = parseRecurringDayToDayNumber(trip.recurring_day, trip.nextDate);
  const nextDateObj = getNextUpcomingDayOfWeek(targetDay);
  return { date: nextDateObj, isDynamic: true };
}

/**
 * Formats a departure date: e.g. "Samedi 19 Septembre" (FR), "السبت 19 شتنبر" (AR), "Saturday, September 19" (EN)
 */
export function formatDepartureDate(date: Date, lang: string = 'fr'): string {
  const dayOfWeek = date.getDay();
  const dayNum = date.getDate();
  const monthIdx = date.getMonth();

  if (lang === 'ar') {
    return `${ARABIC_DAYS[dayOfWeek]} ${dayNum} ${ARABIC_MONTHS[monthIdx]}`;
  }
  if (lang === 'en') {
    return `${ENGLISH_DAYS[dayOfWeek]}, ${ENGLISH_MONTHS[monthIdx]} ${dayNum}`;
  }
  return `${FRENCH_DAYS[dayOfWeek]} ${dayNum} ${FRENCH_MONTHS[monthIdx]}`;
}

/**
 * Returns the localized next departure date for a trip.
 * Evaluates 'Date fixe' or dynamic upcoming calculation for 'Départ récurrent'.
 */
export function getDynamicTripNextDate(trip: Trip, lang: string = 'fr'): string {
  const { date, isDynamic } = getComputedTripDepartureDate(trip);

  // If fixed date with localized manual text provided, use it if appropriate
  if (!isDynamic) {
    if (lang === 'ar' && trip.nextDateAr) return trip.nextDateAr;
    if (lang === 'en' && trip.nextDateEn) return trip.nextDateEn;
    return formatDepartureDate(date, lang);
  }

  // Dynamic recurring departure formatted with exact calculated day and date
  return formatDepartureDate(date, lang);
}

export interface SingleCityLocation {
  name: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export const MOROCCAN_CITIES_COORDS: Record<string, SingleCityLocation> = {
  taghazout: {
    name: 'Taghazout',
    nameAr: 'تغازوت',
    nameEn: 'Taghazout',
    lat: 30.542,
    lon: -9.709
  },
  dakhla: {
    name: 'Dakhla',
    nameAr: 'الداخلة',
    nameEn: 'Dakhla',
    lat: 23.713,
    lon: -15.938
  },
  merzouga: {
    name: 'Merzouga',
    nameAr: 'مرزوكة',
    nameEn: 'Merzouga',
    lat: 31.099,
    lon: -4.012
  },
  chefchaouen: {
    name: 'Chefchaouen',
    nameAr: 'شفشاون',
    nameEn: 'Chefchaouen',
    lat: 35.168,
    lon: -5.263
  },
  imlil: {
    name: 'Imlil',
    nameAr: 'إمليل',
    nameEn: 'Imlil',
    lat: 31.135,
    lon: -7.918
  },
  toubkal: {
    name: 'Toubkal',
    nameAr: 'توبقال',
    nameEn: 'Toubkal',
    lat: 31.060,
    lon: -7.915
  },
  ouzoud: {
    name: 'Ouzoud',
    nameAr: 'أوزود',
    nameEn: 'Ouzoud',
    lat: 32.015,
    lon: -6.719
  },
  agafay: {
    name: 'Agafay',
    nameAr: 'أكافاي',
    nameEn: 'Agafay',
    lat: 31.483,
    lon: -8.150
  },
  marrakech: {
    name: 'Marrakech',
    nameAr: 'مراكش',
    nameEn: 'Marrakech',
    lat: 31.629,
    lon: -7.981
  },
  ouarzazate: {
    name: 'Ouarzazate',
    nameAr: 'ورزازات',
    nameEn: 'Ouarzazate',
    lat: 30.918,
    lon: -6.911
  },
  zagora: {
    name: 'Zagora',
    nameAr: 'زاكورة',
    nameEn: 'Zagora',
    lat: 30.332,
    lon: -5.838
  },
  agadir: {
    name: 'Agadir',
    nameAr: 'أكادير',
    nameEn: 'Agadir',
    lat: 30.427,
    lon: -9.598
  },
  tanger: {
    name: 'Tanger',
    nameAr: 'طنجة',
    nameEn: 'Tangier',
    lat: 35.759,
    lon: -5.833
  },
  essaouira: {
    name: 'Essaouira',
    nameAr: 'الصويرة',
    nameEn: 'Essaouira',
    lat: 31.508,
    lon: -9.760
  },
  fes: {
    name: 'Fès',
    nameAr: 'فاس',
    nameEn: 'Fez',
    lat: 34.033,
    lon: -5.000
  },
  casablanca: {
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    nameEn: 'Casablanca',
    lat: 33.573,
    lon: -7.589
  },
  rabat: {
    name: 'Rabat',
    nameAr: 'الرباط',
    nameEn: 'Rabat',
    lat: 34.020,
    lon: -6.841
  }
};

/**
 * Resolves the single, precise destination city for a trip.
 * Uses trip.ville_destination strictly to avoid mixing multiple cities.
 */
export function getSingleDestinationCity(trip: Trip): SingleCityLocation {
  const rawCity = (trip.ville_destination || '').trim().toLowerCase();
  
  if (rawCity) {
    for (const [key, loc] of Object.entries(MOROCCAN_CITIES_COORDS)) {
      if (rawCity.includes(key) || key.includes(rawCity)) {
        return loc;
      }
    }
    return {
      name: trip.ville_destination!.trim(),
      nameAr: trip.ville_destination!.trim(),
      nameEn: trip.ville_destination!.trim(),
      lat: 31.629,
      lon: -7.981
    };
  }

  // Fallback: strictly identify a single city
  const fallbackText = `${trip.id || ''} ${trip.destination || ''} ${trip.title || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (fallbackText.includes('taghazout')) return MOROCCAN_CITIES_COORDS.taghazout;
  if (fallbackText.includes('dakhla')) return MOROCCAN_CITIES_COORDS.dakhla;
  if (fallbackText.includes('merzouga') || fallbackText.includes('erg chebbi')) return MOROCCAN_CITIES_COORDS.merzouga;
  if (fallbackText.includes('chefchaouen') || fallbackText.includes('chaouen')) return MOROCCAN_CITIES_COORDS.chefchaouen;
  if (fallbackText.includes('imlil') || fallbackText.includes('toubkal')) return MOROCCAN_CITIES_COORDS.imlil;
  if (fallbackText.includes('ouzoud')) return MOROCCAN_CITIES_COORDS.ouzoud;
  if (fallbackText.includes('ouarzazate')) return MOROCCAN_CITIES_COORDS.ouarzazate;
  if (fallbackText.includes('agafay')) return MOROCCAN_CITIES_COORDS.agafay;
  if (fallbackText.includes('marrakech')) return MOROCCAN_CITIES_COORDS.marrakech;
  if (fallbackText.includes('agadir')) return MOROCCAN_CITIES_COORDS.agadir;
  if (fallbackText.includes('tanger')) return MOROCCAN_CITIES_COORDS.tanger;
  if (fallbackText.includes('zagora')) return MOROCCAN_CITIES_COORDS.zagora;

  return MOROCCAN_CITIES_COORDS.taghazout;
}

export function getCoordinatesForTrip(trip: Trip): { lat: number; lon: number } {
  const cityInfo = getSingleDestinationCity(trip);
  return { lat: cityInfo.lat, lon: cityInfo.lon };
}

function interpretWmoCode(code: number): {
  condition: string;
  conditionAr: string;
  conditionEn: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'snowflake' | 'cloud-lightning';
} {
  switch (code) {
    case 0:
      return {
        condition: 'Ensoleillé & Ciel pur',
        conditionAr: 'مشمس وسماء صافية',
        conditionEn: 'Sunny & Clear',
        icon: 'sun'
      };
    case 1:
    case 2:
      return {
        condition: 'Beau temps ensoleillé',
        conditionAr: 'طقس مشمس وصحو',
        conditionEn: 'Mostly Sunny',
        icon: 'sun'
      };
    case 3:
      return {
        condition: 'Partiellement nuageux',
        conditionAr: 'غائم جزئياً',
        conditionEn: 'Partly Cloudy',
        icon: 'cloud'
      };
    case 45:
    case 48:
      return {
        condition: 'Brume matinale douce',
        conditionAr: 'ضباب خفيف',
        conditionEn: 'Morning Fog',
        icon: 'cloud'
      };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        condition: 'Averses douces',
        conditionAr: 'زخات مطرية خفيفة',
        conditionEn: 'Light Rain',
        icon: 'cloud-rain'
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        condition: 'Neige en altitude',
        conditionAr: 'تساقطات ثلجية',
        conditionEn: 'Snow',
        icon: 'snowflake'
      };
    case 95:
    case 96:
    case 99:
      return {
        condition: 'Risque d\'orages',
        conditionAr: 'عواصف رعدية',
        conditionEn: 'Thunderstorms',
        icon: 'cloud-lightning'
      };
    default:
      return {
        condition: 'Ensoleillé & Ciel clair',
        conditionAr: 'مشمس ولطيف',
        conditionEn: 'Pleasant & Sunny',
        icon: 'sun'
      };
  }
}

/**
 * Builds default fallback weather forecast if network is unavailable
 */
export function getFallbackWeather(trip: Trip, departureDate: Date): TripWeatherReport {
  const cityInfo = getSingleDestinationCity(trip);
  const region = (trip.region || '').toLowerCase();
  
  // Seasonal adjustment according to departure date month (0=Jan..11=Dec)
  const month = departureDate.getMonth();
  const seasonalOffsets = [-4, -3, 0, 2, 5, 8, 10, 10, 7, 3, -1, -3];
  const seasonalDelta = seasonalOffsets[month] ?? 0;

  let baseCityTemp = 22;
  const cityName = cityInfo.name.toLowerCase();
  if (cityName.includes('dakhla')) {
    baseCityTemp = 24;
  } else if (cityName.includes('merzouga') || cityName.includes('zagora')) {
    baseCityTemp = 28;
  } else if (cityName.includes('taghazout') || cityName.includes('agadir')) {
    baseCityTemp = 23;
  } else if (cityName.includes('chefchaouen')) {
    baseCityTemp = 20;
  } else if (cityName.includes('imlil') || cityName.includes('toubkal')) {
    baseCityTemp = 17;
  } else if (cityName.includes('marrakech') || cityName.includes('agafay')) {
    baseCityTemp = 26;
  } else if (cityName.includes('ouzoud')) {
    baseCityTemp = 22;
  } else if (cityName.includes('tanger')) {
    baseCityTemp = 21;
  } else if (cityName.includes('essaouira')) {
    baseCityTemp = 21;
  } else if (region.includes('désert') || region.includes('dunes')) {
    baseCityTemp = 28;
  } else if (region.includes('plage') || region.includes('mer') || region.includes('surf')) {
    baseCityTemp = 24;
  } else if (region.includes('montagne') || region.includes('trekking')) {
    baseCityTemp = 18;
  }

  const calculatedTempNum = Math.round(baseCityTemp + (seasonalDelta * 0.4));
  const defaultTemp = `${calculatedTempNum}°C`;
  const defaultCond = 'Ensoleillé & Ciel pur';
  const defaultCondAr = 'مشمس وسماء صافية';
  const defaultCondEn = 'Sunny & Clear';

  const dailyForecast: DailyWeatherForecast[] = [];
  const tripDaysCount = Math.max(1, Math.min(trip.days || 3, 7));

  for (let i = 0; i < tripDaysCount; i++) {
    const dayDate = new Date(departureDate);
    dayDate.setDate(dayDate.getDate() + i);

    const variation = i === 1 ? 1 : i === 2 ? -1 : 0;
    const dayTemp = `${calculatedTempNum + variation}°C`;

    const dayOfWeek = dayDate.getDay();
    const dayNameFr = FRENCH_DAYS[dayOfWeek];
    const dayNameAr = ARABIC_DAYS[dayOfWeek];
    const dayNameEn = ENGLISH_DAYS[dayOfWeek];

    dailyForecast.push({
      day: i + 1,
      date: dayDate,
      dateFormatted: `${dayNameFr} ${dayDate.getDate()} ${FRENCH_MONTHS[dayDate.getMonth()]}`,
      dateFormattedExact: `${dayNameFr} ${dayDate.getDate()} ${FRENCH_MONTHS_SHORT[dayDate.getMonth()]}`,
      dateFormattedExactAr: `${dayNameAr} ${dayDate.getDate()} ${ARABIC_MONTHS[dayDate.getMonth()]}`,
      dateFormattedExactEn: `${dayNameEn}, ${ENGLISH_MONTHS_SHORT[dayDate.getMonth()]} ${dayDate.getDate()}`,
      dateFormattedAr: `${dayNameAr} ${dayDate.getDate()} ${ARABIC_MONTHS[dayDate.getMonth()]}`,
      dateFormattedEn: `${dayNameEn}, ${ENGLISH_MONTHS[dayDate.getMonth()]} ${dayDate.getDate()}`,
      location: cityInfo.name,
      locationAr: cityInfo.nameAr,
      locationEn: cityInfo.nameEn,
      cityName: cityInfo.name,
      cityNameAr: cityInfo.nameAr,
      cityNameEn: cityInfo.nameEn,
      temp: dayTemp,
      tempMax: dayTemp,
      condition: i === 1 ? 'Ciel pur & lumineux' : defaultCond,
      conditionAr: defaultCondAr,
      conditionEn: defaultCondEn,
      icon: 'sun'
    });
  }

  return {
    temp: defaultTemp,
    condition: defaultCond,
    conditionAr: defaultCondAr,
    conditionEn: defaultCondEn,
    icon: 'sun',
    dailyForecast,
    cityName: cityInfo.name,
    cityNameAr: cityInfo.nameAr,
    cityNameEn: cityInfo.nameEn,
    isLive: false,
    source: 'fallback'
  };
}

// In-memory cache for API requests
const weatherCache = new Map<string, { report: TripWeatherReport; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches real-time weather from Open-Meteo for the days of the trip starting precisely at departureDate.
 */
export async function fetchTripWeather(
  trip: Trip,
  departureDate: Date
): Promise<TripWeatherReport> {
  const cityInfo = getSingleDestinationCity(trip);
  const coords = { lat: cityInfo.lat, lon: cityInfo.lon };
  const depIso = departureDate.toISOString().split('T')[0];
  const cacheKey = `${cityInfo.name.toLowerCase()}_${coords.lat.toFixed(2)}_${coords.lon.toFixed(2)}_${depIso}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.report;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCasablanca&forecast_days=16`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();

    if (!data?.daily?.time || !Array.isArray(data.daily.time)) {
      throw new Error('Invalid Open-Meteo response format');
    }

    const dailyForecast: DailyWeatherForecast[] = [];
    const tripDaysCount = Math.max(1, Math.min(trip.days || 3, 7));

    // Construct forecast corresponding precisely to departure date and days of the stay
    for (let i = 0; i < tripDaysCount; i++) {
      const dayDate = new Date(departureDate);
      dayDate.setDate(dayDate.getDate() + i);
      const isoDate = dayDate.toISOString().split('T')[0];

      let idx = data.daily.time.indexOf(isoDate);

      // If the departure date is beyond the 16-day window, smoothly fallback to closest day in the forecast window
      if (idx === -1) {
        idx = Math.min(i, data.daily.time.length - 1);
      }

      const tempMaxVal = Math.round(data.daily.temperature_2m_max[idx]);
      const tempMinVal = data.daily.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[idx]) : undefined;
      const code = data.daily.weather_code[idx];
      const interpretation = interpretWmoCode(code);

      const dayOfWeek = dayDate.getDay();
      const dayNameFr = FRENCH_DAYS[dayOfWeek];
      const dayNameAr = ARABIC_DAYS[dayOfWeek];
      const dayNameEn = ENGLISH_DAYS[dayOfWeek];

      dailyForecast.push({
        day: i + 1,
        date: dayDate,
        dateFormatted: `${dayNameFr} ${dayDate.getDate()} ${FRENCH_MONTHS[dayDate.getMonth()]}`,
        dateFormattedExact: `${dayNameFr} ${dayDate.getDate()} ${FRENCH_MONTHS_SHORT[dayDate.getMonth()]}`,
        dateFormattedExactAr: `${dayNameAr} ${dayDate.getDate()} ${ARABIC_MONTHS[dayDate.getMonth()]}`,
        dateFormattedExactEn: `${dayNameEn}, ${ENGLISH_MONTHS_SHORT[dayDate.getMonth()]} ${dayDate.getDate()}`,
        dateFormattedAr: `${dayNameAr} ${dayDate.getDate()} ${ARABIC_MONTHS[dayDate.getMonth()]}`,
        dateFormattedEn: `${dayNameEn}, ${ENGLISH_MONTHS[dayDate.getMonth()]} ${dayDate.getDate()}`,
        location: cityInfo.name,
        locationAr: cityInfo.nameAr,
        locationEn: cityInfo.nameEn,
        cityName: cityInfo.name,
        cityNameAr: cityInfo.nameAr,
        cityNameEn: cityInfo.nameEn,
        temp: `${tempMaxVal}°C`,
        tempMax: `${tempMaxVal}°C`,
        tempMin: tempMinVal !== undefined ? `${tempMinVal}°C` : undefined,
        condition: interpretation.condition,
        conditionAr: interpretation.conditionAr,
        conditionEn: interpretation.conditionEn,
        icon: interpretation.icon
      });
    }

    const firstDay = dailyForecast[0];
    const report: TripWeatherReport = {
      temp: firstDay ? firstDay.tempMax : `${Math.round(data.daily.temperature_2m_max[0])}°C`,
      condition: firstDay ? firstDay.condition : 'Ensoleillé',
      conditionAr: firstDay ? firstDay.conditionAr : 'مشمس وصافٍ',
      conditionEn: firstDay ? firstDay.conditionEn : 'Sunny & Clear',
      icon: firstDay ? firstDay.icon : 'sun',
      dailyForecast,
      cityName: cityInfo.name,
      cityNameAr: cityInfo.nameAr,
      cityNameEn: cityInfo.nameEn,
      isLive: true,
      source: 'open-meteo'
    };

    weatherCache.set(cacheKey, { report, timestamp: Date.now() });
    return report;
  } catch {
    // Network or parsing error: use reliable fallback
    const fallback = getFallbackWeather(trip, departureDate);
    weatherCache.set(cacheKey, { report: fallback, timestamp: Date.now() });
    return fallback;
  }
}
