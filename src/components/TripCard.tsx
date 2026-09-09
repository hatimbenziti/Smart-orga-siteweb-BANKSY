import React from 'react';
import { Trip } from '../types';
import { Clock, Calendar, CheckCircle2, Star, Users, MapPin, Eye, MessageCircle, Sun } from 'lucide-react';
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
  const nextDate = getTripNextDate(trip, language);

  const directWhatsAppUrl = createTripWhatsAppUrl(trip, { lang: language });

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={trip.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 start-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-blue-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wide shadow-xs">
            {trip.region}
          </span>
          {trip.isPopular && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
              {t.cardPopular}
            </span>
          )}
        </div>

        {/* Duration badge at bottom-end of image */}
        <div className="absolute bottom-3 end-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            {duration}
          </span>
        </div>

        {/* Rating pill top-end */}
        <div className="absolute top-3 end-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{trip.rating}</span>
            <span className="text-slate-400 font-normal">({trip.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Destination location line */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{destination}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(trip)}
            className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer line-clamp-2"
          >
            {title}
          </h3>

          {/* Next departure date & cities */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium text-slate-700">{nextDate}</span>
            </div>
            <div className="flex items-center gap-2">
              {trip.weather && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{trip.weather.temp}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Users className="w-3 h-3" />
                <span>{trip.groupSize}</span>
              </div>
            </div>
          </div>

          {/* Points Forts (Highlights) */}
          <div className="mt-3.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {t.cardHighlights}
            </span>
            {highlights.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {trip.priceMAD.toLocaleString()} <span className="text-sm font-semibold">MAD</span>
                </span>
                {trip.originalPriceMAD && (
                  <span className="text-xs text-slate-400 line-through">
                    {trip.originalPriceMAD.toLocaleString()} MAD
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
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

          {/* Buttons: WhatsApp Reservation & Custom Booking */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenBookingModal(trip)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t.cardCustomize}</span>
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span>{t.cardBookWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
