import { City } from '@/types';

export const cities: City[] = [
  {
    name: 'Delhi',
    slug: 'delhi',
    areas: ['North Campus', 'South Campus', 'Dwarka', 'Rohini', 'Laxmi Nagar', 'Karol Bagh', 'Rajouri Garden', 'Pitampura', 'Janakpuri', 'Kalkaji'],
    colleges: ['Delhi University', 'JNU', 'Jamia Millia Islamia', 'IP University', 'DTU', 'NSIT', 'Lady Shri Ram College', 'St. Stephens College', 'Hindu College', 'Miranda House']
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    areas: ['Andheri', 'Powai', 'Dadar', 'Churchgate', 'Bandra', 'Vile Parle', 'Goregaon', 'Malad', 'Thane', 'Navi Mumbai'],
    colleges: ['IIT Bombay', 'Mumbai University', 'TISS', 'NMIMS', 'St. Xaviers College', 'Jai Hind College', 'KC College', 'Mithibai College', 'VJTI', 'SPIT']
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    areas: ['Koramangala', 'HSR Layout', 'BTM Layout', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'JP Nagar', 'Jayanagar', 'Malleshwaram'],
    colleges: ['IISc', 'Christ University', 'Bangalore University', 'RV College', 'PES University', 'BMS College', 'Mount Carmel College', 'St. Josephs College', 'Jain University', 'NMIT']
  },
  {
    name: 'Pune',
    slug: 'pune',
    areas: ['Kothrud', 'Shivajinagar', 'Viman Nagar', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh', 'Hadapsar', 'Koregaon Park', 'Camp'],
    colleges: ['COEP', 'Fergusson College', 'Symbiosis', 'Pune University', 'MIT Pune', 'PICT', 'VIT Pune', 'SCMHRD', 'Bharati Vidyapeeth', 'Deccan College']
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    areas: ['Ameerpet', 'Kukatpally', 'Madhapur', 'Hitech City', 'Gachibowli', 'Secunderabad', 'Begumpet', 'Dilsukhnagar', 'Chaitanyapuri', 'Kondapur'],
    colleges: ['University of Hyderabad', 'IIIT Hyderabad', 'Osmania University', 'BITS Hyderabad', 'CBIT', 'VNR VJIET', 'Chaitanya Bharathi', 'JNTU Hyderabad', 'Gitam University', 'St. Marys College']
  }
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug);
}

export function getAllAreas(): string[] {
  return cities.flatMap(city => city.areas);
}

export function getAllColleges(): string[] {
  return cities.flatMap(city => city.colleges);
}
