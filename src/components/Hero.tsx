import React, { useState, useEffect, useMemo } from 'react';
import { loadCmsSlides, HeroSlide, normalizeCmsImagePath } from '../data/sliderData';
import { ChevronLeft, ChevronRight, Sparkles, Compass, Users, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getHeroMobileConfig, subscribeHeroMobile, HeroMobileConfig } from '../services/heroMobileService';

export type { HeroSlide as HeroSlideItem };

interface HeroProps {
  onSelectTag: (tag: string) => void;
  onDiscoverClick: () => void;
  onPopularClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTag, onDiscoverClick, onPopularClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, isRTL } = useLanguage();

  // Mobile Hero Background configuration (ONLY for mobile < 768px, does not touch Desktop/Tablet)
  const [mobileConfig, setMobileConfig] = useState<HeroMobileConfig>(() => getHeroMobileConfig());

  useEffect(() => {
    const unsubscribe = subscribeHeroMobile((updated) => {
      setMobileConfig(updated);
    });
    return unsubscribe;
  }, []);

  // Load customizable slides dynamically from Decap CMS collection (content/slider/*.json)
  const slides = useMemo<HeroSlide[]>(() => {
    return loadCmsSlides();
  }, []);

  // Active slide from Decap CMS collection
  const activeSlide = slides[currentSlide] || slides[0];

  // Resolve the image coming from Decap CMS (Slider Hero collection or hero_mobile settings):
  // 1. activeSlide.mobileImage (if set in Slider Hero collection)
  // 2. activeSlide.image (hero.image from Slider Hero collection)
  // 3. mobileConfig.image (from hero_mobile settings if enabled and set)
  // 4. Fallback safe asset
  const rawMobileImage = (
    activeSlide?.mobileImage ||
    activeSlide?.image ||
    (mobileConfig.enabled ? mobileConfig.image : '') ||
    '/assets/merzouga.png'
  );
  const mobileHeroImageUrl = normalizeCmsImagePath(rawMobileImage);
  const hasMobileImage = Boolean(mobileHeroImageUrl);

  const tags = [
    { label: t.regionNature, raw: 'Nature & Randonnée' },
    { label: t.regionDesert, raw: 'Désert & Aventure' },
    { label: t.regionPlages, raw: 'Plage & Détente' },
    { label: t.regionMontagne, raw: 'Montagne & Trekking' },
    { label: t.regionCamping, raw: 'Camping & Bivouac' },
    { label: t.regionCulture, raw: 'Culture & Patrimoine' }
  ];

  // Auto carousel effect
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC] pt-6 pb-6 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-24">
      {/* MOBILE HERO BACKGROUND IMAGE (ONLY on screens < 768px, strictly hidden on Tablet and Desktop) */}
      {hasMobileImage && (
        <div 
          className="block md:hidden absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <img
            src={mobileHeroImageUrl}
            alt={activeSlide?.title || "Hero Mobile Background"}
            className={`w-full h-full object-cover transition-all duration-500 ${
              mobileConfig.position === 'left' ? 'object-left' :
              mobileConfig.position === 'right' ? 'object-right' : 'object-center'
            } ${
              mobileConfig.brightness === 'dimmed' ? 'brightness-90' :
              mobileConfig.brightness === 'dark' ? 'brightness-75' : 'brightness-100'
            }`}
            onError={(e) => {
              const target = e.currentTarget;
              // Fallback between /uploads/ and /images/uploads/ or to default asset
              if (target.src.includes('/uploads/') && !target.src.includes('/images/uploads/')) {
                target.src = target.src.replace('/uploads/', '/images/uploads/');
              } else if (target.src.includes('/images/uploads/') && !target.src.includes('/uploads/')) {
                target.src = target.src.replace('/images/uploads/', '/uploads/');
              } else if (!target.src.includes('/assets/merzouga.png')) {
                target.src = '/assets/merzouga.png';
              }
            }}
            referrerPolicy="no-referrer"
          />
          {/* Subtle transparent gradient/overlay on the mobile Hero background to keep the text readable */}
          <div
            className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
            style={{
              backgroundColor: `rgba(15, 23, 42, ${(mobileConfig.overlayOpacity || 50) / 100})`,
              backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, ${Math.max(0.25, ((mobileConfig.overlayOpacity || 50) / 100) * 0.75)}) 0%, rgba(15, 23, 42, ${Math.min(0.92, ((mobileConfig.overlayOpacity || 50) / 100) * 1.25)}) 100%)`
            }}
          />
        </div>
      )}

      {/* Subtle background decoration (Desktop & Tablet only) */}
      <div className="hidden md:block absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-7">
            {/* Top Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase transition-all ${
              hasMobileImage 
                ? 'bg-white/95 md:bg-blue-50 border border-white/80 md:border-blue-200/80 text-blue-700 shadow-sm backdrop-blur-md' 
                : 'bg-blue-50 border border-blue-200/80 text-blue-700 shadow-xs'
            }`}>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>{t.heroBadge}</span>
            </div>

            {/* Main Title */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.18] transition-colors ${
              hasMobileImage 
                ? 'text-white md:text-slate-900 drop-shadow-md md:drop-shadow-none' 
                : 'text-slate-900'
            }`}>
              {t.heroTitlePrefix}{' '}
              <span className={`inline-block drop-shadow-xs ${
                hasMobileImage 
                  ? 'text-blue-400 md:text-blue-600 drop-shadow-md md:drop-shadow-none' 
                  : 'text-blue-600'
              }`}>
                {t.heroTitleHighlight}
              </span>{' '}
              {t.heroTitleSuffix}
            </h1>

            {/* Subtitle (Desktop only) */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl hidden md:block">
              {t.heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-0 sm:pt-1">
              <button
                onClick={onDiscoverClick}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{t.heroBtnDiscover}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>

              <button
                onClick={onPopularClick}
                className={`px-6 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer ${
                  hasMobileImage
                    ? 'bg-white/95 hover:bg-white text-slate-900 border border-white/80 shadow-md backdrop-blur-sm'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.heroBtnPopular}</span>
              </button>
            </div>

            {/* Mobile Carousel Indicators (when multiple slides exist in CMS) */}
            {slides.length > 1 && (
              <div className="flex md:hidden items-center gap-1.5 pt-1">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                    aria-label={`Diapositive ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Desktop Only Extra Details: Micro-stats & Explore by tags */}
            <div className="hidden md:block space-y-7">
              {/* Key Micro-stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-200/80 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base sm:text-lg">4 500+</div>
                    <div className="text-xs text-slate-500 font-medium">{t.heroStatTravelers}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base sm:text-lg">4.9 / 5</div>
                    <div className="text-xs text-slate-500 font-medium">{t.heroStatRating}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-base sm:text-lg">100%</div>
                    <div className="text-xs text-slate-500 font-medium">{t.heroStatAuth}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Category Filter Tags */}
              <div className="pt-2">
                <span className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                  {t.heroExploreBy}
                </span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tg) => (
                    <button
                      key={tg.raw}
                      onClick={() => onSelectTag(tg.raw)}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>{tg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Automated Landscape Slider / Carousel */}
          <div
            className="hidden md:block lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-100 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] max-h-[540px] w-full bg-slate-900 group">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('/uploads/') && !target.src.includes('/images/uploads/')) {
                        target.src = target.src.replace('/uploads/', '/images/uploads/');
                      } else if (target.src.includes('/images/uploads/') && !target.src.includes('/uploads/')) {
                        target.src = target.src.replace('/images/uploads/', '/uploads/');
                      }
                    }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent"></div>

                  {/* Slide Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2">
                      {slide.tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-sm">
                      {slide.title}
                    </h3>
                    {slide.subtitle && (
                      <p className="text-slate-200 text-xs sm:text-sm opacity-90">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.link && (
                      <a
                        href={slide.link}
                        className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/35 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20 shadow-xs cursor-pointer group/link"
                      >
                        <span>{t.heroBtnDiscover || 'Découvrir'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              ))}

              {/* Slider Controls Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Diapositive précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Diapositive suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Indicator dots */}
              <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 flex items-center gap-1.5 bg-slate-900/40 backdrop-blur-md px-2.5 py-1 rounded-full`}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === currentSlide ? 'w-5 bg-blue-400' : 'w-1.5 bg-white/50'
                    }`}
                    aria-label={`Aller au slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
