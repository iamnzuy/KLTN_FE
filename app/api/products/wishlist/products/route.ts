import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../../auth/[...nextauth]/auth-options';
import { enrichProductWithMockImage } from '@/lib/image-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/products/wishlist/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch wishlist products' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich wishlist products with mock images
    if (data && Array.isArray(data)) {
      data = data.map((product: any) => enrichProductWithMockImage(product));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist products API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

