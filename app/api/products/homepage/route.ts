import { NextRequest, NextResponse } from 'next/server';
import { enrichProductsWithMockImages } from '@/lib/image-utils';
import { BACKEND_URL } from '../../_utils/backend';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all query parameters
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/products/homepage${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch homepage products' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich all product arrays with mock images
    if (data) {
      const enrichedData = { ...data };
      
      // Enrich each product array
      if (data.specialOffers && Array.isArray(data.specialOffers)) {
        enrichedData.specialOffers = enrichProductsWithMockImages(data.specialOffers);
      }
      
      if (data.newArrivals && Array.isArray(data.newArrivals)) {
        enrichedData.newArrivals = enrichProductsWithMockImages(data.newArrivals);
      }
      
      if (data.popularProducts && Array.isArray(data.popularProducts)) {
        enrichedData.popularProducts = enrichProductsWithMockImages(data.popularProducts);
      }
      
      if (data.limitedDeals && Array.isArray(data.limitedDeals)) {
        enrichedData.limitedDeals = enrichProductsWithMockImages(data.limitedDeals);
      }
      
      data = enrichedData;
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Homepage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

