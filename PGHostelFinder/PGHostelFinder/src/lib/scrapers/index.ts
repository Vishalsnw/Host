import { PGListing } from '@/types';
import { scrapeNoBroker } from './nobroker';
import { scrapeMagicBricks } from './magicbricks';
import { scrape99Acres } from './99acres';

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  enabled: boolean;
}

export const SCRAPER_SOURCES: ScraperConfig[] = [
  { name: 'NoBroker', baseUrl: 'https://www.nobroker.in', enabled: true },
  { name: 'MagicBricks', baseUrl: 'https://www.magicbricks.com', enabled: true },
  { name: '99acres', baseUrl: 'https://www.99acres.com', enabled: true },
  { name: 'Housing.com', baseUrl: 'https://housing.com', enabled: false },
  { name: 'NestAway', baseUrl: 'https://www.nestaway.com', enabled: false },
  { name: 'Zolo', baseUrl: 'https://www.zolostays.com', enabled: false },
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

export async function scrapeRealListings(
  city: string,
  type?: 'pg' | 'hostel' | 'flat' | 'all'
): Promise<{ listings: PGListing[]; isRealData: boolean; sources: string[]; error?: string }> {
  const allListings: PGListing[] = [];
  const successfulSources: string[] = [];
  const errors: string[] = [];
  
  console.log(`[Scraper] Starting real scrape for ${city}, type: ${type || 'all'}`);
  
  const scraperPromises: Promise<{ source: string; listings: PGListing[] }>[] = [];
  
  if (type === 'pg' || type === 'hostel' || type === 'all' || !type) {
    scraperPromises.push(
      scrapeNoBroker(city, 'pg').then(listings => ({ source: 'NoBroker', listings }))
    );
  }
  
  if (type === 'flat' || type === 'all' || !type) {
    scraperPromises.push(
      scrapeMagicBricks(city, 'flat').then(listings => ({ source: 'MagicBricks', listings })),
      scrape99Acres(city, 'flat').then(listings => ({ source: '99acres', listings }))
    );
  }
  
  const results = await Promise.allSettled(scraperPromises);
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.listings.length > 0) {
      allListings.push(...result.value.listings);
      successfulSources.push(result.value.source);
    } else if (result.status === 'rejected') {
      errors.push(String(result.reason));
    }
  }
  
  console.log(`[Scraper] Total real listings found: ${allListings.length} from sources: ${successfulSources.join(', ')}`);
  
  if (allListings.length > 0) {
    return {
      listings: allListings,
      isRealData: true,
      sources: successfulSources
    };
  }
  
  return {
    listings: [],
    isRealData: false,
    sources: [],
    error: errors.length > 0 
      ? `Scraping failed: ${errors.join('; ')}` 
      : 'No listings found from any source. Please try again later.'
  };
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
