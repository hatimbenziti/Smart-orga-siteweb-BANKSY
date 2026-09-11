import React, { useState, useMemo } from 'react';
import { loadCmsFaq } from '../data/tripsData';
import { FAQItem } from '../types';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language, t, isRTL } = useLanguage();

  // 100% dynamic loading of all FAQ collection files from /content/faq
  const faqList = useMemo<FAQItem[]>(() => {
    return loadCmsFaq();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getLocalizedFAQ = (item: FAQItem) => {
    if (language === 'ar') {
      return {
        q: item.questionAr || item.question,
        a: item.answerAr || item.answer
      };
    }
    if (language === 'en') {
      return {
        q: item.questionEn || item.question,
        a: item.answerEn || item.answer
      };
    }
    return {
      q: item.question,
      a: item.answer
    };
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            {t.faqBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3.5">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            const localized = getLocalizedFAQ(item);
            return (
              <div
                key={item.id || index}
                className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all bg-white shadow-xs"
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full px-5 py-4 ${isRTL ? 'text-right' : 'text-left'} flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer bg-slate-50/50 hover:bg-slate-50`}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100/60 w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{localized.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white animate-in fade-in duration-200">
                    <p className="whitespace-pre-line">{localized.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reassurance banner below FAQ */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {t.faqExtraTitle}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              {t.faqExtraDesc}
            </p>
          </div>
          <a
            href={createGeneralWhatsAppUrl('Question avant réservation', language)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t.faqExtraBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

