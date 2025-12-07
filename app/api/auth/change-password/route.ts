import { NextResponse } from 'next/server';

const disabledResponse = NextResponse.json(
  {
    message:
      'Password change is currently disabled because database integrations have been removed from this deployment.',
  },
  { status: 503 },
);

export async function POST() {
  return disabledResponse;
}
