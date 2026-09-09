import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Menu, X, Phone, CalendarCheck, MapPin, ChevronDown, Check } from 'lucide-react';
import { WHATSAPP_DISPLAY } from '../data/tripsData';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface NavbarProps {
  onOpenSurMesure?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const { language, setLanguage, t, isRTL } = useLanguage();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  const languages: { code: Language; label: string; fullLabel: string; flag: string }[] = [
    { code: 'fr', label: 'FR', fullLabel: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', fullLabel: 'العربية', flag: '🇲🇦' },
    { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find((item) => item.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      {/* Top subtle bar */}
      <div className="bg-slate-50 text-slate-600 text-xs py-1.5 px-4 hidden md:block border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.topAgency}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {t.topRegions}
            </span>
          </div>

          <a
            href={createGeneralWhatsAppUrl(undefined, language)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 transition-colors font-medium"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>{t.topWhatsApp} : <strong className="text-slate-900 font-bold">{WHATSAPP_DISPLAY}</strong></span>
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center group focus:outline-none shrink-0 py-1"
            aria-label="Smart Orga Accueil"
          >
            <img
              src="/assets/smart-orga.png"
              alt="Smart Orga"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToSection('sejours')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            >
              {t.navSejours}
            </button>
            <button
              onClick={() => scrollToSection('qui-sommes-nous')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            >
              {t.navQuiSommesNous}
            </button>
            <button
              onClick={() => scrollToSection('pourquoi-nous')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            >
              {t.navPourquoiNous}
            </button>
            <button
              onClick={() => scrollToSection('instagram')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-pink-600 rounded-lg transition-colors cursor-pointer"
            >
              {t.navInstagram}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
            >
              {t.navFAQ}
            </button>
          </nav>

          {/* Desktop Controls (Language Switcher & Admin) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
              >
                <span className="text-sm leading-none">{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    langDropdownOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div
                  className={`absolute ${
                    isRTL ? 'left-0' : 'right-0'
                  } mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150`}
                >
                  <div className="px-3 py-1 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                    {language === 'ar' ? 'اختر اللغة' : language === 'en' ? 'Select Language' : 'Choisir la langue'}
                  </div>
                  {languages.map((item) => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{item.flag}</span>
                          <span>{item.fullLabel}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right Controls: Language Dropdown + WhatsApp Icon + Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Mobile Language Dropdown */}
            <div className="relative" ref={mobileDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                aria-expanded={langDropdownOpen}
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.label}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    langDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute ${
                    isRTL ? 'left-0' : 'right-0'
                  } mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50`}
                >
                  {languages.map((item) => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-xs flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.fullLabel}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu de navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <button
            onClick={() => scrollToSection('sejours')}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50`}
          >
            {t.navSejours}
          </button>
          <button
            onClick={() => scrollToSection('qui-sommes-nous')}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50`}
          >
            {t.navQuiSommesNous}
          </button>
          <button
            onClick={() => scrollToSection('pourquoi-nous')}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50`}
          >
            {t.navPourquoiNous}
          </button>
          <button
            onClick={() => scrollToSection('instagram')}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 text-pink-600 font-semibold`}
          >
            {t.navInstagram}
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className={`w-full ${isRTL ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50`}
          >
            {t.navFAQ}
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="px-2">
              <span className="text-xs font-bold text-slate-400 block mb-2">
                {language === 'ar' ? 'اللغة' : 'LANGUE / LANGUAGE'}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                      language === item.code
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <a
              href={createGeneralWhatsAppUrl(undefined, language)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t.ctaWhatsApp} ({WHATSAPP_DISPLAY})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
