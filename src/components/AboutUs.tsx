import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Compass, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

export const AboutUs: React.FC = () => {
  const { language, t, isRTL } = useLanguage();

  const teamMembers = [
    {
      id: 1,
      name: t.teamMember1Name,
      role: t.teamMember1Role,
      bio: t.teamMember1Bio,
      specialty: t.teamMember1Specialty,
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&h=500&q=80',
    },
    {
      id: 2,
      name: t.teamMember2Name,
      role: t.teamMember2Role,
      bio: t.teamMember2Bio,
      specialty: t.teamMember2Specialty,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&h=500&q=80',
    },
    {
      id: 3,
      name: t.teamMember3Name,
      role: t.teamMember3Role,
      bio: t.teamMember3Bio,
      specialty: t.teamMember3Specialty,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500&q=80',
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
    <section id="qui-sommes-nous" className="py-16 sm:py-24 bg-white border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
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

        {/* Team Grid - 3 Column Cards Matching Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
