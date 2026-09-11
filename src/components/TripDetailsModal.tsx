import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Trip } from '../types';
import { X, Check, Clock, Calendar, Users, MapPin, MessageCircle, ShieldCheck, Sun, FileText, AlertCircle } from 'lucide-react';
import { createTripWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import {
  getTripTitle,
  getTripDestination,
  getTripDuration,
  getTripNextDate
} from '../utils/localized';

const defaultIncluded = [
  'Transport touristique tout confort climatisé A/R',
  'Hébergement en demi-pension ou formule adaptée',
  'Accompagnateur dédié & assistance 24h/24 Smart Orga'
];

const defaultExcluded = [
  'Déjeuners libres en cours de route',
  'Boissons et dépenses personnelles'
];

const defaultCancellationPolicy = `Politique d'annulation
Pour toute annulation effectuée plus de 15 jours avant la date du départ, le remboursement est total (100 %).

Pour toute annulation effectuée entre 7 et 15 jours avant le départ, un remboursement de 50 % du montant versé sera effectué.

Pour toute annulation ou réservation effectuée moins de 7 jours avant le départ, aucun remboursement ne sera possible.

En cas d’annulation par l’organisateur, le montant total sera remboursé au participant.`;

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

  // Compute full program content with markdown formatting
  const programContent = (() => {
    const customText = (trip.program || trip.body || '').trim();

    if (Array.isArray(trip.itinerary) && trip.itinerary.length > 0) {
      if (customText.length > 160) {
        return customText;
      }

      const sections = trip.itinerary.map((item) => {
        const itemTitle = language === 'ar'
          ? (item.titleAr || item.title)
          : language === 'en'
          ? (item.titleEn || item.title)
          : item.title;
        const itemDesc = language === 'ar'
          ? (item.descriptionAr || item.description)
          : language === 'en'
          ? (item.descriptionEn || item.description)
          : item.description;

        return `### ${itemTitle}\n\n${itemDesc}`;
      }).join('\n\n');

      if (customText.length > 0 && !sections.includes(customText)) {
        return `${customText}\n\n${sections}`;
      }
      return sections;
    }

    return customText;
  })();

  // Included / Excluded / Cancellation Policy
  const includedList = Array.isArray(trip.included) && trip.included.length > 0
    ? trip.included
    : defaultIncluded;

  const excludedList = Array.isArray(trip.excluded) && trip.excluded.length > 0
    ? trip.excluded
    : (Array.isArray(trip.notIncluded) && trip.notIncluded.length > 0
        ? trip.notIncluded
        : defaultExcluded);

  const rawCancellation = (trip.cancellation_policy || trip.cancellationPolicy || '').trim() || defaultCancellationPolicy;
  const cleanedCancellation = rawCancellation.replace(/^Politique d'annulation\s*(\r?\n)+/i, '');

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
        <div className="overflow-y-auto p-6 space-y-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm">
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
              <div className="flex items-start gap-1.5 font-bold text-slate-800 mt-0.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 self-start mt-0.5" />
                <span className="leading-snug break-words">
                  {trip.departureCities.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Météo des jours du voyage (En haut du programme) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-blue-500/10 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {t.modalWeatherForecastTitle || (language === 'ar' ? 'حالة الطقس وتوقعات الأيام' : 'Météo des jours du voyage')}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {destination} • {weatherTemp} ({weatherCondition})
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300/60 shadow-xs">
                <Sun className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{weatherTemp} • {weatherCondition}</span>
              </span>
            </div>

            {/* Daily forecast cards */}
            {trip.weather?.dailyForecast && trip.weather.dailyForecast.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
                {trip.weather.dailyForecast.map((df) => {
                  const dayCond = language === 'ar'
                    ? (df.conditionAr || df.condition)
                    : language === 'en'
                    ? (df.conditionEn || df.condition)
                    : df.condition;

                  return (
                    <div
                      key={df.day}
                      className="bg-white/95 rounded-xl p-2.5 border border-amber-200/60 shadow-xs flex items-center gap-2.5 transition-all hover:border-amber-400/80 hover:shadow-xs"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Sun className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-extrabold text-blue-700 uppercase">
                            {language === 'ar' ? `اليوم ${df.day}` : `Jour ${df.day}`}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{df.temp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate font-medium mt-0.5" title={dayCond}>
                          {dayCond}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-700 bg-white/90 rounded-xl p-3 border border-amber-200/50 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {language === 'ar'
                    ? `أجواء ممتازة متوقعة طيلة أيام الرحلة : معدل حرارة ${weatherTemp} مع طقس ${weatherCondition}.`
                    : `Conditions optimales prévues durant le séjour : températures moyennes de ${weatherTemp} avec un climat ${weatherCondition}.`}
                </span>
              </div>
            )}
          </div>

          {/* Programme Complet du Voyage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{t.modalProgramTitle || (language === 'ar' ? 'البرنامج الكامل للرحلة' : 'Programme complet du voyage')}</span>
              </h3>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-3 py-1 rounded-full">
                {duration}
              </span>
            </div>

            <div className="bg-slate-50/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              {programContent ? (
                <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-3">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-3.5 mb-2 first:mt-0" {...props} />,
                      h3: ({ node, ...props }) => (
                        <h4 className="text-sm sm:text-base font-bold text-blue-900 mt-4 mb-2 first:mt-0 flex items-center gap-2 bg-blue-100/60 text-blue-900 px-3.5 py-2 rounded-xl border-s-4 border-blue-600 shadow-xs" {...props} />
                      ),
                      h4: ({ node, ...props }) => <h5 className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1.5" {...props} />,
                      p: ({ node, ...props }) => <p className="text-slate-600 leading-relaxed mb-3 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ps-5 space-y-1.5 my-2.5 text-slate-600" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ps-5 space-y-1.5 my-2.5 text-slate-600" {...props} />,
                      li: ({ node, ...props }) => <li className="ps-0.5" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                    }}
                  >
                    {programContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  {language === 'ar' ? 'تفاصيل البرنامج الكامل ستتوفر قريباً.' : 'Le programme complet et détaillé du voyage sera communiqué prochainement.'}
                </p>
              )}
            </div>
          </div>

          {/* Included / Not Included */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-100 space-y-2.5">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.modalIncludedTitle}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {includedList.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-100 space-y-2.5">
              <h4 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
                <X className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{t.modalNotIncludedTitle}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-800">
                {excludedList.map((notInc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{notInc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Politique d'annulation */}
          <div className="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/70 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.modalCancellationTitle || "Politique d'annulation"}</span>
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
              {cleanedCancellation}
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
