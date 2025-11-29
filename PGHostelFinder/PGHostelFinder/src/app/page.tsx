'use client';

import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import SearchBar from '@/components/SearchBar';
import CityCard from '@/components/CityCard';
import QuickFilters from '@/components/QuickFilter';
import { cities } from '@/lib/cities';
import { Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Verified Listings',
    description: 'All PGs verified for authenticity'
  },
  {
    icon: TrendingUp,
    title: 'Compare Rents',
    description: 'Find best deals in your area'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Gender-specific accommodations'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Latest availability status'
  }
];

const listingCounts: Record<string, number> = {
  delhi: 1250,
  mumbai: 980,
  bangalore: 1100,
  pune: 720,
  hyderabad: 650
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white px-4 pt-6 pb-10 -mt-px">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Find Your Perfect PG & Hostel
          </h1>
          <p className="text-primary-100 mb-6">
            Discover verified accommodations across major Indian cities
          </p>
          <SearchBar showFilters={false} />
        </div>
      </div>

      <main className="px-4 -mt-4 max-w-lg mx-auto">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            Quick Search
          </h2>
          <QuickFilters />
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {cities.slice(0, 4).map(city => (
              <CityCard 
                key={city.slug} 
                city={city} 
                listingCount={listingCounts[city.slug] || 500}
              />
            ))}
          </div>
          <div className="mt-3">
            <CityCard 
              city={cities[4]} 
              listingCount={listingCounts[cities[4].slug] || 500}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-xl card-shadow"
              >
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{feature.title}</h3>
                <p className="text-gray-500 text-xs mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-accent-500 to-primary-600 rounded-2xl p-5 text-white mb-8">
          <h3 className="font-bold text-lg mb-2">Looking for a PG near your college?</h3>
          <p className="text-white/80 text-sm mb-4">
            Search by college name and find accommodations within walking distance
          </p>
          <a 
            href="/search"
            className="inline-block bg-white text-primary-600 font-semibold px-5 py-2 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Search Now
          </a>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
