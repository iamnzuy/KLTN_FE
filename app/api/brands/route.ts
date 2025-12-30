import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '../_utils/backend';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Failed to fetch brands' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Brands API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

