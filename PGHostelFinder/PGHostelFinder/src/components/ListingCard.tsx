'use client';

import { MapPin, Star, Utensils, Phone, ExternalLink, Heart, Users } from 'lucide-react';
import Link from 'next/link';
import { PGListing } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { useState } from 'react';

interface ListingCardProps {
  listing: PGListing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);

  const genderColors = {
    girls: 'bg-pink-100 text-pink-700',
    boys: 'bg-blue-100 text-blue-700',
    coed: 'bg-purple-100 text-purple-700'
  };

  const genderLabels = {
    girls: 'Girls Only',
    boys: 'Boys Only',
    coed: 'Co-ed'
  };

  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden animate-fade-in">
      <div className="relative">
        <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
          {!imageError ? (
            <img
              src={listing.images[0]}
              alt={listing.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
              <span className="text-primary-600 font-medium">{listing.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={cn("w-5 h-5", isSaved ? "fill-red-500 text-red-500" : "text-gray-600")} />
        </button>

        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={cn("px-2 py-1 rounded-lg text-xs font-medium", genderColors[listing.gender])}>
            {genderLabels[listing.gender]}
          </span>
          {listing.foodIncluded && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Food
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1">{listing.name}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{listing.area}, {listing.city}</span>
          {listing.distance && (
            <span className="text-primary-600 font-medium shrink-0">• {listing.distance}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 capitalize">
            {listing.type}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 capitalize flex items-center gap-1">
            <Users className="w-3 h-3" />
            {listing.occupancy}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {listing.amenities.slice(0, 4).map(amenity => (
            <span key={amenity} className="px-2 py-1 bg-slate-50 rounded text-xs text-gray-600">
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 4 && (
            <span className="px-2 py-1 text-xs text-primary-600 font-medium">
              +{listing.amenities.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-primary-600">{formatCurrency(listing.rent)}</span>
            <span className="text-gray-500 text-sm">/month</span>
          </div>
          <div className="flex gap-2">
            <a
              href={`tel:${listing.ownerPhone}`}
              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
            <Link
              href={`/listing/${listing.id}`}
              className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>

        <a
          href={listing.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-500 hover:text-primary-600 transition-colors"
        >
          <span>Source: {listing.sourceName}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
