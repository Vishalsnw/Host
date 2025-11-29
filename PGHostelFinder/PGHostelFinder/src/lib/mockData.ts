import { PGListing } from '@/types';
import { generateId } from './utils';

const sampleImages = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
];

const amenitiesList = [
  'WiFi', 'AC', 'Geyser', 'Washing Machine', 'TV', 'Fridge', 'Power Backup',
  'Parking', 'Security', 'CCTV', 'Lift', 'Gym', 'Study Room', 'Kitchen Access'
];

function getRandomAmenities(): string[] {
  const count = Math.floor(Math.random() * 6) + 3;
  const shuffled = [...amenitiesList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomImage(): string {
  return sampleImages[Math.floor(Math.random() * sampleImages.length)];
}

export function generateMockListings(city: string, area?: string, count: number = 20): PGListing[] {
  const cityData: Record<string, { areas: string[], colleges: string[] }> = {
    delhi: {
      areas: ['North Campus', 'South Campus', 'Dwarka', 'Rohini', 'Laxmi Nagar', 'Karol Bagh'],
      colleges: ['Delhi University', 'JNU', 'DTU', 'IP University', 'Lady Shri Ram College']
    },
    mumbai: {
      areas: ['Andheri', 'Powai', 'Dadar', 'Churchgate', 'Bandra', 'Vile Parle'],
      colleges: ['IIT Bombay', 'Mumbai University', 'TISS', 'NMIMS', 'St. Xaviers College']
    },
    bangalore: {
      areas: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'Whitefield', 'Electronic City'],
      colleges: ['IISc', 'Christ University', 'RV College', 'PES University', 'BMS College']
    },
    pune: {
      areas: ['Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hinjewadi', 'Wakad', 'Baner'],
      colleges: ['COEP', 'Fergusson College', 'Symbiosis', 'Pune University', 'MIT Pune']
    },
    hyderabad: {
      areas: ['Ameerpet', 'Kukatpally', 'Madhapur', 'Hitech City', 'Gachibowli', 'Secunderabad'],
      colleges: ['University of Hyderabad', 'IIIT Hyderabad', 'Osmania University', 'BITS Hyderabad', 'CBIT']
    }
  };

  const cityInfo = cityData[city.toLowerCase()] || cityData.delhi;
  const areas = area ? [area] : cityInfo.areas;
  const genders: ('girls' | 'boys' | 'coed')[] = ['girls', 'boys', 'coed'];
  const types: ('pg' | 'hostel')[] = ['pg', 'hostel'];
  const occupancies: ('single' | 'double' | 'triple' | 'shared')[] = ['single', 'double', 'triple', 'shared'];
  
  const ownerNames = [
    'Sharma Ji', 'Patel Bhai', 'Mrs. Gupta', 'Mr. Singh', 'Reddy Sir',
    'Mrs. Iyer', 'Khan Sahab', 'Mrs. Desai', 'Mr. Verma', 'Mrs. Nair'
  ];

  const pgNames = [
    'Sunrise PG', 'Student Haven', 'Campus View PG', 'Green Valley Hostel',
    'Elite Stay', 'Home Away PG', 'Scholar\'s Den', 'City Light PG',
    'Royal Residency', 'Dream Stay', 'Comfort Zone PG', 'Study Nest',
    'Urban Living PG', 'Prime Location Hostel', 'Safe Haven PG'
  ];

  const listings: PGListing[] = [];

  for (let i = 0; i < count; i++) {
    const selectedArea = areas[Math.floor(Math.random() * areas.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const foodIncluded = Math.random() > 0.4;
    const baseRent = type === 'hostel' ? 4000 : 6000;
    const rent = baseRent + Math.floor(Math.random() * 12000);
    
    listings.push({
      id: generateId(),
      name: `${pgNames[Math.floor(Math.random() * pgNames.length)]} - ${selectedArea}`,
      type,
      gender,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      area: selectedArea,
      address: `${Math.floor(Math.random() * 200) + 1}, ${selectedArea}, ${city.charAt(0).toUpperCase() + city.slice(1)}`,
      rent,
      deposit: rent * 2,
      foodIncluded,
      amenities: getRandomAmenities(),
      nearbyColleges: cityInfo.colleges.slice(0, Math.floor(Math.random() * 3) + 1),
      ownerName: ownerNames[Math.floor(Math.random() * ownerNames.length)],
      ownerPhone: `98${Math.floor(Math.random() * 90000000 + 10000000)}`,
      images: [getRandomImage(), getRandomImage()],
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 50) + 5,
      sourceUrl: 'https://example.com/listing',
      sourceName: ['NoBroker', 'MagicBricks', '99acres', 'Housing.com'][Math.floor(Math.random() * 4)],
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      availableFrom: 'Immediate',
      occupancy: occupancies[Math.floor(Math.random() * occupancies.length)]
    });
  }

  return listings;
}

export function calculateRentComparison(listings: PGListing[]) {
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
