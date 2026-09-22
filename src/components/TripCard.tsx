import React from 'react';
import { Trip } from '../types';
import { Clock, Calendar, CheckCircle2, Star, Users, MapPin, Eye, MessageCircle } from 'lucide-react';
import { createTripWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import {
  getTripTitle,
  getTripDestination,
  getTripDuration,
  getTripHighlights,
  getTripNextDate
} from '../utils/localized';

interface TripCardProps {
  trip: Trip;
  onOpenDetails: (trip: Trip) => void;
  onOpenBookingModal: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onOpenDetails, onOpenBookingModal }) => {
  const { language, t } = useLanguage();

  const title = getTripTitle(trip, language);
  const destination = getTripDestination(trip, language);
  const duration = getTripDuration(trip, language);
  const highlights = getTripHighlights(trip, language);
  // Prioritize dateText (texte libre saisi dans l'admin, affiché mot pour mot sans aucun calcul)
  const nextDate = trip.dateText || trip.displayDate || trip.customDate || getTripNextDate(trip, language);

  const directWhatsAppUrl = createTripWhatsAppUrl(trip, { lang: language });

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div
        onClick={() => onOpenDetails(trip)}
        className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenDetails(trip);
          }
        }}
      >
        <img
          src={trip.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 sm:top-3 start-2.5 sm:start-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold tracking-wide shadow-xs">
            {trip.region}
          </span>
          {trip.isPopular && (
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold shadow-xs">
              {t.cardPopular}
            </span>
          )}
        </div>

        {/* Duration badge at bottom-end of image */}
        <div className="absolute bottom-2.5 sm:bottom-3 end-2.5 sm:end-3 z-10">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold shadow-xs">
            <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-400" />
            {duration}
          </span>
        </div>

        {/* Rating pill top-end */}
        <div className="absolute top-2.5 sm:top-3 end-2.5 sm:end-3 z-10">
          <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-white/95 backdrop-blur-md text-slate-800 text-[11px] sm:text-xs font-bold shadow-xs">
            <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500 fill-amber-500" />
            <span>{trip.rating}</span>
            <span className="text-slate-400 font-normal">({trip.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div>
          {/* Destination location line */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500 mb-1 sm:mb-1.5">
            <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-500/90 shrink-0" />
            <span className="break-words whitespace-normal sm:truncate">{destination}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(trip)}
            className="text-base sm:text-lg font-extrabold sm:font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer break-words whitespace-normal line-clamp-none sm:line-clamp-2 min-h-0 sm:min-h-[3.25rem] flex items-start"
          >
            {title}
          </h3>

          {/* Next departure date & group size */}
          <div className="mt-2 sm:mt-2.5 flex items-center justify-between text-[11px] sm:text-xs text-slate-600 bg-slate-50/90 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-700 break-words whitespace-normal sm:truncate">{nextDate}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 shrink-0">
              <Users className="w-3 h-3 text-slate-400" />
              <span>{trip.groupSize}</span>
            </div>
          </div>

          {/* Points Forts (Highlights) - strictly 3, slightly reduced on mobile */}
          <div className="mt-2.5 sm:mt-3.5 space-y-1 sm:space-y-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.cardHighlights}
            </span>
            {highlights.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="break-words whitespace-normal line-clamp-none sm:line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 space-y-2.5 sm:space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black sm:font-extrabold text-slate-900">
                  {trip.priceMAD.toLocaleString()} <span className="text-xs sm:text-sm font-semibold">MAD</span>
                </span>
                {trip.originalPriceMAD && (
                  <span className="text-xs text-slate-400 line-through">
                    {trip.originalPriceMAD.toLocaleString()} MAD
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                {t.cardPerPerson}
              </span>
            </div>

            <button
              onClick={() => onOpenDetails(trip)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t.cardItinerary}</span>
            </button>
          </div>

          {/* Buttons: WhatsApp Reservation & Custom Booking - strictly equal height */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenBookingModal(trip)}
              className="w-full h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              <span className="truncate">{t.cardCustomize}</span>
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 sm:h-11 px-2.5 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center select-none"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">{t.cardBookWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
