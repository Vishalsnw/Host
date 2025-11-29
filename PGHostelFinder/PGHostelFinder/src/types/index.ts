export interface PGListing {
  id: string;
  name: string;
  type: 'pg' | 'hostel';
  gender: 'girls' | 'boys' | 'coed';
  city: string;
  area: string;
  address: string;
  rent: number;
  deposit: number;
  foodIncluded: boolean;
  amenities: string[];
  nearbyColleges: string[];
  ownerName: string;
  ownerPhone: string;
  images: string[];
  rating: number;
  reviews: number;
  sourceUrl: string;
  sourceName: string;
  distance?: string;
  availableFrom?: string;
  occupancy?: 'single' | 'double' | 'triple' | 'shared';
  pricePerNight?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SearchFilters {
  city: string;
  area?: string;
  gender?: 'girls' | 'boys' | 'coed' | 'all';
  minRent?: number;
  maxRent?: number;
  foodIncluded?: boolean;
  nearCollege?: string;
  type?: 'pg' | 'hostel' | 'all';
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'distance';
}

export interface City {
  name: string;
  slug: string;
  areas: string[];
  colleges: string[];
}

export interface RentComparison {
  area: string;
  avgRent: number;
  minRent: number;
  maxRent: number;
  listingCount: number;
}
