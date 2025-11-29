import { NextResponse } from 'next/server';
import { scrapeRealListings, getScraperSources } from '@/lib/scrapers';

const SCRAPE_SOURCES = getScraperSources();

export async function POST(request: Request) {
  try {
    const { city, area, type = 'all' } = await request.json();

    if (!city) {
      return NextResponse.json({
        success: false,
        error: 'City is required'
      }, { status: 400 });
    }

    const result = await scrapeRealListings(
      city,
      type as 'pg' | 'hostel' | 'flat' | 'all'
    );

    return NextResponse.json({
      success: true,
      message: `Found ${result.listings.length} ${type === 'all' ? 'listings' : type + 's'} for ${area || 'all areas'} in ${city}`,
      listings: result.listings,
      isRealData: result.isRealData,
      sources: result.sources,
      lastUpdated: new Date().toISOString(),
      propertyTypes: {
        pg: result.listings.filter(l => l.type === 'pg').length,
        hostel: result.listings.filter(l => l.type === 'hostel').length,
        flat: result.listings.filter(l => l.type === 'flat').length,
      }
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'delhi';
  const type = (searchParams.get('type') || 'all') as 'pg' | 'hostel' | 'flat' | 'all';

  try {
    const result = await scrapeRealListings(city, type);

    return NextResponse.json({
      success: true,
      message: `Found ${result.listings.length} ${type === 'all' ? 'listings' : type + 's'} in ${city}`,
      listings: result.listings,
      isRealData: result.isRealData,
      sources: result.sources,
      lastUpdated: new Date().toISOString(),
      propertyTypes: {
        pg: result.listings.filter(l => l.type === 'pg').length,
        hostel: result.listings.filter(l => l.type === 'hostel').length,
        flat: result.listings.filter(l => l.type === 'flat').length,
      }
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch listings'
    }, { status: 500 });
  }
}
