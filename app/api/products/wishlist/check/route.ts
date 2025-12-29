import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession, type Session } from 'next-auth';
import authOptions from '../../../auth/[...nextauth]/auth-options';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
      return NextResponse.json(false);
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/products/wishlist/check${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(false);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Wishlist check API error:', error);
    return NextResponse.json(false);
  }
}

