import { NextRequest, NextResponse } from 'next/server';
import { enrichProductWithMockImage } from '@/lib/image-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const body = await request.json();
    
    const url = `${BACKEND_URL}/products/filter${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to filter products' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich products with mock images
    if (data) {
      // Handle paginated response
      if (data.content && Array.isArray(data.content)) {
        data = {
          ...data,
          content: data.content.map((product: any) => enrichProductWithMockImage(product))
        };
      }
      // Handle array response
      else if (Array.isArray(data)) {
        data = data.map((product: any) => enrichProductWithMockImage(product));
      }
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Filter API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

