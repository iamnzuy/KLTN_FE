import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/auth-options';
import { enrichProductWithMockImage } from '@/lib/image-utils';
import { BACKEND_URL } from '../_utils/backend';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/carts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to fetch cart' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich cart items with mock images
    if (data && data.items && Array.isArray(data.items)) {
      data = {
        ...data,
        items: data.items.map((item: any) => ({
          ...item,
          product: item.product ? enrichProductWithMockImage(item.product) : item.product
        }))
      };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cart API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
