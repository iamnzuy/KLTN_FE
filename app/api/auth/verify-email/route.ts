import { NextResponse } from 'next/server';

const disabledResponse = NextResponse.json(
  {
    message:
      'Email verification workflows are disabled because Prisma has been removed from this deployment.',
  },
  { status: 503 },
);

export async function POST() {
  return disabledResponse;
}
