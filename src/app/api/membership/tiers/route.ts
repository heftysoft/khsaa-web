import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tiers = await db.membershipTier.findMany({
      orderBy: {
        amount: 'asc',
      },
    });

    return NextResponse.json(tiers);
  } catch (error) {
    console.error('[MEMBERSHIP_TIERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}