import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { createGeneralWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const { language, t, isRTL } = useLanguage();

  return (
    <div className={`fixed bottom-6 ${isRTL ? 'left-6 items-start' : 'right-6 items-end'} z-40 flex flex-col`}>
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="mb-3 p-3 bg-white rounded-2xl shadow-xl border border-slate-200 text-xs text-slate-700 max-w-[220px] relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className={`absolute -top-1.5 ${isRTL ? '-left-1.5' : '-right-1.5'} w-5 h-5 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-600 text-[10px] cursor-pointer`}
            aria-label={t.modalClose}
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.floatingOnline}</span>
          </div>
          <p className="text-[11px] text-slate-600">
            {t.floatingHelp}
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={createGeneralWhatsAppUrl(undefined, language)}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group relative cursor-pointer"
        aria-label="Contacter Smart Orga sur WhatsApp"
      >
        <span className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} flex h-4 w-4`}>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 text-[9px] font-bold text-white items-center justify-center">
            1
          </span>
        </span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
