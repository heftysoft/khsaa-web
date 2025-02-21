import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const users = await db.user.findMany({
      include: {
        profile: {
          select: {
            passingYear: true,
            occupation: true,
          },
        },
        _count: {
          select: {
            memberships: true,
          },
        },
        memberships: {
          where: {
            status: 'ACTIVE',
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      passingYear: user.profile?.passingYear,
      occupation: user.profile?.occupation,
      membershipStatus: user.memberships[0]?.status || 'NONE',
      createdAt: user.createdAt,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('[USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}