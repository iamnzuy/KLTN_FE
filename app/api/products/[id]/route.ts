import { NextRequest, NextResponse } from 'next/server';
import { enrichProductWithMockImage } from '@/lib/image-utils';
import { BACKEND_URL } from '../../_utils/backend';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/products/${id}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch product' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich product with mock image
    if (data) {
      data = enrichProductWithMockImage(data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Product details API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

