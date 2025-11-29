import { PGListing, RentComparison } from '@/types';
import { getSupportedCities, getCityAreas, getCityColleges, getScraperSources } from './scrapers';

export function calculateRentComparison(listings: PGListing[]): RentComparison[] {
  const areaMap = new Map<string, number[]>();
  
  listings.forEach(listing => {
    const rents = areaMap.get(listing.area) || [];
    rents.push(listing.rent);
    areaMap.set(listing.area, rents);
  });

  return Array.from(areaMap.entries()).map(([area, rents]) => ({
    area,
    avgRent: Math.round(rents.reduce((a, b) => a + b, 0) / rents.length),
    minRent: Math.min(...rents),
    maxRent: Math.max(...rents),
    listingCount: rents.length
  }));
}

export { getSupportedCities, getCityAreas, getCityColleges, getScraperSources };
