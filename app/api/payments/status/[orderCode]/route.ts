import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '../../../_utils/backend';

// Build auth header if available, but do not block when missing
async function buildAuthHeader(request: NextRequest) {
  const header = request.headers.get('Authorization');
  if (header) return header;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token ? `Bearer ${token}` : undefined;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderCode: string }> },
) {
  const { orderCode } = await context.params;
  const authHeader = await buildAuthHeader(request);

  // Allow public access; attach Authorization only when present
  const response = await fetch(`${BACKEND_URL}/payments/status/${orderCode}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
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
        { error: errorText || 'Failed to fetch payment status' },
        { status: response.status },
      );
    }
  }

  const data = await response.json();
  return NextResponse.json(data);
}

