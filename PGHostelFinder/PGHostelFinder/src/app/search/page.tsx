'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import FilterModal from '@/components/FilterModal';
import ListingCard from '@/components/ListingCard';
import { PGListing, SearchFilters } from '@/types';
import { addListings } from '@/lib/listingsStore';
import { getCityBySlug } from '@/lib/cities';
import { Loader2, SlidersHorizontal, Globe, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function SearchContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [dataSources, setDataSources] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || 'delhi',
    gender: (searchParams.get('gender') as SearchFilters['gender']) || undefined,
    type: (searchParams.get('type') as SearchFilters['type']) || undefined,
    foodIncluded: searchParams.get('food') === 'true' ? true : undefined,
    maxRent: searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : undefined,
    area: searchParams.get('area') || undefined,
    sortBy: 'price_low'
  });

  const cityData = filters.city ? getCityBySlug(filters.city) : undefined;

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        params.set('city', filters.city || 'delhi');
        if (filters.area) params.set('area', filters.area);
        if (filters.gender) params.set('gender', filters.gender);
        if (filters.type) params.set('type', filters.type);
        if (filters.foodIncluded !== undefined) params.set('food', String(filters.foodIncluded));
        if (filters.minRent) params.set('minRent', String(filters.minRent));
        if (filters.maxRent) params.set('maxRent', String(filters.maxRent));
        if (filters.sortBy) params.set('sortBy', filters.sortBy);

        const response = await fetch(`/api/listings?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.listings) {
          setListings(data.listings);
          setIsRealData(data.isRealData || false);
          setDataSources(data.sources || []);
          addListings(data.listings);
        } else {
          setListings([]);
          setError(data.error || 'Unable to fetch listings. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to connect to the server. Please try again.');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const handleApplyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const activeFilterCount = [
    filters.gender && filters.gender !== 'all',
    filters.type && filters.type !== 'all',
    filters.foodIncluded !== undefined,
    filters.minRent,
    filters.maxRent,
    filters.area,
    filters.nearCollege
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-[52px] z-40">
        <SearchBar 
          showFilters={true} 
          onFilterClick={() => setIsFilterOpen(true)}
          initialCity={filters.city}
        />
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-gray-600">
            {loading ? 'Scraping listings...' : `${listings.length} results found`}
          </p>
          {!loading && isRealData && dataSources.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <Globe className="w-3 h-3" />
              Live: {dataSources.join(', ')}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            activeFilterCount > 0 
              ? "bg-primary-100 text-primary-700" 
              : "bg-gray-100 text-gray-600"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <main className="px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-500">Scraping real listings from property sites...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unable to Load Listings</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-4">{error}</p>
            <button
              onClick={() => setFilters({ ...filters })}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Try adjusting your filters or searching in a different area
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
        areas={cityData?.areas || []}
        colleges={cityData?.colleges || []}
      />

      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
