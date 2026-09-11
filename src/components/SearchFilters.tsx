import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import { FilterState } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  destinationsList: string[];
  totalResults: number;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChange,
  onReset,
  destinationsList,
  totalResults
}) => {
  const { t, isRTL } = useLanguage();
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);

  const categoryPills: { key: FilterState['category']; label: string }[] = [
    { key: 'all', label: t.catAll },
    { key: 'popular', label: t.catPopular },
    { key: 'weekly', label: t.catWeekly },
    { key: 'upcoming', label: t.catUpcoming }
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, destination: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleCategoryClick = (cat: FilterState['category']) => {
    onChange({ ...filters, category: cat });
  };

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.destination !== 'all' ||
    filters.regionTag !== 'all' ||
    filters.maxPrice < 20000 ||
    filters.category !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-3.5 sm:p-7 space-y-3.5 sm:space-y-6">
      {/* Mobile-only compact control row: Destination + Price Filter Button */}
      <div className="md:hidden flex items-center gap-2">
        <div className="relative flex-1">
          <MapPin className={`w-3.5 h-3.5 absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
          <select
            id="select-destination-mobile"
            aria-label={t.filterDestLabel}
            value={filters.destination}
            onChange={handleDestinationChange}
            className={`w-full ${isRTL ? 'pr-8 pl-6' : 'pl-8 pr-6'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer truncate`}
          >
            <option value="all">{t.filterDestAll}</option>
            {destinationsList.map((dest) => (
              <option key={dest} value={dest}>
                {dest}
              </option>
            ))}
          </select>
          <div className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]`}>
            ▼
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPriceModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            filters.maxPrice < 20000
              ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{t.filterByPrice || "Filtrer par prix"}</span>
          {filters.maxPrice < 20000 && (
            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/90 px-1.5 py-0.5 rounded-md">
              {filters.maxPrice.toLocaleString()} DH
            </span>
          )}
        </button>
      </div>

      {/* Desktop row: Inputs & Dropdowns (Search, Destination, Budget Max) */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
        {/* Keyword Search */}
        <div className="md:col-span-5 relative">
          <label htmlFor="search-keyword" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {t.filterSearchLabel}
          </label>
          <div className="relative">
            <Search className={`w-4 h-4 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
            <input
              id="search-keyword"
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder={t.filterSearchPlaceholder}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`}
            />
          </div>
        </div>

        {/* Destination Filter */}
        <div className="md:col-span-4 relative">
          <label htmlFor="select-destination" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {t.filterDestLabel}
          </label>
          <div className="relative">
            <MapPin className={`w-4 h-4 absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none`} />
            <select
              id="select-destination"
              value={filters.destination}
              onChange={handleDestinationChange}
              className={`w-full ${isRTL ? 'pr-10 pl-8' : 'pl-10 pr-8'} py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer`}
            >
              <option value="all">{t.filterDestAll}</option>
              {destinationsList.map((dest) => (
                <option key={dest} value={dest}>
                  {dest}
                </option>
              ))}
            </select>
            <div className={`absolute ${isRTL ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs`}>
              ▼
            </div>
          </div>
        </div>

        {/* Budget Max slider */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="price-range" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.filterBudgetLabel}
            </label>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              {filters.maxPrice >= 20000 ? t.filterBudgetUnlimited : `${filters.maxPrice.toLocaleString()} DH`}
            </span>
          </div>
          <input
            id="price-range"
            type="range"
            min="0"
            max="20000"
            step="250"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>0 DH</span>
            <span>10 000 DH</span>
            <span>20 000+ DH</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Category Pills & Reset Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline-flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t.filterTitle}</span>
          </span>
          {categoryPills.map((p) => {
            const isActive = filters.category === p.key;
            return (
              <button
                key={p.key}
                onClick={() => handleCategoryClick(p.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-3 ms-auto text-xs text-slate-500">
          <span>
            <strong className="text-slate-900 font-bold">{totalResults}</strong> {t.resultsFound}
          </span>
          {isFiltered && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.filterReset}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Price Filter Modal */}
      {isPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.filterBudgetLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">
                  {t.filterBudgetLabel}
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  {filters.maxPrice >= 20000
                    ? t.filterBudgetUnlimited
                    : `${filters.maxPrice.toLocaleString()} DH`}
                </span>
              </div>
              <input
                id="price-range-mobile"
                type="range"
                min="0"
                max="20000"
                step="250"
                value={filters.maxPrice}
                onChange={handlePriceChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 DH</span>
                <span>10 000 DH</span>
                <span>20 000+ DH</span>
              </div>
            </div>

            {/* Preset quick buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[2000, 5000, 10000, 20000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange({ ...filters, maxPrice: preset })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    filters.maxPrice === preset
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset >= 20000 ? t.filterBudgetUnlimited : `≤ ${preset.toLocaleString()} DH`}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onChange({ ...filters, maxPrice: 20000 });
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                {t.filterReset || "Réinitialiser"}
              </button>
              <button
                type="button"
                onClick={() => setIsPriceModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
