import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const currentMembership = await db.membership.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tier: true,
      },
    });

    if (!currentMembership) {
      return new NextResponse('No previous membership found', { status: 400 });
    }

    const startDate = new Date();
    let endDate: Date | undefined;

    if (currentMembership.tier.type !== 'LIFETIME_DONOR') {
      endDate = new Date();
      switch (currentMembership.tier.period) {
        case 'WEEKLY':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'MONTHLY':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'YEARLY':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
    }

    const membership = await db.membership.create({
      data: {
        amount: currentMembership.tier.amount,
        startDate,
        endDate,
        status: 'ACTIVE',
        user: {
          connect: {
            id: session.user.id
          }
        },
        tier: {
          connect: {
            id: currentMembership.tier.id
          }
        }
      },
      include: {
        tier: true,
      },
    });

    await db.notification.create({
      data: {
        title: 'Membership Renewed',
        message: `Your ${currentMembership.tier.name} membership has been renewed${
          endDate ? ` and will be valid until ${endDate.toLocaleDateString()}.` : '.'
        }`,
        type: 'MEMBERSHIP',
        user: {
          connect: {
            id: session.user.id
          }
        }
      },
    });

    return NextResponse.json(membership);
  } catch (error) {
    console.error('[MEMBERSHIP_RENEW]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}