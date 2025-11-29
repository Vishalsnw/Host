# PG & Hostel Finder - Student Accommodation App

## Overview
A mobile-first Next.js web application for finding PG (Paying Guest) accommodations and hostels across major Indian cities. The app features a professional Android-like UI design with location-based search, advanced filters, rent comparison, and direct contact options.

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Real Data API**: Xotelo (TripAdvisor data)
- **Fallback**: Mock data generator
- **Deployment**: Vercel-ready

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── listings/route.ts    # Listings API endpoint (real + fallback)
│   │   └── scrape/route.ts      # Scraping API endpoint
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
│   ├── ListingCard.tsx          # PG listing card
│   ├── QuickFilter.tsx          # Quick filter chips
│   └── SearchBar.tsx            # Search input component
├── lib/
│   ├── cities.ts                # City data and utilities
│   ├── listingsStore.ts         # Listings cache store
│   ├── mockData.ts              # Mock data generator (fallback)
│   ├── utils.ts                 # Utility functions
│   └── xotelo.ts                # Xotelo API integration (real data)
└── types/
    └── index.ts                 # TypeScript interfaces
```

## Key Features
1. **Mobile-First Design**: Android app-like UI with bottom navigation
2. **Real Data Integration**: Live accommodation data from TripAdvisor via Xotelo API
3. **City-Based Search**: Delhi, Mumbai, Bangalore, Pune, Hyderabad
4. **Advanced Filters**: Gender preference, food options, price range, college proximity
5. **Rent Comparison**: Area-wise rent analysis with trends
6. **Contact Options**: Click-to-call and WhatsApp integration
7. **Source Attribution**: Direct links to original TripAdvisor listings
8. **Data Source Indicator**: Shows "Live Data" or "Sample Data" badge

## Data Sources
- **Primary**: Xotelo API (free TripAdvisor data aggregator)
- **Fallback**: Mock data generator when real data is unavailable
- **Supported Cities**:
  - Delhi (g304551)
  - Mumbai (g304554)
  - Bangalore (g297628)
  - Pune (g297654)
  - Hyderabad (g297586)

## Running Locally
```bash
npm install
npm run dev
```

## API Endpoints
- `GET /api/listings?city=delhi` - Fetch real listings for a city
- `GET /api/listings?city=delhi&real=false` - Force mock data
- `GET /api/scrape` - Scrape accommodation websites

## Environment Variables
No environment variables required for basic functionality.

## Recent Changes
- Initial project setup (Nov 29, 2025)
- Created mobile-first UI components
- Implemented search, filter, and comparison features
- Added API routes for listings and scraping
- Configured for Vercel deployment
- **Added Xotelo API integration for real accommodation data** (Nov 29, 2025)
- Added data source indicator (Live Data / Sample Data)
- Improved error handling and fallback logic
