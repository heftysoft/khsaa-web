import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { MembershipType, BillingPeriod } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params;
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, type, period, amount, description, benefits } = body;

    const tier = await db.membershipTier.update({
      where: {
        id: tierId,
      },
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
    console.error('[MEMBERSHIP_TIER_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params;
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tier = await db.membershipTier.delete({
      where: {
        id: tierId,
      },
    });

    return NextResponse.json(tier);
  } catch (error) {
    console.error('[MEMBERSHIP_TIER_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tierId: string }> }
) {
  const { tierId } = await params;
  try {
    const tier = await db.membershipTier.findUnique({
      where: {
        id: tierId,
      },
    });

    return NextResponse.json(tier);
  } catch (error) {
    console.error('[MEMBERSHIP_TIER_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}