import React, { useEffect, useState, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, MessageSquare, PenLine, Eye, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchGoogleReviews, ClientReview } from '../services/reviewsService';
import { ReviewModal } from './ReviewModal';

export const Reviews: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; author: string; trip: string } | null>(null);

  // Touch coordinates for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Update items per page on window resize (Desktop: 3, Tablet: 2, Mobile: 1)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Compute total pages
  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

  // Clamp currentPage if totalPages changes (e.g. on resize or reviews update)
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentPage]);

  // Infinite loop navigation
  const handleNext = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Automatic slide rotation every 5 seconds (with pause on hover)
  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalPages, isPaused]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Only trigger if horizontal swipe is prominent (> 45px and more horizontal than vertical)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped left -> next slide (or prev if RTL)
        if (isRTL) handlePrev();
        else handleNext();
      } else {
        // Swiped right -> prev slide (or next if RTL)
        if (isRTL) handleNext();
        else handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
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
      className="py-10 sm:py-12 md:py-14 bg-[#F8FAFC] border-b border-slate-200/80 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div className="space-y-2 max-w-2xl">
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
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.reviewsSubtitle || 'Découvrez les expériences de notre communauté de voyageurs'}
            </p>
          </div>

          {/* Average Rating Badge & Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
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

            {/* Previous / Next buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isRTL ? handleNext : handlePrev}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
                  aria-label="Avis précédent"
                  title="Page précédente"
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={isRTL ? handlePrev : handleNext}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-xs active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
                  aria-label="Avis suivant"
                  title="Page suivante"
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

        {/* Automatic Carousel Slider */}
        {!isLoading && reviews.length > 0 && (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Overflow hidden viewport */}
            <div className="overflow-hidden py-1 px-1 -mx-1">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: isRTL
                    ? `translateX(${currentPage * 100}%)`
                    : `translateX(-${currentPage * 100}%)`
                }}
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => {
                  const pageReviews = reviews.slice(
                    pageIndex * itemsPerPage,
                    (pageIndex + 1) * itemsPerPage
                  );

                  return (
                    <div
                      key={pageIndex}
                      className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
                    >
                      {pageReviews.map((rev, revIdx) => (
                        <div
                          key={rev.id || `${pageIndex}-${revIdx}`}
                          className="flex flex-col h-full"
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

                              {/* Photo du voyageur (Affichée uniquement si présente) */}
                              {rev.photo && (
                                <div className="pt-2">
                                  <div
                                    onClick={() =>
                                      setSelectedPhoto({
                                        url: rev.photo!,
                                        author: rev.name,
                                        trip: rev.trip
                                      })
                                    }
                                    className="relative overflow-hidden rounded-xl border border-slate-100/90 shadow-2xs group/photo cursor-pointer bg-slate-50"
                                    title="Cliquer pour agrandir la photo"
                                  >
                                    <img
                                      src={rev.photo}
                                      alt={`Photo partagée par ${rev.name} - ${rev.trip}`}
                                      className="w-full h-36 sm:h-40 object-cover rounded-xl group-hover/photo:scale-102 transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        // En cas d'erreur de chargement, cacher le bloc photo
                                        (e.currentTarget.parentElement as HTMLElement)?.style.setProperty(
                                          'display',
                                          'none'
                                        );
                                      }}
                                    />
                                    <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-md backdrop-blur-xs">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>Agrandir</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
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
                                  <span
                                    title="Avis vérifié"
                                    className="inline-flex items-center text-blue-600"
                                  >
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
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Indicators (Dots) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx)}
                    className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                      currentPage === idx
                        ? 'w-7 bg-blue-600 shadow-2xs'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Aller à la page ${idx + 1}`}
                    title={`Page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button: Laisser un avis */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 hover:text-blue-600 font-semibold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer group"
          >
            <PenLine className="w-4 h-4 text-blue-600 group-hover:rotate-6 transition-transform" />
            <span>{t.reviewsLeaveBtn || 'Laisser un avis'}</span>
          </button>
        </div>

        {/* Modal Formulaire Avis Voyageurs */}
        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {/* Lightbox / Agrandissement Photo Voyageur */}
        {selectedPhoto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo de voyage - ${selectedPhoto.author}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedPhoto.author}</h4>
                  <p className="text-xs text-blue-600 font-medium">{selectedPhoto.trip}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Display */}
              <div className="bg-slate-950 flex items-center justify-center p-1 sm:p-2 max-h-[75vh]">
                <img
                  src={selectedPhoto.url}
                  alt={`Photo de ${selectedPhoto.author}`}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Reviews;

