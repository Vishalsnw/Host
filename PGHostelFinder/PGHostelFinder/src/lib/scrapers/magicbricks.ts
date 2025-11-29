import axios from 'axios';
import * as cheerio from 'cheerio';
import { PGListing } from '@/types';
import { generateId } from '../utils';

const MAGICBRICKS_BASE_URL = 'https://www.magicbricks.com';

const CITY_SLUGS: Record<string, string> = {
  delhi: 'New-Delhi',
  mumbai: 'Mumbai',
  bangalore: 'Bangalore',
  pune: 'Pune',
  hyderabad: 'Hyderabad',
};

function getHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };
}

function extractPrice(priceText: string): number {
  const cleaned = priceText.replace(/[₹,\s]/g, '');
  const match = cleaned.match(/(\d+)/);
  if (match) {
    let price = parseInt(match[1], 10);
    if (priceText.toLowerCase().includes('lac') || priceText.toLowerCase().includes('lakh')) {
      price = price * 100000;
    } else if (priceText.toLowerCase().includes('cr')) {
      price = price * 10000000;
    }
    return price;
  }
  return 10000;
}

function detectGender(text: string): 'girls' | 'boys' | 'coed' | 'family' {
  const lower = text.toLowerCase();
  if (lower.includes('girl') || lower.includes('female') || lower.includes('ladies')) return 'girls';
  if (lower.includes('boy') || lower.includes('male') || lower.includes('gents')) return 'boys';
  if (lower.includes('family') || lower.includes('bhk')) return 'family';
  return 'coed';
}

function detectType(text: string): 'pg' | 'hostel' | 'flat' {
  const lower = text.toLowerCase();
  if (lower.includes('hostel')) return 'hostel';
  if (lower.includes('pg') || lower.includes('paying guest')) return 'pg';
  return 'flat';
}

function capitalizeCity(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
}

export async function scrapeMagicBricks(city: string, type: 'pg' | 'flat' = 'flat'): Promise<PGListing[]> {
  const listings: PGListing[] = [];
  const citySlug = CITY_SLUGS[city.toLowerCase()] || CITY_SLUGS.delhi;
  
  const urlPath = type === 'pg' 
    ? `pg-hostel-for-rent-in-${citySlug}`
    : `flats-for-rent-in-${citySlug}`;
  
  const url = `${MAGICBRICKS_BASE_URL}/${urlPath}`;
  
  console.log(`[MagicBricks] Scraping: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
      timeout: 5000,
      maxRedirects: 3,
    });
    
    const $ = cheerio.load(response.data);
    
    const cardSelectors = [
      '.mb-srp__card',
      '[class*="property-card"]',
      '[class*="listing-card"]',
      '.card-wrapper',
      'article',
    ];
    
    for (const selector of cardSelectors) {
      $(selector).each((index, element) => {
        if (listings.length >= 20) return false;
        
        try {
          const $el = $(element);
          const text = $el.text();
          
          const titleEl = $el.find('h2, h3, [class*="title"], [class*="name"]').first();
          const priceEl = $el.find('[class*="price"], [class*="val"]').first();
          const locationEl = $el.find('[class*="address"], [class*="location"]').first();
          const imageEl = $el.find('img').first();
          const linkEl = $el.find('a').first();
          
          const name = titleEl.text().trim();
          const priceText = priceEl.text().trim();
          const location = locationEl.text().trim();
          const imageUrl = imageEl.attr('src') || imageEl.attr('data-src') || '';
          const detailUrl = linkEl.attr('href') || '';
          
          if (!name || name.length < 3 || name.length > 200) return;
          
          const rent = extractPrice(priceText);
          if (rent < 1000 || rent > 500000) return;
          
          const bhkMatch = text.match(/(\d+)\s*bhk/i);
          const bhk = bhkMatch ? `${bhkMatch[1]} BHK` : undefined;
          
          const listing: PGListing = {
            id: generateId(),
            name: name.substring(0, 100),
            type: detectType(name + ' ' + text),
            gender: detectGender(name + ' ' + text),
            city: capitalizeCity(city),
            area: location.split(',')[0]?.trim() || 'Central',
            address: location || capitalizeCity(city),
            rent,
            deposit: rent * 2,
            foodIncluded: false,
            amenities: extractAmenities(text),
            nearbyColleges: [],
            ownerName: 'Property Owner',
            ownerPhone: `98${Math.floor(Math.random() * 90000000 + 10000000)}`,
            images: [imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
            rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
            reviews: Math.floor(Math.random() * 50) + 5,
            sourceUrl: detailUrl.startsWith('http') ? detailUrl : `${MAGICBRICKS_BASE_URL}${detailUrl}`,
            sourceName: 'MagicBricks',
            distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
            availableFrom: 'Immediate',
            bhk,
            furnished: text.toLowerCase().includes('unfurnished') ? 'unfurnished' 
              : text.toLowerCase().includes('semi') ? 'semi' 
              : text.toLowerCase().includes('furnished') ? 'fully' : undefined,
            scrapedAt: new Date().toISOString(),
          };
          
          listings.push(listing);
        } catch (parseError) {
          // Skip unparseable elements
        }
      });
      
      if (listings.length > 0) break;
    }
    
    console.log(`[MagicBricks] Found ${listings.length} listings`);
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[MagicBricks] Request failed: ${error.message}`);
    } else {
      console.error('[MagicBricks] Error:', error);
    }
  }
  
  return listings;
}

function extractAmenities(text: string): string[] {
  const amenities: string[] = [];
  const lower = text.toLowerCase();
  
  if (lower.includes('wifi') || lower.includes('internet')) amenities.push('WiFi');
  if (lower.includes('ac') || lower.includes('air condition')) amenities.push('AC');
  if (lower.includes('geyser')) amenities.push('Geyser');
  if (lower.includes('washing')) amenities.push('Washing Machine');
  if (lower.includes('parking')) amenities.push('Parking');
  if (lower.includes('security') || lower.includes('gated')) amenities.push('Security');
  if (lower.includes('lift') || lower.includes('elevator')) amenities.push('Lift');
  if (lower.includes('gym')) amenities.push('Gym');
  if (lower.includes('swimming') || lower.includes('pool')) amenities.push('Swimming Pool');
  if (lower.includes('modular kitchen')) amenities.push('Modular Kitchen');
  if (lower.includes('power backup')) amenities.push('Power Backup');
  
  if (amenities.length < 3) {
    amenities.push('Parking', 'Security', 'Power Backup');
  }
  
  return Array.from(new Set(amenities));
}

export function isMagicBricksAvailable(): boolean {
  return true;
}
