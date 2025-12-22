import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const DEFAULT_PAGE = '0';
const DEFAULT_SIZE = '24';
const DEFAULT_SORT_BY = 'createdAt';
const DEFAULT_SORT_DIR = 'desc';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

async function forwardRequest(
  url: string,
  init: RequestInit,
): Promise<NextResponse> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Failed to reach backend service';
    return NextResponse.json(
      { error: 'Upstream request failed', details: message },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    try {
      return NextResponse.json(JSON.parse(errorText || '{}'), {
        status: response.status,
      });
    } catch {
      return NextResponse.json(
        { error: errorText || 'Failed to process request' },
        { status: response.status },
      );
    }
  }

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

async function buildAuthHeader(request: NextRequest) {
  const header = request.headers.get('Authorization');
  if (header) return header;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  return token ? `Bearer ${token}` : undefined;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? DEFAULT_PAGE;
  const size = searchParams.get('size') ?? DEFAULT_SIZE;
  const sortBy = searchParams.get('sortBy') ?? DEFAULT_SORT_BY;
  const sortDir = searchParams.get('sortDir') ?? DEFAULT_SORT_DIR;

  const query = new URLSearchParams({
    page,
    size,
    sortBy,
    sortDir,
  });
  const url = `${BACKEND_URL}/api/orders?${query.toString()}`;
  const authHeader = await buildAuthHeader(request);

  if (!authHeader) {
    return unauthorized();
  }

  return forwardRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const authHeader = await buildAuthHeader(request);

  if (!authHeader) {
    return unauthorized();
  }

  return forwardRequest(`${BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body,
  });
}

