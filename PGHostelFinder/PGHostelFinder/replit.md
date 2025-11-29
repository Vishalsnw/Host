# PG, Hostel & Flat Finder - Student & Bachelor Accommodation App

## Overview
A mobile-first Next.js web application for finding PG (Paying Guest) accommodations, hostels, and rented flats for students and bachelors across major Indian cities. The app features a professional Android-like UI design with location-based search, advanced filters, rent comparison, and direct contact options.

## Data Source
**Web Scraping Based**: The app scrapes data from multiple Indian property listing sites including:
- NoBroker
- MagicBricks
- 99acres
- Housing.com
- NestAway
- Zolo

Note: Currently uses simulated scraped data. For production, implement actual web scrapers with proper rate limiting and Terms of Service compliance.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Source**: Web Scraping (simulated)
- **Deployment**: Vercel/Replit-ready

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── listings/route.ts    # Listings API (scraped data)
│   │   ├── listing/[id]/route.ts # Single listing API
│   │   └── scrape/route.ts      # Scraping endpoint
│   ├── compare/page.tsx         # Rent comparison page
│   ├── listing/[id]/page.tsx    # Listing detail page
│   ├── saved/page.tsx           # Saved listings page
│   ├── search/page.tsx          # Search results page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── BottomNav.tsx            # Mobile bottom navigation
│   ├── CityCard.tsx             # City selection card
│   ├── FilterModal.tsx          # Filter modal component
│   ├── Header.tsx               # App header
│   ├── ListingCard.tsx          # Listing card (PG/Hostel/Flat)
│   ├── QuickFilter.tsx          # Quick filter chips
│   └── SearchBar.tsx            # Search input component
├── lib/
│   ├── cities.ts                # City data and utilities
│   ├── mockData.ts              # Mock data generator (fallback)
│   ├── scrapers/
│   │   └── index.ts             # Scraper configuration & generator
│   ├── utils.ts                 # Utility functions
│   └── listingsStore.ts         # Listings cache store
└── types/
    └── index.ts                 # TypeScript interfaces
```

## Key Features
1. **Mobile-First Design**: Android app-like UI with bottom navigation
2. **Three Property Types**: PGs, Hostels, and Rented Flats
3. **City-Based Search**: Delhi, Mumbai, Bangalore, Pune, Hyderabad
4. **Advanced Filters**: 
   - Gender preference (Girls/Boys/Co-ed/Family)
   - Food included option
   - Price range
   - Furnished status (for flats)
   - Near college
5. **Rent Comparison**: Area-wise rent analysis with trends
6. **Contact Options**: Click-to-call and WhatsApp integration
7. **Source Attribution**: Shows which property site data came from

## Property Types
- **PG (Paying Guest)**: Shared accommodation with landlord supervision
- **Hostel**: Budget-friendly dormitory style accommodation
- **Flat**: Independent rented apartments (1BHK, 2BHK, 3BHK, Studio)

## Running Locally
```bash
npm install
npm run dev
```
Access at: http://localhost:5000

## API Endpoints
- `GET /api/listings?city=delhi` - Fetch listings for a city
- `GET /api/listings?type=flat&city=mumbai` - Filter by property type
- `GET /api/listings?gender=girls&food=true` - Filter by preferences
- `GET /api/scrape?city=bangalore&type=pg` - Trigger scraping
- `POST /api/scrape` - Scrape with custom parameters

## Environment Variables
No environment variables required for basic functionality.

## Recent Changes
- Removed Xotelo API integration (Nov 29, 2025)
- Implemented web scraping architecture
- Added 'Flat' property type for rented apartments
- Added 'Family' gender option for flats
- Added 'Furnished' filter for flats
- Updated UI components to support all property types
- Added more property listing sources
- Enhanced filter options

## User Preferences
- Mobile-first design approach
- Clean, modern UI with blue primary color scheme
- Simple navigation with bottom tab bar
