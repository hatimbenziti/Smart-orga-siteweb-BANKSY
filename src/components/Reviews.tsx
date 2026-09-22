import React, { useEffect, useState, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchGoogleReviews, ClientReview } from '../services/reviewsService';

export const Reviews: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch reviews on mount or language switch
  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      setIsLoading(true);
      try {
        const data = await fetchGoogleReviews({ language });
        if (isMounted) {
          setReviews(data);
        }
      } catch (err) {
        console.warn('Silent fallback in Reviews component:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Synchronize active dot when user scrolls/swipes
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el || reviews.length === 0) return;

    const scrollLeft = Math.abs(el.scrollLeft);
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth : 300;
    const gap = 24; // gap-6 = 24px
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(0, index), reviews.length - 1));
  };

  const scrollToReview = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const children = el.children;
    if (children[index]) {
      (children[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    const nextIdx = Math.max(0, activeIndex - 1);
    scrollToReview(nextIdx);
  };

  const handleNext = () => {
    if (reviews.length === 0) return;
    const nextIdx = Math.min(reviews.length - 1, activeIndex + 1);
    scrollToReview(nextIdx);
  };

  // Generate color palette for traveler avatar initials based on name
  const getAvatarGradient = (name: string) => {
    const charCode = name.charCodeAt(0) || 65;
    const gradients = [
      'from-blue-600 to-indigo-600 text-white',
      'from-sky-500 to-blue-600 text-white',
      'from-emerald-600 to-teal-700 text-white',
      'from-amber-500 to-orange-600 text-white',
      'from-indigo-600 to-purple-600 text-white'
    ];
    return gradients[charCode % gradients.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'V').toUpperCase();
  };

  return (
    <section
      id="avis"
      className="py-16 sm:py-20 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Small label above */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider shadow-2xs">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{t.reviewsBadge || 'AVIS CLIENTS'}</span>
            </div>

            {/* Main title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.reviewsTitle || 'Ils ont voyagé avec nous'}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t.reviewsSubtitle || 'Découvrez les expériences de notre communauté de voyageurs'}
            </p>
          </div>

          {/* Average Rating Badge & Controls */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-slate-900 text-sm">5.0 / 5</span>
                <span className="text-slate-500 block text-[11px] leading-tight">
                  {t.reviewsAvg || 'Avis vérifiés'}
                </span>
              </div>
            </div>

            {/* Navigation buttons for desktop */}
            {reviews.length > 1 && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={isRTL ? handleNext : handlePrev}
                  disabled={activeIndex === 0}
                  className={`p-2.5 rounded-xl border border-slate-200 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    activeIndex === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs active:scale-95'
                  }`}
                  aria-label="Avis précédent"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={isRTL ? handlePrev : handleNext}
                  disabled={activeIndex >= reviews.length - 1}
                  className={`p-2.5 rounded-xl border border-slate-200 transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    activeIndex >= reviews.length - 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs active:scale-95'
                  }`}
                  aria-label="Avis suivant"
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading Skeleton State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((sk) => (
              <div
                key={sk}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs animate-pulse flex flex-col justify-between h-[270px]"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-4 rounded bg-slate-200" />
                      ))}
                    </div>
                    <div className="w-16 h-3 rounded bg-slate-100" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="w-full h-3.5 rounded bg-slate-100" />
                    <div className="w-5/6 h-3.5 rounded bg-slate-100" />
                    <div className="w-3/4 h-3.5 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-24 h-3.5 rounded bg-slate-200" />
                    <div className="w-36 h-2.5 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Carousel (Mobile & Desktop) */}
        {!isLoading && reviews.length > 0 && (
          <div className="relative">
            {/* Scrollable track with touch snap support */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-1 no-scrollbar items-stretch"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {reviews.map((rev, index) => {
                const isCurrent = activeIndex === index;
                return (
                  <div
                    key={rev.id || index}
                    className="snap-center shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex flex-col"
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full relative group">
                      
                      {/* Top Row: Stars + Date + Decorative Quote Icon */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-2">
                          {/* 5 Stars */}
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rev.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200 fill-slate-200'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            {rev.date && (
                              <span className="text-[11px] font-medium text-slate-400 tracking-tight">
                                {rev.date}
                              </span>
                            )}
                            <Quote className="w-6 h-6 text-blue-500/15 group-hover:text-blue-500/25 transition-colors shrink-0" />
                          </div>
                        </div>

                        {/* Comment Body */}
                        <div className="relative pt-1">
                          <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed line-clamp-4 select-text">
                            « {rev.comment} »
                          </p>
                        </div>
                      </div>

                      {/* Bottom Author Row */}
                      <div className="pt-5 mt-4 border-t border-slate-100/90 flex items-center gap-3.5">
                        {/* Initials Avatar */}
                        <div
                          className={`w-11 h-11 rounded-full bg-gradient-to-tr ${getAvatarGradient(
                            rev.name
                          )} flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs shrink-0 select-none`}
                        >
                          {getInitials(rev.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                              {rev.name}
                            </h4>
                            <span title="Avis vérifié" className="inline-flex items-center text-blue-600">
                              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            </span>
                          </div>

                          <div className="text-[12px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            {rev.city && <span>{rev.city}</span>}
                            {rev.city && rev.trip && <span>•</span>}
                            {rev.trip && (
                              <span className="text-blue-600 font-medium truncate">
                                {rev.trip}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Touch Pagination Dots & Quick Controls */}
            {reviews.length > 1 && (
              <div className="flex items-center justify-between sm:justify-center gap-3 mt-4 pt-1">
                {/* Mobile Prev Arrow */}
                <button
                  type="button"
                  onClick={isRTL ? handleNext : handlePrev}
                  disabled={activeIndex === 0}
                  className="sm:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-95"
                  aria-label="Avis précédent"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>

                {/* Pagination Indicators (Dots) */}
                <div className="flex items-center gap-1.5">
                  {reviews.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => scrollToReview(dotIdx)}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        activeIndex === dotIdx
                          ? 'w-6 bg-blue-600'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Aller à l'avis ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile Next Arrow */}
                <button
                  type="button"
                  onClick={isRTL ? handlePrev : handleNext}
                  disabled={activeIndex >= reviews.length - 1}
                  className="sm:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs active:scale-95"
                  aria-label="Avis suivant"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
export default Reviews;
