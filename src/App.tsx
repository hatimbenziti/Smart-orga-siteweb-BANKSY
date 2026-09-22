import React, { useState, useMemo, useEffect } from 'react';
import { SEO } from './components/SEO';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilters } from './components/SearchFilters';
import { TripCard } from './components/TripCard';
import { AboutUs } from './components/AboutUs';
import { Reviews } from './components/Reviews';
import { WhyUs } from './components/WhyUs';
import { InstagramGallery } from './components/InstagramGallery';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TripDetailsModal } from './components/TripDetailsModal';
import { BookingModal } from './components/BookingModal';
import { SurMesureModal } from './components/SurMesureModal';
import { HeroMobileAdminModal } from './components/HeroMobileAdminModal';
import { loadCmsTrips, sortVoyagesSmart } from './data/tripsData';
import { Trip, FilterState } from './types';
import { Compass, Sparkles, AlertCircle, RotateCcw, MessageCircle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();

  // Dynamic trips loaded from Decap CMS (content/voyages/*.json)
  const trips = useMemo<Trip[]>(() => {
    const rawVoyages = loadCmsTrips();
    // 1. Filtrer les voyages actifs (archived === false)
    // 2. Trier par 'order' avec décalage automatique en cas d'égalité
    return sortVoyagesSmart(rawVoyages);
  }, []);

  // Modal states
  const [selectedTripForDetails, setSelectedTripForDetails] = useState<Trip | null>(null);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [isSurMesureOpen, setIsSurMesureOpen] = useState(false);
  const [isHeroAdminOpen, setIsHeroAdminOpen] = useState(false);

  // Check URL parameter for direct admin opening (?admin=hero)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'hero') {
        setIsHeroAdminOpen(true);
      }
    }
  }, []);

  // Filter state
  const initialFilterState: FilterState = {
    searchQuery: '',
    destination: 'all',
    regionTag: 'all',
    maxPrice: 20000,
    category: 'all'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Distinct destination list for dropdown
  const destinationsList = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => set.add(t.destination));
    return Array.from(set);
  }, [trips]);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    const filtered = trips.filter((trip) => {
      // 0. Archived trips hidden from public site
      if (trip.archived) {
        return false;
      }

      // 1. Keyword search
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = trip.title.toLowerCase().includes(q) ||
          (trip.titleAr && trip.titleAr.includes(q)) ||
          (trip.titleEn && trip.titleEn.toLowerCase().includes(q));
        const matchesDest = trip.destination.toLowerCase().includes(q);
        const matchesRegion = trip.region.toLowerCase().includes(q);
        const matchesHighlights = trip.highlights.some((h) => h.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDest && !matchesRegion && !matchesHighlights) {
          return false;
        }
      }

      // 2. Destination
      if (filters.destination !== 'all' && trip.destination !== filters.destination) {
        return false;
      }

      // 3. Region Tag (from Hero or filters)
      if (filters.regionTag !== 'all' && trip.region !== filters.regionTag) {
        return false;
      }

      // 4. Price Max
      if (filters.maxPrice < 20000 && trip.priceMAD > filters.maxPrice) {
        return false;
      }

      // 5. Category (dynamic list match with retrocompatibility)
      if (filters.category !== 'all') {
        const selectedCat = filters.category.toLowerCase().trim();

        // Build the normalized list of categories for the trip
        const tripCats: string[] = [];
        if (Array.isArray(trip.categories)) {
          trip.categories.forEach((c) => {
            if (typeof c === 'string') tripCats.push(c.toLowerCase().trim());
            else if (c && typeof c === 'object') {
              const val = (c as any).category || (c as any).name || (c as any).value;
              if (val) tripCats.push(String(val).toLowerCase().trim());
            }
          });
        }
        // Retrocompatibility if single category string was provided
        if (trip.category && typeof trip.category === 'string') {
          const catStr = trip.category.toLowerCase().trim();
          if (catStr && !tripCats.includes(catStr)) {
            tripCats.push(catStr);
          }
        }
        // If popular flag is true, also include 'populaire' and 'popular'
        if (trip.isPopular || (trip as any).popular) {
          if (!tripCats.includes('populaire')) tripCats.push('populaire');
          if (!tripCats.includes('popular')) tripCats.push('popular');
        }

        const match =
          selectedCat === 'all' ||
          tripCats.includes(selectedCat) ||
          ((selectedCat === 'populaire' || selectedCat === 'popular') && (tripCats.includes('populaire') || tripCats.includes('popular') || trip.isPopular || (trip as any).popular)) ||
          // Fallback matching for voyages not yet re-saved in Decap CMS
          (selectedCat === 'nord' && (trip.destination.toLowerCase().includes('tanger') || trip.destination.toLowerCase().includes('tetouan') || trip.destination.toLowerCase().includes('belyounech') || trip.destination.toLowerCase().includes('chefchaouen') || trip.region.toLowerCase().includes('nord'))) ||
          (selectedCat === 'sud' && (trip.destination.toLowerCase().includes('dakhla') || trip.destination.toLowerCase().includes('agadir') || trip.destination.toLowerCase().includes('taghazout') || trip.destination.toLowerCase().includes('sud'))) ||
          (selectedCat === 'atlas' && (trip.destination.toLowerCase().includes('atlas') || trip.destination.toLowerCase().includes('imlil') || trip.destination.toLowerCase().includes('toubkal') || trip.destination.toLowerCase().includes('ouzoud') || trip.destination.toLowerCase().includes('béni mellal') || trip.destination.toLowerCase().includes('marrakech'))) ||
          (selectedCat === 'desert' && (tripCats.includes('désert') || trip.destination.toLowerCase().includes('merzouga') || trip.destination.toLowerCase().includes('désert') || trip.destination.toLowerCase().includes('zagora') || trip.destination.toLowerCase().includes('agafay') || trip.region.toLowerCase().includes('désert'))) ||
          (selectedCat === 'etranger' && (tripCats.includes('étranger') || trip.destination.toLowerCase().includes('istanbul') || trip.destination.toLowerCase().includes('turquie') || trip.destination.toLowerCase().includes('étranger')));

        if (!match) {
          return false;
        }
      }

      return true;
    });

    return sortVoyagesSmart(filtered);
  }, [filters, trips]);

  // Scroll to section helper
  const scrollToSejours = () => {
    const el = document.getElementById('sejours');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hero callbacks
  const handleSelectTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      regionTag: prev.regionTag === tag ? 'all' : tag
    }));
    scrollToSejours();
  };

  const handleSelectCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
      regionTag: 'all',
      destination: 'all',
      searchQuery: ''
    }));
    scrollToSejours();
  };

  const handleDiscoverClick = () => {
    scrollToSejours();
  };

  const handlePopularClick = () => {
    setFilters((prev) => ({ ...prev, category: 'populaire', regionTag: 'all' }));
    scrollToSejours();
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <Navbar onOpenSurMesure={() => setIsSurMesureOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSelectTag={handleSelectTag}
          onDiscoverClick={handleDiscoverClick}
          onPopularClick={handlePopularClick}
        />

        {/* Trips & Search Section */}
        <section id="sejours" className="pt-1 pb-6 sm:py-16 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header (Desktop only) */}
            <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t.sejoursBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {t.sejoursTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                  {t.sejoursSubtitle}
                </p>
              </div>

              {/* Active Region/Thematique Filter Badge (if any) */}
              {filters.regionTag !== 'all' && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0">
                  <span>
                    {language === 'ar' ? 'التصنيف المختار :' : language === 'en' ? 'Selected Theme:' : 'Thématique :'} <strong>{filters.regionTag}</strong>
                  </span>
                  <button
                    onClick={() => setFilters((p) => ({ ...p, regionTag: 'all' }))}
                    className="hover:text-blue-900 ms-1 font-bold cursor-pointer"
                    aria-label="Effacer le filtre"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Active Region/Thematique Filter Badge on mobile (if any) */}
            {filters.regionTag !== 'all' && (
              <div className="flex md:hidden items-center justify-between bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-semibold mb-2.5">
                <span>
                  {language === 'ar' ? 'التصنيف المختار :' : language === 'en' ? 'Selected Theme:' : 'Thématique :'} <strong>{filters.regionTag}</strong>
                </span>
                <button
                  onClick={() => setFilters((p) => ({ ...p, regionTag: 'all' }))}
                  className="hover:text-blue-900 ms-1 font-bold cursor-pointer text-base"
                  aria-label="Effacer le filtre"
                >
                  ×
                </button>
              </div>
            )}

            {/* Advanced Search and Filters Component */}
            <div className="mb-4 sm:mb-8">
              <SearchFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
                destinationsList={destinationsList}
                totalResults={filteredTrips.length}
              />
            </div>

            {/* Trip Cards Grid */}
            {filteredTrips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2">
                {filteredTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onOpenDetails={(t) => setSelectedTripForDetails(t)}
                    onOpenBookingModal={(t) => setSelectedTripForBooking(t)}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 max-w-lg mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t.emptyTripsTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {t.emptyTripsDesc}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.filterReset}</span>
                </button>
              </div>
            )}

            {/* Banner for Custom Group / Sur-Mesure */}
            <div className="mt-12 rounded-2xl sm:rounded-3xl bg-slate-100 border border-slate-200/80 p-6 sm:p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-start">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.bannerSurMesureBadge}</span>
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {t.bannerSurMesureTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                    {t.bannerSurMesureDesc}
                  </p>
                </div>

                <button
                  onClick={() => setIsSurMesureOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{t.bannerSurMesureBtn}</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Why Choose Us Section */}
        <WhyUs />

        {/* Qui Sommes-Nous (About Us) Section */}
        <AboutUs />

        {/* Avis Clients (Client Reviews) Section */}
        <Reviews />

        {/* Instagram Gallery */}
        <InstagramGallery />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenSurMesure={() => setIsSurMesureOpen(true)}
        onSelectTag={handleSelectTag}
        onSelectCategory={handleSelectCategory}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Modals */}
      {selectedTripForDetails && (
        <TripDetailsModal
          trip={selectedTripForDetails}
          onClose={() => setSelectedTripForDetails(null)}
          onBook={(trip) => {
            setSelectedTripForDetails(null);
            setSelectedTripForBooking(trip);
          }}
        />
      )}

      {selectedTripForBooking && (
        <BookingModal
          trip={selectedTripForBooking}
          onClose={() => setSelectedTripForBooking(null)}
        />
      )}

      <SurMesureModal
        isOpen={isSurMesureOpen}
        onClose={() => setIsSurMesureOpen(false)}
      />

      <HeroMobileAdminModal
        isOpen={isHeroAdminOpen}
        onClose={() => setIsHeroAdminOpen(false)}
      />
    </div>
  );
}
