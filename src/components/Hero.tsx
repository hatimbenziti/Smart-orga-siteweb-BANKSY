import React, { useState, useEffect, useMemo } from 'react';
import { loadCmsSlides, HeroSlide, normalizeCmsImagePath } from '../data/sliderData';
import { ChevronLeft, ChevronRight, Sparkles, Compass, Users, Award, ArrowRight, Mountain, Palmtree } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getHeroMobileConfig, subscribeHeroMobile, refreshHeroMobileConfigFromRemote, HeroMobileConfig } from '../services/heroMobileService';

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
    // Initial fetch in case settings file on server was updated via Decap CMS
    refreshHeroMobileConfigFromRemote();

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

  // Mobile Hero Image Connection (CMS: content/settings/hero_mobile.json)
  // Supports separate Arabic image or horizontal flip (mirror) for Arabic RTL layout
  const rawMobileImg = isRTL && mobileConfig.image_ar && mobileConfig.image_ar.trim() !== ''
    ? mobileConfig.image_ar
    : ((mobileConfig.image && mobileConfig.image.trim() !== '') ? mobileConfig.image : (activeSlide?.image || '/uploads/heroy.png'));

  const normalizedMobileUrl = rawMobileImg ? normalizeCmsImagePath(rawMobileImg) : '/uploads/heroy.png';
  const heroMobileImage = normalizedMobileUrl || '/uploads/heroy.png';

  const shouldFlipMobileImage = isRTL && (mobileConfig.flip_ar !== false);

  const heroDesktopImage = activeSlide?.image ? normalizeCmsImagePath(activeSlide.image) : heroMobileImage;
  const hasMobileHero = Boolean(mobileConfig.enabled !== false && heroMobileImage && heroMobileImage.trim() !== '');

  const tags = [
    { label: t.regionNature, raw: 'Nature & Randonnée' },
    { label: t.regionDesert, raw: 'Désert & Aventure' },
    { label: t.regionPlages, raw: 'Plage & Détente' },
    { label: t.regionMontagne, raw: 'Montagne & Trekking' },
    { label: t.regionCamping, raw: 'Camping & Bivouac' },
    { label: t.regionCulture, raw: 'Culture & Patrimoine' }
  ];

  // Auto carousel effect (Desktop/Tablet only: inactive on mobile devices < 768px)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    // Do not auto-animate slides on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

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
    <section className={`relative overflow-hidden pt-3 pb-6 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-24 ${hasMobileHero ? 'min-h-[500px] sm:min-h-[520px] flex flex-col justify-between' : ''}`}>
      {/* Background base Desktop / Tablet */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC] pointer-events-none -z-10" />

      {/* Subtle background decoration (Desktop & Tablet only) */}
      <div className="hidden md:block absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="hidden md:block absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Fallback background Mobile si aucune image personnalisée active */}
      {!hasMobileHero && (
        <div className="block md:hidden absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC] pointer-events-none z-0" />
      )}

      {/* Background Hero Mobile (< 768px) affiché derrière le texte uniquement sur mobile */}
      {hasMobileHero && (
        <div className="block md:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
          <img
            src={heroMobileImage}
            alt={activeSlide?.title || "Hero Mobile Background"}
            className={`w-full h-full ${
              mobileConfig.fit === 'contain' ? 'object-contain' : 'object-cover'
            } transition-all duration-300 ${
              mobileConfig.position === 'left' ? 'object-left' :
              mobileConfig.position === 'right' ? 'object-right' : 'object-center'
            } ${
              mobileConfig.brightness === 'dimmed' ? 'brightness-90' :
              mobileConfig.brightness === 'dark' ? 'brightness-75' : 'brightness-100'
            } ${
              shouldFlipMobileImage ? '-scale-x-100' : ''
            }`}
            style={{
              opacity: Math.min(1, Math.max(0.1, (mobileConfig.opacity ?? mobileConfig.overlayOpacity ?? 100) / 100))
            }}
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes('/images/uploads/')) {
                target.src = target.src.replace('/images/uploads/', '/uploads/');
              } else if (target.src.includes('/uploads/') && !target.src.includes('/images/uploads/')) {
                target.src = target.src.replace('/uploads/', '/images/uploads/');
              } else if (!target.src.includes('/uploads/heroy.png')) {
                target.src = '/uploads/heroy.png';
              }
            }}
            referrerPolicy="no-referrer"
          />

          {/* Transition douce vers le bas pour fondre naturellement avec les filtres */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50/90 to-transparent pointer-events-none" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* 1. Zone Texte (Left Column on Desktop, Top Column on Mobile) */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[410px] sm:min-h-0 space-y-3.5 sm:space-y-6 relative">
            
            {/* Top-Right Decorative Slogan: "Le Maroc vous attend !" (Mobile < 768px only) */}
            <div 
              className={`md:hidden absolute z-20 pointer-events-none select-none ${
                isRTL ? 'left-1 sm:left-4' : 'right-1 sm:right-4'
              } top-1 sm:top-2 text-right`}
            >
              <div className={`inline-flex flex-col items-end ${isRTL ? 'items-start text-left -rotate-2' : 'text-right -rotate-2'}`}>
                <span className="font-script text-[#153450] text-[13px] sm:text-[15px] font-semibold tracking-wide drop-shadow-xs leading-none whitespace-nowrap">
                  {isRTL ? 'المغرب في انتظاركم' : 'Le Maroc vous attend !'}
                </span>
                {/* Elegant subtle blue brush swoosh underneath */}
                <svg 
                  className={`h-2 w-20 sm:w-24 text-[#20547d]/85 mt-0.5 ${isRTL ? 'mr-auto scale-x-[-1]' : 'ml-auto'}`} 
                  viewBox="0 0 100 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 8C26 2.5 74 2.5 97 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Top Block : Badge + Titre principal + Tagline & Piliers mobile */}
            <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-0">
              {/* Top Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide uppercase bg-blue-50/90 backdrop-blur-xs border border-blue-200/80 text-blue-700 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span>{t.heroBadge}</span>
              </div>

              {/* 1. Titre principal ("Voyagez en groupe...") */}
              {isRTL ? (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 leading-[1.38] sm:leading-[1.42] max-w-xl mt-1.5 sm:mt-0 tracking-normal">
                  <span className="block">{t.heroTitlePrefix}</span>
                  <span className="block text-blue-600 my-0.5 sm:my-1">
                    {t.heroTitleHighlight}
                  </span>
                  <span className="block">{t.heroTitleSuffix}</span>
                </h1>
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.16] max-w-xl mt-1.5 sm:mt-0">
                  {t.heroTitlePrefix}{' '}
                  <span className="inline-block text-blue-600">
                    {t.heroTitleHighlight}
                  </span>{' '}
                  {t.heroTitleSuffix}
                </h1>
              )}

              {/* Tagline Mobile (Destinations Authentiques — Expériences Inoubliables) - Medium / 500 */}
              <div className="md:hidden pt-1.5 space-y-0.5">
                <div className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-slate-800 uppercase">
                  {t.heroTagline1 || "DESTINATIONS AUTHENTIQUES"}
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-slate-800 uppercase">
                  <span className="w-5 h-[1.5px] bg-slate-700/80 inline-block shrink-0"></span>
                  <span>{t.heroTagline2 || "EXPÉRIENCES INOUBLIABLES"}</span>
                </div>
              </div>

              {/* 3 Piliers Expérience Mobile (Nature, Voyages en groupe, Découverte) - Compact & Groupé à gauche - Medium / 500 */}
              <div className="md:hidden grid grid-cols-3 w-[58%] min-w-[185px] max-w-[215px] pt-2 pb-0.5">
                {/* 1. Nature & Aventure */}
                <div className="flex flex-col items-center text-center px-1">
                  <Mountain className="w-4 h-4 text-blue-700/90 mb-1" strokeWidth={1.4} />
                  <span className={`text-[8px] font-medium uppercase leading-tight text-slate-800 ${isRTL ? 'tracking-normal' : 'tracking-wide'}`}>
                    {isRTL ? (
                      <>الطبيعة<br />والمغامرة</>
                    ) : (
                      <>NATURE<br />& AVENTURE</>
                    )}
                  </span>
                </div>

                {/* 2. Voyages en groupe */}
                <div className="flex flex-col items-center text-center px-1 border-x border-slate-300/80">
                  <Users className="w-4 h-4 text-blue-700/90 mb-1" strokeWidth={1.4} />
                  <span className={`text-[8px] font-medium uppercase leading-tight text-slate-800 ${isRTL ? 'tracking-normal' : 'tracking-wide'}`}>
                    {isRTL ? (
                      <>رحلات<br />جماعية</>
                    ) : (
                      <>VOYAGES<br />EN GROUPE</>
                    )}
                  </span>
                </div>

                {/* 3. Découverte & Culture */}
                <div className="flex flex-col items-center text-center px-1">
                  <Palmtree className="w-4 h-4 text-blue-700/90 mb-1" strokeWidth={1.4} />
                  <span className={`text-[8px] font-medium uppercase leading-tight text-slate-800 ${isRTL ? 'tracking-normal' : 'tracking-wide'}`}>
                    {isRTL ? (
                      <>اكتشاف وثقافة<br />وتراث</>
                    ) : (
                      <>DÉCOUVERTE<br />& CULTURE</>
                    )}
                  </span>
                </div>
              </div>

              {/* Subtitle (Desktop only) */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl hidden md:block">
                {t.heroSubtitle}
              </p>
            </div>

            {/* 2. Boutons d'action - Rehaussés de 20-30px plus proches des 3 éléments */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 mt-3.5 sm:mt-auto mb-2 sm:mb-0 pt-0 sm:pt-2">
              <button
                onClick={onDiscoverClick}
                className="w-[58%] min-w-[180px] max-w-[225px] sm:w-auto px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span className="truncate">{t.heroBtnDiscover}</span>
                <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>

              <button
                onClick={onPopularClick}
                className="w-[58%] min-w-[180px] max-w-[225px] sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer bg-white/95 backdrop-blur-xs hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-xs hover:border-slate-300"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                <span className="truncate">{t.heroBtnPopular}</span>
              </button>
            </div>

            {/* Bottom-Left Decorative Slogan: "Plus qu’un voyage, une histoire à partager !" (Mobile < 768px only) */}
            <div className={`md:hidden mt-1 mb-8 sm:mb-0 ${isRTL ? 'pr-1' : 'pl-1'} z-20 pointer-events-none select-none w-[58%] min-w-[180px] max-w-[225px]`}>
              <div className="inline-flex flex-col items-start -rotate-1">
                <div className="font-script text-[#153450] text-[12px] sm:text-[13px] font-semibold leading-[1.25] tracking-wide drop-shadow-xs">
                  {isRTL ? (
                    <>
                      <div>أكثر من مجرد رحلة</div>
                      <div>حكاية نشاركها معًا</div>
                    </>
                  ) : (
                    <>
                      <div>Plus qu’un voyage,</div>
                      <div>une histoire à partager !</div>
                    </>
                  )}
                </div>
                {/* Subtle blue swoosh / underline curve underneath */}
                <svg 
                  className={`h-1.5 w-20 text-[#20547d]/80 mt-1 ${isRTL ? 'scale-x-[-1]' : ''}`} 
                  viewBox="0 0 100 10" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 5.5C28 1.5 68 1.5 98 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

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

          {/* Right Column: Automated Landscape Slider / Carousel (DESKTOP only >= 768px) */}
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
                    src={slide.image || heroDesktopImage}
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
