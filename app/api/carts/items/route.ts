import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/auth-options';
import { enrichProductWithMockImage } from '@/lib/image-utils';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const token = request.headers.get('Authorization');

    const response = await fetch(`${BACKEND_URL}/carts/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to add item to cart' },
        { status: response.status }
      );
    }

    let data = await response.json();
    
    // Enrich product in cart item response
    if (data && data.product) {
      data = {
        ...data,
        product: enrichProductWithMockImage(data.product)
      };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cart items API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = request.headers.get('Authorization');

    const response = await fetch(`${BACKEND_URL}/carts/items`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || '',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: error || 'Failed to clear cart' },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Clear cart API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

