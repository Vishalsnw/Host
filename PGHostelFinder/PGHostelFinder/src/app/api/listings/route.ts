import { NextResponse } from 'next/server';
import { fetchRealListings, getSupportedCities } from '@/lib/xotelo';
import { generateMockListings, calculateRentComparison } from '@/lib/mockData';
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
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'price_low'
  };

  const useRealData = searchParams.get('real') !== 'false';
  let listings: PGListing[] = [];
  let isRealData = false;

  if (useRealData) {
    try {
      const realListings = await fetchRealListings(filters.city, 50, 0);
      
      if (realListings.length > 0) {
        listings = realListings;
        isRealData = true;
      } else {
        console.log('No real listings found, falling back to mock data');
        listings = generateMockListings(filters.city, filters.area, 50);
        isRealData = false;
      }
    } catch (error) {
      console.error('Error fetching real listings:', error);
      listings = generateMockListings(filters.city, filters.area, 50);
      isRealData = false;
    }
  } else {
    listings = generateMockListings(filters.city, filters.area, 50);
    isRealData = false;
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
    dataSource: isRealData ? 'real' : 'mock',
    supportedCities: getSupportedCities()
  });
}
