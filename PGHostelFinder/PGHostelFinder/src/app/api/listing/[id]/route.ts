import { NextResponse } from 'next/server';
import { getListingById, getListings } from '@/lib/listingsStore';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  let listing = getListingById(id);
  
  if (!listing) {
    getListings('delhi');
    listing = getListingById(id);
  }
  
  if (!listing) {
    return NextResponse.json({
      success: false,
      error: 'Listing not found'
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    listing
  });
}
