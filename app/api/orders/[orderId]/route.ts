import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { enrichProductWithMockImage } from '@/lib/image-utils';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

async function buildAuthHeader(request: NextRequest) {
  const header = request.headers.get('Authorization');
  if (header) return header;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token ? `Bearer ${token}` : undefined;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const authHeader = await buildAuthHeader(request);

  if (!authHeader) {
    return unauthorized();
  }

  const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    try {
      return NextResponse.json(JSON.parse(errorText || '{}'), {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        { error: errorText || 'Failed to fetch order' },
        { status: response.status },
      );
    }
  }

  let data = await response.json();
  
  // Enrich order items with mock images
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
}

