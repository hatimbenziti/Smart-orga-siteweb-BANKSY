import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchFilters } from './components/SearchFilters';
import { TripCard } from './components/TripCard';
import { AboutUs } from './components/AboutUs';
import { WhyUs } from './components/WhyUs';
import { InstagramGallery } from './components/InstagramGallery';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { TripDetailsModal } from './components/TripDetailsModal';
import { BookingModal } from './components/BookingModal';
import { SurMesureModal } from './components/SurMesureModal';
import { TRIPS_DATA } from './data/tripsData';
import { Trip, FilterState } from './types';
import { Compass, Sparkles, AlertCircle, RotateCcw, MessageCircle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();

  // Modal states
  const [selectedTripForDetails, setSelectedTripForDetails] = useState<Trip | null>(null);
  const [selectedTripForBooking, setSelectedTripForBooking] = useState<Trip | null>(null);
  const [isSurMesureOpen, setIsSurMesureOpen] = useState(false);

  // Filter state
  const initialFilterState: FilterState = {
    searchQuery: '',
    destination: 'all',
    regionTag: 'all',
    maxPrice: 5000,
    category: 'all'
  };

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Distinct destination list for dropdown
  const destinationsList = useMemo(() => {
    const set = new Set<string>();
    TRIPS_DATA.forEach((t) => set.add(t.destination));
    return Array.from(set);
  }, []);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return TRIPS_DATA.filter((trip) => {
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
      if (filters.maxPrice < 5000 && trip.priceMAD > filters.maxPrice) {
        return false;
      }

      // 5. Category
      if (filters.category === 'popular' && !trip.isPopular) {
        return false;
      }
      if (filters.category === 'weekly' && !trip.isWeekly) {
        return false;
      }
      if (filters.category === 'upcoming' && !trip.isUpcoming) {
        return false;
      }

      return true;
    });
  }, [filters]);

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

  const handleDiscoverClick = () => {
    scrollToSejours();
  };

  const handlePopularClick = () => {
    setFilters((prev) => ({ ...prev, category: 'popular', regionTag: 'all' }));
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
        <section id="sejours" className="py-12 sm:py-16 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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

              {/* Active Region Filter Badge (if any) */}
              {filters.regionTag !== 'all' && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0">
                  <span>
                    {language === 'ar' ? 'التصنيف المختار :' : 'Univers filtré :'} <strong>{filters.regionTag}</strong>
                  </span>
                  <button
                    onClick={() => setFilters((p) => ({ ...p, regionTag: 'all' }))}
                    className="hover:text-blue-900 ms-1 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Advanced Search and Filters Component */}
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              destinationsList={destinationsList}
              totalResults={filteredTrips.length}
            />

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

        {/* Qui Sommes-Nous (About Us) Section */}
        <AboutUs />

        {/* Why Choose Us Section */}
        <WhyUs />

        {/* Instagram Gallery */}
        <InstagramGallery />

        {/* FAQ Section */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenSurMesure={() => setIsSurMesureOpen(true)}
        onSelectTag={handleSelectTag}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />

      {/* Modals */}
      <TripDetailsModal
        trip={selectedTripForDetails}
        onClose={() => setSelectedTripForDetails(null)}
        onBook={(trip) => {
          setSelectedTripForDetails(null);
          setSelectedTripForBooking(trip);
        }}
      />

      <BookingModal
        trip={selectedTripForBooking}
        onClose={() => setSelectedTripForBooking(null)}
      />

      <SurMesureModal
        isOpen={isSurMesureOpen}
        onClose={() => setIsSurMesureOpen(false)}
      />
    </div>
  );
}
