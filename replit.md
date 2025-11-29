# PG & Hostel Finder - Student Accommodation Platform

## Overview

A mobile-first Next.js web application designed to help students and bachelors find PG (Paying Guest) accommodations, hostels, and rental flats across major Indian cities. The platform aggregates property listings through web scraping (currently simulated) from multiple Indian property portals including NoBroker, MagicBricks, 99acres, Housing.com, NestAway, and Zolo.

The application provides search, filtering, comparison, and bookmarking capabilities to help users find suitable accommodation based on location, price, amenities, and proximity to educational institutions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Language**
- **Next.js 14+** with App Router for server-side rendering and optimal performance
- **TypeScript** for type safety and enhanced developer experience
- **React 18.3** for component-based UI development

**Styling System**
- **Tailwind CSS** for utility-first styling with custom color palette
- Custom design tokens for primary (blue) and accent (purple) colors
- Mobile-first responsive design approach
- Custom CSS utilities for animations and shadows

**Component Structure**
- Reusable UI components for listings, cards, filters, and navigation
- Client-side components with 'use client' directive for interactivity
- Shared components: Header, BottomNav, SearchBar, FilterModal, ListingCard, CityCard
- Type-safe props using TypeScript interfaces

**State Management**
- React hooks (useState, useEffect) for local component state
- URL-based state management via Next.js searchParams for filters
- In-memory caching for listing data through listingsStore

### Backend Architecture

**API Routes**
- `/api/listings` - Returns filtered and sorted property listings
- `/api/listing/[id]` - Fetches individual listing details
- `/api/scrape` - Endpoint for triggering data scraping operations

**Data Layer**
- In-memory data store (Map-based) for listing caching
- Simulated scraping system generating realistic property data
- City-based data partitioning for efficient filtering

**Data Generation Strategy**
- Mock data generator mimicking real scraper output
- Support for 5 major cities: Delhi, Mumbai, Bangalore, Pune, Hyderabad
- Property types: PG, Hostel, Flat with distinct characteristics
- Gender-based filtering: Girls, Boys, Co-ed, Family
- Dynamic pricing based on city and area demographics

### Routing & Navigation

**Page Structure**
- `/` - Home page with city selection and quick filters
- `/search` - Search results with advanced filtering
- `/listing/[id]` - Individual listing detail page
- `/compare` - Rent comparison across areas
- `/saved` - Bookmarked listings (placeholder)

**Navigation Patterns**
- Bottom navigation bar for mobile-first experience
- Header with hamburger menu for additional options
- Deep linking support through URL parameters

### Search & Filter System

**Filter Capabilities**
- City and area-based location filtering
- Property type (PG/Hostel/Flat) selection
- Gender preference filtering
- Price range (min/max rent) filtering
- Food inclusion preference
- Proximity to colleges/universities
- Furnishing status (fully/semi/unfurnished)
- Occupancy type (single/double/triple/shared)

**Sorting Options**
- Price (low to high / high to low)
- Rating
- Distance from location

### Image Handling

**Configuration**
- Next.js Image component with Unsplash CDN support
- Unoptimized images for simplified deployment
- Fallback images for error states
- Lazy loading for performance optimization

### Performance Optimizations

**Caching Strategy**
- No-cache headers for dynamic content freshness
- In-memory listing cache to reduce regeneration
- City-based data partitioning for faster queries

**Code Splitting**
- Automatic Next.js code splitting
- Dynamic imports via Suspense boundaries
- Client-side only components marked explicitly

## External Dependencies

### Third-Party Services

**Content Delivery**
- **Unsplash** - Property and city images via CDN
- **Placeholder.com** - Fallback image service

**Data Sources (Simulated)**
The application currently simulates scraping from:
- NoBroker (nobroker.in)
- MagicBricks (magicbricks.com)
- 99acres (99acres.com)
- Housing.com (housing.com)
- NestAway (nestaway.com)
- Zolo (zolostays.com)

*Note: Actual web scraping implementation would require proper API integration, rate limiting, and compliance with Terms of Service*

### NPM Packages

**Core Framework**
- `next` (14.2.5) - React framework
- `react` (18.3.1) - UI library
- `react-dom` (18.3.1) - React DOM renderer

**HTTP & Data Fetching**
- `axios` (1.7.2) - HTTP client for API requests
- `cheerio` (1.0.0-rc.12) - HTML parsing for web scraping

**UI & Styling**
- `tailwindcss` (3.4.4) - Utility-first CSS framework
- `lucide-react` (0.400.0) - Icon library
- `clsx` (2.1.1) - Conditional className utility
- `tailwind-merge` (2.3.0) - Tailwind class merging utility

**Development Tools**
- `typescript` (5.5.2) - Type system
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions
- `autoprefixer` (10.4.19) - CSS vendor prefixing
- `postcss` (8.4.38) - CSS transformation

### Deployment Configuration

**Platforms**
- Vercel (primary) with Mumbai region (bom1)
- Replit-compatible with custom port configuration (5000)

**Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled

### Data Models

**Core Types**
- `PGListing` - Property listing with 20+ fields
- `SearchFilters` - Multi-dimensional filter criteria
- `RentComparison` - Area-wise rental statistics
- `City` - City metadata with areas and colleges