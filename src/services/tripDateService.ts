import { Trip } from '../types';

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
 * Helper to translate common recurring texts like "Chaque Vendredi", "Chaque Mardi"
 */
function localizeRecurringText(text: string, lang: string): string {
  if (lang === 'ar') {
    const lower = text.toLowerCase();
    if (lower.includes('lundi')) return 'كل يوم اثنين';
    if (lower.includes('mardi')) return 'كل يوم ثلاثاء';
    if (lower.includes('mercredi')) return 'كل يوم أربعاء';
    if (lower.includes('jeudi')) return 'كل يوم خميس';
    if (lower.includes('vendredi')) return 'كل يوم جمعة';
    if (lower.includes('samedi')) return 'كل يوم سبت';
    if (lower.includes('dimanche')) return 'كل يوم أحد';
    if (lower.includes('semaine')) return 'كل أسبوع';
  } else if (lang === 'en') {
    const lower = text.toLowerCase();
    if (lower.includes('lundi')) return 'Every Monday';
    if (lower.includes('mardi')) return 'Every Tuesday';
    if (lower.includes('mercredi')) return 'Every Wednesday';
    if (lower.includes('jeudi')) return 'Every Thursday';
    if (lower.includes('vendredi')) return 'Every Friday';
    if (lower.includes('samedi')) return 'Every Saturday';
    if (lower.includes('dimanche')) return 'Every Sunday';
    if (lower.includes('semaine')) return 'Every week';
  }
  return text;
}

/**
 * Returns the localized next departure date for a trip.
 * Strictly prioritizes customDate (texte personnalisé saisi dans le back-office)
 * and recurring fixed text without calculating agenda dates (e.g. "Mercredi 23 Septembre").
 */
export function getDynamicTripNextDate(trip: Trip, lang: string = 'fr'): string {
  // 1. PRIORITÉ ABSOLUE : Texte personnalisé du back-office (customDate ou nextDate saisi)
  const custom = (trip.customDate || trip.nextDate || '').trim();
  if (custom && custom !== 'Départs réguliers') {
    if (lang === 'ar' && trip.nextDateAr) return trip.nextDateAr;
    if (lang === 'en' && trip.nextDateEn) return trip.nextDateEn;
    return localizeRecurringText(custom, lang);
  }

  // 2. DEUXIÈME PRIORITÉ : Jour récurrent fixe (ex: "Chaque Mardi", "Chaque Vendredi")
  if (trip.recurring_day && trip.recurring_day.trim()) {
    const recurring = trip.recurring_day.trim();
    return localizeRecurringText(recurring, lang);
  }

  // 3. TROISIÈME PRIORITÉ : Date fixe avec calendrier exact_date (uniquement si Date fixe)
  if (trip.date_type === 'Date fixe' && trip.exact_date) {
    const parsed = parseExactDate(trip.exact_date);
    if (parsed) {
      return formatDepartureDate(parsed, lang);
    }
    return trip.exact_date;
  }

  // 4. Si customDate ou nextDate est 'Départs réguliers'
  if (custom) {
    return localizeRecurringText(custom, lang);
  }

  return lang === 'ar' ? 'رحلات منتظمة' : (lang === 'en' ? 'Regular departures' : 'Départs réguliers');
}
