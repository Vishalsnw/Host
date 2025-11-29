'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import { PGListing } from '@/types';
import { getListingById, getListings } from '@/lib/listingsStore';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Phone, 
  MessageCircle,
  Utensils,
  Wifi,
  Car,
  Shield,
  ExternalLink,
  Users,
  Calendar,
  IndianRupee,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<PGListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    const id = params.id as string;
    
    let found = getListingById(id);
    
    if (!found) {
      getListings('delhi');
      found = getListingById(id);
    }
    
    if (found) {
      setListing(found);
    } else {
      setError(true);
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-500 mb-6">This listing may have been removed or is no longer available.</p>
          <button
            onClick={() => router.push('/search')}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Browse All PGs
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

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

  const amenityIcons: Record<string, React.ElementType> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Security': Shield,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className={cn("w-6 h-6", isSaved ? "fill-red-500 text-red-500" : "text-gray-700")} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="aspect-[16/10] bg-gray-100">
          <img
            src={listing.images[activeImage]}
            alt={listing.name}
            className="w-full h-full object-cover"
          />
        </div>
        {listing.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {listing.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  idx === activeImage ? "bg-white w-4" : "bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-4 bg-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-900">{listing.name}</h1>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg shrink-0">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-800">{listing.rating}</span>
            <span className="text-gray-500 text-sm">({listing.reviews})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm">{listing.address}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn("px-3 py-1 rounded-full text-sm font-medium", genderColors[listing.gender])}>
            {genderLabels[listing.gender]}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
            {listing.type}
          </span>
          {listing.foodIncluded && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
              <Utensils className="w-3 h-3" /> Food Included
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary-600">{formatCurrency(listing.rent)}</span>
          <span className="text-gray-500">/month</span>
        </div>
      </div>

      <div className="mt-2 bg-white px-4 py-4">
        <h2 className="font-semibold text-gray-900 mb-3">Property Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Users className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Occupancy</p>
              <p className="font-medium text-gray-900 capitalize">{listing.occupancy}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <IndianRupee className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Deposit</p>
              <p className="font-medium text-gray-900">{formatCurrency(listing.deposit)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Calendar className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="font-medium text-gray-900">{listing.availableFrom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <MapPin className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="font-medium text-gray-900">{listing.distance}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-white px-4 py-4">
        <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
        <div className="grid grid-cols-2 gap-2">
          {listing.amenities.map(amenity => {
            const Icon = amenityIcons[amenity] || Check;
            return (
              <div key={amenity} className="flex items-center gap-2 py-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-gray-700 text-sm">{amenity}</span>
              </div>
            );
          })}
        </div>
      </div>

      {listing.nearbyColleges.length > 0 && (
        <div className="mt-2 bg-white px-4 py-4">
          <h2 className="font-semibold text-gray-900 mb-3">Nearby Colleges</h2>
          <div className="space-y-2">
            {listing.nearbyColleges.map(college => (
              <div key={college} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-700">{college}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 bg-white px-4 py-4">
        <h2 className="font-semibold text-gray-900 mb-3">Owner Details</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-primary-600">
              {listing.ownerName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{listing.ownerName}</p>
            <p className="text-gray-500 text-sm">{listing.ownerPhone}</p>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-white px-4 py-4">
        <a
          href={listing.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div>
            <p className="text-sm text-gray-500">Source</p>
            <p className="font-medium text-primary-600">{listing.sourceName}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-primary-600" />
        </a>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-3 safe-area-bottom">
        <a
          href={`tel:${listing.ownerPhone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
        >
          <Phone className="w-5 h-5" />
          Call Now
        </a>
        <a
          href={`https://wa.me/91${listing.ownerPhone.replace(/\D/g, '')}?text=Hi, I'm interested in ${listing.name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>

      <BottomNav />
    </div>
  );
}
