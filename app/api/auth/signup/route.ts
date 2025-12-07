// pages/api/auth/signup.ts
import { NextResponse } from 'next/server';

const disabledResponse = NextResponse.json(
  {
    message:
      'User registration is unavailable because database integrations have been removed from this deployment.',
  },
  { status: 503 },
);

export async function POST() {
  return disabledResponse;
}
