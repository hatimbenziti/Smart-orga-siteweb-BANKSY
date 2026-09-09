import React, { useState, useEffect, useMemo } from 'react';
import { HERO_SLIDES } from '../data/tripsData';
import { ChevronLeft, ChevronRight, Sparkles, Compass, Users, Award, ArrowRight, Edit3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CmsSlide {
  title?: string;
  tag?: string;
  subtitle?: string;
  image?: string;
  order?: number;
  link?: string;
}

export interface HeroSlideItem {
  title: string;
  tag: string;
  subtitle: string;
  image: string;
  order?: number;
  link?: string;
}

interface HeroProps {
  onSelectTag: (tag: string) => void;
  onDiscoverClick: () => void;
  onPopularClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectTag, onDiscoverClick, onPopularClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t, isRTL } = useLanguage();

  // Load customizable slides from Decap CMS (content/slider/*.json)
  const slides = useMemo<HeroSlideItem[]>(() => {
    try {
      const globFiles = (import.meta as any).glob
        ? (import.meta as any).glob('/content/slider/*.json', { eager: true })
        : {};
      const items: HeroSlideItem[] = [];

      Object.entries(globFiles).forEach(([, content], idx) => {
        const data = ((content as { default?: CmsSlide }).default || content) as CmsSlide;
        if (data && (data.image || data.title)) {
          items.push({
            title: data.title || 'Voyage Inoubliable',
            tag: data.tag || 'Maroc Authentique',
            subtitle: data.subtitle || '',
            image: data.image || HERO_SLIDES[idx % HERO_SLIDES.length].image,
            order: typeof data.order === 'number' ? data.order : idx + 1,
            link: data.link
          });
        }
      });

      if (items.length > 0) {
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        return items;
      }
    } catch {
      // Fallback to static slides
    }
    return HERO_SLIDES;
  }, []);

  const tags = [
    { label: t.regionDesert, raw: 'Désert & Dunes' },
    { label: t.regionImperial, raw: 'Villes Impériales' },
    { label: t.regionNature, raw: 'Nature & Randonnée' },
    { label: t.regionPlages, raw: 'Plages & Surf' }
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-7">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>{t.heroBadge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
              {t.heroTitlePrefix}{' '}
              <span className="text-blue-600 inline-block drop-shadow-xs">
                {t.heroTitleHighlight}
              </span>{' '}
              {t.heroTitleSuffix}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onDiscoverClick}
                className="px-6 sm:px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2.5 cursor-pointer group"
              >
                <span>{t.heroBtnDiscover}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>

              <button
                onClick={onPopularClick}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm sm:text-base shadow-xs hover:border-slate-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.heroBtnPopular}</span>
              </button>
            </div>

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

          {/* Right Column: Automated Landscape Slider / Carousel */}
          <div
            className="lg:col-span-5 relative"
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
                    <p className="text-slate-200 text-xs sm:text-sm opacity-90">
                      {slide.subtitle}
                    </p>
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

              {/* Quick Admin Customization Button (shown on hover or subtle) */}
              <a
                href="/admin/#/collections/slider"
                target="_blank"
                rel="noopener noreferrer"
                className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium backdrop-blur-md shadow-sm`}
                title="Personnaliser les images et textes du slider dans le tableau de bord Decap CMS"
              >
                <Edit3 className="w-3 h-3 text-blue-400" />
                <span>Modifier le slider (/admin)</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
