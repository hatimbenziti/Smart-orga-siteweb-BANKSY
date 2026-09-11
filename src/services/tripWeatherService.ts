import { Trip } from '../types';

export interface DailyWeatherForecast {
  day: number;
  date: Date;
  dateFormatted: string;
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
  isLive: boolean;
  source: 'open-meteo' | 'fallback';
}

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

/**
 * Calculates the next upcoming Friday from now.
 * If today is Friday, targets the upcoming Friday (+7 days)
 * to provide a bookable upcoming date.
 */
export function getNextUpcomingFriday(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
  let diff = (5 - day + 7) % 7;
  if (diff === 0) {
    diff = 7; // Next Friday
  }
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Checks if a trip date is recurring or needs dynamic calculation.
 */
export function isRecurringDeparture(trip: Trip): boolean {
  if (trip.isWeekly) return true;
  const raw = (trip.nextDate || '').toLowerCase().trim();
  if (!raw) return true;
  if (
    raw.includes('chaque') ||
    raw.includes('vendredi') ||
    raw.includes('weekend') ||
    raw.includes('week-end') ||
    raw.includes('régulier') ||
    raw.includes('hebdo') ||
    raw.includes('tous les') ||
    raw.includes('prochain')
  ) {
    return true;
  }
  // If string doesn't contain any digit, treat as recurring
  if (!/\d/.test(raw)) {
    return true;
  }
  return false;
}

/**
 * Returns the resolved departure Date object for a trip.
 */
export function getComputedTripDepartureDate(trip: Trip): { date: Date; isDynamic: boolean } {
  if (isRecurringDeparture(trip)) {
    return { date: getNextUpcomingFriday(), isDynamic: true };
  }

  // Check if trip.nextDate contains a parseable date
  const parsed = new Date(trip.nextDate);
  if (!isNaN(parsed.getTime()) && parsed.getTime() > Date.now() - 86400000) {
    return { date: parsed, isDynamic: false };
  }

  return { date: getNextUpcomingFriday(), isDynamic: true };
}

/**
 * Formats a departure date: "Vendredi [Jour] [Mois]" (ex: Vendredi 18 Septembre)
 */
export function formatDepartureDate(date: Date, lang: string = 'fr'): string {
  const dayNum = date.getDate();
  const monthIdx = date.getMonth();

  if (lang === 'ar') {
    return `الجمعة ${dayNum} ${ARABIC_MONTHS[monthIdx]}`;
  }
  if (lang === 'en') {
    return `Friday, ${ENGLISH_MONTHS[monthIdx]} ${dayNum}`;
  }
  return `Vendredi ${dayNum} ${FRENCH_MONTHS[monthIdx]}`;
}

/**
 * Returns the localized next departure date for a trip.
 * Uses dynamic calculation for recurring departures.
 */
export function getDynamicTripNextDate(trip: Trip, lang: string = 'fr'): string {
  const { date, isDynamic } = getComputedTripDepartureDate(trip);

  if (isDynamic) {
    return formatDepartureDate(date, lang);
  }

  // If fixed date with localized strings, use them
  if (lang === 'ar' && trip.nextDateAr) return trip.nextDateAr;
  if (lang === 'en' && trip.nextDateEn) return trip.nextDateEn;
  return trip.nextDate || formatDepartureDate(date, lang);
}

// Destination coordinates dictionary for Moroccan destinations
const DESTINATION_COORDS: Record<string, { lat: number; lon: number }> = {
  merzouga: { lat: 31.099, lon: -4.012 },
  dakhla: { lat: 23.713, lon: -15.938 },
  chefchaouen: { lat: 35.168, lon: -5.263 },
  chaouen: { lat: 35.168, lon: -5.263 },
  tanger: { lat: 35.759, lon: -5.833 },
  taghazout: { lat: 30.542, lon: -9.709 },
  agadir: { lat: 30.427, lon: -9.598 },
  marrakech: { lat: 31.629, lon: -7.981 },
  agafay: { lat: 31.483, lon: -8.150 },
  ouzoud: { lat: 32.015, lon: -6.719 },
  toubkal: { lat: 31.135, lon: -7.918 },
  imlil: { lat: 31.135, lon: -7.918 },
  atlas: { lat: 31.135, lon: -7.918 },
  ouarzazate: { lat: 30.918, lon: -6.911 },
  dades: { lat: 31.500, lon: -5.983 },
  todra: { lat: 31.583, lon: -5.583 },
  fes: { lat: 34.033, lon: -5.000 },
  meknes: { lat: 33.893, lon: -5.554 },
  casablanca: { lat: 33.573, lon: -7.589 },
  rabat: { lat: 34.020, lon: -6.841 }
};

export function getCoordinatesForTrip(trip: Trip): { lat: number; lon: number } {
  const query = `${trip.destination || ''} ${trip.region || ''} ${trip.title || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const [key, coords] of Object.entries(DESTINATION_COORDS)) {
    if (query.includes(key)) {
      return coords;
    }
  }

  // Fallback to central Moroccan coordinates
  return { lat: 31.629, lon: -7.981 };
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
  const region = (trip.region || '').toLowerCase();
  const defaultBaseTemp = region.includes('désert') || region.includes('dunes')
    ? 28
    : region.includes('plage') || region.includes('mer') || region.includes('surf')
    ? 25
    : region.includes('montagne')
    ? 20
    : 24;

  const defaultTemp = trip.weather?.temp || `${defaultBaseTemp}°C`;
  const defaultCond = trip.weather?.condition || 'Ensoleillé & Ciel clair';
  const defaultCondAr = trip.weather?.conditionAr || 'مشمس وصافٍ';
  const defaultCondEn = trip.weather?.conditionEn || 'Sunny & Clear';

  const dailyForecast: DailyWeatherForecast[] = [];

  for (let i = 0; i < 3; i++) {
    const dayDate = new Date(departureDate);
    dayDate.setDate(dayDate.getDate() + i);

    const variation = i === 1 ? 1 : i === 2 ? -1 : 0;
    const tempNum = parseInt(defaultTemp.replace(/\D/g, ''), 10) || defaultBaseTemp;
    const dayTemp = `${tempNum + variation}°C`;

    const dayName = i === 0 ? 'Vendredi' : i === 1 ? 'Samedi' : 'Dimanche';
    const dayNameAr = i === 0 ? 'الجمعة' : i === 1 ? 'السبت' : 'الأحد';
    const dayNameEn = i === 0 ? 'Friday' : i === 1 ? 'Saturday' : 'Sunday';

    dailyForecast.push({
      day: i + 1,
      date: dayDate,
      dateFormatted: `${dayName} ${dayDate.getDate()} ${FRENCH_MONTHS[dayDate.getMonth()]}`,
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
    isLive: false,
    source: 'fallback'
  };
}

// In-memory cache for API requests
const weatherCache = new Map<string, { report: TripWeatherReport; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches real-time weather from Open-Meteo for the 3 days of the trip starting at departureDate.
 */
export async function fetchTripWeather(
  trip: Trip,
  departureDate: Date
): Promise<TripWeatherReport> {
  const coords = getCoordinatesForTrip(trip);
  const cacheKey = `${coords.lat.toFixed(2)}_${coords.lon.toFixed(2)}_${departureDate.toISOString().split('T')[0]}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.report;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FCasablanca&forecast_days=16`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

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

    for (let i = 0; i < 3; i++) {
      const dayDate = new Date(departureDate);
      dayDate.setDate(dayDate.getDate() + i);
      const isoDate = dayDate.toISOString().split('T')[0];

      let idx = data.daily.time.indexOf(isoDate);

      // If exact date is beyond the 16-day window, fallback gracefully to the nearest available day index
      if (idx === -1) {
        idx = Math.min(i, data.daily.time.length - 1);
      }

      const tempMaxVal = Math.round(data.daily.temperature_2m_max[idx]);
      const tempMinVal = data.daily.temperature_2m_min ? Math.round(data.daily.temperature_2m_min[idx]) : undefined;
      const code = data.daily.weather_code[idx];
      const interpretation = interpretWmoCode(code);

      const dayName = i === 0 ? 'Vendredi' : i === 1 ? 'Samedi' : 'Dimanche';

      dailyForecast.push({
        day: i + 1,
        date: dayDate,
        dateFormatted: `${dayName} ${dayDate.getDate()} ${FRENCH_MONTHS[dayDate.getMonth()]}`,
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
