import React, { useState } from 'react';
import { Trip, BookingFormData } from '../types';
import { X, MessageCircle, Calendar, Users, MapPin, ShieldCheck } from 'lucide-react';
import { createFormBookingWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { getTripTitle, getTripDuration } from '../utils/localized';

interface BookingModalProps {
  trip: Trip | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ trip, onClose }) => {
  const { language, t } = useLanguage();
  if (!trip) return null;

  const tripTitle = getTripTitle(trip, language);
  const tripDuration = getTripDuration(trip, language);

  const [formData, setFormData] = useState<BookingFormData>({
    tripTitle: trip.title,
    fullName: '',
    phone: '',
    departureCity: trip.departureCities[0] || 'Casablanca',
    departureDate: trip.nextDate,
    travelersCount: 2,
    customNotes: ''
  });

  const estimatedTotal = trip.priceMAD * formData.travelersCount;
  const whatsappUrl = createFormBookingWhatsAppUrl(formData, trip, language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{t.bookModalTitle}</h3>
              <p className="text-xs text-blue-100">{t.bookModalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label={t.modalClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Trip Recap */}
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center gap-3">
          <img
            src={trip.image}
            alt={tripTitle}
            className="w-14 h-14 rounded-xl object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
              {tripTitle}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{tripDuration}</span>
              <span>•</span>
              <span className="font-bold text-blue-600">{trip.priceMAD.toLocaleString()} MAD / {language === 'ar' ? 'فرد' : 'pers'}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Number of Travelers & Departure City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                {t.bookTravelers}
              </label>
              <select
                value={formData.travelersCount}
                onChange={(e) => setFormData({ ...formData, travelersCount: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10].map((n) => (
                  <option key={n} value={n}>
                    {n} {language === 'ar' ? (n > 1 ? 'أشخاص' : 'شخص') : n > 1 ? 'personnes' : 'personne'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {t.bookPickupCity}
              </label>
              <select
                value={formData.departureCity}
                onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
              >
                {trip.departureCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="Autre ville">{language === 'ar' ? 'مدينة أخرى (عند الطلب)' : 'Autre ville (sur demande)'}</option>
              </select>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              {t.bookDate}
            </label>
            <input
              type="text"
              value={formData.departureDate}
              onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
              placeholder={t.bookDatePlaceholder}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t.bookFullName}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={t.bookFullNamePlaceholder}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t.bookPhone}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 XX XX XX XX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {t.bookNotes}
            </label>
            <textarea
              rows={2}
              value={formData.customNotes}
              onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
              placeholder={t.bookNotesPlaceholder}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
            ></textarea>
          </div>

          {/* Live Price Estimation */}
          <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-900 font-bold block">
                {t.bookEstTotal} ({formData.travelersCount} {language === 'ar' ? 'أشخاص' : 'pers.'}) :
              </span>
              <span className="text-xs text-blue-700">{t.bookNoHiddenFees}</span>
            </div>
            <div className="text-xl font-extrabold text-blue-900">
              {estimatedTotal.toLocaleString()} MAD
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.bookSecurityNotice}</span>
          </div>

          {/* Submit WhatsApp Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t.bookSubmitBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
