import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Trip } from '../types';
import { X, Check, Clock, Calendar, Users, MapPin, MessageCircle, ShieldCheck, FileText, AlertCircle, ChevronLeft, ChevronRight, Camera, ZoomIn } from 'lucide-react';
import { createTripWhatsAppUrl } from '../utils/whatsapp';
import { useLanguage } from '../context/LanguageContext';
import {
  getTripTitle,
  getTripDestination,
  getTripDuration,
  getTripNextDate
} from '../utils/localized';

const defaultIncluded = [
  'Transport touristique tout confort climatisé A/R',
  'Hébergement en demi-pension ou formule adaptée',
  'Accompagnateur dédié & assistance 24h/24 Smart Orga'
];

/**
 * Checks if a string consists exclusively of emojis, symbols, and whitespace.
 */
function isEmojiOnly(str: string): boolean {
  return /^[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Emoji_Modifier}\s]+$/u.test(str);
}

/**
 * Parses raw text or list data into clean bullet point items:
 * - Splits by newlines (\n, \r\n) or inline bullet markers
 * - Trims and cleans leading bullet markers (-, *, •, checkboxes)
 * - Ignores empty strings, standalone dashes "-", placeholders, and emoji-only fragments
 */
function parseBulletItems(input: any): string[] {
  if (!input) return [];
  const rawList = Array.isArray(input) ? input : [input];
  const items: string[] = [];

  for (const raw of rawList) {
    if (raw === null || raw === undefined) continue;
    const str = typeof raw === 'object'
      ? (raw.item || raw.name || raw.title || raw.text || raw.value || '')
      : String(raw);
    const lines = str.split(/\r?\n+|<br\s*\/?>/i);

    for (const line of lines) {
      if (!line.trim()) continue;

      // Split line if multiple bullet items or inline icons with space were entered on one line
      const segments = line.split(/(?<=[^\s])\s+(?=[•\-\*⁃◦_—–~:;.]\s+|[•\-\*⁃◦✓✔✅❌\u2022\u2023\u25E6\u2043\u2219]|(?:✈️?|🚌|🏘️?|🥐|🎤|🍴|🌄|🏨|🚙|🤿|🏖️?|📸|⏰|📍|🍽️?|☕|🌅|🌙|😌|🌊|💰|⏱️|🎶|🛍️?|🧳|🍳|🗺️?|🕌|✔️|🔶|⏹️|🔴)\s)/u);

      for (const seg of segments) {
        let cleaned = seg.trim();
        // Remove leading bullet marks: -, *, •, _, —, –, etc.
        cleaned = cleaned.replace(/^[\s•\-\*⁃◦_—–~:;.]+/u, '').trim();
        // Remove leading checkmark or cross icon used as bullet
        cleaned = cleaned.replace(/^[✅✓✔❌]\s*/u, '').trim();

        // Discard empty, placeholder symbols, or emoji-only fragments
        if (!cleaned || /^[\-_—–.\s•*~;:,]+$/.test(cleaned) || isEmojiOnly(cleaned)) {
          continue;
        }

        items.push(cleaned);
      }
    }
  }

  return items;
}

const defaultCancellationPolicy = `Politique d'annulation
Pour toute annulation effectuée plus de 15 jours avant la date du départ, le remboursement est total (100 %).

Pour toute annulation effectuée entre 7 et 15 jours avant le départ, un remboursement de 50 % du montant versé sera effectué.

Pour toute annulation ou réservation effectuée moins de 7 jours avant le départ, aucun remboursement ne sera possible.

En cas d’annulation par l’organisateur, le montant total sera remboursé au participant.`;

interface TripDetailsModalProps {
  trip: Trip | null;
  onClose: () => void;
  onBook: (trip: Trip) => void;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ trip, onClose, onBook }) => {
  const { language, t, isRTL } = useLanguage();
  if (!trip) return null;

  const title = getTripTitle(trip, language);
  const destination = getTripDestination(trip, language);
  const duration = getTripDuration(trip, language);
  // Prioritize dateText (texte libre saisi dans l'admin, affiché mot pour mot sans aucun calcul)
  const nextDate = trip.dateText || trip.displayDate || trip.customDate || getTripNextDate(trip, language);

  const directWhatsAppUrl = createTripWhatsAppUrl(trip, { lang: language });

  // Slider state and images list (main image + gallery)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Dragging & touch state for smooth mouse desktop swiping and reliable mobile tap
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });

  const allImages = useMemo(() => {
    const list: string[] = [];
    if (trip.image) list.push(trip.image);
    if (Array.isArray(trip.gallery)) {
      trip.gallery.forEach((item: any) => {
        const url = typeof item === 'string'
          ? item
          : (item && typeof item === 'object' ? (item.image || item.photo || item.url) : '');
        if (url && typeof url === 'string' && url.trim() && !list.includes(url.trim())) {
          list.push(url.trim());
        }
      });
    }
    return list.length > 0 ? list : (trip.image ? [trip.image] : []);
  }, [trip.image, trip.gallery]);

  const hasMultipleImages = allImages.length > 1;

  // Scroll to a specific slide index smoothly
  const scrollToIndex = useCallback((index: number) => {
    if (allImages.length === 0) return;
    const clamped = Math.max(0, Math.min(index, allImages.length - 1));
    setActiveImageIndex(clamped);
    const targetSlide = slideRefs.current[clamped];
    if (targetSlide) {
      targetSlide.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  }, [allImages.length]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length <= 1) return;
    const nextIdx = (activeImageIndex + 1) % allImages.length;
    scrollToIndex(nextIdx);
  }, [activeImageIndex, allImages.length, scrollToIndex]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (allImages.length <= 1) return;
    const prevIdx = (activeImageIndex - 1 + allImages.length) % allImages.length;
    scrollToIndex(prevIdx);
  }, [activeImageIndex, allImages.length, scrollToIndex]);

  // Reset to first slide whenever trip changes
  useEffect(() => {
    setActiveImageIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [trip.id]);

  // Keyboard navigation (Arrow keys + Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenImage) {
          setFullscreenImage(null);
        } else {
          onClose();
        }
        return;
      }
      if (fullscreenImage) return; // Don't slide behind lightbox
      if (e.key === 'ArrowRight') {
        if (isRTL) prevImage();
        else nextImage();
      } else if (e.key === 'ArrowLeft') {
        if (isRTL) nextImage();
        else prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, isRTL, onClose, fullscreenImage]);

  // Lock scroll when fullscreen lightbox is active
  useEffect(() => {
    if (fullscreenImage) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [fullscreenImage]);

  // Track active slide index via IntersectionObserver
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || !hasMultipleImages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-slide-index');
            if (indexAttr !== null) {
              const idx = parseInt(indexAttr, 10);
              if (!isNaN(idx)) {
                setActiveImageIndex(idx);
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6
      }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [allImages, hasMultipleImages]);

  // Keep active thumbnail visible in scroll view
  useEffect(() => {
    const thumb = thumbnailRefs.current[activeImageIndex];
    if (thumb) {
      thumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [activeImageIndex]);

  // Mouse drag handlers on desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current);
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  // Compute full program content with markdown formatting
  const programContent = (() => {
    const customText = (trip.program || trip.body || '').trim();

    if (Array.isArray(trip.itinerary) && trip.itinerary.length > 0) {
      if (customText.length > 160) {
        return customText;
      }

      const sections = trip.itinerary.map((item) => {
        const itemTitle = language === 'ar'
          ? (item.titleAr || item.title)
          : language === 'en'
          ? (item.titleEn || item.title)
          : item.title;
        const itemDesc = language === 'ar'
          ? (item.descriptionAr || item.description)
          : language === 'en'
          ? (item.descriptionEn || item.description)
          : item.description;

        return `### ${itemTitle}\n\n${itemDesc}`;
      }).join('\n\n');

      if (customText.length > 0 && !sections.includes(customText)) {
        return `${customText}\n\n${sections}`;
      }
      return sections;
    }

    return customText;
  })();

  // Included / Excluded / Cancellation Policy
  const parsedIncluded = parseBulletItems(trip.included);
  const includedItems = parsedIncluded;
  const hasIncluded = includedItems.length > 0;

  const parsedExcluded = parseBulletItems(trip.excluded || trip.notIncluded);
  const excludedItems = parsedExcluded;
  const hasExcluded = excludedItems.length > 0;

  const rawCancellation = (trip.cancellation_policy || trip.cancellationPolicy || '').trim() || defaultCancellationPolicy;
  const cleanedCancellation = rawCancellation.replace(/^Politique d'annulation\s*(\r?\n)+/i, '');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[94vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header Bar with Close Button */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-100/60 text-[11px] sm:text-xs font-bold uppercase tracking-wide truncate">
              {trip.region || trip.category || 'Voyage'}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
              {duration}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label={t.modalClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-3.5 sm:space-y-6 [scrollbar-width:thin] pb-6 sm:pb-8">
          {/* Image Slider / Horizontal Carousel */}
          <div className="space-y-2.5">
            <div className="relative group select-none">
              {/* Scrollable Carousel Track */}
              <div
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="flex gap-2 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-0.5 cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full"
              >
                {allImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    ref={(el) => { slideRefs.current[index] = el; }}
                    data-slide-index={index}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
                    }}
                    onTouchEnd={(e) => {
                      const touch = e.changedTouches[0];
                      const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
                      const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);
                      const duration = Date.now() - touchStartPosRef.current.time;
                      // If it was a clean tap (minimal movement < 10px and duration < 350ms)
                      if (deltaX < 10 && deltaY < 10 && duration < 350) {
                        setFullscreenImage(imgUrl);
                      }
                    }}
                    onClick={() => {
                      if (!hasMovedRef.current) {
                        if (index !== activeImageIndex) {
                          scrollToIndex(index);
                        } else {
                          // Tap on the active image opens fullscreen Lightbox
                          setFullscreenImage(imgUrl);
                        }
                      }
                    }}
                    className="w-full shrink-0 snap-center relative rounded-2xl overflow-hidden aspect-video max-h-96 bg-slate-900 shadow-xs transition-all duration-300 cursor-pointer sm:cursor-grab group/slide"
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${title} - photo ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Subtle mobile hint overlay badge indicating tap to view full size poster */}
                    <div className="sm:hidden absolute bottom-2.5 start-2.5 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10.5px] font-medium shadow-sm pointer-events-none">
                      <ZoomIn className="w-3 h-3 text-blue-300 shrink-0" />
                      <span>{language === 'ar' ? 'تكبير الملصق' : language === 'en' ? 'Tap to view full' : 'Plein écran'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls (Counter & Arrows) */}
              {hasMultipleImages && (
                <>
                  {/* Photo Counter Badge (Top End) */}
                  <div className="absolute top-2.5 end-2.5 sm:top-3 sm:end-4 z-30 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] sm:text-xs font-semibold shadow-md pointer-events-none">
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300 shrink-0" />
                    <span>{activeImageIndex + 1} / {allImages.length}</span>
                  </div>

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={isRTL ? nextImage : prevImage}
                    className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={isRTL ? prevImage : nextImage}
                    className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/55 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Navigation Row (Only if multiple images) */}
            {hasMultipleImages && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    ref={(el) => { thumbnailRefs.current[idx] = el; }}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    className={`relative shrink-0 w-14 sm:w-16 h-10 sm:h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      idx === activeImageIndex
                        ? 'border-blue-600 ring-2 ring-blue-500/30 scale-102 opacity-100 shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                    }`}
                    aria-label={`Afficher la photo ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Localisation & Titre Complet (Sous l'image, sans coupure ni masque) */}
          <div className="space-y-1 sm:space-y-1.5 pt-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 tracking-wide uppercase">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="break-words whitespace-normal">{destination}</span>
            </div>
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 leading-snug break-words whitespace-normal">
              {title}
            </h2>
          </div>

          {/* Quick Info Grid : 2 colonnes x 2 lignes sur mobile, 4 colonnes sur desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* Durée */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                {language === 'ar' ? 'المدة' : 'Durée'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs sm:text-sm min-w-0">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span className="break-words whitespace-normal">{duration}</span>
              </div>
            </div>

            {/* Prochain départ */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                {language === 'ar' ? 'الانطلاق' : 'Prochain départ'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs sm:text-sm min-w-0">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span className="break-words whitespace-normal leading-tight">{nextDate}</span>
              </div>
            </div>

            {/* Taille groupe */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                {language === 'ar' ? 'حجم المجموعة' : 'Taille groupe'}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs sm:text-sm min-w-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span className="break-words whitespace-normal">{trip.groupSize}</span>
              </div>
            </div>

            {/* Villes départ */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs flex flex-col justify-between">
              <span className="text-slate-400 block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                {language === 'ar' ? 'مدن الانطلاق' : 'Villes départ'}
              </span>
              <div className="flex items-start gap-1.5 font-bold text-slate-800 text-xs sm:text-sm min-w-0">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="break-words whitespace-normal leading-tight">
                  {trip.departureCities.join(' • ')}
                </span>
              </div>
            </div>
          </div>

          {/* Programme Complet du Voyage */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words whitespace-normal">
                  {t.modalProgramTitle || (language === 'ar' ? 'البرنامج الكامل للرحلة' : 'Programme complet du voyage')}
                </h3>
              </div>
              <span className="shrink-0 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                {duration}
              </span>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-2xs">
              {programContent ? (
                <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-2.5">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-4 mb-2 first:mt-0" {...props} />,
                      h2: ({ node, ...props }) => <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-3.5 mb-2 first:mt-0" {...props} />,
                      h3: ({ node, ...props }) => (
                        <h4 className="text-sm sm:text-base font-bold text-blue-900 mt-4 mb-2 first:mt-0 flex items-center gap-2 bg-blue-100/60 text-blue-900 px-3.5 py-2 rounded-xl border-s-4 border-blue-600 shadow-xs" {...props} />
                      ),
                      h4: ({ node, ...props }) => <h5 className="text-xs sm:text-sm font-bold text-slate-800 mt-3 mb-1.5" {...props} />,
                      p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-2.5 last:mb-0 whitespace-pre-line break-words" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc ps-5 space-y-1.5 my-2 text-slate-700" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal ps-5 space-y-1.5 my-2 text-slate-700" {...props} />,
                      li: ({ node, ...props }) => <li className="ps-0.5" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
                    }}
                  >
                    {programContent}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">
                  {language === 'ar' ? 'تفاصيل البرنامج الكامل ستتوفر قريباً.' : 'Le programme complet et détaillé du voyage sera communiqué prochainement.'}
                </p>
              )}
            </div>
          </div>

          {/* Included / Not Included */}
          {(hasIncluded || hasExcluded) && (
            <div className={`grid gap-3 pt-1 ${hasIncluded && hasExcluded ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {hasIncluded && (
                <div className="bg-emerald-50/70 p-3.5 sm:p-5 rounded-2xl border border-emerald-100 space-y-2 w-full">
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.modalIncludedTitle}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800">
                    {includedItems.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-600 font-bold leading-none mt-1 shrink-0">•</span>
                        <span className="flex-1 break-words">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasExcluded && (
                <div className="bg-rose-50/60 p-3.5 sm:p-5 rounded-2xl border border-rose-100 space-y-2 w-full">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-900 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{t.modalNotIncludedTitle}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-800">
                    {excludedItems.map((notInc, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-600 font-bold leading-none mt-1 shrink-0">•</span>
                        <span className="flex-1 break-words">{notInc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Politique d'annulation */}
          <div className="bg-amber-50/50 p-3.5 sm:p-5 rounded-2xl border border-amber-200/70 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.modalCancellationTitle || "Politique d'annulation"}</span>
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5 whitespace-pre-line break-words">
              {cleanedCancellation}
            </div>
          </div>

          {/* Reassurance */}
          <div className="flex items-center gap-2.5 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
            <span className="leading-snug">{t.modalGuarantee}</span>
          </div>
        </div>

        {/* Modal Fixed Footer CTA (Sticky Bottom Bar) */}
        <div className="sticky bottom-0 z-30 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-white/98 backdrop-blur-md border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] shrink-0">
          <div className="min-w-0">
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium block leading-tight">
              {t.modalTotalPrice || (language === 'ar' ? 'السعر الإجمالي للشخص' : 'Tarif total par personne')}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {trip.priceMAD.toLocaleString()} <span className="text-xs sm:text-sm font-bold">MAD</span>
              </span>
              {trip.originalPriceMAD && (
                <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
                  {trip.originalPriceMAD.toLocaleString()} MAD
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onBook(trip);
              }}
              className="px-3.5 sm:px-4 py-2.5 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 text-center"
            >
              {t.cardCustomize}
            </button>

            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-xl bg-[#00a859] hover:bg-[#008f4c] active:bg-[#007a41] text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial cursor-pointer text-center whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span>{t.modalBookWA || (language === 'ar' ? 'الحجز عبر واتساب' : 'Réserver sur WhatsApp')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Lightbox (Tap on image in mobile modal opens poster details in full view) */}
      {fullscreenImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image plein écran"
          className="fixed inset-0 z-60 bg-black/90 sm:bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          {/* Top Bar with Clear Close Button and Image Title */}
          <div
            className="absolute top-0 inset-x-0 z-70 flex items-center justify-between px-3 sm:px-6 py-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="text-white/90 text-xs sm:text-sm font-semibold truncate drop-shadow-sm">
                {title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="p-2 sm:p-2.5 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white backdrop-blur-md transition-all cursor-pointer shadow-lg shrink-0 flex items-center justify-center"
              aria-label={t.modalClose || 'Fermer'}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Centered Image with object-fit: contain to preserve aspect ratio without cropping */}
          <div
            className="w-full h-full flex items-center justify-center p-2 pt-14 pb-4"
            onClick={() => setFullscreenImage(null)}
          >
            <img
              src={fullscreenImage}
              alt={title}
              className="max-w-full max-h-full object-contain pointer-events-auto select-none rounded-lg sm:rounded-xl shadow-2xl transition-transform duration-200"
              style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
