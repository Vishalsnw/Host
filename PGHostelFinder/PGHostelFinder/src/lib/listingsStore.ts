import { PGListing } from '@/types';

let cachedListings: Map<string, PGListing> = new Map();

export function getListings(): PGListing[] {
  return Array.from(cachedListings.values());
}

export function getListingById(id: string): PGListing | undefined {
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
  return Array.from(cachedListings.values());
}

export function clearListings(): void {
  cachedListings.clear();
}
