'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { cities } from '@/lib/cities';
import { RentComparison } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { BarChart3, TrendingUp, TrendingDown, MapPin, Building2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ComparePage() {
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [comparisons, setComparisons] = useState<RentComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/listings?city=${selectedCity}`);
        const data = await response.json();
        
        if (data.success && data.rentComparison) {
          const sortedComparisons = [...data.rentComparison].sort((a: RentComparison, b: RentComparison) => a.avgRent - b.avgRent);
          setComparisons(sortedComparisons);
          setIsRealData(data.isRealData);
        } else {
          setComparisons([]);
          setError(data.error || 'No data available. Please try again later.');
        }
      } catch (err) {
        console.error('Error fetching comparison data:', err);
        setError('Failed to load comparison data. Please try again.');
        setComparisons([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCity]);

  const overallAvg = comparisons.length > 0 
    ? Math.round(comparisons.reduce((acc, c) => acc + c.avgRent, 0) / comparisons.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="w-7 h-7" />
          Rent Comparison
        </h1>
        <p className="text-primary-100">Compare PG rents across different areas</p>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-4 card-shadow mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select City</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {cities.map(city => (
              <button
                key={city.slug}
                onClick={() => setSelectedCity(city.slug)}
                className={cn(
                  "px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors",
                  selectedCity === city.slug
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mb-4" />
            <p className="text-gray-500">Fetching real rent data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
            <p className="text-gray-500 text-sm max-w-xs">{error}</p>
            <button
              onClick={() => setSelectedCity(selectedCity)}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : comparisons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-500 text-sm max-w-xs">No listings found for this city. Please try another city.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-5 text-white mb-4">
              <p className="text-white/80 text-sm mb-1">Average Rent in {cities.find(c => c.slug === selectedCity)?.name}</p>
              <p className="text-3xl font-bold">{formatCurrency(overallAvg)}<span className="text-lg font-normal">/month</span></p>
            </div>

            <div className="space-y-3">
              {comparisons.map((comparison, index) => {
                const isAboveAvg = comparison.avgRent > overallAvg;
                const diff = Math.abs(comparison.avgRent - overallAvg);
                const diffPercent = Math.round((diff / overallAvg) * 100);
                
                return (
                  <Link
                    key={comparison.area}
                    href={`/search?city=${selectedCity}&area=${encodeURIComponent(comparison.area)}`}
                    className="block"
                  >
                    <div className="bg-white rounded-xl p-4 card-shadow hover:card-shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                            index < 3 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {comparison.area}
                            </h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {comparison.listingCount} listings
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(comparison.avgRent)}
                          </p>
                          <div className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            isAboveAvg ? "text-red-600" : "text-green-600"
                          )}>
                            {isAboveAvg ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {diffPercent}% {isAboveAvg ? 'above' : 'below'} avg
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Min: {formatCurrency(comparison.minRent)}</span>
                        <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-primary-500 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (comparison.avgRent / comparison.maxRent) * 100)}%` 
                            }}
                          />
                        </div>
                        <span>Max: {formatCurrency(comparison.maxRent)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
