import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { createSurMesureWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface SurMesureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurMesureModal: React.FC<SurMesureModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('3 à 4 jours');
  const [groupSize, setGroupSize] = useState('Famille ou Amis (4 à 10 pers)');
  const [budget, setBudget] = useState('1 500 - 2 500 MAD / pers');
  const [date, setDate] = useState('');
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = createSurMesureWhatsAppUrl(
      {
        destination,
        duration,
        groupSize,
        budget,
        date,
        comments
      },
      language
    );
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{t.surMesureModalTitle}</h3>
              <p className="text-xs text-amber-100">{t.surMesureModalSubtitle}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              {t.surMesureDest}
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={t.surMesureDestPlaceholder}
              required
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {t.surMesureDuration}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Week-end (2 jours / 1 nuit)">{language === 'ar' ? 'عطلة نهاية أسبوع (يومان / ليلة)' : 'Week-end (2j / 1n)'}</option>
                <option value="Court séjour (3 jours / 2 nuits)">{language === 'ar' ? 'رحلة قصيرة (3 أيام / ليلتان)' : '3 jours / 2 nuits'}</option>
                <option value="Séjour moyen (4 à 5 jours)">{language === 'ar' ? 'رحلة متوسطة (4 إلى 5 أيام)' : '4 à 5 jours'}</option>
                <option value="Grand circuit (6 jours et +)">{language === 'ar' ? 'جولة كبرى (6 أيام فأكثر)' : '6 jours et plus'}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                {t.surMesureGroup}
              </label>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Couple ou Duo (2 pers)">{language === 'ar' ? 'زوجان أو ثنائي (شخصان)' : 'Couple ou Duo (2 pers)'}</option>
                <option value="Famille ou Amis (4 à 10 pers)">{language === 'ar' ? 'عائلة أو أصدقاء (4 إلى 10 أشخاص)' : 'Famille / Amis (4 à 10 pers)'}</option>
                <option value="Groupe d'amis élargi (10 à 20 pers)">{language === 'ar' ? 'مجموعة كبرى (10 إلى 20 شخص)' : 'Groupe (10 à 20 pers)'}</option>
                <option value="Entreprise / Séminaire CE (20 pers et +)">{language === 'ar' ? 'شركات وفِرق عمل (20+ شخص)' : 'Entreprise / CE (20+ pers)'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {t.surMesurePeriod}
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder={t.surMesurePeriodPlaceholder}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                {t.surMesureBudget}
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Ex : ~1 800 MAD / pers"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {t.surMesureWishes}
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t.surMesureWishesPlaceholder}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{t.surMesureSubmitBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
