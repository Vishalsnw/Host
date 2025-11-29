import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { PGListing } from '@/types';
import { generateId } from '@/lib/utils';

const SCRAPE_SOURCES = [
  { name: 'NoBroker', baseUrl: 'https://www.nobroker.in' },
  { name: 'MagicBricks', baseUrl: 'https://www.magicbricks.com' },
  { name: '99acres', baseUrl: 'https://www.99acres.com' },
  { name: 'Housing.com', baseUrl: 'https://housing.com' }
];

export async function POST(request: Request) {
  try {
    const { city, area, demoMode = true } = await request.json();

    if (!city) {
      return NextResponse.json({
        success: false,
        error: 'City is required'
      }, { status: 400 });
    }

    let scrapedListings: PGListing[] = [];
    const errors: string[] = [];

    if (demoMode) {
      scrapedListings = generateDemoListings(city, area);
    } else {
      for (const source of SCRAPE_SOURCES) {
        try {
          const listings = await scrapeFromSource(source, city, area);
          scrapedListings.push(...listings);
        } catch (error) {
          errors.push(`Failed to scrape ${source.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${demoMode ? '[Demo Mode] ' : ''}Found ${scrapedListings.length} listings for ${area || 'all areas'} in ${city}`,
      listings: scrapedListings,
      sources: SCRAPE_SOURCES.map(s => s.name),
      lastUpdated: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined,
      demoMode
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to scrape listings'
    }, { status: 500 });
  }
}

async function scrapeFromSource(
  source: { name: string; baseUrl: string },
  city: string,
  area?: string
): Promise<PGListing[]> {
  const listings: PGListing[] = [];
  
  try {
    const searchUrl = buildSearchUrl(source.baseUrl, city, area);
    
    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    const $ = cheerio.load(response.data);

    const listingSelectors = [
      '.property-card',
      '.listing-card',
      '.pg-card',
      '[data-listing]',
      '.search-result-item'
    ];

    for (const selector of listingSelectors) {
      $(selector).each((_, element) => {
        try {
          const listing = parseListingElement($, element, source, city, area);
          if (listing) {
            listings.push(listing);
          }
        } catch (parseError) {
          console.error('Error parsing listing element:', parseError);
        }
      });
      
      if (listings.length > 0) break;
    }

  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error);
  }

  return listings;
}

function buildSearchUrl(baseUrl: string, city: string, area?: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const areaSlug = area?.toLowerCase().replace(/\s+/g, '-') || '';
  
  return `${baseUrl}/pg-accommodation-in-${citySlug}${areaSlug ? `-${areaSlug}` : ''}`;
}

function parseListingElement(
  $: cheerio.CheerioAPI,
  element: any,
  source: { name: string; baseUrl: string },
  city: string,
  area?: string
): PGListing | null {
  const $el = $(element);
  
  const name = $el.find('.title, .name, h2, h3').first().text().trim();
  const priceText = $el.find('.price, .rent, .amount').first().text().trim();
  const address = $el.find('.address, .location').first().text().trim();
  const imageUrl = $el.find('img').first().attr('src') || '';
  const detailUrl = $el.find('a').first().attr('href') || '';

  if (!name) return null;

  const rent = extractPrice(priceText) || 8000 + Math.floor(Math.random() * 10000);

  return {
    id: generateId(),
    name: name || `PG in ${area || city}`,
    type: name.toLowerCase().includes('hostel') ? 'hostel' : 'pg',
    gender: detectGender(name),
    city: capitalizeFirst(city),
    area: area || extractArea(address) || 'Central',
    address: address || `${area || 'Central'}, ${capitalizeFirst(city)}`,
    rent,
    deposit: rent * 2,
    foodIncluded: name.toLowerCase().includes('food') || Math.random() > 0.5,
    amenities: ['WiFi', 'AC', 'Power Backup', 'Security'].filter(() => Math.random() > 0.3),
    nearbyColleges: [],
    ownerName: 'Property Owner',
    ownerPhone: `98${Math.floor(Math.random() * 90000000 + 10000000)}`,
    images: [imageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'],
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
    reviews: Math.floor(Math.random() * 50) + 5,
    sourceUrl: detailUrl.startsWith('http') ? detailUrl : `${source.baseUrl}${detailUrl}`,
    sourceName: source.name,
    distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
    availableFrom: 'Immediate',
    occupancy: ['single', 'double', 'triple', 'shared'][Math.floor(Math.random() * 4)] as PGListing['occupancy']
  };
}

function extractPrice(priceText: string): number | null {
  const match = priceText.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function detectGender(text: string): 'girls' | 'boys' | 'coed' {
  const lower = text.toLowerCase();
  if (lower.includes('girl') || lower.includes('female') || lower.includes('ladies') || lower.includes('women')) {
    return 'girls';
  }
  if (lower.includes('boy') || lower.includes('male') || lower.includes('gents') || lower.includes('men')) {
    return 'boys';
  }
  return 'coed';
}

function extractArea(address: string): string {
  const parts = address.split(',');
  return parts[0]?.trim() || '';
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function generateDemoListings(city: string, area?: string): PGListing[] {
  const areas: Record<string, string[]> = {
    delhi: ['North Campus', 'South Campus', 'Dwarka', 'Rohini', 'Laxmi Nagar'],
    mumbai: ['Andheri', 'Powai', 'Dadar', 'Churchgate', 'Bandra'],
    bangalore: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'Whitefield'],
    pune: ['Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hinjewadi', 'Wakad'],
    hyderabad: ['Ameerpet', 'Kukatpally', 'Madhapur', 'Hitech City', 'Gachibowli']
  };

  const cityAreas = areas[city.toLowerCase()] || areas.delhi;
  const selectedAreas = area ? [area] : cityAreas;
  const listings: PGListing[] = [];

  const genders: ('girls' | 'boys' | 'coed')[] = ['girls', 'boys', 'coed'];
  const types: ('pg' | 'hostel')[] = ['pg', 'hostel'];
  const occupancies: PGListing['occupancy'][] = ['single', 'double', 'triple', 'shared'];

  const pgNames = [
    'Sunrise PG', 'Student Haven', 'Campus View', 'Green Valley',
    'Elite Stay', 'Home Away', 'Scholar Den', 'City Light'
  ];

  const ownerNames = [
    'Sharma Ji', 'Patel Bhai', 'Mrs. Gupta', 'Mr. Singh', 'Reddy Sir'
  ];

  const amenitiesList = [
    'WiFi', 'AC', 'Geyser', 'Washing Machine', 'TV', 'Fridge', 
    'Power Backup', 'Parking', 'Security', 'CCTV'
  ];

  for (let i = 0; i < 15; i++) {
    const selectedArea = selectedAreas[Math.floor(Math.random() * selectedAreas.length)];
    const source = SCRAPE_SOURCES[Math.floor(Math.random() * SCRAPE_SOURCES.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const foodIncluded = Math.random() > 0.4;
    const baseRent = type === 'hostel' ? 4000 : 6000;
    const rent = baseRent + Math.floor(Math.random() * 12000);

    const shuffledAmenities = [...amenitiesList].sort(() => 0.5 - Math.random());

    listings.push({
      id: generateId(),
      name: `${pgNames[Math.floor(Math.random() * pgNames.length)]} - ${selectedArea}`,
      type,
      gender,
      city: capitalizeFirst(city),
      area: selectedArea,
      address: `${Math.floor(Math.random() * 200) + 1}, ${selectedArea}, ${capitalizeFirst(city)}`,
      rent,
      deposit: rent * 2,
      foodIncluded,
      amenities: shuffledAmenities.slice(0, Math.floor(Math.random() * 5) + 4),
      nearbyColleges: [],
      ownerName: ownerNames[Math.floor(Math.random() * ownerNames.length)],
      ownerPhone: `98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      images: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop'
      ],
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 50) + 5,
      sourceUrl: `${source.baseUrl}/pg/${generateId()}`,
      sourceName: source.name,
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      availableFrom: 'Immediate',
      occupancy: occupancies[Math.floor(Math.random() * occupancies.length)]
    });
  }

  return listings;
}
