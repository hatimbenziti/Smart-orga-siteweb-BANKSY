import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Compass, ShieldCheck, HeartHandshake, Leaf, ChevronRight, ChevronLeft, X } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  specialty: string;
  photo: string;
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
    },
    {
      id: 2,
      name: t.teamMember2Name,
      role: t.teamMember2Role,
      bio: t.teamMember2Bio,
      specialty: t.teamMember2Specialty,
      photo: '/assets/chaimaa.png',
    },
    {
      id: 3,
      name: t.teamMember3Name,
      role: t.teamMember3Role,
      bio: t.teamMember3Bio,
      specialty: t.teamMember3Specialty,
      photo: '/assets/hatim.png',
    },
    {
      id: 4,
      name: t.teamMember4Name,
      role: t.teamMember4Role,
      bio: t.teamMember4Bio,
      specialty: t.teamMember4Specialty,
      photo: '/assets/wissal.jpeg',
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
    <section id="qui-sommes-nous" className="py-12 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        
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
            <button
              key={member.id}
              type="button"
              onClick={() => setSelectedMember(member)}
              className="w-full text-start bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs hover:border-blue-200 active:scale-[0.99] transition-all flex items-center gap-3.5 group cursor-pointer focus:outline-hidden"
              aria-haspopup="dialog"
            >
              {/* Circular Avatar (64px) */}
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-slate-100 group-hover:ring-blue-100 shadow-xs">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5 truncate">
                  {member.role}
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-1 line-clamp-2">
                  {member.bio}
                </p>
              </div>

              {/* Subtle Arrow Indicator */}
              <div className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors">
                {isRTL ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Member Full Details Modal */}
        {selectedMember && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-member-modal-name"
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:hidden animate-in fade-in duration-200"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="relative bg-white rounded-3xl max-w-sm w-full shadow-2xl p-6 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Discreet Close Button "×" */}
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className={`absolute top-3.5 ${
                  isRTL ? 'left-3.5' : 'right-3.5'
                } w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer`}
                aria-label={t.modalClose}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col items-center text-center">
                {/* Profile Photo */}
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-sm shrink-0 mb-3.5">
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Name */}
                <h3
                  id="team-member-modal-name"
                  className="text-lg font-bold text-slate-900 leading-snug"
                >
                  {selectedMember.name}
                </h3>

                {/* Role */}
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  {selectedMember.role}
                </p>

                {/* Specialty Tag (Domain/label professionnel) */}
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{selectedMember.specialty}</span>
                  </span>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-slate-100 my-4" />

                {/* Complete Description (Desktop text) */}
                <p
                  className={`text-xs text-slate-600 leading-relaxed ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {selectedMember.bio}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Team Grid (sm and up) - 4 Column Cards (Strictly unchanged) */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 text-center shadow-xs hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center group"
            >
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
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                {member.bio}
              </p>

              {/* Specialty Tag */}
              <div className="pt-3 border-t border-slate-100 w-full flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{member.specialty}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Values & Engagements */}
        <div className="pt-6 border-t border-slate-100">
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
