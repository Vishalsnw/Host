export interface PGListing {
  id: string;
  name: string;
  type: 'pg' | 'hostel' | 'flat';
  gender: 'girls' | 'boys' | 'coed' | 'family';
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
  bhk?: string;
  furnished?: 'fully' | 'semi' | 'unfurnished';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  scrapedAt?: string;
}

export interface SearchFilters {
  city: string;
  area?: string;
  gender?: 'girls' | 'boys' | 'coed' | 'family' | 'all';
  minRent?: number;
  maxRent?: number;
  foodIncluded?: boolean;
  nearCollege?: string;
  type?: 'pg' | 'hostel' | 'flat' | 'all';
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'distance';
  furnished?: 'fully' | 'semi' | 'unfurnished' | 'all';
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

export interface ScrapedResult {
  listings: PGListing[];
  source: string;
  scrapedAt: string;
  success: boolean;
  error?: string;
}
