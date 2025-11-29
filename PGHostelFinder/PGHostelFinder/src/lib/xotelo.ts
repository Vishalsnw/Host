import { PGListing } from '@/types';

const CITY_LOCATION_KEYS: Record<string, string> = {
  'delhi': 'g304551',
  'new delhi': 'g304551',
  'mumbai': 'g304554',
  'bangalore': 'g297628',
  'bengaluru': 'g297628',
  'pune': 'g297654',
  'hyderabad': 'g297586',
};

const CITY_NAMES: Record<string, string> = {
  'g304551': 'Delhi',
  'g304554': 'Mumbai',
  'g297628': 'Bangalore',
  'g297654': 'Pune',
  'g297586': 'Hyderabad',
};

interface XoteloListing {
  name: string;
  key: string;
  accommodation_type: string;
  url: string;
  review_summary: {
    rating: number;
    count: number;
  };
  price_ranges: {
    maximum: number;
    minimum: number;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  image: string;
  mentions: string[];
  merchandising_labels: string[];
}

interface XoteloResponse {
  error: string | null;
  result: {
    total_count: number;
    limit: number;
    offset: number;
    list: XoteloListing[];
  } | null;
  timestamp: number;
}

export function getLocationKey(city: string): string | null {
  const normalizedCity = city.toLowerCase().trim();
  return CITY_LOCATION_KEYS[normalizedCity] || null;
}

export function getCityFromKey(locationKey: string): string {
  return CITY_NAMES[locationKey] || 'Unknown';
}

export async function fetchRealListings(
  city: string,
  limit: number = 30,
  offset: number = 0
): Promise<PGListing[]> {
  const locationKey = getLocationKey(city);
  
  if (!locationKey) {
    console.error(`Unknown city: ${city}`);
    return [];
  }

  try {
    const url = `https://data.xotelo.com/api/list?location_key=${locationKey}&offset=${offset}&limit=${limit}&sort=best_value`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Xotelo API error: ${response.status}`);
    }

    const data: XoteloResponse = await response.json();

    if (data.error || !data.result?.list) {
      console.error('Xotelo API returned error:', data.error);
      return [];
    }

    const validListings = data.result.list.filter(item => 
      item.price_ranges && 
      item.price_ranges.minimum !== null && 
      item.price_ranges.minimum !== undefined
    );
    
    return validListings.map((item, index) => transformToListing(item, city, offset + index));
  } catch (error) {
    console.error('Error fetching from Xotelo:', error);
    return [];
  }
}

function transformToListing(item: XoteloListing, city: string, index: number): PGListing {
  const minPrice = item.price_ranges?.minimum || 50;
  const maxPrice = item.price_ranges?.maximum || 100;
  const minPriceINR = Math.round(minPrice * 83);
  const maxPriceINR = Math.round(maxPrice * 83);
  const monthlyRent = minPriceINR * 30;
  
  const type = determineType(item.accommodation_type, item.name);
  const gender = determineGender(item.name, item.mentions);
  const area = extractArea(item.name, item.mentions);
  
  const amenities = extractAmenities(item.mentions, item.merchandising_labels);
  
  return {
    id: `real-${item.key.replace(/[^a-zA-Z0-9]/g, '-')}`,
    name: cleanName(item.name),
    type,
    gender,
    city: capitalizeCity(city),
    area: area || 'Central',
    address: `${area || 'Central'}, ${capitalizeCity(city)}`,
    rent: monthlyRent,
    deposit: monthlyRent * 2,
    foodIncluded: item.merchandising_labels.some(l => 
      l.toLowerCase().includes('breakfast') || l.toLowerCase().includes('all inclusive')
    ),
    amenities,
    nearbyColleges: [],
    ownerName: 'Property Manager',
    ownerPhone: generateContactNumber(),
    images: [item.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'],
    rating: item.review_summary.rating,
    reviews: item.review_summary.count,
    sourceUrl: item.url,
    sourceName: 'TripAdvisor',
    pricePerNight: minPriceINR,
    coordinates: item.geo,
  };
}

function determineType(accommodationType: string, name: string): 'pg' | 'hostel' {
  const lowerName = name.toLowerCase();
  const lowerType = accommodationType.toLowerCase();
  
  if (lowerName.includes('hostel') || lowerType.includes('hostel')) return 'hostel';
  
  return 'pg';
}

function determineGender(name: string, mentions: string[]): 'girls' | 'boys' | 'coed' {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('girls') || lowerName.includes('ladies') || lowerName.includes('women')) {
    return 'girls';
  }
  if (lowerName.includes('boys') || lowerName.includes('men only') || lowerName.includes('gents')) {
    return 'boys';
  }
  
  return 'coed';
}

function extractArea(name: string, mentions: string[]): string {
  const mentionsStr = mentions.join(', ');
  
  const areaKeywords = ['koramangala', 'indiranagar', 'whitefield', 'btm', 'hsr', 
    'electronic city', 'marathahalli', 'andheri', 'bandra', 'powai', 'worli',
    'connaught', 'cp', 'lajpat', 'nehru place', 'saket', 'gurgaon', 'noida',
    'aerocity', 'dwarka', 'rohini', 'pitampura', 'kothrud', 'hinjewadi',
    'baner', 'kharadi', 'viman nagar', 'hi-tech city', 'madhapur', 'gachibowli',
    'jubilee hills', 'banjara hills'];
  
  const lowerName = name.toLowerCase();
  for (const area of areaKeywords) {
    if (lowerName.includes(area)) {
      return capitalizeWords(area);
    }
  }
  
  if (mentionsStr.includes('Centrally Located')) return 'Central';
  if (mentionsStr.includes('Airport')) return 'Airport Area';
  if (mentionsStr.includes('Residential')) return 'Residential Area';
  
  return '';
}

function extractAmenities(mentions: string[], labels: string[]): string[] {
  const amenities: string[] = ['WiFi'];
  
  const combined = [...mentions, ...labels].join(' ').toLowerCase();
  
  if (combined.includes('modern')) amenities.push('AC');
  if (combined.includes('pool') || combined.includes('swimming')) amenities.push('Swimming Pool');
  if (combined.includes('breakfast') || combined.includes('all inclusive')) amenities.push('Meals Included');
  if (combined.includes('gym') || combined.includes('fitness')) amenities.push('Gym');
  if (combined.includes('parking')) amenities.push('Parking');
  if (combined.includes('business')) amenities.push('Business Center');
  if (combined.includes('spa')) amenities.push('Spa');
  if (combined.includes('view') || combined.includes('city view')) amenities.push('City View');
  
  amenities.push('24/7 Security', 'Power Backup');
  
  return Array.from(new Set(amenities));
}

function cleanName(name: string): string {
  return name
    .replace(/OYO \d+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalizeCity(city: string): string {
  return city.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function capitalizeWords(str: string): string {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function generateContactNumber(): string {
  return `98${Math.floor(Math.random() * 90000000 + 10000000)}`;
}

export function getSupportedCities(): string[] {
  return ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];
}
