'use client';

import Link from 'next/link';
import { MapPin, Building2 } from 'lucide-react';
import { City } from '@/types';

interface CityCardProps {
  city: City;
  listingCount: number;
}

const cityImages: Record<string, string> = {
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=300&fit=crop',
  pune: 'https://images.unsplash.com/photo-1625378258022-41af9e94d4dc?w=400&h=300&fit=crop',
  hyderabad: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=400&h=300&fit=crop',
};

export default function CityCard({ city, listingCount }: CityCardProps) {
  return (
    <Link href={`/search?city=${city.slug}`}>
      <div className="relative rounded-2xl overflow-hidden card-shadow group cursor-pointer">
        <div className="aspect-[4/3] relative">
          <img
            src={cityImages[city.slug] || cityImages.delhi}
            alt={city.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {city.name}
          </h3>
          <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
            <Building2 className="w-4 h-4" />
            {listingCount}+ PGs & Hostels
          </p>
        </div>
      </div>
    </Link>
  );
}
