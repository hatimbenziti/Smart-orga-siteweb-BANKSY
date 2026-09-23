import React from 'react';
import { Bus, Hotel, Users2, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const WhyUs: React.FC = () => {
  const { t, isRTL } = useLanguage();

  // Desktop / Tablet advantages (6 cards preserved identically)
  const advantages = [
    {
      icon: Bus,
      title: t.why1Title,
      description: t.why1Desc,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Hotel,
      title: t.why2Title,
      description: t.why2Desc,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: Users2,
      title: t.why3Title,
      description: t.why3Desc,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: ShieldCheck,
      title: t.why4Title,
      description: t.why4Desc,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: HeartHandshake,
      title: t.why5Title,
      description: t.why5Desc,
      color: 'bg-rose-50 text-rose-600'
    },
    {
      icon: PhoneCall,
      title: t.why6Title,
      description: t.why6Desc,
      color: 'bg-teal-50 text-teal-600'
    }
  ];

  // Mobile advantages (4 compact cards in a 2x2 grid, grouping transport/accommodation and atmosphere/guides)
  const mobileAdvantages = [
    {
      icon: Bus,
      title: t.whyMobile1Title,
      description: t.whyMobile1Desc,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Users2,
      title: t.whyMobile2Title,
      description: t.whyMobile2Desc,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: ShieldCheck,
      title: t.whyMobile3Title,
      description: t.whyMobile3Desc,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: PhoneCall,
      title: t.whyMobile4Title,
      description: t.whyMobile4Desc,
      color: 'bg-teal-50 text-teal-600'
    }
  ];

  return (
    <section id="pourquoi-nous" className="pt-6 pb-10 md:py-16 bg-white border-t border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12 space-y-3">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            {t.whyBadge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.whyTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t.whySubtitle}
          </p>
        </div>

        {/* 1. Mobile Version (< md) : 4 compact cards in a 2x2 grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:hidden">
          {mobileAdvantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <div
                key={index}
                className="rounded-xl bg-slate-50/70 border border-slate-200/70 p-3 flex flex-col justify-start space-y-1.5 shadow-2xs"
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${adv.color}`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <h3 className={`text-[12px] sm:text-xs font-bold text-slate-900 leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>
                  {adv.title}
                </h3>
                <p className={`text-[10px] sm:text-[11px] text-slate-600 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2. Desktop / Tablet Version (>= md) : 6 cards grid strictly identical to original */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 p-6 space-y-3 flex flex-col justify-start"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${adv.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {adv.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
