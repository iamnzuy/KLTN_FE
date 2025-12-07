// /api/auth/verify-reset-token.ts
import { NextResponse } from 'next/server';

const disabledResponse = NextResponse.json(
  {
    message:
      'Password reset verification is unavailable because Prisma has been removed from this deployment.',
  },
  { status: 503 },
);

export async function POST() {
  return disabledResponse;
}
