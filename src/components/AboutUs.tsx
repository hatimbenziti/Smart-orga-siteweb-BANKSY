import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, ShieldCheck, HeartHandshake, Leaf, ChevronRight, ChevronLeft, X, Instagram } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  specialty: string;
  photo: string;
  instagram: string;
}

export const AboutUs: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (selectedMember) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedMember]);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: t.teamMember1Name,
      role: t.teamMember1Role,
      bio: t.teamMember1Bio,
      specialty: t.teamMember1Specialty,
      photo: '/assets/salah.png',
      instagram: 'https://www.instagram.com/salaheddine_fennan?stkn=MXhrOWxxMGc1aDExNQ==',
    },
    {
      id: 2,
      name: t.teamMember2Name,
      role: t.teamMember2Role,
      bio: t.teamMember2Bio,
      specialty: t.teamMember2Specialty,
      photo: '/assets/chaimaa.png',
      instagram: 'https://www.instagram.com/smart_orga?stkn=OWZyb3o2OWwwMGFl',
    },
    {
      id: 3,
      name: t.teamMember3Name,
      role: t.teamMember3Role,
      bio: t.teamMember3Bio,
      specialty: t.teamMember3Specialty,
      photo: '/assets/hatim.png',
      instagram: 'https://www.instagram.com/hatimbenziti?stkn=MXFzMmp4a2V5eTViag==',
    },
    {
      id: 4,
      name: t.teamMember4Name,
      role: t.teamMember4Role,
      bio: t.teamMember4Bio,
      specialty: t.teamMember4Specialty,
      photo: '/assets/wissal.jpeg',
      instagram: 'https://www.instagram.com/wissal_belachqer?stkn=MWVhMjByd3BjNnZxOQ==',
    },
    {
      id: 5,
      name: t.teamMember5Name,
      role: t.teamMember5Role,
      bio: t.teamMember5Bio,
      specialty: t.teamMember5Specialty,
      photo: '/assets/REDA.png',
      instagram: 'https://www.instagram.com/redachabal?stkn=MWQ2YnVzYzE3dmxibg==',
    },
  ];

  const values = [
    {
      icon: Compass,
      title: t.aboutVal1Title,
      description: t.aboutVal1Desc,
    },
    {
      icon: ShieldCheck,
      title: t.aboutVal2Title,
      description: t.aboutVal2Desc,
    },
    {
      icon: HeartHandshake,
      title: t.aboutVal3Title,
      description: t.aboutVal3Desc,
    },
    {
      icon: Leaf,
      title: t.aboutVal4Title,
      description: t.aboutVal4Desc,
    },
  ];

  return (
    <section id="qui-sommes-nous" className="pt-12 pb-3 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
        
        {/* Header - Matching Image 2 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase block">
            {t.aboutBadge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t.aboutSubtitle}
          </p>
        </div>

        {/* Mobile Team View (< sm) - Horizontal Compact Cards */}
        <div className="sm:hidden space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="w-full text-start bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs hover:border-blue-200 active:scale-[0.99] transition-all group cursor-pointer focus:outline-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedMember(member);
                }
              }}
              aria-haspopup="dialog"
            >
              {/* Main Information Row: Avatar + Full Text Block + Dedicated Lateral Zone */}
              <div className="flex items-center gap-3.5">
                {/* Circular Avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100 group-hover:ring-blue-100 shadow-xs">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Text Information - Full width priority */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5 leading-snug break-words">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1 line-clamp-2">
                    {member.bio}
                  </p>
                </div>

                {/* Dedicated Lateral Zone: Instagram Link & Navigation Arrow */}
                <div className="shrink-0 flex flex-col items-center justify-between self-stretch py-0.5 gap-2">
                  {member.instagram ? (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Instagram - ${member.name}`}
                      className="w-7 h-7 rounded-full bg-slate-50 hover:bg-pink-50 border border-slate-200/80 hover:border-pink-200 text-pink-500 hover:text-pink-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-95"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-500" />
                    </a>
                  ) : null}

                  <div className="text-slate-400 group-hover:text-blue-500 transition-colors my-auto">
                    {isRTL ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Member Full Details Modal - Premium Profile Card */}
        {selectedMember && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-member-modal-name"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative w-[90%] max-w-[400px] max-h-[80vh] bg-white rounded-[26px] shadow-2xl shadow-slate-950/20 border border-slate-100 flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-3 duration-200 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. Upper Visual Banner with soft abstract blue/green gradient & travel detail */}
              <div className="relative h-16 bg-gradient-to-r from-blue-600/10 via-sky-500/10 to-emerald-600/10 shrink-0 overflow-hidden border-b border-slate-100/80">
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <svg className="w-full h-full text-blue-600/30" viewBox="0 0 360 80" fill="none" preserveAspectRatio="none">
                    <path d="M-20 25 C60 65 140 10 220 50 C290 80 340 30 380 45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx="280" cy="32" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="280" cy="32" r="2.5" fill="currentColor" />
                  </svg>
                </div>

                {/* Close Button: small circular button in top corner */}
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className={`absolute top-2.5 ${
                    isRTL ? 'left-2.5' : 'right-2.5'
                  } w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-500 hover:text-slate-800 shadow-xs border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer z-20`}
                  aria-label={t.modalClose}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Fixed Profile Identification Header - Compact vertical cadence */}
              <div className="flex flex-col items-center text-center px-5 pt-0 pb-1.5 shrink-0 relative">
                {/* Photo: ~84px, centered, overlapping upper visual area */}
                <div className="-mt-10 w-[84px] h-[84px] rounded-full overflow-hidden ring-4 ring-white shadow-md shadow-slate-900/10 border border-slate-200/60 bg-white shrink-0 relative z-10">
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Name: Bold and prominent */}
                <h3
                  id="team-member-modal-name"
                  className="text-lg font-bold text-slate-900 tracking-tight mt-1.5 leading-tight"
                >
                  {selectedMember.name}
                </h3>

                {/* Job Title: Smaller, using Smart Orga blue */}
                <p className="text-xs font-semibold text-blue-600 tracking-wide mt-0.5">
                  {selectedMember.role}
                </p>

                {/* Instagram Link (Mobile Popup) - Minimalist & Premium */}
                {selectedMember.instagram ? (
                  <div className="mt-2.5 mb-1 flex items-center justify-center">
                    <a
                      href={selectedMember.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Instagram - ${selectedMember.name}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50/90 hover:bg-pink-50/80 border border-slate-200/80 hover:border-pink-200 text-slate-700 hover:text-pink-600 transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 group/ig"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-500 group-hover/ig:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium tracking-wide">Instagram</span>
                    </a>
                  </div>
                ) : null}

                {/* Subtle Horizontal Divider */}
                <div className="w-10 h-0.5 bg-slate-200/70 rounded-full mt-2 mb-0.5" />
              </div>

              {/* 3. Scrollable Description Area */}
              <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1 min-h-0">
                <p
                  className={`text-xs text-slate-600 leading-relaxed font-normal ${
                    isRTL ? 'text-right' : 'text-center'
                  }`}
                >
                  {selectedMember.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Team Grid (sm and up) */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 text-center shadow-xs hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center group relative"
            >
              {/* Instagram link icon */}
              {member.instagram ? (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram - ${member.name}`}
                  className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-8 h-8 rounded-full bg-slate-50 hover:bg-pink-50 border border-slate-200/80 hover:border-pink-200 text-pink-500 hover:text-pink-600 flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer z-10 group/insta"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4 text-pink-500 group-hover/insta:scale-110 transition-transform" />
                </a>
              ) : null}

              {/* Circular Avatar */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-5 ring-4 ring-slate-100 group-hover:ring-blue-100 shadow-sm transition-all shrink-0">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Name */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-1 mb-3">
                {member.role}
              </p>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Values & Engagements - Desktop only, hidden on mobile */}
        <div className="hidden sm:block pt-6 border-t border-slate-100">
          <div className="text-center mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {t.aboutValuesTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-white hover:shadow-md transition-all duration-300 space-y-2.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {v.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
