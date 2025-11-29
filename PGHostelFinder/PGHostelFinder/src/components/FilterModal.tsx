'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { SearchFilters } from '@/types';
import { cn } from '@/lib/utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  initialFilters: SearchFilters;
  areas: string[];
  colleges: string[];
}

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  areas,
  colleges
}: FilterModalProps) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ city: initialFilters.city });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 animate-fade-in">
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Property Type</h3>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pg', 'hostel', 'flat'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, type: type as SearchFilters['type'] })}
                  className={cn(
                    "py-2 px-4 rounded-lg border font-medium transition-colors",
                    filters.type === type || (!filters.type && type === 'all')
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                  )}
                >
                  {type === 'all' ? 'All' : type === 'pg' ? 'PG' : type === 'hostel' ? 'Hostel' : 'Flat'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Gender Preference</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'girls', label: 'Girls Only' },
                { value: 'boys', label: 'Boys Only' },
                { value: 'coed', label: 'Co-ed' },
                { value: 'family', label: 'Family' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, gender: value as SearchFilters['gender'] })}
                  className={cn(
                    "py-2 px-4 rounded-lg border font-medium transition-colors",
                    filters.gender === value || (!filters.gender && value === 'all')
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filters.type === 'flat' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Furnished Status</h3>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'fully', label: 'Fully Furnished' },
                  { value: 'semi', label: 'Semi Furnished' },
                  { value: 'unfurnished', label: 'Unfurnished' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilters({ ...filters, furnished: value as SearchFilters['furnished'] })}
                    className={cn(
                      "py-2 px-4 rounded-lg border font-medium transition-colors",
                      filters.furnished === value || (!filters.furnished && value === 'all')
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Food Included</h3>
            <div className="flex gap-2">
              {[
                { value: undefined, label: 'Any' },
                { value: true, label: 'With Food' },
                { value: false, label: 'Without Food' }
              ].map(({ value, label }) => (
                <button
                  key={String(value)}
                  onClick={() => setFilters({ ...filters, foodIncluded: value })}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg border font-medium transition-colors",
                    filters.foodIncluded === value
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Rent Range: ₹{filters.minRent || 0} - ₹{filters.maxRent || 50000}
            </h3>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={filters.minRent || ''}
                onChange={(e) => setFilters({ ...filters, minRent: Number(e.target.value) || undefined })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxRent || ''}
                onChange={(e) => setFilters({ ...filters, maxRent: Number(e.target.value) || undefined })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {areas.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Area</h3>
              <select
                value={filters.area || ''}
                onChange={(e) => setFilters({ ...filters, area: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Areas</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
          )}

          {colleges.length > 0 && filters.type !== 'flat' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Near College</h3>
              <select
                value={filters.nearCollege || ''}
                onChange={(e) => setFilters({ ...filters, nearCollege: e.target.value || undefined })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any College</option>
                {colleges.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'price_low', label: 'Price: Low to High' },
                { value: 'price_high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
                { value: 'distance', label: 'Nearest First' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters({ ...filters, sortBy: value as SearchFilters['sortBy'] })}
                  className={cn(
                    "py-2 px-3 rounded-lg border text-sm font-medium transition-colors",
                    filters.sortBy === value
                      ? "bg-primary-600 text-white border-primary-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-100 flex gap-3 safe-area-bottom">
          <button
            onClick={handleReset}
            className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
