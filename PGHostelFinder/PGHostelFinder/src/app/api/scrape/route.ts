import { NextResponse } from 'next/server';
import { generateScrapedListings, getScraperSources } from '@/lib/scrapers';

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

    const scrapedListings = generateScrapedListings(
      city, 
      area, 
      type as 'pg' | 'hostel' | 'flat' | 'all',
      40
    );

    return NextResponse.json({
      success: true,
      message: `Found ${scrapedListings.length} ${type === 'all' ? 'listings' : type + 's'} for ${area || 'all areas'} in ${city}`,
      listings: scrapedListings,
      sources: SCRAPE_SOURCES.map(s => s.name),
      lastUpdated: new Date().toISOString(),
      propertyTypes: {
        pg: scrapedListings.filter(l => l.type === 'pg').length,
        hostel: scrapedListings.filter(l => l.type === 'hostel').length,
        flat: scrapedListings.filter(l => l.type === 'flat').length,
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
  const area = searchParams.get('area') || undefined;
  const type = (searchParams.get('type') || 'all') as 'pg' | 'hostel' | 'flat' | 'all';

  try {
    const scrapedListings = generateScrapedListings(city, area, type, 40);

    return NextResponse.json({
      success: true,
      message: `Found ${scrapedListings.length} ${type === 'all' ? 'listings' : type + 's'} for ${area || 'all areas'} in ${city}`,
      listings: scrapedListings,
      sources: SCRAPE_SOURCES.map(s => s.name),
      lastUpdated: new Date().toISOString(),
      propertyTypes: {
        pg: scrapedListings.filter(l => l.type === 'pg').length,
        hostel: scrapedListings.filter(l => l.type === 'hostel').length,
        flat: scrapedListings.filter(l => l.type === 'flat').length,
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
