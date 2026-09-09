import React from 'react';
import { REVIEWS_DATA } from '../data/tripsData';
import { Star, CheckCircle, Quote, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Reviews: React.FC = () => {
  const { language, t } = useLanguage();

  const getLocalizedReview = (rev: typeof REVIEWS_DATA[0]) => {
    if (language === 'ar') {
      switch (rev.id) {
        case 'rev-1':
          return {
            city: 'الدار البيضاء',
            tripTitle: 'سحر صحراء مرزوكة',
            comment: 'تجربة لا تُنسى في مرزوكة! المخيم الصحراوي كان فائق الروعة بنظافته وتوفره على ماء ساخن ودوش خاص، وسهرة النار مع الطرب الكناوي تحت النجوم كانت ساحرة. تنظيم احترافي وأخلاق عالية.'
          };
        case 'rev-2':
          return {
            city: 'الرباط',
            tripTitle: 'شفشاون وطنجة',
            comment: 'سافرت بمفردي وكنت متخوفة في البداية، لكن بمجرد وصولي شعرت أنني وسط عائلتي. المجموعة كانت راقية جداً والمرافقون يحرصون على كل صغيرة وكبيرة.'
          };
        case 'rev-3':
          return {
            city: 'مراكش',
            tripTitle: 'الداخلة واللاغون الأبيض',
            comment: 'الداخلة مع سمارت أورغا كانت أروع عطلة قضيناها أنا وزوجتي! التنسيق عبر الواتساب فائق السرعة، والوجبات وسائقي الدفع الرباعي 4x4 كانوا في قمة الاحتراف.'
          };
        default:
          return { city: rev.city, tripTitle: rev.tripTitle, comment: rev.comment };
      }
    }
    if (language === 'en') {
      switch (rev.id) {
        case 'rev-1':
          return {
            city: 'Casablanca',
            tripTitle: 'Merzouga Desert Magic',
            comment: 'An unforgettable experience in Merzouga! The luxury bivouac was impeccably clean with private showers and hot water. The Gnawa campfire evening under the desert stars was pure magic.'
          };
        case 'rev-2':
          return {
            city: 'Rabat',
            tripTitle: 'Chefchaouen & Tangier',
            comment: 'My first time traveling solo, and I felt right at home immediately! The group atmosphere was warm, kind, and the tour leader took care of every single detail.'
          };
        case 'rev-3':
          return {
            city: 'Marrakech',
            tripTitle: 'Dakhla & White Dune',
            comment: 'Dakhla with Smart Orga was the best vacation my wife and I ever took. Instant WhatsApp replies, delicious oceanfront meals, and skilled 4x4 dune drivers.'
          };
        default:
          return { city: rev.city, tripTitle: rev.tripTitle, comment: rev.comment };
      }
    }
    return { city: rev.city, tripTitle: rev.tripTitle, comment: rev.comment };
  };

  return (
    <section id="avis" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {t.reviewsBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.reviewsTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {t.reviewsSubtitle}
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-extrabold text-slate-900 text-sm">4.9 / 5</span>
              <span className="text-slate-500 block">{t.reviewsAvg}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS_DATA.map((review) => {
            const localized = getLocalizedReview(review);
            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>

                  <div className="relative">
                    <Quote className="w-8 h-8 text-blue-100 absolute -top-2 start-0 -z-0 opacity-70" />
                    <p className="text-xs sm:text-sm text-slate-700 relative z-10 leading-relaxed italic">
                      "{localized.comment}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-blue-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {review.name}
                      </h4>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {localized.city} • <span className="text-blue-600 font-medium">{localized.tripTitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
