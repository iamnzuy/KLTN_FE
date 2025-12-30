import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession, type Session } from 'next-auth';
import authOptions from '../../../auth/[...nextauth]/auth-options';
import { enrichProductWithMockImage } from '@/lib/image-utils';
import { BACKEND_URL } from '../../../_utils/backend';

type SessionWithToken = Session & { accessToken?: string };

async function resolveAccessToken() {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('auth_token')?.value;
  if (cookieToken) return cookieToken;

  const session = await getServerSession(authOptions);
  return (session as SessionWithToken | null)?.accessToken;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await resolveAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/products/wishlist/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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

