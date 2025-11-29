import { PGListing } from '@/types';
import { generateMockListings } from './mockData';
import { generateScrapedListings } from './scrapers';

let cachedListings: Map<string, PGListing> = new Map();
let lastGeneratedCity: string = '';
let lastGeneratedType: string = '';

export function getListings(
  city: string, 
  area?: string, 
  type?: 'pg' | 'hostel' | 'flat' | 'all',
  forceRefresh: boolean = false
): PGListing[] {
  const typeKey = type || 'all';
  if (forceRefresh || lastGeneratedCity !== city || lastGeneratedType !== typeKey || cachedListings.size === 0) {
    cachedListings.clear();
    const listings = generateScrapedListings(city, area, type, 50);
    listings.forEach(listing => {
      cachedListings.set(listing.id, listing);
    });
    lastGeneratedCity = city;
    lastGeneratedType = typeKey;
  }
  return Array.from(cachedListings.values());
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
  lastGeneratedType = '';
}
