export type Language = 'fr' | 'ar' | 'en';

export interface Trip {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  destination: string;
  destinationAr?: string;
  destinationEn?: string;
  region: 'Désert & Dunes' | 'Villes Impériales' | 'Nature & Randonnée' | 'Plages & Surf';
  duration: string;
  durationAr?: string;
  durationEn?: string;
  days: number;
  nights: number;
  priceMAD: number;
  originalPriceMAD?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  departureCities: string[];
  nextDate: string;
  nextDateAr?: string;
  nextDateEn?: string;
  category: 'popular' | 'weekly' | 'upcoming' | 'all';
  isPopular?: boolean;
  isWeekly?: boolean;
  isUpcoming?: boolean;
  highlights: string[];
  highlightsAr?: string[];
  highlightsEn?: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    titleAr?: string;
    descriptionAr?: string;
    titleEn?: string;
    descriptionEn?: string;
  }[];
  included: string[];
  includedAr?: string[];
  includedEn?: string[];
  notIncluded: string[];
  notIncludedAr?: string[];
  notIncludedEn?: string[];
  groupSize: string;
  groupSizeAr?: string;
  groupSizeEn?: string;
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

export interface Review {
  id: string;
  name: string;
  city: string;
  cityAr?: string;
  cityEn?: string;
  tripTitle: string;
  tripTitleAr?: string;
  tripTitleEn?: string;
  rating: number;
  date: string;
  dateAr?: string;
  dateEn?: string;
  comment: string;
  commentAr?: string;
  commentEn?: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  questionAr?: string;
  answerAr?: string;
  questionEn?: string;
  answerEn?: string;
  category: 'Réservation' | 'Transport & Hébergement' | 'Sur place';
}

export interface FilterState {
  searchQuery: string;
  destination: string;
  regionTag: string;
  maxPrice: number;
  category: 'all' | 'popular' | 'weekly' | 'upcoming';
}

export interface BookingFormData {
  tripTitle: string;
  fullName: string;
  phone: string;
  departureCity: string;
  departureDate: string;
  travelersCount: number;
  customNotes: string;
}
