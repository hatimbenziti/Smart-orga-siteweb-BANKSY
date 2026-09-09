import React from 'react';
import { MessageCircle, Mail, MapPin, Instagram, Facebook, ShieldCheck } from 'lucide-react';
import { WHATSAPP_DISPLAY, AGENCY_EMAIL, AGENCY_ADDRESS } from '../data/tripsData';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenSurMesure?: () => void;
  onSelectTag: (tag: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTag }) => {
  const { language, t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-slate-600 pt-16 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center">
              <img
                src="/assets/smart-orga.png"
                alt="Smart Orga"
                className="h-13 sm:h-16 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pe-4">
              {t.footerDesc}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/smart_orga/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white flex items-center justify-center transition-all text-slate-600"
                aria-label="Instagram @smart_orga"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors text-slate-600"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={createGeneralWhatsAppUrl(undefined, language)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors text-slate-600"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Destinations (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerDestTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button
                  onClick={() => onSelectTag('Désert & Dunes')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'صحراء مرزوكة وزاكورة' : 'Désert de Merzouga & Zagora'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Plages & Surf')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'الداخلة واللاغون الأبيض' : 'Dakhla Sahara & Lagon'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Villes Impériales')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'شفشاون وطنجة العالية' : 'Chefchaouen & Tanger'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Villes Impériales')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'فاس ومولاي يعقوب' : 'Fès & Moulay Yacoub'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Nature & Randonnée')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'إفران' : 'Ifrane'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Nature & Randonnée')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'مراكش وإمليل' : 'Marrakech & Imlil'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Plages & Surf')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'تاغازوت وأكادير ووادي الجنة' : 'Agadir, Taghazout & Paradise'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTag('Nature & Randonnée')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-start"
                >
                  {language === 'ar' ? 'شلالات أوزود وبحيرة بين الويدان' : "Cascades d'Ouzoud & Bin El Ouidane"}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Liens Rapides (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerNavTitle}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <button
                  onClick={() => scrollTo('sejours')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t.navSejours}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('qui-sommes-nous')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t.navQuiSommesNous}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('pourquoi-nous')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t.navPourquoiNous}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq')}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {t.navFAQ}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Agence (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t.footerContactTitle}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-semibold block">
                    {language === 'ar' ? 'العنوان' : 'Adresse'}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {language === 'ar' ? 'الدار البيضاء / الرباط، المغرب' : AGENCY_ADDRESS}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-semibold block">
                    {language === 'ar' ? 'دعم واتساب' : 'Support WhatsApp'}
                  </span>
                  <a
                    href={createGeneralWhatsAppUrl(undefined, language)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 transition-colors font-medium text-slate-800"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-900 font-semibold block">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </span>
                  <a href={`mailto:${AGENCY_EMAIL}`} className="hover:text-blue-600 transition-colors font-medium text-slate-800">
                    {AGENCY_EMAIL}
                  </a>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.footerLicence}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {t.footerRights}</p>
          <div className="flex items-center gap-4">
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
