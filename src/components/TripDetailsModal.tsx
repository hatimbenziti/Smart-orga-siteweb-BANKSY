import React from 'react';
import { Trip } from '../types';
import { X, Check, Clock, Calendar, Users, MapPin, MessageCircle, ShieldCheck, Sun } from 'lucide-react';
import { createTripWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import {
  getTripTitle,
  getTripDestination,
  getTripDuration,
  getTripNextDate
} from '../utils/localized';

interface TripDetailsModalProps {
  trip: Trip | null;
  onClose: () => void;
  onBook: (trip: Trip) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ trip, onClose, onBook }) => {
  const { language, t, isRTL } = useLanguage();
  if (!trip) return null;

  const title = getTripTitle(trip, language);
  const destination = getTripDestination(trip, language);
  const duration = getTripDuration(trip, language);
  const nextDate = getTripNextDate(trip, language);

  const weatherTemp = trip.weather?.temp || (trip.region === 'Désert & Dunes' ? '26°C' : trip.region === 'Plages & Surf' ? '24°C' : '22°C');
  const weatherCondition = language === 'ar'
    ? (trip.weather?.conditionAr || 'مشمس وصافٍ')
    : language === 'en'
    ? (trip.weather?.conditionEn || 'Sunny & Clear')
    : (trip.weather?.condition || 'Ensoleillé & Ciel clair');

  const directWhatsAppUrl = createTripWhatsAppUrl(trip, { lang: language });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header Bar with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
              {trip.region}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {duration}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label={t.modalClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-7">
          {/* Main Image Banner */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] max-h-80 bg-slate-100">
            <img
              src={trip.image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 start-4 end-4 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 mb-1">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{destination}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {title}
              </h2>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">
                {language === 'ar' ? 'المدة' : 'Durée'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{duration}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">
                {language === 'ar' ? 'الانطلاق' : 'Prochain départ'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{nextDate}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">
                {language === 'ar' ? 'حجم المجموعة' : 'Taille groupe'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{trip.groupSize}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">
                {language === 'ar' ? 'مدن الانطلاق' : 'Villes départ'}
              </span>
              <span className="font-bold text-slate-800 mt-0.5 block truncate">
                {trip.departureCities.join(', ')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase">
                {t.modalWeatherLabel}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 mt-0.5">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate" title={`${weatherTemp} - ${weatherCondition}`}>
                  {weatherTemp} • {weatherCondition}
                </span>
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{t.modalProgramTitle}</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {trip.days} {language === 'ar' ? 'أيام مفصلة' : 'jours'}
              </span>
            </h3>

            <div className={`space-y-3.5 border-s-2 border-blue-200 ${isRTL ? 'mr-3 pr-4 sm:pr-6' : 'ml-3 pl-4 sm:pl-6'}`}>
              {trip.itinerary.map((item) => {
                const dayForecast = trip.weather?.dailyForecast?.find(df => df.day === item.day);
                const dayCondition = language === 'ar'
                  ? (dayForecast?.conditionAr || dayForecast?.condition)
                  : language === 'en'
                  ? (dayForecast?.conditionEn || dayForecast?.condition)
                  : dayForecast?.condition;

                return (
                  <div key={item.day} className="relative group">
                    {/* Timeline dot */}
                    <div className={`absolute ${isRTL ? '-right-[23px] sm:-right-[31px]' : '-left-[23px] sm:-left-[31px]'} top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs`}></div>
                    
                    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider block">
                          {language === 'ar' ? `اليوم ${item.day}` : `Jour ${item.day}`}
                        </span>
                        {dayForecast && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50/90 px-2.5 py-0.5 rounded-full border border-amber-200/60 shadow-xs">
                            <Sun className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{dayForecast.temp} {dayCondition && `• ${dayCondition}`}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Included / Not Included */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2.5">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.modalIncludedTitle}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {trip.included.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 space-y-2.5">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600" />
                <span>{t.modalNotIncludedTitle}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {trip.notIncluded.map((notInc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{notInc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reassurance */}
          <div className="flex items-center gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{t.modalGuarantee}</span>
          </div>
        </div>

        {/* Modal Fixed Footer CTA */}
        <div className="sticky bottom-0 z-20 px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 font-medium block">{t.modalTotalPrice}</span>
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
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onBook(trip);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {t.cardCustomize}
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t.modalBookWA}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
