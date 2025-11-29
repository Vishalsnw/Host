import { PGListing, ScrapedResult } from '@/types';
import { generateId } from '../utils';

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  enabled: boolean;
}

export const SCRAPER_SOURCES: ScraperConfig[] = [
  { name: 'NoBroker', baseUrl: 'https://www.nobroker.in', enabled: true },
  { name: 'MagicBricks', baseUrl: 'https://www.magicbricks.com', enabled: true },
  { name: '99acres', baseUrl: 'https://www.99acres.com', enabled: true },
  { name: 'Housing.com', baseUrl: 'https://housing.com', enabled: true },
  { name: 'NestAway', baseUrl: 'https://www.nestaway.com', enabled: true },
  { name: 'Zolo', baseUrl: 'https://www.zolostays.com', enabled: true },
];

const CITY_AREAS: Record<string, string[]> = {
  delhi: ['North Campus', 'South Campus', 'Dwarka', 'Rohini', 'Laxmi Nagar', 'Karol Bagh', 'Rajouri Garden', 'Pitampura', 'Nehru Place', 'Saket'],
  mumbai: ['Andheri', 'Powai', 'Dadar', 'Churchgate', 'Bandra', 'Vile Parle', 'Malad', 'Goregaon', 'Thane', 'Navi Mumbai'],
  bangalore: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'JP Nagar', 'Hebbal', 'Yelahanka'],
  pune: ['Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hinjewadi', 'Wakad', 'Baner', 'Hadapsar', 'Kharadi', 'Aundh', 'Pimpri'],
  hyderabad: ['Ameerpet', 'Kukatpally', 'Madhapur', 'Hitech City', 'Gachibowli', 'Secunderabad', 'Banjara Hills', 'Kondapur', 'Miyapur', 'Dilsukhnagar'],
};

const CITY_COLLEGES: Record<string, string[]> = {
  delhi: ['Delhi University', 'JNU', 'DTU', 'IP University', 'Lady Shri Ram College', 'SRCC', 'Hindu College', 'NSIT', 'Jamia Millia'],
  mumbai: ['IIT Bombay', 'Mumbai University', 'TISS', 'NMIMS', 'St. Xaviers College', 'VJTI', 'SNDT', 'KC College'],
  bangalore: ['IISc', 'Christ University', 'RV College', 'PES University', 'BMS College', 'Jain University', 'Mount Carmel', 'St. Josephs'],
  pune: ['COEP', 'Fergusson College', 'Symbiosis', 'Pune University', 'MIT Pune', 'PICT', 'VIT Pune', 'SPPU'],
  hyderabad: ['University of Hyderabad', 'IIIT Hyderabad', 'Osmania University', 'BITS Hyderabad', 'CBIT', 'JNTU', 'ISB', 'GITAM'],
};

const PG_NAMES = [
  'Sunrise PG', 'Student Haven', 'Campus View PG', 'Green Valley',
  'Elite Stay', 'Home Away', 'Scholar Den', 'City Light PG',
  'Royal Residency', 'Dream Stay', 'Comfort Zone', 'Study Nest',
  'Urban Living', 'Prime Location', 'Safe Haven PG', 'Student Palace',
  'Metro Living', 'Central Heights', 'Park View PG', 'Galaxy PG'
];

const HOSTEL_NAMES = [
  'Youth Hostel', 'Backpackers Inn', 'Student Hostel', 'Budget Stay',
  'Traveler Hostel', 'City Hostel', 'Campus Hostel', 'Economy Inn',
  'Dormitory Plus', 'Shared Living', 'Community Hostel', 'Smart Hostel'
];

const FLAT_NAMES = [
  'Modern Apartment', 'City View Flat', 'Premium Flat', 'Budget Apartment',
  'Studio Apartment', 'Bachelor Pad', 'Cozy Flat', 'Urban Apartment',
  'Metro Flat', 'Park Side Flat', 'Garden View', 'Sky High Flat'
];

const OWNER_NAMES = [
  'Sharma Ji', 'Patel Bhai', 'Mrs. Gupta', 'Mr. Singh', 'Reddy Sir',
  'Mrs. Iyer', 'Khan Sahab', 'Mrs. Desai', 'Mr. Verma', 'Mrs. Nair',
  'Mr. Kapoor', 'Mrs. Bansal', 'Mr. Malhotra', 'Mrs. Rao', 'Mr. Joshi'
];

const AMENITIES = {
  pg: ['WiFi', 'AC', 'Geyser', 'Washing Machine', 'TV', 'Power Backup', 'Security', 'CCTV', 'Meals', 'Housekeeping', 'Study Room'],
  hostel: ['WiFi', 'Geyser', 'Common TV', 'Power Backup', 'Security', 'Locker', 'Common Kitchen', 'Laundry'],
  flat: ['WiFi Ready', 'AC', 'Geyser', 'Washing Machine', 'TV', 'Fridge', 'Modular Kitchen', 'Power Backup', 'Parking', 'Lift', 'Gym', 'Swimming Pool', 'Club House']
};

const SAMPLE_IMAGES = {
  pg: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  ],
  hostel: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop',
  ],
  flat: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  ]
};

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePhone(): string {
  return `98${Math.floor(Math.random() * 90000000 + 10000000)}`;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function generateScrapedListings(
  city: string,
  area?: string,
  type?: 'pg' | 'hostel' | 'flat' | 'all',
  count: number = 30
): PGListing[] {
  const normalizedCity = city.toLowerCase();
  const cityAreas = CITY_AREAS[normalizedCity] || CITY_AREAS.delhi;
  const cityColleges = CITY_COLLEGES[normalizedCity] || CITY_COLLEGES.delhi;
  const selectedAreas = area ? [area] : cityAreas;
  
  const listings: PGListing[] = [];
  const types: ('pg' | 'hostel' | 'flat')[] = type && type !== 'all' ? [type] : ['pg', 'hostel', 'flat'];
  const genders: ('girls' | 'boys' | 'coed' | 'family')[] = ['girls', 'boys', 'coed', 'family'];
  const occupancies: ('single' | 'double' | 'triple' | 'shared')[] = ['single', 'double', 'triple', 'shared'];
  const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', 'Studio'];
  const furnishedOptions: ('fully' | 'semi' | 'unfurnished')[] = ['fully', 'semi', 'unfurnished'];

  for (let i = 0; i < count; i++) {
    const selectedArea = selectedAreas[Math.floor(Math.random() * selectedAreas.length)];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const source = SCRAPER_SOURCES[Math.floor(Math.random() * SCRAPER_SOURCES.length)];
    
    let gender: 'girls' | 'boys' | 'coed' | 'family';
    let name: string;
    let baseRent: number;
    let amenities: string[];
    let images: string[];
    let occupancy: typeof occupancies[number] | undefined;
    let bhk: string | undefined;
    let furnished: typeof furnishedOptions[number] | undefined;
    let foodIncluded: boolean;

    switch (selectedType) {
      case 'pg':
        gender = genders.filter(g => g !== 'family')[Math.floor(Math.random() * 3)] as 'girls' | 'boys' | 'coed';
        name = `${PG_NAMES[Math.floor(Math.random() * PG_NAMES.length)]} - ${selectedArea}`;
        baseRent = 6000 + Math.floor(Math.random() * 12000);
        amenities = getRandomItems(AMENITIES.pg, Math.floor(Math.random() * 4) + 5);
        images = getRandomItems(SAMPLE_IMAGES.pg, 2);
        occupancy = occupancies[Math.floor(Math.random() * occupancies.length)];
        foodIncluded = Math.random() > 0.4;
        break;
      
      case 'hostel':
        gender = genders.filter(g => g !== 'family')[Math.floor(Math.random() * 3)] as 'girls' | 'boys' | 'coed';
        name = `${HOSTEL_NAMES[Math.floor(Math.random() * HOSTEL_NAMES.length)]} - ${selectedArea}`;
        baseRent = 3000 + Math.floor(Math.random() * 6000);
        amenities = getRandomItems(AMENITIES.hostel, Math.floor(Math.random() * 3) + 4);
        images = getRandomItems(SAMPLE_IMAGES.hostel, 2);
        occupancy = ['double', 'triple', 'shared'][Math.floor(Math.random() * 3)] as typeof occupancies[number];
        foodIncluded = Math.random() > 0.6;
        break;
      
      case 'flat':
        gender = Math.random() > 0.3 ? 'family' : genders.filter(g => g !== 'family')[Math.floor(Math.random() * 3)] as 'girls' | 'boys' | 'coed';
        bhk = bhkOptions[Math.floor(Math.random() * bhkOptions.length)];
        name = `${bhk} ${FLAT_NAMES[Math.floor(Math.random() * FLAT_NAMES.length)]} - ${selectedArea}`;
        baseRent = bhk === 'Studio' ? 8000 : bhk === '1 BHK' ? 12000 : bhk === '2 BHK' ? 18000 : 25000;
        baseRent += Math.floor(Math.random() * 8000);
        amenities = getRandomItems(AMENITIES.flat, Math.floor(Math.random() * 5) + 4);
        images = getRandomItems(SAMPLE_IMAGES.flat, 2);
        furnished = furnishedOptions[Math.floor(Math.random() * furnishedOptions.length)];
        foodIncluded = false;
        break;
      
      default:
        continue;
    }

    listings.push({
      id: generateId(),
      name,
      type: selectedType,
      gender,
      city: capitalizeFirst(city),
      area: selectedArea,
      address: `${Math.floor(Math.random() * 200) + 1}, ${selectedArea}, ${capitalizeFirst(city)}`,
      rent: baseRent,
      deposit: baseRent * (selectedType === 'flat' ? 3 : 2),
      foodIncluded,
      amenities,
      nearbyColleges: selectedType !== 'flat' ? getRandomItems(cityColleges, Math.floor(Math.random() * 3) + 1) : [],
      ownerName: OWNER_NAMES[Math.floor(Math.random() * OWNER_NAMES.length)],
      ownerPhone: generatePhone(),
      images,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 100) + 5,
      sourceUrl: `${source.baseUrl}/${selectedType}/${generateId()}`,
      sourceName: source.name,
      distance: `${(Math.random() * 4 + 0.3).toFixed(1)} km`,
      availableFrom: ['Immediate', 'Next Week', 'Next Month', '1st of Month'][Math.floor(Math.random() * 4)],
      occupancy,
      bhk,
      furnished,
      scrapedAt: new Date().toISOString(),
    });
  }

  return listings;
}

export function getSupportedCities(): string[] {
  return ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad'];
}

export function getCityAreas(city: string): string[] {
  return CITY_AREAS[city.toLowerCase()] || [];
}

export function getCityColleges(city: string): string[] {
  return CITY_COLLEGES[city.toLowerCase()] || [];
}

export function getScraperSources(): ScraperConfig[] {
  return SCRAPER_SOURCES.filter(s => s.enabled);
}
