import React from 'react';
import { MessageCircle, Mail, MapPin, Instagram, Facebook, ShieldCheck } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER, WHATSAPP_DISPLAY_2, WHATSAPP_NUMBER_2, AGENCY_EMAIL, AGENCY_ADDRESS } from '../data/tripsData';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenSurMesure?: () => void;
  onSelectTag?: (tag: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const { language, t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const destinationItems: { key: string; label: string }[] = [
    { key: 'nord', label: t.catNord },
    { key: 'sud', label: t.catSud },
    { key: 'atlas', label: t.catAtlas },
    { key: 'desert', label: t.catDesert },
    { key: 'etranger', label: t.catEtranger }
  ];

  const handleDestinationClick = (key: string) => {
    if (onSelectCategory) {
      onSelectCategory(key);
    } else {
      scrollTo('sejours');
    }
  };

  return (
    <footer className="bg-white text-slate-600 pt-10 pb-8 sm:pt-16 sm:pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-slate-100">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center">
              <img
                src="/assets/smart-orga.png"
                alt="Smart Orga"
                className="h-11 sm:h-14 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pe-2 sm:pe-4">
              {t.footerDesc}
            </p>

            <div className="pt-1 sm:pt-2 flex items-center gap-2.5 sm:gap-3">
              <a
                href="https://www.instagram.com/smart_orga/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-600"
                aria-label="Instagram @smart_orga"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-slate-600"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={createGeneralWhatsAppUrl(undefined, language)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-slate-600"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Destinations (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerDestTitle}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
              {destinationItems.map((dest) => (
                <li key={dest.key}>
                  <button
                    type="button"
                    onClick={() => handleDestinationClick(dest.key)}
                    className="hover:text-blue-600 transition-colors cursor-pointer text-start inline-flex items-center gap-2 group"
                  >
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors font-bold">•</span>
                    <span>{dest.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerNavTitle}
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('sejours')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start block"
                >
                  {t.navSejours}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('pourquoi-nous')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start block"
                >
                  {t.navPourquoiNous}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('qui-sommes-nous')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start block"
                >
                  {t.footerNavTeam || (language === 'ar' ? 'فريقنا' : language === 'en' ? 'Our Team' : 'Notre Équipe')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('faq')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start block"
                >
                  {t.navFAQ}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Réservations (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerContactTitle}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2 sm:gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium leading-snug">
                  {language === 'ar' ? 'الدار البيضاء / الرباط، المغرب' : AGENCY_ADDRESS}
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-semibold block text-xs">
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </span>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <a
                      href={createGeneralWhatsAppUrl(undefined, language, WHATSAPP_NUMBER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors font-medium text-slate-700"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                    <a
                      href={createGeneralWhatsAppUrl(undefined, language, WHATSAPP_NUMBER_2)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors font-medium text-slate-700"
                    >
                      {WHATSAPP_DISPLAY_2}
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2 sm:gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-semibold block text-xs">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </span>
                  <a
                    href={`mailto:${AGENCY_EMAIL}`}
                    className="hover:text-blue-600 transition-colors font-medium text-slate-700 block mt-0.5"
                  >
                    {AGENCY_EMAIL}
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-1 sm:pt-1.5">
              <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-600 flex items-center gap-2 leading-snug">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.footerLicence}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Legal */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 sm:gap-4 text-center sm:text-start">
          <p>© 2026 {t.footerRights}</p>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">{t.footerCGV}</span>
            <span>•</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">{t.footerData}</span>
            <span>•</span>
            <span className="text-blue-600 font-medium">{t.footerMadeIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
