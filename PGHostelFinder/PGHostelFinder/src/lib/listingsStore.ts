import { PGListing } from '@/types';
import { generateMockListings } from './mockData';
import { fetchRealListings } from './xotelo';

let cachedListings: Map<string, PGListing> = new Map();
let lastGeneratedCity: string = '';
let isRealData: boolean = false;

export function getListings(city: string, area?: string, forceRefresh: boolean = false): PGListing[] {
  if (forceRefresh || lastGeneratedCity !== city || cachedListings.size === 0) {
    cachedListings.clear();
    const listings = generateMockListings(city, area, 50);
    listings.forEach(listing => {
      cachedListings.set(listing.id, listing);
    });
    lastGeneratedCity = city;
    isRealData = false;
  }
  return Array.from(cachedListings.values());
}

export async function getRealListings(city: string, forceRefresh: boolean = false): Promise<PGListing[]> {
  if (!forceRefresh && lastGeneratedCity === city && cachedListings.size > 0 && isRealData) {
    return Array.from(cachedListings.values());
  }

  try {
    const listings = await fetchRealListings(city, 50, 0);
    
    if (listings.length > 0) {
      cachedListings.clear();
      listings.forEach(listing => {
        cachedListings.set(listing.id, listing);
      });
      lastGeneratedCity = city;
      isRealData = true;
      return listings;
    }
  } catch (error) {
    console.error('Error fetching real listings:', error);
  }

  return getListings(city, undefined, forceRefresh);
}

export function getListingById(id: string): PGListing | undefined {
  if (cachedListings.size === 0) {
    getListings('delhi');
  }
  return cachedListings.get(id);
}

export function addListing(listing: PGListing): void {
  cachedListings.set(listing.id, listing);
}

export function addListings(listings: PGListing[]): void {
  listings.forEach(listing => {
    cachedListings.set(listing.id, listing);
  });
}

export function getAllListings(): PGListing[] {
  if (cachedListings.size === 0) {
    getListings('delhi');
  }
  return Array.from(cachedListings.values());
}

export function clearListings(): void {
  cachedListings.clear();
  lastGeneratedCity = '';
  isRealData = false;
}

export function isUsingRealData(): boolean {
  return isRealData;
}
