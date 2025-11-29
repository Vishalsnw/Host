import { NextResponse } from 'next/server';
import { scrapeRealListings, generateScrapedListings, getSupportedCities, getCityAreas, getScraperSources } from '@/lib/scrapers';
import { calculateRentComparison } from '@/lib/mockData';
import { SearchFilters, PGListing } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const filters: SearchFilters = {
    city: searchParams.get('city') || 'delhi',
    area: searchParams.get('area') || undefined,
    gender: (searchParams.get('gender') as SearchFilters['gender']) || undefined,
    type: (searchParams.get('type') as SearchFilters['type']) || undefined,
    minRent: searchParams.get('minRent') ? Number(searchParams.get('minRent')) : undefined,
    maxRent: searchParams.get('maxRent') ? Number(searchParams.get('maxRent')) : undefined,
    foodIncluded: searchParams.get('food') === 'true' ? true : searchParams.get('food') === 'false' ? false : undefined,
    nearCollege: searchParams.get('college') || undefined,
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'price_low',
    furnished: (searchParams.get('furnished') as SearchFilters['furnished']) || undefined,
  };

  const useReal = searchParams.get('real') !== 'false';
  
  let listings: PGListing[] = [];
  let isRealData = false;
  let dataSources: string[] = [];

  if (useReal) {
    try {
      const scrapeResult = await scrapeRealListings(
        filters.city,
        filters.type as 'pg' | 'hostel' | 'flat' | 'all' | undefined
      );
      listings = scrapeResult.listings;
      isRealData = scrapeResult.isRealData;
      dataSources = scrapeResult.sources;
    } catch (error) {
      console.error('Error during scraping:', error);
      listings = generateScrapedListings(
        filters.city,
        filters.area,
        filters.type as 'pg' | 'hostel' | 'flat' | 'all' | undefined,
        60
      );
      isRealData = false;
      dataSources = ['Sample Data'];
    }
  } else {
    listings = generateScrapedListings(
      filters.city,
      filters.area,
      filters.type as 'pg' | 'hostel' | 'flat' | 'all' | undefined,
      60
    );
    isRealData = false;
    dataSources = ['Sample Data'];
  }

  if (filters.gender && filters.gender !== 'all') {
    listings = listings.filter(l => l.gender === filters.gender);
  }
  if (filters.type && filters.type !== 'all') {
    listings = listings.filter(l => l.type === filters.type);
  }
  if (filters.foodIncluded !== undefined) {
    listings = listings.filter(l => l.foodIncluded === filters.foodIncluded);
  }
  if (filters.minRent) {
    listings = listings.filter(l => l.rent >= filters.minRent!);
  }
  if (filters.maxRent) {
    listings = listings.filter(l => l.rent <= filters.maxRent!);
  }
  if (filters.nearCollege) {
    listings = listings.filter(l => 
      l.nearbyColleges.some(c => c.toLowerCase().includes(filters.nearCollege!.toLowerCase()))
    );
  }
  if (filters.furnished && filters.furnished !== 'all') {
    listings = listings.filter(l => l.furnished === filters.furnished);
  }

  switch (filters.sortBy) {
    case 'price_low':
      listings.sort((a, b) => a.rent - b.rent);
      break;
    case 'price_high':
      listings.sort((a, b) => b.rent - a.rent);
      break;
    case 'rating':
      listings.sort((a, b) => b.rating - a.rating);
      break;
    case 'distance':
      listings.sort((a, b) => parseFloat(a.distance || '0') - parseFloat(b.distance || '0'));
      break;
  }

  return NextResponse.json({
    success: true,
    count: listings.length,
    listings,
    rentComparison: calculateRentComparison(listings),
    dataSource: isRealData ? 'real' : 'sample',
    isRealData,
    sources: dataSources,
    supportedCities: getSupportedCities(),
    cityAreas: getCityAreas(filters.city),
    scraperSources: getScraperSources().map(s => s.name),
    lastUpdated: new Date().toISOString()
  });
}
