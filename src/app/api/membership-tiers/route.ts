import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { MembershipType, BillingPeriod } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, type, period, amount, description, benefits } = body;

    const tier = await db.membershipTier.create({
      data: {
        name,
        type: type as MembershipType,
        period: period as BillingPeriod,
        amount,
        description,
        benefits,
      },
    });

    return NextResponse.json(tier);
  } catch (error) {
    console.error('[MEMBERSHIP_TIERS_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const tiers = await db.membershipTier.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tiers);
  } catch (error) {
    console.error('[MEMBERSHIP_TIERS_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}