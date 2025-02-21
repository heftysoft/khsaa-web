import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alumni = await db.user.findMany({
      include: {
        profile: {
          select: {
            occupation: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(alumni);
  } catch (error) {
    console.error('[ALUMNI_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}